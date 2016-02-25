(function (){
    'use strict';

    angular
        .module('app')
        .factory('network', network)
    
    
    function network(){
        var vm = this;

        var factory = {
            currentSSID: currentSSID,
            getIP: getIP,
            networkInfo: networkInfo
        }

        return factory;

        function currentSSID () {
            return 'GVT-FAEB'; /* mock */
        }

        function getIP() {
            return '192.168.25.66'; /* mock */
        }

        function networkInfo() {
            return 'wifi'; /* mock */
        }

    }

})();