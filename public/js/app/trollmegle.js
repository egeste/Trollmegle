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
