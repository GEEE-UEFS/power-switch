(function (){
    'use strict';

    angular
        .module('app')
        .controller('AddDeviceController', AddDeviceController);
    
        AddDeviceController.$inject = [
            'devices', 
            '$cordovaNetwork',
            '$interval',
            '$ionicLoading', 
            '$ionicPopup',
            'jsonTCP',
            '$q', 
            '$rootScope', 
            '$scope', 
            '$state', 
            '$stateParams', 
            '$timeout',
            'wifiData',
            'wifiInfo'];

    function AddDeviceController(devices, $cordovaNetwork, $interval, $ionicLoading, $ionicPopup, jsonTCP, $q, $rootScope, $scope, $state, $stateParams, $timeout, wifiData, wifiInfo){
        var vm = this;
        
        vm.cancel = cancel;
        vm.editSwitch = editSwitch;
        vm.hideLoading = hideLoading;
        vm.label = '';
        vm.save = save;
        vm.showLoading = showLoading;
        vm.switches = [];
        vm.wifi = {};

        activate();

        function activate () {
            for (var i = 1; i < 5; i++){
                vm.switches.push({'id': i-1, 'label': '', default: 'Switch ' + i});
            }

            vm.wifi = $stateParams.wifi;
            
            wifiInfo.getSSID().then(function(ssid){
                if(ssid != 'GEEE'){
                    $timeout(function(){
                        wifiInfo.connect('GEEE');
                        vm.showLoading('Trying to connect...');
                    }, 400);

                    vm.geeeTimeout = $timeout(function(){
                        vm.showLoading('Please connect to the GEEE network');
                        $scope.showButtons = true;
                    }, 5000);

                } else {
                    $rootScope.$broadcast('$cordovaNetwork:online', 'wifi');
                }
            });
            
            // $timeout(function(){
            //     $rootScope.$broadcast('$cordovaNetwork:online', 'wifi');
            // }, 3000);

            console.log("{received params} " + JSON.stringify(vm.wifi));
            $scope.$on('$cordovaNetwork:online', function(evt, networkState){
                console.log("{im a living listener} " + JSON.stringify());

                 if(networkState == 'wifi') {
                    wifiInfo.getSSID().then(function (ssid) {
                        if(ssid === 'GEEE') {
                            $timeout.cancel(vm.geeeTimeout);

                            vm.showLoading('Setting up connection data...');
                            vm.socket = jsonTCP.init();
                            jsonTCP.open(vm.socket, '192.168.75.55', 7555).then(function (){
                                console.log("{opened socket}");
                                $scope.showButtons = false;
                                configInterval();
                            }).catch (function (openErr) {
                                console.error(JSON.stringify(openErr));
                            })
                        }
                    
                    });
                }   
            });
        }

        function cancel () {
            $state.go('home');
        }

        function configInterval () {
            
            var statusResponse = {
                status: 'ap_only'
            };

            var setConfigCallback = function (response) {
                if(response.status == 'OK') {
                    vm.showLoading('Connection set, waiting address...');
                    statusResponse = {
                        status: 'connecting'
                    }
                }
            }

            var setConfigError = function (error) {
                console.error(JSON.stringify(error));
            }

            var deviceResetCallback = function (response) {
                $interval.cancel(vm.configInterval);
                if(vm.wrong_pwd){
                    
                    $ionicPopup.alert({
                        title: 'Connection error',
                        template: 'A wrong password was entered on your Wifi setup. <br><br>Please type in the correct password on <b>Advanced Setting</b>.'
                    }).then(function(){
                        $state.go('advanced-wifi');
                    });

                } else {
                    $ionicPopup.alert({
                        title: 'Connection error',
                        template: 'The board could not connect to your network. <br><br>Please make sure DHCP is on, or go to <b>Advanced Settings</b> and set a static IP range.'
                    }).then(function(){
                        $state.go('home');
                    });
                }

               
            
            }

            var deviceResetError = function (error) {
                console.error(JSON.stringify(error));
            }

            var statusCallback = function (response) {
                console.log("{status response} " + JSON.stringify(response));

                var resetConfigMessage = {
                    action: 'resetConfig'
                };

                var setConfigMessage = {
                    action: 'setConfig',
                    params: {
                        ssid: vm.wifi.ssid,
                        password: vm.wifi.password
                    }
                };

                switch(response.status) {

                    case 'ap_only':
                        var response = {
                            status: 'OK'
                        };

                        jsonTCP.write(vm.socket, setConfigMessage/*, response*/)
                            .then(setConfigCallback)
                            .catch(setConfigError);
                    
                    break;

                    case 'idle':
                    case 'connecting':
                        console.log("{connecting} " + JSON.stringify(response.status));
                        vm.retries++;

                        statusResponse = {
                            status: 'connected',
                            address: '192.168.25.239'
                        }
                        
                        if(vm.retries > 6) {
                            vm.hideLoading();

                            console.log("{connecting} " + JSON.stringify(response.status));
                            $interval.cancel(vm.configInterval);

                            jsonTCP.write(vm.socket, resetConfigMessage/*, resetResponse*/)
                                .then(deviceResetCallback)
                                .catch(deviceResetError);
                        }
                    break;

                    case 'wrong_pwd':
                        var response = {
                            status: 'OK'
                        };
                        vm.hideLoading();
                        vm.wrong_pwd = true;

                        jsonTCP.write(vm.socket, resetConfigMessage/*, response*/)
                            .then(deviceResetCallback)
                            .catch(deviceResetError);
                    break;
                    
                    case 'connected':
                        console.log("{connected} " + JSON.stringify(response));
                        vm.address = response.address;
                        vm.hideLoading();
                        
                        $ionicPopup.alert({
                            title: 'Device linked',
                            template: 'You can customize your device now.'
                        });

                        $interval.cancel(vm.configInterval);
                    break;
                }
            };

            var statusError = function (error) {
                console.error(JSON.stringify(error));
                vm.socket = jsonTCP.init();
                jsonTCP.open(vm.socket, '192.168.75.55', 7555).then(function (){
                    console.log("{opened socket}");
                }).catch (function (openErr) {
                    console.error(JSON.stringify(openErr));
                });
            }

            vm.retries = 0;
            $interval.cancel(vm.configInterval);
            vm.configInterval = $interval(function (){
                var statusMessage = {action: 'getStatus'};

                jsonTCP.write(vm.socket, statusMessage/*, statusResponse*/)
                    .then(statusCallback)
                    .catch(statusError);
            }, 2500);
        }

        function editSwitch (sw) {
            var editDefer = $q.defer();

            editDefer.promise.then(function (sw){
                vm.switches[sw.id].label = sw.label;
                vm.switches[sw.id].isDimmer = sw.isDimmer;
            });

            $state.go('edit-switch', {sw: sw, defer: editDefer});
        }

        function hideLoading () {
            $ionicLoading.hide();
        }

        function save () {
            var deviceData = {
                address: vm.address,
                label: vm.label,
                switches: vm.switches
            };

            for (var i = 0; i < 4; i++)
                vm.switches[i].label = vm.switches[i].label || vm.switches[i].default;

            console.log("{switches} " + JSON.stringify(vm.switches));

            devices.put(vm.wifi.ssid, deviceData).then(function (data){
                $state.go('home');
            }).catch(function(err) {
                console.error(JSON.stringify(err));
            }).finally(function() {
                console.log("{finally called} " + JSON.stringify());
            });

        }

        function showLoading (content) {
            $scope.content = content;
            if(!$scope.isShown)
                $ionicLoading.show({
                  templateUrl: 'components/add-device/loading.template.html',
                  scope: $scope
                });
            $scope.isShown = true;
            $scope.cancel = function () {
                vm.hideLoading();
                $interval.cancel(vm.configInterval);
                $state.go('home');
            }

        }
    }
})();