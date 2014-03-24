<?php

Class BaseModel extends Phalcon\Mvc\Model
{
	private $globalConfig = null;
	private $props = array();
	private $propSettings = array();
	
	protected $modelName;
        
        public function initialize() {
            $config = include __DIR__."/../config/models.php";
            $this->globalConfig = $config['globalConfig'];
            
            $this->modelName = lcfirst(get_class($this));
            $model = $config['models'][$this->modelName];
            
            $this->setSource($model[settings]['t_name']);
            
            $this->readPropertiesFromConfig($model[props]);
            $this->readRelations($model[relations]);
        }

	public function readPropertiesFromConfig($modelSettings) {
		foreach ($modelSettings as $key => $value) {
                        $default = null;
                        $propName;
			if (is_numeric($key)) {
				$propName = $value;
			} else {
                                $propSettings = $this->propSettings;
				$propSettings[$key] = $value;
                                $this->propSettings = $propSettings;
				
                                $propName = $key;
                                $default = (isset($propSettings[$key]['default'])) ? $propSettings[$key]['default'] : null;
			}
                        
                        if(!isset($this->$propName) && isset($default)) {
                            $this->$propName = $default;
                        }
		}
	}
        
        public function readRelations($relations) {
            foreach($relations as $relation) {
                $type = $relation['type'];
                
                $key = (isset($relation['key'])) ? $relation['key'] : $this->modelName.'_id';
                $f_table = $relation['f_table'];
                $f_key = (isset($relation['f_key'])) ? $relation['f_key'] : $f_table.'_id';
                
                switch($type) {
                    case hasOne:
                    case hasMany:
                        $this->$type($key, $f_table, $key);
                        break;
                    case belongsTo:
                        $this->belongsTo($f_key, $f_table, $key);
                        break;
                    case hasManyToMany:
                        $k_key1 = (isset($relation['k_key1'])) ? $relation['k_key1'] : $this->modelName.'_id';
                        $k_key2 = (isset($relation['k_key2'])) ? $relation['k_key2'] : $f_table.'_id';
                        $this->hasManyToMany($key, $relation['k_table'], $k_key1, $k_key2, $f_table, $f_key);
                        break;
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
					$functionName = $value;
				} else {
					$functionName = $key;
					$functionArgs = $value;
				}
				$functionArgs['message'] = $this->globalConfig['messages'][$functionName];
				$functionArgs['field'] = $propName;
                                $ucfFunctionName = "Phalcon\\Mvc\\Model\\Validator\\".ucfirst($functionName);
				$this->validate(new $ucfFunctionName($functionArgs));
			} 
		}
		if ($this->validationHasFailed() == true) {
			return false;
		}
	}

	public function __set($prop, $value) {
            parent::__set($prop, $value);
            $this->props[$prop] = $value;
	}

	public function __get($prop) {
	    //return $this->props[$prop];
            return parent::__get($prop);
	}
}
