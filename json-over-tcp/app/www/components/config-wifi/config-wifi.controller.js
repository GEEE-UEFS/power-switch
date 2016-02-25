(function (){
    'use strict';

    angular
        .module('app')
        .controller('ConfigWifiController', ConfigWifiController);
    
        ConfigWifiController.$inject = ['$ionicPopup', '$state', '$stateParams', 'wifiData'];

    function ConfigWifiController($ionicPopup, $state, $stateParams, wifiData){
        var vm = this;

        
        vm.cancel = cancel;
        vm.confirmEmptyPassword = confirmEmptyPassword;
        vm.description = '';
        vm.password = '';
        vm.passwordConfirm = '';
        vm.save = save;
        vm.ssid = '';

        activate();

        function activate () {
            console.log("{test params} " + JSON.stringify($stateParams));

            vm.ssid = $stateParams.ssid;
        }

        function cancel () {
            $state.go('app.home');
        }

        function confirmEmptyPassword () {
           var confirmPopup = $ionicPopup.confirm({
             title: 'No password entered',
             template: 'Your network will be added without a password.'
           });

           return confirmPopup;
        };

        function save () {
            // if(vm.password == '') {
            //     confirmEmptyPassword().then(function (ok) {
            //         if(ok){
            //             saveIt = false;
            //         }
            //     });
            // } else {

            // }
            
            var data = {
                ssid: vm.ssid,
                description: vm.description,
                password: vm.password
            };

            wifiData.put(data).then(function (data){
                $state.go('home');
            }).catch(function(err) {
                console.error(JSON.stringify(err));
            })
            .finally(function() {
                console.log("{finally called} " + JSON.stringify());
            });

        }
    }
})();