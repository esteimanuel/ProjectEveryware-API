/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

app.controller('MainCtrl', function($scope, $location, $anchorScroll) {
    $scope.app = config.app;
    
    $scope.scrollTo = function(id) {
       $location.hash(id);
       $anchorScroll();
    }
});