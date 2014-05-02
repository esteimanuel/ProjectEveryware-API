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

    $stateProvider.state('home', {
        url:'/',
        views: {
            //"left-nav":{templateUrl:'app/left-nav/nav.html'},
            "main":{templateUrl:'app/home/index.html'}
        }
    }).state('login', {
        url: '/login',
        views: {
            'main':{templateUrl:'app/user/login.html'}
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

