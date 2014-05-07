app.controller('LoginCtrl', function($scope, $http) {
	$scope.login = function(credentials) {
		console.log(credentials);
		$http({url: 'http://glassy-api.avans-project.nl/api/account/login',method:'GET',params:credentials}).success(function(data, status) {
			console.log("Token has been received");
			console.log(data);
			localStorage.token = data.token;
		}).error(function(data, status, headers, config) {
			console.log("Login file data not accepted");
		})
	}
});