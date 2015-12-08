-- Begin WiFi configuration

local wifiConfig = {}

-- wifi.STATION         -- station: join a WiFi network
-- wifi.SOFTAP          -- access point: create a WiFi network
-- wifi.wifi.STATIONAP  -- both station and access point
wifiConfig.mode = wifi.STATIONAP  -- both station and access point

wifiConfig.accessPointConfig = {}
wifiConfig.accessPointConfig.ssid = "GEEE"   -- Name of the SSID you want to create

wifiConfig.accessPointIpConfig = {}
wifiConfig.accessPointIpConfig.ip = "192.168.111.1"
wifiConfig.accessPointIpConfig.netmask = "255.255.255.0"
wifiConfig.accessPointIpConfig.gateway = "192.168.111.1"

-- Tell the chip to connect to the access point

wifi.setmode(wifiConfig.mode)
print('set (mode='..wifi.getmode()..')')

if (wifiConfig.mode == wifi.SOFTAP) or (wifiConfig.mode == wifi.STATIONAP) then
    print('AP MAC: ',wifi.ap.getmac())
    wifi.ap.config(wifiConfig.accessPointConfig)
    wifi.ap.setip(wifiConfig.accessPointIpConfig)
end

print('chip: ',node.chipid())
print('heap: ',node.heap())

wifiConfig = nil
collectgarbage()

-- End WiFi configuration

-- Compile server code and remove original .lua files.
-- This only happens the first time afer the .lua files are uploaded.

local compileAndRemoveIfNeeded = function(f)
   if file.open(f) then
      file.close()
      print('Compiling:', f)
      node.compile(f)
      file.remove(f)
      collectgarbage()
   end
end

local serverFiles = {'httpserver.lua', 'httpserver-basicauth.lua', 'httpserver-conf.lua', 'httpserver-b64decode.lua', 'httpserver-request.lua', 'httpserver-static.lua', 'httpserver-header.lua', 'httpserver-error.lua'}
for i, f in ipairs(serverFiles) do compileAndRemoveIfNeeded(f) end

compileAndRemoveIfNeeded = nil
serverFiles = nil
collectgarbage()

-- Connect to the WiFi access point.
-- Once the device is connected, you may start the HTTP server.

-- Uncomment to automatically start the server in port 80
if (not not wifi.sta.getip()) or (not not wifi.ap.getip()) then
    dofile("httpserver.lc")(80)    
end


