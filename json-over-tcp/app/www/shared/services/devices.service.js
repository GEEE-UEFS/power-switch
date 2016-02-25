(function (){
    'use strict';

    angular
        .module('app')
        .factory('devices', devices)
    
    devices.$inject = ['pouchDB', '$q'];

    function devices(pouchDB, $q){
        var db = pouchDB('wifi');

        var factory = {
            all: all,
            get: get,
            put: put,
            update: update
        }

        return factory;

        function all(ssid) {
            var allDefer = $q.defer();

            db.get(ssid).then(function (doc) {
                allDefer.resolve(doc.devices);
            }).catch(function (err) {
                allDefer.reject(err);
            });

            return allDefer.promise;
        }

        function get (ssid, id) {
            var getDefer = $q.defer();

            db.get(ssid).then(function (doc) {
                var found = false;
                angular.forEach(doc.devices, function(device, key){
                    if(device.id === id){
                        getDefer.resolve(device);
                        found = true;
                    }
                });
                if (!found) {
                    getDefer.reject({error: 'Device not found.'});
                }
            }).catch(function (err){
                getDefer.reject(err);
            });

            return getDefer.promise;
        }

        function put (ssid, deviceData) {
            var device = {
                address: deviceData.address,
                label: deviceData.label,
                switches: deviceData.switches
            }

            var putDefer = $q.defer();

            db.get(ssid).then(function (doc) {
                if(!doc.devices)
                    doc.devices = [];

                doc.devices.push(device);

                console.log("{updating doc} " + JSON.stringify(doc));

                db.put(doc).then(function (){
                    putDefer.resolve(true);
                }).catch(function (err){
                    putDefer.reject(err);
                });
            }).catch(function (err){
                putDefer.reject(err);
            });

            return putDefer.promise;
        }

        function update (ssid, data) {
            var q = $q.defer();

            db.get(ssid).then(function (doc) {
                var devices = {
                    _id: doc._id,
                    _rev: doc._rev,
                    description: data.description,
                    password: data.password
                };

                db.put(devices).then(function (data) {
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