<?php

Class Account extends BaseModel
{
	public function __construct(){
		$this->modelName = "account";
		parent::__construct();
	}
}