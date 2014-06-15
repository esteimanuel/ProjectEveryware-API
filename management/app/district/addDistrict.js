/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

app.controller('addDistrictCtrl', function($scope, $http, $timeout, $state, $sce, $rootScope) {    
    var navs = [[
        {name:'Wijk toevoegen', active:true, state:'main.district.addDistrict'}, 
        {name:'Overzicht', state:'main.district.districtOverview'}]];
    $rootScope.setNavs(navs); 
    
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
    
    //Create array with alfabet to loop for adding zip range
    var alfa = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    
    
    //Function to add ZIP code
    $scope.addPostcode = function(postcode, wijk){
       // AddRangeZip(postcode.rangeStart, postcode.rangeEnd);
        //If no data notify
        addWijkIfNotEist(wijk, postcode);
        if(postcode === undefined){
            return;
        }
        
        //Check the type to add
        $scope.addSingle = false;
        $scope.addRangeTry = false;
        
        if(postcode.single){
            $scope.addSingle = true;
        };
        if(postcode.rangeStart && postcode.rangeEnd){
            $scope.addRangeTry = true;
        };
        
        if($scope.addRangeTry && $scope.addSingle){
            alert("Voeg of een range of een enkele postcode in");
            return;
        }
    };
   
   function addWijkIfNotEist(wijk, postcode){
        //If wijk not set add, else update
        if(!$scope.currentWijkId){
            var body = {status_list_id: 1, wijk_naam: wijk.name, beschikbaar: wijk.avalible, target: wijk.target, actie_duur_dagen: wijk.duration, aantal_huishoudens: wijk.totalHousholds};
            var url = config.api.url+'wijk';

            $http({
                url:url,
                method:"POST",
                data: body
            }).success(function (data, status, headers, config) {
                $scope.currentWijkId = data.id;
                
                alert('Wijkdata is toegevoegd');
        
                    if($scope.addSingle){
                        AddSingleZip(postcode.single);
                    }

                    if($scope.addRangeTry){
                        if(!rege.test(postcode.rangeStart)){
                            alert("De postcode range start voldoet niet enkel as voorbeeld \r\n\r\n 1111AA");
                            return;
                        }
                        if(!rege.test(postcode.rangeEnd)){
                            alert("De postcode range eind voldoet niet enkel as voorbeeld \r\n\r\n 1111AA");
                            return;
                        }
                        AddRangeZip(postcode.rangeStart, postcode.rangeEnd)
                    }
                })
                .error(function(data, status, headers, config){
                alert('Gegevens konden niet opgeslagen worden.');
                });
       }
       else{
            var body = {id: $scope.currentWijkId ,wijk_naam: $scope.wijk.name, beschikbaar: $scope.wijk.avalible, target: $scope.wijk.target, actie_duur_dagen: $scope.wijk.duration, aantal_huishoudens: $scope.wijk.totalHousholds};
            var url = config.api.url+'wijk';

            $http({
                url:url,
                method:"put",
                data: body
            }).success(function (data, status, headers, config) {
                alert('Wijkdata is bijgewerkt');
        
                    if($scope.addSingle){
                        AddSingleZip(postcode.single);
                    }

                    if($scope.addRangeTry){
                        if(!rege.test(postcode.rangeStart)){
                            alert("De postcode range start voldoet niet enkel as voorbeeld \r\n\r\n 1111AA");
                            return;
                        }
                        if(!rege.test(postcode.rangeEnd)){
                            alert("De postcode range eind voldoet niet enkel as voorbeeld \r\n\r\n 1111AA");
                            return;
                        }
                        AddRangeZip(postcode.rangeStart, postcode.rangeEnd)
                    }
                })
                .error(function(data, status, headers, config){
                alert('Gegevens konden niet opgeslagen worden.');
                });
       }
   };
   
   
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
   
   function AddRangeZip(start, end){
       //Split start to loop       
       var startNumbers = parseInt(start.slice(0, 4));
       var startAlfa1= alfa.indexOf(start.charAt(4));
       var startAlfa2= alfa.indexOf(start.charAt(5));
       //Split end to loop
       var endNumbers = parseInt(end.slice(0, 4));
       var endAlfa1 = alfa.indexOf(end.charAt(4));
       var endAlfa2 = alfa.indexOf(end.charAt(5));
       
       //Loop for digits
       for (startNumbers; startNumbers < endNumbers; startNumbers++){
           for(startAlfa1; startAlfa1 < alfa.length; startAlfa1++){
               for(startAlfa2; startAlfa2 < alfa.length; startAlfa2++){
                    AddSingleZip(startNumbers + alfa[startAlfa1] + alfa[startAlfa2]);
               }
               //Reset alfa 2 after finish
               startAlfa2 = 0;
           }
           //Reset alfa1 after finish
           startAlfa1 = 0;
       }
       
       //Loop for first letter
       if(startNumbers === endNumbers){
           for(startAlfa1; startAlfa1 < endAlfa1; startAlfa1++){
               for(startAlfa2; startAlfa2 < alfa.length; startAlfa2++){
                    AddSingleZip(startNumbers + alfa[startAlfa1] + alfa[startAlfa2]);
               }
               //Reset alfa 2 after finish
               startAlfa2 = 0;
           }
       }
       
       //Loop for last letter
       if(startAlfa1 === endAlfa1){
               for(startAlfa2; startAlfa2 <= endAlfa2; startAlfa2++){
                    AddSingleZip(startNumbers + alfa[startAlfa1] + alfa[startAlfa2]);
               }
       }
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
        
        //Update in API
        var body = {"postalcode": Zip, "wid": $scope.currentWijkId};
        var url = config.api.url+'postcode/editDistrictId';

        $http({
            url:url,
            method:"PUT",
            data: body
        }).success(function (data, status, headers, config) {
            console.log(data);
            })
            .error(function(data, status, headers, config){
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
   
   function refreshMap(){       
        $scope.mapsUrl = $sce.trustAsResourceUrl("http://glassy-web.avans-project.nl/?wijk=" + $scope.currentWijkId);
   }
});
