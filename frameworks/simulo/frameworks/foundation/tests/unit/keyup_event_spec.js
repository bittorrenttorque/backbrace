describe('Simulo.KeyUpEvent', function() {
  var event;

  describe('#trigger', function() {
    var simulateEventSpy, target, keyUpAttributes, char;

    beforeEach(function() {
      char = 'a';
      target = 'target';
      keyUpAttributes = {
        keyCode: 65,
        which: 65,
        charCode: 0,
        altKey: false,
        ctrlKey: false,
        metaKey: false,
        shiftKey: false
      };

      event = Simulo.KeyUpEvent.create({char: char, target: target});
      simulatedEvent = {};
      simulateEventSpy = spyOn(SC.Event, 'simulateEvent').andReturn(simulatedEvent);
      triggerEventSpy = spyOn(SC.Event, 'trigger');
      event.trigger();
    });

    it('generates a simulated event with the proper attributes', function() {
      expect(simulateEventSpy).toHaveBeenCalledWith(target, 'keyup', keyUpAttributes);
    });

    it('triggers an event with the created simulated event', function() {
      expect(triggerEventSpy).toHaveBeenCalledWith(target, 'keyup', simulatedEvent);
    });
  });

  describe('#charCode', function() {
    beforeEach(function() {
      event = Simulo.KeyUpEvent.create();
    });

    it('is always 0', function() {
      expect(event.get('charCode')).toBe(0);
    });
  });

  describe('#keyCode', function() {
    context('when a character key is given', function() {
      beforeEach(function() {
        event = Simulo.KeyUpEvent.create({char: 'a'});
      });

      it('is the evaluated character key code', function() {
        expect(event.get('keyCode')).toBe(65);
      });
    });

    context('when a command key is given', function() {
      beforeEach(function() {
        event = Simulo.KeyUpEvent.create({commandKey: 'enter'});
      });

      it('is the evaluated command key code', function() {
        expect(event.get('keyCode')).toBe(13);
      });
    });
  });
});
