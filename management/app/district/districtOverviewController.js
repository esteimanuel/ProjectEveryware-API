/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

app.controller('districtOverviewCtrl', function($scope, $http, $state) {
    $scope.tableClasses = null;
    $scope.tableClasses = "table-striped";
    
    //Set header names for binding
    $scope.headers = [
        {name: "wijk_id", type:"number", header:"Wijk nummer"},
        {name:"wijk_naam", type:"text", header:"Wijk naam"},
        {name:"beschikbaar", type:"checkbox", header:"Beschikbaar"},
        {name:"target", type:"text", header:"Target"},
        {name:"aantal_huishoudens", type:"text", header:"Huishoudes"},
        {name:"actie_duur_dagen", type:"text", header:"Duur"},
    ];
    
    $scope.rows = [];
    
    $scope.getData = function() {
        var url = config.api.url+'wijk';
        $http({
            url: url,
            method: 'GET'
        }).success(function(data, status, headers, config) {
            console.log("Wijkdata load succesfull");
            $scope.rows = data;
            $scope.draw();
        }).error(function(data, status, headers, config) {
            console.log("Wijkdata load failed /r/n/r/n Reson: /r/n" + headers);
        });
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
            })
            .error(function(data, status, headers, config){
                alert('Postcode verwijderen mislukt.');
            });
   };
    
    
    $scope.getData();     
    
    $scope.onEditClick = function(rowData){
        $state.transitionTo("main.district.editDistrict", {'wid':rowData[0].value});
    };
});
