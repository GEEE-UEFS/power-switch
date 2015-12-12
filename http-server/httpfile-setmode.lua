return function (connection, req, args)
	connection:send(cjson.encode({status = "mode_set", message="Mode set"}))
	tmr.alarm(0, 1500, 0, function()
		wifi.setmode(wifi.STATION);
		collectgarbage()
	end)
end