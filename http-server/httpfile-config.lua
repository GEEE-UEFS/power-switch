return function(connection, req, args)
	dofile("httpserver-header.lc")(connection, 200, "json", false)
	

end