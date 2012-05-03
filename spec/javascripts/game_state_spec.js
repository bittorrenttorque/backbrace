(function() {

  describe('GameState', function() {
    var field, game_state;
    game_state = null;
    field = Field["new"]({
      mineCount: 1,
      rows: 1,
      cols: 3
    });
    beforeEach(function() {
      return game_state = GameState["new"](field);
    });
    it('should initialise lost to false', function() {
      return expect(game_state.lost()).toEqual(false);
    });
    it('should initialise won to false', function() {
      return expect(game_state.won()).toEqual(false);
    });
    it('should initialise remaining_mines to mine_count', function() {
      return expect(game_state.remaining_mines()).toEqual(1);
    });
    it('should initialise remaining_mines to mine_count', function() {
      return expect(game_state.remaining_cells()).toEqual(2);
    });
    it('should set lost to true after call to lose', function() {
      game_state.lose();
      return expect(game_state.lost()).toEqual(true);
    });
    return it('should set won to true after all cells are revealed', function() {
      game_state.reveal_cell();
      expect(game_state.won()).toEqual(false);
      game_state.reveal_cell();
      return expect(game_state.won()).toEqual(true);
    });
  });

}).call(this);
