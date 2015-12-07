angular.module('starter.controllers', [])
.controller('TabsCtrl', function ($scope, $ionicTabsDelegate, $ionicPlatform) {

  $scope.config = {};

  $scope.getSSID = function () {
    WifiWizard.getCurrentSSID(function(ssid) {
      $scope.config.ssid = ssid.replace(/\"/g, '');
      console.log("{ssid} " + JSON.stringify($scope.config.ssid));
    });
  };

  $scope.goForward = function () {
      var selected = $ionicTabsDelegate.selectedIndex();
      if (selected != -1) {
          $ionicTabsDelegate.select(selected + 1);
      }
  };

  $scope.goBack = function () {
      var selected = $ionicTabsDelegate.selectedIndex();
      if (selected != -1 && selected != 0) {
          $ionicTabsDelegate.select(selected - 1);
    }
  };

  $ionicPlatform.ready(function(){
    $scope.getSSID();
  });
  
})
.controller('DashCtrl', function($scope, $ionicPopover, $http, $ionicPlatform, $cordovaNetwork, $ionicLoading, $timeout, $interval, $ionicModal, DeviceFactory) {

  $scope.$on("$ionicView.enter", function () {
    $scope.devices = DeviceFactory.all();
  });
  
  $scope.show = function() {
    if(!$scope.shown){
      $ionicLoading.show({
        template: '<span style="text-align: center"><ion-spinner class="spinner-assertive"></ion-spinner><h4>Por favor, conecte-se ao wifi "GEEE"</h4></span><hr><button class="button button-block button-assertive" ng-click="hide()"><i class="ion-cross"></i> Cancelar</button>',
        scope: $scope
      });
      $scope.shown = true;
    }
  };

  $scope.hide = function () {
    $ionicLoading.hide();
    $scope.shown = false;
    $interval.cancel($scope.SSIDScan);
  }

  $scope.postSuccess = function (data) {
    console.log("{post success} " + JSON.stringify(data));
  }

  $scope.postError = function (data) {
    console.error(JSON.stringify(data));
  }

  $scope.setPin = function (device, pin) {

    var request = {
      accessPin: device.pins.indexOf(pin),
      enablePin: pin.enabled
    };

    var data = {
      params: request
    }

    $http.get('//' + device.ip, data).then($scope.postSuccess, $scope.postError);
       
  }

  $ionicModal.fromTemplateUrl('new-device-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.newdevice = {
    ssid: $scope.config.ssid,
    password: '',
    deviceLabel: '',
    pinLabel: '',
    pins: []
  };

  $scope.addPin = function () {
    if($scope.newdevice.pinLabel){
      var newPin = {
        label: $scope.newdevice.pinLabel
      };

      $scope.newdevice.pins.push(newPin);
      $scope.newdevice.pinLabel = '';
    }
  }

  $scope.deletePin = function (pin) {
    var index = $scope.newdevice.pins.indexOf(pin);
    $scope.newdevice.pins.splice(index, 1);
  }

  
  $scope.openModal = function() {
    $scope.modal.show();
  };

  $scope.newDeviceSuccess = function (data) {
    console.log("{data} " + JSON.stringify(data));
  };

  $scope.newDeviceError = function (err) {
    console.error(JSON.stringify(err));
  };

  $scope.editDevice = function (device) {
    angular.copy(device, $scope.newdevice);
    $scope.olddevice = device;
    $scope.openModal();
  }

  $scope.create = function () {
    
      if(!($scope.newdevice.label && 
        $scope.newdevice.pins.length > 0))
        return;
      
      $scope.newdevice.exists = true;

      DeviceFactory.add($scope.newdevice);

      var request = {
        label: $scope.newdevice.label,
        ssid: $scope.config.ssid,
        pwd: $scope.newdevice.pwd,
        ip: $scope.newdevice.ip,
        mask: '255.255.255.0',
        gateway: $scope.newdevice.gateway
      };

      var data = {
        params: request
      }

      $http.get('http://192.168.1.1/', data).then($scope.newDeviceSuccess, $scope.newDeviceError); 
      $scope.closeModal();
  };


  $scope.save = function () {
      if(!($scope.newdevice.label && 
        $scope.newdevice.pins.length > 0))
        return;

      DeviceFactory.set($scope.newdevice);

      var request = {
        label: $scope.newdevice.label,
        ssid: $scope.config.ssid,
        pwd: $scope.newdevice.pwd,
        ip: $scope.newdevice.ip,
        mask: '255.255.255.0',
        gateway: $scope.newdevice.gateway
      };

      var data = {
        params: request
      }

      $http.get('http://192.168.1.1/', data).then($scope.newDeviceSuccess, $scope.newDeviceError); 
      //$scope.closeModal();
  };

  $scope.closeModal = function() {
    
    $timeout(function(){
      $scope.newdevice = {
        pins: []
      };
    }, 400);

    $scope.modal.hide();
  };

  $scope.addDevice = function () {
      $scope.networkType = $cordovaNetwork.getNetwork();

      $scope.getSSID();

      if($scope.networkType == 'wifi') {
        $scope.SSIDScan = $interval(function(){
          if($scope.config.ssid != "GVT-FAEB") {
            
            networkinterface.getIPAddress(function (ip) { 
              $scope.newdevice.ip = ip;
            });

            networkinterface.getGateway( function( gateway ) {
              $scope.newdevice.gateway = gateway;
            }, function (fail) {
              console.error(JSON.stringify(fail));
            });

            $scope.show();
          }
          else {
            $scope.openModal();
            $scope.hide();
          }
        }, 150);
      }
  };

})
.controller('AccountCtrl', function($scope, $http, $ionicPlatform, $cordovaNetwork, $ionicLoading, $timeout, $interval, $ionicModal, DeviceFactory) {
  
  $scope.config = {};

  $ionicPlatform.ready(function (){
    $scope.networkType = $cordovaNetwork.getNetwork();
    $scope.getSSID();

    $scope.networkTypeScan = $interval(function(){
      $scope.networkType = $cordovaNetwork.getNetwork();
      $scope.getSSID();
    }, 300);
  });
 

});