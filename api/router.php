<?php

function defaultControllerCall($cont, $method) {
    $controllerStr = ucfirst($cont).'Controller';
    if (!class_exists($controllerStr)) {
    	throw new Exception('Class does not exist');
    }
    $controller = new $controllerStr();

    $baseFunc = 'methodConstructor';
    
    return call_user_func_array(array($controller, $baseFunc), array($method));
};

// Call default func from controller
$app->get('/{cont}', function($cont) { return defaultControllerCall($cont, 'get'); });
$app->post('/{cont}', function($cont) { return defaultControllerCall($cont, 'post'); });
$app->put('/{cont}', function($cont) { return defaultControllerCall($cont, 'put'); });
$app->delete('/{cont}', function($cont) { return defaultControllerCall($cont, 'delete'); });

// Call specific action from controller
$app->get('/{cont}/{act}', function($cont, $act) { return defaultControllerCall($cont, $act); });
$app->post('/{cont}/{act}', function($cont, $act) { return defaultControllerCall($cont, $act); });
$app->put('/{cont}/{act}', function($cont, $act) { return defaultControllerCall($cont, $act); });
$app->delete('/{cont}/{act}', function($cont, $act) { return defaultControllerCall($cont, $act); });


// Handle not found
$app->notFound(function () use ($app) {
    $app->response->setStatusCode(404, "Not Found");
});
