/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

app.controller('editActieCtrl', function($scope, $http, $timeout, $state, $sce, $stateParams, $rootScope) {   
    var navs = [[{name:'Toevoegen', state:'main.actie.actieToevoegen'},
        {name:'Overzicht', state:'main.actie.actieOverview'}]];
    $rootScope.setNavs(navs);  
    //Get the district to edit
    GetStatusValues();
    $scope.actieId = $stateParams.aid;
    GetDataForActie();    
    GetActieDeelnemers();
    
    //Table config
    $scope.rows = [];
    $scope.headers = [
        {name:"voornaam", type:"text", header:"Voornaam"},
        {name:"tussenvoegsel", type:"text", header:"Tussenvoegsels"},
        {name:"achternaam", type:"text", header:"Achternaam"},
        {name:"borg_betaald", type:"checkbox", header:"Borg betaald"},
        {name:"postcode_id", type:"text", header:"Postcode"},
        {name:"huisnummer", type:"text", header:"Huisnummer"}
    ];
    
    //Disable modifiers for table
    $scope.allowEdit = false;
    $scope.allowDelete = false;
    
    ///Gets the different status values
    function GetStatusValues(){
        var url = config.api.url + 'status'
        $http({
            url: url,
            method: 'GET'
        }).success(function(data, status, headers, config) {
            $scope.statuses = data;
            console.log("Statusdata load succesfull");
        });
    }
    
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
            loadMap();
            GetDataForWijk();
            console.log("Actiedata load succesfull");
        }).error(function(data, status, headers, config) {
            console.log("Actiedata load failed");
        });
    }
    
    ///Gets all data for given wijk
    function GetDataForWijk(wijkId){
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
    
    function GetActieDeelnemers(){
        var url = config.api.url+'actie/users?id=' + $scope.actieId;
        $http({
            url: url,
            method: 'GET'
        }).success(function(data, status, headers, config) {
            console.log("Actie data load succesfull");
            $scope.rows = data;
            $scope.draw();
        }).error(function(data, status, headers, config) {
            console.log("Actie data load failed /r/n/r/n Reson: /r/n" + headers);
        });
    }; 
   
   function loadMap(){       
        $scope.mapsUrl = $sce.trustAsResourceUrl("http://glassy-web.avans-project.nl/?wijk=" + $scope.wijkId);
   }
});
