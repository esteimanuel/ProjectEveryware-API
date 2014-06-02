app.controller('ProfielCtrl', function($scope, User, $http, $rootScope) {
    
    $scope.uploadUrl = config.api.url + 'media/postImages';
    
    $scope.setProfileValues = function() {
//        console.log($scope.profile);
        if(!$scope.profile)
            $scope.profile = { gebruiker: {},account:{}};
        angular.copy(User.gebruiker, $scope.profile.gebruiker);
        angular.copy(User.account, $scope.profile.account);
//        console.log($scope.profile);
    }
    
    $scope.saveProfielInfo = function () {

        console.log($scope.profile);
        var body = $scope.profile;

        $http({
            url: config.api.url + 'gebruiker',
            method: 'PUT',
            data: body
        })
        .success(function (data, status, headers, config) {
            console.log("worked");
        })
        .error(function (data, status, headers, config) {
            console.log('fail');
        })
    }

    $scope.saveBuddyInfo = function () {
        console.log($scope.profile.gebruiker.buddy);
        var body = $scope.profile.gebruiker.buddy;

        $http({
            url: config.api.url + 'gebruiker',
            method: 'PUT',
            data: body
        })
        .success(function (data, status, headers, config) {
            console.log("worked");
        })
        .error(function (data, status, headers, config) {
            console.log('fail');
        })
    }

    $scope.uploadProfileImage = function() {
        //-------------
        // File upload via IFrame
        //-----------
        
//        var file = $scope.profile.account.profile_image_file;

        if(document.getElementById('profile-picture').files.length > 0) {
//            console.log(new FormData(document.getElementById('image-form')));
//            $http({
//              url: '/glassy/api/'+'media/postImages',
//              method: 'POST',
//              data: new FormData(document.getElementById('image-form'))
//            }).success(function(data, status) {
//                console.log(data);
//                $rootScope.showMessage("Upload success", "success");
//            }).error(function(data, status) {
//                console.log(data);
//                $rootScope.showMessage("Upload failed", "danger");
//            });
            $rootScope.showMessage("Upload file here", "success");
        } else {
            $rootScope.showMessage("No file selected", "danger");
        }
    }
    
    $scope.fileChanged = function() {
        if(document.getElementById('profile-picture').files.length > 0) {
            var f = document.getElementById('profile-picture').files[0],
                r = new FileReader();

            r.onloadend = function(e){
                var data = e.target.result;
                //send you binary data via $http or $resource or do anything else with it
                document.getElementById('profile-image-example').src = data;
            }
            r.readAsDataURL(f);
        } else {
            document.getElementById('profile-image-example').src = "";
        }
    }
    
    $scope.setProfileValues();
    
});
