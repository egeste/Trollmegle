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
    this.chatMessages = new tm.ui.Messages({ collection: this.model.messages })
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
