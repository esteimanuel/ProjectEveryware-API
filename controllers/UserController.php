<?php

class UserController
{
	public function get() {
		//Create a response
	    $response = new Phalcon\Http\Response();

        $response->setJsonContent(array(
            'status' => 'FOUND',
        ));

	    return $response;
	}
}