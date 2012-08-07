tm.ui.ChatInput = Backbone.View.extend({
  tagName: 'form',

  events: {
    'keydown .say': 'send'
  },

  initialize: function() {
    this.$el.attr('action', 'javascript:0')
    this.model && this.model.on('change:blocking', this.blocking, this)
  },

  render: function() {
    this.$el.append(this.make('input', {
      'type': 'text',
      'class': 'say ui-corner-all',
      'placeholder': 'Say something...'
    }))
    return this
  },

  send: function(event) {
    if (event.keyCode === 13) {
      var $target = $(event.target),
          value = $.trim($target.val())
      value && (this.model || this.collection).send(new tm.models.Message({ text: value }))
      $target.val('').focus()
    }
  },

  blocking: function() {
    var blocking = this.model.get('blocking')
    this.$('.say').prop('disabled', blocking)
    this.$el.toggleClass('blocking', blocking)
  }
});
