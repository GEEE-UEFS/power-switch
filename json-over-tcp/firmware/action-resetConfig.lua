-- action: setConfig
-- params

return function (params)
    local response = {}

    wifi.setmode(wifi.SOFTAP)

    if (wifi.getmode() == wifi.SOFTAP) then
        response["status"] = "OK"
        response["action"] = "resetConfig"
        response["data"] = "Config reset."
    else
        response["status"] = "error"
        response["data"] = "Could not set mode."
    end

    return response
end