<?php

Class User extends BaseModel
{
	public function __construct(){
		$this->modelName = "gebruiker";
		parent::__construct();
	}
}