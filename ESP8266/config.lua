configAP()
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
              for k, v in string.gmatch(vars, "(%w+)=([a-zA-Z0-9.-]+)&*") do
                  _GET[k] = v
              end
          end

          --gera um formulario no navegador -- irá desaparecer quando integrar com o aplicativo
          buf = buf.."<h1> Bem Vindo ao modo de configuracao</h1>";
          buf = buf.."<p>Informe abaixo o nome de sua rede, sua senha e em que parte da esse modulo ira ficar, em seguida, aperter o botao confirmar</p>";
          buf = buf.."<form action=\"\" method=\"GET\">"
          buf = buf.."<p>SSID:  <input type=\"text\" name=\"ssid\" value=\"\"></p>"
          buf = buf.."<p>SENHA: <input type=\"text\" name=\"pwd\" value=\"\"></p>"
          buf = buf.."<p>LOCAL: <input type=\"text\" name=\"label\" value=\"\"></p>"
          buf = buf.."<p>IP: <input type=\"text\" name=\"ip\" value=\"\"></p>"
          buf = buf.."<p>MASCARA: <input type=\"text\" name=\"mask\" value=\"\"></p>"
          buf = buf.."<p>GATEWAY: <input type=\"text\" name=\"gateway\" value=\"\"><input type=\"submit\" value=\"Submeter\"></p>"
          buf = buf.."</form>"

          --verificação para não aceitar nil ou vazio
          if(_GET.ssid ~= nil and _GET.pwd ~= nil and _GET.label ~= nil and
             _GET.ip ~= nil and _GET.mask ~= nil and _GET.gateway ~= nil and
             tostring(_GET.ssid) ~= "" and tostring(_GET.pwd) ~= "" and tostring(_GET.label) ~= "" and
             tostring(_GET.ip) ~= "" and tostring(_GET.mask) ~= "" and tostring(_GET.gateway) ~= "" ) then
                createconfigsta(tostring(_GET.ssid), tostring(_GET.pwd), tostring(_GET.label), tostring(_GET.ip), tostring(_GET.mask), tostring(_GET.gateway))
          end
          client:send(buf);
          client:close();
          collectgarbage();
        end)
  end)
