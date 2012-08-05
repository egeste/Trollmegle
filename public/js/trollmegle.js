(function() {
  tm = window.tm = {}
  tm.controllers = {}
  tm.models = {}
  tm.app = {}
  tm.ui = {}
})();
tm.models.Message = Backbone.Model.extend({
  initialize: function() {
    this.set('timestamp', new Date().getTime())
  }
});

tm.models.Messages = Backbone.Collection.extend({
  model: tm.models.Message
});
tm.models.Session = Backbone.Model.extend({
  service: null,

  initialize: function() {
    this.messages = new tm.models.Messages
  }
});

tm.models.Sessions = Backbone.Collection.extend({
  model: tm.models.Session
});
tm.ui.ChatInput = Backbone.View.extend({
  tagName: 'form',

  initialize: function() {
    this.$el.attr('action', 'javascript:0')
  },

  render: function() {
    this.$el
      .empty()
      .append(this.make('input', { 'type': 'text', 'placeholder': 'Say something...' }))
      // .append(this.make('input', { 'type': 'submit', 'value': 'Send' }))
    return this
  }
});
tm.ui.ChatMessage = Backbone.View.extend({
  tagName: 'li',
  className: 'message',

  render: function() {
    this.$el.text(this.model.cid)
    return this
  }
});

tm.ui.ChatMessages = Backbone.View.extend({
  tagName: 'ul',
  className: 'messages',

  initialize: function() {
    this.collection.on('add', this.addMessage, this)
    this.collection.on('reset', this.render, this)
  },

  render: function() {
    this.collection.each(function(message) {
      this.addMessage(message)
    }, this)
    return this
  },

  addMessage: function(message) {
    this.$el.append(new tm.uid.ChatMessage({ model: message }).render().$el)
  }
});
tm.ui.Session = Backbone.View.extend({
  tagName: 'li',
  className: 'session ui-corner-all ui-widget-content',

  events: {
    'click .close': 'destroy'
  },

  initialize: function() {
    this.model.on('destroy', this.remove, this)
    this.createSubViews()
  },

  createSubViews: function() {
    this.chatMessages = new tm.ui.ChatMessages({ collection: this.model.messages })
    this.chatInput = new tm.ui.ChatInput
  },

  render: function() {
    this.$el
      .append(this.header())
      .append(this.chatMessages.render().$el)
      .append(this.chatInput.render().$el)
    return this
  },

  header: function() {
    var header = $(this.make('div', { 'class': 'header ui-widget-header ui-corner-all' })).text(this.model.cid)
    var close = $(this.make('div', { 'class': 'close'})).button({
      text: false,
      icons: { primary:'ui-icon-close' }
    })
    return header.prepend(close)
  },

  destroy: function() {
    this.model.destroy()
  }
});

tm.ui.Sessions = Backbone.View.extend({
  id: 'sessions',
  tagName: 'ul',

  initialize: function() {
    this.collection = tm.app.sessions = new tm.models.Sessions
    this.collection.on('add reset', this.render, this)
  },

  render: function() {
    this.$el.empty()
    this.collection.each(function(session) {
      this.$el.append(new tm.ui.Session({ model: session }).render().$el)
    }, this)
    return this
  }
});
$(function() {

  window.homepage = new (Backbone.View.extend({
    el: document.body,

    initialize: function() {
      this.createSubViews()
      this.render()
    },

    createSubViews: function() {
      tm.app.sessionsView = new tm.ui.Sessions
      tm.app.chatInput = new tm.ui.ChatInput({ id: 'chatInput', className: 'ui-widget-header' })
    },

    render: function() {
      this.$el
        .append(tm.app.sessionsView.render().$el)
        .append(tm.app.chatInput.render().$el)
    }
  }))

});
