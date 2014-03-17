<?php

use Phalcon\DI\FactoryDefault,
	Phalcon\Db\Adapter\Pdo\Mysql as DbAdapter;

$di = new FactoryDefault();

/**
 * Database connection is created based in the parameters defined in the configuration file
 */
$di['db'] = function() use ($config) {
	if (isset($config->database->DB_VER)) {
		return new DbAdapter($config->database->DB_VER);
	} else {
		throw new Exception("Given database name confisettings not found, please check your database config file DB_VER value");
	}
};
