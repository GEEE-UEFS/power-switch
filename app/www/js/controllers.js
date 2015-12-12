angular.module('starter.controllers', [])
  .controller('TabsCtrl', function($rootScope, $scope, $timeout, $interval, $cordovaNetwork, $ionicTabsDelegate, $ionicPlatform, $ionicPopup, $cordovaToast, NetworkFactory) {

    $scope.config = {};

    $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
      $scope.networkType = $cordovaNetwork.getNetwork();
      console.log("{network} " + JSON.stringify($scope.networkType));
      $scope.getSSID();

      if ($scope.networkType != "wifi")
        return;

      if ($scope.config.ssid == "GEEE")
        return;

      if (NetworkFactory.exists($scope.config.ssid)) {
        $scope.localNetwork = NetworkFactory.get($scope.config.ssid);
        return;
      }

      if ($scope.wifiAsked)
        return;
      $timeout(function(){
        $scope.wifiAsked = true;
        $scope.data = {};
        var wifiPopup = $ionicPopup.show({
          templateUrl: 'ask-wifi.html',
          title: 'Cadastrar rede ' + $scope.config.ssid,
          scope: $scope,
          buttons: [{
            text: '<b>Salvar</b>',
            type: 'button-positive',
            onTap: function(e) {
              if ($scope.data.pwd === $scope.data.confirm)
                return $scope.data.pwd;
              else {
                $scope.data.pwd = $scope.data.confirm = '';
                $scope.pwderror = true;
                e.preventDefault();
              }
            }
          }]
        });

        wifiPopup.then(function(password) {
          var network = {
            'exists': true,
            'ssid': $scope.config.ssid,
            'password': password
          };
          NetworkFactory.add(network);
          $scope.wifiAsked = false;
          $scope.localNetwork = NetworkFactory.get($scope.config.ssid);
        });

      }, 0);
    });

    /*$interval(function() {
      $scope.networkType = $cordovaNetwork.getNetwork();
      if ($scope.networkType != 'wifi')
        $scope.showWaitingWifi();
    }, 1000)*/

    $scope.getSSID = function() {
      
      $scope.config.ssid = prompt("Wifi name");

      /*
      WifiWizard.getCurrentSSID(function(ssid) {
        $scope.config.ssid = ssid.replace(/\"/g, '');
      });
      */
    };

    $scope.goForward = function() {
      var selected = $ionicTabsDelegate.selectedIndex();
      if (selected != -1) {
        $ionicTabsDelegate.select(selected + 1);
      }
    };

    $scope.goBack = function() {
      var selected = $ionicTabsDelegate.selectedIndex();
      if (selected != -1 && selected != 0) {
        $ionicTabsDelegate.select(selected - 1);
      }
    };
  })
  .controller('DashCtrl', function($scope, $ionicPopover, $cordovaToast, $http, $ionicPlatform, $cordovaNetwork, $ionicLoading, $timeout, $interval, $ionicModal, DeviceFactory, NetworkFactory) {
    $scope.$on("$ionicView.enter", function() {
      $scope.devices = DeviceFactory.all();
    });

    $scope.show = function(template) {
      if (!$scope.shown) {
        $ionicLoading.show({
          templateUrl: template + '.html',
          scope: $scope
        });
        $scope.shown = true;
      }
    }

    $scope.showBusy = function() {
      $scope.show('geee-wait');
    };

    $scope.showConnecting = function() {
      $scope.show('conn-wait');
    };

    $scope.showWaitingWifi = function() {
      $scope.show('wifi-wait');
    };

    $scope.hideLoading = function() {
      $timeout.cancel($scope.connectTimeout);
      $timeout.cancel($scope.statusTimeout);
      $ionicLoading.hide();
      $scope.shown = false;
    }

    $scope.postSuccess = function(data) {
      console.log("{post success} " + JSON.stringify(data));
    }

    $scope.postError = function(data) {
      console.error(JSON.stringify(data));
    }

    $scope.setPin = function(device, pin) {

      var request = {
        accessPin: device.pins.indexOf(pin),
        enablePin: pin.enabled
      };

      var data = {
        params: request
      }

      $http.get('http://' + device.ip + '/setpin.lua', data).then($scope.postSuccess, $scope.postError);
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

    $scope.addPin = function() {
      if ($scope.newdevice.pinLabel) {
        var newPin = {
          label: $scope.newdevice.pinLabel
        };

        $scope.newdevice.pins.push(newPin);
        $scope.newdevice.pinLabel = '';
      }
    }

    $scope.deletePin = function(pin) {
      var index = $scope.newdevice.pins.indexOf(pin);
      $scope.newdevice.pins.splice(index, 1);
    }


    $scope.openModal = function() {
      $scope.modal.show();
    };

    $scope.newDeviceSuccess = function(data) {
      console.log("{data} " + JSON.stringify(data));
      $scope.newdevice.exists = true;

      $timeout(function() {
        $scope.isAddingDevice = false;
        DeviceFactory.add($scope.newdevice);
      }, 5000);
    };

    $scope.newDeviceError = function(err) {
      console.error(JSON.stringify(err));
      var request = {
        label: $scope.newdevice.label
      };

      var data = {
        params: request
      }

      $timeout(function() {
        $http.get('http://' + $scope.newdevice.ip + '/setconfig.lua', data).then($scope.newDeviceSuccess, $scope.newDeviceError);
      }, delay);
    };

    $scope.editDevice = function(device) {
      angular.copy(device, $scope.newdevice);
      $scope.olddevice = device;
      $scope.openModal();
    }

    $scope.create = function() {
      if ($scope.networkType != 'wifi') {
        $cordovaToast.showShortBottom("Por favor, conecte-se à sua rede wifi.")
        return;
      }

      $scope.isAddingDevice = true;

      if (!($scope.newdevice.label &&
          $scope.newdevice.pins.length > 0))
        return;

      var request = {
        label: $scope.newdevice.label
      };

      var data = {
        params: request
      }
      $http.get('http://' + $scope.newdevice.ip + '/setconfig.lua', data).then($scope.newDeviceSuccess, $scope.newDeviceError);
      $scope.closeModal();
    };


    $scope.save = function() {
      if (!($scope.newdevice.label &&
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
      $scope.modal.hide();
    };

    $scope.addDevice = function() {
        $scope.newdevice = {
          pins: []
        };

        var request = {
          ssid: $scope.localNetwork.ssid,
          pwd: $scope.localNetwork.password
        };

        var data = {
          params: request
        }
        var connectSuccess = function(response) {
          console.log("{connect} " + JSON.stringify(response));
          $scope.hideLoading();
          $scope.showConnecting();
          $http.get('http://192.168.111.1/status.lua').then(statusSuccess, statusError);
        };
        var connectError = function(response) {
          console.error(JSON.stringify(response));
          $scope.connectTimeout = $timeout(function() {
            $http.get('http://192.168.111.1/connect.lua', data).then(connectSuccess, connectError);
          }, 3000);
        };
        var statusSuccess = function(response) {
          console.log("{status} " + JSON.stringify(response));

          switch (response.data.status) {
            case 'connecting':
              $timeout(function() {
                $http.get('http://192.168.111.1/status.lua').then(statusSuccess, statusError);
              }, 3000);
              break;

            case 'connected':
              $scope.newdevice.ip = response.data.ip;
              $scope.newdevice.isConnected = true;
              $http.get('http://' + $scope.newdevice.ip + '/setmode.lua').then(function(success) {
                $scope.openModal();
                $scope.hideLoading();
              }, function(error) {
                console.error(JSON.stringify(error));
                $cordovaToast.showShortBottom("Ocorreu um erro ao conectar. Tente reiniciar o dispositivo.")
              });
              break;

            case 'wrong_pwd':
              $scope.hideLoading();
              $cordovaToast.showShortBottom("A senha configurada  para a rede está incorreta.")
              break;
          }
        };
        var statusError = function(response) {
          console.error(JSON.stringify(response));
          $scope.statusTimeout = $timeout(function() {
            $http.get('http://' + $scope.newdevice.ip + '/status.lua').then(statusSuccess, statusError);
          }, 3000);
        };

        if ($scope.networkType != 'wifi') {
          $cordovaToast.showShortBottom("Por favor, conecte-se à uma rede wifi.")
          return;
        }

        if ($scope.config.ssid != "GEEE" || $scope.localNetwork) {
          $scope.showBusy();

          $scope.ssidInterval = $interval(function() {
            if ($scope.config.ssid != "GEEE")
              return;

            $interval.cancel($scope.ssidInterval);

            $scope.ipInterval = $interval(function() {
              networkinterface.getIPAddress(function(ip) {
                if (!ip.startsWith('192.168.111'))
                  return;

                $interval.cancel($scope.ipInterval);
                $http.get('http://192.168.111.1/connect.lua', data).then(connectSuccess, connectError);

              });
            }, 1500);

          }, 150)
        }
      }
  })
  .controller('AccountCtrl', function($scope, $http, $ionicPlatform, $cordovaNetwork, $ionicLoading, $timeout, $interval, $ionicModal, DeviceFactory, NetworkFactory) {

    $scope.config = {};
    $scope.networks = NetworkFactory.all();

    $scope.remove = function (network) {
      NetworkFactory.remove(network);
    };
    /*
    $ionicPlatform.ready(function() {
      $scope.networkType = $cordovaNetwork.getNetwork();
      $scope.getSSID();

      $scope.networkTypeScan = $interval(function() {
        $scope.networkType = $cordovaNetwork.getNetwork();
        $scope.getSSID();
      }, 300);
    });
  */
  
  });
