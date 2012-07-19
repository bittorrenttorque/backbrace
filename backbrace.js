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

    /**
        @param call_for_matching - will call the function on each child element that matches the selector provided
        @param event_name - the event name passed to 'on'. used to remove that event handler via 'off'
        @param event_callback - the callback passed to 'on'. used to remove that event handler via 'off'
        @param selectors - the event selector for the event handler that we are responsible for relieving
        @param callback - the callback that we are responsible for relieving
        @param context - the context of the callback that we are responsible for relieving
        @param matching - the collection of previously matched values. used in this context to determine where we are in the object tree
    **/
    function attach_die_handler(call_for_matching, event_name, event_callback, selectors, callback, context, matching) {
        var _this, die;

        _this = this;
        die = function(dselectors, dcallback, dcontext, dmatching) {
            var rest;
            if( dselectors === selectors && 
                dcallback === callback && 
                dcontext === context &&
                arrays_equal(dmatching, matching)
            ) {
                rest = remaining_selector(selectors);
                call_for_matching(function(value) {
                    value.die(rest, dcallback, dcontext, extend_array(dmatching, value));
                });
                _this.off(event_name, event_callback, _this);
                _this.off('backbrace:die:' + selectors, die, _this);
            }
        }
        _this.on('backbrace:die:' + selectors, die, _this);
    }

    /**
        Leaves the burdon on the live call to set up an event handler for our die event. Unless 
        we want to figure out exactly what event that we used to listen for the next level of 
        matching elements, we should let that be handled in the same context that it was originally set

        @param dselectors - the selector string that should match the one sent to live
        @param dcallback - the callback function that should match the one sent to live
        @param dcontext - the context that should match the one sent to live
        @param dmatching - the elements that have matches so far...used if we're being called as a result of die being called on our parent
    **/
    var die = function(dselectors, dcallback, dcontext, dmatching) {
        this.trigger('backbrace:die:' + dselectors, dselectors, dcallback, dcontext, dmatching);
    };

    _.extend(Backbone.Collection.prototype, { die: die });
    _.extend(Backbone.Model.prototype, { die: die });

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
            var _this, first, rest, intermediate, call_for_matching, event_name, event_callback;

            _this = this;
            first = initial_selector(selectors);
            rest = remaining_selector(selectors);

            intermediate = _.bind(intermediate_callback, this, rest, callback, context, matching);
            call_for_matching = function(fn) {
                if(first === '*') {
                    _this.each(fn);
                } else if(_this.get(first)) {
                    fn(_this.get(first));
                }
            }
            call_for_matching(intermediate);

            event_name = 'add';
            event_callback = first === '*' ? intermediate : function(model) {
                if(model.id === first) {
                    intermediate(model);
                }
            };

            _this.on(event_name, event_callback, _this);
            attach_die_handler.call(_this, call_for_matching, event_name, event_callback, selectors, callback, context, matching);
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
            var _this, first, rest, intermediate, call_for_matching, event_name, event_callback;

            _this = this;
            first = initial_selector(selectors);
            rest = remaining_selector(selectors);

            intermediate = _.bind(intermediate_callback, this, rest, callback, context, matching);
            call_for_matching = function(fn) {
                if(first === '*') {
                    _.each(_this.toJSON(), fn);
                } else if(_this.has(first)) {
                    fn(_this.get(first), first);
                }
            }
            call_for_matching(intermediate);

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
                    var value;
                    if(typeof _this.previous(first) === 'undefined') {
                        //we have a new attribute!
                        value = _this.get(first);
                        intermediate(value);
                    }
                }
            }

            _this.on(event_name, event_callback, _this);
            attach_die_handler.call(_this, call_for_matching, event_name, event_callback, selectors, callback, context, matching);
        }
    });
}).call(this);