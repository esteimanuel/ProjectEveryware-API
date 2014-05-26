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
    app.registerCtrl = $controllerProvider.register;

    $stateProvider.state('main', {
        url:'',
        views: {
            "top-nav":{templateUrl:'app/main/nav.html'},
            "left-nav":{templateUrl:'app/main/left-nav-dashboard.html'},
            "content":{templateUrl:'app/main/index.html'}
        }
        
        // Fag state
    }).state({
        url: 'faq',
        views: {
            "main":{templateUrl:"app/faq/index.html",controller:"FaqCtrl"}
        }
    
       
//////////////////////////
/// Dashboard redirs
//////////////////////////
        
    }).state('main.dashboard',{
        url: '/dashboard',
        views: {
            "left-nav":{templateUrl:'app/main/left-nav-dashboard.html'},
            "main":{templateUrl:"app/dashboard/index.html"}
        }
        
        }).state('main.dashboard.districts',{
            url: '/wijken',
            views: {
                "content":{templateUrl:"app/dashboard/districts.html", controller:'DashBoardDistrictsCtrl'}
            }
        
        }).state('main.dashboard.users',{
            url: '/gebruikers',
            views: {
                "content":{templateUrl:"app/dashboard/users.html", controller:'DashBoardUsersCtrl'}
            }
        
        }).state('main.dashboard.media',{
            url: '/media',
            views: {
                "content":{templateUrl:"app/dashboard/media.html"}
            }
       
//////////////////////////
/// User redirs
//////////////////////////
        
    }).state('main.users',{
        url: '/gebruikers',
        views: {
            "left-nav":{templateUrl:'app/main/left-nav-users.html'},
            "main": {templateUrl:'app/user/index.html', controller:'UserTableCtrl'}
        }
        
        }).state('main.users.addUser',{
            url: '/Gebruiker_toevoegen',
            views: {
                "content":{templateUrl:"app/user/addUser.html", controller:'AddUserCtrl'}
            }
        
        }).state('main.users.editUser',{
            url: '/Gebruiker_bewerken',
            views: {
                "content":{templateUrl:"app/user/editUser.html", controller:'EditUserCtrl'}
            }
       
//////////////////////////
/// District redirs
//////////////////////////
        
    }).state('main.district', {
        url: '/wijken',
        views: {
            "left-nav":{templateUrl:'app/main/left-nav-district.html'},
            "main": {templateUrl:'app/district/index.html'}
        }
        
        }).state('main.district.addDistrict',{
            url: '/Wijktoevoegen',
            views: {
                "content":{templateUrl:"app/district/addDistrict.html", controller:'addDistrictCtrl'}
            }
        
        }).state('main.district.editDistrict',{
            url: '/wijkbeheer',
            views: {
                "content":{templateUrl:"app/district/editDistrict.html", controller:'editDistrictCtrl'}
            }
       
//////////////////////////
/// Login redirs
//////////////////////////
            
            
    }).state('login', {
        url: '/login',
        views: {
            'content':{templateUrl:'app/user/login.html'}
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
        
        if(User.data.isLogged) {
            if(toState.name === 'login') {
                event.preventDefault();
                $state.transitionTo('main.dashboard');
            }
        } else {
            if(toState.name !== 'login') {
                event.preventDefault();
                $state.transitionTo('login');
            }
        }
        
    });
});
//.directive("ddDraggable", Draggable)
//.directive("ddDropTarget", DropTarget);

