/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

app.controller('DashBoardUsersCtrl', function($scope, $timeout, $http) {
    $scope.tableClass = 'table-striped';
    $scope.headers = [
        {name: "account_id", type:"number", header:"Gebruiker nummer"},
        {name:"email", type:"text", header:"Email"},
        {name:"validated", type:"checkbox", header:"Geverifiërd"},
        {name:"accountlevel_id", type:"text", header:"Niveau"}
    ];
    
    $scope.rows = [];
    
    $scope.FilterResults = function(filterBy){
        
    };
    
    $scope.getData = function() {
        var url = config.api.url+'account';
        $http({
            url: url,
            method: 'GET'
        }).success(function(data, status, headers, config) {
            console.log("Accountdata load succesfull");
            $scope.rows = data;
            $scope.draw();
        }).error(function(data, status, headers, config) {
            console.log("Accountdata load failed /r/n/r/n Reson: /r/n" + headers);
        });
    };    
    $scope.getData();     
    
    $scope.allowEdit = false;
    $scope.allowDelete = false;
    
    $timeout(function() {
        $scope.draw();
    },200);
});
