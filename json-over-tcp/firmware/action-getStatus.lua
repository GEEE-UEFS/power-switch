-- action: getStatus

return function (params)
    local status = wifi.sta.status()
    local response = {}
    local status_text = {
        [0] = "idle",
        [1] = "connecting",
        [2] = "wrong_pwd",
        [3] = "no_ap",
        [4] = "connection_failed",
        [5] = "connected",
        [255] = "ap_only"
    }

    -- if gpio.read(pin[5]) == gpio.HIGH then
    --     gpio.write(pin[5], gpio.LOW)
    -- else
    --     gpio.write(pin[5], gpio.HIGH)
    -- end

    print(status .. " " .. status_text[status])
    response ["status"] = status_text[status]

    if status == 5 then
        response["address"] = wifi.sta.getip()
    end
    
    return response
end