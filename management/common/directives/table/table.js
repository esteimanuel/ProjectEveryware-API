/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

angular.module('gl.table', [])
.directive('glTable', function () {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        controller: function($scope) {
            this.$scope = $scope;
            
            if(!$scope.cellOrder) {
                $scope.cellOrder = $scope.headers;
            }
//            $scope.tableClass = "table";
//            $scope.headers = ["header1", "header2", "header3"];
//            
//            $scope.rows = [{id:"item1", name:"item2", iets: "item3"},{id: "ding",name: "ding"}];
            //console.log($scope);
            //console.log($scope.user);
        },
        templateUrl: config.directive.path + 'table/main-table.html'
    }
})
.directive('glTableHead', function() {
    return {
        require: '^glTable',
        restrict: 'E',
        transluce: true,
        replace: true,
        scope: {
            //headers: '='
        },
        link: function($scope, element, attributes, tableCtrl) {
            $scope.headers = tableCtrl.$scope.headers;
            //$scope.headers = attributes.headers.split('1');
            //console.log(tableCtrl);
        },
        templateUrl: config.directive.path + 'table/main-table-head.html'
    }
})
.directive('glTableRow', function() {
    return {
        //link: link,
        require: '^glTable',
        restrict: 'E',
        transclude: true,
        replace: true,
        scope: {
            
        },
        link: function($scope, element, attributes, tableCtrl) {
            $scope.allowEdit = true;
            $scope.allowDelete = true;
            $scope.editMode = false;
            
            $scope.sortCells = function() {
                var newOrder = [];
                console.log($scope.cells);
                for(var i = 0; i < $scope.cellOrder.length; i++) {
                    var key = $scope.cellOrder[i];
                    newOrder[i] = {
                        value: (key in $scope.cells) ? $scope.cells[key] : null
                    };
                    newOrder[i].tmpValue = newOrder[i].value;
                    console.log(i + ", " + key + ", " + newOrder[i]);
                }
                $scope.cells = newOrder;
            };
            
            $scope.cellOrder = tableCtrl.$scope.cellOrder;
            if(parseInt(attributes.row) >= 0 && tableCtrl.$scope.rows) {
                var rowCount = attributes.row;
                var rowData = tableCtrl.$scope.rows[attributes.row];
                if(rowData) {
                    $scope.cells = rowData;
                    $scope.sortCells();
                }
            }
            
            $scope.updateValues = function() {
                angular.forEach($scope.cells, function(cell) {
                    cell.value = cell.tmpValue;
                });
                $scope.toggleEditMode();
            };
            
            $scope.cancelValues = function() {
                angular.forEach($scope.cells, function(cell) {
                    cell.tmpValue = cell.value;
                });
                $scope.toggleEditMode();
            }
            
            $scope.toggleEditMode = function() {
                $scope.editMode = !$scope.editMode;
            }
        },
        templateUrl: config.directive.path + 'table/main-table-row.html'
    }
})
.directive('glTableBody', function() {
    return {
        restrict: 'E',
        transclude: true,
        replace: true,
        template: '<tbody data-ng-transclude></tbody>'
    }
});
