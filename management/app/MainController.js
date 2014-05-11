/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

app.controller('MainCtrl', function($scope, $http, $state, User) {
    $scope.app = config.app;
    
    $scope.indexList = function(indexes) {
        return new Array(indexes);
    };
    
    $scope.login = function(credentials) {
            $http({url: config.api.url + 'account/login',method:'GET',params:credentials}).success(function(data, status) {
                console.log("Token has been received");
                localStorage.token = data.account.token;
                User.data.isLogged = data.account.token;
                User.data.token = data.account.token;
                $state.transitionTo('main.dashboard.districts');
            }).error(function(data, status, headers, config) {
                console.log("Login file data not accepted");
                $scope.errorMessage = "Inloggegevens zijn incorrect";
            });
    };
    
    $scope.logout = function(){
        localStorage.removeItem("token");
        User.data.isLogged = false;
        User.data.token = null;
        $state.transitionTo('login');
    };
});