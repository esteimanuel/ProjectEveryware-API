/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
console.log("loaded user controller");
app.controller('UserCtrl', function($scope, $stateParams, $state, $location) {
    $scope.views = {
        showLogin: !!($location.search().login)
    };
    $scope.user = {
        isLogged: !!(localStorage.token),
        token: localStorage.token,
        name: 'Guest',
        isAdmin: false
    };
    
    $scope.toggleLogin = function() { $scope.views.showLogin = !$scope.views.showLogin; };
    
    $scope.login = function() {
        $scope.toggleLogin();
        localStorage.token = "tmp";
        $scope.user.isLogged = true;
    };
    
    $scope.logout = function() {
        localStorage.removeItem("token");
        $scope.user.isLogged = false;
    };
    
});
