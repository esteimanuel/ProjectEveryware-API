/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

app.service('User', function() {
    this.data = {
        isLogged: !!(localStorage.token),
        token: localStorage.token,
        name: ''
    };
});
