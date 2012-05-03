(function() {

  describe('minesweeper', function() {
    var cell_state, cls, double_click, givenField, indicator_class, indicator_click, indicator_press, left_click, left_press, remaining_mines, right_click;
    right_click = function(row, col) {
      return $("#g1r" + row + "c" + col).trigger({
        type: 'mouseup',
        which: 2
      });
    };
    left_click = function(row, col) {
      return $("#g1r" + row + "c" + col).trigger({
        type: 'mouseup',
        which: 1
      });
    };
    left_press = function(row, col) {
      return $("#g1r" + row + "c" + col).trigger({
        type: 'mousedown',
        which: 1
      });
    };
    double_click = function(row, col) {
      return $("#g1r" + row + "c" + col).trigger({
        type: 'dblclick',
        which: 1
      });
    };
    indicator_press = function() {
      return $("#g1indicator").trigger({
        type: 'mousedown'
      });
    };
    cls = function(id) {
      return $("#" + id).attr('class');
    };
    indicator_click = function() {
      return $("#g1indicator").trigger({
        type: 'mouseup'
      });
    };
    indicator_class = function() {
      return cls('g1indicator');
    };
    cell_state = function(row, col) {
      return cls("g1r" + row + "c" + col);
    };
    remaining_mines = function() {
      var lcd_digit;
      lcd_digit = function(exponent) {
        var match;
        match = /lcd n(\d)/.exec(cls("g1minesRemaining" + exponent + "s"));
        return match[1];
      };
      return parseInt("" + (lcd_digit(100)) + (lcd_digit(10)) + (lcd_digit(1)));
    };
    givenField = function(s) {
      var lastrow, lines, mines;
      mines = [];
      lines = s.split("\n");
      lastrow = null;
      _.each(lines, function(line, row) {
        lastrow = line.split(" ");
        return _.each(lastrow, function(char, col) {
          if (char === '*') return mines.push([row, col]);
        });
      });
      return FieldPresenter.render('#jasmine_content', {
        cols: lastrow.length,
        rows: lines.length,
        mines: mines,
        mineCount: mines.length
      });
    };
    it('should display test mode when specifying mine locations', function() {
      FieldPresenter.render('#jasmine_content', {
        cols: 2,
        rows: 2,
        mines: [[0, 0]]
      });
      return expect($("#test_mode").text()).toEqual('TEST MODE');
    });
    it('should not display test mode when using random mines', function() {
      var mineCount;
      FieldPresenter.render('#jasmine_content', {
        cols: 2,
        rows: 2
      }, mineCount = 1);
      return expect($("#test_mode").text()).toEqual('');
    });
    it('should cycle through marked to uncertain to unclicked on right click', function() {
      givenField("* .");
      expect(cell_state(0, 0)).toEqual('unclicked');
      right_click(0, 0);
      expect(cell_state(0, 0)).toEqual('marked');
      right_click(0, 0);
      expect(cell_state(0, 0)).toEqual('uncertain');
      right_click(0, 0);
      return expect(cell_state(0, 0)).toEqual('unclicked');
    });
    it('should reveal cell with no adjacent mines', function() {
      givenField(". .");
      left_click(0, 0);
      return expect(cell_state(0, 0)).toEqual('mines0');
    });
    it('should reveal cell with one adjacent mine', function() {
      givenField(". *");
      left_click(0, 0);
      return expect(cell_state(0, 0)).toEqual('mines1');
    });
    it('should reveal cell with two adjacent mines', function() {
      givenField(". *\n* .");
      left_click(0, 0);
      return expect(cell_state(0, 0)).toEqual('mines2');
    });
    it('should reveal cell with three adjacent mines', function() {
      givenField(". *\n* *");
      left_click(0, 0);
      return expect(cell_state(0, 0)).toEqual('mines3');
    });
    it('should reveal cell with four adjacent mines', function() {
      givenField("* . *\n. * *");
      left_click(0, 1);
      return expect(cell_state(0, 1)).toEqual('mines4');
    });
    it('should reveal cell with five adjacent mines', function() {
      givenField("* . *\n* * *");
      left_click(0, 1);
      return expect(cell_state(0, 1)).toEqual('mines5');
    });
    it('should reveal cell with six adjacent mines', function() {
      givenField("* . .\n* . *\n* * *");
      left_click(1, 1);
      return expect(cell_state(1, 1)).toEqual('mines6');
    });
    it('should reveal cell with six adjacent mines', function() {
      givenField("* * .\n* . *\n* * *");
      left_click(1, 1);
      return expect(cell_state(1, 1)).toEqual('mines7');
    });
    it('should reveal cell with six adjacent mines', function() {
      givenField("* * *\n* . *\n* * *");
      left_click(1, 1);
      return expect(cell_state(1, 1)).toEqual('mines8');
    });
    it('should reveal adjacent cells when there are no adjacent mines', function() {
      givenField(". .\n. .\n* .");
      left_click(0, 0);
      expect(cell_state(0, 0)).toEqual('mines0');
      expect(cell_state(0, 1)).toEqual('mines0');
      expect(cell_state(1, 0)).toEqual('mines1');
      expect(cell_state(1, 1)).toEqual('mines1');
      return expect(cell_state(2, 1)).toEqual('unclicked');
    });
    it('should display depressed button when indicator button is clicked', function() {
      givenField(".");
      indicator_press();
      return expect(indicator_class()).toEqual('status alivePressed');
    });
    it('should reset game when indicator button is clicked', function() {
      givenField(".");
      expect(cell_state(0, 0)).toEqual('unclicked');
      left_click(0, 0);
      expect(cell_state(0, 0)).toEqual('mines0');
      indicator_click();
      return expect(cell_state(0, 0)).toEqual('unclicked');
    });
    it('should display initial mine count', function() {
      givenField("* .");
      return expect(remaining_mines()).toEqual(1);
    });
    it('should decrement mine count when a mine is marked', function() {
      givenField("* .");
      right_click(0, 0);
      return expect(remaining_mines()).toEqual(0);
    });
    it('should reincrement mine count when a mine is marked and then unmarked', function() {
      givenField("* .");
      right_click(0, 0);
      right_click(0, 0);
      return expect(remaining_mines()).toEqual(1);
    });
    it('should ignore attempts to mark a mine when the full number of mines have been marked', function() {
      givenField("* .");
      right_click(0, 0);
      right_click(0, 1);
      return expect(remaining_mines()).toEqual(0);
    });
    it('should change game indicator to dead when a mine is clicked', function() {
      givenField("* .");
      left_click(0, 0);
      return expect(indicator_class()).toEqual('status dead');
    });
    it('should reveal all mines when a mine is clicked', function() {
      givenField("* * .");
      left_click(0, 0);
      expect(cell_state(0, 0)).toEqual('clicked_mine');
      return expect(cell_state(0, 1)).toEqual('mine');
    });
    it('should ignore left clicks once a game has been lost', function() {
      givenField("* .");
      left_click(0, 0);
      left_click(0, 1);
      return expect(cell_state(0, 1)).toEqual('unclicked');
    });
    it('should ignore right clicks once a game has been lost', function() {
      givenField("* .");
      left_click(0, 0);
      right_click(0, 1);
      return expect(cell_state(0, 1)).toEqual('unclicked');
    });
    it('should ignore right clicks on marked once a game has been lost', function() {
      givenField("* * .");
      right_click(0, 1);
      expect(cell_state(0, 1)).toEqual('marked');
      left_click(0, 0);
      right_click(0, 1);
      return expect(cell_state(0, 1)).toEqual('marked');
    });
    it('should ignore right clicks on uncertain once a game has been lost', function() {
      givenField("* .");
      right_click(0, 1);
      right_click(0, 1);
      left_click(0, 0);
      right_click(0, 1);
      return expect(cell_state(0, 1)).toEqual('uncertain');
    });
    it('should change game indicator to won when the game has been won', function() {
      givenField("* .");
      left_click(0, 1);
      return expect(indicator_class()).toEqual('status won');
    });
    it('should change game indicator status to scared when the user is about to reveal a cell', function() {
      givenField("* .");
      left_press(0, 1);
      return expect(indicator_class()).toEqual('status scared');
    });
    it('should not change game indicator status to scared on a revealed cell', function() {
      givenField("* . .");
      left_click(0, 1);
      left_press(0, 1);
      return expect(indicator_class()).toEqual('status alive');
    });
    it('should not change game indicator status to scared on a marked cell', function() {
      givenField("* . .");
      right_click(0, 1);
      left_press(0, 1);
      return expect(indicator_class()).toEqual('status alive');
    });
    it('should not change game indicator status to scared on an uncertain cell', function() {
      givenField("* . .");
      right_click(0, 1);
      right_click(0, 1);
      left_press(0, 1);
      return expect(indicator_class()).toEqual('status alive');
    });
    it('should change game indicator status back from scared to alive when the user is has revealed a cell that does not have a mine', function() {
      givenField(". *\n. .");
      left_press(0, 0);
      expect(indicator_class()).toEqual('status scared');
      left_click(0, 0);
      return expect(indicator_class()).toEqual('status alive');
    });
    it('should change game indicator status back from scared to dead when the user is has revealed a cell that has a mine', function() {
      givenField(". *\n. .");
      left_press(0, 1);
      expect(indicator_class()).toEqual('status scared');
      left_click(0, 1);
      return expect(indicator_class()).toEqual('status dead');
    });
    it('should end the game when a cell containing mine is left clicked', function() {
      givenField("* .\n. .");
      left_click(0, 0);
      return expect(indicator_class()).toEqual('status dead');
    });
    it('should show a red mine on the mine you clicked on when a cell containing mine is left clicked', function() {
      givenField("* .\n. .");
      left_click(0, 0);
      return expect(cell_state(0, 0)).toEqual('clicked_mine');
    });
    it('should keep the flags on marked mines when a cell containing mine is left clicked', function() {
      givenField("* *\n. .");
      right_click(0, 0);
      left_click(0, 1);
      return expect(cell_state(0, 0)).toEqual('marked');
    });
    it('should show a incorrect flag on falsely marked mines when a cell containing mine is left clicked', function() {
      givenField(". *\n. .");
      right_click(0, 0);
      left_click(0, 1);
      return expect(cell_state(0, 0)).toEqual('nomine');
    });
    it('should ignore left clicks once a game has been won', function() {
      givenField("* .");
      left_click(0, 1);
      left_click(0, 0);
      return expect(cell_state(0, 0)).toEqual('unclicked');
    });
    it('should click all non-marked neighbouring cells when double clicking a numeric cell', function() {
      givenField("* . .\n. . .\n. . * ");
      right_click(0, 0);
      expect(cell_state(0, 0)).toEqual('marked');
      left_click(0, 1);
      expect(cell_state(0, 1)).toEqual('mines1');
      double_click(0, 1);
      expect(cell_state(0, 0)).toEqual('marked');
      expect(cell_state(0, 2)).toEqual('mines0');
      expect(cell_state(1, 0)).toEqual('mines1');
      expect(cell_state(1, 1)).toEqual('mines2');
      return expect(cell_state(1, 2)).toEqual('mines1');
    });
    it('should do nothing when double clicking a numeric cell with no surrounding marked cells', function() {
      givenField("* . .\n. . .\n. . * ");
      left_click(0, 1);
      expect(cell_state(0, 1)).toEqual('mines1');
      double_click(0, 1);
      expect(indicator_class()).toEqual('status alive');
      expect(cell_state(0, 0)).toEqual('unclicked');
      expect(cell_state(0, 2)).toEqual('unclicked');
      expect(cell_state(1, 0)).toEqual('unclicked');
      expect(cell_state(1, 1)).toEqual('unclicked');
      return expect(cell_state(1, 2)).toEqual('unclicked');
    });
    it('should do nothing when double clicking a numeric cell with non-matching surrounding marked cells', function() {
      givenField("* . .\n. . .\n. . * ");
      left_click(1, 1);
      expect(cell_state(1, 1)).toEqual('mines2');
      right_click(0, 0);
      expect(cell_state(0, 0)).toEqual('marked');
      double_click(1, 1);
      expect(indicator_class()).toEqual('status alive');
      expect(cell_state(0, 0)).toEqual('marked');
      expect(cell_state(0, 1)).toEqual('unclicked');
      expect(cell_state(0, 2)).toEqual('unclicked');
      expect(cell_state(1, 0)).toEqual('unclicked');
      expect(cell_state(1, 1)).toEqual('mines2');
      expect(cell_state(1, 2)).toEqual('unclicked');
      expect(cell_state(2, 0)).toEqual('unclicked');
      expect(cell_state(2, 1)).toEqual('unclicked');
      return expect(cell_state(2, 2)).toEqual('unclicked');
    });
    return it('should end the game when double clicking a numeric cell with surrounding falsely marked cells', function() {
      givenField("* . .\n. . .\n. . * ");
      left_click(0, 1);
      expect(cell_state(0, 1)).toEqual('mines1');
      right_click(1, 0);
      expect(cell_state(1, 0)).toEqual('marked');
      double_click(0, 1);
      expect(indicator_class()).toEqual('status dead');
      expect(cell_state(0, 0)).toEqual('clicked_mine');
      expect(cell_state(0, 1)).toEqual('mines1');
      expect(cell_state(0, 2)).toEqual('unclicked');
      expect(cell_state(1, 0)).toEqual('nomine');
      expect(cell_state(1, 1)).toEqual('unclicked');
      return expect(cell_state(1, 2)).toEqual('unclicked');
    });
  });

}).call(this);
