// create the menu item - that will open on anything
var id = chrome.contextMenus.create({
  title: 'Edit in JS Bin', 
  contexts:['page', 'selection', 'editable'],
  onclick: function (info, tab) {
    // now the item is right clicked, work out which element was clicked
    // and get the url to the jsbin edit
    chrome.tabs.sendRequest(tab.id, "getClickedEl", function(url) {
      chrome.tabs.create({"url" : url });
    });
  }
});