/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

app.controller('editDistrictCtrl', function($scope, $http, $timeout, $state, $sce, $rootScope, $stateParams) {    
    var navs = [[
        {name:'Wijk toevoegen', state:'main.district.addDistrict'}, 
        {name:'Wijk beheren', state:'main.district.districtOverview'}]];
    $rootScope.setNavs(navs);
    
    //Get the district to edit
    $scope.currentWijkId = $stateParams.wid;
    console.log($scope.currentWijkId);
    
    //Regular expression to check zip
    var rege = /^[1-9][0-9]{3}[a-z]{2}$/i;
    
    refreshMap();
    
    $scope.tableClasses = "table-striped";
    $scope.allowEdit = false;
    
    //Set header names for binding
    $scope.headers = [
        {name: "postcode", type:"text", header:"Postcode"}
    ];
    
    $scope.rows = [];
    GetDataForWijk();
    
    //Create array with alfabet to loop for adding zip range
    var alfa = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
        
    function GetDataForWijk(){
        ///////////////////
        //Wijk
        ///////////////////  
        var url = config.api.url + 'wijk?id=' + $scope.currentWijkId;
        $http({
            url: url,
            method: 'GET'
        }).success(function(data, status, headers, config) {
            console.log("Wijkdata load succesfull");
        console.log(data);    
        $scope.wijk = {name: data.wijk_naam, avalible: data.beschikbaar, target: data.target, duration: data.actie_duur_dagen, totalHousholds: data.aantal_huishoudens};
        console.log($scope.wijk);
        }).error(function(data, status, headers, config) {
            console.log("Wijkdata load failed");
        });
        ///////////////////
        //Postcodes
        ///////////////////
        var url = config.api.url + 'postcode/ForDistrict?id=' + $scope.currentWijkId;
        $http({
            url: url,
            method: 'GET'
        }).success(function(data, status, headers, config) {
            console.log("Postcode load succesfull");
            $scope.rows = data;
            $scope.draw();
        }).error(function(data, status, headers, config) {
            console.log("Postcode load failed");
        });
    }
    
    //Function to add ZIP code
    $scope.addPostcode = function(postcode, wijk){
        
       // AddRangeZip(postcode.rangeStart, postcode.rangeEnd);
        //If no data notify
        if(postcode === undefined){
            updateWijkIfNotEist(wijk, postcode);
            return;
        }
        
        //Check the type to add
        var addSingle = false;
        var addRangeTry = false;
        
        if(postcode.single){
            addSingle = true;
        };
        if(postcode.rangeStart || postcode.rangeEnd){
            addRangeTry = true;
        };
        
        if(addRangeTry && addSingle){
            alert("Voeg of een range of een enkele postcode in");
            return;
        }
        
        if(addRangeTry)
            if(!rege.test(postcode.rangeStart)){
                alert("De postcode range start voldoet niet enkel as voorbeeld \r\n\r\n 1111AA");
                return;
            }
            if(!rege.test(postcode.rangeEnd)){
                alert("De postcode range eind voldoet niet enkel as voorbeeld \r\n\r\n 1111AA");
                return;
            }
            
            AddRangeZip(postcode.rangeStart, postcode.rangeEnd);
    };
   
   //Updates the wijk data "TOP BLOCK OF FORM"
   function updateWijkIfNotEist(wijk, postcode){
        //If wijk not set add, else update
        if($scope.currentWijkId){
            var body = {id: $scope.currentWijkId ,wijk_naam: wijk.name, beschikbaar: wijk.avalible, target: wijk.target, actie_duur_dagen: wijk.duration, aantal_huishoudens: wijk.totalHousholds};
            var url = config.api.url+'wijk';

            $http({
                url:url,
                method:"put",
                data: body
            }).success(function (data, status, headers, config) {
                alert('Wijkdata is bijgewerkt');
                })
                .error(function(data, status, headers, config){
                alert('Gegevens konden niet opgeslagen worden.');
                });
       }
   };
   function AddRangeZip(start, end){
       //Split start to loop       
       var startNumbers = parseInt(start.slice(0, 4));
       var startAlfa1= alfa.indexOf(start.charAt(4));
       var startAlfa2= alfa.indexOf(start.charAt(5));
       //Split end to loop
       var endNumbers = parseInt(end.slice(0, 4));
       var endAlfa1 = alfa.indexOf(end.charAt(4));
       var endAlfa2 = alfa.indexOf(end.charAt(5));
       
       for (startNumbers; startNumbers < endNumbers; startNumbers++){
           for(startAlfa1; startAlfa1 < alfa.length; startAlfa1++){
               for(startAlfa2; startAlfa2 < alfa.length; startAlfa2++){
                   console.log("Postcode: " + startNumbers + alfa[startAlfa1] + alfa[startAlfa2]);
               }
               //Reset alfa 2 after finish
               startAlfa2 = 0;
           }
           //Reset alfa1 after finish
           startAlfa1 = 0;
       }
       
       if(startNumbers === endNumbers){
           for(startAlfa1; startAlfa1 <= endAlfa1; startAlfa1++){
               
           }
       }
   }
   
   function AddSingleZip(Zip){
        //Check if zip already in list
        if(!checkIfZipFree(Zip)){
            return;
        }        
        //Update in API
        var body = {"postalcode": Zip, "wid": $scope.currentWijkId};
        var url = config.api.url+'postcode/editDistrictId';
        
        console.log(body);

        $http({
            url:url,
            method:"PUT",
            data: body
        }).success(function (data, status, headers, config) {
            //Only add row on succes
            $scope.rows.push({
                postcode: Zip
            });
            $scope.addNewRows();
            //Reload Map
            refreshMap();
            })
        .error(function(data, status, headers, config){
        });
   }
   
   //Reset zip in DB by clicking delete in table
   $scope.removeRow = function(row){     
        //Reset in API
        var body = {"postalcode": row[0].value};
        console.log(body);
        var url = config.api.url+'postcode/resetDistrictId';
        
        $http({
            url:url,
            method:"PUT",
            data: body
        }).success(function (data, status, headers, config) {
            console.log(data);
            refreshMap();
            })
            .error(function(data, status, headers, config){
                alert('Postcode verwijderen mislukt.');
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
   
   function refreshMap(){       
        var mapFrame = document.getElementById('mapFrame');
        $scope.mapsUrl = $sce.trustAsResourceUrl("http://glassy-web.avans-project.nl/?wijk=" + $scope.currentWijkId);
   }
});
