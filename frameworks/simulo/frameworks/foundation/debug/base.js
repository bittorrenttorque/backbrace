var Simulo = {
  clickOn: function(selector) {
    var pageElement = Simulo.PageElement.create({selector: selector});
    SC.RunLoop.begin();
    waits(1);
    runs(function() {
      pageElement.click();
    });
    SC.RunLoop.end();
    return this;
  },

  pressEnter: function(selector) {
    var pageElement = this._pageElement ? this._pageElement : Simulo.PageElement.create({selector: selector});
    SC.RunLoop.begin();
    waits(1);
    runs(function() {
      pageElement.pressEnter();
    });
    SC.RunLoop.end();
    return this;
  },

  fillIn: function(selector, value) {
    var pageElement = Simulo.PageElement.create({selector: selector});
    this._pageElement = pageElement;
    SC.RunLoop.begin();
    waits(1);
    runs(function() {
      pageElement.click();
      pageElement.fillInWith(value);
    });
    SC.RunLoop.end();

    return this;
  }
};
