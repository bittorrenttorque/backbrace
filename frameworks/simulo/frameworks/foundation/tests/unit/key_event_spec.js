describe('Simulo.KeyEvent', function() {
  var event;

  describe('#shiftKey', function() {
    context('when the it\'s character is a lower case letter', function() {
      beforeEach(function() {
        event = Simulo.KeyEvent.create({char: 'a'});
      });

      it('is false', function() {
        expect(event.get('shiftKey')).toBe(false);
      });
    });

    context('when the it\'s character is a capital letter', function() {
      beforeEach(function() {
        event = Simulo.KeyEvent.create({char: 'A'});
      });

      it('is true', function() {
        expect(event.get('shiftKey')).toBe(true);
      });
    });
  });
});

