<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of UserController
 *
 * @author Remi
 */
class UserController {
    //put your code here
    
    public function login($app) {
        $response = new Phalcon\Http\Response();
        if(isset($app)) {
            $phql = "SELECT * FROM `user`";
            $users = $app->modelsManager->executeQuery($phql);
            
            $response->setStatusCode(200, 'OK');
            $response->setJsonContent(array('app' => "Exists", 'users' => $users));
        } else {
            $response->setStatusCode(404, 'Not found');
            $response->setJsonContent(array('app' => "Nope"));
        }
        
        return $response;
    }
    
    public function get($app) {
        
    }
    
}

?>
