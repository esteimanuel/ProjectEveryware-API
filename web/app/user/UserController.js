console.log("loaded user controller");
app.controller('UserCtrl', function($scope, $stateParams, $state, $location, $http) {
    $scope.views = {
        showLogin: ($location.search().login == 1)
    };
    $scope.user = {
        isLogged: !!(localStorage.token),
        token: localStorage.token,
        name: 'Guest',
        isAdmin: false
    };
    
    $scope.toggleLogin = function() { $scope.views.showLogin = !$scope.views.showLogin; };
    
    $scope.login = function() {
        $scope.toggleLogin();

        var params = { email: $scope.user.email, wachtwoord: $scope.user.password };

        $http({
            url: '/ProjectEveryware-API/api/account/login',
            method: 'GET',
            params: params
        })
            .success(function (data, status, headers, config) {
                 localStorage.token = data.token;
                 $scope.user.isLogged = true;
            })
            .error(function (data, status, headers, config) {
            alert("Login information was wrong"); 
        })
    };
    
    $scope.logout = function() {
        localStorage.removeItem("token");
        $scope.user.isLogged = false;
    };

    $scope.register = function () {
        var body = { email: $scope.user.email, wachtwoord: $scope.user.password };
        var url = "http://localhost/ProjectEveryware-API/api/account/register";

        $http.post(url, body)
        .success(function(data, status, headers, config) {
            console.log("gelukt");
        })
        .error(function(data, status, headers, config){
            console.log("fail");
        });
    };

    $scope.getUserInfo = function () {
        var params = { token: localStorage.token }

        $http({
            url: '',
            method: 'GET',
            params: params
        })
        .success(function (data, status, headers, config) {
            console.log("gelukt");
        })
        .error(function (data, status, headers, config) {
            console.log("fail");
        });
    };
    
});
