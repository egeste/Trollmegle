tm.ui.CreateSession = Backbone.View.extend({
  tagName: 'li',
  className: 'session create ui-corner-all ui-widget-content',

  render: function() {
    var services = $(this.make('select', { 'class': 'services' }))
    _(tm.models.services).each(function(service) {
      services.append($(this.make('option', {}, service.prototype.getName())).data('model', service))
    }, this)

    this.$el.append(services)
    return this
  }
});
