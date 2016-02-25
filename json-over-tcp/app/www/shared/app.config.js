(function () {
  'use strict';

  angular
    .module('app', ['ionic', 'ionic-native-transitions', 'ngCordova', 'pouchdb'])
    .run(setup);

  setup.$inject = ['$ionicPlatform'];

  function setup ($ionicPlatform) {
    $ionicPlatform.ready(ready);

    function ready() {
      if(window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }

      if(window.StatusBar) {
        StatusBar.styleDefault();
      }
    }
  }
})();

