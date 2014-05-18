/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

app.controller('UserTableCtrl', function($scope, $http) {
    $scope.tableClasses = "table-striped";
    $scope.headers = [
        {name: "account_id", type:"number", header:"Custom"},
        {name:"email"},
        {name:"validated",type:"checkbox"},
        {name:"token", header:'Token'}
    ];
    $scope.cellOrder = ["account_id", "email", "validated", "token"];

    //$scope.rows = [{id:"item1", name:"item2", header3: "item3"},{id: "waarde",name: "ding", w:"waarde"}];
    //console.log($scope.rows);
    $scope.rows = [];
    
    $scope.getData = function() {
        var url = config.api.url+'account';
        $http({
            url: url,
            method: 'GET'
        }).success(function(data, status, headers, config) {
            console.log(data);
            $scope.rows = data;
            $scope.draw();
            //$scope.addNewRows();
        }).error(function(data, status, headers, config) {
            console.log(data);
        });
    }
    
    $scope.add = function() {
        $scope.rows.push({
            account_id: 100,
            email: "Iets@Iets.Iets",
            validated: false,
            token: "token please"
        });
        $scope.rows.push({
            account_id: 100,
            email: "Iets@Iets.Iets",
            validated: false,
            token: "token please"
        });
        $scope.addNewRows();
    }
    
    $scope.filterList = function() {
        $scope.filter({
            'email':'c',
            'validated': true
        });
    }
    
    $scope.clear = function() {
        $scope.clearFilter();
    }
    
    $scope.getData(); 
    
});
