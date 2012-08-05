tm.ui.ChatInput = Backbone.View.extend({
  tagName: 'form',

  events: {
    'keydown input': 'send'
  },

  initialize: function() {
    this.$el.attr('action', 'javascript:0')
    this.model && this.model.on('change:blocking', this.blocking, this)
  },

  render: function() {
    this.$el.append(this.make('input', { 'type': 'text', 'placeholder': 'Say something...' }))
    return this
  },

  send: function(event) {
    if (event.keyCode === 13) {
      var $target = $(event.target),
          message = $.trim($target.val())
      message && (this.model || this.collection).send(message)
      $target.val('').focus()
    }
  },

  blocking: function() {
    this.$('input').prop('disabled', this.model.isBlocking())
  }
});
