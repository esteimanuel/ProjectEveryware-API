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
class ProviderController {
    //put your code here
    
    public function get() {
        $providers = Provider::find();
        $data = array();
        foreach($providers as $provider) {
            var_dump($provider);
            $data[] = $provider;
        }
        
        $response = new Phalcon\Http\Response();
        
        $response->setJsonContent($data);
        return $response;
    }
    
    public function create() {
        $provider = new Provider();
        $provider->name = 'test';
        
        $response = new Phalcon\Http\Response();
        $message = 'empty';
        $id = 0;
        
        if($provider->create()) {
            $message = 'Saved! :D';
            $id = $provider->provider_id;
        } else {
            var_dump($provider->getMessages());
            $message = 'Failed :(';
            $id = -1;
        }
        
        $response->setJsonContent(array('message' => $message, 'id' => $id));
        return $response;
    }
    
}

?>
