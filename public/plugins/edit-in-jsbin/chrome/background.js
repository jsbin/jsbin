var code = {};

// create the menu item - that will open on anything
var id = chrome.contextMenus.create({
  title: 'Edit in JS Bin',
  contexts:['page', 'selection', 'editable'],
  onclick: function (info, tab) {
    // now the item is right clicked, work out which element was clicked
    // and get the url to the jsbin edit
    chrome.tabs.sendRequest(tab.id, "getClickedEl", function(code) {
      var tab = chrome.tabs.create({ url: 'http://static.jsbin.com/post.html', active: false }, function (tab) {
        chrome.tabs.executeScript(tab.id, { code: postForm(code) });
        chrome.tabs.update(tab.id, { active: true });
      });
    });
  }
});

function postForm(code) {
  return ["var input = document.getElementsByTagName('input')[0];",
          "input.name = '" + code.language + "';",
          'input.value = "' + encodeURIComponent(code.code) + '";',
          "input.form.submit();"].join('\n');
}