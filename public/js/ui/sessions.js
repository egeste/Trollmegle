tm.ui.CreateSession = Backbone.View.extend({
  tagName: 'li',
  className: 'session create ui-corner-all ui-widget-content',
  events: {
    'click .button': 'startService'
  },

  render: function() {
    var $services = this.$services = $(this.make('select', { 'class': 'services' }))

    _(tm.models.services).each(function(service) {
      $services.append($(this.make('option', {}, service.prototype.getName())).data('model', service))
    }, this)

    this.$el
      .append(this.make('div', { 'class': 'header ui-widget-header ui-corner-all' }, 'Create Session'))
      .append($services)
      .append(this.bigButton())

    $services.select2()
    return this
  },

  bigButton: function() {
    return $(this.make('div', { 'class': 'button' }, 'Start Session')).button({
      icons: {
        primary: 'ui-icon-comment',
        secondary: 'ui-icon-plus'
      }
    })
  },

  startService: function() {
    var service = this.$services.find(':selected').data('model')
    tm.app.sessions.add(null, { service: service })
  }
});

tm.ui.Session = Backbone.View.extend({
  tagName: 'li',
  className: 'session ui-corner-all ui-widget-content',

  events: {
    'click .close': 'destroy',
    'click': 'highlight',
    'focus .say': 'highlight',
    'keydown .say': 'highlight',
    'change .broadcast': 'broadcast'
  },

  initialize: function() {
    this.createSubViews()
    this.model.messages.on('add', this.highlight, this)
    $.ajax({
      async: false,
      context: this,
      url: '/templates/session.html',
      success: function(data) {
        this.template = _(data).template(null, { variable: 'session' })
      }
    })
  },

  createSubViews: function() {
    this.chatMessages = new tm.ui.Messages({ collection: this.model.messages })
    this.chatInput = new tm.ui.ChatInput({ model: this.model })
  },

  render: function() {
    this.$el
      .html(this.template())
      .append(this.chatMessages.render().$el)
      .append(this.chatInput.render().$el)

    this.$('.close').button({
      text: false,
      icons: { primary:'ui-icon-close' }
    })
    this.$('.broadcast').button()

    return this
  },

  destroy: function() {
    this.model.collection.remove(this.model)
    this.remove()
  },

  highlight: function(e) {
    var $header = this.$('.header')

    if (e.target)
      $header.removeClass('ui-state-highlight')

    if (e instanceof Backbone.Model && e.has('sender') && e.get('sender') === this.model.service)
      $header.addClass('ui-state-highlight')
  },

  broadcast: function(e) {
    var $target = $(e.target),
        value = $target.is(':checked')
    this.model.set('broadcast', value)
  }
});

tm.ui.Sessions = Backbone.View.extend({
  id: 'sessions',
  tagName: 'ul',

  initialize: function() {
    this.createSubViews()
    this.collection = tm.app.sessions = new tm.models.Sessions
    this.collection.on('add', this.addSession, this)
    this.collection.on('reset', this.render, this)
  },

  createSubViews: function() {
    this.createSession = new tm.ui.CreateSession
  },

  render: function() {
    this.$el.append(this.createSession.render().$el)
    this.collection.each(function(session) {
      this.addSession(session)
    }, this)
    return this
  },

  addSession: function(session) {
    this.createSession.$el.before(new tm.ui.Session({ model: session }).render().$el)
  }
});
