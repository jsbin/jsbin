(function () {
    var $ = jQuery, // local, preserved, copy of jQuery
        statis = {},
        query, 
        libraries, i, unsaved,
        visitedBefore = readCookie('visited'),
        streaming, meta, channel, sessionTime; // comet variables

    var googleajaxapi = 'http://ajax.googleapis.com/ajax/libs/';
    var availableLibraries = {
        yui : {
            version : '2.7.0',
            host : googleajaxapi + 'yui',
            file : 'build/yuiloader/yuiloader-min.js'
        },
        mootools : {
            version : '1.2.3',
            host : googleajaxapi + 'mootools',
            file : 'mootools-yui-compressed.js'
        },
        prototype : {
            version : '1.6.0.3',
            host : googleajaxapi + 'prototype',
            file : 'prototype.js'
        },
        jquery : {
            version : '1.3.2',
            host : googleajaxapi + 'jquery',
            file : 'jquery.min.js'
        },
        jqueryui : {
            version : '1.7.2',
            host : googleajaxapi + 'jqueryui',
            file : 'jquery-ui.min.js',
            extra : '<link rel="stylesheet" href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.7.2/themes/base/jquery-ui.css" type="text/css" />'
        },
        scriptaculous : {
            version : '1.8.2', 
            host : googleajaxapi + 'scriptaculous',
            file : 'scriptaculous.js'
        },
        dojo : {
            version : '1.3.0',
            host : googleajaxapi + 'dojo',
            file : 'dojo/dojo.xd.js'
        },
        ext : {
            version: '3.0.0',
            host : googleajaxapi + 'ext-core',
            file : 'ext-core.js',
            extra : '<link rel="stylesheet" type="text/css" href="http://extjs.cachefly.net/ext-2.2/resources/css/ext-all.css" />'
        }
    };

    // cookie functions http://www.quirksmode.org/js/cookies.html
    function createCookie(name, value, days) {
        var date, expires;

    	if (days) {
    		date = new Date();
    		date.setTime(date.getTime()+(days*24*60*60*1000));
    		expires = "; expires="+date.toGMTString();
    	} else {
    	    expires = "";
    	}
    	document.cookie = name+"="+value+expires+"; path=/";
    }

    function readCookie(name) {
    	var nameEQ = name + "=",
    	    ca = document.cookie.split(';'),
    	    i, c;

    	for (i=0; i < ca.length; i++) {
    		c = ca[i];
    		while (c.charAt(0)==' ') {
    		    c = c.substring(1,c.length);
    		}

    		if (c.indexOf(nameEQ) == 0) {
    		    return c.substring(nameEQ.length,c.length);
    		}
    	}
    	return null;
    }

    function eraseCookie(name) {
    	createCookie(name,"",-1);
    }

    function showUnsaved(show) {
        if (show && !/\*$/.test(document.title)) {
            if (/debug/i.test(document.title)) {
                document.title = 'JS Bin - [unsaved]';
            }
            document.title += '*';
        } else if (!show && /\*$/.test(document.title)) {
            document.title = document.title.replace(/\*$/, '');
        }
    }
    
    function escapeNL(s) {
        // because I'm working with \n not having \r breaks chili :-( 
        // so I add them back in.
        return $.browser.msie ? s.replace(/\n/g, "\r\n") : s;
    }
    
    function unescapeHTML(s) {
        return s.replace(/(&lt;|&gt;|&quot)/g, function (a, m) { 
            if (m == '&quot;') {
                return '"';
            } else if (m == '&gt;') {
                return '>';
            } else if (m == '&lt;') {
                return '<';
            } else {
                return m;
            }
        });
    }
    
    function getQuery(s) {
        var query = {};

        s.replace(/\b([^&=]*)=([^&=]*)\b/g, function (m, a, d) {
            if (typeof query[a] != 'undefined') {
                query[a] += ',' + d;
            } else {
                query[a] = d;
            }
        });

        return query;
    }
    
    // needs to be called against the context of the changed textarea
    function stream_out() {
        var $ta = $(this);
        var $form = $('#saveCode');

        var cursor = 0, tab = $ta.parent().attr('id');
        if (this.setSelectionRange) {
            cursor = this.selectionStart;
        }
        
        // backend code validates against a write key
        $.ajax({
            url : '/save?',
            data : $form.serialize() + '&cursor=' + cursor + '&tab=' + tab,
            type : 'post',
            sucess : function () {}
        });
    }
    
    function stream_in() {
        var key = $('#streaming').val();
        
        // currently hitting port 8080 during 'beta' period
        // var loc = document.location.protocol + "//" + document.location.hostname + ":8080/cometd";
        var loc = 'http://jsbin.com:8080/cometd';
        $.comet.init(loc);
        var connected = true;
        channel = "/jsbin/" + key;

        $.comet.startBatch();
        $.comet.subscribe(channel, receive);
        // $.comet.subscribe(channel + '/stats', null);
        // $.comet.publish(channel + '/stats', {
        //     join: true
        // });
        
        if (meta) {
            $.comet.unsubscribe(meta, null, null);
        }
        $.comet.endBatch();
        
        
        $('#codeId').after(' <span>(streaming...)</span>').trigger('startStreaming');
        
        sessionTime = +new Date;

        meta = $.comet.subscribe("/cometd/meta", this, function (e) {
            //console.log('handshaking...');
            if (e.action == "handshake") {
                if (e.reestablish) {
                    if (e.successful) {
                        $.comet.subscribe(channel, receive);
                    }
                }
            }
            else 
                if (e.action == "connect") {
                    connected = e.successful;
                }
        });
    }
    
    function stop_stream() {
        $('#codeId').trigger('stopStreaming').next().remove();
        
        if (meta) {
            $.comet.unsubscribe(meta);
        }
        meta = null;
                
        $.comet.startBatch();
        // $.comet.publish(channel + '/stats', {
        //     time: (+new Date) - sessionTime,
        //     join: false
        // });
        // $.comet.unsubscribe(channel + '/stats', null);
        $.comet.unsubscribe(channel, receive);
        $.comet.endBatch();
        
        $.comet.disconnect();
    }

	function receive(message) {
		if (!message.data) {
			window.console && console.warn("bad message format " + message);
			return;
		}

        if (message.data.javascript) {
            $('#javascript textarea').val(message.data.javascript);
            renderedCode('#javascript');
        }

        if (message.data.html) {
            $('#html textarea').val(unescapeHTML(message.data.html));
            renderedCode('#html');            
        }

        save();

        if ($('#output').is(':visible')) {
            // rerender the output
            $('#output').trigger('show');
        }
    }
    
    function save() {
        var j = sessvars.javascript, h = sessvars.html;
        sessvars.javascript = $('#javascript textarea').val();
        sessvars.html = $('#html textarea').val();
                
        if (j != sessvars.javascript || h != sessvars.html) {
            showUnsaved(true);
            return true;
        } else {
            return false;
        }
    }
    
    function reset() {
        sessvars.javascript = $('#javascript textarea').val(javascriptTemplate).val();
        sessvars.html = $('#html textarea').val(htmlTemplate).val();
        showUnsaved(false);
        $('#library').val('none');
    }
    
    function renderedCode(id) {
        var panel = $(id);
        
        $('code', panel)
            .text(escapeNL($('textarea', panel).hide().val()))
            .chili()
            .parent()
            .show();
    }
    
    function init() {
        if (!visitedBefore || window.location.hash == '#intro') {
            setTimeout(function () {
                $('#intro').fadeIn().click(function () {
                    $(this).fadeOut();
                });
            }, 500);
        }
        
        createCookie('visited', 'true', 365);
        
        $('#codeId').bind('startStreaming', function () {
            var $codeId = $(this);
            $codeId.data('timer', setInterval(function () {
                $codeId.toggleClass('streaming');
            }, 1000));
        }).bind('stopStreaming', function () {
            clearInterval($(this).removeClass('streaming').data('timer'));
        });
        
        $('#library').change(function () {
            sessvars.library = this.value;
            
            sessvars.html = sessvars.html.replace(/(<script.*src=".*".*><\/script>)\n?/g, function (s, m) {
                if (m.match(/googleapis/i)) {
                    return '';
                } else if (m.match(/yahooapis/i)) {
                    return '';
                } else if (m.match(/jquery\-ui\.googlecode/i)) {
                    return '';
                } else {
                    return s;
                }
            });

            // clear out extras
            for (i in availableLibraries) {
               sessvars.html = sessvars.html.replace("\n" + availableLibraries[i].extra, ''); 
            }

            if (this.value != 'none') {
                libraries = this.value.split(/\+/);
                for (i = 0; i < libraries.length; i++) {
                    sessvars.html = sessvars.html.replace('<head', "<head>\n<" + 'script src="' + [availableLibraries[libraries[i]].host, availableLibraries[libraries[i]].version, availableLibraries[libraries[i]].file].join('/') + '"><' + '/script');
                    if (availableLibraries[libraries[i]].extra) {
                        sessvars.html = sessvars.html.replace('<head>', "<head>\n" + availableLibraries[libraries[i]].extra);
                    }
                }
            }
            $('#html textarea').val(sessvars.html);
            renderedCode('#html');
            showUnsaved(true);
        }).val(query.library);
        
        $('#header input.reset').click(function () {
            reset();
            renderedCode('#javascript');
            renderedCode('#html');
            
            // sessvars.javascript = undefined;
            // sessvars.html = undefined;
            // window.location = '/';
            return false;
        });
        
        $('#closeOptions').click(function () {
            $('#options').slideUp();
        });
        
        $('#javascript, #html').each(function () {
            var panel = this;
            $('textarea', panel).val(sessvars[panel.id]).keydown(function (e) {
                var textarea = this;
                clearTimeout(this.timer);
                this.timer = setTimeout(function () {
                    if (save() && $('#streamingKey').length) {
                        stream_out.call(textarea);
                    }
                }, 250);

                if (e.keyCode == 27) {
                    if (streaming) {
                        stream_in();
                    }
                    renderedCode('#' + panel.id);
                    return;
                }

                // indent code from: http://ejohn.org/apps/learn/
                if ( this.setSelectionRange ) {
                    var start = this.selectionStart, val = this.value;
                    if ( e.keyCode == 13 ) {
                        var match = val.substring(0, start).match(/(^|\n)([ \t]*)([^\n]*)$/);
                        if ( match ) {
                            var spaces = match[2], length = spaces.length + 1;
                            this.value = val.substring(0, start) + "\n" + spaces + val.substr(this.selectionEnd);
                            this.setSelectionRange(start + length, start + length);
                            this.focus();
                            return false;
                        }
                    } else if ( e.keyCode == 8 ) {
                        if ( val.substring(start - 2, start) == "  " ) {
                            this.value = val.substring(0, start - 2) + val.substr(this.selectionEnd);
                            this.setSelectionRange(start - 2, start - 2);
                            this.focus();
                            return false;
                        }
                    } else if ( e.keyCode == 9 ) {
                        this.value = val.substring(0, start) + "  " + val.substr(this.selectionEnd);
                        this.setSelectionRange(start + 2, start + 2);
                        this.focus();
                        return false;
                    }
                }
            });
            $('pre', panel).dblclick(function () {
                $('pre', panel).hide();
                $('textarea', panel).show().focus();
                if (streaming) {
                    stop_stream();
                }
            }).find('code').text(escapeNL(sessvars[panel.id])).chili();
        });
    	
    	// lastly show the right tab
    	$('#output').bind('show', function () {
            var win = $('iframe', this).get(0);

            var html = sessvars.html;
            
            if (html.indexOf('%code%') === -1) {
                html = html.replace('</body>', '<' + 'script>%code%<' + '/script></body>');
            }

            win = win.contentDocument || win.contentWindow.document;
            if ($.browser.msie) {
                win.write(html.replace('%code%', 'window.onload = function(){' + sessvars.javascript + '};').replace('<head', '<head><' + 'script>if (window.top.location != window.location && window.top.console) { window.console = window.top.console; }<' + '/script'));
            } else {
                win.write(html.replace('%code%', sessvars.javascript).replace('<head', '<head><' + 'script>if (window.top.location != window.location) { window.console = window.top.console; }<' + '/script'));
            }

            win.close();
        });
        
        $('#output iframe').load(function () {
            var h = (this.contentDocument || this.contentWindow.document).body.parentNode.offsetHeight;
            if (h < 400) {
                h = 400;
            }
            $(this).css('height', h);
        });
        
        // $('textarea').vgrow();
        
        var $tabLinks = $('#navigation a').click(function () {
            $tabLinks.removeClass('selected');
            $(this).addClass('selected');
            var a = $('#body .panel').hide().filter(this.hash).show().trigger('show');
            
            sessvars.selectedTab = $tabLinks.index(this);
            
            return false;
        });
        $tabLinks.filter(typeof sessvars.selectedTab != 'number' && window.location.hash && window.location.hash != '#intro' ? '[hash=' + window.location.hash + ']' : ':nth(' + (sessvars.selectedTab || 1) + ')').click();
        
        if (streaming) {
            $(window).unload(stop_stream);
            stream_in();
        }
    }

    // main
    streaming = $('#streaming').val();
    if (streaming) {
        // if streaming - we'll read the values straight from the templates
        sessvars.html = htmlTemplate;
        sessvars.javascript = javascriptTemplate;
    } else {
        if (typeof sessvars.html == 'undefined') {
            sessvars.html = htmlTemplate;
        } else if (sessvars.html != htmlTemplate) {
            unsaved = true;
        }

        if (typeof sessvars.javascript == 'undefined') {
            sessvars.javascript = javascriptTemplate;
        } else if (sessvars.javascript != javascriptTemplate) {
            unsaved = true;
        }        
    }
    
    if (unsaved) {
        showUnsaved(true);
    }

    query = getQuery(window.location.search);
    $(init);
})(jQuery);

