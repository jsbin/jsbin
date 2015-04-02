App = Ember.Application.create();

App.Router.map(function() {
  // put your routes here
});

App.IndexRoute = Ember.Route.extend({
  model: function() {
    return this.store.find('color');
  }  
});

App.ColorModel = DS.Model.extend({
  name: DS.attr('string')
});

$.mockjax({
  url: "/colors",
  type: "GET",
  status: 200,
  statusText: "OK",
  responseText: {
    colors: [{
      id: 1,
      name: "Red"
    },
    {
      id: 2,
      name: "Green"
    },
    {
      id: 3,
      name: "Blue"
    }]
  }
});
