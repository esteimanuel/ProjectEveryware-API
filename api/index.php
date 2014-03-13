<?php

// Use Loader() to autoload our model
$loader = new \Phalcon\Loader();

$loader->registerDirs(array(
    __DIR__.'/models/',
    __DIR__.'/controllers/',
))->register();

$di = new \Phalcon\DI\FactoryDefault();

$dbconfig = include '/database/config.php';
// DB_VER from config.php
if(isset($dbconfig[DB_VER])) {
    $db = $dbconfig[DB_VER];
    
    //Set up the database service
    $di->set('db', function(){
        return new \Phalcon\Db\Adapter\Pdo\Mysql($db);
    });
} else {
    throw new Exception("Given database name configsettings not found, please check your Database Config file DB_VER value");
}

$app = new Phalcon\Mvc\Micro($di);

//Call default func from controller
$app->get('/{cont}', function($cont) use($app) {
    $controllerStr = ucfirst($cont).'Controller';
    $controller = new $controllerStr();
    
    return call_user_func_array(array($controller, 'get'), array($app));
});

//Call specific action from controller
$app->get('/{cont}/{act}', function($cont, $act) use($app) {
    $controllerStr = ucfirst($cont).'Controller';
    $controller = new $controllerStr();
    
    return call_user_func_array(array($controller, $act), array($app));
});

$app->handle();

?>