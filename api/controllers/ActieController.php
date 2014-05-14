<?php

class ActieController extends BaseController {

    public function addUser() {

    }
        
    public function users() {
        $actie_id = $this->request->getQuery('id');
        if(isset($actie_id) && $actie_id > 0) {
            $data = User::find(array(
                'conditions' => 'actie_id = :aid:',
                'bind' => array('aid' => $actie_id),
            ));
            $users = array();
            foreach($data as $user) {
//                var_dump($user->Account);
//                var_dump($user->Buddy);
                if(count($user->Account) > 0) {
                    $user->_account = $user->Account[0];
                }
                $user->Buddy;
                $users[] = $user;
            }
            
            $this->response->setJsonContent($users);
        } else {
            $this->response->setStatusCode(400, 'Bad value given');
        }
    }

}

?>
