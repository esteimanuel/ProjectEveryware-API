<?php

define("DB_VER", 'dev');

return array(
    'database' => array(
        'dev' => array(
            'adapter' => 'Postgresql',
            'host' => 'db.roconda.nl',
            'username' => 'glassy',
            'password' => 'fsiok4niovgdSG',
            'dbname' => 'glassy',
        ),
        'live' => array(
            'adapter' => 'Postgresql',
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
);

