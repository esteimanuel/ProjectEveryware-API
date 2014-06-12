<?php

class PostcodeController extends BaseController {

	public function addToWijk() {
		
	}

    public function findWithPostCode() {

        $postcode = $this->request->getQuery('postcode');
        $object = null;

        if(isset($postcode) && strlen($postcode) == 6) {

            $object = Postcode::findFirst(array(
                    'conditions' => 'postcode = :pcode:',
                    'bind' => array('pcode' => $postcode),
                ));

        } else {

            $this->response->setStatusCode(400, "Invalid input, expected a 6 character long postalcode");
        }

        $this->response->setJsonContent($object);
    }
        
    public function forDistrict() {
        $wijk_id = $this->request->getQuery('id');
        $postalCodes = null;
        if(isset($wijk_id) && $wijk_id > 0) {
            $pCodes = Postcode::find(array(
                'conditions' => 'wijk_id = :wid:',
                'bind' => array('wid' => $wijk_id),
            ));
            $postalCodes = array();
            foreach($pCodes as $obj) {
                $postalCodes[] = $obj;
            }
        } else {
            $this->response->setStatusCode(400, "Invalid or no id");
        }
        $this->response->setJsonContent($postalCodes);
    }
    
    public function editDistrictId() {
        $data = $this->getRequestData();
        $postalcode = $data['postalcode'];
        $wijk_id = $data['wid'];
        
        if(isset($wijk_id) && $wijk_id > 0) {
            $this->setWijkIdForPostalCode($postalcode, $wijk_id, 'postcode');
        } else {
            $this->response->setStatusCode(400, 'Invalid or no id given');
        }
    }
    
    public function resetDistrictId() {
        $data = $this->getRequestData();
        $postalcode = $data['postalcode'];
        
        $this->setWijkIdForPostalCode($postalcode, null, 'postcode');
    }
    
    public function changeDistrictId() {
        $data = $this->getRequestData();
        $searchId = $data['search'];
        $replaceId = $data['replace'];
        
        $this->setWijkIdForPostalCode($searchId, $replaceId, 'wijk_id');
    }
    
    private function setWijkIdForPostalCode($searchValue, $wijk_id, $searchKey) {
        
        if(isset($wijk_id) && $wijk_id > 0)
            $wijk = Wijk::findFirst($wijk_id);
        else 
            $wijk = true;
        
        if($wijk) {

            $pCodes = Postcode::find(array(
                'conditions' => $searchKey.' = :sv:',
                'bind' => array('sv' => $searchValue),
            ));

            $messages = array();

            foreach($pCodes as $postalcode) {
                $postalcode->wijk_id = $wijk_id;
                if(!$postalcode->save()) {
                    $messages[] = $this->checkErrors($postalcode);
                }
            }
        } else {
            $this->response->setStatusCode(404,'Not Found');
            $messages = "No Wijk found with this id";
        }
        $this->response->setJsonContent(array('messages' => $messages));
        
    }
}

?>
