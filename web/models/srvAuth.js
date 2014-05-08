app.service('srvAuth', function () {

    this.watchLoginChange = function () {

        var _self = this;

        FB.Event.subscribe('auth.authReponseChange', function (reponse) {

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

        FB.api('/me', function (reponse) {

            $rootScope.$apply(function () {
                $rootScope.user = _self.user = reponse;
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



