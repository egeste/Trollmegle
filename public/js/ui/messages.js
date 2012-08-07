tm.ui.Message = Backbone.View.extend({
  tagName: 'li',
  className: 'message',

  render: function() {
    this.$el.text(this.model.get('text'))
    return this
  }
});

tm.ui.Messages = Backbone.View.extend({
  tagName: 'ul',
  className: 'messages',

  initialize: function() {
    this.collection.on('add', this.add, this)
    this.collection.on('reset', this.render, this)
  },

  render: function() {
    this.collection.each(function(message) {
      this.add(message)
    }, this)
    return this
  },

  add: function(message) {
    var height = this.$el.outerHeight(),
        scrollHeight = this.el.scrollHeight,
        scrollTop = this.el.scrollTop,
        heightDiff = scrollHeight - height,
        scrollDiff = scrollTop - heightDiff,
        scrolled = scrollDiff === 0
    this.$el.append(new tm.ui.Message({ model: message }).render().$el)
    if (scrolled) this.el.scrollTop = this.el.scrollHeight
  }
});
