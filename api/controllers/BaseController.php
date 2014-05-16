<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of BaseController
 *
 * @author Remi
 */
class BaseController extends \Phalcon\Mvc\Controller {
    //put your code here
    
    protected $_account;
    private $short_controller_name;
    
    private $validToken = true;


    public function onConstruct() {
        $this->short_controller_name = str_replace("Controller", "", get_class($this));
        
        $token = null;
        
        if($this->request->isPost()) {
            $token = $this->request->getPost("_token");
        } else {
            $token = $this->request->get("_token");
        }
        if(!isset($token)) {
            $data = $this->getRequestData();
            $token = (isset($data['_token']))? $data['_token'] : null;
        }
        if(isset($token)) {
            // Secure connection
//            if(!$this->request->isSecureRequest()) {
//                $this->response->setStatusCode(400, "Insecure connection request")->send();
//                return;
//            }
            
            $this->_account = Account::findFirst(array(
                "conditions" => "token = ?1",
                "bind"       => array(1 => $token)
            ));
            if(!$this->_account) {
                $this->response->setStatusCode(404, "Token not found");
                $this->validToken = false;
            }
        }
    }
    
    public function checkErrors($obj) {
        $errors = array();
        foreach ($obj->getMessages() as $message) {
            $errors[] = array('message' => $message->getMessage(), 'field' => $message->getField());
        }
        $this->response->setStatusCode(400, "Invalid value(s) given");
        return $errors;
    }
    
    public function methodConstructor($method) {
        //if(!$this->response->isSent()) {
        if($this->validToken) {
            if(method_exists($this, $method)){
                if($this->checkAuth($method)) {
                    $this->response->setContentType('application/json');
                    $this->$method();
                }
            } else {
                $this->response->setStatusCode(404, "Method not found/implemented");
            }
            return $this->response;
        }
    }
    
    public function checkAuth($method) {
        $userRole = ($this->_account) ? AccountLevel::findFirst($this->_account->accountlevel_id)->level : 'guest';
        $roles = include __DIR__.'/../config/roles.php';
        $roleSettings = $roles[$userRole];

        //$callers=debug_backtrace();

        $controller = $this->short_controller_name;
        //$function = $callers[1]['function'];

        if(isset($roleSettings['inheritRights'])) {
            $roleSettings['rights'] = $this->mergeInheritRights($roles, $roleSettings);
        }
        $rights = $roleSettings['rights'];
        
        if(isset($rights[$controller]) || $roleSettings['isAdmin']) {
            if($roleSettings['isAdmin'] || in_array($method, $rights[$controller])) {
                return true;
            }
        }

        $this->response->setStatusCode(401, "Unauthorized");
        
        return false;
    }
    
    private function mergeInheritRights($roles, $roleSettings) {
        $inheritRole = $roleSettings['inheritRights'];
        
        $inherit = $roles[$inheritRole];
        
        if(isset($inherit['inheritRights'])) {
            $inherit['rights'] = $this->mergeInheritRights($roles, $inherit);
        }
        
        return array_merge($inherit['rights'], $roleSettings['rights']);
    }
    
    // ---------------------------
    // DEFAULT CRUD FUNCTIONS
    // ---------------------------
    
    public function get() {
        $qStrData = $this->request->getQuery();
        $data = $this->baseGet($qStrData);
        if(isset($data))
            $this->response->setJsonContent($data);
    }
    
    protected function baseGet($qStrData) {
        $qStr = $qStrData;
        $valid = true;
        
        $calcFunctions = array('count','sum', 'average', 'maximum', 'minimum');
        $func = 'find';
        if(isset($qStr['calc'])) {
            if(in_array($qStr['calc'], $calcFunctions)) {
                $func = $qStr['calc'];
            } else {
                $valid = false;
                $this->response->setStatusCode(405, "Invalid calc method");
            }
            unset($qStr['calc']);
        } else if((isset($qStr['limit']) && $qStr['limit'] == 1) || (isset($qStr['id']))) {
            $func = 'findFirst';
            unset($qStr['limit']);
        }
        
        if($valid) {
            $result = $this->processQueryData($func, $qStr); /*call_user_func(array($this->short_controller_name, $func)); */
            if($result === false) return false;
            // TODO find and findFirst relations
            
            $data = array();
            switch($func) {
                case 'find':
                    foreach($result as $obj) {
                        $data[] = $obj;
                    }
                    break;
                case 'findFirst':
                    $data = $result;
                    break;
                default:
                    $data['result'] = $result;
                    break;
            }

//            $this->response->setJsonContent($data);
            return $data;
        }
        return null;
    }
    
    private function processQueryData($func, $config) {
        $arguments = array();
        $isSpecialCalc = ($func === 'sum' || $func === 'average' || $func === 'maximum' || $func === 'minimum');
        if(isset($config['id'])) {
            $arguments[] = $config['id'];
        } else {
            // Magic happens
            // Con args k:key v:value op:operator /* pre:prefixForValue app:appendForValue */ fc:frontCheck
            if(isset($config['con'])) { // Read condition arguments ex. con[]={k:name,v:henk,fc:OR}
                $conditions = array();
                foreach($config['con'] as $i => $condition) {
                    $conditions[$i] = json_decode($condition, true);
                }
                $params = array();
                $conditionStr = BaseModel::getCondition($conditions, $params);
                
                $arguments['conditions'] = $conditionStr;
                $arguments['bind'] = $params;
                var_dump($conditionStr);
                var_dump($params);
            }
            if(isset($config['order'])) { // CSV order arguments ex. name DESC, status
                $arguments['order'] = $config['order'];
            }
            if(isset($config['limit'])) {
                $arguments['limit'] = $config['limit'];
            }
            if(isset($config['group'])) {
                $arguments['group'] = $config['group'];
            }
            
            // Cache needed?
        }
        
        if($isSpecialCalc) {
            if(isset($config['col'])) {
                $arguments['column'] = $config['col'];
            } else {
                $this->response->setStatusCode(400, "Argument missing");
                $this->response->setJsonContent(array('message' => "'col' argument missing"));
                return false;
            }
        }
        //try {
            $result = call_user_func(array($this->short_controller_name, $func), (count($arguments) > 0) ? $arguments : null);
//        } catch(Exception $e) {
//            $this->response->setStatusCode(500, "Internal server error");
//            $this->response->setJsonContent(array('message' => $e->getMessage(), 'file' => $e->getFile(), 'line' => $e->getLine()));
//            return false;
//        }
        return $result;
    }
    
    public function post() {
        $data = $this->getRequestData();
        $messages = '';
        $id = $this->basePost($data, $messages);
        $this->response->setJsonContent(array('messages' => $messages, 'id' => $id));
    }
    
    protected function basePost($postData, &$messages) {
        $modelStr = $this->short_controller_name;
        $model = new $modelStr();
        $idProp = $model->getIdPropName(); /* call_user_func(array($this->short_controller_name,'getIdPropName')); */
        
//        $data = $this->getRequestData();
        $data = $postData;
        
        foreach($data as $key => $value) {
            $model->$key = $value;
        }

        $messages = '';
        $id = 0;

        if($model->create()) {
            $id = $model->$idProp;
            $this->response->setStatusCode(201, "Created");
        } else {
            $messages = $this->checkErrors($model);
            $id = -1;
        }

//        $this->response->setJsonContent(array('messages' => $messages, 'id' => $id));
        return $id;
    }
    
    public function put() {
        $data = $this->getRequestData();
        $messages = '';
        $model = $this->basePut($data, $messages);
        $this->response->setJsonContent(array('messages' => $messages, 'model' => $model));
    }
    
    protected function basePut($putData, &$messages) {
        $args = $putData;
        
        $model = call_user_func(array($this->short_controller_name, 'findFirst'),$args['id']);
        
        if($model) {
            unset($args['id']);
            foreach($args as $key => $value) {
                $model->$key = $value;
            }

            $messages = '';
            if(!$model->save()) {
                $messages = $this->checkErrors($model);
            }
//            $this->response->setJsonContent(array('messages' => $messages, 'model' => $model));
            return $model;
        } else {
            $this->response->setStatusCode(404, "Not found");
        }
        return null;
    }
    
    public function delete() {
        $data = $this->request->getJsonRawBody();
        $messages = '';
        $this->baseDelete($data, $messages);
        $this->response->setJsonContent(array('messages' => $messages));
    }
    
    protected function baseDelete($data, &$messages) {
        $args = $data;
        
        $model = call_user_func(array($this->short_controller_name, 'findFirst'),$args->id);
        
        if($model) {
            $messages = '';
            if(!$model->delete()) {
                $messages = $this->checkErrors($model);
            }
            $this->response->setStatusCode(204, "No content");
//            $this->response->setJsonContent(array('messages' => $messages));
        } else {
            $this->response->setStatusCode(404, "Not found");
        }
    }
    
    protected function getRequestData() {
        $data;
        switch($this->request->getHeader("CONTENT_TYPE")) {
            case 'application/x-www-form-urlencoded':
                $data = $this->request->getPost();
                break;
            default: // application/json
                $dataTmp = $this->request->getJsonRawBody();
                if(isset($dataTmp)) {
                    foreach($dataTmp as $key => $value) {
                        $data[$key] = $value;
                    }
                }
                break;
        }
        return (isset($data)) ? $data : array();
    }
    
}

?>
