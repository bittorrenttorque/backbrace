(function() {

  window.GameState = {
    "new": function(field) {
      var cells_remaining, finished, have_lost, have_won, increment_remaining_mines, lose, lost, mines_remaining, remaining_cells, remaining_mines, reveal_cell, won;
      mines_remaining = field.opts.mineCount;
      cells_remaining = field.opts.rows * field.opts.cols - field.opts.mineCount;
      have_lost = false;
      have_won = false;
      reveal_cell = function() {
        cells_remaining -= 1;
        if (cells_remaining < 1) return have_won = true;
      };
      increment_remaining_mines = function(increment) {
        return mines_remaining += increment;
      };
      lose = function() {
        return have_lost = true;
      };
      finished = function() {
        return have_won || have_lost;
      };
      remaining_mines = function() {
        return mines_remaining;
      };
      remaining_cells = function() {
        return cells_remaining;
      };
      won = function() {
        return have_won;
      };
      lost = function() {
        return have_lost;
      };
      return {
        lose: lose,
        reveal_cell: reveal_cell,
        finished: finished,
        won: won,
        lost: lost,
        remaining_mines: remaining_mines,
        remaining_cells: remaining_cells,
        increment_remaining_mines: increment_remaining_mines
      };
    }
  };

}).call(this);
