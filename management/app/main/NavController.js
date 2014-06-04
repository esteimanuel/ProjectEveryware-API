/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

app.controller('NavCtrl', function($scope, $rootScope) {
    $scope.navs = null;
    
    $rootScope.setNavs = function(navs) {
        $scope.navs = navs;
    }
    
    $scope.onSelect = function(navObj) {
        angular.forEach($scope.navs, function(nav) {
            angular.forEach(nav, function(navObj) {
                navObj.active = false;
            });
        });
        navObj.active = true;
    }
});
