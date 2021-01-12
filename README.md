# Quartex-Pascal

[![Join the chat at https://gitter.im/Quartex-Pascal/Quartex-Pascal](https://badges.gitter.im/Quartex-Pascal/Quartex-Pascal.svg)](https://gitter.im/Quartex-Pascal/Quartex-Pascal?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)



function main
var
 sense : JSenseHatLed;
 LEDArray : TsenseHATLEDArray;
begin

  sense := NodeJS_SenseHatLed;
  sense.showLetter('A');  
  sense.clear;
end;
