app.service('srvAuth', function ($rootScope) {

    this.watchLoginChange = function () {

        var _self = this;

        FB.Event.subscribe('auth.authResponseChange', function (reponse) {

            if (reponse.status === 'connected') {
                _self.getUserInfo();
            }
            else {
                //user is niet ingelogd
            }
        });
    };


    this.getUserInfo = function () {

        var _self = this;

        FB.api('/me', function (response) {

            $rootScope.$apply(function () {
                console.log(response);
                var foto = "https://graph.facebook.com/" + response.id + "/picture?type=large";
            });
        });
    };

    this.logout = function () {

        var _self = this;

        FB.logout(function (reponse) {

            var _self = this;

            FB.logout(function (reponse) {
                $rootScope.$apply(function () {
                    $rootScope.user = _self.user = {};
                });
            });
        });
    };
});



