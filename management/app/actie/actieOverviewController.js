/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

app.controller('actieOverviewCtrl', function($scope, $http, $state) {
    $scope.tableClasses = null;
    $scope.tableClasses = "table-striped";
    
    //Set header names for binding
    $scope.headers = [
        {name: "actie_id", type:"number", header:"Actie nummer"},
        {name:"naam", type:"text", header:"Actie naam"},
        {name:"borg", type:"text", header:"Borg"},
        {name:"start_datum", type:"text", header:"Actie start"},
        {name: "eind_datum", type:"number", header:"Actie eind"}
    ];
    
    $scope.rows = [];
    
    $scope.getData = function() {
        var url = config.api.url+'actie';
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
   
   $scope.removeRow = function(row){     
        //Reset in API
        var body = {"id": row[0].value};
        console.log(body);
        var url = config.api.url+'actie/';
        
        $http({
            url:url,
            method:"DELETE",
            data: body
        }).success(function (data, status, headers, config) {
            })
            .error(function(data, status, headers, config){
                alert('actie verwijderen mislukt.');
            });
   };
    
    
    $scope.getData();     
    
    $scope.onEditClick = function(rowData){
        $state.transitionTo("main.actie.editActie", {'aid':rowData[0].value});
    };
});
