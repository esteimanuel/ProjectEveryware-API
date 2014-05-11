/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

app.controller('DashBoardDistrictsCtrl', function($scope, $timeout) {
    $scope.tableClass = 'table-striped';
    $scope.headers = [
        {name:"postalcode", header:"Postcode"},
        {name:"name", header:'Naam'},
        {name:'target', header:'Doel (%)'},
        {name:"accomplised", header:'Behaald (%)'},
        {name:"borg", header:'Bord betaald (%)'}
    ];
    $scope.cellOrder = ["postalcode", "name", "target", "accomplised", "borg"];
    $scope.rows = [{postalcode:5384, name:"Test", target:20, accomplised:15, borg:5}];
    
    $scope.allowEdit = false;
    $scope.allowDelete = false;
    
    $timeout(function() {
        $scope.draw();
    },200);
});
