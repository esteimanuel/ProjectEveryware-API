<?php

class WijkController extends BaseController {

    public function addToAction() {

    }

    public function postalcodes() {
        $wijk_id = $this->request->getQuery('id');
        if(isset($wijk_id) && $wijk_id > 0) {
            $wijk = Wijk::findFirst($wijk_id);
            $this->response->setJsonContent(array('messages' => $messages, 'postalcodes' => $wijk->Postcode));
        }
    }
}

?>
