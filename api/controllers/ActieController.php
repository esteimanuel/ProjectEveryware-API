<?php

class ActieController extends BaseController {

    public function addUser() {

    }
        
    public function users() {
        $actie_id = $this->request->getQuery('id');
        if(isset($actie_id) && $actie_id > 0) {
            $data = Gebruiker::find(array(
                'conditions' => 'actie_id = :aid:',
                'bind' => array('aid' => $actie_id),
            ));
            $users = array();
            foreach($data as $user) {
//                var_dump($user->Account);
//                var_dump($user->Buddy);
                if(count($user->Account) > 0) {
                    $user->account = $user->Account[0];
                }
                $user->Buddy;
                $users[] = $user;
            }
            
            $this->response->setJsonContent($users);
        } else {
            $this->response->setStatusCode(400, 'Bad value given');
        }
    }
    
    public function states() {
        $actie_id = $this->request->getQuery('id');
        if(isset($actie_id) && $actie_id > 0) {
            $states = array();
            
            $actie = Actie::findFirst($actie_id);
            
            $wijk = Wijk::findFirst($actie->wijk_id);
            $participants = count($actie->Gebruiker);
            $houses = $wijk->aantal_huishoudens;
            $target = count($actie->Gebruiker) / ($wijk->aantal_huishoudens / 100 * $wijk->target);
            
            $states['participants'] = $participants;
            $states['houses'] = $houses;
            $states['totalPerc'] = $participants / $houses;
            $states['target'] = intval($target);
            
            $this->response->setJsonContent($states);
        } else {
            $this->response->setStatusCode(400, 'Bad value given');
        }
    }

}

?>
