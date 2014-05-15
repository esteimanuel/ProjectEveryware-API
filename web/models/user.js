/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

app.service('User', function() {
    var _this = this;
    _this.account = null;
    _this.gebruiker = null;
    
    this.setLogged = function(isLogged) {
        _this.isLogged = !!isLogged;
    }
    
    this.setAccount = function(data, setLocalStorage) {
        if(setLocalStorage)
            localStorage.account = JSON.stringify(data);
        _this.account = data;
    }
    
    this.setGebruiker = function(data, setLocalStorage) {
        if(setLocalStorage)
            localStorage.gebruiker = JSON.stringify(data);
        _this.gebruiker = data;
        _this.gebruiker.naam = _this.gebruiker.voornaam + ((_this.gebruiker.tussenvoegsel) ? " "+_this.gebruiker.tussenvoegsel+" " : " ") + _this.gebruiker.achternaam;
    }
    
    this.reset = function() {
        _this.isLogged = false;
        _this.account = null;
        _this.gebruiker = null;
        localStorage.removeItem('account');
        localStorage.removeItem('gebruiker');
    }
    
    this.init = function() {
        if(localStorage.account && localStorage.gebruiker) {
            _this.setAccount(JSON.parse(localStorage.account));
            _this.setGebruiker(JSON.parse(localStorage.gebruiker));
        }
        
        _this.setLogged((_this.account && _this.gebruiker));
    }
});
