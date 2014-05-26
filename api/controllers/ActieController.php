<?php

class ActieController extends BaseController {

    public function get() {
        $qStrData = $this->request->getQuery();
        $data = $this->baseGet($qStrData);
        
        $media = $data->Media;
            
        $aMedia = array();
        foreach($media as $mObj) {
            $aMedia[] = $mObj;
        }
        $data->media = $aMedia;
        if(isset($data))
            $this->response->setJsonContent($data);
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
    
    public function stats() {
        $actie_id = $this->request->getQuery('id');
        if(isset($actie_id) && $actie_id > 0) {
            $states = array();
            
            $actie = Actie::findFirst($actie_id);
            
            $wijk = Wijk::findFirst($actie->wijk_id);
            $participants = count($actie->Gebruiker);
            $paidParticipants = 0;
            $providerSelections = 0;
            foreach($actie->Gebruiker as $gebruiker) {
                if($gebruiker->borg_betaald) {
                    $paidParticipants++;
                }
                if(isset($gebruiker->pakket_id) && $gebruiker->pakket_id > 0) {
                    $providerSelections++;
                }
            }
            $houses = $wijk->aantal_huishoudens;
            $targetNr = ($wijk->aantal_huishoudens / 100 * $wijk->target);
            //$target = count($actie->Gebruiker) / $targetNr;
            
            $states['participants'] = $participants;
            $states['houses'] = $houses;
            $states['target'] = $targetNr;
            $states['totalPartPerc'] = round(($participants / $houses) * 100);
            $states['targetPartPerc'] = round(($participants / $targetNr) * 100);
            $states['paidTargetPerc'] = round(($paidParticipants / $targetNr) * 100);
            $states['providerSelecPerc'] = round(($providerSelections / $targetNr) * 100);
            // Glasvezel aanleg gaat via beheer, hier nog opvragen
            // Werkelijk overgestapt percentage, moet nog een waarde voor in de db
            
            $this->response->setJsonContent($states);
        } else {
            $this->response->setStatusCode(400, 'Bad value given');
        }
    }
    
    public function media() {
        $actie_id = $this->request->getQuery('id');
        if(isset($actie_id) && $actie_id > 0) {
            $actie = Actie::findFirst($actie_id);
            
            $media = $actie->Media;
            
            $aMedia = array();
            foreach($media as $mObj) {
                $aMedia[] = $mObj;
            }
            
            $this->response->setJsonContent($aMedia);
            
        } else {
            $this->response->setStatusCode(400, 'Bad value given');
        }
    }

}

?>
