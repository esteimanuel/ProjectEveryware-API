/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

app.controller('addDistrictCtrl', function($scope, $http, $timeout, $sce) {
    $toAddWijkNumber = 1;
    
    //Set the map RUL default 99999999
    $scope.mapsUrl = $sce.trustAsResourceUrl("http://glassy-web.avans-project.nl/?wijk=" + $toAddWijkNumber);
    
    $scope.tableClasses = "table-striped";
    $scope.allowEdit = false;
    
    //Set header names for binding
    $scope.headers = [
        {name: "postcode", type:"number", header:"Postcode"}
    ];
    
    $scope.rows = [];
    
    var currentZip = 1111;
    for(var i = 0; i < 300; i++){
        $scope.rows.push({
            postcode: currentZip + "AA"
        });
        currentZip++;
    }
    $timeout(function(){ $scope.draw();}, 500);
   
});
