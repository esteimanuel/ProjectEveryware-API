<?php

class PostcodeController extends BaseController {

	public function addToWijk() {
		
	}
        
    public function forDistrict() {
        $wijk_id = $this->request->getQuery('id');
        $postalCodes = null;
        if(isset($wijk_id) && $wijk_id > 0) {
            $postalCodes = Postcode::find(array('wijk_id' => $wijk_id));
        } else {
            $this->response->setStatusCode(400, "Invalid or no id");
        }
        $this->response->setJsonContent(array('postalcodes' => $postalCodes));
    }

}

?>
