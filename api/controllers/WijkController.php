<?php

class WijkController extends BaseController {

    public function addToAction() {

    }
    
    public function closeby() {
        //$query = $this->modelsManager->createQuery("SELECT *,(SELECT MIN(ST_Distance_Sphere(st_makePoint(51.6495230,5.6146460), st_makepoint(latitude,longitude))) FROM Postcode WHERE Postcode.wijk_id = Wijk.wijk_id) as distance FROM Wijk ORDER BY distance");
        //$districts = $query->execute();
        $lat = $this->request->getQuery('lat');
        $long = $this->request->getQuery('long');
        $limit = $this->request->getQuery('limit');
        
        if(isset($lat) && isset($long)) {

            $districts = Wijk::getCloseBy($lat, $long, (isset($limit)) ? $limit : 0);

            $result = array();
            foreach($districts as $district) {
//                $actie = Actie::find(array('wijk_id' => $district->wijk_id));
                $actions = array();
                foreach($district->Actie as $action) {
                    $actions[] = $action;
                }
//                $district->acties = $actions;
                $district->actie = $actions;
                $result[] = $district;
            }
            $this->response->setJsonContent($result);
        } else {
            $this->response->setStatusCode(400, "Bad values given");
        }
    }
    
    public function search() {
        $postalcode = $this->request->getQuery('pc');
        
        $params = array();
        $conditionStr = BaseModel::getCondition(array(
            array('k' => 'postcode', 'v' => $postalcode.'%', 'op' => 'LIKE'),
        ), $params);
                
        $arguments = array(
            'conditions' => $conditionStr,
            'bind' => $params,
            'limit' => 10,
        );
        
        $postalcodes = Postcode::find($arguments);
        
        $result = array();
        $wijkIds = array();
        foreach($postalcodes as $postalcode) {
            if(isset($postalcode->wijk_id)) {
//                $actie = Actie::find(array('wijk_id' => $district->wijk_id));
                $district = Wijk::findFirst($postalcode->wijk_id);
                if(!in_array($district->wijk_id, $wijkIds)) {
                    $wijkIds[] = $district->wijk_id;

                    $actions = array();
                    foreach($district->Actie as $action) {
                        $actions[] = $action;
                    }

                    $district->actie = $actions;
                    $result[] = $district;
                }
            }
        }
        $this->response->setJsonContent($result);
    }

//    public function postalcodes() {
//        $wijk_id = $this->request->getQuery('id');
//        if(isset($wijk_id) && $wijk_id > 0) {
//            $wijk = Wijk::findFirst($wijk_id);
//            $this->response->setJsonContent(array('messages' => $messages, 'postalcodes' => $wijk->Postcode));
//        }
//    }
}

?>
