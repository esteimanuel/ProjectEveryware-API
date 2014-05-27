/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

app.controller('FaqCtrl', function($rootScope, $scope, $http) {
    
    $scope.tableClasses = "table-striped";
    $scope.headers = [
        {name: "faq_id", type:"number", header:"#"},
        {name:"question", header: "Vraag"},
        {name:"answer", header: "Antwoord"},
    ];
    $scope.cellOrder = ["faq_id", "question", "answer"];

    $scope.rows = [];
    
    $scope.isLoading = false;
    $scope.showAdd = false;
    
    $scope.getData = function() {
        var url = config.api.url+'faq';
        $scope.toggleLoading();
        $http({
            url: url,
            method: 'GET'
        }).success(function(data, status, headers, config) {
//            console.log(data);
            $scope.rows = data;
            $scope.draw();
            $scope.toggleLoading();
            //$scope.addNewRows();
        }).error(function(data, status, headers, config) {
            console.log(data);
            $scope.toggleLoading();
        });
    }
    
    $scope.updateRow = function(rowData) {
        var objData = null;
        angular.forEach(rowData, function(column) {
            if(objData === null) objData = {};
            if(column.key === 'faq_id') 
                objData.id = column.value;
            objData[column.key] = column.value;
        });
        if(objData !== null && objData.id > 0) {
            $scope.toggleLoading();
//            $scope.titleMessage = "Row updated";
//            $scope.displayTitleMessage = true;
//            $scope.toggleLoading();

            $http({
                url: config.api.url+'faq',
                method: 'PUT',
                data: objData
            }).success(function(data, status) {
                $rootScope.showMessage("Rij is opgeslagen", "success", 2000);
                
                $scope.toggleLoading();
            }).error(function(data, status) {
                $rootScope.showMessage("Er is een fout opgetreden bij het opslaan", "danger");
                
                $scope.toggleLoading();
            });
        }
        
        return true;
    }
    
    $scope.removeRow = function(rowData) {
        var id = 0;
        angular.forEach(rowData, function(column) {
            if(column.key === 'faq_id') {
                id = column.value;
            }
        });
        if(id > 0) {
            $scope.toggleLoading();
            $http({
                url: config.api.url+'faq',
                method: 'DELETE',
                data: {id:id}
            }).success(function(data, status) {
                $rootScope.showMessage("Rij is verwijderd", "success", 2000);
                
                $scope.toggleLoading();
            }).error(function(data, status) {
                $rootScope.showMessage("Er is een fout opgetreden bij het verwijderen", "danger");
                
                $scope.toggleLoading();
            });
        }
        
        return true;
    }
    
    $scope.add = function(faq) {
        $scope.toggleLoading();
            $http({
                url: config.api.url+'faq',
                method: 'POST',
                data: faq
            }).success(function(data, status) {
                $rootScope.showMessage("Rij is toegevoegd", "success", 2000);
                $scope.toggleAdd();
                
                faq.faq_id = data.id;
                $scope.rows.push(faq);
                $scope.addNewRows();
                
                $scope.toggleLoading();
            }).error(function(data, status) {
                $rootScope.showMessage("Er is een fout opgetreden bij het toevoegen", "danger");
                
                $scope.toggleLoading();
            });
    }
    
//    $scope.add = function() {
//        $scope.rows.push({
//            account_id: 100,
//            email: "Iets@Iets.Iets",
//            validated: false,
//            token: "token please"
//        });
//        $scope.rows.push({
//            account_id: 100,
//            email: "Iets@Iets.Iets",
//            validated: false,
//            token: "token please"
//        });
//        $scope.addNewRows();
//    }
    
//    $scope.filterList = function() {
//        $scope.filter({
//            'email':'c',
//            'validated': true
//        });
//    }
    
    $scope.clear = function() {
        $scope.clearFilter();
    }
    
    $scope.onTableReady = function() {
        $scope.getData();
    };
    
    $scope.toggleLoading = function() {
        $scope.isLoading = !$scope.isLoading;
    }
    
    $scope.toggleAdd = function() {
        $scope.showAdd = !$scope.showAdd;
    }
//    $scope.getData(); 
    
});
