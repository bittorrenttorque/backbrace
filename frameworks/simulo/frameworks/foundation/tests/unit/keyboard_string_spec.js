describe('Simulo.KeyboardString', function() {
  var keyboardString;

  describe('initilization', function() {
    var createKeyboardEventSpy;
    beforeEach(function() {
      createKeyboardEventSpy = spyOn(Simulo.KeyboardEvent, 'create');
      keyboardString = Simulo.KeyboardString.create({baseString: 'aB2'});
    });

    it('creates a keyboard event for each character in the string', function() {
      expect(createKeyboardEventSpy).toHaveBeenCalledWith({char: 'a'});
      expect(createKeyboardEventSpy).toHaveBeenCalledWith({char: 'B'});
      expect(createKeyboardEventSpy).toHaveBeenCalledWith({char: '2'});
    });
  });

  describe('#triggerEvents', function() {
    var triggerFirstEventSpy, triggerSecondEventSpy, event1, event2;

    beforeEach(function() {
      event1 = {trigger: function() {}};
      event2 = {trigger: function() {}};
      keyboardString = Simulo.KeyboardString.create({keyboardEvents: [event1, event2]});

      triggerFirstEventSpy = spyOn(event1, 'trigger');
      triggerSecondEventSpy = spyOn(event2, 'trigger');

      keyboardString.triggerEvents();
    });

    it('triggers each of it\'s keyboard events', function() {
      expect(triggerFirstEventSpy).toHaveBeenCalled();
      expect(triggerSecondEventSpy).toHaveBeenCalled();
    });
  });
});
