(function() {

  window.Timer = {
    "new": function(name) {
      var count, increment_timer, lcd, stop, tick, timer;
      count = null;
      timer = null;
      lcd = Lcd["new"](name);
      tick = function(increment) {
        if (increment == null) increment = 1;
        count += increment;
        return lcd.display(count);
      };
      increment_timer = function() {
        tick(1);
        return timer = setTimeout(increment_timer, 1000);
      };
      stop = function() {
        if (timer) clearTimeout(timer);
        timer = null;
        return count = 0;
      };
      return {
        start: function() {
          if (!timer) return timer = setTimeout(increment_timer, 1000);
        },
        stop: stop
      };
    }
  };

}).call(this);
