/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

app.controller('addDistrictCtrl', function($scope, $http, $timeout) {
    $scope.tableClasses = "table-striped";
    
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
