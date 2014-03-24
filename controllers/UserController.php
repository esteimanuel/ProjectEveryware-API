<?php

class UserController
{
    public function get($app) {
        $phql = "SELECT * FROM user";
        $users = $app->modelsManager->executeQuery($phql);

        $data = array();
        foreach ($users as $user) {
            $data[] = array(
                'id' => $user->id,
            );
        }
        //Create a response
        $response = new Phalcon\Http\Response();

        $response->setJsonContent($data);

        return $response;
    }
}