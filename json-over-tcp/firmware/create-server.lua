return function (port)
	print("creating server on port " .. port)
	sv = net.createServer(net.TCP, 10)
    sv:listen(port, function(c)
      c:on("receive", function(c, pl) 
         print(pl) 
      end)
      c:send("hello world")
    end)
    return sv
end
