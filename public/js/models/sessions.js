tm.models.Session = Backbone.Model.extend({
  service: null,

  initialize: function() {
    this.messages = new tm.models.Messages
  }
});

tm.models.Sessions = Backbone.Collection.extend({
  model: tm.models.Session
});
