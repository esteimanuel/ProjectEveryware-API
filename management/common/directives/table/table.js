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
//            this.$compile = $compile;
            
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
                
                //console.log("Set page count");
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
            
            this.notifyRowRemoved = function() {
//                for(var i = 0; i < _this.observers.length; i++) {
//                    _this.observers[i].rowRemoved(removedRowIndex);
//                }
                _this.updatePageCount();
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
            
            this.updatePageCount = function() {
                var pageCount = _this.$scope.rows.length / _this.observers.length;
                for(var x = 0; x < _this.pagerObservers.length; x++) {    
                    _this.pagerObservers[x].setPageCount(pageCount);
                }
            }
            
            this.pageSetLast = function() {
                for(var x = 0; x < _this.pagerObservers.length; x++) {    
                    _this.pagerObservers[x].setToLastPage();
                }
            }
            
            $scope.addNewRows = function() {
                //console.log("Add");
                _this.updatePageCount();
                _this.pageSetLast();
                _this.notifyChange();
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
            $scope.allowEdit = (tableCtrl.$scope.allowEdit !== undefined) ? tableCtrl.$scope.allowEdit : true;
            $scope.allowDelete = (tableCtrl.$scope.allowDelete !== undefined) ? tableCtrl.$scope.allowDelete : true;;
            $scope.editMode = false;
            $scope.visible = false;
            
            var _rowNr = attributes.row;
            
            $scope.cellOrder = tableCtrl.$scope.cellOrder;
            
            tableCtrl.addObserver($scope);
            
            $scope.sortCells = function() {
                //console.log("Sort cells");
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
                        //console.log($scope.cells);
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
                tableCtrl.notifyRowRemoved();
                //element.addClass("remove");
                tableCtrl.notifyChange();
                //element.remove();
//                console.log($scope.cells);
//                console.log(tableCtrl.$scope.rows);
            }
            
//            $scope.rowRemoved = function(removedRow) {
//                if(_rowNr > removedRow) {
//                    var lowerCount = 1;
//                    _rowNr = _rowNr - lowerCount;
//                    attributes.row = _rowNr - lowerCount;
//                }
//            }
            
            $scope.setRowIndex = function(newIndex) {
                _rowNr = newIndex;
                attributes.row = _rowNr;
                
                $scope.initRowData();
                
            }
            
            // observer method
            $scope.updateData = function() {
                $scope.cells = tableCtrl.$scope.rows[_rowNr];
                if($scope.cells) {
                    //console.log($scope.cells);
                    if(typeof $scope.cells === 'object' && !( Object.prototype.toString.call($scope.cells) === '[object Array]' ))
                        $scope.sortCells();
                    $scope.visible = true;
                    //console.log($scope.cells);
                } else
                    $scope.visible = false;
            }
            
            //$scope.initRowData();
        },
        templateUrl: config.directive.path + 'table/main-table-row.html'
    }
})
.directive('glTableBody', function() {
    return {
        restrict: 'E',
        require: '^glTable',
        transclude: true,
        replace: true,
        link: function($scope, element, attributes, tableCtrl) {
//            tableCtrl.$scope.addRow = function() {
//                $scope.addRow();
//            }
//            
//            $scope.addRow = function() {
//                var newRowIndex = tableCtrl.$scope.rows.length+1;
//                var html = '<gl-table-row row="'+newRowIndex+'"></gl-table-row>';
//                var el = tableCtrl.$compile(html)($scope);
//                console.log(el);
//                element.append(el);
//            }
        },
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
            $scope.activeIndex = -1;
            
            $scope.init = function() {
                $scope.pageCount = tableCtrl.$scope.pageCount;
                //console.log($scope.pageCount);
                $scope.pageList = [];
                for(var i = 0; i < $scope.pageCount; i++) {
                    $scope.pageList[i] = {
                        active: false,
                        disabled: false,
                        number: i+1
                    };
                }
                if($scope.pageList.length > 0) {
                    $scope.pageList[0].active = true;
                    $scope.activeIndex = 0;
                }
                //console.log($scope.pageList);
            }
            
            $scope.pageButtonClick = function(pageNr) {
                var index = pageNr - 1;
                if(!$scope.pageList[index].active) {
//                    for(var i = 0; i < $scope.pageList.length; i++) {
//                        $scope.pageList[i].active = false;
//                    }
                    if($scope.activeIndex > -1) {
                        $scope.pageList[$scope.activeIndex].active = false;
                    }
                    
                    $scope.pageList[index].active = true;
                    $scope.activeIndex = index;
                    //alert(pageNr);
                    var startIndex = $scope.pagerData.activeRows * (pageNr-1);
                    //alert(startIndex);
                    tableCtrl.setRowIndexes(startIndex);
                }
            }
            
            $scope.pagePrev = function() {
                if(0 < $scope.activeIndex)
                    $scope.pageButtonClick($scope.activeIndex);
            }
            
            $scope.pageNext = function() {
                if($scope.pageList.length > $scope.activeIndex+1)
                    $scope.pageButtonClick($scope.activeIndex+2);
            }
        
            $scope.setToFirstPage = function() {
                $scope.pageButtonClick(1);
            }
        
            $scope.setToLastPage = function() {
                $scope.pageButtonClick($scope.pageList.length);
            }
            
            $scope.setPageCount = function(count) {
                count = Math.ceil(count);
                if($scope.pageList.length > count) {
                    var difference = $scope.pageList.length - count;
                    var wasActiveIndex = -1;
                    for(var i = count; i < $scope.pageList.length ; i++) {
                        if($scope.pageList[i].active)
                            wasActiveIndex = i;
                    }
                    $scope.pageList.splice(count, difference);
                    if($scope.pageList.length > 0 && wasActiveIndex > -1) {
                        // Set to previous page
                        $scope.pageButtonClick(count);
                    }
                } else if(count > $scope.pageList.length) {
                    //var newNr = $scope.pageList.length+1;
                    //var difference = count - $scope.pageList.length;
                    for(var x = $scope.pageList.length+1; x < count+1; x++) {
                        $scope.pageList.push({
                            active: false,
                            disabled: false,
                            number: x
                        });
                    }
                    
                    $scope.pageButtonClick(count);
                }
            }
        },
        templateUrl: config.directive.path + 'table/main-table-pager.html'
    }
});
