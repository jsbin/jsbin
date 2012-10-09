var zen_editor = (function(){
/**
 * Zen Coding settings
 * @author Sergey Chikuyonok (serge.che@gmail.com)
 * @link http://chikuyonok.ru
 */
var zen_settings = {
  /** 
   * Variables that can be placed inside snippets or abbreviations as ${variable}
   * ${child} variable is reserved, don't use it 
   */
  'variables': {
    'lang': 'en',
    'locale': 'en-US',
    'charset': 'UTF-8',
    
    /** Inner element indentation */
    'indentation': '\t',
    
    // newline variables, useful for wrapping
    'newline': '\n',
    'nl': '\n'
  },
  
  'css': {
    'filters': 'html,css',
    'snippets': {
      "@i": "@import url(|);",
      "@m": "@media print {\n\t|\n}",
      "@f": "@font-face {\n\tfont-family:|;\n\tsrc:url(|);\n}",
      "!": "!important",
      "pos": "position:|;",
      "pos:s": "position:static;",
      "pos:a": "position:absolute;",
      "pos:r": "position:relative;",
      "pos:f": "position:fixed;",
      "t": "top:|;",
      "t:a": "top:auto;",
      "r": "right:|;",
      "r:a": "right:auto;",
      "b": "bottom:|;",
      "b:a": "bottom:auto;",
      "brad": "-webkit-border-radius: ${1:radius};\n-moz-border-radius: $1;\n-ms-border-radius: $1;\nborder-radius: $1;",
      "bsha": "-webkit-box-shadow: ${1:hoff} ${2:voff} ${3:blur} ${4:rgba(0,0,0,0.5)};\n-moz-box-shadow: $1 $2 $3 $4;\n-ms-box-shadow: $1 $2 $3 $4;\nbox-shadow: $1 $2 $3 $4;",
      "l": "left:|;",
      "l:a": "left:auto;",
      "z": "z-index:|;",
      "z:a": "z-index:auto;",
      "fl": "float:|;",
      "fl:n": "float:none;",
      "fl:l": "float:left;",
      "fl:r": "float:right;",
      "cl": "clear:|;",
      "cl:n": "clear:none;",
      "cl:l": "clear:left;",
      "cl:r": "clear:right;",
      "cl:b": "clear:both;",
      "d": "display:|;",
      "d:n": "display:none;",
      "d:b": "display:block;",
      "d:i": "display:inline;",
      "d:ib": "display:inline-block;",
      "d:li": "display:list-item;",
      "d:ri": "display:run-in;",
      "d:cp": "display:compact;",
      "d:tb": "display:table;",
      "d:itb": "display:inline-table;",
      "d:tbcp": "display:table-caption;",
      "d:tbcl": "display:table-column;",
      "d:tbclg": "display:table-column-group;",
      "d:tbhg": "display:table-header-group;",
      "d:tbfg": "display:table-footer-group;",
      "d:tbr": "display:table-row;",
      "d:tbrg": "display:table-row-group;",
      "d:tbc": "display:table-cell;",
      "d:rb": "display:ruby;",
      "d:rbb": "display:ruby-base;",
      "d:rbbg": "display:ruby-base-group;",
      "d:rbt": "display:ruby-text;",
      "d:rbtg": "display:ruby-text-group;",
      "v": "visibility:|;",
      "v:v": "visibility:visible;",
      "v:h": "visibility:hidden;",
      "v:c": "visibility:collapse;",
      "ov": "overflow:|;",
      "ov:v": "overflow:visible;",
      "ov:h": "overflow:hidden;",
      "ov:s": "overflow:scroll;",
      "ov:a": "overflow:auto;",
      "ovx": "overflow-x:|;",
      "ovx:v": "overflow-x:visible;",
      "ovx:h": "overflow-x:hidden;",
      "ovx:s": "overflow-x:scroll;",
      "ovx:a": "overflow-x:auto;",
      "ovy": "overflow-y:|;",
      "ovy:v": "overflow-y:visible;",
      "ovy:h": "overflow-y:hidden;",
      "ovy:s": "overflow-y:scroll;",
      "ovy:a": "overflow-y:auto;",
      "ovs": "overflow-style:|;",
      "ovs:a": "overflow-style:auto;",
      "ovs:s": "overflow-style:scrollbar;",
      "ovs:p": "overflow-style:panner;",
      "ovs:m": "overflow-style:move;",
      "ovs:mq": "overflow-style:marquee;",
      "zoo": "zoom:1;",
      "cp": "clip:|;",
      "cp:a": "clip:auto;",
      "cp:r": "clip:rect(|);",
      "bxz": "box-sizing:|;",
      "bxz:cb": "box-sizing:content-box;",
      "bxz:bb": "box-sizing:border-box;",
      "bxsh": "box-shadow:|;",
      "bxsh:n": "box-shadow:none;",
      "bxsh:w": "-webkit-box-shadow:0 0 0 #000;",
      "bxsh:m": "-moz-box-shadow:0 0 0 0 #000;",
      "m": "margin:|;",
      "m:a": "margin:auto;",
      "m:0": "margin:0;",
      "m:2": "margin:0 0;",
      "m:3": "margin:0 0 0;",
      "m:4": "margin:0 0 0 0;",
      "mt": "margin-top:|;",
      "mt:a": "margin-top:auto;",
      "mr": "margin-right:|;",
      "mr:a": "margin-right:auto;",
      "mb": "margin-bottom:|;",
      "mb:a": "margin-bottom:auto;",
      "ml": "margin-left:|;",
      "ml:a": "margin-left:auto;",
      "p": "padding:|;",
      "p:0": "padding:0;",
      "p:2": "padding:0 0;",
      "p:3": "padding:0 0 0;",
      "p:4": "padding:0 0 0 0;",
      "pt": "padding-top:|;",
      "pr": "padding-right:|;",
      "pb": "padding-bottom:|;",
      "pl": "padding-left:|;",
      "w": "width:|;",
      "w:a": "width:auto;",
      "h": "height:|;",
      "h:a": "height:auto;",
      "maw": "max-width:|;",
      "maw:n": "max-width:none;",
      "mah": "max-height:|;",
      "mah:n": "max-height:none;",
      "miw": "min-width:|;",
      "mih": "min-height:|;",
      "o": "outline:|;",
      "o:n": "outline:none;",
      "oo": "outline-offset:|;",
      "ow": "outline-width:|;",
      "os": "outline-style:|;",
      "oc": "outline-color:#000;",
      "oc:i": "outline-color:invert;",
      "bd": "border:|;",
      "bd+": "border:1px solid #000;",
      "bd:n": "border:none;",
      "bdbk": "border-break:|;",
      "bdbk:c": "border-break:close;",
      "bdcl": "border-collapse:|;",
      "bdcl:c": "border-collapse:collapse;",
      "bdcl:s": "border-collapse:separate;",
      "bdc": "border-color:#000;",
      "bdi": "border-image:url(|);",
      "bdi:n": "border-image:none;",
      "bdi:w": "-webkit-border-image:url(|) 0 0 0 0 stretch stretch;",
      "bdi:m": "-moz-border-image:url(|) 0 0 0 0 stretch stretch;",
      "bdti": "border-top-image:url(|);",
      "bdti:n": "border-top-image:none;",
      "bdri": "border-right-image:url(|);",
      "bdri:n": "border-right-image:none;",
      "bdbi": "border-bottom-image:url(|);",
      "bdbi:n": "border-bottom-image:none;",
      "bdli": "border-left-image:url(|);",
      "bdli:n": "border-left-image:none;",
      "bdci": "border-corner-image:url(|);",
      "bdci:n": "border-corner-image:none;",
      "bdci:c": "border-corner-image:continue;",
      "bdtli": "border-top-left-image:url(|);",
      "bdtli:n": "border-top-left-image:none;",
      "bdtli:c": "border-top-left-image:continue;",
      "bdtri": "border-top-right-image:url(|);",
      "bdtri:n": "border-top-right-image:none;",
      "bdtri:c": "border-top-right-image:continue;",
      "bdbri": "border-bottom-right-image:url(|);",
      "bdbri:n": "border-bottom-right-image:none;",
      "bdbri:c": "border-bottom-right-image:continue;",
      "bdbli": "border-bottom-left-image:url(|);",
      "bdbli:n": "border-bottom-left-image:none;",
      "bdbli:c": "border-bottom-left-image:continue;",
      "bdf": "border-fit:|;",
      "bdf:c": "border-fit:clip;",
      "bdf:r": "border-fit:repeat;",
      "bdf:sc": "border-fit:scale;",
      "bdf:st": "border-fit:stretch;",
      "bdf:ow": "border-fit:overwrite;",
      "bdf:of": "border-fit:overflow;",
      "bdf:sp": "border-fit:space;",
      "bdl": "border-length:|;",
      "bdl:a": "border-length:auto;",
      "bdsp": "border-spacing:|;",
      "bds": "border-style:|;",
      "bds:n": "border-style:none;",
      "bds:h": "border-style:hidden;",
      "bds:dt": "border-style:dotted;",
      "bds:ds": "border-style:dashed;",
      "bds:s": "border-style:solid;",
      "bds:db": "border-style:double;",
      "bds:dtds": "border-style:dot-dash;",
      "bds:dtdtds": "border-style:dot-dot-dash;",
      "bds:w": "border-style:wave;",
      "bds:g": "border-style:groove;",
      "bds:r": "border-style:ridge;",
      "bds:i": "border-style:inset;",
      "bds:o": "border-style:outset;",
      "bdw": "border-width:|;",
      "bdt": "border-top:|;",
      "bdt+": "border-top:1px solid #000;",
      "bdt:n": "border-top:none;",
      "bdtw": "border-top-width:|;",
      "bdts": "border-top-style:|;",
      "bdts:n": "border-top-style:none;",
      "bdtc": "border-top-color:#000;",
      "bdr": "border-right:|;",
      "bdr+": "border-right:1px solid #000;",
      "bdr:n": "border-right:none;",
      "bdrw": "border-right-width:|;",
      "bdrs": "border-right-style:|;",
      "bdrs:n": "border-right-style:none;",
      "bdrc": "border-right-color:#000;",
      "bdb": "border-bottom:|;",
      "bdb+": "border-bottom:1px solid #000;",
      "bdb:n": "border-bottom:none;",
      "bdbw": "border-bottom-width:|;",
      "bdbs": "border-bottom-style:|;",
      "bdbs:n": "border-bottom-style:none;",
      "bdbc": "border-bottom-color:#000;",
      "bdl": "border-left:|;",
      "bdl+": "border-left:1px solid #000;",
      "bdl:n": "border-left:none;",
      "bdlw": "border-left-width:|;",
      "bdls": "border-left-style:|;",
      "bdls:n": "border-left-style:none;",
      "bdlc": "border-left-color:#000;",
      "bdrs": "border-radius:|;",
      "bdtrrs": "border-top-right-radius:|;",
      "bdtlrs": "border-top-left-radius:|;",
      "bdbrrs": "border-bottom-right-radius:|;",
      "bdblrs": "border-bottom-left-radius:|;",
      "bg": "background:|;",
      "bg+": "background:#FFF url(|) 0 0 no-repeat;",
      "bg:n": "background:none;",
      "bg:ie": "filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='${1:x}.png',sizingMethod='${2:crop}');",
      "bgc": "background-color:#FFF;",
      "bgi": "background-image:url(|);",
      "bgi:n": "background-image:none;",
      "bgr": "background-repeat:|;",
      "bgr:n": "background-repeat:no-repeat;",
      "bgr:x": "background-repeat:repeat-x;",
      "bgr:y": "background-repeat:repeat-y;",
      "bga": "background-attachment:|;",
      "bga:f": "background-attachment:fixed;",
      "bga:s": "background-attachment:scroll;",
      "bgp": "background-position:0 0;",
      "bgpx": "background-position-x:|;",
      "bgpy": "background-position-y:|;",
      "bgbk": "background-break:|;",
      "bgbk:bb": "background-break:bounding-box;",
      "bgbk:eb": "background-break:each-box;",
      "bgbk:c": "background-break:continuous;",
      "bgcp": "background-clip:|;",
      "bgcp:bb": "background-clip:border-box;",
      "bgcp:pb": "background-clip:padding-box;",
      "bgcp:cb": "background-clip:content-box;",
      "bgcp:nc": "background-clip:no-clip;",
      "bgo": "background-origin:|;",
      "bgo:pb": "background-origin:padding-box;",
      "bgo:bb": "background-origin:border-box;",
      "bgo:cb": "background-origin:content-box;",
      "bgz": "background-size:|;",
      "bgz:a": "background-size:auto;",
      "bgz:ct": "background-size:contain;",
      "bgz:cv": "background-size:cover;",
      "c": "color:#000;",
      "tbl": "table-layout:|;",
      "tbl:a": "table-layout:auto;",
      "tbl:f": "table-layout:fixed;",
      "cps": "caption-side:|;",
      "cps:t": "caption-side:top;",
      "cps:b": "caption-side:bottom;",
      "ec": "empty-cells:|;",
      "ec:s": "empty-cells:show;",
      "ec:h": "empty-cells:hide;",
      "lis": "list-style:|;",
      "lis:n": "list-style:none;",
      "lisp": "list-style-position:|;",
      "lisp:i": "list-style-position:inside;",
      "lisp:o": "list-style-position:outside;",
      "list": "list-style-type:|;",
      "list:n": "list-style-type:none;",
      "list:d": "list-style-type:disc;",
      "list:c": "list-style-type:circle;",
      "list:s": "list-style-type:square;",
      "list:dc": "list-style-type:decimal;",
      "list:dclz": "list-style-type:decimal-leading-zero;",
      "list:lr": "list-style-type:lower-roman;",
      "list:ur": "list-style-type:upper-roman;",
      "lisi": "list-style-image:|;",
      "lisi:n": "list-style-image:none;",
      "q": "quotes:|;",
      "q:n": "quotes:none;",
      "q:ru": "quotes:'\00AB' '\00BB' '\201E' '\201C';",
      "q:en": "quotes:'\201C' '\201D' '\2018' '\2019';",
      "ct": "content:|;",
      "ct:n": "content:normal;",
      "ct:oq": "content:open-quote;",
      "ct:noq": "content:no-open-quote;",
      "ct:cq": "content:close-quote;",
      "ct:ncq": "content:no-close-quote;",
      "ct:a": "content:attr(|);",
      "ct:c": "content:counter(|);",
      "ct:cs": "content:counters(|);",
      "coi": "counter-increment:|;",
      "cor": "counter-reset:|;",
      "va": "vertical-align:|;",
      "va:sup": "vertical-align:super;",
      "va:t": "vertical-align:top;",
      "va:tt": "vertical-align:text-top;",
      "va:m": "vertical-align:middle;",
      "va:bl": "vertical-align:baseline;",
      "va:b": "vertical-align:bottom;",
      "va:tb": "vertical-align:text-bottom;",
      "va:sub": "vertical-align:sub;",
      "ta": "text-align:|;",
      "ta:l": "text-align:left;",
      "ta:c": "text-align:center;",
      "ta:r": "text-align:right;",
      "tal": "text-align-last:|;",
      "tal:a": "text-align-last:auto;",
      "tal:l": "text-align-last:left;",
      "tal:c": "text-align-last:center;",
      "tal:r": "text-align-last:right;",
      "td": "text-decoration:|;",
      "td:n": "text-decoration:none;",
      "td:u": "text-decoration:underline;",
      "td:o": "text-decoration:overline;",
      "td:l": "text-decoration:line-through;",
      "te": "text-emphasis:|;",
      "te:n": "text-emphasis:none;",
      "te:ac": "text-emphasis:accent;",
      "te:dt": "text-emphasis:dot;",
      "te:c": "text-emphasis:circle;",
      "te:ds": "text-emphasis:disc;",
      "te:b": "text-emphasis:before;",
      "te:a": "text-emphasis:after;",
      "th": "text-height:|;",
      "th:a": "text-height:auto;",
      "th:f": "text-height:font-size;",
      "th:t": "text-height:text-size;",
      "th:m": "text-height:max-size;",
      "ti": "text-indent:|;",
      "ti:-": "text-indent:-9999px;",
      "tj": "text-justify:|;",
      "tj:a": "text-justify:auto;",
      "tj:iw": "text-justify:inter-word;",
      "tj:ii": "text-justify:inter-ideograph;",
      "tj:ic": "text-justify:inter-cluster;",
      "tj:d": "text-justify:distribute;",
      "tj:k": "text-justify:kashida;",
      "tj:t": "text-justify:tibetan;",
      "to": "text-outline:|;",
      "to+": "text-outline:0 0 #000;",
      "to:n": "text-outline:none;",
      "tr": "text-replace:|;",
      "tr:n": "text-replace:none;",
      "tt": "text-transform:|;",
      "tt:n": "text-transform:none;",
      "tt:c": "text-transform:capitalize;",
      "tt:u": "text-transform:uppercase;",
      "tt:l": "text-transform:lowercase;",
      "tw": "text-wrap:|;",
      "tw:n": "text-wrap:normal;",
      "tw:no": "text-wrap:none;",
      "tw:u": "text-wrap:unrestricted;",
      "tw:s": "text-wrap:suppress;",
      "tsh": "text-shadow:|;",
      "tsh+": "text-shadow:0 0 0 #000;",
      "tsh:n": "text-shadow:none;",
      "lh": "line-height:|;",
      "whs": "white-space:|;",
      "whs:n": "white-space:normal;",
      "whs:p": "white-space:pre;",
      "whs:nw": "white-space:nowrap;",
      "whs:pw": "white-space:pre-wrap;",
      "whs:pl": "white-space:pre-line;",
      "whsc": "white-space-collapse:|;",
      "whsc:n": "white-space-collapse:normal;",
      "whsc:k": "white-space-collapse:keep-all;",
      "whsc:l": "white-space-collapse:loose;",
      "whsc:bs": "white-space-collapse:break-strict;",
      "whsc:ba": "white-space-collapse:break-all;",
      "wob": "word-break:|;",
      "wob:n": "word-break:normal;",
      "wob:k": "word-break:keep-all;",
      "wob:l": "word-break:loose;",
      "wob:bs": "word-break:break-strict;",
      "wob:ba": "word-break:break-all;",
      "wos": "word-spacing:|;",
      "wow": "word-wrap:|;",
      "wow:nm": "word-wrap:normal;",
      "wow:n": "word-wrap:none;",
      "wow:u": "word-wrap:unrestricted;",
      "wow:s": "word-wrap:suppress;",
      "lts": "letter-spacing:|;",
      "f": "font:|;",
      "f+": "font:1em Arial,sans-serif;",
      "fw": "font-weight:|;",
      "fw:n": "font-weight:normal;",
      "fw:b": "font-weight:bold;",
      "fw:br": "font-weight:bolder;",
      "fw:lr": "font-weight:lighter;",
      "fs": "font-style:|;",
      "fs:n": "font-style:normal;",
      "fs:i": "font-style:italic;",
      "fs:o": "font-style:oblique;",
      "fv": "font-variant:|;",
      "fv:n": "font-variant:normal;",
      "fv:sc": "font-variant:small-caps;",
      "fz": "font-size:|;",
      "fza": "font-size-adjust:|;",
      "fza:n": "font-size-adjust:none;",
      "ff": "font-family:|;",
      "ff:s": "font-family:serif;",
      "ff:ss": "font-family:sans-serif;",
      "ff:c": "font-family:cursive;",
      "ff:f": "font-family:fantasy;",
      "ff:m": "font-family:monospace;",
      "fef": "font-effect:|;",
      "fef:n": "font-effect:none;",
      "fef:eg": "font-effect:engrave;",
      "fef:eb": "font-effect:emboss;",
      "fef:o": "font-effect:outline;",
      "fem": "font-emphasize:|;",
      "femp": "font-emphasize-position:|;",
      "femp:b": "font-emphasize-position:before;",
      "femp:a": "font-emphasize-position:after;",
      "fems": "font-emphasize-style:|;",
      "fems:n": "font-emphasize-style:none;",
      "fems:ac": "font-emphasize-style:accent;",
      "fems:dt": "font-emphasize-style:dot;",
      "fems:c": "font-emphasize-style:circle;",
      "fems:ds": "font-emphasize-style:disc;",
      "fsm": "font-smooth:|;",
      "fsm:a": "font-smooth:auto;",
      "fsm:n": "font-smooth:never;",
      "fsm:aw": "font-smooth:always;",
      "fst": "font-stretch:|;",
      "fst:n": "font-stretch:normal;",
      "fst:uc": "font-stretch:ultra-condensed;",
      "fst:ec": "font-stretch:extra-condensed;",
      "fst:c": "font-stretch:condensed;",
      "fst:sc": "font-stretch:semi-condensed;",
      "fst:se": "font-stretch:semi-expanded;",
      "fst:e": "font-stretch:expanded;",
      "fst:ee": "font-stretch:extra-expanded;",
      "fst:ue": "font-stretch:ultra-expanded;",
      "op": "opacity:|;",
      "op:ie": "filter:progid:DXImageTransform.Microsoft.Alpha(Opacity=100);",
      "op:ms": "-ms-filter:'progid:DXImageTransform.Microsoft.Alpha(Opacity=100)';",
      "rz": "resize:|;",
      "rz:n": "resize:none;",
      "rz:b": "resize:both;",
      "rz:h": "resize:horizontal;",
      "rz:v": "resize:vertical;",
      "cur": "cursor:|;",
      "cur:a": "cursor:auto;",
      "cur:d": "cursor:default;",
      "cur:c": "cursor:crosshair;",
      "cur:ha": "cursor:hand;",
      "cur:he": "cursor:help;",
      "cur:m": "cursor:move;",
      "cur:p": "cursor:pointer;",
      "cur:t": "cursor:text;",
      "pgbb": "page-break-before:|;",
      "pgbb:au": "page-break-before:auto;",
      "pgbb:al": "page-break-before:always;",
      "pgbb:l": "page-break-before:left;",
      "pgbb:r": "page-break-before:right;",
      "pgbi": "page-break-inside:|;",
      "pgbi:au": "page-break-inside:auto;",
      "pgbi:av": "page-break-inside:avoid;",
      "pgba": "page-break-after:|;",
      "pgba:au": "page-break-after:auto;",
      "pgba:al": "page-break-after:always;",
      "pgba:l": "page-break-after:left;",
      "pgba:r": "page-break-after:right;",
      "orp": "orphans:|;",
      "wid": "widows:|;"
    }
  },
  
  'html': {
    'filters': 'html',
    'snippets': {
      'cc:ie6': '<!--[if lte IE 6]>\n\t${child}|\n<![endif]-->',
      'cc:ie': '<!--[if IE]>\n\t${child}|\n<![endif]-->',
      'cc:noie': '<!--[if !IE]><!-->\n\t${child}|\n<!--<![endif]-->',
      'html:4t': '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">\n' +
          '<html lang="${lang}">\n' +
          '<head>\n' +
          ' <meta http-equiv="Content-Type" content="text/html;charset=${charset}">\n' +
          ' <title></title>\n' +
          '</head>\n' +
          '<body>\n\t${child}|\n</body>\n' +
          '</html>',
      
      'html:4s': '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">\n' +
          '<html lang="${lang}">\n' +
          '<head>\n' +
          ' <meta http-equiv="Content-Type" content="text/html;charset=${charset}">\n' +
          ' <title></title>\n' +
          '</head>\n' +
          '<body>\n\t${child}|\n</body>\n' +
          '</html>',
      
      'html:xt': '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\n' +
          '<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="${lang}">\n' +
          '<head>\n' +
          ' <meta http-equiv="Content-Type" content="text/html;charset=${charset}" />\n' +
          ' <title></title>\n' +
          '</head>\n' +
          '<body>\n\t${child}|\n</body>\n' +
          '</html>',
      
      'html:xs': '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">\n' +
          '<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="${lang}">\n' +
          '<head>\n' +
          ' <meta http-equiv="Content-Type" content="text/html;charset=${charset}" />\n' +
          ' <title></title>\n' +
          '</head>\n' +
          '<body>\n\t${child}|\n</body>\n' +
          '</html>',
      
      'html:xxs': '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">\n' +
          '<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="${lang}">\n' +
          '<head>\n' +
          ' <meta http-equiv="Content-Type" content="text/html;charset=${charset}" />\n' +
          ' <title></title>\n' +
          '</head>\n' +
          '<body>\n\t${child}|\n</body>\n' +
          '</html>',
      
      'html:5': '<!DOCTYPE HTML>\n' +
          '<html lang="${lang}">\n' +
          '<head>\n' +
          ' <meta charset="${charset}">\n' +
          ' <title></title>\n' +
          '</head>\n' +
          '<body>\n\t${child}|\n</body>\n' +
          '</html>'
    },
    
    'abbreviations': {
      'a': '<a href="">',
      'a:link': '<a href="http://|">',
      'a:mail': '<a href="mailto:|">',
      'abbr': '<abbr title="">',
      'acronym': '<acronym title="">',
      'base': '<base href="" />',
      'bdo': '<bdo dir="">',
      'bdo:r': '<bdo dir="rtl">',
      'bdo:l': '<bdo dir="ltr">',
      'link:css': '<link rel="stylesheet" type="text/css" href="${1:style}.css" media="all" />',
      'link:print': '<link rel="stylesheet" type="text/css" href="|print.css" media="print" />',
      'link:favicon': '<link rel="shortcut icon" type="image/x-icon" href="|favicon.ico" />',
      'link:touch': '<link rel="apple-touch-icon" href="|favicon.png" />',
      'link:rss': '<link rel="alternate" type="application/rss+xml" title="RSS" href="|rss.xml" />',
      'link:atom': '<link rel="alternate" type="application/atom+xml" title="Atom" href="atom.xml" />',
      'meta:utf': '<meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />',
      'meta:win': '<meta http-equiv="Content-Type" content="text/html;charset=windows-1251" />',
      'meta:compat': '<meta http-equiv="X-UA-Compatible" content="IE=7" />',
      'style': '<style type="text/css">',
      'script': '<script type="text/javascript">',
      'script:src': '<script type="text/javascript" src="">',
      'img': '<img src="" alt="" />',
      'iframe': '<iframe src="" frameborder="0">',
      'embed': '<embed src="" type="" />',
      'object': '<object data="" type="">',
      'param': '<param name="" value="" />',
      'map': '<map name="">',
      'area': '<area shape="" coords="" href="" alt="" />',
      'area:d': '<area shape="default" href="" alt="" />',
      'area:c': '<area shape="circle" coords="" href="" alt="" />',
      'area:r': '<area shape="rect" coords="" href="" alt="" />',
      'area:p': '<area shape="poly" coords="" href="" alt="" />',
      'link': '<link rel="stylesheet" href="" />',
      'form': '<form action="">',
      'form:get': '<form action="" method="get">',
      'form:post': '<form action="" method="post">',
      'label': '<label for="">',
      'input': '<input type="" />',
      'input:hidden': '<input type="hidden" name="" />',
      'input:h': '<input type="hidden" name="" />',
      'input:text': '<input type="text" name="" id="" />',
      'input:t': '<input type="text" name="" id="" />',
      'input:search': '<input type="search" name="" id="" />',
      'input:email': '<input type="email" name="" id="" />',
      'input:url': '<input type="url" name="" id="" />',
      'input:password': '<input type="password" name="" id="" />',
      'input:p': '<input type="password" name="" id="" />',
      'input:datetime': '<input type="datetime" name="" id="" />',
      'input:date': '<input type="date" name="" id="" />',
      'input:datetime-local': '<input type="datetime-local" name="" id="" />',
      'input:month': '<input type="month" name="" id="" />',
      'input:week': '<input type="week" name="" id="" />',
      'input:time': '<input type="time" name="" id="" />',
      'input:number': '<input type="number" name="" id="" />',
      'input:color': '<input type="color" name="" id="" />',
      'input:checkbox': '<input type="checkbox" name="" id="" />',
      'input:c': '<input type="checkbox" name="" id="" />',
      'input:radio': '<input type="radio" name="" id="" />',
      'input:r': '<input type="radio" name="" id="" />',
      'input:range': '<input type="range" name="" id="" />',
      'input:file': '<input type="file" name="" id="" />',
      'input:f': '<input type="file" name="" id="" />',
      'input:submit': '<input type="submit" value="" />',
      'input:s': '<input type="submit" value="" />',
      'input:image': '<input type="image" src="" alt="" />',
      'input:i': '<input type="image" src="" alt="" />',
      'input:reset': '<input type="reset" value="" />',
      'input:button': '<input type="button" value="" />',
      'input:b': '<input type="button" value="" />',
      'select': '<select name="" id=""></select>',
      'option': '<option value=""></option>',
      'textarea': '<textarea name="" id="" cols="30" rows="10">',
      'menu:context': '<menu type="context">',
      'menu:c': '<menu type="context">',
      'menu:toolbar': '<menu type="toolbar">',
      'menu:t': '<menu type="toolbar">',
      'video': '<video src="">',
      'audio': '<audio src="">',
      'html:xml': '<html xmlns="http://www.w3.org/1999/xhtml">',
      'bq': '<blockquote>',
      'acr': '<acronym>',
      'fig': '<figure>',
      'ifr': '<iframe>',
      'emb': '<embed>',
      'obj': '<object>',
      'src': '<source>',
      'cap': '<caption>',
      'colg': '<colgroup>',
      'fst': '<fieldset>',
      'btn': '<button>',
      'optg': '<optgroup>',
      'opt': '<option>',
      'tarea': '<textarea>',
      'leg': '<legend>',
      'sect': '<section>',
      'art': '<article>',
      'hdr': '<header>',
      'ftr': '<footer>',
      'adr': '<address>',
      'dlg': '<dialog>',
      'str': '<strong>',
      'prog': '<progress>',
      'fset': '<fieldset>',
      'datag': '<datagrid>',
      'datal': '<datalist>',
      'kg': '<keygen>',
      'out': '<output>',
      'det': '<details>',
      'cmd': '<command>',
      
      // expandos
      'ol+': 'ol>li',
      'ul+': 'ul>li',
      'dl+': 'dl>dt+dd',
      'map+': 'map>area',
      'table+': 'table>tr>td',
      'colgroup+': 'colgroup>col',
      'colg+': 'colgroup>col',
      'tr+': 'tr>td',
      'select+': 'select>option',
      'optgroup+': 'optgroup>option',
      'optg+': 'optgroup>option'

    },
    
    'element_types': {
      'empty': 'area,base,basefont,br,col,frame,hr,img,input,isindex,link,meta,param,embed,keygen,command',
      'block_level': 'address,applet,blockquote,button,center,dd,del,dir,div,dl,dt,fieldset,form,frameset,hr,iframe,ins,isindex,li,link,map,menu,noframes,noscript,object,ol,p,pre,script,table,tbody,td,tfoot,th,thead,tr,ul,h1,h2,h3,h4,h5,h6',
      'inline_level': 'a,abbr,acronym,applet,b,basefont,bdo,big,br,button,cite,code,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,select,small,span,strike,strong,sub,sup,textarea,tt,u,var'
    }
  },
  
  'xml': {
    'extends': 'html',
    'filters': 'html'
  },
  
  'xsl': {
    'extends': 'html',
    'filters': 'html, xsl',
    'abbreviations': {
      'tm': '<xsl:template match="" mode="">',
      'tmatch': 'tm',
      'tn': '<xsl:template name="">',
      'tname': 'tn',
      'xsl:when': '<xsl:when test="">',
      'wh': 'xsl:when',
      'var': '<xsl:variable name="">',
      'vare': '<xsl:variable name="" select=""/>',
      'if': '<xsl:if test="">',
      'call': '<xsl:call-template name=""/>',
      'attr': '<xsl:attribute name="">',
      'wp': '<xsl:with-param name="" select=""/>',
      'par': '<xsl:param name="" select=""/>',
      'val': '<xsl:value-of select=""/>',
      'co': '<xsl:copy-of select=""/>',
      'each': '<xsl:for-each select="">',
      'for': 'each',
      'ap': '<xsl:apply-templates select="" mode=""/>',
      
      //expandos
      'choose+': 'xsl:choose>xsl:when+xsl:otherwise'
    }
  },
  
  'haml': {
    'filters': 'haml',
    'extends': 'html'
  }
};/**
 * Parsed resources (snippets, abbreviations, variables, etc.) for Zen Coding.
 * Contains convenient method to get access for snippets with respect of 
 * inheritance. Also provides abilitity to store data in different vocabularies
 * ('system' and 'user') for fast and safe resurce update
 * @author Sergey Chikuyonok (serge.che@gmail.com)
 * @link http://chikuyonok.ru
 */
var zen_resources = (function(){
  var TYPE_ABBREVIATION = 'zen-tag',
    TYPE_EXPANDO = 'zen-expando',
  
    /** Reference to another abbreviation or tag */
    TYPE_REFERENCE = 'zen-reference',
    
    VOC_SYSTEM = 'system',
    VOC_USER = 'user',
    
    /** Regular expression for XML tag matching */
    re_tag = /^<(\w+\:?[\w\-]*)((?:\s+[\w\:\-]+\s*=\s*(['"]).*?\3)*)\s*(\/?)>/,
    re_attrs = /([\w\-]+)\s*=\s*(['"])(.*?)\2/g,
    
    system_settings = {},
    user_settings = {};
    
  /**
   * Trim whitespace from string
   * @param {String} text
   * @return {String}
   */
  function trim(text) {
    return (text || "").replace( /^\s+|\s+$/g, "" );
  }
    
  /**
   * Check if specified resource is parsed by Zen Coding
   * @param {Object} obj
   * @return {Boolean}
   */
  function isParsed(obj) {
    return obj && obj.__zen_parsed__;
  }
  
  /**
   * Marks object as parsed by Zen Coding
   * @param {Object}
   */
  function setParsed(obj) {
    obj.__zen_parsed__ = true;
  }
  
  /**
   * Returns resource vocabulary by its name
   * @param {String} name Vocabulary name ('system' or 'user')
   */
  function getVocabulary(name) {
    return name == VOC_SYSTEM ? system_settings : user_settings;
  }
    
  /**
   * Helper function that transforms string into hash
   * @return {Object}
   */
  function stringToHash(str){
    var obj = {}, items = str.split(",");
    for ( var i = 0; i < items.length; i++ )
      obj[ items[i] ] = true;
    return obj;
  }
  
  /**
   * Creates resource inheritance chain for lookups
   * @param {String} vocabulary Resource vocabulary
   * @param {String} syntax Syntax name
   * @param {String} name Resource name
   * @return {Array}
   */
  function createResourceChain(vocabulary, syntax, name) {
    var voc = getVocabulary(vocabulary),
      result = [],
      resource;
    
    if (voc && syntax in voc) {
      resource = voc[syntax];
      if (name in resource)
        result.push(resource[name]);
    }
    
    // get inheritance definition
    // in case of user-defined vocabulary, resource dependency
    // may be defined in system vocabulary only, so we have to correctly
    // handle this case
    var chain_source;
    if (resource && 'extends' in resource)
      chain_source = resource;
    else if (vocabulary == VOC_USER && syntax in system_settings 
      && 'extends' in system_settings[syntax] )
      chain_source = system_settings[syntax];
      
    if (chain_source) {
      if (!isParsed(chain_source['extends'])) {
        var ar = chain_source['extends'].split(',');
        for (var i = 0; i < ar.length; i++) 
          ar[i] = trim(ar[i]);
        chain_source['extends'] = ar;
        setParsed(chain_source['extends']);
      }
      
      // find resource in ancestors
      for (var i = 0; i < chain_source['extends'].length; i++) {
        var type = chain_source['extends'][i];
        if (voc[type] && voc[type][name])
          result.push(voc[type][name]);
      }
    }
    
    return result;
  }
  
  /**
   * Get resource collection from settings vocbulary for specified syntax. 
   * It follows inheritance chain if resource wasn't directly found in
   * syntax settings
   * @param {String} vocabulary Resource vocabulary
   * @param {String} syntax Syntax name
   * @param {String} name Resource name
   */
  function getSubset(vocabulary, syntax, name) {
    var chain = createResourceChain(vocabulary, syntax, name);
    return chain[0];
  }
  
  /**
   * Returns parsed item located in specified vocabulary by its syntax and
   * name
   * @param {String} vocabulary Resource vocabulary
   * @param {String} syntax Syntax name
   * @param {String} name Resource name ('abbreviation', 'snippet')
   * @param {String} item Abbreviation or snippet name
   * @return {Object|null}
   */
  function getParsedItem(vocabulary, syntax, name, item) {
    var chain = createResourceChain(vocabulary, syntax, name),
      result = null,
      res;
      
    for (var i = 0, il = chain.length; i < il; i++) {
      res = chain[i];
      if (item in res) {
        if (name == 'abbreviations' && !isParsed(res[item])) {
          // parse abbreviation
          var value = res[item];
          res[item] = parseAbbreviation(item, value);
          res[item].__ref = value;
          setParsed(res[item]);
        }
        
        result = res[item];
        break;
      }
    }
    
    return result;
  }
  
  /**
   * Unified object for parsed data
   */
  function entry(type, key, value) {
    return {
      type: type,
      key: key,
      value: value
    };
  }
  
  /**
   * Make expando from string
   * @param {String} key
   * @param {String} value
   * @return {Object}
   */
  function makeExpando(key, value) {
    return entry(TYPE_EXPANDO, key, value);
  }
  
  /**
   * Make abbreviation from string
   * @param {String} key Abbreviation key
   * @param {String} tag_name Expanded element's tag name
   * @param {String} attrs Expanded element's attributes
   * @param {Boolean} is_empty Is expanded element empty or not
   * @return {Object}
   */
  function makeAbbreviation(key, tag_name, attrs, is_empty) {
    var result = {
      name: tag_name,
      is_empty: !!is_empty
    };
    
    if (attrs) {
      var m;
      result.attributes = [];
      while (m = re_attrs.exec(attrs)) {
        result.attributes.push({
          name: m[1],
          value: m[3]
        });
      }
    }
    
    return entry(TYPE_ABBREVIATION, key, result);
  }
  
  /**
   * Parses single abbreviation
   * @param {String} key Abbreviation name
   * @param {String} value = Abbreviation value
   * @return {Object}
   */
  function parseAbbreviation(key, value) {
    key = trim(key);
    var m;
    if (key.substr(-1) == '+') {
      // this is expando, leave 'value' as is
      return makeExpando(key, value);
    } else if (m = re_tag.exec(value)) {
      return makeAbbreviation(key, m[1], m[2], m[4] == '/');
    } else {
      // assume it's reference to another abbreviation
      return entry(TYPE_REFERENCE, key, value);
    }
  }
  
  return {
    /**
     * Sets new unparsed data for specified settings vocabulary
     * @param {Object} data
     * @param {String} type Vocabulary type ('system' or 'user')
     */
    setVocabulary: function(data, type) {
      if (type == VOC_SYSTEM)
        system_settings = data;
      else
        user_settings = data;
    },
    
    /**
     * Get data from specified vocabulary. Can contain parsed entities
     * @param {String} name Vocabulary type ('system' or 'user')
     * @return {Object}
     */
    getVocabulary: getVocabulary,
    
    /**
     * Returns resource value from data set with respect of inheritance
     * @param {String} syntax Resource syntax (html, css, ...)
     * @param {String} name Resource name ('snippets' or 'abbreviation')
     * @param {String} abbr Abbreviation name
     * @return {Object|null}
     */
    getResource: function(syntax, name, item) {
      return getParsedItem(VOC_USER, syntax, name, item) 
        || getParsedItem(VOC_SYSTEM, syntax, name, item);
    },
    
    /**
     * Returns abbreviation value from data set
     * @param {String} type Resource type (html, css, ...)
     * @param {String} name Abbreviation name
     * @return {Object|null}
     */
    getAbbreviation: function(type, name) {
      return this.getResource(type, 'abbreviations', name) 
        || this.getResource(type, 'abbreviations', name.replace(/\-/g, ':'));
    },
    
    /**
     * Returns snippet value from data set
     * @param {String} type Resource type (html, css, ...)
     * @param {String} name Snippet name
     * @return {Object|null}
     */
    getSnippet: function(type, name) {
      return this.getResource(type, 'snippets', name)
        || this.getResource(type, 'snippets', name.replace(/\-/g, ':'));
    },
    
    /**
     * Returns variable value
     * @return {String}
     */
    getVariable: function(name) {
      return getSubset(VOC_USER, 'variables', name) 
        || getSubset(VOC_SYSTEM, 'variables', name);
    },
    
    /**
     * Returns resource subset from settings vocabulary
     * @param {String} syntax Syntax name
     * @param {String} name Resource name
     * @return {Object}
     */
    getSubset: function(syntax, name) {
      return getSubset(VOC_USER, syntax, name) 
        || getSubset(VOC_SYSTEM, syntax, name);
    },
    
    /**
     * Check if specified item exists in specified resource collection
     * (like 'empty', 'block_level')
     * @param {String} syntax 
     * @param {String} collection Collection name
     * @param {String} item Item name
     */
    isItemInCollection: function(syntax, collection, item) {
      return item in this.getElementsCollection(getVocabulary(VOC_USER)[syntax], collection)
        || item in this.getElementsCollection(getVocabulary(VOC_SYSTEM)[syntax], collection);
    },
    
    /**
     * Returns specified elements collection (like 'empty', 'block_level') from
     * <code>resource</code>. If collections wasn't found, returns empty object
     * @param {Object} resource
     * @param {String} type
     * @return {Object}
     */
    getElementsCollection: function(resource, type) {
      if (resource && resource.element_types) {
        // if it's not parsed yet – do it
        var res = resource.element_types;
        if (!isParsed(res)) {
          for (var p in res) 
            res[p] = stringToHash(res[p]);
            
          setParsed(res);
        }
        return res[type] || {}
      }
      else
        return {};
    },
    
    /**
     * Check if there are resources for specified syntax
     * @param {String} syntax
     * @return {Boolean}
     */
    hasSyntax: function(syntax) {
      return syntax in getVocabulary(VOC_USER) 
        || syntax in getVocabulary(VOC_SYSTEM);
    }
  }
})();

try {
  zen_resources.setVocabulary(zen_settings, 'system');
  zen_resources.setVocabulary(my_zen_settings, 'user');
} catch(e) {}/**
 * Class that parses abbreviation into tree with respect of groups, attributes
 * and text nodes
 * @author Sergey Chikuyonok (serge.che@gmail.com)
 * @link http://chikuyonok.ru
 * 
 * @include "zen_coding.js"
 */
var zen_parser = (function(){
  
  var re_valid_name = /^[\w\d\-_\$\:@!]+\+?$/i;
  
  /**
   * @class
   */
  function TreeNode(parent) {
    this.abbreviation = '';
    /** @type {TreeNode} */
    this.parent = null;
    this.children = [];
    this.count = 1;
    this.name = null;
    this.text = null;
    this.attributes = [];
    this.is_repeating = false;
    this.has_implict_name = false;
  }
  
  TreeNode.prototype = {
    /**
     * Adds passed or creates new child
     * @param {TreeNode} [child]
     * @return {TreeNode}
     */
    addChild: function(child) {
      child = child || new TreeNode;
      child.parent = this;
      this.children.push(child);
      return child;
    },
    
    /**
     * Replace current node in parent's child list with another node
     * @param {TreeNode} node
     */
    replace: function(node) {
      if (this.parent) {
        var children = this.parent.children;
        for (var i = 0, il = children.length; i < il; i++) {
          if (children[i] === this) {
            children[i] = node;
            this.parent = null;
            return;
          }
        }
      }
    },
    
    /**
     * Sets abbreviation that belongs to current node
     * @param {String} abbr
     */
    setAbbreviation: function(abbr) {
      this.abbreviation = abbr;
      var m = abbr.match(/\*(\d+)?$/);
      if (m) {
        this.count = parseInt(m[1] || 1, 10);
        this.is_repeating = !m[1];
        abbr = abbr.substr(0, abbr.length - m[0].length);
      }
      
      if (abbr) {
        var name_text = splitExpression(abbr);
        var name = name_text[0];
        if (name_text.length == 2)
          this.text = name_text[1];
          
        if (name) {
          var attr_result = parseAttributes(name);
          this.name = attr_result[0] || 'div';
          this.has_implict_name = !attr_result[0];
          this.attributes = attr_result[1];
        }
      }
      
      // validate name
      if (this.name && !re_valid_name.test(this.name)) {
        throw new Error('InvalidAbbreviation');
      }
    },
    
    /**
     * @return {String}
     */
    getAbbreviation: function() {
      return this.expr;
    },
    
    /**
     * Dump current tree node into a foramtted string
     * @return {String}
     */
    toString: function(level) {
      level = level || 0;
      var output = '(empty)';
      if (this.abbreviation) {
        output = '';
        if (this.name)
          output = this.name;
          
        if (this.text !== null)
          output += (output ? ' ' : '') + '{text: "' + this.text + '"}';
          
        if (this.attributes.length) {
          var attrs = [];
          for (var i = 0, il = this.attributes.length; i < il; i++) {
            attrs.push(this.attributes[i].name + '="' + this.attributes[i].value + '"'); 
          }
          output += ' [' + attrs.join(', ') + ']';
        }
      }
      var result = zen_coding.repeatString('-', level)
        + output 
        + '\n';
      for (var i = 0, il = this.children.length; i < il; i++) {
        result += this.children[i].toString(level + 1);
      }
      
      return result;
    },
    
    /**
     * Check if current node contains children with empty <code>expr</code>
     * property
     * @return {Boolean}
     */
    hasEmptyChildren: function() {
      for (var i = 0, il = this.children.length; i < il; i++) {
        if (this.children[i].isEmpty())
          return true;
      }
      
      return false;
    },
    
    /**
     * @return {Boolean}
     */
    isEmpty: function() {
      return !this.abbreviation;
    },
    
    /**
     * Check if current node is a text-only node
     * @return {Boolean}
     */
    isTextNode: function() {
      return !this.name && this.text;
    }
  };
  
  /**
   * Check if character is numeric
   * @requires {Stirng} ch
   * @return {Boolean}
   */
  function isNumeric(ch) {
    if (typeof(ch) == 'string')
      ch = ch.charCodeAt(0);
      
    return (ch && ch > 47 && ch < 58);
  }
  
  /**
   * Optimizes tree node: replaces empty nodes with their children
   * @param {TreeNode} node
   * @return {TreeNode}
   */
  function squash(node) {
    for (var i = node.children.length - 1; i >=0; i--) {
      /** @type {TreeNode} */
      var n = node.children[i];
      if (n.isEmpty()) {
        var args = [i, 1];
        for (var j = 0, jl = n.children.length; j < jl; j++) {
          args.push(n.children[j]);
        }
        
        Array.prototype.splice.apply(node.children, args);
      }
    }
    
    return node;
  }
  
  /**
   * Trim whitespace from string
   * @param {String} text
   * @return {String}
   */
  function trim(text) {
    return (text || "").replace( /^\s+|\s+$/g, "" );
  }
  
  /**
   * Get word, starting at <code>ix</code> character of <code>str</code>
   */
  function getWord(ix, str) {
    var m = str.substring(ix).match(/^[\w\-:\$]+/);
    return m ? m[0] : '';
  }
  
  /**
   * Extract attributes and their values from attribute set 
   * @param {String} attr_set
   */
  function extractAttributes(attr_set) {
    attr_set = trim(attr_set);
    var loop_count = 100, // endless loop protection
      re_string = /^(["'])((?:(?!\1)[^\\]|\\.)*)\1/,
      result = [],
      attr;
      
    while (attr_set && loop_count--) {
      var attr_name = getWord(0, attr_set);
      attr = null;
      if (attr_name) {
        attr = {name: attr_name, value: ''};
//        result[attr_name] = '';
        // let's see if attribute has value
        var ch = attr_set.charAt(attr_name.length);
        switch (ch) {
          case '=':
            var ch2 = attr_set.charAt(attr_name.length + 1);
            if (ch2 == '"' || ch2 == "'") {
              // we have a quoted string
              var m = attr_set.substring(attr_name.length + 1).match(re_string);
              if (m) {
                attr.value = m[2];
                attr_set = trim(attr_set.substring(attr_name.length + m[0].length + 1));
              } else {
                // something wrong, break loop
                attr_set = '';
              }
            } else {
              // unquoted string
              var m = attr_set.substring(attr_name.length + 1).match(/(.+?)(\s|$)/);
              if (m) {
                attr.value = m[1];
                attr_set = trim(attr_set.substring(attr_name.length + m[1].length + 1));
              } else {
                // something wrong, break loop
                attr_set = '';
              }
            }
            break;
          default:
            attr_set = trim(attr_set.substring(attr_name.length));
            break;
        }
      } else {
        // something wrong, can't extract attribute name
        break;
      }
      
      if (attr) result.push(attr);
    }
    return result;
  }
  
  /**
   * Parses tag attributes extracted from abbreviation
   * @param {String} str
   */
  function parseAttributes(str) {
    /*
     * Example of incoming data:
     * #header
     * .some.data
     * .some.data#header
     * [attr]
     * #item[attr=Hello other="World"].class
     */
    var result = [],
      name = '',
      collect_name = true,
      class_name,
      char_map = {'#': 'id', '.': 'class'};
    
    // walk char-by-char
    var i = 0,
      il = str.length,
      val;
      
    while (i < il) {
      var ch = str.charAt(i);
      switch (ch) {
        case '#': // id
          val = getWord(i, str.substring(1));
          result.push({name: char_map[ch], value: val});
          i += val.length + 1;
          collect_name = false;
          break;
        case '.': // class
          val = getWord(i, str.substring(1));
          if (!class_name) {
            // remember object pointer for value modification
            class_name = {name: char_map[ch], value: ''};
            result.push(class_name);
          }
          
          class_name.value += ((class_name.value) ? ' ' : '') + val;
          i += val.length + 1;
          collect_name = false;
          break;
        case '[': //begin attribute set
          // search for end of set
          var end_ix = str.indexOf(']', i);
          if (end_ix == -1) {
            // invalid attribute set, stop searching
            i = str.length;
          } else {
            var attrs = extractAttributes(str.substring(i + 1, end_ix));
            for (var j = 0, jl = attrs.length; j < jl; j++) {
              result.push(attrs[j]);
            }
            i = end_ix;
          }
          collect_name = false;
          break;
        default:
          if (collect_name)
            name += ch;
          i++;
      }
    }
    
    return [name, result];
  }
  
  /**
   * @param {TreeNode} node
   * @return {TreeNode}
   */
  function optimizeTree(node) {
    while (node.hasEmptyChildren())
      squash(node);
      
    for (var i = 0, il = node.children.length; i < il; i++) {
      optimizeTree(node.children[i]);
    }
    
    return node;
  }
  
  /**
   * Split expression by node name and its content, if exists. E.g. if we pass
   * <code>a{Text}</code> expression, it will be splitted into <code>a</code>
   * and <code>Text</code>
   * @param {String} expr
   * @return {Array} Result with one or two elements (if expression contains
   * text node)
   */
  function splitExpression(expr) {
    // fast test on text node
    if (expr.indexOf('{') == -1)
      return [expr];
      
    var attr_lvl = 0,
      text_lvl = 0,
      brace_stack = [],
      i = 0,
      il = expr.length,
      ch;
      
    while (i < il) {
      ch = expr.charAt(i);
      switch (ch) {
        case '[':
          if (!text_lvl)
            attr_lvl++;
          break;
        case ']':
          if (!text_lvl)
            attr_lvl--;
          break;
        case '{':
          if (!attr_lvl) {
            text_lvl++;
            brace_stack.push(i);
          }
          break;
        case '}':
          if (!attr_lvl) {
            text_lvl--;
            var brace_start = brace_stack.pop();
            if (text_lvl === 0) {
              // found braces bounds
              return [
                expr.substring(0, brace_start),
                expr.substring(brace_start + 1, i)
              ];
            }
          }
          break;
      }
      i++;
    }
    
    // if we are here, then no valid text node found
    return [expr];
  }
  
  
  return {
    /**
     * Parses abbreviation into tree with respect of groups, 
     * text nodes and attributes. Each node of the tree is a single 
     * abbreviation. Tree represents actual structure of the outputted 
     * result
     * @param {String} abbr Abbreviation to parse
     * @return {TreeNode}
     */
    parse: function(abbr) {
      var root = new TreeNode,
        context = root.addChild(),
        i = 0,
        il = abbr.length,
        text_lvl = 0,
        attr_lvl = 0,
        group_lvl = 0,
        group_stack = [root],
        ch, prev_ch,
        token = '';
        
      group_stack.last = function() {
        return this[this.length - 1];
      };
      
      var dumpToken = function() {
        if (token)
          context.setAbbreviation(token);
        token = '';
      };
        
      while (i < il) {
        ch = abbr.charAt(i);
        prev_ch = i ? abbr.charAt(i - 1) : '';
        switch (ch) {
          case '{':
            if (!attr_lvl)
              text_lvl++;
            token += ch;
            break;
          case '}':
            if (!attr_lvl)
              text_lvl--;
            token += ch;
            break;
          case '[':
            if (!text_lvl)
              attr_lvl++;
            token += ch;
            break;
          case ']':
            if (!text_lvl)
              attr_lvl--;
            token += ch;
            break;
          case '(':
            if (!text_lvl && !attr_lvl) {
              // beginning of the new group
              dumpToken();
              
              if (prev_ch != '+' && prev_ch != '>') {
                // previous char is not an operator, assume it's
                // a sibling
                context = context.parent.addChild();
              }
              
              group_stack.push(context);
              context = context.addChild();
            } else {
              token += ch;
            }
            break;
          case ')':
            if (!text_lvl && !attr_lvl) {
              // end of the group, pop stack
              dumpToken();
              context = group_stack.pop();
              
              if (i < il - 1 && abbr.charAt(i + 1) == '*') {
                // group multiplication
                var group_mul = '', n_ch;
                for (var j = i + 2; j < il; j++) {
                  n_ch = abbr.charAt(j);
                  if (isNumeric(n_ch))
                    group_mul += n_ch;
                  else 
                    break;
                }
                
                i += group_mul.length + 1;
                group_mul = parseInt(group_mul || 1, 10);
                while (1 < group_mul--)
                  context.parent.addChild(context);
//                  last_parent.addChild(cur_item);
              }
              
            } else {
              token += ch;
            }
            break;
          case '+': // sibling operator
            if (!text_lvl && !attr_lvl && i != il - 1 /* expando? */) {
              dumpToken();
              context = context.parent.addChild();
            } else {
              token += ch;
            }
            break;
          case '>': // child operator
            if (!text_lvl && !attr_lvl) {
              dumpToken();
              context = context.addChild();
            } else {
              token += ch;
            }
            break;
          default:
            token += ch;
        }
        
        i++;
      }
      // put the final token
      dumpToken();
      
      return optimizeTree(root);
    },
    
    TreeNode: TreeNode,
    optimizeTree: optimizeTree
  }
})();/**
 * Core library that do all Zen Coding magic
 * @author Sergey Chikuyonok (serge.che@gmail.com)
 * @link http://chikuyonok.ru
 * @include "settings.js"
 * @include "zen_parser.js"
 * @include "zen_resources.js"
 */
var zen_coding = (function(){
  var re_tag = /<\/?[\w:\-]+(?:\s+[\w\-:]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*\s*(\/?)>$/,
  
    caret_placeholder = '{%::zen-caret::%}',
    newline = '\n',
    
    /** List of registered filters */
    filters = {},
    /** Filters that will be applied for unknown syntax */
    basic_filters = 'html',
    
    profiles = {},
    default_profile = {
      tag_case: 'lower',
      attr_case: 'lower',
      attr_quotes: 'double',
      
      // each tag on new line
      tag_nl: 'decide',
      
      place_cursor: true,
      
      // indent tags
      indent: true,
      
      // how many inline elements should be to force line break 
      // (set to 0 to disable)
      inline_break: 3,
      
      // use self-closing style for writing empty elements, e.g. <br /> or <br>
      self_closing_tag: 'xhtml',
      
      // Profile-level output filters, re-defines syntax filters 
      filters: ''
    };
  
  function isNumeric(ch) {
    if (typeof(ch) == 'string')
      ch = ch.charCodeAt(0);
      
    return (ch && ch > 47 && ch < 58);
  }
  
  /**
   * Проверяет, является ли символ допустимым в аббревиатуре
   * @param {String} ch
   * @return {Boolean}
   */
  function isAllowedChar(ch) {
    ch = String(ch); // convert Java object to JS
    var char_code = ch.charCodeAt(0),
      special_chars = '#.>+*:$-_!@[]()|';
    
    return (char_code > 64 && char_code < 91)       // uppercase letter
        || (char_code > 96 && char_code < 123)  // lowercase letter
        || isNumeric(ch)                        // number
        || special_chars.indexOf(ch) != -1;     // special character
  }
  
  /**
   * Возвращает символ перевода строки, используемый в редакторе
   * @return {String}
   */
  function getNewline() {
    return zen_coding.getNewline();
  }
  
  /**
   * Returns caret placeholder
   * @return {String}
   */
  function getCaretPlaceholder() {
    return (typeof(caret_placeholder) != 'string') 
      ? caret_placeholder()
      : caret_placeholder
  }
  
  /**
   * Split text into lines. Set <code>remove_empty</code> to true to filter
   * empty lines
   * @param {String} text
   * @param {Boolean} [remove_empty]
   * @return {Array}
   */
  function splitByLines(text, remove_empty) {
    // IE fails to split string by regexp, 
    // need to normalize newlines first
    // Also, Mozilla's Rhiho JS engine has a wierd newline bug
    var nl = getNewline();
    var lines = (text || '')
      .replace(/\r\n/g, '\n')
      .replace(/\n\r/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/\n/g, nl)
      .split(nl);
    
    if (remove_empty) {
      for (var i = lines.length; i >= 0; i--) {
        if (!trim(lines[i]))
          lines.splice(i, 1);
      }
    }
    
    return lines;
  }
  
  /**
   * Trim whitespace from string
   * @param {String} text
   * @return {String}
   */
  function trim(text) {
    return (text || "").replace( /^\s+|\s+$/g, "" );
  }
  
  function createProfile(options) {
    var result = {};
    for (var p in default_profile)
      result[p] = (p in options) ? options[p] : default_profile[p];
    
    return result;
  }
  
  function setupProfile(name, options) {
    profiles[name.toLowerCase()] = createProfile(options || {});
  }
  
  /**
   * Repeats string <code>how_many</code> times
   * @param {String} str
   * @param {Number} how_many
   * @return {String}
   */
  function repeatString(str, how_many) {
    var result = '';
    for (var i = 0; i < how_many; i++) 
      result += str;
      
    return result;
  }
  
  /**
   * Indents text with padding
   * @param {String} text Text to indent
   * @param {String|Number} pad Padding size (number) or padding itself (string)
   * @return {String}
   */
  function padString(text, pad) {
    var pad_str = (typeof(pad) == 'number') 
        ? repeatString(getIndentation(), pad) 
        : pad, 
      result = '';
    
    var lines = splitByLines(text),
      nl = getNewline();
      
    result += lines[0];
    for (var j = 1; j < lines.length; j++) 
      result += nl + pad_str + lines[j];
      
    return result;
  }
  
  /**
   * Class inheritance method
   * @param {Function} derived Derived class
   * @param {Function} from Base class
   */
  function inherit(derived, from) {
    var Inheritance = function(){};
  
    Inheritance.prototype = from.prototype;
  
    derived.prototype = new Inheritance();
    derived.prototype.constructor = derived;
    derived.baseConstructor = from;
    derived.superClass = from.prototype;
  };
  
  /**
   * Check if passed abbreviation is snippet
   * @param {String} abbr
   * @param {String} type
   * @return {Boolean}
   */
  function isShippet(abbr, type) {
    return getSnippet(type, filterNodeName(abbr)) ? true : false;
  }
  
  /**
   * Test if passed string ends with XHTML tag. This method is used for testing
   * '>' character: it belongs to tag or it's a part of abbreviation? 
   * @param {String} str
   * @return {Boolean}
   */
  function isEndsWithTag(str) {
    return re_tag.test(str);
  }
  
  /**
   * Replace variables like ${var} in string
   * @param {String} str
   * @param {Object|Function} [vars] Variable set (default is <code>zen_settings.variables</code>) 
   * @return {String}
   */
  function replaceVariables(str, vars) {
    var callback;
    
    if (typeof vars == 'function')
      callback = vars;
    else if (vars)
      callback = function(str, p1) {
        return (p1 in vars) ? vars[p1] : str;
      };
    else 
      callback = function(str, p1) {
        var v = getVariable(p1);
        return (v !== null && typeof v != 'undefined') ? v : str;
      }
    
    return str.replace(/\$\{([\w\-]+)\}/g, callback);
  }
  
  /**
   * Removes any unnecessary characters from node name
   * @param {String} name
   * @return {String}
   */
  function filterNodeName(name) {
    return (name || '').replace(/(.+)\!$/, '$1');
  }
  
  /**
   * Test if text contains output placeholder $#
   * @param {String} text
   * @return {Boolean}
   */
  function hasOutputPlaceholder(/* String */ text) {
    for (var i = 0, il = text.length; i < il; i++) {
      var ch = text.charAt(i);
      if (ch == '\\') { // escaped char
        i++;
        continue;
      } else if (ch == '$' && text.charAt(i + 1) == '#') {
        return true;
      }
    }
    
    return false;
  }
  
  /**
   * Tag
   * @class
   * @param {zen_parser.TreeNode} node Parsed tree node
   * @param {String} type Tag type (html, xml)
   */
  function Tag(node, type) {
    type = type || 'html';
    
    var abbr = null;
    if (node.name) {
      abbr = getAbbreviation(type, filterNodeName(node.name));
      if (abbr && abbr.type == 'zen-reference')
        abbr = getAbbreviation(type, filterNodeName(abbr.value));
    }
    
    this.name = (abbr) ? abbr.value.name : node.name;
    this.real_name = node.name;
    this.count = node.count || 1;
    this._abbr = abbr;
    this.syntax = type;
    this._content = '';
    this._paste_content = '';
    this.repeat_by_lines = node.is_repeating;
    this.is_repeating = node && node.count > 1;
    this.parent = null;
    this.has_implicit_name = node.has_implict_name;
    
    this.setContent(node.text);
    
    // add default attributes
    if (this._abbr)
      this.copyAttributes(this._abbr.value);
    
    this.copyAttributes(node);
  }
  
  Tag.prototype = {
    /**
     * Adds new child tag to current one
     * @param {Tag} tag
     */
    addChild: function(tag) {
      if (!this.children)
        this.children = [];
        
      tag.parent = this;
      this.children.push(tag);
    },
    
    /**
     * Adds new attribute
     * @param {String} name Attribute's name
     * @param {String} value Attribute's value
     */
    addAttribute: function(name, value) {
      if (!this.attributes)
        this.attributes = [];
        
      if (!this._attr_hash)
        this._attr_hash = {};
      
      // escape pipe (caret) character with internal placeholder
      value = replaceUnescapedSymbol(value, '|', getCaretPlaceholder());
      
      var a;
      if (name in this._attr_hash) {
        // attribute already exists, decide what to do
        a = this._attr_hash[name];
        if (name == 'class') {
          // 'class' is a magic attribute
          a.value += ((a.value) ? ' ' : '') + value;
        } else {
          a.value = value;
        }
      } else {
        a = {name: name, value: value};
        this._attr_hash[name] = a
        this.attributes.push(a);
      }
    },
    
    /**
     * Copy attributes from parsed node
     */
    copyAttributes: function(node) {
      if (node && node.attributes)
        for (var i = 0, il = node.attributes.length; i < il; i++) {
          var attr = node.attributes[i];
          this.addAttribute(attr.name, attr.value);
        }
    },
    
    /**
     * This function tests if current tags' content contains xHTML tags. 
     * This function is mostly used for output formatting
     */
    hasTagsInContent: function() {
      return this.getContent() && re_tag.test(this.getContent());
    },
    
    /**
     * Set textual content for tag
     * @param {String} str Tag's content
     */
    setContent: function(str) {
      this._content = replaceUnescapedSymbol(str || '', '|', getCaretPlaceholder());
    },
    
    /**
     * Returns tag's textual content
     * @return {String}
     */
    getContent: function() {
      return this._content || '';
    },
    
    /**
     * Set content that should be pasted to the output
     * @param {String} val
     */
    setPasteContent: function(val) {
      this._paste_content = zen_coding.escapeText(val);
    },
    
    /**
     * Get content that should be pasted to the output
     * @return {String}
     */
    getPasteContent: function() {
      return this._paste_content;
    },
    
    /**
     * Search for deepest and latest child of current element
     * @return {Tag|null} Returns null if there's no children
     */
    findDeepestChild: function() {
      if (!this.children || !this.children.length)
        return null;
        
      var deepest_child = this;
      while (true) {
        deepest_child = deepest_child.children[ deepest_child.children.length - 1 ];
        if (!deepest_child.children || !deepest_child.children.length)
          break;
      }
      
      return deepest_child;
    }
  };
  
  /**
   * Snippet
   * @param {zen_parser.TreeNode} node
   * @param {String} type Tag type (html, xml)
   */
  function Snippet(node, type) {
    /** @type {String} */
    this.name = filterNodeName(node.name);
    this.real_name = node.name;
    this.count = node.count;
    this.children = [];
    this._content = node.text || '';
    this.repeat_by_lines = node.is_repeating;
    this.is_repeating = node && node.count > 1;
    this.attributes = [];
    this.value = replaceUnescapedSymbol(getSnippet(type, this.name), '|', getCaretPlaceholder());
    this.parent = null;
    this.syntax = type;
    
    this.addAttribute('id', getCaretPlaceholder());
    this.addAttribute('class', getCaretPlaceholder());
    this.copyAttributes(node);
  }
  
  inherit(Snippet, Tag);
  
  /**
   * Returns abbreviation value from data set
   * @param {String} type Resource type (html, css, ...)
   * @param {String} abbr Abbreviation name
   * @return {Object|null}
   */
  function getAbbreviation(type, abbr) {
    return zen_resources.getAbbreviation(type, abbr);
  }
  
  /**
   * Returns snippet value from data set
   * @param {String} type Resource type (html, css, ...)
   * @param {String} snippet_name Snippet name
   * @return {Object|null}
   */
  function getSnippet(type, snippet_name) {
    return zen_resources.getSnippet(type, snippet_name);
  }
  
  /**
   * Returns variable value
   * @return {String}
   */
  function getVariable(name) {
    return zen_resources.getVariable(name);
  }
  
  /**
   * Returns indentation string
   * @return {String}
   */
  function getIndentation() {
    return getVariable('indentation');
  }
  
  /**
   * @class
   * Creates simplified tag from Zen Coding tag
   * @param {Tag} tag
   */
  function ZenNode(tag) {
    this.type = (tag instanceof Snippet) ? 'snippet' : 'tag';
    this.name = tag.name;
    this.real_name = tag.real_name;
    this.children = [];
    this.counter = 1;
    this.is_repeating = tag.is_repeating;
    this.repeat_by_lines = tag.repeat_by_lines;
    this.has_implicit_name = this.type == 'tag' && tag.has_implicit_name;
    
    // create deep copy of attribute list so we can change
    // their values in runtime without affecting other nodes
    // created from the same tag
    this.attributes = [];
    if (tag.attributes) {
      for (var i = 0, il = tag.attributes.length; i < il; i++) {
        var a =  tag.attributes[i];
        this.attributes.push({
          name: a.name,
          value: a.value
        });
      }
    }
    
    /** @type {Tag} Source element from which current tag was created */
    this.source = tag;
    
    // relations
    /** @type {ZenNode} */
    this.parent = null;
    /** @type {ZenNode} */
    this.nextSibling = null;
    /** @type {ZenNode} */
    this.previousSibling = null;
    
    // output params
    this.start = '';
    this.end = '';
    this.content = tag.getContent() || '';
    this.padding = '';
  }
  
  ZenNode.prototype = {
    /**
     * @type {ZenNode} tag
     */
    addChild: function(tag) {
      tag.parent = this;
      
      // check for implicit name
      if (tag.has_implicit_name && this.isInline())
        tag.name = 'span';
      
      var last_child = this.children[this.children.length - 1];
      if (last_child) {
        tag.previousSibling = last_child;
        last_child.nextSibling = tag;
      }
      
      this.children.push(tag);
    },
    
    /**
     * Get attribute's value.
     * @param {String} name
     * @return {String|null} Returns <code>null</code> if attribute wasn't found
     */
    getAttribute: function(name) {
      name = name.toLowerCase();
      for (var i = 0, il = this.attributes.length; i < il; i++) {
        if (this.attributes[i].name.toLowerCase() == name)
          return this.attributes[i].value;
      }
      
      return null;
    },
    
    /**
     * Test if current tag is unary (no closing tag)
     * @return {Boolean}
     */
    isUnary: function() {
      if (this.type == 'snippet')
        return false;
        
      return (this.source._abbr && this.source._abbr.value.is_empty) 
        || zen_resources.isItemInCollection(this.source.syntax, 'empty', this.name);
    },
    
    /**
     * Test if current tag is inline-level (like &lt;strong&gt;, &lt;img&gt;)
     * @return {Boolean}
     */
    isInline: function() {
      return this.type == 'text' 
        || zen_resources.isItemInCollection(this.source.syntax, 'inline_level', this.name);
    },
    
    /**
     * Test if current element is block-level
     * @return {Boolean}
     */
    isBlock: function() {
      return this.type == 'snippet' || !this.isInline();
    },
    
    /**
     * This function tests if current tags' content contains xHTML tags. 
     * This function is mostly used for output formatting
     */
    hasTagsInContent: function() {
      return this.content && re_tag.test(this.content);
    },
    
    /**
     * Check if tag has child elements
     * @return {Boolean}
     */
    hasChildren: function() {
      return !!this.children.length;
    },
    
    /**
     * Test if current tag contains block-level children
     * @return {Boolean}
     */
    hasBlockChildren: function() {
      if (this.hasTagsInContent() && this.isBlock()) {
        return true;
      }
      
      for (var i = 0; i < this.children.length; i++) {
        if (this.children[i].isBlock())
          return true;
      }
      
      return false;
    },
    
    /**
     * Search for deepest and latest child of current element
     * @return {ZenNode|null} Returns <code>null</code> if there's no children
     */
    findDeepestChild: function() {
      if (!this.children.length)
        return null;
        
      var deepest_child = this;
      while (true) {
        deepest_child = deepest_child.children[ deepest_child.children.length - 1 ];
        if (!deepest_child.children.length)
          break;
      }
      
      return deepest_child;
    },
    
    /**
     * @return {String}
     */
    toString: function() {
      var content = '';
      for (var i = 0, il = this.children.length; i < il; i++) {
        content += this.children[i].toString();
      }
      
      return this.start + this.content + content + this.end;
    },
    
    /**
     * Test if current element contains output placeholder (aka $#)
     * @return {Boolean}
     */
    hasOutputPlaceholder: function() {
      if (hasOutputPlaceholder(this.content)) {
        return true;
      } else {
        // search inside attributes
        for (var i = 0, il = this.attributes.length; i < il; i++) {
          if (hasOutputPlaceholder(this.attributes[i].value))
            return true;
        }
      }
      
      return false;
    },
    
    /**
     * Recursively search for elements with output placeholders (aka $#)
     * inside current element (not included in result)
     * @param {Array} _arr
     * @return {Array} Array of elements with output placeholders.  
     */
    findElementsWithOutputPlaceholder: function(_arr) {
      _arr = _arr || [];
      for (var i = 0, il = this.children.length; i < il; i++) {
        if (this.children[i].hasOutputPlaceholder()) {
          _arr.push(this.children[i]);
        }
        this.children[i].findElementsWithOutputPlaceholder(_arr);
      }
      return _arr;
    },
    
    /**
     * Paste content in context of current node. Pasting is a special case
     * of recursive adding content in node. 
     * This function will try to find $# placeholder inside node's 
     * attributes and text content and replace in with <code>text</code>.
     * If it doesn't find $# placeholder, it will put <code>text</code>
     * value as the deepest child content
     * @param {String} text Text to paste
     */
    pasteContent: function(text) {
      var symbol = '$#',
        r = [symbol, text],
        replace_fn = function() {return r;},
        /** @type {ZenNode[]} */
        items = [];
        
      if (this.hasOutputPlaceholder())
        items.push(this);
        
      items = items.concat(this.findElementsWithOutputPlaceholder());
      
      if (items.length) {
        for (var i = 0, il = items.length; i < il; i++) {
          /** @type {ZenNode} */
          var item = items[i];
          item.content = replaceUnescapedSymbol(item.content, symbol, replace_fn);
          for (var j = 0, jl = item.attributes.length; j < jl; j++) {
            var a = item.attributes[j];
            a.value = replaceUnescapedSymbol(a.value, symbol, replace_fn);
          }
        }
      } else {
        // no placeholders found, add content to the deepest child
        var child = this.findDeepestChild() || this;
        child.content += text;
      }
    }
  };
  
  /**
   * Roll outs basic Zen Coding tree into simplified, DOM-like tree.
   * The simplified tree, for example, represents each multiplied element 
   * as a separate element sets with its own content, if exists.
   * 
   * The simplified tree element contains some meta info (tag name, attributes, 
   * etc.) as well as output strings, which are exactly what will be outputted
   * after expanding abbreviation. This tree is used for <i>filtering</i>:
   * you can apply filters that will alter output strings to get desired look
   * of expanded abbreviation.
   * 
   * @param {Tag} tree
   * @param {ZenNode} [parent]
   */
  function rolloutTree(tree, parent) {
    parent = parent || new ZenNode(tree);
    
    var how_many = 1,
      tag_content = '';
      
    if (tree.children) {
      for (var i = 0, il = tree.children.length; i < il; i++) {
        /** @type {Tag} */
        var child = tree.children[i];
        how_many = child.count;
        
        if (child.repeat_by_lines) {
          // it's a repeating element
          tag_content = splitByLines(child.getPasteContent(), true);
          how_many = Math.max(tag_content.length, 1);
        } else {
          tag_content = child.getPasteContent();
        }
        
        for (var j = 0; j < how_many; j++) {
          var tag = new ZenNode(child);
          parent.addChild(tag);
          tag.counter = j + 1;
          
          if (child.children && child.children.length)
            rolloutTree(child, tag);
            
          if (tag_content) {
            var text = (typeof(tag_content) == 'string') 
              ? tag_content 
              : (tag_content[j] || '');
            tag.pasteContent(trim(text));
          }
        }
      }
    }
    
    return parent;
  }
  
  /**
   * Runs filters on tree
   * @param {ZenNode} tree
   * @param {String|Object} profile
   * @param {String[]|String} filter_list
   * @return {ZenNode}
   */
  function runFilters(tree, profile, filter_list) {
    profile = processProfile(profile);
    
    if (typeof(filter_list) == 'string')
      filter_list = filter_list.split(/[\|,]/g);
      
    for (var i = 0, il = filter_list.length; i < il; i++) {
      var name = trim(filter_list[i].toLowerCase());
      if (name && name in filters) {
        tree = filters[name](tree, profile);
      }
    }
    
    return tree;
  }
  
  /**
   * Transforms abbreviation into a primary internal tree. This tree should'n 
   * be used ouside of this scope
   * @param {zen_parser.TreeNode} node Parsed tree node
   * @param {String} [type] Document type (xsl, html, etc.)
   * @return {Tag}
   */
  function transformTreeNode(node, type) {
    type = type || 'html';
    if (node.isEmpty()) return null;
    
    return isShippet(node.name, type) 
        ? new Snippet(node, type)
        : new Tag(node, type);
  }
  
  /**
   * Process single tree node: expand it and its children 
   * @param {zen_parser.TreeNode} node
   * @param {String} type
   * @param {Tag} parent
   */
  function processParsedNode(node, type, parent) {
    var t_node = transformTreeNode(node, type);
    parent.addChild(t_node);
      
    // set repeating element to the topmost node
    var root = parent;
    while (root.parent)
      root = root.parent;
    
    root.last = t_node;
    if (t_node.repeat_by_lines)
      root.multiply_elem = t_node;
      
    // process child groups
    for (var j = 0, jl = node.children.length; j < jl; j++) {
      processParsedNode(node.children[j], type, t_node);
    }
  }
  
  /**
   * Replaces expando nodes by its parsed content
   * @param {zen_parser.TreeNode} node
   * @param {String} type
   */
  function replaceExpandos(node, type) {
    for (var i = 0, il = node.children.length; i < il; i++) {
      var n = node.children[i];
      if (!n.isEmpty() && !n.isTextNode() && n.name.indexOf('+') != -1) {
        // it's expando
        var a = getAbbreviation(type, n.name);
        if (a)
          node.children[i] = zen_parser.parse(a.value);
      }
      replaceExpandos(node.children[i], type);
    }
  }
  
  /**
   * Replaces expandos and optimizes tree structure by removing empty nodes
   * @param {zen_parser.TreeNode} tree
   * @param {String} type
   */
  function preprocessParsedTree(tree, type) {
    replaceExpandos(tree, type);
    return zen_parser.optimizeTree(tree);
  }
  
  /**
   * Pad string with zeroes
   * @param {String} str
   * @param {Number} pad
   */
  function zeroPadString(str, pad) {
    var padding = '', 
      il = str.length;
      
    while (pad > il++) padding += '0';
    return padding + str; 
  }
  
  /**
   * Replaces unescaped symbols in <code>str</code>. For example, the '$' symbol
   * will be replaced in 'item$count', but not in 'item\$count'.
   * @param {String} str Original string
   * @param {String} symbol Symbol to replace
   * @param {String|Function} replace Symbol replacement
   * @return {String}
   */
  function replaceUnescapedSymbol(str, symbol, replace) {
    var i = 0,
      il = str.length,
      sl = symbol.length,
      match_count = 0;
      
    while (i < il) {
      if (str.charAt(i) == '\\') {
        // escaped symbol, skip next character
        i += sl + 1;
      } else if (str.substr(i, sl) == symbol) {
        // have match
        var cur_sl = sl;
        match_count++;
        var new_value = replace;
        if (typeof(replace) !== 'string') {
          var replace_data = replace(str, symbol, i, match_count);
          if (replace_data) {
            cur_sl = replace_data[0].length;
            new_value = replace_data[1];
          } else {
            new_value = false;
          }
        }
        
        if (new_value === false) { // skip replacement
          i++;
          continue;
        }
        
        str = str.substring(0, i) + new_value + str.substring(i + cur_sl);
        // adjust indexes
        il = str.length;
        i += new_value.length;
      } else {
        i++;
      }
    }
    
    return str;
  }
  
  /**
   * Processes profile argument, returning, if possible, profile object
   */
  function processProfile(profile) {
    var _profile = profile;
    if (typeof(profile) == 'string' && profile in profiles)
      _profile = profiles[profile];
    
    if (!_profile)
      _profile = profiles['plain'];
      
    return _profile;
  }
  
  // create default profiles
  setupProfile('xhtml');
  setupProfile('html', {self_closing_tag: false});
  setupProfile('xml', {self_closing_tag: true, tag_nl: true});
  setupProfile('plain', {tag_nl: false, indent: false, place_cursor: false});
  
  
  return {
    /** Hash of all available actions */
    actions: {},
    
    /**
     * Adds new Zen Coding action. This action will be available in
     * <code>zen_settings.actions</code> object.
     * @param {String} name Action's name
     * @param {Function} fn Action itself. The first argument should be
     * <code>zen_editor</code> instance.
     */
    registerAction: function(name, fn) {
      this.actions[name.toLowerCase()] = fn;
    },
    
    /**
     * Runs Zen Coding action. For list of available actions and their
     * arguments see <code>zen_actions.js</code> file.
     * @param {String} name Action name 
     * @param {Array} args Additional arguments. It may be array of arguments
     * or inline arguments. The first argument should be <code>zen_editor</code> instance
     * @example
     * zen_coding.runActions('expand_abbreviation', zen_editor);  
     * zen_coding.runActions('wrap_with_abbreviation', [zen_editor, 'div']);  
     */
    runAction: function(name, args) {
      if (!(args instanceof Array))
        args = Array.prototype.slice.call(arguments, 1);
        
      name = name.toLowerCase();
      if (name in this.actions)
        return this.actions[name].apply(this, args);
//      try {
//      } catch(e){
//        if (window && window.console)
//          console.error(e);
//        return false; 
//      }
    },
    
    expandAbbreviation: function(abbr, type, profile) {
      type = type || 'html';
      var parsed_tree = this.parseIntoTree(abbr, type);
      
      if (parsed_tree) {
        var tree = rolloutTree(parsed_tree);
        this.applyFilters(tree, type, profile, parsed_tree.filters);
        return replaceVariables(tree.toString());
      }
      
      return '';
    },
    
    /**
     * Extracts abbreviations from text stream, starting from the end
     * @param {String} str
     * @return {String} Abbreviation or empty string
     */
    extractAbbreviation: function(str) {
      var cur_offset = str.length,
        start_index = -1,
        group_count = 0,
        brace_count = 0,
        text_count = 0;
      
      while (true) {
        cur_offset--;
        if (cur_offset < 0) {
          // moved to the beginning of the line
          start_index = 0;
          break;
        }
        
        var ch = str.charAt(cur_offset);
        
        if (ch == ']') {
          brace_count++;
        } else if (ch == '[') {
          if (!brace_count) { // unexpected brace
            start_index = cur_offset + 1;
            break;
          }
          brace_count--;
        } else if (ch == '}') {
          text_count++;
        } else if (ch == '{') {
          if (!text_count) { // unexpected brace
            start_index = cur_offset + 1;
            break;
          }
          text_count--;
        } else if (ch == ')') {
          group_count++;
        } else if (ch == '(') {
          if (!group_count) { // unexpected brace
            start_index = cur_offset + 1;
            break;
          }
          group_count--;
        } else {
          if (brace_count || text_count) 
            // respect all characters inside attribute sets or text nodes
            continue;
          else if (!isAllowedChar(ch) || (ch == '>' && isEndsWithTag(str.substring(0, cur_offset + 1)))) {
            // found stop symbol
            start_index = cur_offset + 1;
            break;
          }
        }
      }
      
      if (start_index != -1 && !text_count && !brace_count && !group_count) 
        // found something, return abbreviation
        return str.substring(start_index);
      else
        return '';
    },
    
    /**
     * Parses abbreviation into a node set
     * @param {String} abbr Abbreviation
     * @param {String} type Document type (xsl, html, etc.)
     * @return {Tag}
     */
    parseIntoTree: function(abbr, type) {
      type = type || 'html';
      // remove filters from abbreviation
      var filter_list = '';
      abbr = abbr.replace(/\|([\w\|\-]+)$/, function(str, p1){
        filter_list = p1;
        return '';
      });
      
      // try to parse abbreviation
      try {
        var abbr_tree = zen_parser.parse(abbr),
          tree_root = new Tag({}, type);
          
        abbr_tree = preprocessParsedTree(abbr_tree, type);
      } catch(e) {
        if (e.message == "InvalidAbbreviation")
          return null;
      }
        
      // then recursively expand each group item
      for (var i = 0, il = abbr_tree.children.length; i < il; i++) {
        processParsedNode(abbr_tree.children[i], type, tree_root);
      }
      
      tree_root.filters = filter_list;
      return tree_root;
    },
    
    /**
     * Indents text with padding
     * @param {String} text Text to indent
     * @param {String|Number} pad Padding size (number) or padding itself (string)
     * @return {String}
     */
    padString: padString,
    setupProfile: setupProfile,
    getNewline: function(){
      return newline;
    },
    
    setNewline: function(str) {
      newline = str;
      this.setVariable('newline', str);
      this.setVariable('nl', str);
    },
    
    /**
     * Wraps passed text with abbreviation. Text will be placed inside last
     * expanded element
     * @param {String} abbr Abbreviation
     * @param {String} text Text to wrap
     * @param {String} [type] Document type (html, xml, etc.). Default is 'html'
     * @param {String} [profile] Output profile's name. Default is 'plain'
     * @return {String}
     */
    wrapWithAbbreviation: function(abbr, text, type, profile) {
      type = type || 'html';
      var tree_root = this.parseIntoTree(abbr, type),
        pasted = false;
        
      if (tree_root) {
        if (tree_root.multiply_elem) {
          // we have a repeating element, put content in
          tree_root.multiply_elem.setPasteContent(text);
          tree_root.multiply_elem.repeat_by_lines = pasted = true;
        }
        
        var tree = rolloutTree(tree_root);
        
        if (!pasted) 
          tree.pasteContent(text);
        
        this.applyFilters(tree, type, profile, tree_root.filters);
        return replaceVariables(tree.toString());
      }
      
      return null;
    },
    
    splitByLines: splitByLines,
    
    /**
     * Check if cursor is placed inside xHTML tag
     * @param {String} html Contents of the document
     * @param {Number} cursor_pos Current caret position inside tag
     * @return {Boolean}
     */
    isInsideTag: function(html, cursor_pos) {
      var re_tag = /^<\/?\w[\w\:\-]*.*?>/;
      
      // search left to find opening brace
      var pos = cursor_pos;
      while (pos > -1) {
        if (html.charAt(pos) == '<') 
          break;
        pos--;
      }
      
      if (pos != -1) {
        var m = re_tag.exec(html.substring(pos));
        if (m && cursor_pos > pos && cursor_pos < pos + m[0].length)
          return true;
      }
      
      return false;
    },
    
    /**
     * Returns caret placeholder
     * @return {String}
     */
    getCaretPlaceholder: getCaretPlaceholder,
    
    /**
     * Set caret placeholder: a string (like '|') or function.
     * You may use a function as a placeholder generator. For example,
     * TextMate uses ${0}, ${1}, ..., ${n} natively for quick Tab-switching
     * between them.
     * @param {String|Function} value
     */
    setCaretPlaceholder: function(value) {
      caret_placeholder = value;
    },
    
    rolloutTree: rolloutTree,
    
    /**
     * Register new filter
     * @param {String} name Filter name
     * @param {Function} fn Filter function
     */
    registerFilter: function(name, fn) {
      filters[name] = fn;
    },
    
    /**
     * Factory method that produces <code>ZenNode</code> instance
     * @param {String} name Node name
     * @param {Array} [attrs] Array of attributes as key/value objects  
     * @return {ZenNode}
     */
    nodeFactory: function(name, attrs) {
      return new ZenNode({name: name, attributes: attrs || []});
    },
    
    /**
     * Applies filters to tree according to syntax
     * @param {ZenNode} tree Tag tree to apply filters to
     * @param {String} syntax Syntax name ('html', 'css', etc.)
     * @param {String|Object} profile Profile or profile's name
     * @param {String|Array} [additional_filters] List or pipe-separated 
     * string of additional filters to apply
     * 
     * @return {ZenNode}
     */
    applyFilters: function(tree, syntax, profile, additional_filters) {
      profile = processProfile(profile);
      var _filters = profile.filters;
      if (!_filters)
        _filters = zen_resources.getSubset(syntax, 'filters') || basic_filters;
        
      if (additional_filters)
        _filters += '|' + ((typeof(additional_filters) == 'string') 
          ? additional_filters 
          : additional_filters.join('|'));
        
      if (!_filters)
        // looks like unknown syntax, apply basic filters
        _filters = basic_filters;
        
      return runFilters(tree, profile, _filters);
    },
    
    runFilters: runFilters,
    
    repeatString: repeatString,
    getVariable: getVariable,
    /**
     * Store runtime variable in user storage
     * @param {String} name Variable name
     * @param {String} value Variable value
     */
    setVariable: function(name, value){
      var voc = zen_resources.getVocabulary('user') || {};
      if (!('varaibles' in voc))
        voc.variables = {};
        
      voc.variables[name] = value;
      zen_resources.setVocabulary(voc, 'user');
    },
    replaceVariables: replaceVariables,
    
    /**
     * Escapes special characters used in Zen Coding, like '$', '|', etc.
     * Use this method before passing to actions like "Wrap with Abbreviation"
     * to make sure that existing spacial characters won't be altered
     * @param {String} text
     * @return {String}
     */
    escapeText: function(text) {
      return text.replace(/([\$\|\\])/g, '\\$1');
    },
    
    /**
     * Unescapes special characters used in Zen Coding, like '$', '|', etc.
     * @param {String} text
     * @return {String}
     */
    unescapeText: function(text) {
      return text.replace(/\\(.)/g, '$1');
    },
    
    /**
     * Replaces '$' character in string assuming it might be escaped with '\'
     * @param {String} str
     * @param {String|Number} value
     * @return {String}
     */
    replaceCounter: function(str, value) {
      var symbol = '$';
      value = String(value);
      return replaceUnescapedSymbol(str, symbol, function(str, symbol, pos, match_num){
        if (str.charAt(pos + 1) == '{' || isNumeric(str.charAt(pos + 1)) ) {
          // it's a variable, skip it
          return false;
        }
        
        // replace sequense of $ symbols with padded number  
        var j = pos + 1;
        while(str.charAt(j) == '$' && str.charAt(j + 1) != '{') j++;
        return [str.substring(pos, j), zeroPadString(value, j - pos)];
      });
    },
    
    isNumeric: isNumeric,
    
    /**
     * Upgrades tabstops in zen node in order to prevent naming conflicts
     * @param {ZenNode} node
     * @param {Number} offset Tab index offset
     * @returns {Number} Maximum tabstop index in element
     */
    upgradeTabstops: function(node, offset) {
      var max_num = 0,
        props = ['start', 'end', 'content'],
        escape_fn = function(ch){ return '\\' + ch; },
        tabstop_fn = function(i, num, value) {
          num = parseInt(num);
          if (num > max_num) max_num = num;
            
          if (value)
            return '${' + (num + offset) + ':' + value + '}';
          else
            return '$' + (num + offset);
        };
        
      for (var i = 0, il = props.length; i < il; i++)
        node[props[i]] = this.processTextBeforePaste(node[props[i]], escape_fn, tabstop_fn);
      
      return max_num;
    },
    
    /**
     * Get profile by it's name. If profile wasn't found, returns 'plain'
     * profile
     */
    getProfile: function(name) {
      return (name in profiles) ? profiles[name] : profiles['plain'];
    },
    
    /**
     * Gets image size from image byte stream.
     * @author http://romeda.org/rePublish/
     * @param {String} stream Image byte stream (use <code>zen_file.read()</code>)
     * @return {Object} Object with <code>width</code> and <code>height</code> properties
     */
    getImageSize: function(stream) {
      var pngMagicNum = "\211PNG\r\n\032\n",
        jpgMagicNum = "\377\330",
        gifMagicNum = "GIF8",
        nextByte = function() {
          return stream.charCodeAt(pos++);
        };
    
      if (stream.substr(0, 8) === pngMagicNum) {
        // PNG. Easy peasy.
        var pos = stream.indexOf('IHDR') + 4;
      
        return { width:  (nextByte() << 24) | (nextByte() << 16) |
                 (nextByte() <<  8) | nextByte(),
             height: (nextByte() << 24) | (nextByte() << 16) |
                 (nextByte() <<  8) | nextByte() };
      
      } else if (stream.substr(0, 4) === gifMagicNum) {
        pos = 6;
      
        return {
          width:  nextByte() | (nextByte() << 8),
          height: nextByte() | (nextByte() << 8)
        };
      
      } else if (stream.substr(0, 2) === jpgMagicNum) {
        // TODO need testing
        pos = 2;
      
        var l = stream.length;
        while (pos < l) {
          if (nextByte() != 0xFF) return;
        
          var marker = nextByte();
          if (marker == 0xDA) break;
        
          var size = (nextByte() << 8) | nextByte();
        
          if (marker >= 0xC0 && marker <= 0xCF && !(marker & 0x4) && !(marker & 0x8)) {
            pos += 1;
            return { height:  (nextByte() << 8) | nextByte(),
                 width: (nextByte() << 8) | nextByte() };
        
          } else {
            pos += size - 2;
          }
        }
      }
    },
    
    /**
     * Returns context-aware node counter
     * @param {node} ZenNode
     * @return {Number}
     */
    getCounterForNode: function(node) {
      // find nearest repeating parent
      var counter = node.counter;
      if (!node.is_repeating && !node.repeat_by_lines) {
        while (node = node.parent) {
          if (node.is_repeating || node.repeat_by_lines)
            return node.counter;
        }
      }
      
      return counter;
    },
    
    /**
     * Process text that should be pasted into editor: clear escaped text and
     * handle tabstops
     * @param {String} text
     * @param {Function} escape_fn Handle escaped character. Must return
     * replaced value
     * @param {Function} tabstop_fn Callback function that will be called on every
     * tabstob occurance, passing <b>index</b>, <code>number</code> and 
     * <b>value</b> (if exists) arguments. This function must return 
     * replacement value
     * @return {String} 
     */
    processTextBeforePaste: function(text, escape_fn, tabstop_fn) {
      var i = 0, il = text.length, start_ix, _i,
        str_builder = [];
        
      var nextWhile = function(ix, fn) {
        while (ix < il) if (!fn(text.charAt(ix++))) break;
        return ix - 1;
      };
      
      while (i < il) {
        var ch = text.charAt(i);
        if (ch == '\\' && i + 1 < il) {
          // handle escaped character
          str_builder.push(escape_fn(text.charAt(i + 1)));
          i += 2;
          continue;
        } else if (ch == '$') {
          // looks like a tabstop
          var next_ch = text.charAt(i + 1) || '';
          _i = i;
          if (this.isNumeric(next_ch)) {
            // $N placeholder
            start_ix = i + 1;
            i = nextWhile(start_ix, this.isNumeric);
            if (start_ix < i) {
              str_builder.push(tabstop_fn(_i, text.substring(start_ix, i)));
              continue;
            }
          } else if (next_ch == '{') {
            // ${N:value} or ${N} placeholder
            var brace_count = 1;
            start_ix = i + 2;
            i = nextWhile(start_ix, this.isNumeric);
            
            if (i > start_ix) {
              if (text.charAt(i) == '}') {
                str_builder.push(tabstop_fn(_i, text.substring(start_ix, i)));
                i++; // handle closing brace
                continue;
              } else if (text.charAt(i) == ':') {
                var val_start = i + 2;
                i = nextWhile(val_start, function(c) {
                  if (c == '{') brace_count++;
                  else if (c == '}') brace_count--;
                  return !!brace_count;
                });
                str_builder.push(tabstop_fn(_i, text.substring(start_ix, val_start - 2), text.substring(val_start - 1, i)));
                i++; // handle closing brace
                continue;
              }
            }
          }
          i = _i;
        }
        
        // push current character to stack
        str_builder.push(ch);
        i++;
      }
      
      return str_builder.join('');
    }
  }
})();/**
 * Middleware layer that communicates between editor and Zen Coding.
 * This layer describes all available Zen Coding actions, like 
 * "Expand Abbreviation".
 * @author Sergey Chikuyonok (serge.che@gmail.com)
 * @link http://chikuyonok.ru
 * 
 * @include "zen_editor.js"
 * @include "html_matcher.js"
 * @include "zen_coding.js"
 * @include "zen_file.js"
 * @include "base64.js"
 */

/**
 * Search for abbreviation in editor from current caret position
 * @param {zen_editor} editor Editor instance
 * @return {String|null}
 */
function findAbbreviation(editor) {
  var range = editor.getSelectionRange(),
    content = String(editor.getContent());
  if (range.start != range.end) {
    // abbreviation is selected by user
    return content.substring(range.start, range.end);
  }
  
  // search for new abbreviation from current caret position
  var cur_line = editor.getCurrentLineRange();
  return zen_coding.extractAbbreviation(content.substring(cur_line.start, range.start));
}

/**
 * Find from current caret position and expand abbreviation in editor
 * @param {zen_editor} editor Editor instance
 * @param {String} [syntax] Syntax type (html, css, etc.)
 * @param {String} [profile_name] Output profile name (html, xml, xhtml)
 * @return {Boolean} Returns <code>true</code> if abbreviation was expanded 
 * successfully
 */
function expandAbbreviation(editor, syntax, profile_name) {
  syntax = String(syntax || editor.getSyntax());
  profile_name = String(profile_name || editor.getProfileName());
  
  var caret_pos = editor.getSelectionRange().end,
    abbr,
    content = '';
    
  if ( (abbr = findAbbreviation(editor)) ) {
    content = zen_coding.expandAbbreviation(abbr, syntax, profile_name);
    if (content) {
      editor.replaceContent(content, caret_pos - abbr.length, caret_pos);
      return true;
    }
  }
  
  return false;
}

/**
 * A special version of <code>expandAbbreviation</code> function: if it can't
 * find abbreviation, it will place Tab character at caret position
 * @param {zen_editor} editor Editor instance
 * @param {String} syntax Syntax type (html, css, etc.)
 * @param {String} profile_name Output profile name (html, xml, xhtml)
 */
function expandAbbreviationWithTab(editor, syntax, profile_name) {
  syntax = String(syntax || editor.getSyntax());
  profile_name = String(profile_name || editor.getProfileName());
  if (!expandAbbreviation(editor, syntax, profile_name))
    editor.replaceContent(zen_coding.getVariable('indentation'), editor.getCaretPos());
}

/**
 * Find and select HTML tag pair
 * @param {zen_editor} editor Editor instance
 * @param {String} [direction] Direction of pair matching: 'in' or 'out'. 
 * Default is 'out'
 */
function matchPair(editor, direction, syntax) {
  direction = String((direction || 'out').toLowerCase());
  syntax = String(syntax || editor.getProfileName());
  
  var range = editor.getSelectionRange(),
    cursor = range.end,
    range_start = range.start, 
    range_end = range.end,
//    content = zen_coding.splitByLines(editor.getContent()).join('\n'),
    content = String(editor.getContent()),
    range = null,
    _r,
  
    old_open_tag = zen_coding.html_matcher.last_match['opening_tag'],
    old_close_tag = zen_coding.html_matcher.last_match['closing_tag'];
    
  if (direction == 'in' && old_open_tag && range_start != range_end) {
//    user has previously selected tag and wants to move inward
    if (!old_close_tag) {
//      unary tag was selected, can't move inward
      return false;
    } else if (old_open_tag.start == range_start) {
      if (content.charAt(old_open_tag.end) == '<') {
//        test if the first inward tag matches the entire parent tag's content
        _r = zen_coding.html_matcher.find(content, old_open_tag.end + 1, syntax);
        if (_r[0] == old_open_tag.end && _r[1] == old_close_tag.start) {
          range = zen_coding.html_matcher(content, old_open_tag.end + 1, syntax);
        } else {
          range = [old_open_tag.end, old_close_tag.start];
        }
      } else {
        range = [old_open_tag.end, old_close_tag.start];
      }
    } else {
      var new_cursor = content.substring(0, old_close_tag.start).indexOf('<', old_open_tag.end);
      var search_pos = new_cursor != -1 ? new_cursor + 1 : old_open_tag.end;
      range = zen_coding.html_matcher(content, search_pos, syntax);
    }
  } else {
    range = zen_coding.html_matcher(content, cursor, syntax);
  }
  
  if (range !== null && range[0] != -1) {
    editor.createSelection(range[0], range[1]);
    return true;
  } else {
    return false;
  }
}

/**
 * Narrow down text indexes, adjusting selection to non-space characters
 * @param {String} text
 * @param {Number} start
 * @param {Number} end
 * @return {Array}
 */
function narrowToNonSpace(text, start, end) {
  // narrow down selection until first non-space character
  var re_space = /\s|\n|\r/;
  function isSpace(ch) {
    return re_space.test(ch);
  }
  
  while (start < end) {
    if (!isSpace(text.charAt(start)))
      break;
      
    start++;
  }
  
  while (end > start) {
    end--;
    if (!isSpace(text.charAt(end))) {
      end++;
      break;
    }
  }
  
  return [start, end];
}

/**
 * Wraps content with abbreviation
 * @param {zen_editor} Editor instance
 * @param {String} abbr Abbreviation to wrap with
 * @param {String} [syntax] Syntax type (html, css, etc.)
 * @param {String} [profile_name] Output profile name (html, xml, xhtml)
 */
function wrapWithAbbreviation(editor, abbr, syntax, profile_name) {
  syntax = String(syntax || editor.getSyntax());
  profile_name = String(profile_name || editor.getProfileName());
  abbr = abbr || editor.prompt("Enter abbreviation");
  
  var range = editor.getSelectionRange(),
    start_offset = range.start,
    end_offset = range.end,
    content = String(editor.getContent());
    
  if (!abbr || typeof abbr == 'undefined')
    return null; 
    
  abbr = String(abbr);
  
  if (start_offset == end_offset) {
    // no selection, find tag pair
    range = zen_coding.html_matcher(content, start_offset, profile_name);
    
    if (!range || range[0] == -1) // nothing to wrap
      return null;
    
    var narrowed_sel = narrowToNonSpace(content, range[0], range[1]);
    
    start_offset = narrowed_sel[0];
    end_offset = narrowed_sel[1];
  }
  
  var new_content = zen_coding.escapeText(content.substring(start_offset, end_offset)),
    result = zen_coding.wrapWithAbbreviation(abbr, unindent(editor, new_content), syntax, profile_name);
  
  if (result) {
    editor.setCaretPos(end_offset);
    editor.replaceContent(result, start_offset, end_offset);
  }
}

/**
 * Unindent content, thus preparing text for tag wrapping
 * @param {zen_editor} editor Editor instance
 * @param {String} text
 * @return {String}
 */
function unindent(editor, text) {
  return unindentText(text, getCurrentLinePadding(editor));
}

/**
 * Removes padding at the beginning of each text's line
 * @param {String} text
 * @param {String} pad
 */
function unindentText(text, pad) {
  var lines = zen_coding.splitByLines(text);
  for (var i = 0; i < lines.length; i++) {
    if (lines[i].search(pad) == 0)
      lines[i] = lines[i].substr(pad.length);
  }
  
  return lines.join(zen_coding.getNewline());
}

/**
 * Returns padding of current editor's line
 * @param {zen_editor} Editor instance
 * @return {String}
 */
function getCurrentLinePadding(editor) {
  return getLinePadding(editor.getCurrentLine());
}

/**
 * Returns line padding
 * @param {String} line
 * @return {String}
 */
function getLinePadding(line) {
  return (line.match(/^(\s+)/) || [''])[0];
}

/**
 * Search for new caret insertion point
 * @param {zen_editor} editor Editor instance
 * @param {Number} inc Search increment: -1 — search left, 1 — search right
 * @param {Number} offset Initial offset relative to current caret position
 * @return {Number} Returns -1 if insertion point wasn't found
 */
function findNewEditPoint(editor, inc, offset) {
  inc = inc || 1;
  offset = offset || 0;
  var cur_point = editor.getCaretPos() + offset,
    content = String(editor.getContent()),
    max_len = content.length,
    next_point = -1,
    re_empty_line = /^\s+$/;
  
  function ch(ix) {
    return content.charAt(ix);
  }
  
  function getLine(ix) {
    var start = ix;
    while (start >= 0) {
      var c = ch(start);
      if (c == '\n' || c == '\r')
        break;
      start--;
    }
    
    return content.substring(start, ix);
  }
    
  while (cur_point < max_len && cur_point > 0) {
    cur_point += inc;
    var cur_char = ch(cur_point),
      next_char = ch(cur_point + 1),
      prev_char = ch(cur_point - 1);
      
    switch (cur_char) {
      case '"':
      case '\'':
        if (next_char == cur_char && prev_char == '=') {
          // empty attribute
          next_point = cur_point + 1;
        }
        break;
      case '>':
        if (next_char == '<') {
          // between tags
          next_point = cur_point + 1;
        }
        break;
      case '\n':
      case '\r':
        // empty line
        if (re_empty_line.test(getLine(cur_point - 1))) {
          next_point = cur_point;
        }
        break;
    }
    
    if (next_point != -1)
      break;
  }
  
  return next_point;
}

/**
 * Move caret to previous edit point
 * @param {zen_editor} editor Editor instance
 */
function prevEditPoint(editor) {
  var cur_pos = editor.getCaretPos(),
    new_point = findNewEditPoint(editor, -1);
    
  if (new_point == cur_pos)
    // we're still in the same point, try searching from the other place
    new_point = findNewEditPoint(editor, -1, -2);
  
  if (new_point != -1) 
    editor.setCaretPos(new_point);
}

/**
 * Move caret to next edit point
 * @param {zen_editor} editor Editor instance
 */
function nextEditPoint(editor) {
  var new_point = findNewEditPoint(editor, 1);
  if (new_point != -1)
    editor.setCaretPos(new_point);
}

/**
 * Inserts newline character with proper indentation in specific positions only.
 * @param {zen_editor} editor
 * @return {Boolean} Returns <code>true</code> if line break was inserted 
 */
function insertFormattedNewlineOnly(editor) {
  var caret_pos = editor.getCaretPos(),
    content = String(editor.getContent()),
    nl = zen_coding.getNewline(),
    pad = zen_coding.getVariable('indentation'),
    syntax = String(editor.getSyntax());
    
  if (syntax == 'html') {
    // let's see if we're breaking newly created tag
    var pair = zen_coding.html_matcher.getTags(content, caret_pos, String(editor.getProfileName()));
    
    if (pair[0] && pair[1] && pair[0].type == 'tag' && pair[0].end == caret_pos && pair[1].start == caret_pos) {
      editor.replaceContent(nl + pad + zen_coding.getCaretPlaceholder() + nl, caret_pos);
      return true;
    }
  } else if (syntax == 'css') {
    if (caret_pos && content.charAt(caret_pos - 1) == '{') {
      // look ahead for a closing brace
      for (var i = caret_pos, il = content.length, ch; i < il; i++) {
        ch = content.charAt(i);
        if (ch == '}') return false;
        if (ch == '{') break;
      }
      
      // defining rule set
      var ins_value = nl + pad + zen_coding.getCaretPlaceholder() + nl,
        has_close_brace = caret_pos < content.length && content.charAt(caret_pos) == '}';
        
      var user_close_brace = zen_coding.getVariable('close_css_brace');
      if (user_close_brace) {
        // user defined how close brace should look like
        ins_value += zen_coding.replaceVariables(user_close_brace);
      } else if (!has_close_brace) {
        ins_value += '}';
      }
      
      editor.replaceContent(ins_value, caret_pos, caret_pos + (has_close_brace ? 1 : 0));
      return true;
    }
  }
    
  return false;
}

/**
 * Inserts newline character with proper indentation. This action is used in
 * editors that doesn't have indentation control (like textarea element) to 
 * provide proper indentation
 * @param {zen_editor} editor Editor instance
 */
function insertFormattedNewline(editor) {
  if (!insertFormattedNewlineOnly(editor)) {
    var cur_padding = getCurrentLinePadding(editor),
      content = String(editor.getContent()),
      caret_pos = editor.getCaretPos(),
      c_len = content.length,
      nl = zen_coding.getNewline();
      
    // check out next line padding
    var line_range = editor.getCurrentLineRange(),
      next_padding = '';
      
    for (var i = line_range.end + 1, ch; i < c_len; i++) {
      ch = content.charAt(i);
      if (ch == ' ' || ch == '\t')
        next_padding += ch;
      else
        break;
    }
    
    if (next_padding.length > cur_padding.length)
      editor.replaceContent(nl + next_padding, caret_pos, caret_pos, true);
    else
      editor.replaceContent(nl, caret_pos);
  }
}

/**
 * Select line under cursor
 * @param {zen_editor} editor Editor instance
 */
function selectLine(editor) {
  var range = editor.getCurrentLineRange();
  editor.createSelection(range.start, range.end);
}

/**
 * Moves caret to matching opening or closing tag
 * @param {zen_editor} editor
 */
function goToMatchingPair(editor) {
  var content = String(editor.getContent()),
    caret_pos = editor.getCaretPos();
  
  if (content.charAt(caret_pos) == '<') 
    // looks like caret is outside of tag pair  
    caret_pos++;
    
  var tags = zen_coding.html_matcher.getTags(content, caret_pos, String(editor.getProfileName()));
    
  if (tags && tags[0]) {
    // match found
    var open_tag = tags[0],
      close_tag = tags[1];
      
    if (close_tag) { // exclude unary tags
      if (open_tag.start <= caret_pos && open_tag.end >= caret_pos)
        editor.setCaretPos(close_tag.start);
      else if (close_tag.start <= caret_pos && close_tag.end >= caret_pos)
        editor.setCaretPos(open_tag.start);
    }
  }
}

/**
 * Merge lines spanned by user selection. If there's no selection, tries to find
 * matching tags and use them as selection
 * @param {zen_editor} editor
 */
function mergeLines(editor) {
  var selection = editor.getSelectionRange();
  if (selection.start == selection.end) {
    // find matching tag
    var pair = zen_coding.html_matcher(String(editor.getContent()), editor.getCaretPos(), String(editor.getProfileName()));
    if (pair) {
      selection.start = pair[0];
      selection.end = pair[1];
    }
  }
  
  if (selection.start != selection.end) {
    // got range, merge lines
    var text = String(editor.getContent()).substring(selection.start, selection.end),
      old_length = text.length;
    var lines =  zen_coding.splitByLines(text);
    
    for (var i = 1; i < lines.length; i++) {
      lines[i] = lines[i].replace(/^\s+/, '');
    }
    
    text = lines.join('').replace(/\s{2,}/, ' ');
    editor.replaceContent(text, selection.start, selection.end);
    editor.createSelection(selection.start, selection.start + text.length);
  }
}

/**
 * Toggle comment on current editor's selection or HTML tag/CSS rule
 * @param {zen_editor} editor
 */
function toggleComment(editor) {
  var syntax = String(editor.getSyntax());
  if (syntax == 'css') {
    // in case out editor is good enough and can recognize syntax from 
    // current token, we have to make sure that cursor is not inside
    // 'style' attribute of html element
    var caret_pos = editor.getCaretPos();
    var pair = zen_coding.html_matcher.getTags(String(editor.getContent()), caret_pos);
    if (pair && pair[0] && pair[0].type == 'tag' && 
        pair[0].start <= caret_pos && pair[0].end >= caret_pos) {
      syntax = 'html';
    }
  }
  
  switch (syntax) {
    case 'css':
      return toggleCSSComment(editor);
    default:
      return toggleHTMLComment(editor);
  }
}

/**
 * Toggle HTML comment on current selection or tag
 * @param {zen_editor} editor
 * @return {Boolean} Returns <code>true</code> if comment was toggled
 */
function toggleHTMLComment(editor) {
  var rng = editor.getSelectionRange(),
    content = String(editor.getContent());
    
  if (rng.start == rng.end) {
    // no selection, find matching tag
    var pair = zen_coding.html_matcher.getTags(content, editor.getCaretPos(), String(editor.getProfileName()));
    if (pair && pair[0]) { // found pair
      rng.start = pair[0].start;
      rng.end = pair[1] ? pair[1].end : pair[0].end;
    }
  }
  
  return genericCommentToggle(editor, '<!--', '-->', rng.start, rng.end);
}

/**
 * Simple CSS commenting
 * @param {zen_editor} editor
 * @return {Boolean} Returns <code>true</code> if comment was toggled
 */
function toggleCSSComment(editor) {
  var rng = editor.getSelectionRange();
    
  if (rng.start == rng.end) {
    // no selection, get current line
    rng = editor.getCurrentLineRange();

    // adjust start index till first non-space character
    var _r = narrowToNonSpace(String(editor.getContent()), rng.start, rng.end);
    rng.start = _r[0];
    rng.end = _r[1];
  }
  
  return genericCommentToggle(editor, '/*', '*/', rng.start, rng.end);
}

/**
 * Search for nearest comment in <code>str</code>, starting from index <code>from</code>
 * @param {String} text Where to search
 * @param {Number} from Search start index
 * @param {String} start_token Comment start string
 * @param {String} end_token Comment end string
 * @return {Array|null} Returns null if comment wasn't found
 */
function searchComment(text, from, start_token, end_token) {
  var start_ch = start_token.charAt(0),
    end_ch = end_token.charAt(0),
    comment_start = -1,
    comment_end = -1;
  
  function hasMatch(str, start) {
    return text.substr(start, str.length) == str;
  }
    
  // search for comment start
  while (from--) {
    if (text.charAt(from) == start_ch && hasMatch(start_token, from)) {
      comment_start = from;
      break;
    }
  }
  
  if (comment_start != -1) {
    // search for comment end
    from = comment_start;
    var content_len = text.length;
    while (content_len >= from++) {
      if (text.charAt(from) == end_ch && hasMatch(end_token, from)) {
        comment_end = from + end_token.length;
        break;
      }
    }
  }
  
  return (comment_start != -1 && comment_end != -1) 
    ? [comment_start, comment_end] 
    : null;
}

/**
 * Escape special regexp chars in string, making it usable for creating dynamic
 * regular expressions
 * @param {String} str
 * @return {String}
 */
function escapeForRegexp(str) {
  var specials = new RegExp("[.*+?|()\\[\\]{}\\\\]", "g"); // .*+?|()[]{}\
  return str.replace(specials, "\\$&");
}

/**
 * Generic comment toggling routine
 * @param {zen_editor} editor
 * @param {String} comment_start Comment start token
 * @param {String} comment_end Comment end token
 * @param {Number} range_start Start selection range
 * @param {Number} range_end End selection range
 * @return {Boolean}
 */
function genericCommentToggle(editor, comment_start, comment_end, range_start, range_end) {
  var content = String(editor.getContent()),
    caret_pos = editor.getCaretPos(),
    new_content = null;
    
  /**
   * Remove comment markers from string
   * @param {Sting} str
   * @return {String}
   */
  function removeComment(str) {
    return str
      .replace(new RegExp('^' + escapeForRegexp(comment_start) + '\\s*'), function(str){
        caret_pos -= str.length;
        return '';
      }).replace(new RegExp('\\s*' + escapeForRegexp(comment_end) + '$'), '');
  }
  
  function hasMatch(str, start) {
    return content.substr(start, str.length) == str;
  }
    
  // first, we need to make sure that this substring is not inside 
  // comment
  var comment_range = searchComment(content, caret_pos, comment_start, comment_end);
  
  if (comment_range && comment_range[0] <= range_start && comment_range[1] >= range_end) {
    // we're inside comment, remove it
    range_start = comment_range[0];
    range_end = comment_range[1];
    
    new_content = removeComment(content.substring(range_start, range_end));
  } else {
    // should add comment
    // make sure that there's no comment inside selection
    new_content = comment_start + ' ' + 
      content.substring(range_start, range_end)
        .replace(new RegExp(escapeForRegexp(comment_start) + '\\s*|\\s*' + escapeForRegexp(comment_end), 'g'), '') +
      ' ' + comment_end;
      
    // adjust caret position
    caret_pos += comment_start.length + 1;
  }

  // replace editor content
  if (new_content !== null) {
    editor.setCaretPos(range_start);
    editor.replaceContent(unindent(editor, new_content), range_start, range_end);
    editor.setCaretPos(caret_pos);
    return true;
  }
  
  return false;
}

/**
 * Splits or joins tag, e.g. transforms it into a short notation and vice versa:<br>
 * &lt;div&gt;&lt;/div&gt; → &lt;div /&gt; : join<br>
 * &lt;div /&gt; → &lt;div&gt;&lt;/div&gt; : split
 * @param {zen_editor} editor Editor instance
 * @param {String} [profile_name] Profile name
 */
function splitJoinTag(editor, profile_name) {
  var caret_pos = editor.getCaretPos(),
    profile = zen_coding.getProfile(String(profile_name || editor.getProfileName())),
    caret = zen_coding.getCaretPlaceholder();

  // find tag at current position
  var pair = zen_coding.html_matcher.getTags(String(editor.getContent()), caret_pos, String(editor.getProfileName()));
  if (pair && pair[0]) {
    var new_content = pair[0].full_tag;
    
    if (pair[1]) { // join tag
      var closing_slash = ' /';
      if (profile.self_closing_tag === true)
        closing_slash = '/';
        
      new_content = new_content.replace(/\s*>$/, closing_slash + '>');
      
      // add caret placeholder
      if (new_content.length + pair[0].start < caret_pos)
        new_content += caret;
      else {
        var d = caret_pos - pair[0].start;
        new_content = new_content.substring(0, d) + caret + new_content.substring(d);
      }
      
      editor.replaceContent(new_content, pair[0].start, pair[1].end);
    } else { // split tag
      var nl = zen_coding.getNewline(),
        pad = zen_coding.getVariable('indentation');
      
      // define tag content depending on profile
      var tag_content = (profile.tag_nl === true)
          ? nl + pad +caret + nl
          : caret;
          
      new_content = new_content.replace(/\s*\/>$/, '>') + tag_content + '</' + pair[0].name + '>';
      editor.replaceContent(new_content, pair[0].start, pair[0].end);
    }
    
    return true;
  } else {
    return false;
  }
}

/**
 * Returns line bounds for specific character position
 * @param {String} text
 * @param {Number} from Where to start searching
 * @return {Object}
 */
function getLineBounds(text, from) {
  var len = text.length,
    start = 0,
    end = len - 1;
  
  // search left
  for (var i = from - 1; i > 0; i--) {
    var ch = text.charAt(i);
    if (ch == '\n' || ch == '\r') {
      start = i + 1;
      break;
    }
  }
  // search right
  for (var j = from; j < len; j++) {
    var ch = text.charAt(j);
    if (ch == '\n' || ch == '\r') {
      end = j;
      break;
    }
  }
  
  return {start: start, end: end};
}

/**
 * Gracefully removes tag under cursor
 * @param {zen_editor} editor
 */
function removeTag(editor) {
  var caret_pos = editor.getCaretPos(),
    content = String(editor.getContent());
    
  // search for tag
  var pair = zen_coding.html_matcher.getTags(content, caret_pos, String(editor.getProfileName()));
  if (pair && pair[0]) {
    if (!pair[1]) {
      // simply remove unary tag
      editor.replaceContent(zen_coding.getCaretPlaceholder(), pair[0].start, pair[0].end);
    } else {
      var tag_content_range = narrowToNonSpace(content, pair[0].end, pair[1].start),
        start_line_bounds = getLineBounds(content, tag_content_range[0]),
        start_line_pad = getLinePadding(content.substring(start_line_bounds.start, start_line_bounds.end)),
        tag_content = content.substring(tag_content_range[0], tag_content_range[1]);
        
      tag_content = unindentText(tag_content, start_line_pad);
      editor.replaceContent(zen_coding.getCaretPlaceholder() + tag_content, pair[0].start, pair[1].end);
    }
    
    return true;
  } else {
    return false;
  }
}

/**
 * Test if <code>text</code> starts with <code>token</code> at <code>pos</code>
 * position. If <code>pos</code> is ommited, search from beginning of text 
 * @param {String} token Token to test
 * @param {String} text Where to search
 * @param {Number} pos Position where to start search
 * @return {Boolean}
 * @since 0.65
 */
function startsWith(token, text, pos) {
  pos = pos || 0;
  return text.charAt(pos) == token.charAt(0) && text.substr(pos, token.length) == token;
}

/**
 * Encodes/decodes image under cursor to/from base64
 * @param {zen_editor} editor
 * @since 0.65
 */
function encodeDecodeBase64(editor) {
  var data = String(editor.getSelection()),
    caret_pos = editor.getCaretPos();
    
  if (!data) {
    // no selection, try to find image bounds from current caret position
    var text = String(editor.getContent()),
      ch, 
      m;
    while (caret_pos-- >= 0) {
      if (startsWith('src=', text, caret_pos)) { // found <img src="">
        if (m = text.substr(caret_pos).match(/^(src=(["'])?)([^'"<>\s]+)\1?/)) {
          data = m[3];
          caret_pos += m[1].length;
        }
        break;
      } else if (startsWith('url(', text, caret_pos)) { // found CSS url() pattern
        if (m = text.substr(caret_pos).match(/^(url\((['"])?)([^'"\)\s]+)\1?/)) {
          data = m[3];
          caret_pos += m[1].length;
        }
        break;
      }
    }
  }
  
  if (data) {
    if (startsWith('data:', data))
      return decodeFromBase64(editor, data, caret_pos);
    else
      return encodeToBase64(editor, data, caret_pos);
  } else {
    return false;
  }
}

/**
 * Encodes image to base64
 * @requires zen_file
 * 
 * @param {zen_editor} editor
 * @param {String} img_path Path to image
 * @param {Number} pos Caret position where image is located in the editor
 * @return {Boolean}
 */
function encodeToBase64(editor, img_path, pos) {
  var editor_file = editor.getFilePath(),
    default_mime_type = 'application/octet-stream';
    
  if (editor_file === null) {
    throw "You should save your file before using this action";
  }
  
  // locate real image path
  var real_img_path = zen_file.locateFile(editor_file, img_path);
  if (real_img_path === null) {
    throw "Can't find " + img_path + ' file';
  }
  
  var b64 = base64.encode(String(zen_file.read(real_img_path)));
  if (!b64) {
    throw "Can't encode file content to base64";
  }
  
  b64 = 'data:' + (base64.mime_types[String(zen_file.getExt(real_img_path))] || default_mime_type) +
    ';base64,' + b64;
    
  editor.replaceContent('$0' + b64, pos, pos + img_path.length);
  return true;
}

/**
 * Decodes base64 string back to file.
 * @requires zen_editor.prompt
 * @requires zen_file
 * 
 * @param {zen_editor} editor
 * @param {String} data Base64-encoded file content
 * @param {Number} pos Caret position where image is located in the editor
 */
function decodeFromBase64(editor, data, pos) {
  // ask user to enter path to file
  var file_path = String(editor.prompt('Enter path to file (absolute or relative)'));
  if (!file_path)
    return false;
    
  var abs_path = zen_file.createPath(editor.getFilePath(), file_path);
  if (!abs_path) {
    throw "Can't save file";
  }
  
  zen_file.save(abs_path, base64.decode( data.replace(/^data\:.+?;.+?,/, '') ));
  editor.replaceContent('$0' + file_path, pos, pos + data.length);
  return true;
}

/**
 * Make decimal number look good: convert it to fixed precision end remove
 * traling zeroes 
 * @param {Number} num
 * @param {Number} [fracion] Fraction numbers (default is 2)
 * @return {String}
 */
function prettifyNumber(num, fraction) {
  return num.toFixed(typeof fraction == 'undefined' ? 2 : fraction).replace(/\.?0+$/, '');
}

/**
 * Find expression bounds in current editor at caret position. 
 * On each character a <code>fn</code> function will be caller which must 
 * return <code>true</code> if current character meets requirements, 
 * <code>false</code> otherwise
 * @param {zen_editor} editor
 * @param {Function} fn Function to test each character of expression
 * @return {Array} If expression found, returns array with start and end 
 * positions 
 */
function findExpressionBounds(editor, fn) {
  var content = String(editor.getContent()),
    il = content.length,
    expr_start = editor.getCaretPos() - 1,
    expr_end = expr_start + 1;
    
  // start by searching left
  while (expr_start >= 0 && fn(content.charAt(expr_start), expr_start, content)) expr_start--;
  
  // then search right
  while (expr_end < il && fn(content.charAt(expr_end), expr_end, content)) expr_end++;
  
  return expr_end > expr_start ? [++expr_start, expr_end] : null;
}

/**
 * Extract number from current caret position of the <code>editor</code> and
 * increment it by <code>step</code>
 * @param {zen_editor} editor
 * @param {Number} step Increment step (may be negative)
 */
function incrementNumber(editor, step) {
  var content = String(editor.getContent()),
    has_sign = false,
    has_decimal = false;
    
  var r = findExpressionBounds(editor, function(ch) {
    if (zen_coding.isNumeric(ch))
      return true;
    if (ch == '.')
      return has_decimal ? false : has_decimal = true;
    if (ch == '-')
      return has_sign ? false : has_sign = true;
      
    return false;
  });
    
  if (r) {
    var num = parseFloat(content.substring(r[0], r[1]));
    if (!isNaN(num)) {
      num = prettifyNumber(num + step);
      editor.replaceContent(num, r[0], r[1]);
      editor.createSelection(r[0], r[0] + num.length);
      return true;
    }
  }
  
  return false;
}

/**
 * Evaluates simple math expresison under caret
 * @param {zen_editor} editor
 */
function evaluateMathExpression(editor) {
  var content = String(editor.getContent()),
    chars = '.+-*/\\';
    
  var r = findExpressionBounds(editor, function(ch) {
    return zen_coding.isNumeric(ch) || chars.indexOf(ch) != -1;
  });
    
  if (r) {
    var expr = content.substring(r[0], r[1]);
    
    // replace integral division: 11\2 => Math.round(11/2) 
    expr = expr.replace(/([\d\.\-]+)\\([\d\.\-]+)/g, 'Math.round($1/$2)');
    
    try {
      var result = new Function('return ' + expr)();
      result = prettifyNumber(result);
      editor.replaceContent(result, r[0], r[1]);
      editor.setCaretPos(r[0] + result.length);
      return true;
    } catch (e) {}
  }
  
  return false;
}

// register all actions
zen_coding.registerAction('expand_abbreviation', expandAbbreviation);
zen_coding.registerAction('expand_abbreviation_with_tab', expandAbbreviationWithTab);
zen_coding.registerAction('match_pair', matchPair);
zen_coding.registerAction('match_pair_inward', function(editor){
  matchPair(editor, 'in');
});

zen_coding.registerAction('match_pair_outward', function(editor){
  matchPair(editor, 'out');
});
zen_coding.registerAction('wrap_with_abbreviation', wrapWithAbbreviation);
zen_coding.registerAction('prev_edit_point', prevEditPoint);
zen_coding.registerAction('next_edit_point', nextEditPoint);
zen_coding.registerAction('insert_formatted_line_break', insertFormattedNewline);
zen_coding.registerAction('insert_formatted_line_break_only', insertFormattedNewlineOnly);
zen_coding.registerAction('select_line', selectLine);
zen_coding.registerAction('matching_pair', goToMatchingPair);
zen_coding.registerAction('merge_lines', mergeLines);
zen_coding.registerAction('toggle_comment', toggleComment);
zen_coding.registerAction('split_join_tag', splitJoinTag);
zen_coding.registerAction('remove_tag', removeTag);
zen_coding.registerAction('encode_decode_data_url', encodeDecodeBase64);
//zen_coding.registerAction('update_image_size', updateImageSize);

zen_coding.registerAction('increment_number_by_1', function(editor) {
  return incrementNumber(editor, 1);
});

zen_coding.registerAction('decrement_number_by_1', function(editor) {
  return incrementNumber(editor, -1);
});

zen_coding.registerAction('increment_number_by_10', function(editor) {
  return incrementNumber(editor, 10);
});

zen_coding.registerAction('decrement_number_by_10', function(editor) {
  return incrementNumber(editor, -10);
});

zen_coding.registerAction('increment_number_by_01', function(editor) {
  return incrementNumber(editor, 0.1);
});

zen_coding.registerAction('decrement_number_by_01', function(editor) {
  return incrementNumber(editor, -0.1);
});

zen_coding.registerAction('evaluate_math_expression', evaluateMathExpression);
/**
 * @author Sergey Chikuyonok (serge.che@gmail.com)
 * @link http://chikuyonok.ru
 */
(function(){
  // Regular Expressions for parsing tags and attributes
  var start_tag = /^<([\w\:\-]+)((?:\s+[\w\-:]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/,
    end_tag = /^<\/([\w\:\-]+)[^>]*>/,
    attr = /([\w\-:]+)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g;
    
  // Empty Elements - HTML 4.01
  var empty = makeMap("area,base,basefont,br,col,frame,hr,img,input,isindex,link,meta,param,embed");

  // Block Elements - HTML 4.01
  var block = makeMap("address,applet,blockquote,button,center,dd,dir,div,dl,dt,fieldset,form,frameset,hr,iframe,isindex,li,map,menu,noframes,noscript,object,ol,p,pre,script,table,tbody,td,tfoot,th,thead,tr,ul");

  // Inline Elements - HTML 4.01
  var inline = makeMap("a,abbr,acronym,applet,b,basefont,bdo,big,br,button,cite,code,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,select,small,span,strike,strong,sub,sup,textarea,tt,u,var");

  // Elements that you can, intentionally, leave open
  // (and which close themselves)
  var close_self = makeMap("colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr");
  
  /** Current matching mode */
  var cur_mode = 'xhtml';
  
  /** Last matched HTML pair */
  var last_match = {
    opening_tag: null, // tag() or comment() object
    closing_tag: null, // tag() or comment() object
    start_ix: -1,
    end_ix: -1
  };
  
  function setMode(new_mode) {
    if (!new_mode || new_mode != 'html')
      new_mode = 'xhtml';
      
    cur_mode = new_mode;
  }
  
  function tag(match, ix) {
    var name = match[1].toLowerCase();
    return  {
      name: name,
      full_tag: match[0],
      start: ix,
      end: ix + match[0].length,
      unary: Boolean(match[3]) || (name in empty && cur_mode == 'html'),
      has_close: Boolean(match[3]),
      type: 'tag',
      close_self: (name in close_self && cur_mode == 'html')
    };
  }
  
  function comment(start, end) {
    return {
      start: start,
      end: end,
      type: 'comment'
    };
  }
  
  function makeMap(str){
    var obj = {}, items = str.split(",");
    for ( var i = 0; i < items.length; i++ )
      obj[ items[i] ] = true;
    return obj;
  }
  
  /**
   * Makes selection ranges for matched tag pair
   * @param {tag} opening_tag
   * @param {tag} closing_tag
   * @param {Number} ix
   */
  function makeRange(opening_tag, closing_tag, ix) {
    ix = ix || 0;
    
    var start_ix = -1, 
      end_ix = -1;
    
    if (opening_tag && !closing_tag) { // unary element
      start_ix = opening_tag.start;
      end_ix = opening_tag.end;
    } else if (opening_tag && closing_tag) { // complete element
      if (
        (opening_tag.start < ix && opening_tag.end > ix) || 
        (closing_tag.start <= ix && closing_tag.end > ix)
      ) {
        start_ix = opening_tag.start;
        end_ix = closing_tag.end;
      } else {
        start_ix = opening_tag.end;
        end_ix = closing_tag.start;
      }
    }
    
    return [start_ix, end_ix];
  }
  
  /**
   * Save matched tag for later use and return found indexes
   * @param {tag} opening_tag
   * @param {tag} closing_tag
   * @param {Number} ix
   * @return {Array}
   */
  function saveMatch(opening_tag, closing_tag, ix) {
    ix = ix || 0;
    last_match.opening_tag = opening_tag; 
    last_match.closing_tag = closing_tag;
    
    var range = makeRange(opening_tag, closing_tag, ix);
    last_match.start_ix = range[0];
    last_match.end_ix = range[1];
    
    return last_match.start_ix != -1 ? [last_match.start_ix, last_match.end_ix] : null;
  }
  
  /**
   * Handle unary tag: find closing tag if needed
   * @param {String} text
   * @param {Number} ix
   * @param {tag} open_tag
   * @return {tag|null} Closing tag (or null if not found) 
   */
  function handleUnaryTag(text, ix, open_tag) {
    if (open_tag.has_close)
      return null;
    else {
      // TODO finish this method
    }
  }
  
  /**
   * Search for matching tags in <code>html</code>, starting from 
   * <code>start_ix</code> position
   * @param {String} html Code to search
   * @param {Number} start_ix Character index where to start searching pair 
   * (commonly, current caret position)
   * @param {Function} action Function that creates selection range
   * @return {Array|null}
   */
  function findPair(html, start_ix, mode, action) {
    action = action || makeRange;
    setMode(mode);
    
    var forward_stack = [],
      backward_stack = [],
      /** @type {tag()} */
      opening_tag = null,
      /** @type {tag()} */
      closing_tag = null,
      range = null,
      html_len = html.length,
      m,
      ix,
      tmp_tag;
      
    forward_stack.last = backward_stack.last = function() {
      return this[this.length - 1];
    }
    
    function hasMatch(str, start) {
      if (arguments.length == 1)
        start = ix;
      return html.substr(start, str.length) == str;
    }
    
    function searchCommentStart(from) {
      while (from--) {
        if (html.charAt(from) == '<' && hasMatch('<!--', from))
          break;
      }
      
      return from;
    }
    
    // find opening tag
    ix = start_ix;
    while (ix-- && ix >= 0) {
      var ch = html.charAt(ix);
      if (ch == '<') {
        var check_str = html.substring(ix, html_len);
        
        if ( (m = check_str.match(end_tag)) ) { // found closing tag
          tmp_tag = tag(m, ix);
          if (tmp_tag.start < start_ix && tmp_tag.end > start_ix) // direct hit on searched closing tag
            closing_tag = tmp_tag;
          else
            backward_stack.push(tmp_tag);
        } else if ( (m = check_str.match(start_tag)) ) { // found opening tag
          tmp_tag = tag(m, ix);
          
          if (tmp_tag.unary) {
            if (tmp_tag.start < start_ix && tmp_tag.end > start_ix) // exact match
              // TODO handle unary tag 
              return action(tmp_tag, null, start_ix);
          } else if (backward_stack.last() && backward_stack.last().name == tmp_tag.name) {
            backward_stack.pop();
          } else { // found nearest unclosed tag
            opening_tag = tmp_tag;
            break;
          }
        } else if (check_str.indexOf('<!--') == 0) { // found comment start
          var end_ix = check_str.search('-->') + ix + 3;
          if (ix < start_ix && end_ix >= start_ix)
            return action( comment(ix, end_ix) );
        }
      } else if (ch == '-' && hasMatch('-->')) { // found comment end
        // search left until comment start is reached
        ix = searchCommentStart(ix);
      }
    }
    
    if (!opening_tag)
      return action(null);
    
    // find closing tag
    if (!closing_tag) {
      for (ix = start_ix; ix < html_len; ix++) {
        var ch = html.charAt(ix);
        if (ch == '<') {
          var check_str = html.substring(ix, html_len);
          
          if ( (m = check_str.match(start_tag)) ) { // found opening tag
            tmp_tag = tag(m, ix);
            if (!tmp_tag.unary)
              forward_stack.push( tmp_tag );
          } else if ( (m = check_str.match(end_tag)) ) { // found closing tag
            var tmp_tag = tag(m, ix);
            if (forward_stack.last() && forward_stack.last().name == tmp_tag.name)
              forward_stack.pop();
            else { // found matched closing tag
              closing_tag = tmp_tag;
              break;
            }
          } else if (hasMatch('<!--')) { // found comment
            ix += check_str.search('-->') + 2;
          }
        } else if (ch == '-' && hasMatch('-->')) {
          // looks like cursor was inside comment with invalid HTML
          if (!forward_stack.last() || forward_stack.last().type != 'comment') {
            var end_ix = ix + 3;
            return action(comment( searchCommentStart(ix), end_ix ));
          }
        }
      }
    }
    
    return action(opening_tag, closing_tag, start_ix);
  }
  
  /**
   * Search for matching tags in <code>html</code>, starting 
   * from <code>start_ix</code> position. The result is automatically saved in 
   * <code>last_match</code> property
   * 
   * @return {Array|null}
   */
  var HTMLPairMatcher = function(/* String */ html, /* Number */ start_ix, /*  */ mode){
    return findPair(html, start_ix, mode, saveMatch);
  }
  
  HTMLPairMatcher.start_tag = start_tag;
  HTMLPairMatcher.end_tag = end_tag;
  
  /**
   * Search for matching tags in <code>html</code>, starting from 
   * <code>start_ix</code> position. The difference between 
   * <code>HTMLPairMatcher</code> function itself is that <code>find</code> 
   * method doesn't save matched result in <code>last_match</code> property.
   * This method is generally used for lookups 
   */
  HTMLPairMatcher.find = function(html, start_ix, mode) {
    return findPair(html, start_ix, mode);
  };
  
  /**
   * Search for matching tags in <code>html</code>, starting from 
   * <code>start_ix</code> position. The difference between 
   * <code>HTMLPairMatcher</code> function itself is that <code>getTags</code> 
   * method doesn't save matched result in <code>last_match</code> property 
   * and returns array of opening and closing tags
   * This method is generally used for lookups 
   */
  HTMLPairMatcher.getTags = function(html, start_ix, mode) {
    return findPair(html, start_ix, mode, function(opening_tag, closing_tag){
      return [opening_tag, closing_tag];
    });
  };
  
  HTMLPairMatcher.last_match = last_match;
  
  try {
    zen_coding.html_matcher = HTMLPairMatcher;
  } catch(e){}
  
})();/**
 * Comment important tags (with 'id' and 'class' attributes)
 * @author Sergey Chikuyonok (serge.che@gmail.com)
 * @link http://chikuyonok.ru
 */
(function(){
  /**
   * Add comments to tag
   * @param {ZenNode} node
   */
  function addComments(node, i) {
    var id_attr = node.getAttribute('id'),
      class_attr = node.getAttribute('class'),
      nl = zen_coding.getNewline();
      
    if (id_attr || class_attr) {
      var comment_str = '',
        padding = (node.parent) ? node.parent.padding : '';
      if (id_attr) comment_str += '#' + id_attr;
      if (class_attr) comment_str += '.' + class_attr;
      
      node.start = node.start.replace(/</, '<!-- ' + comment_str + ' -->' + nl + padding + '<');
      node.end = node.end.replace(/>/, '>' + nl + padding + '<!-- /' + comment_str + ' -->');
      
      // replace counters
      var counter = zen_coding.getCounterForNode(node);
      node.start = zen_coding.replaceCounter(node.start, counter);
      node.end = zen_coding.replaceCounter(node.end, counter);
    }
  }
  
  function process(tree, profile) {
    if (profile.tag_nl === false)
      return tree;
      
    for (var i = 0, il = tree.children.length; i < il; i++) {
      /** @type {ZenNode} */
      var item = tree.children[i];
      
      if (item.isBlock())
        addComments(item, i);
      
      process(item, profile);
    }
    
    return tree;
  }
  
  zen_coding.registerFilter('c', process);
})();/**
 * Process CSS properties: replaces snippets, augumented with ! char, with 
 * <em>!important</em> suffix 
 * @author Sergey Chikuyonok (serge.che@gmail.com)
 * @link http://chikuyonok.ru
 */
(function(){
  var re_important = /(.+)\!$/;
  function process(tree, profile) {
    for (var i = 0, il = tree.children.length; i < il; i++) {
      /** @type {ZenNode} */
      var item = tree.children[i];
      
      // CSS properties are always snippets
      if (item.type == 'snippet' && re_important.test(item.real_name)) {
        item.start = item.start.replace(/(;?)$/, ' !important$1');
      }
      
      process(item, profile);
    }
    
    return tree;
  }
  
  zen_coding.registerFilter('css', process);
})();/**
 * Filter for escaping unsafe XML characters: <, >, &
 * @author Sergey Chikuyonok (serge.che@gmail.com)
 * @link http://chikuyonok.ru
 */
(function(){
  var char_map = {
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;'
  }
  
  function escapeChars(str) {
    return str.replace(/([<>&])/g, function(str, p1){
      return char_map[p1];
    });
  }
  
  function process(tree, profile, level) {
    for (var i = 0, il = tree.children.length; i < il; i++) {
      /** @type {ZenNode} */
      var item = tree.children[i];
      
      item.start = escapeChars(item.start);
      item.end = escapeChars(item.end);
      
      process(item);
    }
    
    return tree;
  }
  
  zen_coding.registerFilter('e', process);
})();/**
 * Format CSS properties: add space after property name:
 * padding:0; → padding: 0;
 * @author Sergey Chikuyonok (serge.che@gmail.com)
 * @link http://chikuyonok.ru
 */
(function(){
  function process(tree, profile) {
    for (var i = 0, il = tree.children.length; i < il; i++) {
      /** @type {ZenNode} */
      var item = tree.children[i];
      
      // CSS properties are always snippets 
      if (item.type == 'snippet') {
        item.start = item.start.replace(/([\w\-]+\s*:)(?!:)\s*/, '$1 ');
      }
      
      process(item, profile);
    }
    
    return tree;
  }
  
  zen_coding.registerFilter('fc', process);
})();/**
 * Generic formatting filter: creates proper indentation for each tree node,
 * placing "%s" placeholder where the actual output should be. You can use
 * this filter to preformat tree and then replace %s placeholder to whatever you
 * need. This filter should't be called directly from editor as a part 
 * of abbreviation.
 * @author Sergey Chikuyonok (serge.che@gmail.com)
 * @link http://chikuyonok.ru
 * 
 * @include "../zen_coding.js"
 */
(function(){
  var child_token = '${child}',
    placeholder = '%s';
  
  function getNewline() {
    return zen_coding.getNewline();
  }
  
  function getIndentation() {
    return zen_resources.getVariable('indentation');
  }
  
  /**
   * Test if passed node has block-level sibling element
   * @param {ZenNode} item
   * @return {Boolean}
   */
  function hasBlockSibling(item) {
    return (item.parent && item.parent.hasBlockChildren());
  }
  
  /**
   * Test if passed itrem is very first child of the whole tree
   * @param {ZenNode} tree
   */
  function isVeryFirstChild(item) {
    return item.parent && !item.parent.parent && !item.previousSibling;
  }
  
  /**
   * Need to add line break before element
   * @param {ZenNode} node
   * @param {Object} profile
   * @return {Boolean}
   */
  function shouldBreakLine(node, profile) {
    if (!profile.inline_break)
      return false;
      
    // find toppest non-inline sibling
    while (node.previousSibling && node.previousSibling.isInline())
      node = node.previousSibling;
    
    if (!node.isInline())
      return false;
      
    // calculate how many inline siblings we have
    var node_count = 1;
    while (node = node.nextSibling) {
      if (node.type == 'text' || !node.isInline())
        node_count = 0;
      else if (node.isInline())
        node_count++;
    }
    
    return node_count >= profile.inline_break;
  }
  
  /**
   * Need to add newline because <code>item</code> has too many inline children
   * @param {ZenNode} node
   * @param {Object} profile
   */
  function shouldBreakChild(node, profile) {
    // we need to test only one child element, because 
    // hasBlockChildren() method will do the rest
    return (node.children.length && shouldBreakLine(node.children[0], profile));
  }
  
  /**
   * Processes element with <code>snippet</code> type
   * @param {ZenNode} item
   * @param {Object} profile
   * @param {Number} [level] Depth level
   */
  function processSnippet(item, profile, level) {
    var data = item.source.value;
      
    if (!data)
      // snippet wasn't found, process it as tag
      return processTag(item, profile, level);
      
    item.start = item.end = placeholder;
    
    var padding = (item.parent) 
      ? item.parent.padding
      : zen_coding.repeatString(getIndentation(), level);
    
    if (!isVeryFirstChild(item)) {
      item.start = getNewline() + padding + item.start;
    }
    
    // adjust item formatting according to last line of <code>start</code> property
    var parts = data.split(child_token),
      lines = zen_coding.splitByLines(parts[0] || ''),
      padding_delta = getIndentation();
      
    if (lines.length > 1) {
      var m = lines[lines.length - 1].match(/^(\s+)/);
      if (m)
        padding_delta = m[1];
    }
    
    item.padding = padding + padding_delta;
    
    return item;
  }
  
  /**
   * Processes element with <code>tag</code> type
   * @param {ZenNode} item
   * @param {Object} profile
   * @param {Number} [level] Depth level
   */
  function processTag(item, profile, level) {
    if (!item.name)
      // looks like it's a root element
      return item;
    
    item.start = item.end = placeholder;
    
    var is_unary = (item.isUnary() && !item.children.length);
      
    // formatting output
    if (profile.tag_nl !== false) {
      var padding = (item.parent) 
          ? item.parent.padding
          : zen_coding.repeatString(getIndentation(), level),
        force_nl = (profile.tag_nl === true),
        should_break = shouldBreakLine(item, profile);
      
      // formatting block-level elements
      if (item.type != 'text') {
        if (( (item.isBlock() || should_break) && item.parent) || force_nl) {
          // snippet children should take different formatting
          if (!item.parent || (item.parent.type != 'snippet' && !isVeryFirstChild(item)))
            item.start = getNewline() + padding + item.start;
            
          if (item.hasBlockChildren() || shouldBreakChild(item, profile) || (force_nl && !is_unary))
            item.end = getNewline() + padding + item.end;
            
          if (item.hasTagsInContent() || (force_nl && !item.hasChildren() && !is_unary))
            item.start += getNewline() + padding + getIndentation();
          
        } else if (item.isInline() && hasBlockSibling(item) && !isVeryFirstChild(item)) {
          item.start = getNewline() + padding + item.start;
        } else if (item.isInline() && item.hasBlockChildren()) {
          item.end = getNewline() + padding + item.end;
        }
        
        item.padding = padding + getIndentation();
      }
    }
    
    return item;
  }
  
  /**
   * Processes simplified tree, making it suitable for output as HTML structure
   * @param {ZenNode} tree
   * @param {Object} profile
   * @param {Number} [level] Depth level
   */
  function process(tree, profile, level) {
    level = level || 0;
    
    for (var i = 0, il = tree.children.length; i < il; i++) {
      /** @type {ZenNode} */
      var item = tree.children[i];
      item = (item.type == 'tag') 
        ? processTag(item, profile, level) 
        : processSnippet(item, profile, level);
        
      if (item.content)
        item.content = zen_coding.padString(item.content, item.padding);
        
      process(item, profile, level + 1);
    }
    
    return tree;
  }
  
  zen_coding.registerFilter('_format', process);
})();/**
 * Filter that produces HAML tree
 * @author Sergey Chikuyonok (serge.che@gmail.com)
 * @link http://chikuyonok.ru
 * 
 * @include "../zen_coding.js"
 */
(function(){
  var child_token = '${child}';
  
  /**
   * Creates HTML attributes string from tag according to profile settings
   * @param {ZenNode} tag
   * @param {default_profile} profile
   */
  function makeAttributesString(tag, profile) {
    // make attribute string
    var attrs = '',
      attr_quote = profile.attr_quotes == 'single' ? "'" : '"',
      cursor = profile.place_cursor ? zen_coding.getCaretPlaceholder() : '',
      attr_name, 
      i,
      a;
      
    // use short notation for ID and CLASS attributes
    for (i = 0; i < tag.attributes.length; i++) {
      a = tag.attributes[i];
      switch (a.name.toLowerCase()) {
        case 'id':
          attrs += '#' + (a.value || cursor);
          break;
        case 'class':
          attrs += '.' + (a.value || cursor);
          break;
      }
    }
    
    var other_attrs = [];
    
    // process other attributes
    for (i = 0; i < tag.attributes.length; i++) {
      a = tag.attributes[i];
      var attr_name_lower = a.name.toLowerCase();
      if (attr_name_lower != 'id' && attr_name_lower != 'class') {
        attr_name = (profile.attr_case == 'upper') ? a.name.toUpperCase() : attr_name_lower;
        other_attrs.push(':' +attr_name + ' => ' + attr_quote + (a.value || cursor) + attr_quote);
      }
    }
    
    if (other_attrs.length)
      attrs += '{' + other_attrs.join(', ') + '}';
    
    return attrs;
  }
  
  /**
   * Processes element with <code>snippet</code> type
   * @param {ZenNode} item
   * @param {Object} profile
   * @param {Number} [level] Depth level
   */
  function processSnippet(item, profile, level) {
    var data = item.source.value;
      
    if (!data)
      // snippet wasn't found, process it as tag
      return processTag(item, profile, level);
      
    var parts = data.split(child_token),
      start = parts[0] || '',
      end = parts[1] || '',
      padding = item.parent ? item.parent.padding : '';
      
    item.start = item.start.replace('%s', zen_coding.padString(start, padding));
    item.end = item.end.replace('%s', zen_coding.padString(end, padding));
    
    // replace variables ID and CLASS
    var cb = function(str, var_name) {
      if (var_name == 'id' || var_name == 'class')
        return item.getAttribute(var_name);
      else
        return str;
    };
    item.start = zen_coding.replaceVariables(item.start, cb);
    item.end = zen_coding.replaceVariables(item.end, cb);
    
    return item;
  }
  
  /**
   * Test if passed node has block-level sibling element
   * @param {ZenNode} item
   * @return {Boolean}
   */
  function hasBlockSibling(item) {
    return (item.parent && item.parent.hasBlockChildren());
  }
  
  /**
   * Processes element with <code>tag</code> type
   * @param {ZenNode} item
   * @param {Object} profile
   * @param {Number} [level] Depth level
   */
  function processTag(item, profile, level) {
    if (!item.name)
      // looks like it's root element
      return item;
    
    var attrs = makeAttributesString(item, profile), 
      content = '', 
      cursor = profile.place_cursor ? zen_coding.getCaretPlaceholder() : '',
      self_closing = '',
      is_unary = (item.isUnary() && !item.children.length),
      start= '',
      end = '';
    
    if (profile.self_closing_tag && is_unary)
      self_closing = '/';
      
    // define tag name
    var tag_name = '%' + ((profile.tag_case == 'upper') ? item.name.toUpperCase() : item.name.toLowerCase());
    if (tag_name.toLowerCase() == '%div' && attrs && attrs.indexOf('{') == -1)
      // omit div tag
      tag_name = '';
      
    item.end = '';
    start = tag_name + attrs + self_closing;
    
    var placeholder = '%s';
    // We can't just replace placeholder with new value because
    // JavaScript will treat double $ character as a single one, assuming
    // we're using RegExp literal. 
    var pos = item.start.indexOf(placeholder);
    item.start = item.start.substring(0, pos) + start + item.start.substring(pos + placeholder.length);
    
    if (!item.children.length && !is_unary)
      item.start += cursor;
    
    return item;
  }
  
  /**
   * Processes simplified tree, making it suitable for output as HTML structure
   * @param {ZenNode} tree
   * @param {Object} profile
   * @param {Number} [level] Depth level
   */
  function process(tree, profile, level) {
    level = level || 0;
    if (level == 0)
      // preformat tree
      tree = zen_coding.runFilters(tree, profile, '_format');
    
    for (var i = 0, il = tree.children.length; i < il; i++) {
      /** @type {ZenNode} */
      var item = tree.children[i];
      item = (item.type == 'tag') 
        ? processTag(item, profile, level) 
        : processSnippet(item, profile, level);
      
      // replace counters
      var counter = zen_coding.getCounterForNode(item);
      item.start = zen_coding.unescapeText(zen_coding.replaceCounter(item.start, counter));
      item.end = zen_coding.unescapeText(zen_coding.replaceCounter(item.end, counter));
      
      process(item, profile, level + 1);
    }
    
    return tree;
  }
  
  zen_coding.registerFilter('haml', process);
})();/**
 * Filter that produces HTML tree
 * @author Sergey Chikuyonok (serge.che@gmail.com)
 * @link http://chikuyonok.ru
 * 
 * @include "../zen_coding.js"
 */
(function(){
  var child_token = '${child}',
    tabstops = 0;
    
  /**
   * Returns proper string case, depending on profile value
   * @param {String} val String to process
   * @param {String} case_param Profile's case value ('lower', 'upper', 'leave')
   */
  function processStringCase(val, case_param) {
    switch (String(case_param || '').toLowerCase()) {
      case 'lower':
        return val.toLowerCase();
      case 'upper':
        return val.toUpperCase();
    }
    
    return val;
  }
  
  /**
   * Creates HTML attributes string from tag according to profile settings
   * @param {ZenNode} tag
   * @param {default_profile} profile
   */
  function makeAttributesString(tag, profile) {
    // make attribute string
    var attrs = '',
      attr_quote = profile.attr_quotes == 'single' ? "'" : '"',
      cursor = profile.place_cursor ? zen_coding.getCaretPlaceholder() : '',
      attr_name;
      
    for (var i = 0; i < tag.attributes.length; i++) {
      var a = tag.attributes[i];
      attr_name = processStringCase(a.name, profile.attr_case);
      attrs += ' ' + attr_name + '=' + attr_quote + (a.value || cursor) + attr_quote;
    }
    
    return attrs;
  }
  
  /**
   * Processes element with <code>snippet</code> type
   * @param {ZenNode} item
   * @param {Object} profile
   * @param {Number} [level] Depth level
   */
  function processSnippet(item, profile, level) {
    var data = item.source.value;
      
    if (!data)
      // snippet wasn't found, process it as tag
      return processTag(item, profile, level);
      
    var parts = data.split(child_token),
      start = parts[0] || '',
      end = parts[1] || '',
      padding = item.parent ? item.parent.padding : '';
      
      
    item.start = item.start.replace('%s', zen_coding.padString(start, padding));
    item.end = item.end.replace('%s', zen_coding.padString(end, padding));
    
    // replace variables ID and CLASS
    var cb = function(str, var_name) {
      if (var_name == 'id' || var_name == 'class')
        return item.getAttribute(var_name);
      else
        return str;
    };
    item.start = zen_coding.replaceVariables(item.start, cb);
    item.end = zen_coding.replaceVariables(item.end, cb);
    
    return item;
  }
  
  /**
   * Test if passed node has block-level sibling element
   * @param {ZenNode} item
   * @return {Boolean}
   */
  function hasBlockSibling(item) {
    return (item.parent && item.parent.hasBlockChildren());
  }
  
  /**
   * Processes element with <code>tag</code> type
   * @param {ZenNode} item
   * @param {Object} profile
   * @param {Number} [level] Depth level
   */
  function processTag(item, profile, level) {
    if (!item.name)
      // looks like it's root element
      return item;
    
    var attrs = makeAttributesString(item, profile), 
      content = '', 
      cursor = profile.place_cursor ? zen_coding.getCaretPlaceholder() : '',
      self_closing = '',
      is_unary = (item.isUnary() && !item.children.length),
      start= '',
      end = '';
    
    if (profile.self_closing_tag == 'xhtml')
      self_closing = ' /';
    else if (profile.self_closing_tag === true)
      self_closing = '/';
      
    // define opening and closing tags
    if (item.type != 'text') {
      var tag_name = processStringCase(item.name, profile.tag_case);
      if (is_unary) {
        start = '<' + tag_name + attrs + self_closing + '>';
        item.end = '';
      } else {
        start = '<' + tag_name + attrs + '>';
        end = '</' + tag_name + '>';
      }
    }
    
    var placeholder = '%s';
    // We can't just replace placeholder with new value because
    // JavaScript will treat double $ character as a single one, assuming
    // we're using RegExp literal. 
    var pos = item.start.indexOf(placeholder);
    item.start = item.start.substring(0, pos) + start + item.start.substring(pos + placeholder.length);
    
    pos = item.end.indexOf(placeholder);
    item.end = item.end.substring(0, pos) + end + item.end.substring(pos + placeholder.length);
    
    if (!item.children.length && !is_unary && item.content.indexOf(cursor) == -1)
      item.start += cursor;
    
    return item;
  }
  
  /**
   * Processes simplified tree, making it suitable for output as HTML structure
   * @param {ZenNode} tree
   * @param {Object} profile
   * @param {Number} [level] Depth level
   */
  function process(tree, profile, level) {
    level = level || 0;
    if (level == 0) {
      tree = zen_coding.runFilters(tree, profile, '_format');
      tabstops = 0;
    }
    
    for (var i = 0, il = tree.children.length; i < il; i++) {
      /** @type {ZenNode} */
  
      var item = tree.children[i];
      item = (item.type == 'tag') 
        ? processTag(item, profile, level) 
        : processSnippet(item, profile, level);
      
      // replace counters
      var counter = zen_coding.getCounterForNode(item);
      item.start = zen_coding.unescapeText(zen_coding.replaceCounter(item.start, counter));
      item.end = zen_coding.unescapeText(zen_coding.replaceCounter(item.end, counter));
      item.content = zen_coding.unescapeText(zen_coding.replaceCounter(item.content, counter));
      
      tabstops += zen_coding.upgradeTabstops(item, tabstops) + 1;
      
      process(item, profile, level + 1);
    }
    
    return tree;
  }
  
  zen_coding.registerFilter('html', process);
})();/**
 * Output abbreviation on a single line (i.e. no line breaks)
 * @author Sergey Chikuyonok (serge.che@gmail.com)
 * @link http://chikuyonok.ru
 */
(function(){
  function process(tree, profile, level) {
    for (var i = 0, il = tree.children.length; i < il; i++) {
      /** @type {ZenNode} */
      var item = tree.children[i];
      if (item.type == 'tag') {
        // remove padding from item 
        var re_pad = /^\s+/;
        item.start = item.start.replace(re_pad, '');
        item.end = item.end.replace(re_pad, '');
      }
      
      // remove newlines 
      var re_nl = /[\n\r]/g;
      item.start = item.start.replace(re_nl, '');
      item.end = item.end.replace(re_nl, '');
      item.content = item.content.replace(re_nl, '');
      
      process(item);
    }
    
    return tree;
  }
  
  zen_coding.registerFilter('s', process);
})();
/**
 * Trim filter: removes characters at the beginning of the text
 *  content that indicates lists: numbers, #, *, -, etc.
 * @author Sergey Chikuyonok (serge.che@gmail.com)
 * @link http://chikuyonok.ru
 */
(function(){
  function process(tree, profile, level) {
    for (var i = 0, il = tree.children.length; i < il; i++) {
      /** @type {ZenNode} */
      var item = tree.children[i];
      
      if (item.content)
        item.content = item.content.replace(/^([\s|\u00a0])?[\d|#|\-|\*|\u2022]+\.?\s*/, '$1');
      
      process(item);
    }
    
    return tree;
  }
  
  zen_coding.registerFilter('t', process);
})();
/**
 * Filter for trimming "select" attributes from some tags that contains
 * child elements
 * @author Sergey Chikuyonok (serge.che@gmail.com)
 * @link http://chikuyonok.ru
 */
(function(){
  var tags = {
    'xsl:variable': 1,
    'xsl:with-param': 1
  };
  
  /**
   * Removes "select" attribute from node
   * @param {ZenNode} node
   */
  function trimAttribute(node) {
    node.start = node.start.replace(/\s+select\s*=\s*(['"]).*?\1/, '');
  }
  
  function process(tree) {
    for (var i = 0, il = tree.children.length; i < il; i++) {
      /** @type {ZenNode} */
      var item = tree.children[i];
      if (item.type == 'tag' && item.name.toLowerCase() in tags && item.children.length)
        trimAttribute(item);
      process(item);
    }
  }
  
  zen_coding.registerFilter('xsl', process);
})();/**
 * Tests if passed keydown/keypress event corresponds to defied shortcut 
 * 
 * Based on http://www.openjs.com/scripts/events/keyboard_shortcuts/
 * By Binny V A
 * License : BSD
 */
var shortcut = (function(){
  var is_opera = !!window.opera,
    is_mac = /mac\s+os/i.test(navigator.userAgent),
    //Work around for stupid Shift key bug created by using lowercase - as a result the shift+num combination was broken
    shift_nums = {
      "`":"~",
      "1":"!",
      "2":"@",
      "3":"#",
      "4":"$",
      "5":"%",
      "6":"^",
      "7":"&",
      "8":"*",
      "9":"(",
      "0":")",
      "-":"_",
      "=":"+",
      ";":":",
      "'":"\"",
      ",":"<",
      ".":">",
      "/":"?",
      "\\":"|"
    },
    
    //Special Keys - and their codes
    special_keys = {
      'esc':27,
      'escape':27,
      'tab':9,
      'space':32,
      'return':13,
      'enter':13,
      'backspace':8,

      'scrolllock':145,
      'scroll_lock':145,
      'scroll':145,
      'capslock':20,
      'caps_lock':20,
      'caps':20,
      'numlock':144,
      'num_lock':144,
      'num':144,
      
      'pause':19,
      'break':19,
      
      'insert':45,
      'home':36,
      'delete':46,
      'end':35,
      
      'pageup':33,
      'page_up':33,
      'pu':33,

      'pagedown':34,
      'page_down':34,
      'pd':34,
      
      'plus': 187,
      'minus': 189,

      'left':37,
      'up':38,
      'right':39,
      'down':40,

      'f1':112,
      'f2':113,
      'f3':114,
      'f4':115,
      'f5':116,
      'f6':117,
      'f7':118,
      'f8':119,
      'f9':120,
      'f10':121,
      'f11':122,
      'f12':123
    },
    
    mac_char_map = {
      'ctrl': '⌃',
      'control': '⌃',
      'meta': '⌘',
      'shift': '⇧',
      'alt': '⌥',
      'enter': '⏎',
      'tab': '⇥',
      'left': '←',
      'right': '→',
      'up': '↑',
      'down': '↓'
    },
    
    pc_char_map = {
      'meta': 'Ctrl',
      'control': 'Ctrl',
      'left': '←',
      'right': '→',
      'up': '↑',
      'down': '↓'
    },
    
    MODIFIERS = {
      SHIFT: 1,
      CTRL:  2,
      ALT:   4,
      META:  8
    };
    
  /**
   * Makes first letter of string in uppercase
   * @param {String} str
   */
  function capitalize(str) {
    return str.charAt().toUpperCase() + str.substring(1);
  }
    
  return {
    /**
     * Compile keyboard combination for faster tests
     * @param {String|Object} combination
     */
    compile: function(combination) {
      if (typeof combination != 'string') //already compiled
        return combination;
        
      var mask = 0,
        keys = combination.toLowerCase().split('+'), 
        key,
        k;
        
      for(var i = 0, il = keys.length; i < il; i++) {
        k = keys[i];
        // Due to stupid Opera bug I have to swap Ctrl and Meta keys
        if (is_mac && is_opera) {
          if (k == 'ctrl' || k == 'control')
            k = 'meta';
          else if (k == 'meta')
            k = 'ctrl';
        } else if (!is_mac && k == 'meta') {
          k = 'ctrl';
        }
        
        //Modifiers
        if(k == 'ctrl' || k == 'control')
          mask |= MODIFIERS.CTRL;
        else if (k == 'shift')
          mask |= MODIFIERS.SHIFT;
        else if (k == 'alt')
          mask |= MODIFIERS.ALT;
        else if (k == 'meta')
          mask |= MODIFIERS.META;
        else
          key = k;
      }
      
      return {
        mask: mask,
        key: key
      };
    },
    
    /**
     * Test shortcut combination against event
     * @param {String} combination Keyboard shortcut
     * @param {Event} evt
     */
    test: function(combination, evt) {
      var mask = 0,
        ccomb = this.compile(combination);
      
      if (evt.ctrlKey)  mask |= MODIFIERS.CTRL;
      if (evt.shiftKey) mask |= MODIFIERS.SHIFT;
      if (evt.altKey)   mask |= MODIFIERS.ALT;
      if (evt.metaKey)  mask |= MODIFIERS.META;
      
      var code = evt.keyCode ? evt.keyCode : evt.which,
        character = String.fromCharCode(code).toLowerCase();
      
      // if mask doesn't match, no need to test further
      if (mask !== ccomb.mask) return false;
      
      if (ccomb.key.length > 1) { //If it is a special key
        return special_keys[ccomb.key] == code;
      } else { //The special keys did not match
        if(code == 188) character = ","; //If the user presses , when the type is onkeydown
        if(code == 190) character = ".";
        if(code == 191) character = "/";
        
        if (character == ccomb.key) return true;
        if (evt.shiftKey && shift_nums[character]) //Stupid Shift key bug created by using lowercase
          return shift_nums[character] == ccomb.key;
      }
      
      return false;
    },
    
    /**
     * Format keystroke for better readability, considering current platform
     * mnemonics
     * @param {String} keystroke
     * @return {String}
     */
    format: function(keystroke) {
      var char_map = is_mac ? mac_char_map : pc_char_map,
        glue = is_mac ? '' : '+',
        keys = keystroke.toLowerCase().split('+'),
        ar = [],
        key;
        
      for (var i = 0; i < keys.length; i++) {
        key = keys[i];
        ar.push(key in char_map ? char_map[key] : capitalize(key));
      }
      
      return ar.join(glue);
    }
  };
})();/**
 * High-level editor interface that communicates with underlying editor (like 
 * TinyMCE, CKEditor, etc.) or browser.
 * Basically, you should call <code>zen_editor.setContext(obj)</code> method to
 * set up undelying editor context before using any other method.
 * 
 * This interface is used by <i>zen_actions.js</i> for performing different 
 * actions like <b>Expand abbreviation</b>  
 * 
 * @example
 * var textarea = document.getElemenetsByTagName('textarea')[0];
 * zen_editor.setContext(textarea);
 * //now you are ready to use editor object
 * zen_editor.getSelectionRange();
 * 
 * @author Sergey Chikuyonok (serge.che@gmail.com)
 * @link http://chikuyonok.ru
 */
var zen_editor = (function(){
  /** @type {CodeMirror} */
  var mirror,
    
    /** Actions aliases */
    aliases = {
      balance_tag_inward: 'match_pair_inward',
      balance_tag_outward: 'match_pair_outward',
      previous_edit_point: 'prev_edit_point',
      pretty_break: 'insert_formatted_line_break'
    },
    
    shortcuts = {};
  
  /**
   * Returns whitrespace padding of string
   * @param {String} str String line
   * @return {String}
   */
  function getStringPadding(str) {
    return (str.match(/^(\s+)/) || [''])[0];
  }
  
  /**
   * Handle tab-stops (like $1 or ${1:label}) inside text: find first tab-stop,
   * marks it as selection, remove the rest. If tab-stop wasn't found, search
   * for caret placeholder and use it as selection
   * @param {String} text
   * @return {Array} Array with new text and selection indexes (['...', -1,-1] 
   * if there's no selection)
   */
  function handleTabStops(text) {
    var selection_len = 0,
      caret_pos = text.indexOf(zen_coding.getCaretPlaceholder()),
      placeholders = {};
      
    // find caret position
    if (caret_pos != -1) {
      text = text.split(zen_coding.getCaretPlaceholder()).join('');
    } else {
      caret_pos = text.length;
    }
    
    text = zen_coding.processTextBeforePaste(text, 
      function(ch){ return ch; }, 
      function(i, num, val) {
        if (val) placeholders[num] = val;
        
        if (i < caret_pos) {
          caret_pos = i;
          if (val)
            selection_len = val.length;
        }
          
        return placeholders[num] || '';
      });
    
    return [text, caret_pos, caret_pos + selection_len];
  }
  
  function keysFilter(evt) {
    // test if occured event corresponds to one of the defined shortcut
    var sh, name, result;
    for (var s in shortcuts) if (shortcuts.hasOwnProperty(s)) {
      sh = shortcuts[s];
      if (shortcut.test(sh.compiled, evt)) {
        evt.preventDefault();
        name = aliases[sh.action] || sh.action;
        result = zen_coding.runAction(name, [zen_editor]);
        return (name == 'expand_abbreviation') ? result : true;
      }
    }
    
    return false;
  }
  
  /**
   * Returns normalized action name
   * @param {String} name Action name (like 'Expand Abbreviation')
   * @return Normalized name for coding (like 'expand_abbreviation')
   */
  function normalizeActionName(name) {
    return name
      .replace(/(^\s+|\s+$)/g, '') // remove trailing spaces
      .replace(/[\s\\\/]+/g, '_')
      .replace(/\./g, '')
      .toLowerCase();
  }
  
  /**
   * Bind shortcut to Zen Coding action
   * @param {String} keystroke
   * @param {String} label
   * @param {String} action_name
   */
  function addShortcut(keystroke, label, action_name) {
    shortcuts[keystroke.toLowerCase()] = {
      compiled: shortcut.compile(keystroke),
      label: label,
      action: normalizeActionName(action_name || label)
    };
  }
  
  // add default shortcuts
  addShortcut('Meta+E', 'Expand Abbreviation');
  // addShortcut('Tab', 'Expand Abbreviation');
  addShortcut('Meta+D', 'Balance Tag Outward');
  addShortcut('Shift+Meta+D', 'Balance Tag inward');
  addShortcut('Shift+Meta+A', 'Wrap with Abbreviation');
  addShortcut('Ctrl+Alt+RIGHT', 'Next Edit Point');
  addShortcut('Ctrl+Alt+LEFT', 'Previous Edit Point');
  addShortcut('Meta+L', 'Select Line');
  addShortcut('Meta+Shift+M', 'Merge Lines');
  addShortcut('Meta+/', 'Toggle Comment');
  addShortcut('Meta+J', 'Split/Join Tag');
  addShortcut('Meta+K', 'Remove Tag');
  addShortcut('Meta+Shift+Y', 'Evaluate Math Expression');
  
  addShortcut('Ctrl+UP', 'Increment number by 1');
  addShortcut('Ctrl+DOWN', 'Decrement number by 1');
  addShortcut('Alt+UP', 'Increment number by 0.1');
  addShortcut('Alt+DOWN', 'Decrement number by 0.1');
  addShortcut('Ctrl+Alt+UP', 'Increment number by 10');
  addShortcut('Ctrl+Alt+DOWN', 'Decrement number by 10');
  
  addShortcut('Meta+.', 'Select Next Item');
  addShortcut('Meta+,', 'Select Previous Item');
  addShortcut('Meta+B', 'Reflect CSS Value');
  
  return {
    /**
     * Key handle for CodeMirror key events. You should pass this method as
     * <code>onKeyEvent</code> handler in order to add Zen Coding 
     * functionality to CodeMirror editor instance
     */
    handleKeyEvent: function(editor, evt) {
      if (evt.type == 'keydown') {
        this.setContext(editor);
        return keysFilter(evt);
      }
    },
    
    /**
     * Setup underlying editor context. You should call this method 
     * <code>before</code> using any Zen Coding action.
     * @param {CodeMirror} context
     */
    setContext: function(context) {
      mirror = context;
      zen_coding.setVariable('indentation', zen_coding.repeatString(' ', mirror.getOption('indentUnit')));
    },
    
    /**
     * Returns character indexes of selected text: object with <code>start</code>
     * and <code>end</code> properties. If there's no selection, should return 
     * object with <code>start</code> and <code>end</code> properties referring
     * to current caret position
     * @return {Object}
     * @example
     * var selection = zen_editor.getSelectionRange();
     * alert(selection.start + ', ' + selection.end); 
     */
    getSelectionRange: function() {
      var caret_pos = this.getCaretPos();
      return {
        start: caret_pos,
        end: caret_pos + this.getSelection().length
      };
    },
    
    /**
     * Creates selection from <code>start</code> to <code>end</code> character
     * indexes. If <code>end</code> is ommited, this method should place caret 
     * and <code>start</code> index
     * @param {Number} start
     * @param {Number} [end]
     * @example
     * zen_editor.createSelection(10, 40);
     * 
     * //move caret to 15th character
     * zen_editor.createSelection(15);
     */
    createSelection: function(start, end) {
      if (start == end) {
        mirror.setCursor(mirror.posFromIndex(start));
      } else {
        mirror.setSelection(mirror.posFromIndex(start), mirror.posFromIndex(end));
      }
    },
    
    /**
     * Returns current line's start and end indexes as object with <code>start</code>
     * and <code>end</code> properties
     * @return {Object}
     * @example
     * var range = zen_editor.getCurrentLineRange();
     * alert(range.start + ', ' + range.end);
     */
    getCurrentLineRange: function() {
      var caret = mirror.getCursor(true);
      
      return {
        start: mirror.indexFromPos({line: caret.line, ch: 0}),
        end: mirror.indexFromPos({line: caret.line, ch: mirror.getLine(caret.line).length})
      };
    },
    
    /**
     * Returns current caret position
     * @return {Number|null}
     */
    getCaretPos: function(){
      return mirror.indexFromPos(mirror.getCursor(true));
    },
    
    /**
     * Set new caret position
     * @param {Number} pos Caret position
     */
    setCaretPos: function(pos){
//      mirror.setCursor(mirror.posFromIndex(pos));
      this.createSelection(pos, pos);
    },
    
    /**
     * Returns content of current line
     * @return {String}
     */
    getCurrentLine: function() {
      return mirror.getLine( mirror.getCursor(true).line ) || '';
    },
    
    /**
     * Replace editor's content or it's part (from <code>start</code> to 
     * <code>end</code> index). If <code>value</code> contains 
     * <code>caret_placeholder</code>, the editor will put caret into 
     * this position. If you skip <code>start</code> and <code>end</code>
     * arguments, the whole target's content will be replaced with 
     * <code>value</code>. 
     * 
     * If you pass <code>start</code> argument only,
     * the <code>value</code> will be placed at <code>start</code> string 
     * index of current content. 
     * 
     * If you pass <code>start</code> and <code>end</code> arguments,
     * the corresponding substring of current target's content will be 
     * replaced with <code>value</code>. 
     * @param {String} value Content you want to paste
     * @param {Number} [start] Start index of editor's content
     * @param {Number} [end] End index of editor's content
     */
    replaceContent: function(value, start, end) {
      var caret_pos = this.getCaretPos(),
        start = typeof(start) !== 'undefined' ? start : 0,
        end = typeof(end) !== 'undefined' ? end : this.getContent().length;
        
      // indent new value
      value = zen_coding.padString(value, getStringPadding(this.getCurrentLine()));
      
//      if (mirror.win.asEditorLines) {
//        value = mirror.win.asEditorLines(value).join(zen_coding.getNewline());
//      }
      
      // find new caret position
      var tabstop_res = handleTabStops(value);
      value = tabstop_res[0];
      
      start = start || 0;
      if (tabstop_res[1] !== -1) {
        tabstop_res[1] += start;
        tabstop_res[2] += start;
      } else {
        tabstop_res[1] = tabstop_res[2] = value.length + start;
      }
      
      try {
        mirror.replaceRange(value, mirror.posFromIndex(start), mirror.posFromIndex(end));
        // this.createSelection(start, end);
        // mirror.replaceSelection(value);
        this.createSelection(tabstop_res[1], tabstop_res[2]);
      } catch(e){}
    },
    
    /**
     * Returns editor's content
     * @return {String}
     */
    getContent: function(){
      return mirror.getValue();
    },
    
    /**
     * Returns current editor's syntax mode
     * @return {String}
     */
    getSyntax: function() {
      var syntax = mirror.getOption('syntax') ||  '',
        caret_pos = this.getCaretPos();
        
      if (!zen_resources.hasSyntax(syntax))
        syntax = 'html';
        
      if (syntax == 'html') {
        // get the context tag
        var pair = zen_coding.html_matcher.getTags(this.getContent(), caret_pos);
        if (pair && pair[0] && pair[0].type == 'tag' && pair[0].name.toLowerCase() == 'style') {
          // check that we're actually inside the tag
          if (pair[0].end <= caret_pos && pair[1].start >= caret_pos)
            syntax = 'css';
        }
      }
      
      return syntax;
    },
    
    /**
     * Returns current output profile name (@see zen_coding#setupProfile)
     * @return {String}
     */
    getProfileName: function() {
      if (mirror.getOption('profile'))
        return mirror.getOption('profile');
        
      switch(this.getSyntax()) {
         case 'xml':
         case 'xsl':
          return 'xml';
         case 'html':
          var profile = zen_coding.getVariable('profile');
          if (!profile) { // no forced profile, guess from content
            // html or xhtml?
            profile = this.getContent().search(/<!DOCTYPE[^>]+XHTML/) != -1 ? 'xhtml': 'html';
          }
          
          return profile;
      }
      
      return 'xhtml';
    },
    
    /**
     * Ask user to enter something
     * @param {String} title Dialog title
     * @return {String} Entered data
     * @since 0.65
     */
    prompt: function(title) {
      return prompt(title);
    },
    
    /**
     * Returns current selection
     * @return {String}
     * @since 0.65
     */
    getSelection: function() {
      return mirror.getSelection() || '';
    },
    
    /**
     * Returns current editor's file path
     * @return {String}
     * @since 0.65 
     */
    getFilePath: function() {
      return location.href;
    },
    
    shortcut: addShortcut,
    
    /**
     * Removes shortcut binding
     * @param {String} keystroke
     */
    unbindShortcut: function(keystroke) {
      keystroke = keystroke.toLowerCase();
      if (keystroke in shortcuts)
        delete shortcuts[keystroke];
    },
        
    /**
     * Returns array of binded actions and their keystrokes
     * @return {Array}
     */
    getShortcuts: function() {
      var result = [], lp;
      
      for (var p in shortcuts) if (shortcuts.hasOwnProperty(p)) {
        lp = p.toLowerCase();
        
        // skip some internal bindings
        if (lp == 'tab' || lp == 'enter')
          continue;
          
        result.push({
          keystroke: shortcut.format(p), 
          compiled: shortcuts[p].compiled,
          label: shortcuts[p].label,
          action: shortcuts[p].action
        });
      }
      
      return result;
    },
    
    getInfo: function() {
      var message = 'This CodeMirror editor is powered by Zen Coding project: ' +
          'a set of tools for fast HTML coding.\n\n' +
          'Available shortcuts:\n';
          
      var sh = this.getShortcuts(),
        actions = [];
        
      for (var i = 0; i < sh.length; i++) {
        actions.push(sh[i].keystroke + ' — ' + sh[i].label)
      }
      
      message += actions.join('\n') + '\n\n';
      message += 'More info on http://code.google.com/p/zen-coding/';
      
      return message;
    },
    
    /**
     * Show info window about Zen Coding
     */
    showInfo: function() {
      alert(this.getInfo());
    },
    
    // expose some core Zen Coding objects
    
    /**
     * Returns core Zen Codind object
     */
    getCore: function() {
      return zen_coding;
    },
    
    /**
     * Returns Zen Coding resource manager. You can add new snippets and 
     * abbreviations with this manager, as well as modify ones.<br><br>
     * 
     * Zen Coding stores settings in two separate vocabularies: 'system' 
     * and 'user'. The ultimate solution to add new abbreviations and
     * snippets is to setup a 'user' vocabulary, like this:
     * 
     * @example
     * var my_settings = {
     *  html: {
     *    abbreviations: {
     *      'tag': '<div class="mytag">'
     *    }
     *  }
     * };
     * zen_editor.getResourceManager().setVocabulary(my_settings, 'user')
     * 
     * @see zen_resources.js
     */
    getResourceManager: function() {
      return zen_resources;
    }
  }
})();return zen_editor; 
})();