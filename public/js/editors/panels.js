Panels = function(){};

Panels.panels = function(){
  return _.map(jsbin.panels.panels, function(key, value){
    return {
      name: value,
      display: $('#' + value).parents('.panelwrapper').css('display')
    };
  });
};

Panels.visible_panels = function(){
  return _.select(Panels.panels(), function(object){
    return object.display === "block";
  });
};

Panels.current_visible_index = function(){
  return _.findIndex(Panels.visible_panels(), function(object){
    return object.name === jsbin.panels.focused.el.id;
  });
};

Panels.left_panel = function(){
  var panels = Panels.visible_panels();
  var index = Panels.current_visible_index() - 1
  
  return jsbin.panels.panels[panels[index].name];
};

Panels.right_panel = function(){
  var panels = Panels.visible_panels();
  var index = Panels.current_visible_index() + 1
  
  return jsbin.panels.panels[panels[index].name];
};
