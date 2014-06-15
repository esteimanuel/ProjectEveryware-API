<?php

class WijkController extends BaseController {

    private $_searchLimit = 300;
    
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
//        $postalcode = $this->request->getQuery('pc');
        $searchQuery = $this->request->getQuery('sq');
        
        if(isset($searchQuery)) {
            $isPostalCode = preg_match('/^\d/', $searchQuery) === 1;
            $params = array();
            $conditionStr = BaseModel::getCondition(array(
                array('k' => ($isPostalCode) ? 'postcode' : 'wijk_naam', 'v' => $searchQuery.'%', 'op' => 'ILIKE'),
            ), $params);

            $arguments = array(
                'conditions' => $conditionStr,
                'bind' => $params,
                'limit' => $this->_searchLimit,
            );
            
            $result = array();
            if($isPostalCode) {
                $postalcodes = Postcode::find($arguments);

                
                $wijkIds = array();
                foreach($postalcodes as $postalcode) {
                    if(isset($postalcode->wijk_id)) {
                        if(!in_array($postalcode->wijk_id, $wijkIds)) {
        //                $actie = Actie::find(array('wijk_id' => $district->wijk_id));
                            $district = Wijk::findFirst($postalcode->wijk_id);

                            $wijkIds[] = $postalcode->wijk_id;

                            $actions = array();
                            foreach($district->Actie as $action) {
                                $actions[] = $action;
                            }

                            $district->actie = $actions;
                            $result[] = $district;
                        }
                    }
                }
            } else {
                $districts = Wijk::find($arguments);
                foreach($districts as $district) {
                    
                    $actions = array();
                    foreach($district->Actie as $action) {
                        $actions[] = $action;
                    }
                    
                    $district->actie = $actions;
                    $result[] = $district;
                }
            }
            $this->response->setJsonContent($result);
        }
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
