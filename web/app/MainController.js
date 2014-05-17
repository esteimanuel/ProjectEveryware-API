/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

app.controller('MainCtrl', function($rootScope, $scope, $location, $anchorScroll, District, $timeout, $state) {
    $scope.app = config.app;
    $scope.district = {
        closeby: []
    }
    
    $scope.scrollTo = function(id) {
       $location.hash(id);
       $anchorScroll();
    }
    
    $scope.search = function(searchVal) {
        $state.transitionTo('search', {sq:searchVal});
    }
    
    $rootScope.global = {};
    
    $rootScope.initDistrict = function() {
        District.init(function() {
            console.log(District.locationData);
            console.log(District.closeby);
            $scope.district.closeby = District.closeby;
        });
    }
    
    $rootScope.showMessage = function(message, type, time) {
        $rootScope.global._message = message;
        $rootScope.global._messageType = type;
        $rootScope.global._messageVisible = true;
        
        $timeout(function() {
            $rootScope.global._messageVisible = false;
        }, (time) ? time : 5000);
    }
});