app.controller('userOverviewCtrl', function($scope, $http, $rootScope, $state) {
    var navs = [[{name:'Overzict', active:true, state:'main.users.userOverview'}]];
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
    
    $scope.onEditClick = function(rowData) {
        $state.transitionTo("main.users.editUser", {'uid':rowData[0].value});
        return;
    };
    
    $scope.getData(); 
    
});
