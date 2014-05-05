app.controller('LoginCtrl', function($scope, $http) {
	$scope.login = function(credentials) {
		$eMail = credentials.email;
		$password = credentials.wachtwoord;	
		
		console.log("fuck");
		
		console.log(credentials);
		$http({url:'/school/api/account/login',method:'GET',params:credentials}).success(function(data, status) {
			alert("Binnen");
			console.log(data);
		}).error(function(data, status, headers, config) {
			alert("Buiten");
			console.log(data);
		})
	}
});