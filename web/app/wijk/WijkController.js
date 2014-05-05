console.log("loaded Wijk controller");
app.controller('WijkCtrl', function ($scope, $stateParams, $state, $http) {

    //get wijk info van ingelogd persoon
    $scope.getWijkInfo = function () {

        var params = { email: scope.user.username }

        $http({
            url: '/ProjectEveryware-API/api/user',
            method: 'GET',
            params: params
        })
        .success(function (data, status, headers, config) {
            console.log("success");
        })
        .error(function (data, status, headers, config) {
            console.log("failure");
        })
    }

    //get all wijk deelnemers
    $scope.getWijkDeelnemers = function () {
        var params = { wijkid: $scope.wijk.wijkId}

        $http({
            url: '',
            method: 'GET',
            params: params
        })
       .success(function (data, status, headers, config) {
            console.log("success");
         })
        .error(function (data, status, headers, config) {
            console.log("failure");
        })
    }

});

