/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

app.controller('MainCtrl', function($rootScope, $scope, $http, $state, User, $timeout) {
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
                console.log("URL:" + {url: config.api.url + 'account/login',method:'GET',params:credentials})
                console.log(data);
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
    
    $rootScope.global = {};
    
    $rootScope.showMessage = function(message, type, time) {
        $rootScope.global._message = message;
        $rootScope.global._messageType = type;
        $rootScope.global._messageVisible = true;
        
        $timeout(function() {
            $rootScope.global._messageVisible = false;
        }, (time) ? time : 5000);
    }
    
});