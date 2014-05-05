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
            var _sortFieldType = null;
            var _sortOrder = 1;
            
            _this.observers = [];
            _this.pagerObservers = [];
            
            _this.pagerData = {
                totalRows: _this.$scope.rows.length,
                activeRows: 0
            };
            
            if(!$scope.cellOrder) {
                var headers = [];
                for(var i = 0; i < $scope.headers.length; i++) {
                    headers.push($scope.headers[i].name);
                }
                $scope.cellOrder = headers;
            }
            
            this.compare = function(a,b) {
                //console.log(_sortFieldType);
                a = (a[_sortField]) ? a[_sortField].value : a[$scope.cellOrder[_sortField]];
                b = (b[_sortField]) ? b[_sortField].value : b[$scope.cellOrder[_sortField]];

                if(_sortFieldType === 'number') {
                    a = Number(a);
                    b = Number(b);
                }

                var result = (a < b) ? -1 : (a > b) ? 1 : 0;
                return result * _sortOrder;
            }
            
            this.sortByHeader = function(header) {
//                console.log(header);
//                console.log(_this.$scope.rows);
                _sortField = header.id;
                _sortFieldType = (header.type) ? header.type : "text";
                _sortOrder = (header.sortOrder === 'DESC') ? -1 : 1;
                
                if(_sortField !== null)
                    _this.$scope.rows = _this.$scope.rows.sort(_this.compare);
                
                _this.notifyChange();
            }
            
            this.setRowIndexes = function(startIndex) {
                angular.forEach(_this.observers, function(observer) {
                    observer.setRowIndex(startIndex++);
                });
            }
            
            this.addObserver = function(observer) {
                _this.observers.push(observer);
                
                console.log("Set page count");
                _this.pagerData.activeRows++;
            }
            
            this.addPagerObserver = function(observer) {
                _this.pagerObservers.push(observer);
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
            
            this.draw = function() {
                for(var i = 0; i < _this.observers.length; i++) {
                    _this.observers[i].initRowData();
                }
                
                _this.$scope.pageCount = _this.$scope.rows.length / _this.observers.length;
                for(var x = 0; x < _this.pagerObservers.length; x++) {
                    _this.pagerObservers[x].init();
                }
            }
            //this.draw();
            _this.$scope.draw = _this.draw;
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
            
            var sortIndex = -1;
            for(var i = 0; i < $scope.headers.length; i++) {
                $scope.headers[i].id = i;
                if(!("header" in $scope.headers[i]))
                    $scope.headers[i].header = $scope.headers[i].name;
                if($scope.allowSort) {
                    if(!("sortOrder" in $scope.headers[i]))
                        $scope.headers[i].sortOrder = null;
                    else 
                        sortIndex = i;
                }
            }
            if(sortIndex !== -1) {
                tableCtrl.sortByHeader($scope.headers[sortIndex]);
            }
            
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
            $scope.visible = false;
            
            var _rowNr = attributes.row;
            
            $scope.cellOrder = tableCtrl.$scope.cellOrder;
            
            tableCtrl.addObserver($scope);
            
            $scope.sortCells = function() {
                console.log("Sort cells");
                var newOrder = [];
                //console.log($scope.cells);
                for(var i = 0; i < $scope.cellOrder.length; i++) {
                    var key = $scope.cellOrder[i];
                    var header = null;
                    for(var x = 0; x < tableCtrl.$scope.headers.length; x++) {
                        if(key == tableCtrl.$scope.headers[x].name) {
                            header = tableCtrl.$scope.headers[x];
                        }
                    }
                    newOrder[i] = {
                        value: (key in $scope.cells) ? $scope.cells[key] : null,
                        key: key,
                        type: (header.type) ? header.type : "text"
                    };
                    newOrder[i].tmpValue = newOrder[i].value;
                    //console.log(newOrder[i]);
                }
                $scope.cells = newOrder;
                //tableCtrl.$scope.rows[_rowNr] = $scope.cells;
            };
            
            $scope.initRowData = function() {
                if(parseInt(_rowNr) >= 0 && tableCtrl.$scope.rows) {
                    var rowData = tableCtrl.$scope.rows[_rowNr];
                    if(rowData) {
                        $scope.cells = rowData;
                        console.log($scope.cells);
                        if( !(Object.prototype.toString.call( rowData ) === '[object Array]'))
                            $scope.sortCells();
                        $scope.visible = true;
                    } else {
                        $scope.visible = false;
                    }
                }
            }
            
            $scope.updateValues = function() {
                if($scope.editMode) {
                    angular.forEach($scope.cells, function(cell) {
                        cell.value = cell.tmpValue;
                    });
                    //var rowData = {};
                    var rowData = angular.copy($scope.cells);
                    //console.log(rowData);
                    tableCtrl.$scope.rows[_rowNr] = rowData;
                    if($scope.updateRow) {     
                        if($scope.updateRow())
                            $scope.toggleEditMode();
                    } else 
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
            
            $scope.setRowIndex = function(newIndex) {
                _rowNr = newIndex;
                attributes.row = _rowNr;
                
                $scope.initRowData();
                
            }
            
            // observer method
            $scope.updateData = function() {
                $scope.cells = tableCtrl.$scope.rows[_rowNr];
                //console.log($scope.cells);
                if(typeof $scope.cells === 'object' && !( Object.prototype.toString.call($scope.cells) === '[object Array]' ))
                    $scope.sortCells();
                //console.log($scope.cells);
            }
            
            //$scope.initRowData();
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
})
.directive('glTablePager', function() {
    return {
        require: '^glTable',
        restrict: 'E',
        transclude: true,
        replace: true,
        link: function($scope, element, attributes, tableCtrl) {
            tableCtrl.addPagerObserver($scope);
            $scope.pagerData = tableCtrl.pagerData;
            
            $scope.init = function() {
                $scope.pageCount = tableCtrl.$scope.pageCount;
                console.log($scope.pageCount);
                $scope.pageList = [];
                for(var i = 0; i < $scope.pageCount; i++) {
                    $scope.pageList[i] = {
                        active: false,
                        disabled: false,
                        number: i+1
                    };
                }
                if($scope.pageList.length > 0)
                    $scope.pageList[0].active = true;
                console.log($scope.pageList);
            }
            
            $scope.pageButtonClick = function(pageNr) {
                var index = pageNr - 1;
                if(!$scope.pageList[index].active) {
                    for(var i = 0; i < $scope.pageList.length; i++) {
                        $scope.pageList[i].active = false;
                    }
                    $scope.pageList[index].active = true;
                    //alert(pageNr);
                    var startIndex = $scope.pagerData.activeRows * (pageNr-1);
                    //alert(startIndex);
                    tableCtrl.setRowIndexes(startIndex);
                }
            }
        },
        templateUrl: config.directive.path + 'table/main-table-pager.html'
    }
});
