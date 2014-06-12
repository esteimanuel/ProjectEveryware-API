/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

app.controller('actionFollowersCtrl', function($scope, $http, $timeout, $state, $sce, $stateParams, $rootScope) {  
    //Get actie id
    $scope.actieId = $stateParams.aid;
    
    GetDataForActie();
    GetAndPrepUsers();
    
    //Set header names for table
    $scope.headers = [
        {name:"nr", type:"number", header:"#"},
        {name:"naam", type:"text", header:"Naam"},
        {name:"phone", type:"text", header:"Telefoon"},
        {name:"borg", type:"text", header:"Borg betaald"},
        {name:"provider", type:"text", header:"Provider keuze"}
    ];
    //Disable modifiers
    $scope.allowEdit = false;
    $scope.allowDelete = false;
    $scope.rows = [];
    
    //Vars to keep stats
    $scope.totalBorg = 0;
    $scope.totalUsers = 0;
    
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
    
    //Gets all users for action and preps data for display
    function GetAndPrepUsers(){
        var url = config.api.url + "actie/users?id=" + $scope.actieId;
        $http({
            url: url,
            method: 'GET'
        }).success(function(data, status, headers) {
            data.forEach(function(user) {
                console.log(user);
                var fullName = user.voornaam + " ";
                //Prevent duble space with middle name
                if(user.tussenvoegsel || user.tussenvoegsel !== null){
                    fullName += user.tussenvoegsel + " ";
                }
                fullName += user.achternaam;
                
                var borgBetaald = "Nee";
                if(user.borg_betaald){
                    borgBetaald = "Ja";
                    $scope.totalBorg = $scope.totalBorg + 1;
                }
                
                var phone = "";
                if(user.telefoonnummer || user.telefoonnummer !== null){
                    phone = "0" + user.telefoonnummer;
                }
                
                var selectedProvider = "";
                if(user.provider_id || user.provider_id !== null){
                    var providerUrl = config.api.url + "provider?id=" + user.provider_id;
                    $http({
                        url: providerUrl,
                        method: 'GET'
                    }).success(function(data, status, headers, config) {
                        selectedProvider = data.naam;
                        $scope.rows.push({
                            nr: user.gebruiker_id,
                            naam: fullName,
                            phone: phone,
                            borg: borgBetaald,
                            provider: selectedProvider
                        });
                        $scope.addNewRows();
                    }).error(function(data, status, headers, config) {
                        $scope.rows.push({
                            nr: user.gebruiker_id,
                            naam: fullName,
                            phone: phone,
                            borg: borgBetaald,
                            provider: selectedProvider
                        });
                        $scope.addNewRows();
                    });
                }
                else{
                    $scope.rows.push({
                        nr: user.gebruiker_id,
                        naam: fullName,
                        phone: phone,
                        borg: borgBetaald,
                        provider: selectedProvider
                    });
                    $scope.addNewRows();
                }
                $scope.totalUsers = $scope.totalUsers + 1;
            });
            $scope.addNewRows();      
            console.log("User load succes");
        }).error(function(data, status, headers, config) {
            console.log("User load failed");
        });
    }
});
