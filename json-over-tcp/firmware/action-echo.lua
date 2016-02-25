return function (params)
    local response = {}
    print("calling echo action")

    response["action"] = "echo"
    response["data"] = params["data"]

    return response
end