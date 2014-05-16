/* 
 * Main application init
 */
console.log("app boot script");
var app = angular.module(config.app.name.toLowerCase(), ['ui.router', 'ui.bootstrap'])
.config(function ($controllerProvider, $stateProvider, $urlRouterProvider) {
    //$locationProvider.html5Mode(true);

    app.registerCtrl = $controllerProvider.register;

    $stateProvider.state('home', {
        url:'/',
        views: {
            //"left-nav":{templateUrl:'app/left-nav/nav.html'},
            "main":{templateUrl:'app/home/intro.html'}
        }
    
    }).state('wijk', {
        url:'/wijk/:wid',
        title: 'Wijk',
        views: {
//            "left-nav":{templateUrl:'app/left-nav/wijk.html'},
            "main":{templateUrl:'app/wijk/index.html', controller:'WijkCtrl'}
//            "right-nav": {templateUrl: 'app/right-nav/wijk.html'}
        }
    })
    .state('register', {
        url: '/register',
        views: {
            //"left-nav":{templateUrl: 'app/left-nav/register.html'},
            "main": {templateUrl: 'app/user/register.html'}
        }
    }) 
    .state('profiel', {
        url: '/profiel',
        views: {
            //"left-nav": { templateUrl: 'app/left-nav/nav.html' },
            "main": {templateUrl: 'app/profiel/profiel.html'}
        }
    })
    .state('faq', {
        url: '/faq',
        views: {
            //"left-nav": { templateUrl: 'app/left-nav/nav.html' },
            "main": {templateUrl: 'app/faq/faq.html', controller: 'FaqCtrl'}
        }  
    });

    //    .state('login', {
    //        url:'/login',
    //        title: 'Login',
    //        views: {
    //            "dialog":{templateUrl:'templates/login.html' /*, controller:'UserCtrl'*/}
    //        }
    //    }).state('register', {
    //        url:'/register',
    //        title: 'Register',
    //        views: {
    //            "dialog":{templateUrl:'templates/register.html' /*, controller:'UserCtrl'*/}
    //        }
    //    }).state('main.board.edittask', {
    //        url:'/task/:taskid',
    //        views: {
    //            "main-dialog":{templateUrl: 'templates/edittask.html', controller:'BoardCtrl'}
    //        }
    //    }).state('main.board',{
    //        url:'/b/{boardid}',
    //        views: {
    //            "tab-content":{templateUrl:'templates/board.html',controller:'BoardCtrl'}
    //        }
    //    });

    $urlRouterProvider.otherwise('/');

})
.run(function ($rootScope, $state, $window, srvAuth, User) {
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState) {
        console.log("State change");
        console.log(toState);
        console.log(toParams);
        console.log(fromState); 
        
//        if(toState.name === 'wijk' && !User.isLogged) {
//            event.preventDefault();
//            $state.transitionTo('home');
//            return;
//        }
    });

    $rootScope.user = {};
    $window.fbAsyncInit = function () {

        FB.init({
            appId: '608467429234622',
            channelUrl: 'app/channel/channel.html',
            status: true,
            cookie: true,
            xfbml: true
        });

        srvAuth.watchLoginChange();
    };

    (function (d) {
        var js;
        id = 'facebook-jssdk',
        ref = d.getElementsByTagName('script')[0];

        if (d.getElementById(id)) {
            return;
        }

        js = d.createElement('script');
        js.id = id;
        js.async = true;
        js.src = "//connect.facebook.net/en_US/all.js";

        ref.parentNode.insertBefore(js, ref);
    }(document));

});
//.directive("ddDraggable", Draggable)
//.directive("ddDropTarget", DropTarget);
