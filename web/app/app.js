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
            "left-nav":{templateUrl:'app/left-nav/wijk.html'},
            "main":{templateUrl:'app/wijk/index.html'},
            "right-nav": {templateUrl: 'app/right-nav/wijk.html'}
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
            "main": { templateUrl: 'app/profiel/profiel.html' }
        }
    })
    .state('faq', {
        url: '/faq',
        views: {
            //"left-nav": { templateUrl: 'app/left-nav/nav.html' },
            "main": { templateUrl: 'app/faq/faq.html' }
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
.run(function ($rootScope, $state) {
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState) {
        console.log("State change");
        console.log(toState);
        console.log(toParams);
        console.log(fromState);
        
        
        
    });
});
//.directive("ddDraggable", Draggable)
//.directive("ddDropTarget", DropTarget);
