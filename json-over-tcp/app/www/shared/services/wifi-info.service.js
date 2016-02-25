(function (){
    'use strict';

    angular
        .module('app')
        .factory('wifiInfo', wifiInfo)
    
    wifiInfo.$inject = ['$q', '$window'];
    
    function wifiInfo($q, $window){

        var factory = {
            connect: connect,
            getSSID: getSSID
        }

        return factory;

        function connect (ssid) {
            WifiWizard.connectNetwork(ssid, function () {
                console.log("{connected to GEEE} " + JSON.stringify());
            }, function () {
                console.error(JSON.stringify('connection failed to GEEE'));
            });
        }

        function getSSID(def) {
            var q = $q.defer();
            
            /*mock*/
            if(def)
                q.resolve(def);

            if(!$window.WifiWizard) {
                q.reject({error: 'wifiWizard plugin not loaded'});
                return q.promise;
            }
            
            WifiWizard.getCurrentSSID(function (ssid) {
                q.resolve(ssid.replace(/\"/g, ''));
            }, function (err) {
                q.reject(err);
            });

            return q.promise;
        }

    }

})();