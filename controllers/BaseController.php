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


    public function onConstruct() {
        $this->short_controller_name = str_replace("Controller", "", get_class($this));
        
        $token = null;
        
        if($this->request->isPost()) {
            $token = $this->request->getPost("_token");
        } else {
            $token = $this->request->get("_token");
        }
        if(isset($token)) {
            $this->_account = Account::findFirst(array(
                "conditions" => "token = ?1",
                "bind"       => array(1 => $token)
            ));
            if(!$this->_account) {
                $this->response->setStatusCode(404, "Token not found")->send();
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
        if(!$this->response->isSent()) {
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
        $userRole = ($this->_account) ? $this->_account->accountlevel->level : 'guest';
        $roles = include '/../config/roles.php';
        $roleSettings = $roles[$userRole];

        //$callers=debug_backtrace();

        $controller = $this->short_controller_name;
        //$function = $callers[1]['function'];

        if(isset($roleSettings['inheritRights'])) {
            $roleSettings['rights'] = $this->mergeInheritRights($roles, $roleSettings);
        }
        $rights = $roleSettings['rights'];
        
        if(isset($rights[$controller]) || $roleSettings['isAdmin']) {
            if(in_array($method, $rights[$controller]) || $roleSettings['isAdmin']) {
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
        $objs = call_user_func(array($this->short_controller_name,'find'));
        
        $data = array();
        foreach($objs as $obj) {
            $data[] = $obj;
        }
        
        $this->response->setJsonContent($data);
    }
    
    public function post() {
        $idProp = call_user_func(array($this->short_controller_name,'getIdPropName'));
        $modelStr = $this->short_controller_name;
        $model = new $modelStr();
        foreach($this->request->getPost() as $key => $value) {
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

        $this->response->setJsonContent(array('messages' => $messages, 'id' => $id));
    }
    
    public function put() {
        $args = $this->request->getJsonRawBody();
        $idProp = call_user_func(array($this->short_controller_name,'getIdPropName'));
        $model = call_user_func(array($this->short_controller_name, 'findFirst'),$args->$idProp);
        
        if($model) {
            unset($args->provider_id);
            foreach($args as $key => $value) {
                $model->$key = $value;
            }

            $messages = '';
            if(!$model->save()) {
                $messages = $this->checkErrors($model);
            }
            $this->response->setJsonContent(array('messages' => $messages, 'model' => $model));
        } else {
            $this->response->setStatusCode(404, "Not found");
        }
    }
    
    public function delete() {
        $args = $this->request->getJsonRawBody();
        $idProp = call_user_func(array($this->short_controller_name,'getIdPropName'));
        $model = call_user_func(array($this->short_controller_name, 'findFirst'),$args->$idProp);
        
        if($model) {
            $messages = '';
            if(!$model->delete()) {
                $messages = $this->checkErrors($model);
            }
            $this->response->setJsonContent(array('messages' => $messages, 'model' => $model));
        } else {
            $this->response->setStatusCode(404, "Not found");
        }
    }
    
}

?>
