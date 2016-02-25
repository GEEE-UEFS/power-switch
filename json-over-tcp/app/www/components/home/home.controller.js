(function (){
    'use strict';

    angular
        .module('app')
        .controller('HomeController', HomeController)
    
    HomeController.$inject = ['$cordovaNetwork', 'devices', '$ionicPlatform', 'jsonTCP', '$scope', '$state', '$stateParams', '$timeout', 'wifiData', 'wifiInfo'];

    function HomeController($cordovaNetwork, devices, $ionicPlatform, jsonTCP, $scope, $state, $stateParams, $timeout, wifiData, wifiInfo){
        var vm = this;


        vm.addDevice = addDevice;
        vm.advancedSettings = advancedSettings;
        vm.changeSwitch = changeSwitch;
        vm.configureWifi = configureWifi;
        vm.dropNetwork = dropNetwork;
        vm.editDevice = editDevice;
        vm.ensureWifiState = ensureWifiState;
        vm.openWifiSettings = openWifiSettings;

        vm.devices = [];
        vm.state = 'idle';
        vm.wifi = {
            set: false
        };

        activate();

        function activate () {
            console.log("{activated home} " + JSON.stringify());

            $ionicPlatform.ready(function (){
                vm.socket = jsonTCP.init();

                $scope.$on('$cordovaNetwork:online', function(evt, networkState){
                    if(networkState == 'wifi') {
                         $ionicPlatform.ready(function (){
                            console.log("{connection changed} " + JSON.stringify());
                            vm.ensureWifiState();
                        });
                    }
                });
            });

            $scope.$on("$ionicView.beforeEnter", function () {
                vm.loaded = false;

                $ionicPlatform.ready(function (){
                    vm.ensureWifiState();
                });

                devices.all(vm.wifi.ssid).then(function (devices) {
                    vm.devices = devices;
                });
            });
        }

        function advancedSettings (){
            var params = {
                wifi: vm.wifi
            }
            console.log("{params} " + JSON.stringify(params));
            $state.go('advanced-wifi', params);
        }

        function addDevice () {
            var params = {
                wifi: vm.wifi
            };
            console.log("{adding device with params} " + JSON.stringify(params));
            $state.go('add-device', params);
        }

        function changeSwitch (device, sw) {
            jsonTCP.open(device.socket, device.address, 7555).then(function (){
                console.log("{opened socket} " + JSON.stringify());
                jsonTCP.write(device.socket, {action: 'getStatus'}).then(function (data){
                    console.log("{data} " + JSON.stringify(data));
                    jsonTCP.close(device.socket);
                });
            });
        }

        function configureWifi() {
            var params = {
                ssid: vm.wifi.ssid
            };

            $state.go('config-wifi', params);
        }

        function dropNetwork () {
            wifiData.drop(vm.wifi.ssid).then(ensureWifiState);
        };

        function editDevice (device) {
            var params = {
                device: device
            }

            $state.go('add-device', params);
        }

        function ensureWifiState() {
            console.log("{processing} " + JSON.stringify(vm.processing));
            if(vm.processing)
                return;

            if($cordovaNetwork.getNetwork() != 'wifi'){
                vm.processing = false;
                return;
            }

            vm.processing = true;
            console.log("{ensuring wifi state} " + JSON.stringify());
            vm.isOnLocalNetwork = false;
            vm.wifi = {}
            vm.devices = [];

            wifiInfo.getSSID().then(function (ssid) {
                console.log("{ssid} " + JSON.stringify(ssid));
                if(ssid === 'GEEE') {
                    vm.isOnLocalNetwork = false;
                    vm.loaded = true;
                    vm.processing = false;
                    return;
                }

                vm.isOnLocalNetwork = true;
                vm.wifi.ssid = ssid;

                wifiData.get(ssid).then(function (wifi) {
                    vm.wifi.password = wifi.password;
                    console.log("{got wifi} " + JSON.stringify(vm.wifi));
                    vm.devices = [];
                    devices.all(vm.wifi.ssid).then(function (devices) {
                        vm.devices = devices;
                        
                        console.log("{connecting to} " + JSON.stringify(vm.devices));
                        angular.forEach(vm.devices, function(device, key){
                            device.socket = jsonTCP.init();

                            console.log("{device} " + JSON.stringify(key));
                            device.connecting = true;

                            device.connectTimeout = $timeout(function(){
                                device.offline = true;
                                device.connecting = false;
                                console.log("{device offline} " + JSON.stringify(device));
                            }, 5000);

                            jsonTCP.open(device.socket, device.address, 7555).then(function (){
                                $timeout(function(){
                                    console.log("{this is a timeout to} " + JSON.stringify(device));
                                    device.online = true;
                                    device.connecting = false;
                                    jsonTCP.close(device.socket);
                                    console.log("{cancelling} " + JSON.stringify(vm.connectTimeout));
                                    $timeout.cancel(device.connectTimeout);
                                    console.log("{cancelled} " + JSON.stringify(vm.connectTimeout));
                                    console.log("{device online} " + JSON.stringify(device.address));
                                }, 200);
                            });
                        });
                    });
                    vm.wifi.set = true;
                }).catch(function (err) {
                    vm.wifi.set = false;
                }).finally(function (){
                    console.log("{finally called this!} " + JSON.stringify());
                    vm.loaded = true;
                    vm.processing = false;
                });
            });
        }

        function openWifiSettings() {
            cordova.plugins.settings.openSetting('wifi', function(win){

            }, function (fail){

            });
        }
    }
})();