// Backbrace.js 0.1.0

// (c) 2012 Patrick Williams
// Backbrace may be freely distributed under the MIT license.
// For all details and documentation:
// http://pwmckenna.github.com/backbrace

(function() {
    var DELIMITER = ' ';

    function initial_selector(selectors) {
        var tokens = selectors.split(DELIMITER);
        return _.first(tokens);
    }

    function remaining_selector(selectors) {
        var tokens = selectors.split(DELIMITER);
        var remaining = null;
        if(tokens.length > 1) {
            remaining = _.chain(tokens).rest().reduce(function(memo, token) {
                return memo ? memo + ' ' + token : token;
            }).value();
        }
        return remaining;        
    }

    function extend_array(matching, child) {
        var m = _.clone(matching || []);
        m.unshift(child);
        return m;
    }

    function arrays_equal(a, b) {
        var c = a || [];
        var d = b || [];
        if(c.length !== d.length) return false;
        for(var i = 0; i < c.length && i < d.length; i++) {
            if(c[i] !== d[i]) return false;
        }
        return true;
    }
    /**
        @param tokens - the attribute keys/model ids to match
        @param callback - the final callback that the user provided
        @param context - the context to be provided for the user provided callback
        @param matching - the values that have matched thus far
        @param child - the value that matched our previous "first" key
    **/
    function intermediate_callback(rest, callback, context, matching, child) {
        rest && child && typeof child.live !== 'undefined' && child.live(rest, callback, context, extend_array(matching, child));
        !rest && callback.apply(context, extend_array(matching, child));
    }

    _.extend(Backbone.Collection.prototype, {
        /**
            @param selectors - a space delimited string of attribute keys/model ids to match
            example: 'torrent * file * properties streaming_url'
            @param callback - the callback to be called with the matching values, in reverse order
            example: live('torrent * file * properties streaming_url', function(streaming_url, properties, file, file_list...)...
            @param context - the this pointer in the callback
            @param matching - not for external use...it is used to collect the callback arguments
        **/
        live: function(selectors, callback, context, matching) {
            var _this = this;
            var first = initial_selector(selectors);
            var rest = remaining_selector(selectors);

            var intermediate = _.bind(intermediate_callback, this, rest, callback, context, matching);
            var call_for_matching = function(fn) {
                if(first === '*') {
                    _this.each(fn);
                } else if(_this.get(first)) {
                    fn(_this.get(first));
                }
            }
            call_for_matching(intermediate);

            var event_name, event_callback;
            if(first === '*') {
                event_name = 'add';
                event_callback = intermediate;
            } else {
                event_name = 'add';
                event_callback = function(model) {
                    if(model.id === first) {
                        intermediate(model);
                    }
                };
            }

            //this is the only bound event on the object.
            //die needs only clean this callback up
            _this.on(event_name, event_callback, _this);
            var die;
            die = function(dselectors, dcallback, dcontext, dmatching) {
                if( dselectors === selectors && 
                    dcallback === callback && 
                    dcontext === context &&
                    arrays_equal(dmatching, matching)
                ) {
                    console.log(dmatching, matching);
                    call_for_matching(function(value) {
                        value.die(rest, dcallback, dcontext, extend_array(dmatching, value))
                    });
                    this.off(event_name, event_callback, this);
                    this.off('backbrace:die:' + selectors, die, this);
                }
            }
            _this.on('backbrace:die:' + selectors, die, _this);
        },

        die: function(dselectors, dcallback, dcontext, dmatching) {
            this.trigger('backbrace:die:' + dselectors, dselectors, dcallback, dcontext, dmatching);
        }
    });

    _.extend(Backbone.Model.prototype, {
        /**
            @param selectors - a space delimited string of attribute keys/model ids to match
            example: 'torrent * file * properties streaming_url'
            @param callback - the callback to be called with the matching values, in reverse order
            example: live('torrent * file * properties streaming_url', function(streaming_url, properties, file, file_list...)...
            @param context - the this pointer in the callback
            @param matching - not for external use...it is used to collect the callback arguments
        **/
        live: function(selectors, callback, context, matching) {
            var _this = this;
            var first = initial_selector(selectors);
            var rest = remaining_selector(selectors);

            var intermediate = _.bind(intermediate_callback, this, rest, callback, context, matching);
            var call_for_matching = function(fn) {
                if(first === '*') {
                    _.each(_this.toJSON(), fn);
                } else if(_this.has(first)) {
                    fn(_this.get(first), first);
                }
            }
            call_for_matching(intermediate);

            var event_name, event_callback;
            if(first === '*') {
                event_name = 'change';
                event_callback = function() {
                    _.each(_this.changedAttributes(), function(value, key) {
                        if(typeof _this.previous(key) === 'undefined')
                            intermediate(value);
                    });
                }
            } else {
                event_name = 'change:' + first;
                event_callback = function() {
                    if(typeof _this.previous(first) === 'undefined') {
                        //we have a new attribute!
                        var value = _this.get(first);
                        intermediate(value);
                    }
                }
            }

            //this is the only bound event on the object.
            //die needs only clean this callback up
            _this.on(event_name, event_callback, _this);
            var die;
            die = function(dselectors, dcallback, dcontext, dmatching) {
                if( dselectors === selectors && 
                    dcallback === callback && 
                    dcontext === context &&
                    arrays_equal(dmatching, matching)
                ) {
                    console.log(dmatching, matching);
                    call_for_matching(function(value) {
                        value.die(rest, dcallback, dcontext, extend_array(dmatching, value));
                    });
                    this.off(event_name, event_callback, this);
                    this.off('backbrace:die:' + selectors, die, this);
                }
            }
            _this.on('backbrace:die:' + selectors, die, _this);
        },

        die: function(dselectors, dcallback, dcontext, dmatching) {
            this.trigger('backbrace:die:' + dselectors, dselectors, dcallback, dcontext, dmatching);
        }
    });
}).call(this);