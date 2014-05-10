app.controller('LoginCtrl', function($scope, $http, $state, User) {
    $scope.login = function(credentials) {
            console.log(credentials);
            $http({url: config.api.url + 'account/login',method:'GET',params:credentials}).success(function(data, status) {
                    console.log("Token has been received");
                    localStorage.token = data.account.token;
                    User.data.isLogged = data.account.token;
                    User.data.token = data.account.token;
                    $state.transitionTo('main.dashboard');
            }).error(function(data, status, headers, config) {
                    console.log("Login file data not accepted");
            })
    }
    
    $scop.logout = function(){
        localStorage.removeItem(token);
        User.data.isLogged = false;
        User.data.token = null;
        $state.transitionTo('/login');
    }
});