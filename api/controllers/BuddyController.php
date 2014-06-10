<?php

class BuddyController extends BaseController {

public function put() {
        $putData = $this->getRequestData();
        if(isset($this->gebruiker_id)) {
            unset($putData['_token']);
            $messages = '';
            $model = $this->basePut($putData, $messages);
            $this->response->setJsonContent(array('messages' => $messages, 'model' => $model));
        } else {
            $this->response->setStatusCode(404, "No Account Found");
        }
    }
}

?>
