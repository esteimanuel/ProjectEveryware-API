/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/* 
 * Main application init
 */
console.log("app boot script for management");
var app = angular.module(config.app.name.toLowerCase(), ['ui.router', 'ui.bootstrap', 'gl.table'])
.config(function ($controllerProvider, $stateProvider, $urlRouterProvider) {
    //$locationProvider.html5Mode(true);

    app.registerCtrl = $controllerProvider.register;

    $stateProvider.state('main', {
        url:'/home',
        views: {
            "top-nav":{templateUrl:'app/main/nav.html'},
            "left-nav":{templateUrl:'app/main/left-nav.html'},
            "content":{templateUrl:'app/main/index.html'}
        }
    }).state('main.dashboard',{
        url: '/dashboard',
        views: {
            "main":{templateUrl:"app/dashboard/index.html"}
        }
    }).state('main.users',{
        url: '/gebruikers',
        views: {
            "main": {templateUrl:'app/user/index.html', controller:'UserTableCtrl'}
        }
    }).state('main.districts', {
        url: '/wijken',
        views: {
            "main": {templateUrl:'app/district/index.html'}
        }
    }).state('login', {
        url: '/login',
        views: {
            'content':{templateUrl:'app/user/login.html', controller:'LoginCtrl'}
        }
    }).state('user', {
        url: '/user',
        views: {
            'main':{templateUrl: 'app/user/index.html', controller:'UserTableCtrl'}
        }
    });

    $urlRouterProvider.otherwise('/login');

})
.run(function ($rootScope, $state, User) {
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState) {
        console.log("State change");
        console.log(toState);
        console.log(toParams);
        console.log(fromState);
        
//        if(User.data.isLogged) {
//            if(toState.name === 'login') {
//                event.preventDefault();
//                $state.transitionTo('home');
//            }
//        } else {
//            if(toState.name !== 'login') {
//                event.preventDefault();
//                $state.transitionTo('login');
//            }
//        }
        
    });
});
//.directive("ddDraggable", Draggable)
//.directive("ddDropTarget", DropTarget);

