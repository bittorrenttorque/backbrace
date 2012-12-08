// Backbrace.js 0.3.0

// (c) 2012 Patrick Williams
// Backbrace may be freely distributed under the MIT license.
// For all details and documentation:
// http://github.com/bittorrenttorque/backbrace

(function() {
    "use strict";
    function assert(condition, error) { 
        if(!condition) {
            throw error; 
        }
    }
    /**
        Make the default delimiter ' ', but make it possible to change using
        the function "setDelimiter", which is publicly available, so that it can be
        changed. This will help alleviate the issues with spaces, which are
        legal characters in attribute keys and model ids.
    **/
    var _delimiter = ' ';
    /**
        The same problem with * being a valid character in model ids and attribute keys
        applies here. So we need to make this adjustable in case the user finds themself
        trying to use Backbrace in the presence of * characters.
    **/
    var _wildcard = '*';
    /**
        Do some internal bookkeeping that will help us ensure that we never leave danging event handlers 
    **/
    var _on_count = 0;
    var _live_count = 0;

    this.Backbrace = {
        setDelimiter: function(d) {
            // Sending ',' into .on() calls would mean something very different than we intent.
            assert(d !== ',', 'cannot use , as a delimiter as it will prevent event callbacks from being set properly');
            assert(this.isClean(), 'setting the delimiter after calling live can cause unexpected behavior');
            assert(d !== _wildcard, 'setting the delimiter to the same value as the wildcard can cause unexpected behavior');
            _delimiter = d;
        },
        setWildcard: function(w) {
            assert(w !== ',', 'cannot use , as a wildcard as it will prevent event callbacks from being set properly');
            assert(this.isClean(), 'setting the wildcard after calling live can cause unexpected behavior');
            assert(w !== _delimiter, 'setting the wildcard to the same value as the delimiter can cause unexpected behavior');
            _wildcard = w;
        },
        isClean: function() {
            return _on_count === 0 && _live_count === 0;
        }
    };

    function initial_selector(selectors) {
        assert(_.isString(selectors), 'initial_selector takes a single argument');
        var tokens = selectors.split(_delimiter);
        assert(_.isArray(tokens));
        var ret = _.first(tokens);
        assert(_.isString(ret), 'initial_selector should return a string');
        return ret;
    }

    function remaining_selector(selectors) {
        assert(_.isString(selectors));
        var tokens, remaining;
        tokens = selectors.split(_delimiter);
        assert(_.isArray(tokens));
        remaining = null;
        if (tokens.length > 1) {
            remaining = _.chain(tokens).rest().reduce(function(memo, token) {
                return memo ? memo + _delimiter + token : token;
            }).value();
            assert(_.isString(remaining));
        }
        return remaining;
    }

    function extend_array(matching, child) {
        assert(_.toString(child));
        var m = _.clone(matching || []);
        m.unshift(child);
        return m;
    }

    function arrays_equal(a, b) {
        var c, d, i;
        c = a || [];
        d = b || [];
        if (c.length !== d.length) {
            return false;
        }
        for (i = 0; i < c.length && i < d.length; i++) {
            if(c[i] !== d[i]) {
                return false;
            }
        }
        return true;
    }
    /**
        This is the callback that will be called at every level of matching elements. It will then check if an addition
        level of iterating and event binding is necessary, or if we match the final selector and can simply call the
        originally specified callback

        @param tokens - the attribute keys/model ids to match
        @param callback - the final callback that the user provided
        @param context - the context to be provided for the user provided callback
        @param matching - the values that have matched thus far
        @param child - the value that matched our previous "first" key
    **/
    function intermediate_callback(rest, callback, context, matching, child) {
        assert(_.isNull(rest) || _.isString(rest));
        assert(_.isFunction(callback));
        if(rest && child && !_.isUndefined(child.live)) {
            child.live(rest, callback, context, extend_array(matching, child));
        } else if(!rest) {
            callback.apply(context, extend_array(matching, child));
        }
    }

    /**
        When we set up all the on event handlers, we have all the context necessary to undo our changes, so lets
        set it up so a single simple event triggered from the die call can undo everything.

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

        assert(_.isFunction(call_for_matching));
        assert(_.isString(event_name));
        assert(_.isFunction(event_callback));
        assert(_.isString(selectors));
        assert(_.isFunction(callback));


        _this = this;
        die = function(dselectors, dcallback, dcontext, dmatching) {
            var rest;
            if( dselectors === selectors && 
                dcallback === callback && 
                dcontext === context &&
                arrays_equal(dmatching, matching)
            ) {
                rest = remaining_selector(selectors);
                if(rest) {
                    call_for_matching(function(value) {
                        if(_.isFunction(value.die)) {
                            value.die(rest, dcallback, dcontext, extend_array(dmatching, value));
                        }
                    });
                }
                _this.off(event_name, event_callback, _this);
                _on_count--;
                _this.off('backbrace:die:' + selectors, die, _this);
                _on_count--;
            }
        };
        _this.on('backbrace:die:' + selectors, die, _this);
        _on_count++;
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
        assert(_.isString(dselectors));
        assert(_.isFunction(dcallback));
        this.trigger('backbrace:die:' + dselectors, dselectors, dcallback, dcontext, dmatching);

        _live_count--;
        return this;
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
            assert(_.isString(selectors));
            assert(_.isFunction(callback));

            var _this, first, rest, intermediate, call_for_matching, event_name, event_callback;

            _live_count++;

            _this = this;
            first = initial_selector(selectors);
            rest = remaining_selector(selectors);

            assert(_.isString(first));
            assert(_.isNull(rest) || _.isString(rest));


            intermediate = _.bind(intermediate_callback, this, rest, callback, context, matching);
            call_for_matching = function(fn) {
                if(first === _wildcard) {
                    _this.each(fn);
                } else if(_this.get(first)) {
                    fn(_this.get(first));
                }
            };
            call_for_matching(intermediate);

            event_name = 'add';
            event_callback = first === _wildcard ? intermediate : function(model) {
                if(model.id === first) {
                    intermediate(model);
                }
            };

            _this.on(event_name, event_callback, _this);
            _on_count++;
           
            attach_die_handler.call(_this, call_for_matching, event_name, event_callback, selectors, callback, context, matching);
            return _this;
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

            _live_count++;

            _this = this;
            first = initial_selector(selectors);
            rest = remaining_selector(selectors);

            intermediate = _.bind(intermediate_callback, this, rest, callback, context, matching);
            call_for_matching = function(fn) {
                if(first === _wildcard) {
                    _.each(_this.toJSON(), fn);
                } else if(_this.has(first)) {
                    fn(_this.get(first), first);
                }
            };
            call_for_matching(intermediate);

            if(first === _wildcard) {
                event_name = 'change';
                event_callback = function() {
                    _.each(_this.changedAttributes(), function(value, key) {
                        if(_.isUndefined(_this.previous(key))) {
                            intermediate(value);
                        }
                    });
                };
            } else {
                event_name = 'change:' + first;
                event_callback = function() {
                    var value;
                    if(_.isUndefined(_this.previous(first))) {
                        //we have a new attribute!
                        value = _this.get(first);
                        intermediate(value);
                    }
                };
            }

            _this.on(event_name, event_callback, _this);
            _on_count++;
            attach_die_handler.call(_this, call_for_matching, event_name, event_callback, selectors, callback, context, matching);
            return _this;
        }
    });
}).call(this);