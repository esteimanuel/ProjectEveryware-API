<?php

use Phalcon\Mvc\Model,
    Phalcon\Mvc\Model\Message,
    Phalcon\Mvc\Model\Validator\Uniqueness;

class Actie extends Model
{

    public function validation()
    {
        // Action name must be unique
        $this->validate(new Uniqueness(
            array(
                "field"   => "naam",
                "message" => "The action name must be unique"
            )
        ));

        //Year cannot be less than zero
        if ($this->year < 0) {
            $this->appendMessage(new Message("The year cannot be less than zero"));
        }

        //Check if any messages have been produced
        if ($this->validationHasFailed() == true) {
            return false;
        }
    }

}