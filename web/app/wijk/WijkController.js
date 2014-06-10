app.controller('WijkCtrl', function ($scope, $routeParams, $location, $http, $sce, User, $rootScope) {

    $scope.actie = {};
    $scope.mapsUrl = "";
    $scope.videoUrl = "";
    $scope.showVideo = false;
    $scope.actionImgUrl = "";

    //get wijk info van ingelogd persoon
    $scope.getActieInfo = function () {
        if(!$routeParams.wid) {
//            $state.transitionTo('home');
            $location.path('/');
            return;
        }
        
        var params = {id: $routeParams.wid};

        $http({
            url: config.api.url + 'actie',
            method: 'GET',
            params: params
        })
        .success(function (data, status, headers) {
            if(!data) {
//                $state.transitionTo('home');
                $location.path('/');
            }
            
            $scope.actie = data;
            
            $scope.initUserStateMessage();
            
            document.title = $scope.actie.naam + " - " + config.app.name;
            $scope.getActieDeelnemers();
            $scope.getActieStats();
            $scope.getGoedeDoel();
            $scope.getBuurtForum();
            $scope.mapsUrl = $sce.trustAsResourceUrl($scope.getMapsUrl());
            $scope.videoUrl = $sce.trustAsResourceUrl($scope.getVideoUrl());
            angular.forEach($scope.actie.media, function(media) {
                if(media.type === 'image') {
                    $scope.actionImgUrl = media.url;
                }
            });
        })
        .error(function (data, status, headers, config) {
            console.log("failure");
        });
    }

    $scope.getBuurtForum = function () {
        var params = {id: $scope.actie.actie_id};

        $http({
            url: config.api.url + 'thread/getThreadForActie',
            method: 'GET',
            params: params
        })
         .success(function (data, status, headers, config) {
             $scope.actie.threads = data;
             console.log($scope.actie);
         })
        .error(function (data, status, headers, config) {
            console.log("failure");
        })
    }

    $scope.getGoedeDoel = function () {
        var params = {id: $scope.actie.actie_id};

        $http({
            url: config.api.url + 'goededoel',
            method: 'GET',
            params: params
        })
         .success(function (data, status, headers, config) {
             $scope.actie.goedeDoel = data;         
         })
        .error(function (data, status, headers, config) {
            console.log("failure");
        })
    }

    //get all wijk deelnemers
    $scope.getActieDeelnemers = function () {
        var params = {id: $scope.actie.actie_id};

        $http({
            url: config.api.url + 'actie/users',
            method: 'GET',
            params: params
        })
       .success(function (data, status, headers) {
            
            angular.forEach(data, function(deelnemer) {
                if(!deelnemer.account.foto_link)
                    deelnemer.account.foto_link = config.api.url + "_media/images/user.png";
            });
            $scope.actie.deelnemers = data;
//            $scope.actie.deelnemersCount = $scope.actie.deelnemers.length;
         })
        .error(function (data, status, headers, config) {
            console.log("failure");
        })
    }
    
    $scope.getActieStats = function() {
        var params = {id: $scope.actie.actie_id};
        
        $http({
            url: config.api.url + 'actie/stats',
            method: 'GET',
            params: params
        }).success(function(data, status) {
            $scope.actie.stats = data;
        }).error(function(data, status) {
            $rootScope.showMessage('Failed to get action stats', 'danger');
        });
    }
    
    $scope.getMapsUrl = function() {
        return "http://glassy-web.avans-project.nl/?wijk=" + $scope.actie.wijk_id;
    }
    
    $scope.getVideoUrl = function() {
        var vidCode = "";
        angular.forEach($scope.actie.media, function(media) {
            if(media.type == 'video') {
                vidCode = $scope.getVideoId(media.url);
            }
        });
        $scope.showVideo = !!(vidCode);
        return "//www.youtube.com/embed/" + vidCode;
    }
    
    $scope.getVideoId = function(url) {
        var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        var match = url.match(regExp);
        if (match&&match[2].length==11){
            return match[2];
        }else{
            //error
            return "";
        }
    }
    
    $scope.initUserStateMessage = function() {
//        console.log(User);
        if(User.isLogged) {
            $scope.actie.stateVisible = true;
            if(User.gebruiker.actie_id == $scope.actie.actie_id) {
                if(!User.gebruiker.borg_betaald)
                    $scope.actie.userStateMessage = "Borg betalen";
                else if(!User.gebruiker.provider_id)
                    $scope.actie.userStateMessage = "Provider kiezen";
                else {
                    $scope.actie.userStateMessage = "Klaar!";
                    $scope.actie.stateDisabled = true;
                }
//                // Set state text for current user
//                $scope.actie.userStateMessage = "De wijk van de gebruiker";
            } else if(User.gebruiker.actie_id > 0)
                $scope.actie.stateVisible = false;
            else
                $scope.actie.userStateMessage = "Ik doe mee!";
        } else {
            $scope.actie.stateVisible = false;
        }
    }

    $scope.handleStateButton = function() {
        //console.log(User.gebruiker.actie_id);
        if(User.gebruiker.actie_id === $scope.actie.actie_id) {
            // Handle state for current user's action
            if(!User.gebruiker.borg_betaald) {
//                $scope.actie.userStateMessage = "Borg betalen";
                $scope.payBorgOpen();
            } else if(!User.gebruiker.provider_id) {
//                $scope.actie.userStateMessage = "Provider kiezen";
                $scope.choseProviderOpen();
            } else {
//                $scope.actie.userStateMessage = "Klaar!";
            }
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
            var user = User.gebruiker;
            user.account = User.account;
            user.buddy = false;
            // Update deelnemers count, add deelnemer to front of array;
            $scope.actie.deelnemers.unshift(user);
            $scope.actie.stats.targetPartPerc = ($scope.actie.stats.participants / $scope.actie.stats.target) * 100;
        }).error(function(data, status) {
            $rootScope.showMessage('Something went wrong while adding user to action', 'danger');
            console.log("Something went wrong while adding user to action");
        });
    }
    
    $scope.payBorgOpen = function() {
        $scope.actie.openPayBorg = true;
    }
    
    $scope.payBorg= function() {
        $http({
            url: config.api.url + "gebruiker",
            method: "PUT",
            data: {_token: User.account.token, borg_betaald: true}
        }).success(function(data) {
            User.gebruiker.borg_betaald = true;

            User.setGebruiker(User.gebruiker, true);
            $rootScope.$broadcast('onUserDataChanged');
            
            $scope.initUserStateMessage();
            $rootScope.showMessage("Gegevens opgeslagen", "success");
            $scope.actie.openPayBorg = false;
        }).error(function(data) {
            $rootScope.showMessage("Er ging iets fout met het opslaan van de gegevens", "danger");
        });
    }
    
    $scope.choseProviderOpen = function() {
        if(!$scope.providers){
            $http({
                url: config.api.url + "provider",
                method: "GET"
            }).success(function(data) {
                $scope.providers = data;
            }).error(function(data) {
                console.log("Failed get providers");
            });
        }
        $scope.actie.openChoseProvider = true;
    }
    
    $scope.choseProvider = function() {
        if($scope.provider.id && $scope.provider.id > 0) {
            $http({
                url: config.api.url + "gebruiker",
                method: "PUT",
                data: {_token: User.account.token, provider_id: $scope.provider.id}
            }).success(function(data) {
                User.gebruiker.provider_id = $scope.provider.id;
                User.setGebruiker(User.gebruiker, true);
                $rootScope.$broadcast("onUserDataChanged");
                
                $scope.initUserStateMessage();
                $rootScope.showMessage("Gegevens opgeslagen", "success");
                $scope.actie.openChoseProvider = false;
            }).error(function(data) {
                $rootScope.showMessage("Er ging iets fout met het opslaan van de gegevens", "danger");
            });
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

