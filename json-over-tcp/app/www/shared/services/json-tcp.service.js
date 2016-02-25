(function (){
    'use strict';

    angular
        .module('app')
        .factory('jsonTCP', jsonTCP);

    jsonTCP.$inject = ['$q', '$window']

    function jsonTCP ($q, $window) {
        var self = this;

        var factory = {
            close: close,
            init: init,
            isJSON: isJSON,
            onError: onError,
            open: open,
            shutdownWrite: shutdownWrite,
            write: write
        };

        return factory;

        function close (socket) {
            var q = $q.defer();

            if(socket && !socket.hasOwnProperty('socketKey')){
                q.reject({error: 'Socket is not a socket.'});
                return q.promise;
            }

            socket.onClose = function () {
                q.resolve();
            }
            socket.close();
            return q.promise;
        };

        function init () {
            if($window.Socket){
                var socket = new Socket();

                socket.onClose = function () {
                    console.log("{socket closed}")
                };

                socket.onError = function (error) {
                    console.log("{socket error} " + JSON.stringify(error));
                };

                socket.onData = function () {
                    console.log("{socket data}")
                }; 

                console.log("{init called} " + JSON.stringify(socket));
                return socket;
            }
        };

        function isJSON(str) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        }

        function onError (socket) {
            var q = $q.defer();
            socket.onError = function (error) {
                q.reject(error);
            }
            return q.promise;
        }

        function open (socket, host, port, justResolve) {
            var q = $q.defer();

            if(!socket.hasOwnProperty('socketKey')){
                q.reject({error: 'Socket is not a socket.'});
                return q.promise;
            }

            if(justResolve){
                console.log("{socket mock opened} " + JSON.stringify());
                q.resolve(justResolve);
                return q.promise;
            }

            socket.open(host, port, function () {
                q.resolve(true);
            }, function (error) {
                q.reject(error);
            })
            return q.promise;
        };

        function shutdownWrite (socket){
            socket.shutdownWrite();    
        }

        function write (socket, obj, justResolve){
            var q = $q.defer();

            if(!socket.hasOwnProperty('socketKey')){
                q.reject({error: 'Socket is not a socket.'});
                return q.promise;
            }

            if(justResolve){
                console.log("{socket mock write} " + JSON.stringify());
                q.resolve(justResolve);
                return q.promise;
            }

            var JSONstr = JSON.stringify(obj);

            if(isJSON(JSONstr)){
                var data = new Uint8Array(JSONstr.length);
                for (var i = 0; i < data.length; i++) {
                    data[i] = JSONstr.charCodeAt(i);
                }
                socket.write(data, function (){}, function (error){
                    q.reject({error: 'Error in write call', data: error});
                });

                socket.onData = function (data) {
                    var str = String.fromCharCode.apply(null, data);
                    if(isJSON(str)){
                        q.resolve(JSON.parse(str));
                    } else {
                        q.reject({error: 'Received non JSON data', data: str});
                    }
                }

                socket.onError = function (error) {
                    q.reject(error);
                }
            } else {
                q.reject({error: 'Tried to write non JSON data', data: JSONstr});
            }
            return q.promise;
        }
    }
})();