return function(connection, req, args)
	dofile("httpserver-header.lc")(connection, 200, "json", false)

	local status = wifi.sta.status()

	if(status == 0) then
		connection:send(cjson.encode({status = "idle", message="Station is idle."}))
		collectgarbage()
		return
	end

	if(status == 1) then
		connection:send(cjson.encode({status = "connecting", message="Station is connecting."}))
		collectgarbage()
		return
	end

	if(status == 2) then
		connection:send(cjson.encode({status = "wrong_pwd", message="Station cannot authenticate."}))
		collectgarbage()
		return
	end

	if(status == 3) then
		connection:send(cjson.encode({status = "no_ap", message="Wrong network ssid."}))
		collectgarbage()
		return
	end

	if(status == 4) then
		connection:send(cjson.encode({status = "connect_fail", message="Connection failed."}))
		collectgarbage()
		return
	end

	if(status == 5) then
		local ip = wifi.sta.getip()
		connection:send(cjson.encode({status = "connected", message="Connection successful.", ip = ip}))
		collectgarbage()
		return
	end
end