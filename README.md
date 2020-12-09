# Quartex-Pascal



function main
var
 sense : JSenseHatLed;
 LEDArray : TsenseHATLEDArray;
begin

  sense := NodeJS_SenseHatLed;
  sense.showLetter('A');  
  sense.clear;
end;
