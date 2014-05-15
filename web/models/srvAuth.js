app.service('srvAuth', function () {

    this.watchLoginChange = function () {

        var _self = this;

        console.log("hallo ?");

        FB.Event.subscribe('auth.authReponseChange', function (reponse) {

            console.log("hallo ?");
            console.log(reponse);
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

        console.log('ik werd aangeroepen');
        console.log(reponse);

        FB.api('/me', function (reponse) {

            $rootScope.$apply(function () {
                $rootScope.user = _self.user = reponse;
            });

            console.log('ik ben nu hier');
            console.log(reponse);
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



