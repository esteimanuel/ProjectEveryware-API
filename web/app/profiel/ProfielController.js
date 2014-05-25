/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

app.controller('ProfielCtrl', function($scope, User) {
    
    $scope.setProfileValues = function() {
//        console.log($scope.profile);
        if(!$scope.profile)
            $scope.profile = { gebruiker: {},account:{}};
        angular.copy(User.gebruiker, $scope.profile.gebruiker);
        angular.copy(User.account, $scope.profile.account);
//        console.log($scope.profile);
    }
    
    $scope.setProfileValues();
    
});
