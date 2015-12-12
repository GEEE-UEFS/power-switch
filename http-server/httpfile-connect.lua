return function (connection, req, args)
	wifi.sta.config(tostring(args.ssid), tostring(args.pwd))
	wifi.sta.connect()

    dofile("httpserver-header.lc")(connection, 200, "json", false)    
    connection:send(cjson.encode({status = "connecting", message="Trying to connect."}))
end
