(function(){
	'use strict';

	/*globals $, CodeMirror */

	// abstract this to a function so i can easily implement the TODO below;
	function getCurrentSettings(){
		// TODO do something here with a server sent object, merge it into localStorage...
		// We do now want to lose sync;
		return JSON.parse(localStorage.settings || '{}').editor || {

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
		'vimMode',
		'indentWithTabs',
		'indentUnit',
		'theme',
		'tabSize',
		'lineWrapping',
		'lineNumbers'
	];


	// setup variables;
	var $textarea = $('textarea');
	var currentSettings = getCurrentSettings();

	var editor = window.editor = CodeMirror.fromTextArea($textarea[0], $.extend({
		mode: 'text/html'
	}, currentSettings));

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

	// Setup the rest
	var $theme = $('#theme').val(editor.getOption('theme'));
	var $tabSize = $('#tabSize').val(editor.getOption('tabSize'));
	var $vimMode = $('#vimMode').prop('checked', editor.getOption('vimMode'));
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
		editor.setOption('vimMode', $vimMode.prop('checked'));
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
		var newSettings = $.extend(localStorageSettings.editor, codemirrorSettings);

		// Save locally
		localStorageSettings.editor = newSettings;
		localStorageSettings.editor.font = $fontsize.val();
		localStorage.settings = JSON.stringify(localStorageSettings);

		// Save on server
		$.ajax({
			type: 'POST',
			dataType: 'json',
			data: {
				settings: JSON.stringify(localStorageSettings.editor),
				_csrf: $csrf.val()
			},
			success: function() {
				console.log('success');
			},
			error: function() {
				console.log('there was an error saving');
			}
		});

	}

})();