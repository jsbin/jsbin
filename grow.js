(function ($) {
$.fn.vgrow = function () {
    var resizeCodeBoxReg = [/[ <>]/g, /\n/g];
    return this.each(function () {
        var box = this,
            $box = $(box);

        // tiny bug with width - if you paste a line wider than the max browser width, it
        // causes the box to grow...
        var $boxSizer = $box.after('<div class="codeSizer"></div>').next();
        $boxSizer.css({'width' : $box.css('width')});

        var cssmin = parseInt($box.css('min-height'));
        var cssmax = parseInt($box.css('max-height'));
        var fontsize = parseInt($box.css('font-size'));

        // better to create a one off function than a new
        // closure function on each key press
        var resizeTimer = null;
        var resizeCodeBox = function (key, ignorelimit) {
            // all these events change the height of the box
            // so to optimise the times div is resized, we'll only
            // run when these events happen.
            switch (key) {
                case 224:
                case 17:
                case 18: 
                case 8: 
                case 91: // stupid - letter 'v' for pasting
                // case 9:
                case 13: 
                case 27: {
                    // otherwise it was some kind of control character
                    var src = $box.val();
                    var lines = src.split(/\n/).length;
                    
                    if (!ignorelimit && lines > 50) {
                        // delay the rendering to allow for repetitive key strokes (like delete)
                        if (resizeTimer) clearTimeout(resizeTimer);
                        resizeTimer = setTimeout(function () {
                            resizeCodeBox(key, true);
                        }, 200);
                    } else {
                        src = src.replace(resizeCodeBoxReg[0], function (m) {
                            var r = '';
                            if (m == ' ') r = '&nbsp;';
                            else if (m == '<') r = '&lt;';
                            else if (m == '>') r = '&gt;';
                            return r;
                        }).replace(resizeCodeBoxReg[1],'<br />&nbsp;');

                        if (src != $boxSizer[0].innerHTML) {
                            $boxSizer[0].innerHTML = src;
                            var h = $boxSizer[0].offsetHeight;
                            if (cssmin < h && h < cssmax) { // most likely clause
                                box.style.height = (h + (fontsize*2)) + 'px';
                                // TODO check in IE
                                box.style['overflow-y'] = 'auto';
                            } else if (h < cssmin) {
                                $box.css('height', cssmin);
                            } else if (h > cssmax) {
                                $box.css({'height': cssmax, 'overflow-y' : 'auto'});
                            } 
                        }
                    }
                }
            }
        };

        var sizer = function (ev) {            
            resizeCodeBox(ev.keyCode);
        };

        $box.css({'overflow-y' : 'hidden'}).keyup(sizer).keypress(sizer).keydown(sizer);
    
        sizer({ type: 'keyup', keyCode : 224 });  // force a resize on load
    });
};

})(jQuery);