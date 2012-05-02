describe('Simulo.KeyPressEvent', function() {
  var event;

  describe('#trigger', function() {
    var simulateEventSpy, target, keyPressAttributes, char, simulatedEvent, triggerEventSpy;

    beforeEach(function() {
      char = 'a';
      target = 'target';
      keyPressAttributes = {
        keyCode: 97,
        which: 97,
        charCode: 97,
        altKey: false,
        ctrlKey: false,
        metaKey: false,
        shiftKey: false
      };

      event = Simulo.KeyPressEvent.create({char: char, target: target});
      simulatedEvent = {};
      simulateEventSpy = spyOn(SC.Event, 'simulateEvent').andReturn(simulatedEvent);
      triggerEventSpy = spyOn(SC.Event, 'trigger');
      event.trigger();
    });

    it('generates a simulated event with the proper attributes', function() {
      expect(simulateEventSpy).toHaveBeenCalledWith(target, 'keypress', keyPressAttributes);
    });

    it('triggers an event with the created simulated event', function() {
      expect(triggerEventSpy).toHaveBeenCalledWith(target, 'keypress', simulatedEvent);
    });

  });

  describe('#keyCode', function() {
    it('is the evaluated char code', function() {
      event = Simulo.KeyPressEvent.create({char: 'a'}); 

      expect(event.get('keyCode')).toBe(97);
    });
  });

  describe('#charCode', function() {
    beforeEach(function() {
      event = Simulo.KeyPressEvent.create({char: 'a'});
    });

    it('is the evaluated charcode', function() {
      expect(event.get('charCode')).toBe(97);
    });
  });
});

