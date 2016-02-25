-- action: setConfig
-- params


return function (params)
    local response = {}

    local ssid = tostring(params.ssid)
    local password = tostring(params.password)

    wifi.setmode(wifi.STATIONAP)
    wifi.sta.config(ssid, password)
    
    if (wifi.getmode() == wifi.STATIONAP) then
        response["status"] = "OK"
        response["action"] = "setConfig"
        response["data"] = "Config set."
    else
        response["status"] = "error"
        response["data"] = "Cannot set mode."
    end

    return response
end