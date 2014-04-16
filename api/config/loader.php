<?php

/**
 * Register autoloader
 */
$loader = new \Phalcon\Loader();

$loader->registerDirs(
	array(
		$config['application']['modelsDir'],
		$config['application']['controllersDir']
	)
)->register();