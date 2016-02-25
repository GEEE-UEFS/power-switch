(function (){
    'use strict';

    angular
        .module('app')
        .config(routeConfig);
    
    routeConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

    function routeConfig($stateProvider, $urlRouterProvider){
        $stateProvider
        .state('app', {
            url: '/app',
            abstract: true,
            templateUrl: 'shared/menu.template.html'
        })
        .state('home', {
            nativeTransitions: {
                "type": "slide",
                "direction": "right"
            },
            parent: 'app',
            url: '/home',
            views: {
              'content': {
                templateUrl: 'components/home/home.template.html',
                controller: 'HomeController',
                controllerAs: 'home'
              }
            }
        })
        .state('add-device', {
            parent: 'home',
            url: '^/add-device',
            params: {
                wifi: null,
                callback: null,
            },
            views: {
              'content@app': {
                templateUrl: 'components/add-device/add-device.template.html',
                controller: 'AddDeviceController',
                controllerAs: 'device'
              }
            }
        })
        .state('edit-switch', {
            parent: 'add-device',
            url: '/edit-switch',
            params: {
                sw: null,
                defer: null,
            },
            views: {
              'content@app': {
                templateUrl: 'components/edit-switch/edit-switch.template.html',
                controller: 'EditSwitchController',
                controllerAs: 'switch'
              }
            }
        })
        .state('config-wifi', {
            parent: 'home',
            params: {
                ssid: null
            },
            url: '/config-wifi',
            views: {
              'content@app': {
                templateUrl: 'components/config-wifi/config-wifi.template.html',
                controller: 'ConfigWifiController',
                controllerAs: 'wifi'
              }
            }
        })
        .state('advanced-wifi', {
            parent: 'home',
            params: {
                wifi: null
            },
            url: '/advanced-wifi',
            views: {
              'content@app': {
                templateUrl: 'components/advanced-wifi/advanced-wifi.template.html',
                controller: 'AdvancedWifiController',
                controllerAs: 'advanced'
              }
            }
        });


        $urlRouterProvider.otherwise('/app/home');
    };

})();