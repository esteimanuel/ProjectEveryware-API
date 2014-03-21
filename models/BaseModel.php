<?php

use Phalcon\Validation\Validator\InclusionIn,
	Phalcon\Validation\Validator\PresenceOf,
	Phalcon\Validation\Validator\Email,
	Phalcon\Validation\Validator\Regex;

Class BaseModel extends Phalcon\Mvc\Model
{
	private $globalConfig = null;
	private $props = array();
	private $propSettings = array();
	
	protected $modelName;

	public function __construct() {
		$config = include __DIR__."/../config/models.php";
		$this->globalConfig = $config['globalConfig'];

		$this->readPropertiesFromConfig($config['models']);
	}

	public function readPropertiesFromConfig($models) {
		$modelSettings = $models[$this->modelName];
		foreach ($modelSettings as $key => $value) {
			if (is_numeric($key)) {
				$this->$value = null;
			} else {
				$this->propSettings[$key] = $value;
				$default = $this->propSettings[$key]['default'];
				$this->$key = (isset($default)) ? $default : null;
			}
		}
	}

	public function validation() {

		foreach ($this->propSettings as $propName => $config) {
			$validationConfig = $config['validation'];
			foreach ($validationConfig as $key => $value) {
				$functionName = null;
				$functionArgs = null;
				if(is_numeric($key)) {
					$functionName = ucfirst($value);
				} else {
					$functionName = ucfirst($key);
					$functionArgs = $value;
				}
				$functionArgs['message'] = $this->globalConfig['messages'][$functionName];
				$functionArgs['field'] = $propName;
				$this->validate(new $functionName($functionArgs));
			} 
		}
		if ($this->validationHasFailed() == true) {
			return false;
		}
	}

	public function __set($prop, $value) {
	    $this->props[$prop] = $value;
	}

	public function __get($prop) {
	    return $this->props[$prop];
	}
}
