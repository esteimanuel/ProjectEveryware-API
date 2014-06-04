<?php

class GebruikerController extends BaseController
{
    public function put() {
        $putData = $this->getRequestData();
        if(isset($this->_account)) {
            unset($putData['_token']);
            if(isset($putData['_gebruiker'])) {
                foreach($putData['_gebruiker'] as $key => $value) {
                    $putData[$key] = $value;
                }
                unset($putData['_gebruiker']);
                unset($putData['gebruiker_id']);
            }
            $putData['id'] = $this->_account->Gebruiker[0]->gebruiker_id;
            
            $messages = '';
            $model = $this->basePut($putData, $messages);
            $this->response->setJsonContent(array('messages' => $messages, 'model' => $model));
        } else {
            $this->response->setStatusCode(404, "No Account Found");
        }
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