app.controller('FaqCtrl', function ($scope, $rootScope, $http) {
   
    $scope.getFaq = function () {

        $http({
            url: config.api.url + 'faq',
            method: 'GET'
        })
        .success(function (data, status) {
            console.log(data);
        })
        .error(function (data, status) {

        });
    }

    $scope.getFaq();
});