console.log("loaded user controller");
app.controller('UserCtrl', function($scope, $rootScope, $stateParams, $state, $location, $http, srvAuth) {
    $scope.views = {
        showLogin: ($location.search().login == 1)
    };
    $rootScope.user = {
        isLogged: !!(localStorage.token),
        token: localStorage.token
    };
    
    $scope.toggleLogin = function() { $scope.views.showLogin = !$scope.views.showLogin; };
    
    $scope.login = function() {
       

        var params = { email: $scope.login.email, wachtwoord: $scope.login.password };

        $http({
            url: config.api.url + 'account/login',
           // url: '/ProjectEveryware-API/api/account/login',
            method: 'GET',
            params: params
        })
            .success(function (data, status, headers, config) {
                localStorage.token = data.account.token;
                    $rootScope.user.name = data.account.email;
                    $rootScope.user.fotolink = data.account.foto_link;
                    $rootScope.user.isLogged = true;

                $scope.toggleLogin();
            })
            .error(function (data, status, headers, config) {
                $scope.login.errorMessage = "Er ging iets fout probeer het opnieuw!";
        })
    };
    
    $scope.logout = function() {
        localStorage.removeItem("token");
        $rootScope.user.isLogged = false;
        srvAuth.logout();
    };

    $scope.register = function () {
        var body = { email: $scope.register.email, wachtwoord: $scope.register.password };
        //var url = "http://localhost/ProjectEveryware-API/api/account/register";
        var url = config.api.url + 'account/login';

        $http.post(url, body)
        .success(function (data, status, headers, config) {
            console.log(data);
            localStorage.token = data.account.token;
            $scope.user.isLogged = true;

        })
        .error(function(data, status, headers, config){
            $scope.register.errorMessage = "Account is al in gebruik";
            console.log(data, status, "ik ben gefaald");
        });
    };  
});
