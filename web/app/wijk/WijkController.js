app.controller('WijkCtrl', function ($scope, $stateParams, $state, $http, $sce) {

    $scope.actie = {};
    $scope.mapsUrl = "";

    //get wijk info van ingelogd persoon
    $scope.getActieInfo = function () {
        if(!$stateParams.wid) {
            $state.transitionTo('home');
            return;
        }
        
        var params = { id: $stateParams.wid }

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
        var params = { id: $scope.actie.actie_id}

        $http({
            url: '/glassy-api/api/' + 'actie/users',
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

