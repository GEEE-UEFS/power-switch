dofile("gpio-config.lua")

return function (connection, req, args)
	dofile("httpserver-header.lc")(connection, 200, "json", false)	
	local response = {};
	
	for i=0,5 do
	  response[i] = {id = i, state = gpio.read(tomada[i])}
	end

	connection:send(cjson.encode({response = response}))
	collectgarbage()
end