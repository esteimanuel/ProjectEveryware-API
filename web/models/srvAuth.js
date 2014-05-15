app.service('srvAuth', function () {

    this.watchLoginChange = function () {

        var _self = this;

        console.log("111111111111111");

        FB.Event.subscribe('srvAuth.watchLoginChange', function (reponse) {

            console.log("222222222");
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



