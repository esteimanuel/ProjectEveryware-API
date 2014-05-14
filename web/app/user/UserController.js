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
                $rootScope.user = data.account;

                console.log($rootScope.user);
                   // $rootScope.user.name = data.account.email;
                    //$rootScope.user.fotolink = data.account.foto_link;
                   // $rootScope.user.isLogged = true;

                $scope.toggleLogin();
            })
            .error(function (data, status, headers, config) {
                var message = "";
                switch(status) {
                    case 404:
                        message = "Ongeldige gebruikersnaam of wachtwoord"
                        break;
                }
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
        var url = config.api.url+'account/register';

        $http({
            url:url,
            method:"POST",
            data: body
        })
        .success(function (data, status, headers, config) {
            localStorage.token = data.account.token;
            $scope.user.isLogged = true;

        })
        .error(function(data, status, headers, config){
            var message = "";
            switch(status) {
                case 404:
                    message = "De gebruiker kan niet worden gevonden om in te loggen";
                    break;
                case 400:
                    for(var error in data.messages) {
                        if(error.message.indexOf("unique") !== -1 && error.field === "email") {
                            message = "Dit email adres is al in gebruik";
                        }
                    }
                    break;
            }
            $scope.register.errorMessage = message;
        });
    };  
});
