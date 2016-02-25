(function (){
    'use strict';

    angular
        .module('app')
        .controller('EditSwitchController', EditSwitchController);
    
        EditSwitchController.$inject = ['$ionicPopup', '$state', '$stateParams', 'devices'];

    function EditSwitchController($ionicPopup, $state, $stateParams){
        var vm = this;
        
        vm.cancel = cancel;
        vm.isDimmer = false;
        vm.label = '';
        vm.save = save;

        activate();

        function activate () {
            vm.default = $stateParams.sw.default;
            vm.id = $stateParams.sw.id;
            vm.isDimmer = $stateParams.sw.isDimmer;
            vm.label = $stateParams.sw.label;
            vm.defer = $stateParams.defer;
        }

        function cancel () {
            $state.go('add-device');
        }

        function save () {
            vm.defer.resolve(vm);
            $state.go('add-device');
        }
    }
})();