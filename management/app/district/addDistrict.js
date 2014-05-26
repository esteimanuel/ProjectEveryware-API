/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

app.controller('addDistrictCtrl', function($scope, $http, $timeout, $state, $sce) {
    //Regular expression to check zip
    var rege = /^[1-9][0-9]{3}[a-z]{2}$/i;
    
    $scope.mapsUrl = $sce.trustAsResourceUrl("http://glassy-web.avans-project.nl/?wijk=" + $scope.currentWijkId);
    
    $scope.tableClasses = "table-striped";
    $scope.allowEdit = false;
    
    //Set header names for binding
    $scope.headers = [
        {name: "postcode", type:"text", header:"Postcode"}
    ];
    
    $scope.rows = [];
    
    //Create array with alfabet to loop for adding zip range
    var alfa = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    
    
    //Function to add ZIP code
    $scope.addPostcode = function(postcode, wijk){
        //If no data notify
        if(postcode === undefined){
            alert("Waarom druk je op de knop? Je hebt niks ingevuld");
        }
        
        //Check the type to add
        var addSingle = false;
        var addRange = false;
        var addRangeTry = false;
        
        if(postcode.single){
            addSingle = true;
        };
        if(postcode.rangeStart || postcode.rangeEnd){
            addRangeTry = true;
        };
        
        if(addRangeTry && addSingle){
            alert("1 ding tegelijk, moet niet te veel willen");
            return;
        }
        
        if(!addRangeTry && !addSingle){
            alert("Waarom druk je op de knop? Je hebt niet alles ingevuld");
            return;
        }
        
        if(!addSingle && !addRange){
            alert("Om een range toe te voegen moet je start en eind definen");
            return;
        }
        
        addWijkIfNotEist(wijk)
        
        if(addSingle){
            if(!rege.test(postcode.single)){
                alert("De postcode voldoet niet enkel as voorbeeld \r\n\r\n 1111AA");
                return;
            }
            $timeout(AddSingleZip(postcode.single), 500);
        }
        
        //Reload Map
        $scope.currentWijkId = $sce.trustAsResourceUrl("http://glassy-web.avans-project.nl/?wijk=" + $scope.currentWijkId);
    };
   
   function addWijkIfNotEist(wijk){
        //If wijk not set add, else update
        if(!localStorage.currentWijkId){
            var body = {wijk_naam: wijk.name, beschikbaar: wijk.avalible, target: wijk.target, actie_duur_dagen: wijk.duration, aantal_huishoudens: wijk.totalHousholds};
            var url = config.api.url+'wijk';

            $http({
                url:url,
                method:"POST",
                data: body
            }).success(function (data, status, headers, config) {
                alert(data.id);
                localstorage.currentWijkId = data.id;
                alert(localstorage.currentWijkId);
                })
                .error(function(data, status, headers, config){
                alert('Gegevens konden niet opgeslagen worden.');
                });
       }
   };
   
   function AddRangeZip(start, end){
       
   }
   
   function AddSingleZip(Zip){
        //Check if zip already in list
        if(!checkIfZipFree(Zip)){
            return;
        }
        $scope.rows.push({
            postcode: Zip
        });
        $scope.addNewRows();
        
        alert($scope.currentWijkId);
        
        //Update in API
        var body = {_token: localStorage.token, postalcode: Zip, wid: localstorage.currentWijkId};
        var url = config.api.url+'postcode/editDistrictId';
        
        $http({
            url:url,
            method:"PUT",
            data: body
        }).success(function (data, status, headers, config) {
            alert(data);
            alert(headers);
            alert('succes');    
            })
            .error(function(data, status, headers, config){
                alert(data);
                alert(headers);
                alert('fail');
            });
   }
   
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
