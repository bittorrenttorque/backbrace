describe('Simulo.PageElement', function() {
  var pageElement;
  describe('initiliaztion', function() {
    context('when an element is not given', function() {
      context('when a selector is not given', function() {
        it('throws an error saying that it needs a selector', function() {
          expect(function() {
            Simulo.PageElement.create()
          }).toThrow('ERROR: PageElement expected a selector, but none was given');
        });
      });

      context('when a selector is given', function() {
        var coreQuerySpy, selector, element;
        beforeEach(function() {
          selector = '#something';
        });

        context('and there is no element that matches that selector', function() {
          beforeEach(function() {
            element = {length: 0};
            spyOn(SC, 'CoreQuery').andReturn(element);
          });

          it('throws an error saying that there were no elements that matched the selector', function() {
            expect(function() {
              Simulo.PageElement.create({selector: selector});
            }).toThrow('ERROR: Could not find ' + selector + ' on the page');
          });
        });

        context('and there is only one element that matches that selector', function() {
          beforeEach(function() {
            element = {length: 1};
            spyOn(SC, 'CoreQuery').andReturn(element);

            pageElement = Simulo.PageElement.create({selector: selector});
          });

          it('assigns the element to the page', function() {
            expect(pageElement.get('element')).toBe(element);
          });
        });

        context('and there are multiple elements that match that selector', function() {
          beforeEach(function() {
            element = {length: 2};
            spyOn(SC, 'CoreQuery').andReturn(element);
          });

          it('throws an error saying that there were multiple elements that matched the selector', function() {
            expect(function() {
              Simulo.PageElement.create({selector: selector});
            }).toThrow('ERROR: Page has multiple elements that match ' + selector );
          });
        });
      });
    });
  });

  describe('#click', function() {
    var triggerSpy, element, returnValue;
    beforeEach(function() {
      element = {};
      pageElement = Simulo.PageElement.create({element: element});
      triggerSpy = spyOn(SC.Event, 'trigger');

      runs(function() {
        returnValue = pageElement.click();
      });
    });

    it('triggers a mouseover event on the element', function() {
      expect(triggerSpy).toHaveBeenCalledWith(element, 'mouseover');
    });

    it('triggers a mousedown event on the element', function() {
      expect(triggerSpy).toHaveBeenCalledWith(element, 'mousedown');
    });

    it('triggers a focus event on the element', function() {
      expect(triggerSpy).toHaveBeenCalledWith(element, 'focus');
    });

    it('triggers a mouseup event on the element', function() {
      expect(triggerSpy).toHaveBeenCalledWith(element, 'mouseup');
    });

    it('allows chaining', function() {
      expect(returnValue).toBe(pageElement);
    });
  });

  describe('#fillInWith', function() {
    var element;
    context('when no value is given', function() {
      beforeEach(function() {
        element = {};
        pageElement = Simulo.PageElement.create({element: element});
      });

      it('throws an error saying that no value was given', function() {
        expect(function() {
          pageElement.fillInWith();
        }).toThrow('ERROR: No value was given to fill in the element with');
      });
    });

    context('when a value is given', function() {
      var createKeyboardStringSpy, value, keyboardString, keyboardStringSpy, returnValue;
      beforeEach(function() {
        keyboardString = {triggerEvents: function() {}};
        createKeyboardStringSpy = spyOn(Simulo.KeyboardString, 'create').andReturn(keyboardString);
        keyboardStringSpy = spyOn(keyboardString, 'triggerEvents');
        value = 'something';

        returnValue = pageElement.fillInWith(value);
      });

      it('creates a keyboard string array', function() {
        expect(createKeyboardStringSpy).toHaveBeenCalledWith({baseString: value, target: element});
      });

      it('tiggers the events of the keyboard string array', function() {
        expect(keyboardStringSpy).toHaveBeenCalled();
      });

      it('allows chaining', function() {
        expect(returnValue).toBe(pageElement);
      });
    });
  });

  describe('#pressEnter', function() {
    var createKeyboardEventSpy, keyboardEvent, keyboardEventSpy, returnValue;
    beforeEach(function() {
      element = {};
      pageElement = Simulo.PageElement.create({element: element});

      keyboardEvent = {trigger: function() {}};
      createKeyboardEventSpy = spyOn(Simulo.KeyboardEvent, 'create').andReturn(keyboardEvent);
      keyboardEventSpy = spyOn(keyboardEvent, 'trigger');

      returnValue = pageElement.pressEnter();
    });

    it('creates a keyboard event for pressing the enter key', function() {
      expect(createKeyboardEventSpy).toHaveBeenCalledWith({commandKey: 'enter', target: element});
    });

    it('tiggers the event it creates', function() {
      expect(keyboardEventSpy).toHaveBeenCalled();
    });

    it('allows chaining', function() {
      expect(returnValue).toBe(pageElement);
    });
  });
});
