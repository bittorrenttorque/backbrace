sc_require('debug/key_events/base');

Simulo.KeyPressEvent = Simulo.KeyEvent.extend({
  eventAttributes: function() {
    var attributes = {
      keyCode:  this.get('keyCode'),
      which:    this.get('keyCode'),
      charCode: this.get('charCode'),
      altKey:   this.get('altKey'),
      ctrlKey:  this.get('ctrlKey'),
      metaKey:  this.get('metaKey'),
      shiftKey: this.get('shiftKey')
    };
    return attributes;
  }.property('keyCode', 'charCode', 'altKey', 'ctrlKey', 'metaKey', 'shiftKey').cacheable(),

  charCode: function() {
    return this.get('char').charCodeAt(0);
  }.property('char').cacheable(),

  keyCode: function() {
    return this.get('charCode');
  }.property('charCode').cacheable(),

  trigger: function() {
    var event = SC.Event.simulateEvent(this.get('target'), 'keypress', this.get('eventAttributes'));
    SC.Event.trigger(this.get('target'), 'keypress', event);
  }
});
