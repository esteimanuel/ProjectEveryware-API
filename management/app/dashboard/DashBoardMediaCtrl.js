/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

app.controller('DashBoardMediaCtrl', function($scope, $timeout, $http) {
    $scope.tableClass = 'table-striped';
    $scope.headers = [
        {name: "wijk_id", type:"number", header:"Wijk nummer"},
        {name:"wijk_naam", type:"text", header:"Wijk naam"},
        {name:"beschikbaar", type:"checkbox", header:"Beschikbaar"},
        {name:"target", type:"text", header:"Target"},
        {name:"aantal_huishoudens", type:"text", header:"Huishoudes"},
        {name:"actie_duur_dagen", type:"text", header:"Duur"},
    ];
    
    $scope.rows = [];
    $scope.FilterResults = function(filterBy){
        
    };
    
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
    $scope.getData();     
    
    $scope.allowEdit = false;
    $scope.allowDelete = false;
    
    $timeout(function() {
        $scope.draw();
    },200);
});
