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
