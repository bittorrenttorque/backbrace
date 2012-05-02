sc_require('debug/key_events/base');

Simulo.KeyDownEvent = Simulo.KeyEvent.extend({
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

  charCode: 0,

  keyCode: function() {
    if(this.get('char')) return this.get('keyCodes')[this.get('char').toLowerCase()];
    return this.get('keyCodes')[this.get('commandKey').toLowerCase()];
  }.property('char', 'commandKey').cacheable(),


  trigger: function() {
    var event = SC.Event.simulateEvent(this.get('target'), 'keydown', this.get('eventAttributes'));
    SC.Event.trigger(this.get('target'), 'keydown', event);
  }
});
