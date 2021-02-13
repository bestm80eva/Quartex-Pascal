var $R = [
	"Options cannot be altered while a logfile is active error",
	"Failed to delete existing logfile (%s): %s",
	"Failed to create logfile (%s): %s",
	"Failed to close logfile (%s): %s",
	"Failed to emit data, no logfile is open",
	"Failed to emit data: %s",
	"Failed to write value, property [%s] not found error",
	"Failed to read value, property [%s] not found error",
	"Failed to locate object, property [%s] not found error",
	"Method %s in class %s threw exception [%s]",
	"Invalid dictionary key",
	"Invalid array of dictionary keys",
	"Seek failed, stream is empty error",
	"Read operation failed, %s bytes exceeds storage medium error",
	"Read operation failed, invalid signature error [%s]",
	"Bookmarks not supported by medium error",
	"No bookmarks to roll back error",
	"Invalid length, %s bytes exceeds storage boundaries error",
	"Write failed, invalid datasize [%d] error",
	"'Invalid handle [%s], reference was rejected error",
	"Invalid bit index, expected 0..31",
	"Failed to convert bytes[] to intrinsic type, unknown identifier [%s] error",
	"Invalid datatype, failed to identify number [int32] type error",
	"Invalid datatype, byte conversion failed error"];
function Trim$_String_(s) { return s.replace(/^\s\s*/, "").replace(/\s\s*$/, "") }
var TObject={
	$ClassName: "TObject",
	$Parent: null,
	ClassName: function (s) { return s.$ClassName },
	ClassType: function (s) { return s },
	ClassParent: function (s) { return s.$Parent },
	$Init: function (s) {},
	Create: function (s) { return s },
	Destroy: function (s) { for (var prop in s) if (s.hasOwnProperty(prop)) delete s[prop] },
	Destroy$: function(s) { return s.ClassType.Destroy(s) },
	Free: function (s) { if (s!==null) s.ClassType.Destroy(s) }
}
function StrEndsWith(s,e) { return s.substr(s.length-e.length)==e }
function StrContains(s,b) { return s.indexOf(b)>=0 }
var Round = Math.round;
function Now() { var d=new Date(); return d.getTime()/864e5+25569 }
function IntToStr(i) { return i.toString() }
function IntToHex(v,d) { var r=v.toString(16); return "00000000".substr(0, d-r.length)+r }
/**
sprintf() for JavaScript 0.7-beta1
http://www.diveintojavascript.com/projects/javascript-sprintf

Copyright (c) Alexandru Marasteanu <alexaholic [at) gmail (dot] com>
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
    * Neither the name of sprintf() for JavaScript nor the
      names of its contributors may be used to endorse or promote products
      derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL Alexandru Marasteanu BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
**/

var sprintf = (function() {
	function get_type(variable) {
		return Object.prototype.toString.call(variable).slice(8, -1).toLowerCase();
	}
	function str_repeat(input, multiplier) {
		for (var output = []; multiplier > 0; output[--multiplier] = input) {/* do nothing */}
		return output.join('');
	}

	var str_format = function() {
		if (!str_format.cache.hasOwnProperty(arguments[0])) {
			str_format.cache[arguments[0]] = str_format.parse(arguments[0]);
		}
		return str_format.format.call(null, str_format.cache[arguments[0]], arguments);
	};

	str_format.format = function(parse_tree, argv) {
		var cursor = 1, tree_length = parse_tree.length, node_type = '', arg, output = [], i, k, match, pad, pad_character, pad_length;
		for (i = 0; i < tree_length; i++) {
			node_type = get_type(parse_tree[i]);
			if (node_type === 'string') {
				output.push(parse_tree[i]);
			}
			else if (node_type === 'array') {
				match = parse_tree[i]; // convenience purposes only
				if (match[2]) { // keyword argument
					arg = argv[cursor];
					for (k = 0; k < match[2].length; k++) {
						if (!arg.hasOwnProperty(match[2][k])) {
							throw(sprintf('[sprintf] property "%s" does not exist', match[2][k]));
						}
						arg = arg[match[2][k]];
					}
				}
				else if (match[1]) { // positional argument (explicit)
					arg = argv[match[1]];
				}
				else { // positional argument (implicit)
					arg = argv[cursor++];
				}

				if (/[^s]/.test(match[8]) && (get_type(arg) != 'number')) {
					throw(sprintf('[sprintf] expecting number but found %s', get_type(arg)));
				}
				switch (match[8]) {
					case 'b': arg = arg.toString(2); break;
					case 'c': arg = String.fromCharCode(arg); break;
					case 'd': arg = String(parseInt(arg, 10)); if (match[7]) { arg = str_repeat('0', match[7]-arg.length)+arg } break;
					case 'e': arg = match[7] ? arg.toExponential(match[7]) : arg.toExponential(); break;
					case 'f': arg = match[7] ? parseFloat(arg).toFixed(match[7]) : parseFloat(arg); break;
                    case 'g': arg = parseFloat(arg); break;
					case 'o': arg = arg.toString(8); break;
					case 's': arg = ((arg = String(arg)) && match[7] ? arg.substring(0, match[7]) : arg); break;
					case 'u': arg = Math.abs(arg); break;
					case 'x': arg = arg.toString(16); break;
					case 'X': arg = arg.toString(16).toUpperCase(); break;
				}
				arg = (/[def]/.test(match[8]) && match[3] && arg >= 0 ? '+'+ arg : arg);
				pad_character = match[4] ? match[4] == '0' ? '0' : match[4].charAt(1) : ' ';
				pad_length = match[6] - String(arg).length;
				pad = match[6] ? str_repeat(pad_character, pad_length) : '';
				output.push(match[5] ? arg + pad : pad + arg);
			}
		}
		return output.join('');
	};

	str_format.cache = {};

	str_format.parse = function(fmt) {
		var _fmt = fmt, match = [], parse_tree = [], arg_names = 0;
		while (_fmt) {
			if ((match = /^[^\x25]+/.exec(_fmt)) !== null) {
				parse_tree.push(match[0]);
			}
			else if ((match = /^\x25{2}/.exec(_fmt)) !== null) {
				parse_tree.push('%');
			}
			else if ((match = /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-gosuxX])/.exec(_fmt)) !== null) {
				if (match[2]) {
					arg_names |= 1;
					var field_list = [], replacement_field = match[2], field_match = [];
					if ((field_match = /^([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
						field_list.push(field_match[1]);
						while ((replacement_field = replacement_field.substring(field_match[0].length)) !== '') {
							if ((field_match = /^\.([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
								field_list.push(field_match[1]);
							}
							else if ((field_match = /^\[(\d+)\]/.exec(replacement_field)) !== null) {
								field_list.push(field_match[1]);
							}
							else {
								throw('[sprintf] huh?');
							}
						}
					}
					else {
						throw('[sprintf] huh?');
					}
					match[2] = field_list;
				}
				else {
					arg_names |= 2;
				}
				if (arg_names === 3) {
					throw('[sprintf] mixing positional and named placeholders is not (yet) supported');
				}
				parse_tree.push(match);
			}
			else {
				throw('[sprintf] huh?');
			}
			_fmt = _fmt.substring(match[0].length);
		}
		return parse_tree;
	};

	return str_format;
})();
function Format(f,a) { a.unshift(f); return sprintf.apply(null,a) }
function FloatToStr$_Float_(i) { return i.toString() }
function FloatToStr$_Float_Integer_(i,p) { return (p==99)?i.toString():i.toFixed(p) }
var Exception={
	$ClassName: "Exception",
	$Parent: TObject,
	$Init: function (s) { FMessage="" },
	Create: function (s,Msg) { s.FMessage=Msg; return s }
}
function AnsiLowerCase(v) { return v.toLocaleLowerCase() }
function $W(e) { return e.ClassType?e:Exception.Create($New(Exception),(typeof e == "string") ? e : e.constructor.name+", "+e.message) }
function $VarToInt(v,z) {
	var r = parseInt(v || 0, 10);
	if (isNaN(r)) throw Exception.Create($New(Exception),"Not a valid integer: "+v+z);
	return r
}
function $VarToBool(v) { return !!(typeof v == "string" ? {"1":1,"t":1,"y":1,"true":1}[v.toLowerCase()] : v) }
function $SetIn(s,v,m,n) { v-=m; return (v<0 && v>=n)?false:(s[v>>5]&(1<<(v&31)))!=0 }
Array.prototype.pusha = function (e) { this.push.apply(this, e); return this }
function $NewDyn(c,z) {
	if (c==null) throw Exception.Create($New(Exception),"ClassType is nil"+z);
	var i={ClassType:c};
	c.$Init(i);
	return i
}
function $New(c) { var i={ClassType:c}; c.$Init(i); return i }
function $Is(o,c) {
	if (o===null) return false;
	return $Inh(o.ClassType,c);
}
;
function $Inh(s,c) {
	if (s===null) return false;
	while ((s)&&(s!==c)) s=s.$Parent;
	return (s)?true:false;
}
;
function $Extend(base, sub, props) {
	function F() {};
	F.prototype = base.prototype;
	sub.prototype = new F();
	sub.prototype.constructor = sub;
	for (var n in props) {
		if (props.hasOwnProperty(n)) {
			sub.prototype[n]=props[n];
		}
	}
}
function $Event0(i,f) {
	var li=i,lf=f;
	return function() {
		return lf.call(li,li)
	}
}
function $Div(a,b) { var r=a/b; return (r>=0)?Math.floor(r):Math.ceil(r) }
function $AsIntf(o,i) {
	if (o===null) return null;
	var r = o.ClassType.$Intf[i].map(function (e) {
		return function () {
			var arg=Array.prototype.slice.call(arguments);
			arg.splice(0,0,o);
			return e.apply(o, arg);
		}
	});
	r.O = o;
	return r;
}
;
function $ArraySetLenC(a,n,d) {
	var o=a.length;
	if (o==n) return;
	if (o>n) a.length=n; else for (;o<n;o++) a.push(d());
}
function B(bC, Rq) {
   var ui = "";
   try {
      ui = Format(bC,Rq.slice(0));
      console.log(ui);
   } catch ($e) {
      var tv = $W($e);
      /* null */
   }
};
function m(G2) {
   console.log(G2);
};
function ex$Rl(mn) {
   var Result = 1;
   var vn = "";
   if (ex$EK(mn)) {
      vn = typeof(mn);
      {var $temp1 = AnsiLowerCase(vn);
         if ($temp1=="object") {
            if ((!mn.length)) {
               Result = 8;
            } else {
               Result = 9;
            }
         }
          else if ($temp1=="function") {
            Result = 7;
         }
          else if ($temp1=="symbol") {
            Result = 6;
         }
          else if ($temp1=="boolean") {
            Result = 2;
         }
          else if ($temp1=="string") {
            Result = 5;
         }
          else if ($temp1=="number") {
            if (Round(Number(mn)) != mn) {
               Result = 4;
            } else {
               Result = 3;
            }
         }
          else if ($temp1=="array") {
            Result = 9;
         }
          else {
            Result = 1;
         }
      }
   } else if (mn == null) {
      Result = 10;
   } else {
      Result = 1;
   }
   return Result
}
function ex$IJ(UH) {
   var Result = false;
   Result = ((UH) !== undefined)
      && (UH !== null)
      && (typeof UH  === "object")
      && ((UH).length === undefined);
   return Result
}
function ex$EK(ea) {
   var Result = false;
   Result = !( (ea == undefined) || (ea == null) );
   return Result
}
var Rs = { 1:"vdUnknown", 2:"vdBoolean", 3:"vdinteger", 4:"vdfloat", 5:"vdstring", 6:"vdSymbol", 7:"vdFunction", 8:"vdObject", 9:"vdArray", 10:"vdVariant" };
var i = {
   $ClassName:"TVariant",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
   }
   ,F4:function(hV) {
      var Result = false;
      if (hV) {
         Result = $VarToBool(hV);
      }
      return Result
   }
   ,Zw:function(uD) {
      var Result = 0;
      if (uD) {
         Result = Number(uD);
      }
      return Result
   }
   ,FS:function(RN) {
      var Result = 0;
      if (RN) {
         Result = $VarToInt(RN,"");
      }
      return Result
   }
   ,AK:function(pw) {
      var Result = null;
      if (pw) {
         Result = pw;
      }
      return Result
   }
   ,SZ:function(Gl) {
      var Result = "";
      if (Gl) {
         Result = String(Gl);
      }
      return Result
   }
   ,ho:function() {
      var Result = undefined;
      Result = new Object();
      return Result
   }
   ,gP:function(ke) {
      var Result = 1;
      if (ke) {
         {var $temp2 = AnsiLowerCase(typeof(ke));
            if ($temp2=="object") {
               Result = (ke.hasOwnProperty("length"))?9:8;
            }
             else if ($temp2=="function") {
               Result = 7;
            }
             else if ($temp2=="symbol") {
               Result = 6;
            }
             else if ($temp2=="boolean") {
               Result = 2;
            }
             else if ($temp2=="string") {
               Result = 5;
            }
             else if ($temp2=="number") {
               Result = (!(~(ke % 1)))?4:3;
            }
             else if ($temp2=="array") {
               Result = 9;
            }
             else {
               Result = 1;
            }
         }
      } else {
         Result = 1;
      }
      return Result
   }
   ,Destroy:TObject.Destroy
};
var HQ = [ "vpNone", "vpHexPascal", "vpHexC", "vpBinPascal", "vpBinC", "vpString" ];
var uy = {
   $ClassName:"TString",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
   }
   ,nX:function(cA) {
      var Result = 0;
      Result = (cA).charCodeAt(0);
      return Result
   }
   ,Ix:function(DU) {
      var Result = {_:""};
      try {
         var cW = null;
         cW = LW.j4$($New(cj));
         try {
            Result._ = cj.WN(cW,DU);
         } finally {
            TObject.Free(cW);
         }
      } finally {return Result._}
   }
   ,JD:function(lI) {
      var Result = {_:[]};
      try {
         var bE = null;
         bE = LW.j4$($New(cj));
         try {
            Result._ = cj.l5(bE,lI);
         } finally {
            TObject.Free(bE);
         }
      } finally {return Result._}
   }
   ,pF:function(aP) {
      var Result = "";
      Result = String.fromCharCode(aP);
      return Result
   }
   ,Destroy:TObject.Destroy
};
var O5 = {
   $ClassName:"TQTXIdentifiers",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
   }
   ,Oo:function(Self) {
      var Result = "";
      ++aW;
      Result = "Component" + IntToStr(aW);
      return Result
   }
   ,Destroy:TObject.Destroy
};
var Iz = { 0:"fpNone", 111:"fpExecute", 222:"fpWrite", 333:"fpWriteExecute", 444:"fpRead", 555:"fpReadExecute", 666:"fpDefault", 777:"fpReadWriteExecute", 740:"fpRWEGroupReadOnly" };
var ON = [ "stDefault", "stLittleEndian", "stBigEndian" ];
var yB = [ "dtUnknown", "dtBoolean", "dtByte", "dtChar", "dtWord", "dtLong", "dtInt16", "dtInt32", "dtFloat32", "dtFloat64", "dtString" ];
var Ch = {
   $ClassName:"TInt32",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
   }
   ,Q4:function(BG, dx) {
      var Result = 0;
      if (BG != dx) {
         if (BG > dx) {
            Result = BG-dx;
         } else {
            Result = dx-BG;
         }
         if (Result < 0) {
            Result = (Result-1)^(-1);
         }
      } else {
         Result = 0;
      }
      return Result
   }
   ,Dp:function(md, sK, oc) {
      return (md < sK)?sK:(md > oc)?oc:md;
   }
   ,Qm:function(Nm, Fr) {
      var Result = 0;
      if (Nm < Fr) {
         Result = Fr-Nm;
      } else {
         Result = Nm-Fr;
      }
      return Result
   }
   ,O3:function(RN, SP, SQ) {
      var Result = 0;
      if (RN > SQ) {
         Result = SP+Ch.Q4(SQ,RN-1);
         if (Result > SQ) {
            Result = Ch.O3(Result,SP,SQ);
         }
      } else if (RN < SP) {
         Result = SQ-Ch.Q4(SP,RN+1);
         if (Result < SP) {
            Result = Ch.O3(Result,SP,SQ);
         }
      } else {
         Result = RN;
      }
      return Result
   }
   ,Destroy:TObject.Destroy
};
var SL = [ "esBreak", "esContinue" ];
var hP = {
   $ClassName:"TDateUtils",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
   }
   ,zE:function(Self, qf) {
      return qf.getTime() / 86400000+25569;
   }
   ,at:function(Self, fRw) {
      var Result = null;
      Result = new Date();
      Result.setTime(Round((fRw-25569) * 86400000));
      return Result
   }
   ,Destroy:TObject.Destroy
};
var LW = {
   $ClassName:"TDataTypeConverter",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
      $.OnEndianChanged = null;
      $.pR = $.XR = null;
      $.p2 = 0;
      $.MH = null;
   }
   ,rN:function(OH) {
      return Ax.Dc(OH);
   }
   ,NM:function(YI) {
      var Result = [];
      Result.push((YI)?1:0);
      return Result
   }
   ,Ls:function(SP) {
      return Ax.xe(SP);
   }
   ,O1:function(Self, TU) {
      return TU[0] > 0;
   }
   ,IY:function(Self, jh) {
      var Result = 0;
      Self.XR.setUint8(0,jh[0]);
      Self.XR.setUint8(1,jh[1]);
      Self.XR.setUint8(2,jh[2]);
      Self.XR.setUint8(3,jh[3]);
      switch (Self.p2) {
         case 0 :
            Result = Self.XR.getFloat32(0);
            break;
         case 1 :
            Result = Self.XR.getFloat32(0,true);
            break;
         case 2 :
            Result = Self.XR.getFloat32(0,false);
            break;
      }
      return Result
   }
   ,rP:function(Self, Uy) {
      var Result = 0;
      Self.XR.setUint8(0,Uy[0]);
      Self.XR.setUint8(1,Uy[1]);
      Self.XR.setUint8(2,Uy[2]);
      Self.XR.setUint8(3,Uy[3]);
      Self.XR.setUint8(4,Uy[4]);
      Self.XR.setUint8(5,Uy[5]);
      Self.XR.setUint8(6,Uy[6]);
      Self.XR.setUint8(7,Uy[7]);
      switch (Self.p2) {
         case 0 :
            Result = Self.XR.getFloat64(0);
            break;
         case 1 :
            Result = Self.XR.getFloat64(0,true);
            break;
         case 2 :
            Result = Self.XR.getFloat64(0,false);
            break;
      }
      return Result
   }
   ,Ws:function(Self, ah) {
      var Result = 0;
      Self.XR.setUint8(0,ah[0]);
      Self.XR.setUint8(1,ah[1]);
      switch (Self.p2) {
         case 0 :
            Result = Self.XR.getInt16(0);
            break;
         case 1 :
            Result = Self.XR.getInt16(0,true);
            break;
         case 2 :
            Result = Self.XR.getInt16(0,false);
            break;
      }
      return Result
   }
   ,lk:function(Self, Tn) {
      var Result = 0;
      Self.XR.setUint8(0,Tn[0]);
      Self.XR.setUint8(1,Tn[1]);
      Self.XR.setUint8(2,Tn[2]);
      Self.XR.setUint8(3,Tn[3]);
      switch (Self.p2) {
         case 0 :
            Result = Self.XR.getInt32(0);
            break;
         case 1 :
            Result = Self.XR.getInt32(0,true);
            break;
         case 2 :
            Result = Self.XR.getInt32(0,false);
            break;
      }
      return Result
   }
   ,o3:function(Self, Pr) {
      var Result = "";
      var Oa = null,
         BQ = null;
      if (Pr.length > 0) {
         Oa = new Uint8Array(Pr.length);
         (Oa).set(Pr, 0);
         BQ = new TextDecoder("utf8");
         Result = BQ.decode(Oa);
         BQ = null;
      }
      return Result
   }
   ,rc:function(Self, UT) {
      var Result = undefined;
      var Yx = 0;
      Yx = UT.length;
      Result = new Uint8Array(Yx);
      (Result).set(UT, 0);
      return Result
   }
   ,aE:function(Self, MG) {
      var Result = 0;
      Self.XR.setUint8(0,MG[0]);
      Self.XR.setUint8(1,MG[1]);
      switch (Self.p2) {
         case 0 :
            Result = Self.XR.getUint16(0);
            break;
         case 1 :
            Result = Self.XR.getUint16(0,true);
            break;
         case 2 :
            Result = Self.XR.getUint16(0,false);
            break;
      }
      return Result
   }
   ,Bi:function(Self, D1) {
      var Result = 0;
      Self.XR.setUint8(0,D1[0]);
      Self.XR.setUint8(1,D1[1]);
      Self.XR.setUint8(2,D1[2]);
      Self.XR.setUint8(3,D1[3]);
      switch (Self.p2) {
         case 0 :
            Result = Self.XR.getUint32(0);
            break;
         case 1 :
            Result = Self.XR.getUint32(0,true);
            break;
         case 2 :
            Result = Self.XR.getUint32(0,false);
            break;
      }
      return Result
   }
   ,M1:function(Self, wT) {
      var Result = undefined;
      var wz = 0;
      wz = wT[0];
      wT.shift();
      switch (wz) {
         case 17 :
            Result = LW.O1(Self,wT);
            break;
         case 18 :
            Result = wT[0];
            break;
         case 24 :
            Result = LW.aE(Self,wT);
            break;
         case 25 :
            Result = LW.Bi(Self,wT);
            break;
         case 19 :
            Result = LW.Ws(Self,wT);
            break;
         case 20 :
            Result = LW.lk(Self,wT);
            break;
         case 21 :
            Result = LW.IY(Self,wT);
            break;
         case 22 :
            Result = LW.rP(Self,wT);
            break;
         case 23 :
            Result = uy.Ix(wT);
            break;
         default :
            throw By.J5($New(XQ),$R[21],[IntToHex(wz,2)]);
      }
      return Result
   }
   ,jL:function(R5) {
      var Result = "";
      Result = String.fromCharCode(R5);
      return Result
   }
   ,Ng:function(hi) {
      var Result = 0;
      Result = (hi).charCodeAt(0);
      return Result
   }
   ,j4:function(Self) {
      TObject.Create(Self);
      Self.pR = new ArrayBuffer(16);
    Self.XR   = new DataView(Self.pR);
      Self.MH = new Uint8Array(Self.pR,0,15);
      return Self
   }
   ,Destroy:function(Self) {
      Self.MH = null;
      Self.XR = null;
      Self.pR = null;
      TObject.Destroy(Self);
   }
   ,wv:function(Self, qX) {
      var Result = [];
      switch (Self.p2) {
         case 0 :
            Self.XR.setFloat32(0,qX);
            break;
         case 1 :
            Self.XR.setFloat32(0,qX,true);
            break;
         case 2 :
            Self.XR.setFloat32(0,qX,false);
            break;
      }
      Result = Array.prototype.slice.call( Self.MH, 0, 4 );
      return Result
   }
   ,u3:function(Self, sj) {
      var Result = [];
      var bA = 0;
      switch (Self.p2) {
         case 0 :
            Self.XR.setFloat64(0,Number(sj));
            break;
         case 1 :
            Self.XR.setFloat64(0,Number(sj),true);
            break;
         case 2 :
            Self.XR.setFloat64(0,Number(sj),false);
            break;
      }
      bA = LG[9];
      --bA;
      Result = Array.prototype.slice.call( Self.MH, 0, bA );
      return Result
   }
   ,UK:function(A9) {
      var Result = 0;
      var x9 = null;
      x9 = new Int8Array(1);
      x9[0]=((A9 < -128)?-128:(A9 > 127)?127:A9);
      Result = x9[0];
      return Result
   }
   ,Ux:function(uW) {
      var Result = 0;
      var Ni = null;
      Ni = new Int16Array(1);
      Ni[0]=((uW < -32768)?-32768:(uW > 32767)?32767:uW);
      Result = Ni[0];
      return Result
   }
   ,q3:function(BS) {
      var Result = 0;
      var J1 = null;
      J1 = new Int32Array(1);
      J1[0]=((BS < -2147483648)?-2147483648:(BS > 2147483647)?2147483647:BS);
      Result = J1[0];
      return Result
   }
   ,FK:function(Ju) {
      var Result = 0;
      var Uy = null;
      Uy = new Uint8Array(1);
      Uy[0]=((Ju < 0)?0:(Ju > 255)?255:Ju);
      Result = Uy[0];
      return Result
   }
   ,cO:function(C8) {
      var Result = 0;
      var AN = null;
      AN = new Uint16Array(1);
      AN[0]=((C8 < 0)?0:(C8 > 65536)?65536:C8);
      Result = AN[0];
      return Result
   }
   ,HP:function(RL) {
      var Result = 0;
      var ep = null;
      ep = new Uint32Array(1);
      ep[0]=((RL < 0)?0:(RL > 4294967295)?4294967295:RL);
      Result = ep[0];
      return Result
   }
   ,ut:function(Self, S6) {
      var Result = [];
      switch (Self.p2) {
         case 0 :
            Self.XR.setInt16(0,S6);
            break;
         case 1 :
            Self.XR.setInt16(0,S6,true);
            break;
         case 2 :
            Self.XR.setInt16(0,S6,false);
            break;
      }
      Result = Array.prototype.slice.call( Self.MH, 0, 2 );
      return Result
   }
   ,GA:function(Self, zp) {
      var Result = [];
      var iR = 0;
      switch (Self.p2) {
         case 0 :
            Self.XR.setInt32(0,zp);
            break;
         case 1 :
            Self.XR.setInt32(0,zp,true);
            break;
         case 2 :
            Self.XR.setInt32(0,zp,false);
            break;
      }
      iR = LG[7];
      Result = Array.prototype.slice.call( Self.MH, 0, iR );
      return Result
   }
   ,F5:function(Self, Ot) {
      if (Ot != Self.p2) {
         Self.p2 = Ot;
         if (Self.OnEndianChanged) {
            Self.OnEndianChanged(Self);
         }
      }
   }
   ,gz:function(cS) {
      return LG[cS];
   }
   ,D5:function(Self, mZ) {
      var Result = [];
      var MD = null,
         xo = null;
      if (mZ.length > 0) {
         MD = new TextEncoder("utf8");
         xo = MD.encode(mZ);
         MD = null;
         Result = Array.prototype.slice.call(xo, 0, (xo).byteLength);
         xo = null;
      } else {
         Result = [];
      }
      return Result
   }
   ,tp:function() {
      var Result = 0;
      var RH = 0,
         dR = 0;
      RH = 1;
      dR = 2;
      try {
         var LBuffer = new ArrayBuffer(2);
      var L8Array = new Uint8Array(LBuffer);
      var L16array = new Uint16Array(LBuffer);
      L8Array[0] = 0xAA;
      L8Array[1] = 0xBB;
      if(L16array[0] === 0xBBAA) {
        Result = RH;
      } else {
        if (L16array[0] === 0xAABB) Result = dR;
      }
      } catch ($e) {
         /* null */
      }
      return Result
   }
   ,CV:function(Hy) {
      var Result = [];
      if (Hy) {
         Result = Array.prototype.slice.call(Hy);
      } else {
         throw Exception.Create($New(XQ),"Failed to convert, handle is nil or unassigned error");
      }
      return Result
   }
   ,L4:function(Self, oX) {
      var Result = [];
      switch (Self.p2) {
         case 0 :
            Self.XR.setUint16(0,oX);
            break;
         case 1 :
            Self.XR.setUint16(0,oX,true);
            break;
         case 2 :
            Self.XR.setUint16(0,oX,false);
            break;
      }
      Result = Array.prototype.slice.call( Self.MH, 0, 2 );
      return Result
   }
   ,ug:function(Self, zl) {
      var Result = [];
      var ae = 0;
      switch (Self.p2) {
         case 0 :
            Self.XR.setUint32(0,zl);
            break;
         case 1 :
            Self.XR.setUint32(0,zl,true);
            break;
         case 2 :
            Self.XR.setUint32(0,zl,false);
            break;
      }
      ae = LG[5];
      Result = Array.prototype.slice.call( Self.MH, 0, ae );
      return Result
   }
   ,Ik:function(Self, Jz) {
      var Result = [];
      var qU = 0;
      function Qk() {
         var Result = 0;
         if (Jz <= 255) {
            return 18;
         }
         if (Jz <= 65536) {
            return 24;
         }
         if (Jz <= 2147483647) {
            Result = 25;
         }
         return Result
      };
      function Q5() {
         var Result = 0;
         if (Jz > -32768) {
            return 19;
         }
         if (Jz > -2147483648) {
            Result = 20;
         }
         return Result
      };
      function lI(qm) {
         var Result = false;
         Result = isFinite(qm) && qm == Math.fround(qm);
         return Result
      };
      switch (i.gP(Jz)) {
         case 2 :
            Result = [17];
            Result.pusha(LW.NM($VarToBool(Jz)));
            break;
         case 3 :
            if (Jz < 0) {
               qU = Q5();
            } else {
               qU = Qk();
            }
            if (qU) {
               Result = [qU];
               switch (qU) {
                  case 18 :
                     Result.push(LW.UK($VarToInt(Jz,"")));
                     break;
                  case 24 :
                     Result.pusha(LW.L4(Self,LW.cO($VarToInt(Jz,""))));
                     break;
                  case 25 :
                     Result.pusha(LW.ug(Self,LW.HP($VarToInt(Jz,""))));
                     break;
                  case 19 :
                     Result.pusha(LW.ut(Self,LW.Ux($VarToInt(Jz,""))));
                     break;
                  case 20 :
                     Result.pusha(LW.GA(Self,LW.q3($VarToInt(Jz,""))));
                     break;
               }
            } else {
               throw Exception.Create($New(XQ),$R[22]);
            }
            break;
         case 4 :
            if (lI(Jz)) {
               Result = [21];
               Result.pusha(LW.wv(Self,Number(Jz)));
            } else {
               Result = [22];
               Result.pusha(LW.u3(Self,Number(Jz)));
            }
            break;
         case 5 :
            Result = [23];
            Result.pusha(uy.JD(String(Jz)));
            break;
         default :
            throw Exception.Create($New(XQ),$R[23]);
      }
      return Result
   }
   ,Destroy$:function($){return $.ClassType.Destroy($)}
   ,j4$:function($){return $.ClassType.j4($)}
};
function l9() {
   var Result = false;
   Result = (typeof process !== 'undefined') && (process.release.name.search(/node|io.js/) !== -1);
   return Result
};
function Copy$uQ(s,d) {
   return d;
}
function Clone$uQ($) {
   return {

   }
}
var T8 = [ "wtFile", "wtFolder" ];
function JFileItemList() {
   this.dlItems = [];
}
$Extend(Object,JFileItemList,
   {
      "dlPath" : ""
   });

function JFileItem() {
}
$Extend(Object,JFileItem,
   {
      "diFileName" : "",
      "diFileType" : 0,
      "diFileSize" : 0,
      "diFileMode" : "",
      "diCreated" : undefined,
      "diModified" : undefined
   });

var By = {
   $ClassName:"EException",$Parent:Exception
   ,$Init:function ($) {
      Exception.$Init($);
   }
   ,J5:function(Self, Lr, AN) {
      Exception.Create(Self,Format(Lr,AN.slice(0)));
      return Self
   }
   ,Destroy:Exception.Destroy
};
var Cn = {
   $ClassName:"EQTXException",$Parent:By
   ,$Init:function ($) {
      By.$Init($);
   }
   ,Destroy:Exception.Destroy
};
var XQ = {
   $ClassName:"EConvertError",$Parent:Cn
   ,$Init:function ($) {
      Cn.$Init($);
   }
   ,Destroy:Exception.Destroy
};
function Copy$yV(s,d) {
   d.m9=s.m9;
   d.kH=s.kH;
   d.jN=s.jN;
   d.MQ=s.MQ;
   d.Go=s.Go;
   d.ub=s.ub;
   return d;
}
function Clone$yV($) {
   return {
      m9:$.m9,
      kH:$.kH,
      jN:$.jN,
      MQ:$.MQ,
      Go:$.Go,
      ub:$.ub
   }
}
var jb = [ "soFromBeginning", "soFromCurrent", "soFromEnd" ];
var WY = {
   $ClassName:"TQTXStream",$Parent:LW
   ,$Init:function ($) {
      LW.$Init($);
   }
   ,SA:function(Self, TG) {
      var qm = 0,
         I9 = 0;
      if (TG.length > 0) {
         qm = WY.is$(Self);
         WY.zJ(Self,TG.length);
         WY.kw$(Self,qm,TG);
         I9 = WY.b8$(Self);
         if (I9 < 0) {
            I9 = 0;
         }
         (I9+= TG.length);
         WY.kA$(Self,I9);
      }
   }
   ,v4:function(Self, nc) {
      var oD = 0,
         cQ = [];
      if (WY.is$(Self) > 0) {
         WY.fl$(Self,0);
      }
      if (nc) {
         oD = nc[2]();
         if (oD > 0) {
            cQ = nc[4](0,oD);
            WY.kw$(Self,0,cQ);
            cQ.length=0;
         }
      }
   }
   ,uH:function(Self, N5) {
      if (WY.is$(Self) > 0) {
         WY.fl$(Self,0);
         if (N5.length > 0) {
            WY.SA(Self,N5);
         }
      } else {
         WY.SA(Self,N5);
      }
   }
   ,fG:function(Self, Ym, jv) {
      if (jv) {
         jv(Ym,null,WY.b8$(Self));
      }
   }
   ,gn:function(Self, sv, t2) {
      if (t2) {
         t2(sv,null,WY.is$(Self));
      }
   }
   ,zJ:function(Self, Sd) {
      if (Sd > 0) {
         WY.fl$(Self,WY.is$(Self)+Sd);
      }
   }
   ,m4:function(Self, qX) {
      return WY.bv$(Self,WY.b8$(Self),qX);
   }
   ,g3:function(Self, Oh, W4, oq) {
      var GC = [];
      try {
         GC = WY.m4(Self,W4);
      } catch ($e) {
         var u4 = $W($e);
         if (oq) {
            oq(Oh,u4,GC);
         } else {
            throw $e;
         }
         return;
      }
      if (oq) {
         oq(Oh,null,GC);
      }
   }
   ,z4:function(Self, UW, Td) {
      var ll = [];
      try {
         WY.kA$(Self,0);
         ll = WY.m4(Self,WY.is$(Self));
      } catch ($e) {
         var eE = $W($e);
         if (Td) {
            Td(UW,eE,ll);
         } else {
            throw $e;
         }
         return;
      }
      if (Td) {
         Td(UW,null,ll);
      }
   }
   ,NW:function(Self, tP, WB, rg) {
      try {
         WY.kA$(Self,WB);
      } catch ($e) {
         var wt = $W($e);
         if (rg) {
            rg(tP,wt,WY.b8$(Self));
         } else {
            throw $e;
         }
         return;
      }
      if (rg) {
         rg(tP,null,WY.b8$(Self));
      }
   }
   ,zd:function(Self, kP, RdG, WI) {
      try {
         WY.fl$(Self,RdG);
      } catch ($e) {
         var GW = $W($e);
         if (WI) {
            WI(kP,GW,WY.is$(Self));
         } else {
            throw $e;
         }
         return;
      }
      if (WI) {
         WI(kP,null,WY.is$(Self));
      }
   }
   ,D8:function(Self, Xw) {
      var VT = 0;
      if (Xw > 0) {
         VT = WY.is$(Self);
         if (VT > 0) {
            (VT-= Xw);
            if (Xw > 0) {
               WY.fl$(Self,VT);
            } else {
               WY.fl$(Self,0);
            }
         }
      }
   }
   ,th:function(Self) {
      return WY.bv$(Self,0,WY.is$(Self));
   }
   ,JZ:function(Self, mF) {
      var Result = 0;
      WY.kw$(Self,WY.b8$(Self),mF);
      Result = mF.length;
      return Result
   }
   ,Js:function(Self, ec, UL, eY) {
      try {
         WY.JZ(Self,UL);
      } catch ($e) {
         var D1 = $W($e);
         if (eY) {
            eY(ec,D1);
         } else {
            throw $e;
         }
         return;
      }
      if (eY) {
         eY(ec,null);
      }
   }
   ,Destroy:LW.Destroy
   ,j4:LW.j4
   ,b8$:function($){return $.ClassType.b8($)}
   ,is$:function($){return $.ClassType.is($)}
   ,bv$:function($){return $.ClassType.bv.apply($.ClassType, arguments)}
   // IGNORED: TQTXStream.Seek
   ,kA$:function($){return $.ClassType.kA.apply($.ClassType, arguments)}
   ,fl$:function($){return $.ClassType.fl.apply($.ClassType, arguments)}
   ,kw$:function($){return $.ClassType.kw.apply($.ClassType, arguments)}
};
WY.$Intf={
   Rk:[WY.g3,WY.Js,WY.gn,WY.zd,WY.NW,WY.z4,WY.fG]
   ,ta:[WY.th,WY.uH,WY.is,WY.b8,WY.bv,WY.kw,WY.zJ,WY.D8,WY.v4,WY.SA]
}
var YO = {
   $ClassName:"TQTXErrorObject",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
      $.lt = "";
      $.An = [0];
   }
   ,Si:function(Self) {
      Self.lt = "";
   }
   ,Gi:function(Self) {
      TObject.Create(Self);
      Self.An = [1];
      return Self
   }
   ,yp:function(Self, b2) {
      Self.An = b2.slice(0);
   }
   ,E1:function(Self, u6) {
      Self.lt = u6;
      if ($SetIn(Self.An,1,0,2)) {
         throw Exception.Create($New(Cn),Self.lt);
      }
   }
   ,Destroy:TObject.Destroy
   ,Gi$:function($){return $.ClassType.Gi($)}
};
var LU = {
   $ClassName:"TQTXOwnedObject",$Parent:YO
   ,$Init:function ($) {
      YO.$Init($);
      $.ZM = null;
   }
   ,sV:function(Self) {
      return Self.ZM;
   }
   ,fq:function(Self, j8) {
      if (j8 !== Self.ZM) {
         if (LU.ix(Self,j8)) {
            Self.ZM = j8;
         } else {
            throw By.J5($New(ZK),"Owner was rejected in %s.%s error",[TObject.ClassName(Self.ClassType), "TQTXOwnedObject.SetOwner"]);
         }
      }
   }
   ,ix:function(Self, Tf) {
      return true;
   }
   ,Al:function(Self, l6) {
      YO.Gi(Self);
      LU.fq(Self,l6);
      return Self
   }
   ,Destroy:TObject.Destroy
   ,Gi:YO.Gi
};
LU.$Intf={
   yd:[LU.ix,LU.fq,LU.sV]
}
var PK = {
   $ClassName:"TQTXHandleObject",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
      $.li = undefined;
   }
   ,E6:function(Self, aK, ku) {
      /* null */
   }
   ,Xt:function(Self, gt) {
      return $VarToBool(gt);
   }
   ,Gt:function(Self, iI) {
      var KX;
      KX = Self.li;
      Self.li = iI;
      PK.E6(Self,KX,Self.li);
   }
   ,tZ:function(Self) {
      return Self.li;
   }
   ,Destroy:TObject.Destroy
};
PK.$Intf={
   Un:[PK.E6,PK.Xt,PK.Gt,PK.tZ]
}
var nO = {
   $ClassName:"TQTXComponent",$Parent:LU
   ,$Init:function ($) {
      LU.$Init($);
      $.Ro = "";
   }
   ,ks:function(Self, VZ, Fi) {
      LU.Al(Self,VZ);
      nO.mp(Self,nO.PY(Self));
      if (Fi) {
         Fi(Self);
      }
      return Self
   }
   ,PY:function(Self) {
      return O5.Oo(O5);
   }
   ,mp:function(Self, fzE) {
      Self.Ro = fzE;
   }
   ,Destroy:TObject.Destroy
   ,Gi:YO.Gi
};
nO.$Intf={
   yd:[LU.ix,LU.fq,LU.sV]
}
var ZK = {
   $ClassName:"EQTXOwnedObject",$Parent:Cn
   ,$Init:function ($) {
      Cn.$Init($);
   }
   ,Destroy:Exception.Destroy
};
var Hz = {
   $ClassName:"TManagedMemory",$Parent:LW
   ,$Init:function ($) {
      LW.$Init($);
      $.OnMemoryReleased = null;
      $.OnMemoryAllocated = null;
      $.pK = null;
      $.X9 = $.ZB = null;
   }
   ,cn:function(Self) {
      var Result = 0;
      Result = (Self.X9 !== null)?Self.X9.byteLength:0;
      return Result
   }
   ,jj:function(Self) {
      var Result = false;
      Result = Self.X9 === null;
      return Result
   }
   ,lY:function(Self) {
      if (Self.OnMemoryAllocated) {
         Self.OnMemoryAllocated(Self);
      }
   }
   ,sI:function(Self) {
      if (Self.OnMemoryReleased) {
         Self.OnMemoryReleased(Self);
      }
   }
   ,QP:function(Self, ZI) {
      ZI = { _ : ZI };
      if (Self.X9 !== null) {
         Hz.fB(Self);
      }
      if (ZI._ > 0) {
         Hz.NA(Self,ZI);
         try {
            Self.X9 = new ArrayBuffer(ZI._);
            Self.ZB = new DataView(Self.X9);
            Self.pK = new Uint8Array(Self.X9);
         } catch ($e) {
            var LI = $W($e);
            Self.X9 = null;
            Self.ZB = null;
            Self.pK = null;
            throw $e;
         }
         Hz.lY(Self);
      } else {
         throw Exception.Create($New(GM),"Invalid size to allocate, value must be positive");
      }
   }
   ,j5:function(Self, Y1) {
      var MG = 0;
      if (Y1.length > 0) {
         MG = (Self.X9 !== null)?Hz.cn(Self):0;
         Hz.vS(Self,Y1.length);
         Hz.Qb(Self,MG,Y1);
      }
   }
   ,mc:function(Self, BM) {
      var ek = 0;
      if (BM===null) {
         Hz.fB(Self);
         return;
      }
      ek = BM[2]();
      if (ek < 1) {
         Hz.fB(Self);
         return;
      }
      Hz.QP(Self,ek);
      Self.pK.set(BM[0](),0);
   }
   ,NA:function(Self, bi) {
      /* null */
   }
   ,cs:function(Self) {
      /* null */
   }
   ,Destroy:function(Self) {
      if (Self.X9 !== null) {
         Hz.fB(Self);
      }
      LW.Destroy(Self);
   }
   ,Sc:function(Self, as) {
      var Ph = 0;
      if (Self.X9 !== null) {
         Hz.fB(Self);
      }
      Ph = as.length;
      if (Ph > 0) {
         Hz.QP(Self,Ph);
         (Self.pK).set(as, 0);
      }
   }
   ,AZ:function(Self) {
      return 0;
   }
   ,wh:function(Self) {
      return (Self.X9 !== null)?Self.X9.byteLength:0;
   }
   ,vS:function(Self, jp) {
      var FD = [];
      if (jp > 0) {
         if (Self.X9 !== null) {
            FD = Hz.vM(Self);
         }
         Hz.QP(Self,Hz.cn(Self)+jp);
         if (FD.length > 0) {
            Hz.Qb(Self,0,FD);
         }
      } else {
         throw Exception.Create($New(GM),"Invalid growth value, expected 1 or above error");
      }
   }
   ,vg:function(Self, cA, Nc) {
      var Result = [];
      var BM = null;
      if (Self.X9 === null) {
         throw Exception.Create($New(GM),"Read failed, buffer is empty error");
      }
      if (Nc < 1) {
         return null;
      }
      if (cA < 0 || cA >= Hz.cn(Self)) {
         throw Exception.Create($New(GM),"Invalid offset, expected 0.." + IntToStr(Hz.cn(Self)-1) + " not " + IntToStr(cA) + " error");
      }
      BM = Self.pK.subarray(cA,cA+Nc);
      Result = Array.prototype.slice.call(BM);
      return Result
   }
   ,fB:function(Self) {
      if (Self.X9 !== null) {
         try {
            try {
               Hz.cs(Self);
            } finally {
               Self.pK = null;
               Self.ZB = null;
               Self.X9 = null;
            }
         } finally {
            Hz.sI(Self);
         }
      }
   }
   ,rF:function(Self, Ph) {
      if (Ph > 0) {
         if (Ph != Hz.cn(Self)) {
            if (Ph > Hz.cn(Self)) {
               Hz.vS(Self,Ph-Hz.cn(Self));
            } else {
               Hz.FH(Self,Hz.cn(Self)-Ph);
            }
         }
      } else {
         Hz.fB(Self);
      }
   }
   ,FH:function(Self, SP) {
      var Bl = 0,
         Ri = [];
      if (SP > 0) {
         Bl = Hz.cn(Self)-SP;
         if (Bl <= 0) {
            Hz.fB(Self);
            return;
         }
         Ri = Hz.vg(Self,0,Bl);
         Hz.QP(Self,Bl);
         Hz.Qb(Self,0,Ri);
      } else {
         throw Exception.Create($New(GM),"Invalid shrink value, expected 1 or above error");
      }
   }
   ,vM:function(Self) {
      var Result = [];
      if (Self.X9 !== null) {
         Result = Array.prototype.slice.call(Self.pK);
      }
      return Result
   }
   ,Qb:function(Self, Bf, Gv) {
      if (Self.X9 === null) {
         throw Exception.Create($New(GM),"Write failed, buffer is empty error");
      }
      if (Gv.length < 1) {
         return;
      }
      if (Bf < 0 || Bf >= Hz.cn(Self)) {
         throw Exception.Create($New(GM),"Invalid offset, expected 0.." + IntToStr(Hz.cn(Self)-1) + " not " + IntToStr(Bf) + " error");
      }
      Self.pK.set(Gv,Bf);
   }
   ,Destroy$:function($){return $.ClassType.Destroy($)}
   ,j4:LW.j4
};
Hz.$Intf={
   ta:[Hz.vM,Hz.Sc,Hz.wh,Hz.AZ,Hz.vg,Hz.Qb,Hz.vS,Hz.FH,Hz.mc,Hz.j5]
}
var GM = {
   $ClassName:"EManagedMemory",$Parent:Exception
   ,$Init:function ($) {
      Exception.$Init($);
   }
   ,Destroy:Exception.Destroy
};
var pd = { 241:"rrContinue", 242:"rrStop", 243:"rrDispose" };
var J = {
   $ClassName:"TQTXCustomRepeater",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
      $.p = false;
      $.E = 0;
      $.t = undefined;
   }
   ,l:function(Self) {
      if (Self.t) {
         J.K(Self);
      }
      Self.t = w.V(w,$Event0(Self,J.e$),Self.E);
   }
   ,Destroy:function(Self) {
      if (Self.p) {
         J.H(Self,false);
      }
      TObject.Destroy(Self);
   }
   ,K:function(Self) {
      if (Self.t) {
         w.G(w,Self.t);
         Self.t = undefined;
      }
   }
   ,H:function(Self, im) {
      if (im != Self.p) {
         try {
            if (Self.p) {
               J.K(Self);
            } else {
               J.l(Self);
            }
         } finally {
            Self.p = im;
         }
      }
   }
   ,Destroy$:function($){return $.ClassType.Destroy($)}
   ,e$:function($){return $.ClassType.e($)}
};
var w = {
   $ClassName:"TQTXDispatch",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
   }
   ,Lq:function(Self, ku) {
      clearTimeout(ku);
   }
   ,G:function(Self, wT) {
      clearInterval(wT);
   }
   ,z:function(Self, xH) {
      clearTimeout(xH);
   }
   ,O:function(Self, ac, YTg) {
      var Result = undefined;
      Result = setTimeout(ac,YTg);
      return Result
   }
   ,j:function(Self) {
      var Result = null;
      Result = new Date();
      return Result
   }
   ,o:function(Self, Na, Gf, dQ) {
      if (Na) {
         if (Gf > 0) {
            Na();
            if (Gf > 1) {
               w.O(Self,function () {
                  w.o(Self,Na,Gf-1,dQ);
               },dQ);
            }
         } else {
            Na();
            w.O(Self,function () {
               w.o(Self,Na,-1,dQ);
            },dQ);
         }
      }
   }
   ,V:function(Self, Cy, vJ) {
      var Result = undefined;
      Result = setInterval(Cy, vJ);
      return Result
   }
   ,b:function(Self, kc, Nm) {
      var Result = undefined;
      Result = setTimeout(kc,Nm);
      return Result
   }
   ,f:function(Self) {
      var Result = 0;
      Result = new Date().getTime() * 1000+621355968000000000;
      return Result
   }
   ,D:function(Self, Xx, Ym) {
      var Result = 0;
      Result = Ch.Qm(w.M(Self,Xx),w.M(Self,Ym));
      return Result
   }
   ,M:function(Self, H8) {
      var Result = 0;
      var dT = null;
      dT = hP.at(hP,H8);
      Result = dT.getTime() * 1000+621355968000000000;
      return Result
   }
   ,Destroy:TObject.Destroy
};
var jK = {
   $ClassName:"TQTXLogHandleObject",$Parent:PK
   ,$Init:function ($) {
      PK.$Init($);
      $.He = null;
   }
   ,Je:function(Self) {
      TObject.Create(Self);
      return Self
   }
   ,Destroy:function(Self) {
      Self.He = null;
      TObject.Destroy(Self);
   }
   ,xl:function(Self, mj) {
      if (Self.He===null) {
         m(mj);
      } else {
         Self.He[1](mj);
      }
   }
   ,Destroy$:function($){return $.ClassType.Destroy($)}
};
jK.$Intf={
   Un:[PK.E6,PK.Xt,PK.Gt,PK.tZ]
}
var F6 = {
   $ClassName:"TQTXNetworkService",$Parent:jK
   ,$Init:function ($) {
      jK.$Init($);
      $.OnAfterStopped = null;
      $.OnBeforeStopped = null;
      $.OnAfterStarted = null;
      $.OnBeforeStarted = null;
      $.Ki = false;
      $.WK = "";
      $.E5 = 0;
      $.jH = [];
   }
   ,E7:function(Self) {
      var Y1 = 0,
         YI = {Hv:undefined,Ul:null};
      if (Self.jH.length > 0) {
         try {
            var bu = [];
            bu = Self.jH;
            var $temp3;
            for(Y1=0,$temp3=bu.length;Y1<$temp3;Y1++) {
               Copy$f5(bu[Y1],YI);
               YI.Ul(Self,YI.Hv,null);
            }
         } finally {
            Self.jH.length=0;
         }
      }
      if (Self.OnAfterStarted) {
         Self.OnAfterStarted(Self);
      }
   }
   ,XZ:function(Self) {
      if (Self.OnAfterStopped) {
         Self.OnAfterStopped(Self);
      }
   }
   ,PM:function(Self) {
      if (Self.OnBeforeStarted) {
         Self.OnBeforeStarted(Self);
      }
   }
   ,mE:function(Self) {
      if (Self.OnBeforeStopped) {
         Self.OnBeforeStopped(Self);
      }
   }
   ,Destroy:function(Self) {
      if (F6.eo(Self)) {
         try {
            try {
               F6.JE$(Self);
            } catch ($e) {
               var s6 = $W($e);
               /* null */
            }
         } finally {
            PK.Gt(Self,undefined);
         }
      }
      jK.Destroy(Self);
   }
   ,eo:function(Self) {
      return Self.Ki;
   }
   ,JP:function(Self) {
      return Self.WK;
   }
   ,Mk:function(Self) {
      return Self.E5;
   }
   ,DK:function(Self, QZ) {
      if (QZ != F6.eo(Self)) {
         if (F6.eo(Self)) {
            F6.mE(Self);
            F6.JE$(Self);
         } else {
            F6.PM(Self);
            F6.PN$(Self);
         }
      }
   }
   ,x7:function(Self, BI) {
      Self.Ki = BI;
   }
   ,Yd:function(Self, ji) {
      if (F6.eo(Self)) {
         throw Exception.Create($New(Mv),"Address cannot be altered while object is active error");
      } else {
         Self.WK = Trim$_String_(ji);
      }
   }
   ,Z3:function(Self, Eh) {
      if (F6.eo(Self)) {
         throw Exception.Create($New(Mv),"Port cannot be altered while object is active error");
      } else {
         Self.E5 = Eh;
      }
   }
   ,H3:function(Self, dz, FQ) {
      var ll = {Hv:undefined,Ul:null},
         tM = null;
      if (F6.eo(Self)) {
         Self.jH.length=0;
         tM = Exception.Create($New(Exception),"Failed to start service, already active error");
         if (FQ) {
            FQ(Self,Self,tM);
         } else {
            throw tM;
         }
      } else {
         if (FQ) {
            ll.Ul = FQ;
            ll.Hv = dz;
            Self.jH.push(Clone$f5(ll));
         }
         F6.DK(Self,true);
      }
   }
   ,Destroy$:function($){return $.ClassType.Destroy($)}
   ,JE$:function($){return $.ClassType.JE($)}
   ,PN$:function($){return $.ClassType.PN($)}
};
F6.$Intf={
   Un:[PK.E6,PK.Xt,PK.Gt,PK.tZ]
}
var z9 = {
   $ClassName:"TQTXUDPServer",$Parent:F6
   ,$Init:function ($) {
      F6.$Init($);
   }
   ,ki:function(Self) {
      var Result = null;
      Result = PK.tZ(Self);
      return Result
   }
   ,lP:function(Self, v3, LP) {
      /* null */
   }
   ,JE:function(Self) {
      z9.ki(Self).close($Event0(Self,F6.XZ));
   }
   ,PN:function(Self) {
      var D4 = null,
         Rb = undefined;
      try {
         Rb = n5().createSocket("udp4");
      } catch ($e) {
         var F1 = $W($e);
         jK.xl(Self,F1.FMessage)      }
      PK.Gt(Self,Rb);
      D4 = Rb;
      D4.bind(F6.Mk(Self),F6.JP(Self));
      z9.dZ(Self,D4);
      D4.on("listening",function () {
         F6.x7(Self,true);
         z9.mH(Self,D4);
         F6.E7(Self);
      });
      D4.on("message",function (dk, We) {
         z9.lP$(Self,dk,i.AK(We));
      });
   }
   ,mH:function(Self, Ha) {
      /* null */
   }
   ,dZ:function(Self, F9) {
      /* null */
   }
   ,Destroy:F6.Destroy
   ,JE$:function($){return $.ClassType.JE($)}
   ,PN$:function($){return $.ClassType.PN($)}
   ,lP$:function($){return $.ClassType.lP.apply($.ClassType, arguments)}
};
z9.$Intf={
   Un:[PK.E6,PK.Xt,PK.Gt,PK.tZ]
}
var Uz = {
   $ClassName:"TUDPServer",$Parent:z9
   ,$Init:function ($) {
      z9.$Init($);
   }
   ,lP:function(Self, um, tX) {
      m(um);
   }
   ,Destroy:F6.Destroy
   ,JE:z9.JE
   ,PN:z9.PN
   ,lP$:function($){return $.ClassType.lP.apply($.ClassType, arguments)}
};
Uz.$Intf={
   Un:[PK.E6,PK.Xt,PK.Gt,PK.tZ]
}
var GZ = {
   $ClassName:"TQTXApplication",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
   }
   ,Destroy:TObject.Destroy
};
var Im = {
   $ClassName:"TNodeApplication",$Parent:GZ
   ,$Init:function ($) {
      GZ.$Init($);
      $.rY = null;
   }
   ,Yr:function(Self) {
      Self.rY = jK.Je($New(Uz));
      F6.Z3(Self.rY,1881);
      F6.Yd(Self.rY,xM());
      F6.H3(Self.rY,null,function (es, dwz, Oz) {
         if (Oz !== null) {
            m("UDP Server failed to start:");
            m(Oz.FMessage);
            return;
         }
         B("UDP Server started, listening on %s:%d",[F6.JP(Self.rY), F6.Mk(Self.rY)]);
      });
   }
   ,Destroy:TObject.Destroy
};
function Uf() {
   var Result = null;
   if (hA === null) {
      hA = require("path");
   }
   Result = hA;
   return Result
};
function JPathParseData() {
}
$Extend(Object,JPathParseData,
   {
      "root" : "",
      "dir" : "",
      "base" : "",
      "ext" : "",
      "name" : ""
   });

function JPathFormatData() {
}
$Extend(Object,JPathFormatData,
   {
      "dir" : "",
      "root" : "",
      "base" : "",
      "name" : "",
      "ext" : ""
   });

var jv = [ "teUnknown", "teDefault", "teAscii", "teBase64", "teHex", "teUTF8", "teUTF16", "teUTF16le", "teUCS2", "teUCS2le", "teBinary", "teLatin1" ];
function D9(VR) {
   return dl[VR];
};
function Ys() {
   var eN = 0,
      VP = 0,
      Ct = "";
   Q9 = i.ho();
   eN = 0;
   for(VP=0;VP<=11;VP++) {
      Ct = dl[VP];
      Q9[Ct] = eN;
      ++eN;
   }
};
function Vk() {
   var Result = null;
   if (yO === null) {
      yO = require("os");
   }
   Result = yO;
   return Result
};
var Ap = {
   $ClassName:"JEnvVariables",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
   }
   ,Destroy:TObject.Destroy
};
function Copy$yR(s,d) {
   return d;
}
function Clone$yR($) {
   return {

   }
}
function Copy$hu(s,d) {
   return d;
}
function Clone$hu($) {
   return {

   }
}
function Copy$Mw(s,d) {
   return d;
}
function Clone$Mw($) {
   return {

   }
}
function Copy$ga(s,d) {
   return d;
}
function Clone$ga($) {
   return {

   }
}
function TReadFileSyncOptions() {
}
$Extend(Object,TReadFileSyncOptions,
   {
      "encoding" : undefined,
      "flag" : ""
   });

function TReadFileOptions() {
}
$Extend(Object,TReadFileOptions,
   {
      "encoding" : undefined,
      "flag" : ""
   });

var N3 = [ "rpUnknown", "rpWindows", "rpLinux", "rpOSX" ];
var ay = {
   $ClassName:"TQTXNodeFileUtils",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
   }
   ,Kh:function(Self, Jb, Y1, sdj) {
      var RH = null;
      function yJ(df, D3, TU) {
         var Pu = 0;
         Pu = D3.length;
         if (Pu < 1) {
            if (TU) {
               TU(null);
            }
            return;
         }
         w.O(w,function () {
            var Mm = 0,
               vG = null,
               AO = "";
            var $temp4;
            for(Mm=0,$temp4=D3.length;Mm<$temp4;Mm++) {
               vG = D3[Mm];
               AO = ay.Hm(ay,df.xz);
               AO += vG.diFileName;
               ay.Kh(Self,null,AO,function (UV, ed, LZ) {
                  if (LZ !== null) {
                     TU(LZ);
                     return;
                  }
                  --Pu;
                  if (Pu < 1) {
                     TU(null);
                  }
               });
            }
         },100);
      };
      function mF(NI, em, Ct) {
         var Tp = 0,
            bC = 0,
            vs = null,
            Rt = "";
         Tp = em.length;
         if (Tp < 1) {
            if (Ct) {
               Ct(null);
            }
            return;
         }
         var $temp5;
         for(bC=0,$temp5=em.length;bC<$temp5;bC++) {
            vs = em[bC];
            Rt = ay.Hm(ay,NI.xz);
            Rt += vs.diFileName;
            lp().unlink(Rt,function (yf) {
               if (yf !== null) {
                  Ct(Exception.Create($New(By),yf.message));
                  return;
               }
               --Tp;
               if (Tp < 1) {
                  em.length=0;
                  Ct(null);
               }
            });
         }
      };
      RH = YO.Gi$($New(FU));
      FU.ax(RH,Y1,function (KX, um) {
         if (um !== null) {
            if (sdj) {
               sdj(Jb,KX.xz,um);
            } else {
               throw um;
            }
            return;
         }
         mF(RH,FU.PI(RH),function (gt) {
            if (gt !== null) {
               if (sdj) {
                  sdj(Jb,RH.xz,gt);
               } else {
                  throw gt;
               }
               return;
            }
            yJ(RH,FU.J4(RH),function (D1) {
               if (D1 !== null) {
                  if (sdj) {
                     sdj(Jb,RH.xz,D1);
                  } else {
                     throw D1;
                  }
                  return;
               }
               lp().rmdir(RH.xz,function (qD) {
                  if (qD !== null) {
                     TObject.Free(RH);
                     sdj(Jb,RH.xz,Exception.Create($New(By),qD.message));
                     return;
                  }
                  try {
                     sdj(Jb,RH.xz,null);
                  } finally {
                     TObject.Free(RH);
                  }
               });
            });
         });
      });
   }
   ,hc:function(Self, H4, Uo, EY) {
      lp().access(Uo,lp().constants.F_OK,function (eU) {
         var Tj = null;
         if (eU !== null) {
            Tj = Exception.Create($New(By),eU.message);
            if (EY) {
               EY(H4,Uo,Tj);
            } else {
               throw Tj;
            }
            return;
         }
         if (EY) {
            EY(H4,Uo,null);
         }
      });
   }
   ,VY:function(Self, D3) {
      var Result = false;
      var Hn = null;
      if (lp().existsSync(D3)) {
         try {
            Hn = lp().lstatSync(D3);
            Result = Hn.isFile();
         } catch ($e) {
            var kq = $W($e);
            /* null */
         }
      }
      return Result
   }
   ,Hm:function(Self, Ut) {
      var Result = "";
      var vw = "";
      vw = Uf().sep;
      Result = Trim$_String_(Ut);
      if (!(StrEndsWith(Result,vw))) {
         Result += vw;
      }
      return Result
   }
   ,fQ:function(Self, cu) {
      return process.argv[cu];
   }
   ,Destroy:TObject.Destroy
};
function Copy$ey(s,d) {
   return d;
}
function Clone$ey($) {
   return {

   }
}
function lp() {
   var Result = null;
   if (bm === null) {
      bm = require("fs");
   }
   Result = bm;
   return Result
};
function JWriteFileStreamOptionsEx2() {
}
$Extend(Object,JWriteFileStreamOptionsEx2,
   {
      "encoding" : "utf8",
      "flags" : "w",
      "fd" : null,
      "mode" : 666,
      "autoClose" : true
   });

function JWriteFileStreamOptions() {
}
$Extend(Object,JWriteFileStreamOptions,
   {
      "flags" : "w",
      "encoding" : "utf8",
      "fd" : null,
      "mode" : 666,
      "autoClose" : true
   });

function JWriteFileStreamOptionsEx() {
   JWriteFileStreamOptions.call(this);
}
$Extend(JWriteFileStreamOptions,JWriteFileStreamOptionsEx,
   {
      "start" : 0
   });

function Copy$SB(s,d) {
   return d;
}
function Clone$SB($) {
   return {

   }
}
function JReadFileStreamOptions() {
}
$Extend(Object,JReadFileStreamOptions,
   {
      "flags" : "r",
      "encoding" : "utf8",
      "fd" : null,
      "mode" : 666,
      "autoClose" : true
   });

function JReadFileStreamOptionsEx() {
   JReadFileStreamOptions.call(this);
}
$Extend(JReadFileStreamOptions,JReadFileStreamOptionsEx,
   {
      "start" : 0,
      "end" : 0,
      "highWaterMark" : 65536
   });

function JReadableFromOptions() {
}
$Extend(Object,JReadableFromOptions,
   {
      "objectMode" : false
   });

function JOpenDirOptionsV3() {
}
$Extend(Object,JOpenDirOptionsV3,
   {
      "bufferSize" : 32
   });

function JOpenDirOptionsV2() {
}
$Extend(Object,JOpenDirOptionsV2,
   {
      "encoding" : "utf8"
   });

function JOpenDirOptions() {
}
$Extend(Object,JOpenDirOptions,
   {
      "encoding" : "utf8",
      "bufferSize" : 32
   });

function JFileAccessConstants() {
}
$Extend(Object,JFileAccessConstants,
   {
      "F_OK" : 0,
      "O_APPEND" : 0,
      "O_CREAT" : 0,
      "O_DIRECT" : 0,
      "O_DIRECTORY" : 0,
      "O_DSYNC" : 0,
      "O_EXCL" : 0,
      "O_NOATIME" : 0,
      "O_NOCTTY" : 0,
      "O_NOFOLLOW" : 0,
      "O_NONBLOCK" : 0,
      "O_RDONLY" : 0,
      "O_RDWR" : 0,
      "O_SYMLINK" : 0,
      "O_SYNC" : 0,
      "O_TRUNC" : 0,
      "O_WRONLY" : 0,
      "R_OK" : 0,
      "S_IFBLK" : 0,
      "S_IFCHR" : 0,
      "S_IFDIR" : 0,
      "S_IFIFO" : 0,
      "S_IFLNK" : 0,
      "S_IFMT" : 0,
      "S_IFREG" : 0,
      "S_IFSOCK" : 0,
      "S_IRGRP" : 0,
      "S_IROTH" : 0,
      "S_IRUSR" : 0,
      "S_IRWXG" : 0,
      "S_IRWXO" : 0,
      "S_IRWXU" : 0,
      "S_IWGRP" : 0,
      "S_IWOTH" : 0,
      "S_IWUSR" : 0,
      "S_IXGRP" : 0,
      "S_IXOTH" : 0,
      "S_IXUSR" : 0,
      "W_OK" : 0,
      "X_OK" : 0
   });

function Copy$kS(s,d) {
   return d;
}
function Clone$kS($) {
   return {

   }
}
function JServerOptions() {
}
$Extend(Object,JServerOptions,
   {
      "allowHalfOpen" : false,
      "pauseOnConnect" : false
   });

function JServerListenOptions() {
}
$Extend(Object,JServerListenOptions,
   {
      "ipv6Only" : false,
      "writeableAll" : false,
      "readableAll" : false,
      "exclusive" : false,
      "host" : "",
      "path" : "",
      "backlog" : 0,
      "port" : 0
   });

var q1 = {
   $ClassName:"JServerAddress",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
   }
   ,Destroy:TObject.Destroy
};
function JConnectOptions() {
}
$Extend(Object,JConnectOptions,
   {
      "fd" : 0,
      "allowHalfOpen" : false,
      "readable" : false,
      "writeable" : false
   });

function xM() {
   var Result = "";
   var Of = null,
      YU,
      aQ = "",
      it = "",
      nD = null,
      DF = "";
   Of = Vk();
   YU = Of.networkInterfaces();
   for (aQ in YU) {
      if (StrContains(aQ,"Loopback")) {
         continue;
      }
      for (it in YU[aQ]) {
         nD = YU[aQ][it];
         if (!(nD.internal)) {
            DF = nD.family + " ";
            if (Trim$_String_(AnsiLowerCase(DF)) == "ipv4") {
               Result = nD.address + " ";
               Result = Trim$_String_(Result);
               break;
            }
         }
      }
   }
   if (Result.length < 1) {
      Result = "127.0.0.1";
   }
   return Result
};
var jr = {
   $ClassName:"TQTXNetworkClient",$Parent:F6
   ,$Init:function ($) {
      F6.$Init($);
   }
   ,Destroy:F6.Destroy
   ,JE:F6.JE
   ,PN:F6.PN
};
jr.$Intf={
   Un:[PK.E6,PK.Xt,PK.Gt,PK.tZ]
}
function n5() {
   var Result = null;
   if (zb === null) {
      zb = require("dgram");
   }
   Result = zb;
   return Result
};
function JUDPBindingInfo() {
}
$Extend(Object,JUDPBindingInfo,
   {
      "reuseAddr" : false,
      "port" : 0,
      "address" : "",
      "exclusive" : false
   });

function Copy$f5(s,d) {
   d.Hv=s.Hv;
   d.Ul=s.Ul;
   return d;
}
function Clone$f5($) {
   return {
      Hv:$.Hv,
      Ul:$.Ul
   }
}
var Mv = {
   $ClassName:"EQTXNetworkError",$Parent:By
   ,$Init:function ($) {
      By.$Init($);
   }
   ,Destroy:Exception.Destroy
};
function sG() {
   var Result = null;
   if (Fy === null) {
      Fy = require("cluster");
   }
   Result = Fy;
   return Result
};
function JSendOptions() {
}
$Extend(Object,JSendOptions,
   {
      "keepOpen" : false
   });

function JChildProcessSpawnOptions() {
}
$Extend(Object,JChildProcessSpawnOptions,
   {
      "shell" : false,
      "detached" : false,
      "stdio" : undefined,
      "custom" : undefined,
      "env" : undefined,
      "cwd" : ""
   });

function JChildProcessForkOptions() {
}
$Extend(Object,JChildProcessForkOptions,
   {
      "cwd" : "",
      "env" : undefined,
      "encoding" : ""
   });

function JChildProcessExecOptions() {
}
$Extend(Object,JChildProcessExecOptions,
   {
      "killSignal" : "",
      "maxBuffer" : 0,
      "timeout" : 0,
      "encoding" : "",
      "stdio" : undefined,
      "customFds" : undefined,
      "env" : undefined,
      "cwd" : ""
   });

function JChildProcessExecFileOptions() {
}
$Extend(Object,JChildProcessExecFileOptions,
   {
      "killSignal" : "",
      "maxBuffer" : "",
      "timeout" : 0,
      "encoding" : "",
      "stdio" : undefined,
      "customFds" : undefined,
      "env" : undefined,
      "cwd" : ""
   });

var FU = {
   $ClassName:"TQTXFileWalker",$Parent:YO
   ,$Init:function ($) {
      YO.$Init($);
      $.OnIncludeFile = null;
      $.OnAfterWalk = null;
      $.OnBeforeWalk = null;
      $.xS = $.fj = false;
      $.yi = $.xz = "";
      $.BO = 1;
      $.sh = null;
      $.bV = [];
      $.wF = null;
   }
   ,v5:function(Self) {
      if (Self.xS) {
         Self.fj = true;
         Self.bV.length=0;
      }
   }
   ,QB:function(Self) {
      Self.wF.dlPath = "";
      Self.wF.dlItems.length=0;
      Self.wF = new JFileItemList();
      Self.bV.length=0;
      Self.xS = false;
      Self.fj = false;
      Self.sh = null;
      Self.xz = "";
   }
   ,Gi:function(Self) {
      YO.Gi(Self);
      Self.wF = new JFileItemList();
      return Self
   }
   ,Destroy:function(Self) {
      try {
         try {
            if (Self.xS) {
               FU.v5(Self);
            }
         } finally {
            Self.bV.length=0;
            Self.wF.dlPath = "";
            Self.wF.dlItems.length=0;
            Self.wF = null;
            Self.sh = null;
         }
      } catch ($e) {
         var jF = $W($e);
         /* null */
      }
      TObject.Destroy(Self);
   }
   ,td:function(Self) {
      try {
         if (Self.sh) {
            Self.sh(Self,null);
         }
      } finally {
         if (Self.OnAfterWalk) {
            Self.OnAfterWalk(Self);
         }
      }
   }
   ,Kj:function(Self) {
      if (Self.OnBeforeWalk) {
         Self.OnBeforeWalk(Self);
      }
   }
   ,ax:function(Self, Jd, NL) {
      var gA = null,
         dT = null;
      if ($SetIn(Self.An,0,0,2)) {
         YO.Si(Self);
      }
      if (Self.xS) {
         gA = Exception.Create($New(ha),"Filewalker instance is busy error");
         YO.E1(Self,gA.FMessage);
         if (NL) {
            NL(Self,gA);
         } else {
            throw gA;
         }
         return;
      }
      FU.QB(Self);
      Self.xS = true;
      Self.sh = NL;
      Self.xz = Jd;
      FU.Kj(Self);
      dT = lp();
      dT.readdir(Jd,function (mQ, nF) {
         var rv = null,
            Ij = 0,
            AI = "";
         if (mQ) {
            rv = By.J5($New(ha),"Failed to examine [%s], path does not exist error",[Self.xz]);
            YO.E1(Self,rv.FMessage);
            if (NL) {
               NL(Self,rv);
            } else {
               throw rv;
            }
            return;
         } else {
            Self.wF.dlPath = Jd;
            var $temp6;
            for(Ij=0,$temp6=nF.length;Ij<$temp6;Ij++) {
               AI = nF[Ij];
               Self.bV.push(AI);
            }
            w.O(w,$Event0(Self,FU.ES),Self.BO);
         }
      });
   }
   ,PI:function(Self) {
      var Result = [];
      var wB = 0,
         za5 = null;
      if (Self.xS) {
         throw Exception.Create($New(ha),"Filewalker instance is busy error");
      } else {
         var kq = [];
         kq = Self.wF.dlItems;
         var $temp7;
         for(wB=0,$temp7=kq.length;wB<$temp7;wB++) {
            za5 = kq[wB];
            if (!za5.diFileType) {
               Result.push(za5);
            }
         }
      }
      return Result
   }
   ,J4:function(Self) {
      var Result = [];
      var oX = 0,
         ky = null;
      if (Self.xS) {
         throw Exception.Create($New(ha),"Filewalker instance is busy error");
      } else {
         var l8 = [];
         l8 = Self.wF.dlItems;
         var $temp8;
         for(oX=0,$temp8=l8.length;oX<$temp8;oX++) {
            ky = l8[oX];
            if (ky.diFileType == 1) {
               Result.push(ky);
            }
         }
      }
      return Result
   }
   ,ES:function(Self) {
      function g9() {
         Self.xS = false;
         w.O(w,$Event0(Self,FU.td),Self.BO);
      };
      if (Self.fj) {
         g9();
         return;
      }
      if (Self.bV.length > 0) {
         w.O(w,$Event0(Self,FU.RB),Self.BO);
      } else {
         g9();
      }
   }
   ,RB:function(Self) {
      var dR = {_:false},
         ty = "";
      if ($SetIn(Self.An,0,0,2)) {
         YO.Si(Self);
      }
      if (Self.fj) {
         FU.ES(Self);
         return;
      }
      if (Self.bV.length > 0) {
         dR._ = true;
         ty = Self.bV.pop();
         Self.yi = Uf().normalize(ay.Hm(ay,Self.xz) + ty);
         lp().stat(Self.yi,function (DH, oJ) {
            var jn = null,
               Tk = "";
            if (DH) {
               YO.E1(Self,DH.message);
               FU.ES(Self);
               return;
            }
            jn = new JFileItem();
            jn.diFileName = ty;
            jn.diFileType = (oJ.isFile())?0:1;
            jn.diFileSize = (oJ.isFile())?oJ.size:0;
            jn.diCreated = (oJ.ctime !== null)?hP.zE(hP,oJ.ctime):Now();
            jn.diModified = (oJ.mtime !== null)?hP.zE(hP,oJ.mtime):Now();
            if (oJ.isFile()) {
               Tk = "";
               Tk = '0' + ((oJ).mode & parseInt('777', 8)).toString(8);
               jn.diFileMode = Tk;
            }
            if (Self.OnIncludeFile) {
               Self.OnIncludeFile(Self,jn,dR);
            }
            if (dR._) {
               Self.wF.dlItems.push(jn);
            } else {
               jn = null;
            }
            Self.yi = "";
            w.O(w,$Event0(Self,FU.ES),Self.BO);
         });
      } else {
         FU.ES(Self);
      }
   }
   ,Destroy$:function($){return $.ClassType.Destroy($)}
   ,Gi$:function($){return $.ClassType.Gi($)}
};
var ha = {
   $ClassName:"EQTXFileWalker",$Parent:By
   ,$Init:function ($) {
      By.$Init($);
   }
   ,Destroy:Exception.Destroy
};
var oi = [ "qdtInvalid", "qdtBoolean", "qdtinteger", "qdtfloat", "qdtstring", "qdtSymbol", "qdtFunction", "qdtObject", "qdtArray", "qdtVariant" ];
var pm = {
   $ClassName:"TQTXJSONObject",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
      $.gC = undefined;
   }
   ,YJ:function(Self, rg) {
      var Result = null;
      var gY;
      if (Self.gC.hasOwnProperty(rg)) {
         Result = pm.mA($New(pm),Self.gC[rg]);
         return Result;
      }
      gY = i.ho();
      Self.gC[rg] = gY;
      Result = pm.mA($New(pm),gY);
      return Result
   }
   ,mA:function(Self, t2) {
      TObject.Create(Self);
      if (t2) {
         if (ex$IJ(t2)) {
            Self.gC = t2;
         } else {
            throw Exception.Create($New(kW),"Failed to attach to JSON instance, reference is not an object");
         }
      } else {
         throw Exception.Create($New(kW),"Failed to attach to JSON instance, reference was NIL error");
      }
      return Self
   }
   ,oW:function(Self) {
      TObject.Create(Self);
      Self.gC = i.ho();
      return Self
   }
   ,wi:function(Self, sQ) {
      var AW;
      if (Self.gC.hasOwnProperty(sQ)) {
         AW = Self.gC;
         delete AW[sQ];
      }
   }
   ,Destroy:function(Self) {
      Self.gC = null;
      TObject.Destroy(Self);
   }
   ,nw:function(Self, G5) {
      var Result = 0;
      if (Self.gC.hasOwnProperty(G5)) {
         Result = oj.ez(oj,Self.gC[G5]);
      } else {
         throw By.J5($New(kW),"Failed to examine datatype, property [%s] not found error",[G5]);
      }
      return Result
   }
   ,Vt:function(Self, Ct) {
      var Result = false;
      if (Self.gC) {
         Result = $VarToBool(Self.gC.hasOwnProperty(Ct));
      } else {
         Result = false;
      }
      return Result
   }
   ,At:function(Self, Jd) {
      var Result = null;
      var VR = 0,
         rT = "",
         LP;
      Result = Self;
      if (Jd) {
         var RL = [];
         RL = pm.Cd(Self);
         var $temp9;
         for(VR=0,$temp9=RL.length;VR<$temp9;VR++) {
            rT = RL[VR];
            LP._ = pm.Gx(Self,rT);
            if (Jd(rT,LP) == 1) {
               pm.XX(Self,rT,LP._);
            } else {
               break;
            }
         }
      }
      return Result
   }
   ,Cd:function(Self) {
      var Result = [];
      var ux;
      ux = Self.gC;
      if (!(Object.keys === undefined)) {
      Result = Object.keys(ux);
      return Result;
    }

    if (!(Object.getOwnPropertyNames === undefined)) {
        Result = Object.getOwnPropertyNames(ux);
        return Result;
    }

    for (var qtxenum in ux) {
      if ( (ux).hasOwnProperty(qtxenum) == true )
        (Result).push(qtxenum);
    }
    return Result;
      return Result
   }
   ,OA:function(Self, jO) {
      var Result = undefined;
      var jz;
      jz = Self.gC;
      Result = Object.keys(jz)[jO];
      return Result
   }
   ,CD:function(Self, kc) {
      var Result = undefined;
      if (Self.gC.hasOwnProperty(kc)) {
         Result = Self.gC[kc];
      } else {
         throw By.J5($New(kW),$R[7],[kc]);
      }
      return Result
   }
   ,BH:function(Self) {
      var Result = 0;
      var Ij;
      Ij = Self.gC;
      Result = Object.keys(Ij).length;
      return Result
   }
   ,BD:function(Self, fA, Mt) {
      var Result = null;
      var s1,
         YB;
      if (Self.gC.hasOwnProperty(fA)) {
         s1 = Self.gC[fA];
         Result = pm.mA($New(pm),s1);
      } else {
         if (Mt) {
            YB = i.ho();
            Self.gC[fA] = YB;
            Result = pm.mA($New(pm),YB);
         }
      }
      return Result
   }
   ,Gx:function(Self, j7) {
      var Result = undefined;
      if (Self.gC.hasOwnProperty(j7)) {
         Result = Self.gC[j7];
      } else {
         throw By.J5($New(kW),$R[7],[j7]);
      }
      return Result
   }
   ,Wi:function(Self, iL) {
      var Result = false;
      if (Self.gC.hasOwnProperty(iL)) {
         Result = i.F4(Self.gC[iL]);
      } else {
         throw By.J5($New(kW),$R[7],[iL]);
      }
      return Result
   }
   ,t9:function(Self, l8) {
      var Result = undefined;
      if (Self.gC.hasOwnProperty(l8)) {
         try {
            Result = Self.gC[l8];
         } catch ($e) {
            var S6 = $W($e);
            /* null */
         }
      } else {
         throw By.J5($New(kW),$R[7],[l8]);
      }
      return Result
   }
   ,pD:function(Self, Hr) {
      var Result = 0;
      if (Self.gC.hasOwnProperty(Hr)) {
         Result = i.Zw(Self.gC[Hr]);
      } else {
         throw By.J5($New(kW),$R[7],[Hr]);
      }
      return Result
   }
   ,Y5:function(Self, EY) {
      var Result = 0;
      if (Self.gC.hasOwnProperty(EY)) {
         Result = i.FS(Self.gC[EY]);
      } else {
         throw By.J5($New(kW),$R[7],[EY]);
      }
      return Result
   }
   ,ZJ:function(Self, zm) {
      var Result = "";
      if (Self.gC.hasOwnProperty(zm)) {
         Result = i.SZ(Self.gC[zm]);
      } else {
         throw By.J5($New(kW),$R[7],[zm]);
      }
      return Result
   }
   ,NB:function(Self, F2) {
      var Result = undefined;
      var lZ = null,
         hD = "",
         Nr = [];
      if (pm.Vt(Self,F2)) {
         lZ = LW.j4$($New(LW));
         try {
            hD = String(Self.gC[F2]);
            Nr = LW.rN(hD);
            Result = LW.M1(lZ,Nr);
         } finally {
            TObject.Free(lZ);
         }
      } else {
         throw By.J5($New(kW),$R[7],[F2]);
      }
      return Result
   }
   ,XX:function(Self, Wr, bLY) {
      if (Self.gC.hasOwnProperty(Wr)) {
         Self.gC[Wr] = bLY;
      } else {
         throw By.J5($New(kW),$R[6],[Wr]);
      }
   }
   ,cJ:function(Self, iV, zp) {
      if (Self.gC.hasOwnProperty(iV)) {
         Self.gC[iV] = zp;
      } else {
         throw By.J5($New(kW),$R[6],[iV]);
      }
   }
   ,CA:function(Self, rI, Uc) {
      if (Self.gC.hasOwnProperty(rI)) {
         Self.gC[rI] = Uc;
      } else {
         throw By.J5($New(kW),$R[6],[rI]);
      }
   }
   ,dm:function(Self, Bl, F9) {
      if (Self.gC.hasOwnProperty(Bl)) {
         Self.gC[Bl] = FloatToStr$_Float_(F9);
      } else {
         throw By.J5($New(kW),$R[6],[Bl]);
      }
   }
   ,UY:function(Self, hD, Wp) {
      if (Self.gC.hasOwnProperty(hD)) {
         Self.gC[hD] = IntToStr(Wp);
      } else {
         throw By.J5($New(kW),$R[6],[hD]);
      }
   }
   ,WF:function(Self, Pc, Xx) {
      Self.gC[Pc] = Xx;
   }
   ,uE:function(Self, VU, P4) {
      if (Self.gC.hasOwnProperty(VU)) {
         Self.gC[VU] = P4;
      } else {
         throw By.J5($New(kW),$R[6],[VU]);
      }
   }
   ,xr:function(Self, ob, cI) {
      var HY = null,
         E2 = [];
      if (cI) {
         HY = LW.j4$($New(LW));
         try {
            E2 = LW.Ik(HY,cI);
            Self.gC[ob] = LW.Ls(E2);
         } finally {
            TObject.Free(HY);
         }
      } else {
         Self.gC[ob] = cI;
      }
   }
   ,Destroy$:function($){return $.ClassType.Destroy($)}
};
pm.$Intf={
   QQ:[pm.BH,pm.OA,pm.CD,pm.Cd,pm.At,pm.Vt,pm.nw,pm.Gx,pm.ZJ,pm.Y5,pm.Wi,pm.t9,pm.pD,pm.NB,pm.xr,pm.XX,pm.WF,pm.uE,pm.UY,pm.cJ,pm.CA,pm.dm,pm.YJ,pm.BD,pm.wi]
}
var oj = {
   $ClassName:"TQTXJSONDataTypeResolver",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
   }
   ,iu:function(Self, Nr) {
      var Result = false;
      Result = (Nr !== undefined)
      && (Nr !== null)
      && (Array.isArray(Nr) === true);
      return Result
   }
   ,S1:function(Self, MM) {
      var Result = false;
      Result = (MM !== undefined)
      && (MM !== null)
      && (typeof MM === "boolean");
      return Result
   }
   ,ez:function(Self, Gf) {
      var Result = 0;
      var XH = "";
      if (Gf) {
         XH = typeof(Gf);
         {var $temp10 = AnsiLowerCase(XH);
            if ($temp10=="object") {
               if ((!Gf.length)) {
                  Result = 7;
               } else {
                  Result = 8;
               }
            }
             else if ($temp10=="function") {
               Result = 6;
            }
             else if ($temp10=="symbol") {
               Result = 5;
            }
             else if ($temp10=="boolean") {
               Result = 1;
            }
             else if ($temp10=="string") {
               Result = 4;
            }
             else if ($temp10=="number") {
               if (Round(Number(Gf)) != Gf) {
                  Result = 3;
               } else {
                  Result = 2;
               }
            }
             else if ($temp10=="array") {
               Result = 8;
            }
             else {
               Result = 9;
            }
         }
      } else {
         Result = 0;
      }
      return Result
   }
   ,Fh:function(Self, C8) {
      var Result = false;
      Result = (C8 !== undefined)
      && (C8 !== null)
      && (typeof C8  === "number")
      && (Number(C8) === C8 && C8 % 1 !== 0);
      return Result
   }
   ,XW:function(Self, W4) {
      var Result = false;
      Result = (W4 !== undefined)
      && (W4 !== null)
      && (typeof W4 === "function");
      return Result
   }
   ,vh:function(Self, na) {
      var Result = false;
      Result = (na !== undefined)
      && (na !== null)
      && (typeof na  === "number")
      && (Number(na) === na && na % 1 === 0);
      return Result
   }
   ,CK:function(Self, Ym) {
      var Result = false;
      Result = (Ym !== undefined)
      && (Ym !== null)
      && (typeof Ym  === "object")
      && ((Ym).length === undefined);
      return Result
   }
   ,gd:function(Self, GB) {
      var Result = false;
      Result = (GB !== undefined)
      && (GB !== null)
      && (typeof GB  === "string");
      return Result
   }
   ,A3:function(Self, cg1) {
      var Result = false;
      Result = (cg1 !== undefined)
      && (cg1 !== null)
      && (typeof cg1 === "symbol");
      return Result
   }
   ,ot:function(Self, Jz) {
      var Result = false;
      var iR = "";
      if (Jz) {
         iR = "";
         iR = Object.prototype.toString.call(Jz);
         Result = iR == "[object Uint8Array]";
      }
      return Result
   }
   ,Destroy:TObject.Destroy
};
var kW = {
   $ClassName:"EQTXJSONObject",$Parent:By
   ,$Init:function ($) {
      By.$Init($);
   }
   ,Destroy:Exception.Destroy
};
var Ax = {
   $ClassName:"TQTXBase64Core",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
   }
   ,Dc:function(vl) {
      var Result = [];
      var IC = 0,
         KX = 0,
         fp = 0,
         Jd = 0,
         SE = 0,
         Gqp = 0,
         oV = 0,
         kj = 0,
         ag = 0,
         Lz = 0,
         uh = 0,
         oy = 0;
      SE = vl.length;
      if (SE > 0) {
         Gqp = 0;
         if (SE % 4 < 1) {
            Gqp = (vl.charAt((SE-1)-1) == "=")?2:(vl.charAt(SE-1) == "=")?1:0;
         }
         oV = ($Div(SE * 3,4))-Gqp;
         $ArraySetLenC(Result,oV,function (){return 0});
         if (Gqp > 0) {
            (SE-= 4);
         }
         kj = 1;
         ag = 0;
         while (kj < SE) {
            IC = qC[LW.Ng(vl.charAt(kj-1))]<<18;
            KX = qC[LW.Ng(vl.charAt(kj))]<<12;
            fp = qC[LW.Ng(vl.charAt(kj+1))]<<6;
            Jd = qC[LW.Ng(vl.charAt(kj+2))];
            Lz = ((IC|KX)|fp)|Jd;
            Result[ag]=(Lz>>>16)&255;
            ++ag;
            Result[ag]=(Lz>>>8)&255;
            ++ag;
            Result[ag]=Lz&255;
            ++ag;
            (kj+= 4);
         }
         switch (Gqp) {
            case 1 :
               IC = qC[LW.Ng(vl.charAt(kj-1))]<<2;
               KX = qC[LW.Ng(vl.charAt(kj))]>>>4;
               uh = IC|KX;
               Result[ag]=uh&255;
               break;
            case 2 :
               IC = qC[LW.Ng(vl.charAt(kj-1))]<<10;
               KX = qC[LW.Ng(vl.charAt(kj))]<<4;
               fp = qC[LW.Ng(vl.charAt(kj+1))]>>>2;
               oy = (IC|KX)|fp;
               Result[ag]=(oy>>>8)&255;
               ++ag;
               Result[ag]=oy&255;
               break;
         }
      }
      return Result
   }
   ,DD:function(Jv) {
      var Result = "";
      if (l9()) {
         Result = Buffer.from(Jv, "base64").toString("binary");
      } else {
         Result = atob(Jv);
      }
      return Result
   }
   ,xe:function(mZ) {
      var Result = "";
      var LI = 0,
         xU = 0,
         xu = 0,
         x9 = 0,
         hC = 0,
         En = 0,
         Ju = 0,
         qF = "",
         PS = 0,
         vb = 0;
      LI = mZ.length;
      if (LI > 0) {
         xU = mZ.length % 3;
         xu = LI-xU;
         x9 = 16383;
         hC = 0;
         while (hC < xu) {
            En = hC+x9;
            Ju = (En > xu)?xu:En;
            Result += Ax.zv(mZ,hC,Ju);
            (hC+= x9);
         }
         if (xU > 0) {
            --LI;
         }
         qF = "";
         switch (xU) {
            case 1 :
               PS = mZ[LI];
               qF += Xl[PS>>>2];
               qF += Xl[(PS<<4)&63];
               qF += "==";
               break;
            case 2 :
               vb = (mZ[LI-1]<<8)+mZ[LI];
               qF += Xl[vb>>>10];
               qF += Xl[(vb>>>4)&63];
               qF += Xl[(vb<<2)&63];
               qF += "=";
               break;
         }
         Result += qF;
      }
      return Result
   }
   ,zv:function(w3, Ow, Eg) {
      var Result = "";
      var iI = 0;
      while (Ow < Eg) {
         iI = (w3[Ow]<<16)+(w3[Ow+1]<<8)+w3[Ow+2];
         Result += Xl[(iI>>>18)&63] + Xl[(iI>>>12)&63] + Xl[(iI>>>6)&63] + Xl[iI&63];
         (Ow+= 3);
      }
      return Result
   }
   ,tm:function(NK) {
      var Result = "";
      if (l9()) {
         Result = Buffer.from(NK, "binary").toString("base64");
      } else {
         Result = btoa(NK);
      }
      return Result
   }
   ,Destroy:TObject.Destroy
};
var jt = {
   $ClassName:"TQTXCodec",$Parent:LW
   ,$Init:function ($) {
      LW.$Init($);
      $.fL = [];
      $.et = null;
   }
   ,j4:function(Self) {
      LW.j4(Self);
      Self.et = jt.ch$(Self);
      if (Self.et === null) {
         throw Exception.Create($New(QG),"Internal codec error, failed to obtain registration info error");
      }
      return Self
   }
   ,Destroy:function(Self) {
      TObject.Free(Self.et);
      LW.Destroy(Self);
   }
   ,ch:function(Self) {
      return null;
   }
   ,X2:function(Self, hq) {
      if (Self.fL.indexOf(hq) < 0) {
         Self.fL.push(hq);
      } else {
         throw Exception.Create($New(QG),"Binding already connected to codec error");
      }
   }
   ,IN:function(Self, fw) {
      var w3 = 0;
      w3 = Self.fL.indexOf(fw);
      if (w3 >= 0) {
         Self.fL.splice(w3,1)
         ;
      } else {
         throw Exception.Create($New(QG),"Binding not connected to this codec error");
      }
   }
   ,Destroy$:function($){return $.ClassType.Destroy($)}
   ,j4$:function($){return $.ClassType.j4($)}
   ,y7$:function($){return $.ClassType.y7.apply($.ClassType, arguments)}
   ,Qf$:function($){return $.ClassType.Qf.apply($.ClassType, arguments)}
   ,ch$:function($){return $.ClassType.ch($)}
};
jt.$Intf={
   i9:[jt.X2,jt.IN]
   ,ir:[jt.Qf,jt.y7]
}
var Md = {
   $ClassName:"TBase64Codec",$Parent:jt
   ,$Init:function ($) {
      jt.$Init($);
   }
   ,Qf:function(Self, Yq, kP) {
      /* null */
   }
   ,y7:function(Self, cN, IH) {
      /* null */
   }
   ,ch:function(Self) {
      var Result = null;
      var RR = {gE:0,Av:0,vp:0},
         mX = null;
      Result = TObject.Create($New(Cg));
      RR = Qg(0,1,0);
      RR.gE = 0;
      RR.Av = 1;
      RR.vp = 0;
      mX = $AsIntf(Result,"vy");
      mX[0]("Base64Codec");
      mX[1]("text\/base64");
      mX[2](RR);
      mX[3]([6]);
      mX[5](1);
      mX[6](0);
      return Result
   }
   ,Destroy:jt.Destroy
   ,j4:jt.j4
   ,y7$:function($){return $.ClassType.y7.apply($.ClassType, arguments)}
   ,Qf$:function($){return $.ClassType.Qf.apply($.ClassType, arguments)}
   ,ch$:function($){return $.ClassType.ch($)}
};
Md.$Intf={
   ir:[Md.Qf,Md.y7]
   ,i9:[jt.X2,jt.IN]
}
function QK() {
   var ti = 0;
   var $temp11;
   for(ti=1,$temp11=tl.length;ti<=$temp11;ti++) {
      Xl[ti-1] = tl.charAt(ti-1);
      qC[LW.Ng(tl.charAt(ti-1))] = ti-1;
   }
   qC[LW.Ng("-")] = 62;
   qC[LW.Ng("_")] = 63;
};
function Copy$j3(s,d) {
   d.gE=s.gE;
   d.Av=s.Av;
   d.vp=s.vp;
   return d;
}
function Clone$j3($) {
   return {
      gE:$.gE,
      Av:$.Av,
      vp:$.vp
   }
}
function Qg(Ge, yf, bK) {
   var Result = {gE:0,Av:0,vp:0};
   Result.gE = Ge;
   Result.Av = yf;
   Result.vp = bK;
   return Result
}
var ZC = {
   $ClassName:"TQTXCodecManager",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
      $.X6 = [];
   }
   ,Vv:function(Self, iL) {
      var Result = null;
      var s6 = 0,
         RH = null,
         VH = [];
      Result = null;
      VH = Self.X6;
      var $temp12;
      for(s6=0,$temp12=VH.length;s6<$temp12;s6++) {
         RH = VH[s6];
         if (TObject.ClassType(RH.ClassType) == iL) {
            Result = RH;
            break;
         }
      }
      return Result
   }
   ,Destroy:function(Self) {
      if (Self.X6.length > 0) {
         ZC.zo(Self);
      }
      TObject.Destroy(Self);
   }
   ,kk:function(Self, hV) {
      var tv = null;
      tv = ZC.Vv(Self,hV);
      if (tv === null) {
         tv = LW.j4$($NewDyn(hV,""));
         Self.X6.push(tv);
      } else {
         throw Exception.Create($New(tT),"Codec already registered error");
      }
   }
   ,zo:function(Self) {
      var dz = 0,
         GL = null;
      try {
         var bC = [];
         bC = Self.X6;
         var $temp13;
         for(dz=0,$temp13=bC.length;dz<$temp13;dz++) {
            GL = bC[dz];
            try {
               TObject.Free(GL);
            } catch ($e) {
               /* null */
            }
         }
      } finally {
         Self.X6.length=0;
      }
   }
   ,Destroy$:function($){return $.ClassType.Destroy($)}
};
var Cg = {
   $ClassName:"TQTXCodecInfo",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
      $.fX = $.kR = $.j1 = "";
      $.yg = [0];
      $.FZ = 0;
      $.O2 = 0;
      $.pN = {gE:0,Av:0,vp:0};
   }
   ,r6:function(Self, k4) {
      Self.yg = k4.slice(0);
   }
   ,Kg:function(Self, IH) {
      Self.fX = IH;
   }
   ,R4:function(Self, Oz) {
      Self.FZ = Oz;
   }
   ,ct:function(Self, Ht) {
      Self.kR = Ht;
   }
   ,TX:function(Self, sA) {
      Self.j1 = sA;
   }
   ,Wu:function(Self, IM) {
      Self.O2 = IM;
   }
   ,dA:function(Self, xL) {
      Self.pN.gE = xL.gE;
      Self.pN.Av = xL.Av;
      Self.pN.vp = xL.vp;
   }
   ,Destroy:TObject.Destroy
};
Cg.$Intf={
   vy:[Cg.TX,Cg.ct,Cg.dA,Cg.r6,Cg.Kg,Cg.R4,Cg.Wu]
}
var pp = {
   $ClassName:"TQTXCodecBinding",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
      $.oo = null;
   }
   ,nJ:function(Self, Gv) {
      var b5 = null;
      TObject.Create(Self);
      if (Gv !== null) {
         Self.oo = Gv;
         b5 = $AsIntf(Self.oo,"i9");
         b5[0](Self);
      } else {
         throw Exception.Create($New(Gz),"Binding failed, invalid endpoint error");
      }
      return Self
   }
   ,Destroy:function(Self) {
      var vL = null;
      vL = $AsIntf(Self.oo,"i9");
      vL[1](Self);
      TObject.Destroy(Self);
   }
   ,Destroy$:function($){return $.ClassType.Destroy($)}
};
var vK = [ "cdBinary", "cdText" ];
function b2$BP(ah) {
   var Result = 0;
   Result = 0;
   if ($SetIn(ah,1,0,3)) {
      ++Result;
   }
   if ($SetIn(ah,2,0,3)) {
      (Result+= 2);
   }
   return Result
}
var f9P = { 1:"cdRead", 2:"cdWrite" };
var QG = {
   $ClassName:"ECodecError",$Parent:By
   ,$Init:function ($) {
      By.$Init($);
   }
   ,Destroy:Exception.Destroy
};
var tT = {
   $ClassName:"ECodecManager",$Parent:QG
   ,$Init:function ($) {
      QG.$Init($);
   }
   ,Destroy:Exception.Destroy
};
var Gz = {
   $ClassName:"ECodecBinding",$Parent:QG
   ,$Init:function ($) {
      QG.$Init($);
   }
   ,Destroy:Exception.Destroy
};
function yj() {
   var Result = null;
   if (fK === null) {
      fK = TObject.Create($New(ZC));
   }
   Result = fK;
   return Result
};
var cj = {
   $ClassName:"TQTXCodecUTF8",$Parent:jt
   ,$Init:function ($) {
      jt.$Init($);
      $.EncodeBOM = false;
   }
   ,UI:function() {
      var Result = {_:false};
      try {
         var EW = undefined;
         try {
            EW = new Uint8ClampedArray(10);
         } catch ($e) {
            var hC = $W($e);
            return Result._;
         }
         if (EW) {
            Result._ = true;
         }
      } finally {return Result._}
   }
   ,k9:function() {
      var Result = {_:false};
      try {
         var ec = null;
         try {
            ec = new TextEncoder("utf8");
         } catch ($e) {
            var gb = $W($e);
            return false;
         }
         Result._ = ec !== null;
      } finally {return Result._}
   }
   ,WN:function(Self, ae) {
      var Result = "";
      var Ab = null,
         Ke,
         ji = 0,
         Tp = 0,
         vt = 0,
         PE = 0,
         vl = 0,
         WR = 0,
         fp = 0,
         cw = 0,
         OI = 0,
         SQ = 0;
      if (ae.length < 1) {
         return "";
      }
      if (cj.k9()) {
         Ab = new TextDecoder("utf8");
         Ke = LW.rc(Self,ae);
         Result = Ab.decode(Ke);
         Ke = null;
         Ab = null;
      } else {
         ji = 0;
         Tp = ae.length;
         if (Tp > 2) {
            if (CT.Sl(CT,ae)) {
               (ji+= 3);
            }
         }
         while (ji < Tp) {
            vt = ae[ji];
            ++ji;
            if (vt < 128) {
               Result += uy.pF(vt);
            } else if (vt > 191 && vt < 224) {
               PE = ae[ji];
               ++ji;
               Result += uy.pF(((vt&31)<<6)|(PE&63));
            } else if (vt > 239 && vt < 365) {
               vl = ae[ji];
               ++ji;
               WR = ae[ji];
               ++ji;
               fp = ae[ji];
               ++ji;
               cw = (((((vt&7)<<18)|((vl&63)<<12))|((WR&63)<<6))|(fp&63))-65536;
               Result += uy.pF(55296+(cw>>>10));
               Result += uy.pF(56320+(cw&1023));
            } else {
               OI = ae[ji];
               ++ji;
               SQ = ae[ji];
               ++ji;
               Result += uy.pF(((vt&15)<<12)|(((OI&63)<<6)|(SQ&63)));
            }
         }
      }
      return Result
   }
   ,y7:function(Self, f6, KX) {
      /* null */
   }
   ,l5:function(Self, jp) {
      var Result = [];
      var sD = null,
         B4 = null,
         XT = null,
         Bk = null,
         sj = 0;
      if (jp.length < 1) {
         return null;
      }
      if (cj.k9()) {
         sD = new TextEncoder("utf8");
         B4 = sD.encode(jp);
         Result = LW.CV(B4);
         sD = null;
         B4 = null;
      } else {
         if (cj.UI()) {
            XT = new Uint8ClampedArray(1);
            Bk = new Uint8ClampedArray(1);
         } else {
            XT = new Uint8Array(1);
            Bk = new Uint8Array(1);
         }
         if (Self.EncodeBOM) {
            switch (LW.tp()) {
               case 1 :
                  Result.push([239, 187, 191]);
                  break;
               case 2 :
                  Result.push([187, 239, 191]);
                  break;
            }
         }
         var $temp14;
         for(sj=1,$temp14=jp.length;sj<=$temp14;sj++) {
            XT[0]=uy.nX(jp.charAt(sj-1));
            if (XT[0] < 128) {
               Result.push(XT[0]);
            } else if (XT[0] > 127 && XT[0] < 2048) {
               Bk[0]=((XT[0]>>>6)|192);
               Result.push(Bk[0]);
               Bk[0]=((XT[0]&63)|128);
               Result.push(Bk[0]);
            } else {
               Bk[0]=((XT[0]>>>12)|224);
               Result.push(Bk[0]);
               Bk[0]=(((XT[0]>>>6)&63)|128);
               Result.push(Bk[0]);
               Result.push((XT[0]&63)|128);
               Result.push(Bk[0]);
            }
         }
      }
      return Result
   }
   ,Qf:function(Self, Nr, F2) {
      /* null */
   }
   ,ch:function(Self) {
      var Result = null;
      var tX = {gE:0,Av:0,vp:0},
         mx = null;
      Result = TObject.Create($New(Cg));
      tX = Qg(0,2,0);
      mx = $AsIntf(Result,"vy");
      mx[0]("UTF8Codec");
      mx[1]("text\/utf8");
      mx[2](tX);
      mx[3]([6]);
      mx[5](1);
      mx[6](0);
      return Result
   }
   ,Destroy:jt.Destroy
   ,j4:jt.j4
   ,y7$:function($){return $.ClassType.y7.apply($.ClassType, arguments)}
   ,Qf$:function($){return $.ClassType.Qf.apply($.ClassType, arguments)}
   ,ch$:function($){return $.ClassType.ch($)}
};
cj.$Intf={
   ir:[cj.Qf,cj.y7]
   ,i9:[jt.X2,jt.IN]
}
var CT = {
   $ClassName:"TQTXByteOrderMarkUTF8",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
   }
   ,Sl:function(Self, QE) {
      var Result = false;
      if (QE.length >= 3) {
         switch (LW.tp()) {
            case 1 :
               Result = QE[0] == 254 && QE[1] == 255;
               break;
            case 2 :
               Result = QE[0] == 255 && QE[1] == 254;
               break;
         }
      }
      return Result
   }
   ,Destroy:TObject.Destroy
};
var Lw = [ "bomNone", "bomUTF8", "bomUTF16", "bomUTF32" ];
var t5 = false,
   aS = function () {
      for (var r=[],i=0; i<513; i++) r.push(0);
      return r
   }(),
   aW = 0,
   eF = false,
   Zi = false,
   EF = 0,
   XO = null,
   FO = null,
   rR = null,
   Fy = null,
   ZA = null;
var ZA = null;
var zb = null,
   xx = null;
var xx = null;
var yO = null,
   bm = null,
   cr = undefined,
   hA = null,
   dl = ["","","","","","","","","","","",""],
   Q9 = undefined;
var dl = ["", "default", "ascii", "base64", "hex", "utf8", "utf16", "utf16le", "ucs2", "ucs2le", "binary", "latin1"];
var FV = [[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0]],
   uO = {m9:undefined,kH:undefined,jN:undefined,MQ:undefined,Go:undefined,ub:undefined},
   LG = [0,0,0,0,0,0,0,0,0,0,0],
   d1 = ["","","","","","","","","","",""];
var FV = [[31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]];
var LG = [0, 1, 1, 2, 2, 4, 2, 4, 4, 8, 8];
var d1 = ["Unknown", "Boolean", "Byte", "Char", "Word", "Longword", "Smallint", "int32", "Single", "Double", "String"];
var Xl = function () {
      for (var r=[],i=0; i<257; i++) r.push("");
      return r
   }(),
   qC = function () {
      for (var r=[],i=0; i<257; i++) r.push(0);
      return r
   }(),
   tl = "";
var tl = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+\/";
var fK = null;
uO.m9 = typeof(true);
uO.kH = typeof(0);
uO.jN = typeof("");
uO.MQ = typeof(i.ho());
uO.Go = typeof(undefined);
uO.ub = typeof(function () {
   /* null */
});
if (!Uint8Array.prototype.fill) {
      Uint8Array.prototype.fill = Array.prototype.fill;
    }
;
ZC.kk(yj(),cj);
QK();
ZC.kk(yj(),Md);
Ys();
var cr = require("events");
var main = function() {
   try {
      FO = TObject.Create($New(Im));
      Im.Yr(FO);
   } catch ($e) {
      var vw = $W($e);
      m(vw.FMessage)   }
}
main();
