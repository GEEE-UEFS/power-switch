gpiolookup = {
    [0] = 3,
    [1] = 10,
    [2] = 4,
    [4] = 1,
    [5] = 2,
    [10] = 12,
    [12] = 6,
    [13] = 7,
    [14] = 5,
    [15] = 8,
    [16] = 0
    -- dont use pin 9, its RX.
}

reset = gpiolookup[12]

gpio.mode(reset, gpio.INPUT)

pin = {
    [5] = gpiolookup[2],
    [4] = gpiolookup[0],
    [3] = gpiolookup[5],
    [2] = gpiolookup[4],
    [1] = gpiolookup[14],
    [0] = gpiolookup[16]
}

for i=0,5 do
  gpio.mode(pin[i], gpio.OUTPUT)
  gpio.write(pin[i], gpio.HIGH)
end