/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

app.controller('UserCtrl', function($scope, $state, User) {
    $scope.user = User.data;
    
//    $scope.login = function() {
//        $state.transitionTo('home');
//    }
//    
//    $scop.logout = function(){
//        
//        $state.transitionTo('/login');
//    }
});
