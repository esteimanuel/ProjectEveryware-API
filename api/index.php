<?php

//error_reporting(E_ERROR);

try {

	/**
	 * Read the configuration
	 */
	$config = include __DIR__ . '/config/config.php';

	/**
	 * Include Services
	 */
	include __DIR__ . '/config/services.php';

	/**
	 * Include Autoloader
	 */
	include __DIR__ . '/config/loader.php';

	/**
	 * Start the application
 	*/
	$app = new \Phalcon\Mvc\Micro();

	/**
	 * Assign service locator to the application
	 */
	$app->setDi($di);

	/**
	 * Include Application
	 */
	include 'router.php';

	/**
	 * Handle the request
	 */
	$app->handle();

} catch (Phalcon\Exception $e) {
	echo $e->getMessage();
} catch (PDOException $e) {
	echo $e->getMessage();
}
