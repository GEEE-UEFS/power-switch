dofile("function.lua")
dofile("configgpio.lua")
if(gpio.read(reset)==1) then
	resetconfig()
end
fileList = file.list();
for value, key in pairs(fileList) do
	if(value == "configsta.lua") then
    ok=true;
    break
	end
end

if (ok) then
	dofile("run.lua")
else
  dofile("config.lua")
end
