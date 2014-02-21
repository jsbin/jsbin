// ;(function(){
	// abstract this to a function so i can easily implement the TODO below;
	function getCurrentSettings(){
		// TODO do something here with a server sent object, merge it into localStorage...
		// We do now want to lose sync;
		return JSON.parse(localStorage.settings || '{}').editor;
	}
	function pick(obj, keys) {
		var copy = {};
		console.log(obj);
		console.log(keys);
		for (var i = 0, len = keys.length; i < len; i++) {
			console.log(obj[keys[i]]);
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
		'font'
	]


	// setup variables;
	var $textarea = $('textarea');
	var currentSettings = getCurrentSettings();

	console.log(currentSettings);
	var editor = CodeMirror.fromTextArea($textarea[0], $.extend({
		mode: "javascript"
	}, currentSettings));

	var $CodeMirror = $('.CodeMirror')

	// setup font-size  this has a little more work behind it.
	if (currentSettings.font) {
		$CodeMirror.css('font-size', currentSettings.font + 'px');
		editor.refresh();
	}
	var $fontsize = $('#font-size')
	if(!$fontsize.val()) {
		$fontsize.val(parseInt($CodeMirror.css('font-size')));
	}

	// Setup the rest
	var $theme = $('#theme').val(editor.getOption('theme'));
	var $tabSize = $('#tabSize').val(editor.getOption('tabSize'));
	var $vimMode = $('#vimMode').attr('checked', editor.getOption('vimMode'))
	var $lineWrapping = $('#lineWrapping').attr('checked', editor.getOption('lineWrapping'))
  var $indentWithTabs = $('#indentWithTabs').val(editor.getOption('indentWithTabs') ? 'Tabs' : 'Spaces');
	var $_csrf = $('#_csrf');

	// Listeners
	$('input[type="number"], input[type="text"]').on('input', saveSettings);
	$('input[type="checkbox"]').on('change', saveSettings);
	$('select').on('change', saveSettings);

	function saveSettings(event){
		// First we update the codemirror instance on page
		editor.setOption('vimMode', !!$vimMode.attr('checked'));
		editor.setOption('lineWrapping', !!$lineWrapping.attr('checked'));
    editor.setOption('indentWithTabs', !!parseInt($indentWithTabs.val()));
		editor.setOption('tabSize', $tabSize.val());
		//editor.setOption('indentUnit', $tabSize.val());
		editor.setOption('theme', $theme.val());
		editor.setOption('font', $fontsize.val());
		$CodeMirror.css('font-size', $fontsize.val()+'px');
		editor.refresh();

		// Merge all our settings together
		var localStorageSettings = JSON.parse(localStorage.settings|| '{}');
		var codemirrorSettings = pick(editor.options, settingsKeys);
		var newSettings = $.extend(localStorageSettings.editor, codemirrorSettings)

		// Save locally
		console.log('codemirrorSettings');
		console.log(codemirrorSettings);
		localStorageSettings.editor = newSettings;
		localStorage.settings = JSON.stringify(localStorageSettings);

		// Save on server
		$.ajax({
			type: 'POST',
			dataType: 'json',
			data: {
				settings: JSON.stringify(newSettings),
				_csrf: $_csrf.val()
			},
			success: function(data) {
				console.log('success');
			},
			error: function(data) {
				console.log('there was an error saving');
			}
		});

	}

// })();