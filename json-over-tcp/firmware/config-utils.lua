function writeConfig(ssid, pwd, label, ip, mask, gateway)
    file.open("cfg.json","w+")

    local cfg = {
        ['ssid'] = ssid,
        ['pwd'] = pwd,
        ['label'] = label,
        ['ip'] = ip,
        ['mask'] = mask,
        ['gateway'] = gateway
    }

    file.write(cjson.encode(cfg))
    file.close()
end

function readConfig()
    local configFile = file.open("cfg.json", "r")
    
    if not configFile then 
        return nil
    end
    
    configStr = file.readline();
    cfg = cjson.decode(configStr)

    file.close()
    return cfg
end