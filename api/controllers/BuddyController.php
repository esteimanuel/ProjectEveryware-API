<?php

class BuddyController extends BaseController {

public function put() {
        $putData = $this->getRequestData();
        if(isset($putData->gebruiker_id)) {
           
            $model = Buddy::findFirst($putData['gebruiker_id']);
            
            unset($putData['_token']);
            unset($putData['gebruiker_id']);
            $messages = '';
            
            if($model) {

              foreach($putData as $key => $value) {
                $model->$key = $value;
              }
              
              if(!$model->save()) {
                $messages = $this->checkErrors($model);
              }
            }

            $this->response->setJsonContent(array('messages' => $messages, 'model' => $model));
        } else {
            $this->response->setStatusCode(404, "No Account Found");
        }
    }
}

  public function getByGebruikerId() {

    $sGebruikerId = $this->request->getQuery('gebruiker_id');

    $model = Buddy::findFirst($sGebruikerId);

    if($model) {

      $this->response->setJsonContent(array('model' => $model);

    } else {
      $this->response->setStatusCode(404, "Buddy niet gevonden, Koos Vriendloos!");
    }
  }

?>
