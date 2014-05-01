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

        var url = "http://localhost/ProjectEveryware-API/api/AccountController/login";
        var body = { username: $scope.user.email, password: $scope.user.password };

        console.log($scope);
        console.log(body);

        $http.post(url, body)
        .success(function (data, status)
        {
            // localStorage.token = "tmp";
            // $scope.user.isLogged = true;
            console.log(data);
            console.log(status);
        })
        .error(function (data, status)
        {
            console.log(data);
            console.log(status);
        });
    };
    
    $scope.logout = function() {
        localStorage.removeItem("token");
        $scope.user.isLogged = false;
    };
    
});
