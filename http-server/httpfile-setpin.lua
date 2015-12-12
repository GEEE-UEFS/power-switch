dofile('gpio-config.lua');

return function (connection, req, args)
	local pinNum = tonumber(args.accessPin);
	local pinState = tostring(args.enablePin);
	local level;

	if(pinState == 'true') then
		level = gpio.LOW;
	else
		level = gpio.HIGH;
	end
	gpio.write(tomada[pinNum], level);
	dofile("httpserver-header.lc")(connection, 200, "json", false)
	connection:send(cjson.encode({status = "ok"}))
	collectgarbage()
end