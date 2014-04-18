/* 
 * Main application init
 */
console.log("app boot script");
var app = angular.module(config.app.name, ['ui.router', 'ui.bootstrap'])
.config(function ($locationProvider, $stateProvider, $urlRouterProvider) {
    //$locationProvider.html5Mode(true);

    $stateProvider.state('home', {
        url:'/',
        views: {
            //"left-nav":{templateUrl:'app/left-nav/nav.html'},
            "main":{templateUrl:'app/home/intro.html'}
        }
    }).state('wijk', {
        url:'/wijk',
        title: 'Wijk',
        views: {
            "left-nav":{templateUrl:'app/left-nav/wijk.html'},
            "main":{templateUrl:'app/wijk/index.html'},
            "right-nav": {templateUrl: 'app/wijk/mijn-wijk.progress.html'}
        }
    })
    .state('profiel', {
        url: '/profiel',
        views: {
            //"left-nav": { templateUrl: 'app/left-nav/nav.html' },
            "main": { templateUrl: 'app/profiel/profiel.html' }
        }
    })
    .state('faq', {
        url: '/faq',
        views: {
            "left-nav": { templateUrl: 'app/left-nav/nav.html' },
            "main": { templateUrl: 'app/faq/faq.html' }
        }
    })
    .state('mijnWijk', {
        url: '/mijnWijk',
        views: {
            "left-nav": { templateUrl: 'app/left-nav/nav.html' },
            "main": { templateUrl: 'app/wijk/mijn-wijk.html' }
        }
    })
    .state('mijnWijk.progress', {
        "progress": { templateUrl: 'app/wijk/mijn-wijk.progress.html' }
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

    $urlRouterProvider.otherwise("/");

})
.run(function ($rootScope, $state) {
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState) {
        console.log("State change");
        console.log(toState);
        console.log(fromState);
    });
});
//.directive("ddDraggable", Draggable)
//.directive("ddDropTarget", DropTarget);
