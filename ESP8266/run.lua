configStation()

srv=net.createServer(net.TCP)
srv:listen(80,function(conn)
    conn:on("receive", function(client,request)
      local buf = "";
      local _, _, method, path, vars = string.find(request, "([A-Z]+) (.+)?(.+) HTTP");
      if(method == nil)then
          _, _, method, path = string.find(request, "([A-Z]+) (.+) HTTP");
      end
      local _GET = {}
      if (vars ~= nil)then
          for k, v in string.gmatch(vars, "(%w+)=([a-zA-Z0-9.]+)&*") do
              _GET[k] = v
          end
      end
        --gera um formulario no navegador -- irá desaparecer quando integrar com o aplicativo
        buf = buf.."<h1> ESP8266 Web Server</h1>";
        buf = buf.."<p>Tomada 0 <a href=\"?pinNum=4&state=0\"><button>ON</button></a>&nbsp;<a href=\"?pinNum=4&state=1\"><button>OFF</button></a></p>";
        buf = buf.."<p>Tomada 1 <a href=\"?pinNum=3&state=0\"><button>ON</button></a>&nbsp;<a href=\"?pinNum=3&state=1\"><button>OFF</button></a></p>";
        buf = buf.."<p>Tomada 2 <a href=\"?pinNum=1&state=0\"><button>ON</button></a>&nbsp;<a href=\"?pinNum=1&state=1\"><button>OFF</button></a></p>";
        buf = buf.."<p>Tomada 3 <a href=\"?pinNum=2&state=0\"><button>ON</button></a>&nbsp;<a href=\"?pinNum=2&state=1\"><button>OFF</button></a></p>";
        buf = buf.."<p>Tomada 4 <a href=\"?pinNum=5&state=0\"><button>ON</button></a>&nbsp;<a href=\"?pinNum=5&state=1\"><button>OFF</button></a></p>";
        buf = buf.."<p>Tomada 5 <a href=\"?pinNum=0&state=0\"><button>ON</button></a>&nbsp;<a href=\"?pinNum=0&state=1\"><button>OFF</button></a></p>";

        local pinNum = tonumber(_GET.pinNum);
        local state = tonumber(_GET.state);

        if(_GET.pinNum ~= nil and _GET.state ~= nil and
          tostring(_GET.pinNum) ~= "" and tostring(_GET.state) ~= "") then
          print(_GET.pinNum)
          print(_GET.state)
          gpio.write(tomada[pinNum], state);
        end
        client:send(buf);
        client:close();
        collectgarbage();
    end)
end)
