app.controller('FaqCtrl', function ($scope, $rootScope) {
    console.log("faq loaded");

    $scope.getFaq = function () {
        �onsole.log("i got to the method");

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
});