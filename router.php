<?php

function defaultControllerCall($cont, $method, $app) {
    $controllerStr = ucfirst($cont).'Controller';
    if (!class_exists($controllerStr)) {
    	throw new Exception('Class does not exist');
    }
    $controller = new $controllerStr();

    return call_user_func_array(array($controller, $method), array($app));
};

// Call default func from controller
$app->get('/{cont}', function($cont) use($app) { return defaultControllerCall($cont, 'get', $app); });
$app->post('/{cont}', function($cont) use($app) { return defaultControllerCall($cont, 'post', $app); });
$app->put('/{cont}', function($cont) use($app) { return defaultControllerCall($cont, 'put', $app); });
$app->delete('/{cont}', function($cont) use($app) { return defaultControllerCall($cont, 'delete', $app); });

// Call specific action from controller
$app->get('/{cont}/{act}', function($cont, $act) use($app) { return defaultControllerCall($cont, $act, $app); });
$app->post('/{cont}/{act}', function($cont, $act) use($app) { return defaultControllerCall($cont, $act, $app); });
$app->put('/{cont}/{act}', function($cont, $act) use($app) { return defaultControllerCall($cont, $act, $app); });
$app->delete('/{cont}/{act}', function($cont, $act) use($app) { return defaultControllerCall($cont, $act, $app); });


// Handle not found
$app->notFound(function () use ($app) {
    $app->response->setStatusCode(404, "Not Found")->sendHeaders();
});
