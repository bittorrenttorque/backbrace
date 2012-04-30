(function() {
    var Live = {
        live: function(selector, callback) {
            var selectors = jQuery.trim(selector).split(' ');
            if(selectors.length == 0) return;

            // Detect existing matches, as well as matches that will be added.
            // The callbacks should differ depending on if this is the last selector. 
            if(selectors.length > 1) {
                var finisher = callback;
                callback = function(elem) {
                    var tmp = _(selectors).tail().reduce(function(memo, part) { return memo + ' ' + part; });
                    elem.live.call(elem, tmp, finisher);
                };
            }

            var key = _(selectors).first();
            if(this.get(key)) {
                callback(this.get(key));
            }

            // Even if it already exists, it may disappear, or match multiple not yet added objects.
            if(this instanceof Backbone.Model) {
                if(key === '*') {
                    this.on('change', function() {
                        //lets find all the attributes that are new
                        var prev = elem.previousAttributes();
                        _(elem.changedAttributes()).each(function(value, key) {
                            if(!(key in prev)) {
                                callback(this.get(key), elem);
                            }
                        });
                    });
                } else {
                    this.on('change:' + key, function(elem) {
                        var prev = elem.previousAttributes();
                        if(!(key in prev)) {
                            callback(this.get(key), elem);
                        }
                    });
                }
            } else if(this instanceof Backbone.Collection) {
                this.on('add', function(elem) {
                    if(key === '*' || elem.id === key) {
                        callback(this.get(key), elem);
                    }
                });
            }
        }
    };
    _.extend(Backbone.Model.prototype, Live);
    _.extend(Backbone.Collection.prototype, Live);
}).call(this);