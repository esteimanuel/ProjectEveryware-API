<?php

Class User extends BaseModel {
    
    public function isAdmin() {
        return ($this->accountlevel->level === 'admin');
    }
    
}