<?php

// Retrieve all actions
$app->get('/api/actions', function() {
	$phql = "SELECT * FROM Actie ORDER BY wijk_id";
    $actions = $app->modelsManager->executeQuery($phql);

    $data = array();
    foreach ($actions as $action) {
        $data[] = array(
            'id' => $action->id,
            'naam' => $action->naam,
            'wijk_id' => $action->wijk_id,
            'borg' => $action->borg,
            'borg_totaal' => $action->borg_totaal,
            'initiatiefnemer_id' => $action->initiatiefnemer_id,
            'datum_start' => $action->datum_start,
            'datum_eind' => $action->datum_eind
        );
    }

    echo json_encode($data);
});

// Search for actions with $name in their name
$app->get('/api/actions/search/{name}', function($name) {
	$phql = "SELECT * FROM Actie WHERE naam LIKE :name: ORDER BY naam";
    $actions = $app->modelsManager->executeQuery($phql, array(
        'name' => '%' . $name . '%'
    ));

    $data = array();
    foreach ($actions as $action) {
        $data[] = array(
            'id' => $action->id,
            'naam' => $action->naam,
            'wijk_id' => $action->wijk_id,
            'borg' => $action->borg,
            'borg_totaal' => $action->borg_totaal,
            'initiatiefnemer_id' => $action->initiatiefnemer_id,
            'datum_start' => $action->datum_start,
            'datum_eind' => $action->datum_eind
        );
    }

    echo json_encode($data);

});

// Retrieve actions based on primary key
$app->get('/api/actions/{id:[0-9]+}', function($id) {
	$phql = "SELECT * FROM Actie WHERE id = :id:";
    $action = $app->modelsManager->executeQuery($phql, array(
        'id' => $id
    ))->getFirst();

    // Create a response
    $response = new Phalcon\Http\Response();

    if ($action == false) {
        $response->setJsonContent(array('status' => 'NOT-FOUND'));
    } else {
        $response->setJsonContent(array(
            'status' => 'FOUND',
            'data' => array(
                'id' => $action->id,
            	'naam' => $action->naam,
            	'wijk_id' => $action->wijk_id,
            	'borg' => $action->borg,
            	'borg_totaal' => $action->borg_totaal,
            	'initiatiefnemer_id' => $action->initiatiefnemer_id,
            	'datum_start' => $action->datum_start,
            	'datum_eind' => $action->datum_eind
            )
        ));
    }

    return $response;
});

// Add new action
$app->post('/api/actions', function() {
	$action = $app->request->getJsonRawBody();

    $phql = "INSERT INTO Actie (naam, wijk_id, datum_start, datum_eind, initiatiefnemer_id) 
    VALUES (:naam:, :wijk_id:, :datum_start:, :datum_eind:, :initiatiefnemer_id:)";

    $status = $app->modelsManager->executeQuery($phql, array(
        'naam' => $action->naam,
        'wijk_id' => $action->wijk_id,
        'datum_start' => $action->datum_start,
        'datum_eind' => $action->datum_eind,
        'initiatiefnemer_id' => $action->initiatiefnemer_id
    ));

    // Create a response
    $response = new Phalcon\Http\Response();

    // Check if the insertion was successful
    if ($status->success() == true) {
        // Change the HTTP status
        $response->setStatusCode(201, "Created");
        $action->id = $status->getModel()->id;
        $response->setJsonContent(array('status' => 'OK', 'data' => $action));
    } else {
        // Change the HTTP status
        $response->setStatusCode(409, "Conflict");
        //Send errors to the client
        $errors = array();
        foreach ($status->getMessages() as $message) {
            $errors[] = $message->getMessage();
        }
        $response->setJsonContent(array('status' => 'ERROR', 'messages' => $errors));
    }

    return $response;
});

// Update actions based on primary key
$app->put('/api/actions/{id:[0-9]+}', function() {
	$action = $app->request->getJsonRawBody();

    $phql = "UPDATE Actie SET naam = :naam:, borg = :borg:, borg_totaal = :borg_totaal:,
    	datum_eind = :datum_eind: WHERE id = :id:";
    $status = $app->modelsManager->executeQuery($phql, array(
        'id' => $id,
        'naam' => $action->naam,
        'borg' => $action->borg,
        'borg_totaal' => $action->borg_totaal,
        'datum_eind' => $action->datum_eind
    ));

    // Create a response
    $response = new Phalcon\Http\Response();

    //Check if the insertion was successful
    if ($status->success() == true) {
        $response->setJsonContent(array('status' => 'OK'));
    } else {
        //Change the HTTP status
        $response->setStatusCode(409, "Conflict");

        $errors = array();
        foreach ($status->getMessages() as $message) {
            $errors[] = $message->getMessage();
        }
        $response->setJsonContent(array('status' => 'ERROR', 'messages' => $errors));
    }

    return $response;
});

// Delete action based on primary key
$app->delete('/api/actions/{id:[0-9]+}', function() {
	$phql = "DELETE FROM Actie WHERE id = :id:";
    $status = $app->modelsManager->executeQuery($phql, array(
        'id' => $id
    ));

    // Create a response
    $response = new Phalcon\Http\Response();

    if ($status->success() == true) {
        $response->setJsonContent(array('status' => 'OK'));
    } else {
        // Change the HTTP status
        $response->setStatusCode(409, "Conflict");

        $errors = array();
        foreach ($status->getMessages() as $message) {
            $errors[] = $message->getMessage();
        }
        $response->setJsonContent(array('status' => 'ERROR', 'messages' => $errors));
    }

    return $response;
});