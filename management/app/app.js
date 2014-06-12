/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/* 
 * Main application init
 */
//console.log("app boot script for management");
var app = angular.module(config.app.name.toLowerCase(), ['ui.router', 'ui.bootstrap', 'gl.table'])
.config(function ($controllerProvider, $stateProvider, $urlRouterProvider) {
    app.registerCtrl = $controllerProvider.register;

    $stateProvider.state('main', {
        url:'',
        views: {
            "top-nav":{templateUrl:'app/main/nav.html'},
            "content":{templateUrl:'app/main/index.html'}
        }
    })
    .state('main.faq', {
        url: '/faq',
        views: {
            'main': {templateUrl: 'app/faq/faq.html', controller: 'FaqCtrl'}
        }
    })
    .state('main.media' , {
        url: '/media',
        views: {
            'main': {templateUrl:'app/media/media.html', controller: 'MediaCtrl'}
        }
       
//////////////////////////
/// User redirs
//////////////////////////
        
    }).state('main.users',{
        url: '/gebruikers',
        views: {
            "main":{templateUrl:"app/main/subIndex.html"}
        }
        
        }).state('main.users.addUser',{
            url: '/Gebruiker_toevoegen',
            views: {
                "content":{templateUrl:"app/user/addUser.html", controller:'AddUserCtrl'}
            }
        
        }).state('main.users.userOverview',{
            url: '/Gebruiker_overzicht',
            views: {
                "content":{templateUrl:"app/user/userOverview.html", controller:'userOverviewCtrl'}
            }
       
//////////////////////////
/// District redirs
//////////////////////////
        
    }).state('main.district', {
        url: '/wijken',
        views: {
            "main":{templateUrl:"app/main/subIndex.html"}
        }
        
        }).state('main.district.addDistrict',{
            url: '/Wijktoevoegen',
            views: {
                "content":{templateUrl:"app/district/addDistrict.html", controller:'addDistrictCtrl'}
            }
            
        }).state('main.district.editDistrict', {
            url:'/WijkBewerken/:wid',
            views: {
                "content":{templateUrl:'app/district/editDistrict.html', controller:'editDistrictCtrl'}
            }
           
        }).state('main.district.districtOverview',{
            url: '/wijkbeheer',
            views: {
                "content":{templateUrl:"app/district/districtOverview.html", controller:'districtOverviewCtrl'}
            }
       
//////////////////////////
/// Provider redirs
//////////////////////////
        
    }).state('main.provider', {
        url: '/provider',
        views: {
            "main":{templateUrl:"app/main/subIndex.html"}
        }
            
        }).state('main.provider.editProvider', {
            url:'/Providers',
            views: {
                "content":{templateUrl:'app/provider/provider.html', controller:'providerCtrl'}
            }
            
//////////////////////////
/// actie redirs
//////////////////////////
        
    }).state('main.actie', {
        url: '/acties',
        views: {
            "main":{templateUrl:"app/main/subIndex.html"}
        }
           
        }).state('main.actie.actieToevoegen',{
            url: '/actieToevoegen',
            views: {
                "content":{templateUrl:"app/actie/actieToevoegen.html", controller:'actieToevoegenCtrl'}
            }
           
        }).state('main.actie.actieOverview',{
            url: '/actieBeheer',
            views: {
                "content":{templateUrl:"app/actie/actieOverview.html", controller:'actieOverviewCtrl'}
            }
            
        }).state('main.actie.editActie', {
            url:'/ActieBewerken/:aid',
            views: {
                "content":{templateUrl:'app/actie/editActie.html', controller:'editActieCtrl'}
            }
       
//////////////////////////
/// Report redirs
//////////////////////////
    }).state('main.report', {
        url: '/rapportage',
        views: {
            "main":{templateUrl:"app/main/subIndex.html"}
        }
           
        }).state('main.report.actionFollowers',{
            url: '/actie_deelnemers/:aid',
            views: {
                "content":{templateUrl:"app/reports/actionFollowers.html", controller:'actionFollowersCtrl'}
            }
           
        }).state('main.report.actionDistrict',{
            url: '/actie_wijkdata/:aid',
            views: {
                "content":{templateUrl:"app/reports/actionDistrict.html", controller:'actionDistrictCtrl'}
            }
       
//////////////////////////
/// Login redirs
//////////////////////////
            
            
    }).state('login', {
        url: '/login',
        views: {
            'content':{templateUrl:'app/user/login.html'}
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
                $state.transitionTo('main.actie.actieOverview');
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

