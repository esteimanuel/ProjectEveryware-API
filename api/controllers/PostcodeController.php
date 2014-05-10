<?php

class PostcodeController extends BaseController {

	public function addToWijk() {
		
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

}

?>
