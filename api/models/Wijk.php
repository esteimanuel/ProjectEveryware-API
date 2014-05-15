<?php

Class Wijk extends BaseModel
{

    public static function getCloseBy($lat, $long, $limit = 0) {
        // Instantiate the Query
        $wijk = new Wijk();
        $pdo = $wijk->getWriteConnection();
        $lat = $pdo->escapeString($lat);
        $long = $pdo->escapeString($long);
        
        $sql = "SELECT *,(SELECT MIN(ST_Distance_Sphere(st_makePoint($lat,$long), st_makepoint(latitude,longitude))) FROM Postcode WHERE Postcode.wijk_id = Wijk.wijk_id) as distance FROM Wijk ORDER BY distance" . (($limit > 0) ? " LIMIT ".$limit : "");

        return new Phalcon\Mvc\Model\Resultset\Simple(null, $wijk, $wijk->getReadConnection()->query($sql));
    }
    
}