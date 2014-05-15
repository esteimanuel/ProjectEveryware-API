/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

app.service('District', function(User, $http) {
    
    var _this = this;
    _this.closebyLimit = 10;
    
    this.init = function(initCompleteCallback) {
        _this.getLatLong(function() {
            if(_this.locationData) {
                $http({
                    url:config.api.url + "wijk/closeby",
                    method:"GET",
                    params: {lat:_this.locationData.latitude, "long":_this.locationData.longitude, limit: 10}
                }).success(function(data, status) {
                    // Set closeBy data and call initComplete;
                    _this.closeby = data;
                    initCompleteCallback();
                }).error(function(data, status) {
                    _this.closeby = [];
                    console.log('Failed to get close by districts');
                    initCompleteCallback();
                });
            } else
                initCompleteCallback();
        });
    }
    
    this.getLatLong = function(callback) {
        var loc_data = null;
        var getLocation = false;
        // Check for user location if is logged on
        if(User.isLogged) {
            console.log(User.gebruiker);
            if(User.gebruiker.postcode) {
                loc_data = {
                    latitude: User.gebruiker.postcode.latitude,
                    longitude: User.gebruiker.postcode.longitude
                };
            }
        }
        // If not user is logged on check for geo location with html5
        if(loc_data == null) {
            getLocation = true;
            _this.getLocation(function(position) {
                if(position) {
                    loc_data =  {
                       latitude: position.coords.latitude,
                       longitude: position.coords.longitude
                    };
                    _this.locationData = loc_data;
                } else {
                    _this.locationData = null;
                }
                callback();
            });
        }
        if(!getLocation) {
            _this.locationData = loc_data;
            callback();
        }
    }
    
    this.getLocation = function(callback) {
        if (navigator.geolocation)
        {
            navigator.geolocation.getCurrentPosition(callback);
        }
        else {
            //x.innerHTML = "Geolocation is not supported by this browser.";
            callback(false);
        }
    }
});
