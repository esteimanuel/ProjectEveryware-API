/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

app.controller('actionDistrictCtrl', function($scope, $http, $timeout, $state, $sce, $stateParams, $rootScope) {  
    $rootScope.setNavs(0);
    //Get actie id
    $scope.actieId = $stateParams.aid;
    
    GetDataForActie();
    GetActionStats();
    
    ///Gets all data for selected action
    function GetDataForActie(){
        var url = config.api.url + 'actie?id=' + $scope.actieId;
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
            GetDataForWijk();
            console.log("Actiedata load succesfull");
        }).error(function(data, status, headers, config) {
            console.log("Actiedata load failed");
        });
    }
    
    //Gets all stats for selected action
    function GetActionStats(){
        var url = config.api.url + "actie/stats?id=" + $scope.actieId;
        $http({
            url: url,
            method: 'GET'
        }).success(function(data, status, headers, config) {
            $scope.totalDeelnemers = data.participants;        
            $scope.totalDeelnemersPrcnt = data.totalPartPerc;        
            $scope.totalProviderSelected = data.providerSelecPerc;            
            console.log("WijkData load succesfull");
        }).error(function(data, status, headers, config) {
            console.log("WijkData load failed");
        });
    }
    
    ///Gets all data for given wijk
    function GetDataForWijk(){
        var url = config.api.url + "wijk?id=" + $scope.wijkId;
        $http({
            url: url,
            method: 'GET'
        }).success(function(data, status, headers, config) {
            $scope.wijkName = data.wijk_naam;        
            $scope.wijkTotal = data.aantal_huishoudens;        
            $scope.wijkTarget = data.target;        
            $scope.wijkDuration = data.actie_duur_dagen;        
            console.log("WijkData load succesfull");
        }).error(function(data, status, headers, config) {
            console.log("WijkData load failed");
        });
    }
});
