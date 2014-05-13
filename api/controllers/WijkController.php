<?php

class WijkController extends BaseController {

    public function addToAction() {

    }
    
    public function closeby() {
        //$query = $this->modelsManager->createQuery("SELECT *,(SELECT MIN(ST_Distance_Sphere(st_makePoint(51.6495230,5.6146460), st_makepoint(latitude,longitude))) FROM Postcode WHERE Postcode.wijk_id = Wijk.wijk_id) as distance FROM Wijk ORDER BY distance");
        //$districts = $query->execute();
        $districts = Wijk::getCloseBy();
        
        $result = array();
        foreach($districts as $district) {
            $result[] = $district;
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
