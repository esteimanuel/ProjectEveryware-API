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
                $user->a = $user->Account;
                $user->b = $user->Buddy;
                $users[] = $user;
            }
            
            $this->response->setJsonContent($users);
        } else {
            $this->response->setStatusCode(400, 'Bad value given');
        }
    }

}

?>
