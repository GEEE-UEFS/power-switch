(function (){
    'use strict';

    angular
        .module('app')
        .factory('wifiData', wifiData)
    
    wifiData.$inject = ['pouchDB', '$q'];

    function wifiData(pouchDB, $q){
        var db = pouchDB('wifi');

        var factory = {
            drop: drop,
            get: get,
            put: put,
            update: update
        }

        return factory;

        function drop (ssid) {
            return db.get(ssid).then(function(doc) {
              return db.remove(doc);
            });
        }

        function get (ssid) {
            return db.get(ssid);
        }

        function put (data) {
            var wifiData = {
                _id: data.ssid,
                ssid: data.ssid,
                description: data.description,
                password: data.password,
                devices: []
            }

            return db.put(wifiData);
        }

        function update (ssid, data) {
            var q = $q.defer();

            db.get(ssid).then(function (doc) {
                var wifiData = {
                    _id: doc._id,
                    _rev: doc._rev,
                    description: data.description,
                    password: data.password
                };

                db.put(wifiData).then(function (data) {
                    q.resolve(data)
                }).catch (function (err) {
                    q.reject(err);
                });
            }).catch (function (err) {
                q.reject(err);
            });

            return q.promise;
        }
    }
})();