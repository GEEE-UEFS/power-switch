gpiolookup = {[0]=3,
              [1]=10,
              [2]=4,
            --[3]=9,Essa porra é o rx do ESP8266, não descomentar NUUUUUUNCA
              [4]=1,
              [5]=2,
              [10]=12,
              [12]=6,
              [13]=7,
              [14]=5,
              [15]=8,
              [16]=0}
reset = gpiolookup[12]
gpio.mode(reset, gpio.INPUT)
tomada = {[0]=gpiolookup[2],
          [1]=gpiolookup[0],
          [2]=gpiolookup[4],
          [3]=gpiolookup[5],
          [4]=gpiolookup[14],
          [5]=gpiolookup[16]}
for i=0,5 do
  gpio.mode(tomada[i], gpio.OUTPUT)
end
