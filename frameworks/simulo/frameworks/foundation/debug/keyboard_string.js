sc_require('debug/base');
sc_require('debug/keyboard_event');

Simulo.KeyboardString = SC.Object.extend({
  baseString: '',

  init: function() {
    if(this.get('keyboardEvents') == undefined) this.set('keyboardEvents', []);
    this.get('baseString').split('').forEach(function(char) {
      this.get('keyboardEvents').push(Simulo.KeyboardEvent.create({char: char, target: this.get('target')}));
    }, this);
  },

  triggerEvents: function() {
    this.get('keyboardEvents').forEach(function(event) {
      event.trigger();
    });
  }
});
