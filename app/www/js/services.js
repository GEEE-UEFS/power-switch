angular.module('starter.services', [])

.factory('DeviceFactory', function() {
  var devices = [
    /*{
      'exists': true,
      'label': 'ESP-1',
      'ip': '192.168.1.118',
      'pins': [
      {
        'label': 'GPIO0',
        'enabled': false
      },
      {
        'label': 'GPIO1',
        'enabled': false
      },
      {
        'label': 'GPIO2',
        'enabled': false
      },
      {
        'label': 'GPIO3',
        'enabled': false
      },
      {
        'label': 'GPIO4',
        'enabled': false
      },
      {
        'label': 'GPIO5',
        'enabled': false
      }
      ]
    },/*
    {
      'exists': true,
      'label': 'Sala',
      'ip': '172.16.209.104',
      'pins': [
      {
        'label': 'Televisor',
        'enabled': true
      },
      {
        'label': 'Luminária',
        'enabled': true
      }
      ]
    },
    {
      'exists': true,
      'label': 'Quarto',
      'ip': '172.16.209.15',
      'pins': [
      {
        'label': 'PC',
        'enabled': true
      },
      {
        'label': 'Luminária',
        'enabled': true
      }
      ]
    },
    {
      'exists': true,
      'label': 'Banheiro',
      'ip': '172.16.209.14',
      'pins': [
      {
        'label': 'Chuveiro',
        'enabled': true
      },
      {
        'label': 'Aquecedor',
        'enabled': true
      }
      ]
    }*/
  ];

  return {
    all: function() {
      return devices;
    },
    remove: function(device) {
      devices.splice(devices.indexOf(device), 1);
    },
    add: function (device){
      devices.push(device);
    }
  };
})
.factory('NetworkFactory', function() {
  var networks = [
    /*{
      'exists': true,
      'ssid': 'LSE-S10',
      'password': 'embarcados'
    }*/
  ];

  return {
    all: function() {
      return networks;
    },
    remove: function(network) {
      networks.splice(networks.indexOf(network), 1);
    },
    get: function (ssid) {
      for(var i = 0; i < networks.length; i++) {
        if(networks[i].ssid === ssid)
          return networks[i];
      }
      return {};
    },
    add: function (network){
      networks.push(network);
    },
    exists: function (ssid) {
      for(var i = 0; i < networks.length; i++) {
        if(networks[i].ssid === ssid)
          return true;
      }
      return false;
    }
  };
});
