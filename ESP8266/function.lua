--Função de reset, ligar/resetar o modulo com o botão pressionado de reset pressionado e aguardar 5 segundos
function resetconfig()
	tmr.alarm(0, 5000, 1, function()
		if(gpio.read(reset)==1) then
			file.remove("configsta.lua")
			node.restart()
		else
			tmr.stop(1)
		end
	end)
end

--cria um arquivo com as configurações obtidas via GET, grava em um arquivo linha por linha e reinicia o modulo
function createconfigsta(ssid, pwd, label, ip, mask, gateway)
  file.open("configsta.lua","w+")
    file.writeline(ssid)
    file.writeline(pwd)
    file.writeline(label)
    file.writeline(ip)
    file.writeline(mask)
    file.writeline(gateway)
  file.close()
  node.restart()
end

--define para modo ap
function configAP()
  --configurações do modo ap: nome, senha, tipo de criptografia da senha
  apcfg = {}
  apcfg.ssid="GEEE"
   --configurações para o ip fixo
  ipcfg={}
  ipcfg.ip = "192.168.1.1"
  ipcfg.netmask = "255.255.255.0"
  ipcfg.gateway = "192.168.1.1"
  --definição do modo AP e demais configurações
  wifi.setmode(wifi.SOFTAP)
  wifi.ap.config(apcfg)
  wifi.ap.setip(ipcfg)
end

--define para modo station
function configStation()
  file.open("configsta.lua", "r")
  ipstacfg={}
  ssid = string.gsub(file.readline(), "\n","")
  pwd = string.gsub(file.readline(), "\n","")
  label = string.gsub(file.readline(), "\n","")
  ipstacfg.ip = string.gsub(file.readline(), "\n","")
  ipstacfg.netmask = string.gsub(file.readline(), "\n","")
  ipstacfg.gateway = string.gsub(file.readline(), "\n","")
  wifi.setmode(wifi.STATION)
  wifi.sta.config(ssid, pwd)
  wifi.sta.setip(ipstacfg)
  wifi.sta.connect()
  file.close()
end
