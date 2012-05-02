sc_require('debug/key_events/keydown_event');
sc_require('debug/key_events/keypress_event');
sc_require('debug/key_events/keyup_event');

Simulo.KeyboardEvent = SC.Object.extend({
  char: '',

  init: function() {
    this.set('keyDownEvent', Simulo.KeyDownEvent.create({char: this.get('char'), target: this.get('target'), commandKey: this.get('commandKey')}));
    this.set('keyPressEvent', Simulo.KeyPressEvent.create({char: this.get('char'), target: this.get('target')}));
    this.set('keyUpEvent', Simulo.KeyUpEvent.create({char: this.get('char'), target: this.get('target'), commandKey: this.get('commandKey')}));
  },

  trigger: function() {
    this.get('keyDownEvent').trigger();
    this.get('keyPressEvent').trigger();
    this.get('target').val(this.get('target').val() + this.get('char'));
    this.get('keyUpEvent').trigger();
  }
});
