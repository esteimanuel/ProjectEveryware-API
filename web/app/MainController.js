/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

app.controller('MainCtrl', function($rootScope, $scope, $location, $anchorScroll, District) {
    $scope.app = config.app;
    $scope.district = {
        closeby: []
    }
    
    $scope.scrollTo = function(id) {
       $location.hash(id);
       $anchorScroll();
    }
    
    $rootScope.initDistrict = function() {
        District.init(function() {
            console.log(District.locationData);
            console.log(District.closeby);
            $scope.district.closeby = District.closeby;
        });
    }
});