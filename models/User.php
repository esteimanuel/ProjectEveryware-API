<?php

Class User extends BaseModel
{
	public function initialize(){
		$this->modelName = "gebruiker";
		parent::initialize();
	}
}