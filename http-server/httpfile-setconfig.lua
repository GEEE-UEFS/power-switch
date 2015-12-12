return function (connection, req, args)
	-- TODO: create config file
	dofile("httpserver-header.lc")(connection, 200, "json", false)
	connection:send(cjson.encode({status = "ok"}))
	--tmr.alarm(0, 150, 0, function()
		
	--	collectgarbage()
	--end)
end