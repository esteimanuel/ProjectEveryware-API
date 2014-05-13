<?php

Class Wijk extends BaseModel
{

    public static function getCloseBy() {
        // Instantiate the Query
        $query = new Phalcon\Mvc\Model\Query("SELECT *,(SELECT MIN(ST_Distance_Sphere(st_makePoint(51.6495230,5.6146460), st_makepoint(latitude,longitude))) FROM Postcode WHERE Postcode.wijk_id = Wijk.wijk_id) as distance FROM Wijk ORDER BY distance");

        // Execute the query returning a result if any
        $result = $query->execute();
        return $result;
    }
    
}