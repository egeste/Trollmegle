tm.ui.Message = Backbone.View.extend({
  tagName: 'li',
  className: 'message',

  render: function() {
    this.$el.text(this.model.cid)
    return this
  }
});

tm.ui.Messages = Backbone.View.extend({
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
    this.$el.append(new tm.uid.Message({ model: message }).render().$el)
  }
});
