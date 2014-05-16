app.controller('WijkCtrl', function ($scope, $stateParams, $state, $http, $sce, User, $rootScope) {

    $scope.actie = {};
    $scope.mapsUrl = "";

    //get wijk info van ingelogd persoon
    $scope.getActieInfo = function () {
        if(!$stateParams.wid) {
            $state.transitionTo('home');
            return;
        }
        
        var params = {id: $stateParams.wid}

        $http({
            url: config.api.url + 'actie',
            method: 'GET',
            params: params
        })
        .success(function (data, status, headers) {
            if(!data) {
                $state.transitionTo('home');
            }
            
            $scope.actie = data;
            
            $scope.initUserStateMessage();
            
            document.title = $scope.actie.naam + " - " + config.app.name;
            $scope.getActieDeelnemers();
            $scope.mapsUrl = $sce.trustAsResourceUrl($scope.getMapsUrl());
        })
        .error(function (data, status, headers, config) {
            console.log("failure");
        })
    }

    //get all wijk deelnemers
    $scope.getActieDeelnemers = function () {
        var params = {id: $scope.actie.actie_id}

        $http({
            url: config.api.url + 'actie/users',
            method: 'GET',
            params: params
        })
       .success(function (data, status, headers, config) {
            $scope.actie.deelnemers = data;
            $scope.actie.deelnemersCount = $scope.actie.deelnemers.length;
         })
        .error(function (data, status, headers, config) {
            console.log("failure");
        })
    }
    
    $scope.getMapsUrl = function() {
        return "http://glassy-web.avans-project.nl/?wijk=" + $scope.actie.wijk_id;
    }

    $scope.handleStateButton = function() {
        //console.log(User.gebruiker.actie_id);
        if(User.gebruiker.actie_id === $scope.actie.actie_id) {
            // Handle state current user's action
            
        } else if(!User.gebruiker.actie_id)
            // Handle add user to action
            $scope.addUserToAction();
    }
    
    $scope.addUserToAction = function() {
        //User.gebruiker.actie_id = $scope.actie.actie_id;
        var tempActieId = $scope.actie.actie_id;
        $http({
            url: config.api.url + "gebruiker",
            method: "PUT",
            data: {
                _token: User.account.token,
                actie_id: tempActieId
            }
        }).success(function(data, status) {
            User.gebruiker.actie_id = tempActieId;
            User.setGebruiker(User.gebruiker, true);
            $scope.initUserStateMessage();
            $rootScope.$broadcast('onUserDataChanged');
        }).error(function(data, status) {
            $rootScope.showMessage('Something went wrong while adding user to action', 'danger');
            console.log("Something went wrong while adding user to action");
        });
    }
    
    $scope.initUserStateMessage = function() {
//        console.log(User);
        if(User.isLogged) {
            $scope.actie.stateVisible = true;
            if(User.gebruiker.actie_id == $scope.actie.actie_id) {
                $scope.actie.userStateMessage = "De wijk van de gebruiker";
            } else if(User.gebruiker.actie_id > 0)
                $scope.actie.stateVisible = false;
            else
                $scope.actie.userStateMessage = "Ik doe mee!";
        } else {
            $scope.actie.stateVisible = false;
        }
    }
    
    $scope.$on('onUserLogin', function() {
        $scope.initUserStateMessage();
    });
    
    $scope.$on('onUserLogout', function() {
        $scope.initUserStateMessage();
    });
    
//    $scope.initBuddies = function() {
//        $scope.actie.buddies = [];
//        angular.forEach($scope.actie.deelnemers, function(deelnemer) {
//            if(deelnemer.buddy) {
//                $scope.actie.buddies.push(deelnemer);
//            }
//        });
//    }
    
    $scope.getActieInfo();
//    $scope.getWijkDeelnemers();

});

