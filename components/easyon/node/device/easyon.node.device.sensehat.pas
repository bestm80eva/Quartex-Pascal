unit easyon.device.sensehat;

interface

uses
    qtx.sysutils, qtx.classes, qtx.node.events;

type
   TsenseHATRGB = array[0..2] of byte; // [R,G,B]
   TsenseHATNibble = integer; //integer between 0-7;
   TsenseHATLEDArray = array[0..64] of TsenseHATRGB; //Array [[R,G,B]*64]
                                 // An array containing 64 smaller arrays of [R, G, B] pixels (red, green, blue). Each R-G-B element must be an integer between 0 and 255.
   TsenseHATGammaArray = array[0..32] of integer; //between 0-31;
   //add a parameter to select .sync

  JSenseHatLed = class external
  public
     procedure sleep(time : float); // time in seconds
     procedure clear(colour : TsenseHATRGB); overload;
     procedure clear; overload;
     procedure clear(r,g,b : Integer); overload;
     function getPixel(x,y : TsenseHATNibble) : TsenseHATLEDArray;
     procedure setPixel(x,y :TsenseHATNibble;r,g,b : Integer); overload;
     procedure setPixel(x,y : TsenseHATNibble;rgb: TsenseHATRGB); overload;
     function getPixels : TsenseHATLEDArray;
     procedure setPixels(pixelArray: TsenseHATLEDArray);
     function flipH(redraw: Boolean = true) : TsenseHATLEDArray;
     function flipV(redraw: Boolean = true) : TsenseHATLEDArray;
     procedure setRotation(r : Integer; redraw: Boolean = true);
     procedure showMessage(textString : String;  scrollSpeed: float; textColour, backColour: TsenseHATRGB); overload;
     procedure showMessage(textString : String;  scrollSpeed: float; textColour: TsenseHATRGB); overload;
     procedure showMessage(textString : String;  scrollSpeed: float = 0.1); overload;

     procedure flashMessage(textString : String; speed: float; textColour, backColour: TsenseHATRGB);overload;
     procedure flashMessage(textString : String; speed: float; textColour: TsenseHATRGB);overload;
     procedure flashMessage(textString : String; speed: float = 0.1);overload;
     procedure showLetter(character : char; textColour, backColour : TsenseHATRGB);overload;
     procedure showLetter(character : char; textColour : TsenseHATRGB);overload;
     procedure showLetter(character : char);overload;
     function loadImage(filepath : String; redraw : Boolean=true) : TsenseHATLEDArray;
     procedure gammaReset;

     property rotation : Integer;
     property gamma : TsenseHATGammaArray;
     property lowLight : Boolean;
  end;

  function NodeJS_SenseHatLed: JSenseHatLed;

  implementation

  var

    ModRef__: JSenseHatLed = nil;

function RequireModule(modulename: string): THandle; external 'require';

function NodeJs_SenseHatLed: JSenseHatLed;
begin
  if ModRef__ = nil then
    ModRef__ := JSenseHatLed( RequireModule('sense-hat-led').sync);
   result := ModRef__;
end;

end.