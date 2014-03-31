(function(){
	'use strict';

	/*globals $, CodeMirror */

    // create fake jsbin object
    window.jsbin = {
        static: jsbin.static,
        version: jsbin.version,
        panels: {
            panels: {
                javascript: {
                    editor: null
                },
                html: {
                    editor: null
                }
            },
            allEditors: function(fn) {
                fn(jsbin.panels.panels.javascript);
            }
        }
    };

    var template = {
        html: null
    };

    $.browser = {};
    // work out the browser platform
    var ua = navigator.userAgent;
    if (ua.indexOf(' Mac ') !== -1) {
      $.browser.platform = 'mac';
    } else if (/windows|win32/.test(ua)) {
      $.browser.platform = 'win';
    } else if (/linux/.test(ua)) {
      $.browser.platform = 'linux';
    } else {
      $.browser.platform = '';
    }

	// abstract this to a function so i can easily implement the TODO below;
	function getCurrentSettings(){
		// TODO do something here with a server sent object, merge it into localStorage...
		// We do now want to lose sync;
		return JSON.parse(localStorage.settings || '{}') || {

		};
	}
	function pick(obj, keys) {
		var copy = {};
		for (var i = 0, len = keys.length; i < len; i++) {
			copy[keys[i]] = obj[keys[i]];
		}
		return copy;
	}
	var settingsKeys = [
		'indentWithTabs',
		'indentUnit',
		'theme',
		'tabSize',
		'lineWrapping',
		'lineNumbers'
	];

    var addonsKeys = [
        'activeline',
        'closebrackets',
        'highlight',
        'matchtags',
        'trailingspace',
        'fold',
        'vim',
        'emacs',
        'sublime',
        'tern'
    ];
    var $addons = {};


	// setup variables;
	var $textarea = $('textarea');
	var currentSettings = getCurrentSettings();
    if (typeof currentSettings.editor === 'undefined') {
        currentSettings.editor = {};
    }
    if (typeof currentSettings.addons === 'undefined') {
        currentSettings.addons = {};
    }
    jsbin.settings = $.extend({}, currentSettings);

	var editor = window.editor = CodeMirror.fromTextArea($textarea[0], $.extend({
		mode: 'text/html'
	}, currentSettings.editor));
    jsbin.panels.panels.javascript.editor = editor;
    jsbin.panels.panels.html.editor = editor;
    template.html = editor.getValue();

	var $CodeMirror = $('.CodeMirror');

	// setup font-size  this has a little more work behind it.
	if (currentSettings.font) {
		$CodeMirror.css('font-size', currentSettings.font + 'px');
		editor.refresh();
	}
	var $fontsize = $('#font-size');
	if (!$fontsize.val()) {
		$fontsize.val(parseInt($CodeMirror.css('font-size')));
	}

    // addons
    for (var i = 0; i < addonsKeys.length; i++) {
        $addons[ addonsKeys[i] ] = $('#' + addonsKeys[i]).prop('checked', currentSettings.addons[ addonsKeys[i] ] || false);
    }
    if ($('[name=keymap]:checked').length === 0) {
        $('#defaultKeymap').prop('checked', true);
    }

	// Setup the rest
	var $theme = $('#theme').val(editor.getOption('theme'));
	var $tabSize = $('#tabSize').val(editor.getOption('tabSize'));
	var $lineWrapping = $('#lineWrapping').prop('checked', editor.getOption('lineWrapping'));
	var $lineNumbers = $('#lineNumbers').prop('checked', editor.getOption('lineNumbers'));
	var tabs = editor.getOption('indentWithTabs');
  var $indentWithTabs = $('#indentWithTabs').prop('checked', tabs);
  $('#indentWithSpaces').prop('checked', !tabs);
	var $csrf = $('#_csrf');

	// Listeners
	$('input[type="number"], input[type="text"]').on('input', saveSettings);
	$(':checkbox, :radio').on('change', saveSettings);
	$('select').on('change', saveSettings);

	function saveSettings() {
		// First we update the codemirror instance on page
		editor.setOption('lineWrapping', $lineWrapping.prop('checked'));
		editor.setOption('lineNumbers', $lineNumbers.prop('checked'));
    	editor.setOption('indentWithTabs', $indentWithTabs.prop('checked'));
		editor.setOption('tabSize', $tabSize.val());
		editor.setOption('theme', $theme.val());
		$CodeMirror.css('font-size', $fontsize.val()+'px');
		editor.refresh();

		// Merge all our settings together
		var localStorageSettings = JSON.parse(localStorage.settings || '{}');
		var codemirrorSettings = pick(editor.options, settingsKeys);
		var newSettingsEditor = $.extend(localStorageSettings.editor, codemirrorSettings);
        
        var addonsSettings = {};
        for (var i = 0; i < addonsKeys.length; i++) {
            addonsSettings[ addonsKeys[i] ] = $addons[ addonsKeys[i] ].prop('checked');
        }
        var newSettingsAddons = $.extend(localStorageSettings.addons, addonsSettings);

		// Save locally
		localStorageSettings.editor = newSettingsEditor;
		localStorageSettings.font = $fontsize.val();
        localStorageSettings.addons = newSettingsAddons;
		localStorage.settings = JSON.stringify(localStorageSettings);
        $.extend(jsbin.settings.addons, newSettingsAddons);

        // destroy and recreate CodeMirror and load the addons
        editor.toTextArea();
        editor = CodeMirror.fromTextArea($textarea[0], $.extend({
            mode: 'text/html'
        }, newSettingsEditor));
        jsbin.panels.panels.javascript.editor = editor;
        jsbin.panels.panels.html.editor = editor;
        template.html = editor.getValue();
        $CodeMirror = $('.CodeMirror');
        $CodeMirror.css('font-size', $fontsize.val()+'px');
        editor.refresh();
        reloadAddons();

		// Save on server
		$.ajax({
			type: 'POST',
			dataType: 'json',
			data: {
				settings: JSON.stringify(localStorageSettings),
				_csrf: $csrf.val()
			},
			success: function() {
				// console.log('success');
			},
			error: function() {
				// console.log('there was an error saving');
			}
		});

	}

})();