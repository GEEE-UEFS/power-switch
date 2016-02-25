-- Begin WiFi configuration




local wifiConfig = {}

--node.setcpufreq(node.CPU160MHZ)

-- wifi.STATION         -- station: join a WiFi network
-- wifi.SOFTAP          -- access point: create a WiFi network
-- wifi.wifi.STATIONAP  -- both station and access point

wifiConfig.mode = wifi.SOFTAP  -- access point

wifiConfig.accessPointConfig = {}
wifiConfig.accessPointConfig.ssid = "GEEE"

wifi.setmode(wifiConfig.mode)

if (wifiConfig.mode == wifi.SOFTAP) or (wifiConfig.mode == wifi.STATIONAP) then
    print('AP MAC: ',wifi.ap.getmac())
    
    wifiConfig.accessPointIpConfig = {}
    wifiConfig.accessPointIpConfig.ip = "192.168.75.55"
    wifiConfig.accessPointIpConfig.netmask = "255.255.255.0"
    wifiConfig.accessPointIpConfig.gateway = "192.168.75.55"

    wifi.ap.config(wifiConfig.accessPointConfig)
    wifi.ap.setip(wifiConfig.accessPointIpConfig)
end

wifiConfig = nil

dofile('config-gpio.lua')
dofile('config-utils.lua')

collectgarbage()

local port = 7555 -- GEEE port

sv = net.createServer(net.TCP, 30)

sv:listen(port, function(c)
    c:on("receive", function(c, payload)
    print(payload)
    local message = cjson.decode(payload)
    local response = {}
    local action = message["action"];
    local params = message["params"];
    local actionFile = "action-" .. action .. ".lua"
    local actionExists = file.open(actionFile, "r")

    file.close()

    if not actionExists then
        print("script not found")
        response["status"] = "error"
        response["error"] = 404
        response["description"] = "Action not found."
        c:send(cjson.encode(response))
        return
    end
    print("Executing " .. actionFile)
    response = dofile(actionFile)(params)
    c:send(cjson.encode(response))
    collectgarbage()
  end)
end)

local ip = wifi.sta.getip()
if not ip then 
    ip = wifi.ap.getip()

end
print("JOT server running at " .. ip .. ":" ..  port)
collectgarbage()

function idle_indication()
    if not i_ind then
        c_ind = false;
        tmr.alarm(0, 2000, 1, function ()
            gpio.write(pin[0], gpio.LOW)
            tmr.alarm(1, 100, 0, function ()
                gpio.write(pin[0], gpio.HIGH)
            end)
        end)
        i_ind = true
    end
end

function connecting_indication()
    if not c_ind then
        i_ind = false;
        tmr.alarm(0, 300, 1, function ()
            gpio.write(pin[0], gpio.LOW)
            tmr.alarm(1, 100, 0, function ()
                gpio.write(pin[0], gpio.HIGH)
            end)
        end)    
        c_ind = true
    end
end

tmr.alarm(2, 3000, 1, function ()
    if wifi.sta.status() == 5 then
        gpio.write(pin[0], gpio.LOW)
        tmr.stop(0)
    elseif wifi.sta.status() == 1 then
        connecting_indication()
    elseif wifi.sta.status() == 255 then
        idle_indication()
    end
end)