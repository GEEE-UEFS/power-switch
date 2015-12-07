angular.module('starter.services', [])

.factory('DeviceFactory', function() {
  var devices = [
    {
      'exists': true,
      'label': 'Cozinha',
      'ip': '192.168.25.66',
      'pins': [
      {
        'label': 'Torradeira',
        'enabled': false
      },
      {
        'label': 'Cafeteira',
        'enabled': true
      },
      {
        'label': 'Liquidificador',
        'enabled': false
      }
      ]
    },
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
    }
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
    {
      'exists': true,
      'ssid': 'GVT-FAEB',
      'password': '9888548211',
    },
    {
      'exists': true,
      'ssid': 'GVT-8266',
      'password': 'CP1318RMJBZ',
    }
  ];

  return {
    all: function() {
      return networks;
    },
    remove: function(network) {
      networks.splice(devices.indexOf(device), 1);
    },
    add: function (network){
      networks.push(device);
    }
  };
});
