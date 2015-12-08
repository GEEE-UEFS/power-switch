return function (connection, req, args)
	print('Client MAC: ' ,wifi.sta.getmac())
	print('ssid: ', args.ssid)
	print('pwd: ', args.pwd)

	wifi.sta.config(tostring(args.ssid), tostring(args.pwd))
	wifi.sta.connect()
    local count = 0

    dofile("httpserver-header.lc")(connection, 200, "json", false)
    

    while count < 5 do
    	count = count + 1
    	tmr.delay(3000000)
    	print('connecting...')
    	local ip = wifi.sta.getip()
    	if (ip) then
    		print('connected')

    		connection:send(cjson.encode({status = "connected", ip = ip}))
    		break
    	end
    end
   
    connection:send(cjson.encode({status = "error", message="Connection timed out."}))
end
