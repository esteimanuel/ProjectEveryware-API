<?php

use Phalcon\DI\FactoryDefault;

$di = new FactoryDefault();

/**
 * Database connection is created based in the parameters defined in the configuration file
 */

$di['db'] = function() use($config) {
	if (isset($config['database'][DB_VER])) {
                $adapter = '\\Phalcon\\Db\\Adapter\\Pdo\\'.$config['database'][DB_VER]['adapter'];
                unset($config['database'][DB_VER]['adapter']);
		return new $adapter($config['database'][DB_VER]);
	} else {
		throw new Exception("Given database name confisettings not found, please check your database config file DB_VER value");
	}
};
