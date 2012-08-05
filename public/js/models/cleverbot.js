tm.models.services.CleverBot = Backbone.Model.extend({
  CHECKSUM_INDICES: ['stimulus','start','sessionid'],
  PASS_MESSAGE: '{pass}',

  url: '/cleverbot',

  defaults: {
    stimulus: '',
    start: 'y',
    sessionid: '',
    vText8: '',
    vText7: '',
    vText6: '',
    vText5: '',
    vText4: '',
    vText3: '',
    vText2: '',
    icognoid: 'wsf',
    icognocheck: '',
    fno: 0,
    prevref: '',
    emotionaloutput: '',
    emotionalhistory: '',
    asbotname: '',
    ttsvoice: '',
    typing: '',
    lineref: '',
    sub: 'Say',
    islearning: 1,
    cleanslate: false
  },

  initialize: function(attributes, options) {
    this.session = options.session
    this.session.set('connected', true)
  },

  sync: function(method, model, options) {
    this.session.set('blocking', true)
    options = options || {}
    this._checksum()
    var params = {
      url: this.url,
      type: 'POST',
      data: this.toJSON(),
      beforeSend: function(jqXHR, settings) {
        settings.data = settings.data.replace(/\+/g, '%20') // the cleverbot api doesnt like "+"
      }
    }
    return Backbone.ajax(_.extend(params, options))
  },

  parse: function(response, xhr) {
    this.session.set('blocking', false)
    var data = _(response.split("\r")).without('')
    this.session.messages.add({
      text: data[0],
      sender: this
    })
    this._vText()
    return {
      sessionid : data[1],
      prevref: data[data.length - 2]
    }
  },

  getName: function() { return 'Cleverbot'},

  start: function() { this.send() },

  send: function(message) {
    message = message || this.PASS_MESSAGE
    if (message !== this.PASS_MESSAGE) this.session.messages.add({ text: message })
    this.set('stimulus', message).fetch()
  },

  _checksum: function() {
    var params = _(this.CHECKSUM_INDICES).map(function(param) {
          return param+'='+encodeURIComponent(this.get(param))
        }, this).join('&')
    this.set('icognocheck', md5(params.substr(9,20)))
  },

  _vText: function() {
    var vText = {}
    _(this.session.messages.slice(-8).reverse()).each(function(message, index) {
      index += 2
      vText['vText'+index] = message.get('text')
    }, this)
    this.set(vText)
  }
});
