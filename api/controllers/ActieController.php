<?php

class ActieController extends BaseController {

    public function addUser() {

    }
        
    public function users() {
        $actie_id = $this->request->getQuery('id');
        if(isset($actie_id) && $actie_id > 0) {
            $data = User::find(array('actie_id' => $actie_id));
            $users = array();
            foreach($data as $user) {
                $user->account = $user->getAccount();
                $user->buddy = $user->getBuddy();
                $users[] = $user;
            }
            
            $this->response->setJsonContent($users);
        } else {
            $this->response->setStatusCode(400, 'Bad value given');
        }
    }

}

?>
