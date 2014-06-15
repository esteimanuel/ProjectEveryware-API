<?php

class GebruikerController extends BaseController
{
    public function put() {
        $putData = $this->getRequestData();
//        var_dump($putData);
        if(isset($this->_account)) {
            $messages = '';
            
            unset($putData['_token']);
            
            if(isset($putData['_gebruiker'])) {
                foreach($putData['_gebruiker'] as $key => $value) {
                    $putData[$key] = $value;
                }
                unset($putData['_gebruiker']);
            }
             

            if(isset($putData['buddy'])) {
                $buddyData = array();
                foreach($putData['buddy'] as $key => $value) {
                    $buddyData[$key] = $value;
                }
                
                $this->saveBuddy($buddyData, $putData['gebruiker_id'], $messages);
                
//                unset($putData['buddy']);
            }
            
            if(isset($putData['postcode'])) {
                $postcodeData = array();
                foreach($putData['postcode'] as $key => $value) {
                    $postcodeData[$key] = $value;
                }
                
                $postcode_id = $this->savePostcode($postcodeData, ((isset($putData['postcode_id'])) ? $putData['postcode_id'] : 0), $messages);
                
                $putData['postcode_id'] = $postcode_id;
//                unset($putData['postcode']);
            }
            
            if(isset($putData['gebruiker_id']))
                unset($putData['gebruiker_id']);

            $putData['id'] = $this->_account->Gebruiker[0]->gebruiker_id;
            
            $model = $this->basePut($putData, $messages);
            $this->response->setJsonContent(array('messages' => $messages, 'model' => $model));
        } else {
            $this->response->setStatusCode(404, "No Account Found");
        }
    }
    
    private function saveBuddy($buddyData, $gebruiker_id, &$messages) {
        $params = array();
        $conditionStr = BaseModel::getCondition(array(array('k' => 'gebruiker_id', 'v' => $gebruiker_id)), $params);

        $model = Buddy::findFirst(array(
            'conditions' => $conditionStr,
            'bind' => $params,
        ));
        
        if($model) {
            foreach($buddyData as $key => $value) {
                $model->$key = $value;
            }
            if(!$model->save()) {
                $messages = $this->checkErrors($model);
            }
        } else {
            $buddy = new Buddy();
            foreach($buddyData as $key => $value) {
                $buddy->$key = $value;
            }
            $buddy->gebruiker_id = $gebruiker_id;
            if(!$buddy->create()) {
                $messages = $this->checkErrors($model);
            }
        }
    }
    
    private function savePostcode($postcodeData, $postcode_id, &$messages) {
        $params = array();
        $model = false;
        if($postcode_id > 0) {
            $conditionStr = BaseModel::getCondition(array('k' => 'postcode_id', 'v' => $postcode_id), $params);

            $model = Postcode::findFirst(array(
                'conditions' => $conditionStr,
                'bind' => $params,
            ));
        }
        
        if($model) {
            foreach($postcodeData as $key => $value) {
                $model->$key = $value;
            }
            if(!$model->save()) {
                $messages = $this->checkErrors($model);
            }
        } else {
            $postcode = new Postcode();
            foreach($postcodeData as $key => $value) {
                $postcode->$key = $value;
            }
            
            if(!$postcode->create()) {
                $messages = $this->checkErrors($model);
            } else {
                $postcode_id = $postcode->postcode_id;
            }
        }
        
        return $postcode_id;
    }
    
//     public function get($app) {
// //        $phql = 'SELECT * FROM gebruiker';
// //        $users = $app->modelsManager->executeQuery($phql);
// //
// //        $data = array();
// //        foreach ($users as $user) {
// //            $data[] = array(
// //                'id' => $user->id,
// //            );
// //        }
//         $data = array();
//         $users = User::find();
//         var_dump($users);
//         foreach ($users as $user) {
//             $data[] = array(
//                 'id' => $user->actie->id,
//             );
//         }
        
//         //Create a response
//         $response = new Phalcon\Http\Response();
        
//         $data[] = array('id' => 1);

//         $response->setJsonContent($data);

//         return $response;
//     }
    
    public function addToAction() {
        
    }
}