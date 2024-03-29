/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

app.controller('MediaCtrl', function($rootScope, $scope, $http) {
    var navs = [
        [{name:'Overzict', active:true, state:'main.media'}]];
    $rootScope.setNavs(navs); 
    
    var apiCtrlName = 'media';
    var idName = 'media_id';
    
    $scope.media = {type:"image"};
    $scope.dropdownData = [{'key':'image', 'value': 'Afbeelding'}, {'key':'video', 'value':'Video'}];
    
    $scope.tableClasses = "table-striped";
    $scope.headers = [
        {name: "media_id", type:"number", header:"#"},
        {name:"type", header: "Type", type:"dropdown", typeData: $scope.dropdownData},
        {name:"url", type:"url", header: "Url", contentPattern: function(cell, cells) {
             var type = '';
             angular.forEach(cells, function(cell) {
                 if(cell.key == 'type') {
                     type = cell.value;
                 }
             });
             if(type == 'image')
                return "<a class='hover-url' href='[value]' target='_blank'>[value]</a><img class='sample sample-img basedialog' src='[value]' />";
            else if(type == 'video')
                return "<a class='hover-url' href='[value]' target='_blank'>[value]</a><iframe class='sample sample-video basedialog' src='"+$scope.getVideoUrl(cell.value)+"' />";
        }},
        {name:"actie_id", type: "number", header:"Actie"},
        {name:"gebruiker_id", type: "number", header:"Gebruiker"}
    ];
    $scope.cellOrder = ["media_id", "type", "url", "actie_id", "gebruiker_id"];

    $scope.rows = [];
    
    $scope.isLoading = false;
    $scope.showAdd = false;
    
    $scope.getData = function() {
        var url = config.api.url+apiCtrlName;
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
            if(column.key === idName) 
                objData.id = column.value;
            objData[column.key] = column.value;
        });
        if(objData !== null && objData.id > 0) {
            $scope.toggleLoading();
//            $scope.titleMessage = "Row updated";
//            $scope.displayTitleMessage = true;
//            $scope.toggleLoading();

            $http({
                url: config.api.url+apiCtrlName,
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
            if(column.key === idName) {
                id = column.value;
            }
        });
        if(id > 0) {
            $scope.toggleLoading();
            $http({
                url: config.api.url+apiCtrlName,
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
    
    $scope.add = function(media) {
        if("media_id" in media)
            delete media.media_id;
        $scope.toggleLoading();
            $http({
                url: config.api.url+apiCtrlName,
                method: 'POST',
                data: media
            }).success(function(data, status) {
                $rootScope.showMessage("Rij is toegevoegd", "success", 2000);
                $scope.toggleAdd();
                
                media[idName] = data.id;
                $scope.rows.push(media);
                $scope.addNewRows();
                
                $scope.toggleLoading();
            }).error(function(data, status) {
                $rootScope.showMessage("Er is een fout opgetreden bij het toevoegen", "danger");
                
                $scope.toggleLoading();
            });
    }
    
    $scope.getVideoUrl = function(url) {
        return "//www.youtube.com/embed/" + $scope.getVideoId(url);
    }
    
    $scope.getVideoId = function(url) {
        var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        var match = url.match(regExp);
        if (match&&match[2].length==11){
            return match[2];
        }else{
            //error
            return "";
        }
    }
    
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

