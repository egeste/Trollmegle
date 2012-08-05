tm.models.Session = Backbone.Model.extend({
  defaults: {
    connected: false,
    blocking: false,
    typing: false
  },

  initialize: function(attributes, options) {
    this.messages = new tm.models.Messages
    this.service = new options.service(null, { session: this })
    if (options.start) this.service.start()
  },

  send: function(message) {
    if (this.isBlocking()) return
    this.service.send(message)
  },

  isConnected: function() { return this.get('connected') },
  isBlocking: function() { return this.get('blocking') },
  isTyping: function() { return this.get('typing') }
});

tm.models.Sessions = Backbone.Collection.extend({
  model: tm.models.Session,

  send: function(message) {
    this.invoke('send', message)
  }
});
