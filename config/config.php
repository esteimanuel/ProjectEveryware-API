<?php

define("DB_VER", 'dev');

return new \Phalcon\Config(array(
    'database' => array(
        'dev' => array(
            'adapter' => 'PostgreSQL',
            'host' => '*.*.*.*',
            'username' => '',
            'password' => '',
            'dbname' => '',   
        ),
        'live' => array(
            'adapter' => 'PostgreSQL',
            'host' => '*.*.*.*',
            'username' => '',
            'password' => '',
            'dbname' => '',
        ),
    ),
    'application' => array(
        'modelsDir' => __DIR__ . '/../models/',
        'controllersDir' => __DIR__ . '/../controllers/',
        'baseUri' => '/',
    )
));

