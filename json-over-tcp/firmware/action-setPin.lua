-- action: setPin
-- params
    -- pinNumber: int
    -- enable: bool

return function (params)
    local response = {}

    local pinNumber = tonumber(params.pinNumber);
    local enable = tostring(params.enable);
    local level;

    if(enable == 'true') then
        level = gpio.LOW;
    else
        level = gpio.HIGH;
    end
    gpio.write(pin[pinNumber], level);

    response["status"] = "OK"
    response["action"] = "setPin"
    response["data"] = params["data"]

    return response
end