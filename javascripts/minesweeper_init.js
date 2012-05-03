(function() {

  $(function() {
    var create, opts, presets, with_eval_parameter, with_numeric_parameter, with_parameter;
    create = function(opts) {
      return FieldPresenter.append('#minesweepers', opts);
    };
    presets = {
      beginner: {
        rows: 9,
        cols: 9,
        mineCount: 10
      },
      intermediate: {
        rows: 16,
        cols: 16,
        mineCount: 40
      },
      expert: {
        rows: 16,
        cols: 30,
        mineCount: 99
      }
    };
    with_parameter = function(key, action) {
      if ($.QueryString(key)) return action($.QueryString(key));
    };
    with_numeric_parameter = function(key, action) {
      return with_parameter(key, function(number) {
        return action(parseInt(number));
      });
    };
    with_eval_parameter = function(key, action) {
      return with_parameter(key, function(statement) {
        return action(eval(statement));
      });
    };
    opts = presets['expert'];
    with_parameter('preset', function(preset) {
      return opts = presets[preset];
    });
    with_numeric_parameter('rows', function(number) {
      return opts.rows = number;
    });
    with_numeric_parameter('cols', function(number) {
      return opts.cols = number;
    });
    with_numeric_parameter('minecount', function(number) {
      return opts.mineCount = number;
    });
    with_numeric_parameter('minescount', function(number) {
      return opts.mineCount = number;
    });
    with_eval_parameter('mines', function(mines) {
      opts.mineCount = mines.length;
      return opts.mines = mines;
    });
    if (!$.QueryString('blank')) return create(opts);
  });

}).call(this);
