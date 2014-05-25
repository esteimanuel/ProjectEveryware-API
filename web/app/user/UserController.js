console.log("loaded user controller");
app.controller('UserCtrl', function($scope, $rootScope, $stateParams, $state, $location, $http, srvAuth, User) {

    $scope.user = {};

    //$rootScope.user = {
    //    isLogged: !!(localStorage.token),
    //    token: localStorage.token
    //};
    
    $scope.toggleLogin = function() {$scope.views.showLogin = !$scope.views.showLogin;};
    
    $scope.login = function() {
       

        var params = {email: $scope.login.email, wachtwoord: $scope.login.password};
        
        $http({
            url: config.api.url + 'account/login',
           // url: '/ProjectEveryware-API/api/account/login',
            method: 'GET',
            params: params
        })
            .success(function (data, status, headers, config) {
//                localStorage.token = data.account.token;
//                $rootScope.user = data.account;
//                $rootScope.user.isLogged = true;
                $scope.fillUserWithData(data);
                
                $rootScope.$broadcast('onUserLogin');
                //$scope.user.isLogged = true;
//                console.log($rootScope.user);

                $scope.toggleLogin();
            })
            .error(function (data, status, headers, config) {
                var message = "";
                switch(status) {
                    case 404:
                        message = "Ongeldige gebruikersnaam of wachtwoord"
                        break;
                }
                $scope.login.errorMessage = message;
        })
    };
    
    $scope.logout = function() {
//        localStorage.removeItem("token");
//        $rootScope.user.isLogged = false;
        User.reset();
        $scope.setValuesFromUser();
        srvAuth.logout();
        $rootScope.$broadcast('onUserLogout');
    };

    $scope.register = function () {
        $scope.register.working = true;
//        $scope.register.error.email = false;
//        $scope.register.error.password = false;
//        $scope.register.error.summary = false;
//        var valid = true;
//        if(!$scope.register.email) {
//            $scope.register.error.email = "Email is required";
//            valid = false;
//        }
//        if(!$scope.register.password) {
//            $scope.register.error.password = "Password is required";
//            valid = false;
//        }
        
//        if(valid) {
            var body = {email: $scope.register.email, wachtwoord: $scope.register.password};
            //var url = "http://localhost/ProjectEveryware-API/api/account/register";
            var url = config.api.url+'account/register';

            $http({
                url:url,
                method:"POST",
                data: body
            })
            .success(function (data, status, headers, config) {
    //            localStorage.token = data.account.token;
    //            $rootScope.user = data.account;
    //            $rootScope.user.isLogged = true;
                $scope.fillUserWithData(data);
                $rootScope.$broadcast('onUserLogin');
                
                $rootScope.showMessage("Successvol geregistreerd!", "success");
                $scope.register.working = false;
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
                $scope.register.summary = message;
                $scope.register.working = false;
            });
//        } else {
//            var message = (($scope.register.error.email) ? $scope.register.error.email + "\n" : '') + (($scope.register.error.password) ? $scope.register.error.password + "\n" : '');
//            
//            $scope.error.register.summary = message;
//        }
    };  
    
    $scope.$on('onUserDataChanged', function() {
        $scope.setValuesFromUser();
        $rootScope.$broadcast('onUserDataUpdated');
    });
    
    $scope.setValuesFromUser = function() {
        $scope.user.isLogged = User.isLogged;
        $scope.user.account = User.account;
        $scope.user.gebruiker = User.gebruiker;
    }
    
    $scope.fillUserWithData = function(data) {
        var tmpGebruiker = data.account.gebruiker;
        delete data.account.gebruiker;

        User.setAccount(data.account, true);
        User.setGebruiker(tmpGebruiker, true);
        User.setLogged(true);

        $scope.setValuesFromUser();
    }
    
    User.init();
    $scope.setValuesFromUser();
    $rootScope.initDistrict();
//    console.log(User.account.token);
    
    $scope.views = {
        showLogin: ($location.search().login == 1 && !User.isLogged)
    };
//    $scope.user.isLogged = User.isLogged;
    
});
