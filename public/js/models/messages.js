tm.models.Message = Backbone.Model.extend({
  initialize: function() {
    this.set('timestamp', new Date().getTime())
  }
});

tm.models.Messages = Backbone.Collection.extend({
  model: tm.models.Message
});
