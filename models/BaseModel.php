<?php

Class BaseModel extends Phalcon\Mvc\Model
{
	private $props = array();
	
	protected $modelName;

	public function __construct() {
		$this->readPropertiesFromConfig();
	}

	public function readPropertiesFromConfig() {
		$models = include __DIR__."/../config/models.php";
		$modelSettings = $models[$this->modelName];
		for($modelSettings => $propName) {
			$this->$propName = null;
		}
	}

	public function __set($prop, $value)
	{
	    $this->props[$prop] = $value;
	}

	public function __get($prop)
	{
	    return $this->props[$prop];
	}
}
