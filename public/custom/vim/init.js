(function() {
    var js = document.createElement("script");
    js.type = "text/javascript";
    js.src = '/js/vendor/codemirror4/keymap/vim.js';
    js.onload = function() {
        var editor, panel, editorKey;
        for (editorKey in window.editors) {
            if (window.editors.hasOwnProperty(editorKey)) {
                panel = window.editors[editorKey];
                if (panel.editor && (panel.editor instanceof window.CodeMirror)) {
                    panel.editor.setOption('keyMap', 'vim');
                    //Reset lineNumbers option because in firefox the line numbers are not visible
                    panel.editor.setOption('lineNumbers', true);
                }
            }
        }
    }
    document.body.appendChild(js);

})();