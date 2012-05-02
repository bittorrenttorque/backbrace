describe('Simulo.KeyboardEvent', function() {
  describe('#trigger', function() {
    var triggerKeyDownEventSpy, keyDownEvent, triggerKeyPressEventSpy, keyPressEvent, triggerKeyUpEventSpy;
    var target, targetValueSpy, keyUpEvent;
    beforeEach(function() {
      keyDownEvent = {trigger: function() {}};
      spyOn(Simulo.KeyDownEvent, 'create').andReturn(keyDownEvent);
      triggerKeyDownEventSpy = spyOn(keyDownEvent, 'trigger');

      keyPressEvent = {trigger: function() {}};
      spyOn(Simulo.KeyPressEvent, 'create').andReturn(keyPressEvent);
      triggerKeyPressEventSpy = spyOn(keyPressEvent, 'trigger');

      keyUpEvent = {trigger: function() {}};
      spyOn(Simulo.KeyUpEvent, 'create').andReturn(keyUpEvent);
      triggerKeyUpEventSpy = spyOn(keyUpEvent, 'trigger');

      target = {val: function() { return 'something'; }};
      targetValueSpy = spyOn(target, 'val').andReturn('something');

      event = Simulo.KeyboardEvent.create({char: 'a', target: target});
      event.trigger();
    });

    it('triggers a keydown event for the given character', function() {
      expect(triggerKeyDownEventSpy).toHaveBeenCalled();
    });

    it('triggers a keypress event for the given character', function() {
      expect(triggerKeyPressEventSpy).toHaveBeenCalled();
    });

    it('adds the character to the target\'s current value', function() {
      expect(targetValueSpy).toHaveBeenCalledWith('somethinga');
    });

    it('triggers a keyup event for the given character', function() {
      expect(triggerKeyUpEventSpy).toHaveBeenCalled();
    });
  });
});
