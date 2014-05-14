/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

app.service('User', function() {
    var _this = this;
    _this.account = null;
    _this.gebruiker = null;
    
    this.setLogged = function(isLogged) {
        _this.isLogged = isLogged;
    }
    
    this.setAccount = function(data, setLocalStorage) {
        if(setLocalStorage)
            localStorage.account = data;
        _this.account = data;
    }
    
    this.setGebruiker = function(data, setLocalStorage) {
        if(setLocalStorage)
            localStorage.gebruiker = data;
        _this.gebruiker = data;
    }
    
    this.init = function() {
        if(localStorage.account && localStorage.gebruiker) {
            _this.setAccount(localStorage.account);
            _this.setGebruiker(localStorage.gebruiker);
        }
        
        _this.setLogged((_this.account && _this.gebruiker));
    }
});
