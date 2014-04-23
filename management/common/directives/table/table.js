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
            var _this = this;
            var _sortField = null;
            var _sortOrder = 1;
            
            _this.observers = [];
            
            if(!$scope.cellOrder) {
                $scope.cellOrder = $scope.headers;
            }
            
            this.compare = function(a,b) {
                a = a[_sortField].value;
                b = b[_sortField].value;

                var result = (a < b) ? -1 : (a > b) ? 1 : 0;
                return result * _sortOrder;
            }
            
            this.sortByHeader = function(header) {
//                console.log(header);
//                console.log(_this.$scope.rows);
                _sortField = header.id;
                _sortOrder = (header.sortOrder === 'DESC') ? -1 : 1;
                
                if(_sortField !== null)
                    _this.$scope.rows = _this.$scope.rows.sort(_this.compare);
                
                _this.notifyChange();
            }
            
            this.addObserver = function(observer) {
                _this.observers.push(observer);
            }
            
            this.notifyChange = function() {
                for(var i = 0; i < _this.observers.length; i++) {
                    _this.observers[i].updateData();
                }
            }
            
            this.notifyRowRemoved = function(removedRowIndex) {
                for(var i = 0; i < _this.observers.length; i++) {
                    _this.observers[i].rowRemoved(removedRowIndex);
                }
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
            $scope.allowSort = true;
            var _activeSortIndex = -1;
            
            var newHeaders = [];
            for(var i = 0; i < $scope.headers.length; i++) {
                var header = $scope.headers[i];
                newHeaders[i] = {
                    name: header,
                    id: i
                };
                if($scope.allowSort) {
                    newHeaders[i].sortOrder = null;
                }
            }
            $scope.headers = newHeaders;
            
            $scope.headerClick = function(i) {
                if(_activeSortIndex != -1 && i != _activeSortIndex) 
                    $scope.headers[_activeSortIndex].sortOrder = null;
                
                var sortOrder = $scope.headers[i].sortOrder;
                $scope.headers[i].sortOrder = (sortOrder === 'ASC') ? 'DESC' : 'ASC';
                
                _activeSortIndex = i;
                tableCtrl.sortByHeader($scope.headers[i]);
            };
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
            
            var _rowNr = attributes.row;
            
            tableCtrl.addObserver($scope);
            
            $scope.sortCells = function() {
                var newOrder = [];
                console.log($scope.cells);
                for(var i = 0; i < $scope.cellOrder.length; i++) {
                    var key = $scope.cellOrder[i];
                    newOrder[i] = {
                        value: (key in $scope.cells) ? $scope.cells[key] : null,
                        key: key
                    };
                    newOrder[i].tmpValue = newOrder[i].value;
                    console.log(i + ", " + key + ", " + newOrder[i]);
                }
                $scope.cells = newOrder;
                tableCtrl.$scope.rows[_rowNr] = $scope.cells;
            };
            
            $scope.cellOrder = tableCtrl.$scope.cellOrder;
            if(parseInt(_rowNr) >= 0 && tableCtrl.$scope.rows) {
                var rowData = tableCtrl.$scope.rows[_rowNr];
                if(rowData) {
                    $scope.cells = rowData;
                    $scope.sortCells();
                }
            }
            
            $scope.updateValues = function() {
                if($scope.editMode) {
                    angular.forEach($scope.cells, function(cell) {
                        cell.value = cell.tmpValue;
                    });
                }
                if($scope.updateRow) { 
                    if($scope.updateRow())
                        $scope.toggleEditMode();
                } else 
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
            
            $scope.deleteRow = function() {
                if($scope.removeRow)
                    $scope.removeRow();
                
                tableCtrl.$scope.rows.splice(_rowNr, 1);
                // element.parent().find(attr[row>_rowNr]).scope.rowNr - 1
                tableCtrl.notifyRowRemoved(_rowNr);
                element.remove();
//                console.log($scope.cells);
//                console.log(tableCtrl.$scope.rows);
            }
            
            $scope.rowRemoved = function(removedRow) {
                if(_rowNr > removedRow) {
                    var lowerCount = 1;
                    _rowNr = _rowNr - lowerCount;
                    attributes.row = _rowNr - lowerCount;
                }
            }
            
            // observer method
            $scope.updateData = function() {
                $scope.cells = tableCtrl.$scope.rows[_rowNr];
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
