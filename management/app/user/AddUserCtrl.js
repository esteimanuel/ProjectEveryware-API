/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

app.controller('AddUserCtrl', function($rootScope, $scope, $http) {
    var navs = [[
        {name:'Toevoegen', active:true, state:'main.users.addUser'},
        {name:'Overzict', state:'main.users.userOverview'}]];
    $rootScope.setNavs(navs); 
    });

