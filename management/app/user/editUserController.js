app.controller('editUserCtrl', function($scope, User, $http, $rootScope, $stateParams) {
    var navs = [[{name:'Overzict', active:true, state:'main.users.userOverview'}]];
    
    //Get user id from params
    $scope.currentUserId = $stateParams.uid;
    GetUserData();
    
    function GetUserData(){
        var url = config.api.url+'account/FullDataGrab?id=' + $scope.currentUserId;
        $http({
            url: url,
            method: 'GET'
        }).success(function(data, status, headers, config) {
            console.log(url);
            $scope.profile = data;
            GetToken();
            console.log($scope.profile);
        }).error(function(data, status, headers, config) {
            console.log(data);
        });
    }
    
    function GetToken(){
        var url = config.api.url+'account?id=' + $scope.profile.account.account_id;
        console.log(url);
        $http({
            url: url,
            method: 'GET'
        }).success(function(data, status, headers, config) {
            console.log(data);
            $scope.token = data.token;
            console.log($scope.profile);
        }).error(function(data, status, headers, config) {
            console.log(data);
        });
    }
    
    $scope.uploadUrl = config.api.url + 'media/postImages';
    
    $scope.setProfileValues = function() {
        if(!$scope.profile)
            $scope.profile = { gebruiker: {},account:{}};
        angular.copy(User.gebruiker, $scope.profile.gebruiker);
        angular.copy(User.account, $scope.profile.account);
    };
    
    $scope.saveProfielInfo = function () {
        $scope.profile.account.gebruiker._token = $scope.token;
        var body = $scope.profile.account.gebruiker;
        
        console.log(body);
        
        $http({
            url: config.api.url + 'gebruiker',
            method: 'PUT',
            data: body
        })
        .success(function (data, status, headers, config) {
            User.setGebruiker(data.model, true);
            console.log(data);
            $rootScope.$broadcast('onUserDataChanged');
        })
        .error(function (data, status, headers, config) {
            console.log('fail');
        });
    };

    $scope.saveBuddyInfo = function () {
        $scope.profile.account.gebruiker._token = $scope.token;

        var body = $scope.profile.account.gebruiker.buddy;

        $http({
            url: config.api.url + 'buddy',
            method: 'PUT',
            data: body
        })
        .success(function (data, status, headers, config) {
            User.gebruiker.buddy = data.model;
            User.setGebruiker(User.gebruiker, true);

           // $scope.setProfileValues();
            $rootScope.$broadcast('onUserDataChanged');
        })
        .error(function (data, status, headers, config) {
            console.log('fail');
        });
    };

    $scope.uploadProfileImage = function() {
        if(document.getElementById('profile-picture').files.length > 0) {
            $rootScope.showMessage("Upload file here", "success");
        } else {
            $rootScope.showMessage("No file selected", "danger");
        }
    };
    
    $scope.fileChanged = function() {
        if(document.getElementById('profile-picture').files.length > 0) {
            var f = document.getElementById('profile-picture').files[0],
                r = new FileReader();

            r.onloadend = function(e){
                var data = e.target.result;
                //send you binary data via $http or $resource or do anything else with it
                document.getElementById('profile-image-example').src = data;
            };
            r.readAsDataURL(f);
        } else {
            document.getElementById('profile-image-example').src = "";
        }
    };
    
});
