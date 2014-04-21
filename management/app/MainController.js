/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

app.controller('MainCtrl', function($scope) {
    $scope.app = config.app;
    
    $scope.indexList = function(indexes) {
        return new Array(indexes);
    }
});
