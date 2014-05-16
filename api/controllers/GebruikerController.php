<?php

class GebruikerController extends BaseController
{
    public function put() {
        $putData = $this->getRequestData();
        if(isset($this->_account) && isset($putData['actie_id'])) {
            $data = array(
                'id' => $this->_account->account_id,
                'actie_id' => $putData['actie_id'],
            );
            $messages = '';
            $model = $this->basePut($data, $messages);
            $this->response->setJsonContent(array('messages' => $messages, 'model' => $model));
        } else {
            $this->response->setStatusCode(400, "Bad values given");
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