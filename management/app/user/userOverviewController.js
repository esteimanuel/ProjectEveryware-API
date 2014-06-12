app.controller('userOverviewCtrl', function($scope, $http, $rootScope) {
    var navs = [[
        {name:'Toevoegen', state:'main.users.addUser'},
        {name:'Overzict', active:true, state:'main.users.userOverview'}]];
    $rootScope.setNavs(navs); 
    
    $scope.tableClasses = "table-striped";
    $scope.headers = [
        {name: "account_id", type:"number", header:"#"},
        {name:"email"},
        {name:"validated",type:"checkbox"}
    ];
    
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
    };
    
    $scope.onEditClick = function(data) {
        alert("Edit click");
        console.log(data);
        return true;
    };
    
    $scope.getData(); 
    
});
