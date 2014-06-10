/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

app.controller('providerCtrl', function($scope, $http, $state, $rootScope) {
    var navs = [[
        {name:'Provider beheren', state:'main.provider.editProvider'}]];
    $rootScope.setNavs(navs);
    
    $scope.tableClasses = null;
    $scope.tableClasses = "table-striped";
    
    //Set header names for binding
    $scope.headers = [
        {name: "provider_id", type:"number", header:"#", disabled:true},
        {name:"naam", type:"text", header:"Naam"},
        {name:"website_url", type:"text", header:"Website"}
    ];
    
    $scope.rows = [];
    
    $scope.getData = function() {
        var url = config.api.url+'provider';
        $http({
            url: url,
            method: 'GET'
        }).success(function(data, status, headers, config) {
            console.log("Provider load succesfull");
            $scope.rows = data;
            $scope.draw();
        }).error(function(data, status, headers, config) {
            console.log("Provider load failed /r/n/r/n Reson: /r/n" + headers);
        });
    };
    
    $scope.updateRow = function(rowData) {
        var objData = null;
        angular.forEach(rowData, function(column) {
            if(objData === null) objData = {};
            if(column.key === 'provider_id') 
                objData.id = column.value;
            objData[column.key] = column.value;
        });
        if(objData !== null && objData.id > 0) {
            $scope.toggleLoading();
            $http({
                url: config.api.url + 'provider',
                method: 'PUT',
                data: objData
            }).success(function(data, status) {                
                $scope.toggleLoading();
            }).error(function(data, status) {                
                $scope.toggleLoading();
            });
        }
        
        return true;
    };
    
    $scope.removeRow = function(rowData) {
        var id = rowData[0].value;
        if(id > 0) {
            $scope.toggleLoading();
            $http({
                url: config.api.url+ 'provider',
                method: 'DELETE',
                data: {id:id}
            }).success(function(data, status) {
                
                $scope.toggleLoading();
            }).error(function(data, status) {                
                $scope.toggleLoading();
            });
        }
        
        return true;
    };
    
    $scope.add = function(provider) {
        $scope.toggleLoading();
            $http({
                url: config.api.url+"provider",
                method: 'POST',
                data: provider
            }).success(function(data, status) {
                $scope.toggleAdd();
                
                provider.provider_id = data.id;
                $scope.rows.push(provider);
                $scope.addNewRows();
                
                $scope.toggleLoading();
            }).error(function(data, status) {
                console.log(provider);
                $scope.toggleLoading();
            });
    };
    
    $scope.clear = function() {
        $scope.clearFilter();
    };
    
    $scope.onTableReady = function() {
        $scope.getData();
    };
    
    $scope.toggleLoading = function() {
        $scope.isLoading = !$scope.isLoading;
    };
    
    $scope.toggleAdd = function() {
        $scope.showAdd = !$scope.showAdd;
    };
    
    
    $scope.getData();   
});
