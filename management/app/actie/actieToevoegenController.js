/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

app.controller('actieToevoegenCtrl', function($scope, $http, $timeout, $state, $sce, $stateParams, $rootScope) {   
    var navs = [[
        {name:'Toevoegen', active:true, state:'main.actie.actieToevoegen'},
        {name:'Overzicht', state:'main.actie.actieOverview'}]];
    $rootScope.setNavs(navs);  
    //Get the district to edit
    GetAvalibleDistricts();
    GetStatusValues();
    $scope.actieId = $stateParams.aid;
    
    //Disable start button
    $scope.WijkIsSelected = true;
    
    //Fix the dates
    var startDate = new Date();
    var endDate = new Date();
    $scope.actieStartDatum = startDate.toISOString().slice(0,10);
    
    endDate.setDate(endDate.getDate() + 100);
    $scope.actieEindDatum = endDate.toISOString().slice(0,10);
    
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
    
    //Get all avalible districts
    function GetAvalibleDistricts(){
        var url = config.api.url + "wijk?ex={'k':'beschikbaar', 'v':'true'}";
        $http({
            url: url,
            method: 'GET'
        }).success(function(data, status, headers, config) {
            $scope.avalibleWijken = data;
            console.log("WijkData load succesfull");
        }).error(function(data, status, headers, config) {
            console.log("WijkData load failed");
        });        
    }
    
    ///Gets all data for given wijk
    $scope.getWijkData = function GetDataForWijk(wijkId){
        $scope.wijkId = wijkId;
        var url = config.api.url + "wijk?id=" + $scope.wijkId;
        $http({
            url: url,
            method: 'GET'
        }).success(function(data, status, headers, config) {
            $scope.wijkName = data.wijk_naam;        
            $scope.wijkTotal = data.aantal_huishoudens;        
            $scope.wijkTarget = data.target;        
            $scope.wijkDuration = data.actie_duur_dagen;    
            $scope.WijkIsSelected = false;
            loadMap();
            console.log("WijkData load succesfull");
        }).error(function(data, status, headers, config) {
            console.log("WijkData load failed");
        });
    };
   
   function loadMap(){       
        $scope.mapsUrl = $sce.trustAsResourceUrl("http://glassy-web.avans-project.nl/?wijk=" + $scope.wijkId);
   }
   
   $scope.AddAction = function addAction(){
       var url = config.api.url+'statuslist';
            $http({
                url:url,
                method:"POST",
                data: {}
            }).success(function (data, status, headers, config) {
                $scope.statusListId = data.id;
                })
                .error(function(data, status, headers, config){
                    alert('Gegevens konden niet opgeslagen worden.');
                });
                
       var body = {borg: 0, borg_betaald: false, start_datum: $scope.actieStartDatum, eind_datum: $scope.actieEindDatum, naam: $scope.actieNaam, wijk_id: $scope.wijkId, statuslist_id: $scope.statusListId};
            var url = config.api.url+'actie';
            $http({
                url:url,
                method:"POST",
                data: body
            }).success(function (data, status, headers, config) {
                    alert('de actie is gestart');
                    $state.transitionTo("main.actie.actieOverview");
                })
                .error(function(data, status, headers, config){
                    alert('Gegevens konden niet opgeslagen worden.');
                });
   }
});
