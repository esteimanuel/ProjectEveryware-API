/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

app.controller('SearchCtrl', function($scope, $rootScope, $routeParams, $http) {
    $scope.search.value = $routeParams.sq;
    $scope.search.searchedValue = $routeParams.sq;
    //$scope.search.results = [];
    
    $scope.searchPostalcode = function() {
        var value = $scope.capFirstLetter($scope.search.value);
//        console.log($scope.search.value);
        //if(parseInt(value) != 'NaN') {
//            console.log($scope.search.value);
            $scope.search.isLoading = true;
            $scope.search.searchedValue = value;
            
            $http({
                url: config.api.url + 'wijk/search',
//                url: '/glassy-api/api/' + 'wijk/search',
                method: 'GET',
                params: {sq:value},
                headers: {'Cache-Control': 'no-cache'}
            }).success(function(data, status) {
                $scope.search.results = data;
//                $scope.search.results = [{"beschikbaar":true,"wijk_id":"3","target":30,"actie_duur_dagen":90,"aantal_huishoudens":2500,"wijk_naam":"Brakkenstein","actie":[]},{"beschikbaar":true,"wijk_id":"7","target":30,"actie_duur_dagen":90,"aantal_huishoudens":900,"wijk_naam":"Weezenhof","actie":[{"actie_id":"3","borg":"0","borg_betaald":false,"initiatiefnemer_id":2,"eind_datum":"2014-04-21","start_datum":"2014-07-21","naam":"Maaikes Glasvezelbuurt","wijk_id":"7","status_id":3}]},{"beschikbaar":true,"wijk_id":"2","target":30,"actie_duur_dagen":80,"aantal_huishoudens":3500,"wijk_naam":"Hatert","actie":[]},{"beschikbaar":true,"wijk_id":"5","target":30,"actie_duur_dagen":90,"aantal_huishoudens":1000,"wijk_naam":"Malvert","actie":[{"actie_id":"2","borg":"100","borg_betaald":false,"initiatiefnemer_id":7,"eind_datum":"2014-03-28","start_datum":"2014-06-28","naam":"Peters Glasvezelbuurt","wijk_id":"5","status_id":1}]},{"beschikbaar":false,"wijk_id":"6","target":30,"actie_duur_dagen":90,"aantal_huishoudens":5000,"wijk_naam":"Aldenhof","actie":[]}];
//                console.log($scope.search.results);
                $scope.search.isLoading = false;
//                console.log("Search completed");
            }).error(function(data, status) {
                console.log("Failed to search");
                $scope.search.isLoading = false;
                $rootScope.showMessage('Failed to get search results', 'danger');
            });
        //}
    }
    
    $scope.capFirstLetter = function(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    $scope.searchPostalcode();
});
