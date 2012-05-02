describe('Simulo', function() {
  var pageElement, createsPageElementSpy, selector;
  beforeEach(function() {
    pageElement = {click: function() {}, fillInWith: function() {}, pressEnter: function() {}};
    selector = '#someId';
    createsPageElementSpy = spyOn(Simulo.PageElement, 'create').andReturn(pageElement);
  });

  describe('.clickOn', function() {
    var value, clickSpy, returnValue;

    beforeEach(function() {
      clickSpy = spyOn(pageElement, 'click');

      returnValue = Simulo.clickOn(selector);
    });

    it('creates a page element', function() {
      expect(createsPageElementSpy).toHaveBeenCalledWith({selector: selector});
    });

    it('tells the element to click on itself', function() {
      expect(clickSpy).toHaveBeenCalled();
    });

    it('allows chaining events', function() {
      expect(returnValue).toBe(Simulo);
    });
  });

  describe('.pressEnter', function() {
    var value, clickSpy, returnValue;

    beforeEach(function() {
      pressEnterSpy = spyOn(pageElement, 'pressEnter');
    });

    context('when simulo is working in the context of a page element', function() {
      beforeEach(function() {
        Simulo._pageElement = pageElement;
        returnValue = Simulo.pressEnter()
      });
      
      afterEach(function() {
        Simulo._pageElement = undefined;
      });

      it('does not create a pate element', function() {
        expect(createsPageElementSpy).not.toHaveBeenCalled();
      });

      it('tells the element to press enter on itself', function() {
        expect(pressEnterSpy).toHaveBeenCalled();
      });

      it('allows chaining events', function() {
        expect(returnValue).toBe(Simulo);
      });
    });

    context('when simulo is working in the context of selecting a page element', function() {
      beforeEach(function() {
        returnValue = Simulo.pressEnter(selector)
      });

      it('creates a page element', function() {
        expect(createsPageElementSpy).toHaveBeenCalledWith({selector: selector});
      });

      it('tells the element to press enter on itself', function() {
        expect(pressEnterSpy).toHaveBeenCalled();
      });

      it('allows chaining events', function() {
        expect(returnValue).toBe(Simulo);
      });
    });



  });

  describe('.fillIn', function() {
    var value, clickSpy, fillInWithSpy, returnValue;

    beforeEach(function() {
      value = 'something';
      fillInWithSpy = spyOn(pageElement, 'fillInWith');
      clickSpy = spyOn(pageElement, 'click');

      returnValue = Simulo.fillIn(selector, value);
    });

    it('creates a page element', function() {
      expect(createsPageElementSpy).toHaveBeenCalledWith({selector: selector});
    });

    it('tells the element to click on itself', function() {
      expect(clickSpy).toHaveBeenCalled();
    });

    it('tells the element to fill in itself with the passed in value', function() {
      expect(fillInWithSpy).toHaveBeenCalledWith(value);
    });

    it('allows chaining events', function() {
      expect(returnValue).toBe(Simulo);
    });
  });
});
