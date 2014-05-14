<?php

Class Gebruiker extends BaseModel {
    
    public function isAdmin() {
        return ($this->accountlevel->level === 'admin');
    }
    
}