angular.module('starter.controllers', [])
.controller('TabsCtrl', function ($scope, $ionicTabsDelegate, $ionicPlatform, $ionicPopup, NetworkFactory) {

  $scope.config = {};

  $scope.getSSID = function () {
    WifiWizard.getCurrentSSID(function(ssid) {
      $scope.config.ssid = ssid.replace(/\"/g, '');
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
    WifiWizard.getCurrentSSID(function(ssid) {
      $scope.config.ssid = ssid.replace(/\"/g, '');
      $scope.data = {};
      if($scope.config.ssid != "GEEE") {

        if(NetworkFactory.exists($scope.config.ssid)){
          return;
        }

        var myPopup = $ionicPopup.show({
          templateUrl: 'ask-wifi.html',
          title: 'Cadastrar rede ' + $scope.config.ssid,
          scope: $scope,
          buttons: [
            {
              text: '<b>Salvar</b>',
              type: 'button-positive',
              onTap: function(e) {
                  if($scope.data.pwd === $scope.data.confirm)
                    return $scope.data.pwd;
                  else {
                    $scope.data.pwd = $scope.data.confirm = '';
                    $scope.pwderror = true;
                    e.preventDefault();
                  }
              }
            }
          ]
        });
        myPopup.then(function(password) {
          var network = {
            'exists': true,
            'ssid' : $scope.config.ssid,
            'password': password
          };
          NetworkFactory.add(network);
        });
      }
    });
  });
  
})
.controller('DashCtrl', function($scope, $ionicPopover, $http, $ionicPlatform, $cordovaNetwork, $ionicLoading, $timeout, $interval, $ionicModal, DeviceFactory, NetworkFactory) {

  $scope.$on("$ionicView.enter", function () {
    $scope.devices = DeviceFactory.all();
  });
  
  $scope.show = function() {
    if(!$scope.shown){
      $ionicLoading.show({
        templateUrl: 'busy.html',
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

    $http.get('http://' + device.ip + '/node_info.lua', data).then($scope.postSuccess, $scope.postError);
       
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

      if($scope.networkType == 'wifi') {
        $scope.getSSID();

        if($scope.config.ssid != "GEEE") {
          $scope.show();
          $scope.localNetwork = NetworkFactory.get($scope.config.ssid);

          $scope.SSIDScan = $interval(function(){
            if($scope.config.ssid != "GEEE")
              $scope.getSSID();
            else {
              alert('im on geee');
              var setSuccess = function (data) {
                alert(json.stringify(data));
                console.log("{success!!} " + JSON.stringify(data));
              };

              var setError = function (error) {
                alert(json.stringify(error));
                console.error(JSON.stringify(error));
              };

              var request = {
                ssid: $scope.localNetwork.ssid,
                pwd: $scope.localNetwork.password
              };

              var data = {
                params: request
              }
              $timeout(function(){
                alert('im sending request');
                $http.get('http://192.168.111.1/connect.lua', data).then(setSuccess, setError); 
              }, 1000);
              
              $interval.cancel($scope.SSIDScan);
              $scope.openModal();
              $scope.hide();
            }
          }, 150);
        }
      } else {
        alert("NO WIFI!");
      }
  };

})
.controller('AccountCtrl', function($scope, $http, $ionicPlatform, $cordovaNetwork, $ionicLoading, $timeout, $interval, $ionicModal, DeviceFactory, NetworkFactory) {
  
  $scope.config = {};
  $scope.networks = NetworkFactory.all();
  
  $ionicPlatform.ready(function (){
    $scope.networkType = $cordovaNetwork.getNetwork();
    $scope.getSSID();

    $scope.networkTypeScan = $interval(function(){
      $scope.networkType = $cordovaNetwork.getNetwork();
      $scope.getSSID();
    }, 300);
  });
 

});