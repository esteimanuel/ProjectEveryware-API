<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of ProviderController
 *
 * @author Remi
 */
class ProviderController extends BaseController {
    //put your code here
    
//    public function get() {
//        $providers = Provider::find();
//        
//        $data = array();
//        foreach($providers as $provider) {
//            //var_dump($provider);
//            $data[] = $provider;
//        }
//        
//        $this->response->setJsonContent($data);
//    }
//    
//    public function create() {
//        $provider = new Provider();
//        foreach($this->request->getPost() as $key => $value) {
//            $provider->$key = $value;
//        }
//
//        //$response = new Phalcon\Http\Response();
//        $messages = '';
//        $id = 0;
//
//        if($provider->create()) {
//            $id = $provider->provider_id;
//        } else {
//            $messages = $this->checkErrors($provider);
//            $id = -1;
//        }
//
//        $this->response->setJsonContent(array('messages' => $messages, 'id' => $id));
//    }
//    
//    public function put() {
//        $args = $this->request->getJsonRawBody();
//        $provider = Provider::findFirst($args->provider_id);
//        
//        if($provider) {
//            unset($args->provider_id);
//            foreach($args as $key => $value) {
//                $provider->$key = $value;
//            }
//
//            $messages = '';
//            if(!$provider->save()) {
//                $messages = $this->checkErrors($provider);
//            }
//            $this->response->setJsonContent(array('messages' => $messages, 'model' => $provider));
//        } else {
//            $this->response->setStatusCode(404, "Not found");
//        }
//    }
//    
//    public function delete() {
//        $args = $this->request->getJsonRawBody();
//        $provider = Provider::findFirst($args->provider_id);
//        
//        if($provider) {
//            $messages = '';
//            if(!$provider->delete()) {
//                $messages = $this->checkErrors($provider);
//            }
//            $this->response->setJsonContent(array('messages' => $messages, 'model' => $provider));
//        } else {
//            $this->response->setStatusCode(404, "Not found");
//        }
//    }
    
}

?>
