/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

app.controller('UserCtrl', function($scope, $state, User) {
    $scope.user = User.data;
    
    //$scope.tableClasses = "table-condensed";
    $scope.headers = ["id", "name", "header3"];
    $scope.cellOrder = ["name", "name", "id"];

    $scope.rows = [{id:"item1", name:"item2", header3: "item3"},{id: "waarde",name: "ding", w:"waarde"}];
    
    $scope.login = function() {
        $state.transitionTo('home');
    }
});
