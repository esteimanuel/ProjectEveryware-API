/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

app.controller('editActieCtrl', function($scope, $http, $timeout, $state, $sce, $stateParams) {    
    //Get the district to edit
    $scope.currentActieId = $stateParams.aid;
    GetDataForActie();    
    GetDataForWijk();
    loadMap();
    
    ///Gets all data for selected action
    function GetDataForActie(){
        var url = config.api.url + 'actie?id=' + $scope.currentActieId;
        $http({
            url: url,
            method: 'GET'
        }).success(function(data, status, headers, config) {
            ///Convert al data to local vars
            $scope.actieBorg = data.borg;
            $scope.actieBorg_betaald = data.borg_betaald;
            $scope.actieInitiatiefnemerId = data.initiatiefnemer_id;
            $scope.actieStartDatum = data.start_datum;
            $scope.actieEindDatum = data.eind_datum;
            $scope.actieNaam = data.naam;
            $scope.actieStatus = data.statuslist_id;
            $scope.wijkId = data.wijk_id;            
            console.log("Actiedata load succesfull");
        }).error(function(data, status, headers, config) {
            console.log("Actiedata load failed");
        });
    }
    
    ///Gets all data for given wijk
    function GetDataForWijk(wijkId){
        var url = config.api.url + "id?=" + $scope.wijkId;
        $http({
            url: url,
            method: 'GET'
        }).success(function(data, status, headers, config) {
            console.log("WijkData load succesfull");
        }).error(function(data, status, headers, config) {
            console.log("WijkData load failed");
        });
        
        ///////////////////
        //postcodes
        ///////////////////
        var url = config.api.url+'postcode/ForDistrict?id=' + $scope.wijkId;
        $http({
            url: url,
            method: 'GET'
        }).success(function(data, status, headers, config) {
            console.log("Postcode load succesfull");
        }).error(function(data, status, headers, config) {
            console.log("Postcode load failed");
        });
    }
   
   function loadMap(){       
        $scope.mapsUrl = $sce.trustAsResourceUrl("http://glassy-web.avans-project.nl/?wijk=" + $scope.wijkId);
   }
});
