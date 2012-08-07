tm.models.Session = Backbone.Model.extend({
  defaults: {
    broadcast: false,
    connected: false,
    blocking: false,
    typing: false
  },

  initialize: function(attributes, options) {
    this.messages = new tm.models.Messages
    this.messages.on('add', this.broadcast, this)
    this.service = new options.service(null, { session: this })
    if (options.start) this.service.start()
  },

  send: function(message) {
    if (this.get('blocking')) return
    this.messages.add(message)
  },

  broadcast: function(message) {
    if (this.get('broadcast') && message.get('sender') === this.service) {
      this.collection.send(message)
    }
  }
});

tm.models.Sessions = Backbone.Collection.extend({
  model: tm.models.Session,

  send: function(message) {
    this.invoke('send', message)
  }
});
