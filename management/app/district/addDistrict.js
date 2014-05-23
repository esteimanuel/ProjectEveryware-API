/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

app.controller('addDistrictCtrl', function($scope, $http, $timeout, $sce) {
    //Set the map RUL default 99999999
    $toAddWijkNumber = 99999999;
    $scope.mapsUrl = $sce.trustAsResourceUrl("http://glassy-web.avans-project.nl/?wijk=" + $toAddWijkNumber);
    
    $scope.tableClasses = "table-striped";
    $scope.allowEdit = false;
    
    //Set header names for binding
    $scope.headers = [
        {name: "postcode", type:"text", header:"Postcode"}
    ];
    
    $scope.rows = [];
    
    //Function to add ZIP code
    $scope.addPostcode = function(postcode){
        //Check if zip already in list
        if(!checkIfZipFree(postcode.single)){
            return;
        }
        $scope.rows.push({
            postcode: postcode.single 
        });
        $scope.addNewRows();
        
        //Update in API
        var body = {_token: localStorage.token, postalcode: postcode.single, wid: $toAddWijkNumber};
        var url = config.api.url+'wijk/addWijk';

        //Postdata incorrect TODO FIX
        return;
        
        $http({
            url:url,
            method:"POST",
            data: body
        }).success(function (data, status, headers, config) {
            alert('succes');    
            })
            .error(function(data, status, headers, config){
            alert('fail');
            });
        
        //Reload Map
        $scope.mapsUrl = $sce.trustAsResourceUrl("http://glassy-web.avans-project.nl/?wijk=" + $toAddWijkNumber);
    };
   
   $scope.addWijk = function(wijk){
       
        alert(" name: " + wijk.name + "\r\n Huishoudens: " + wijk.totalHousholds + "\r\n target: " + wijk.target + "\r\n duration: " + wijk.duration + "\r\n avalible: " + wijk.avalible);
       
        var body = {beschikbaar: wijk.avalible, target: wijk.target, actie_duur_dagen: wijk.duration, aantal_huishoudens: wijk.totalHousholds};
        var url = config.api.url+'postcode/editDistrictId';

        $http({
            url:url,
            method:"POST",
            data: body
        }).success(function (data, status, headers, config) {
            alert('succes');    
            })
            .error(function(data, status, headers, config){
            alert('fail');
            });
   };
   
   function checkIfZipFree(zipCheck){
       var zipFree = true;
        $scope.rows.forEach(function(currZip) {
            if(currZip.postcode === zipCheck){
                zipFree = false;
                return;
            }
        });
        return zipFree;
   }   
   
   $scope.onTableReady = function() {
       $scope.draw();
   };
});
