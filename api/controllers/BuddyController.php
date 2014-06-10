<?php

class BuddyController extends BaseController {

public function put() {
        $putData = $this->getRequestData();
        if(isset($putData->gebruiker_id)) {
            $model = Buddy::findFirst($putData->gebruiker_id);
            
            if($model) {
              unset($putData['_token']);
              unset($putData['gebruiker_id']);
              
              $model->save();
            }

            $messages = '';
            $this->response->setJsonContent(array('messages' => $messages, 'model' => $model));
        } else {
            $this->response->setStatusCode(404, "No Account Found");
        }
    }
}

?>
