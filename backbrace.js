// Backbrace.js 0.1.0

// (c) 2012 Patrick Williams
// Backbrace may be freely distributed under the MIT license.
// For all details and documentation:
// http://pwmckenna.github.com/backbrace

(function() {
    /**
        @param rest - the attribute keys/model ids left to match
        @param callback - the final callback that the user provided
        @param context - the context to be provided for the user provided callback
        @param matching - the values that have matched thus far
        @param obj - the value that matched our previous "first" key
    **/
    function intermediate_callback(rest, callback, context, matching, obj) {
        var m = _.clone(matching || []);
        m.unshift(obj);
        rest && obj && typeof obj.live !== 'undefined' && obj.live(rest, callback, context, m);
        !rest && callback.apply(context, m);
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
            var tokens = selectors.split(' ');

            var first = null;
            if(tokens.length > 0) {
                first = _.first(tokens);
            }

            var rest = null;
            if(tokens.length > 1) {
                rest = _.chain(tokens).rest().reduce(function(memo, token) {
                    return memo ? memo + ' ' + token : token;
                }).value();
            }

            var intermediate = _.bind(intermediate_callback, this, rest, callback, context, matching);
            if(first === '*') {
                _this.each(intermediate);
            } else if(_this.get(first)) {
                intermediate(_this.get(first));
            }

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
        },

        die: function(selectors, callback, context) {

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
            var tokens = selectors.split(' ');

            var first = null;
            if(tokens.length > 0) {
                first = _.first(tokens);
            }

            var rest = null;
            if(tokens.length > 1) {
                rest = _.chain(tokens).rest().reduce(function(memo, token) { 
                    return memo ? memo + ' ' + token : token;
                }).value();
            }

            var intermediate = _.bind(intermediate_callback, this, rest, callback, context, matching);
            if(first === '*') {
                _.each(_this.toJSON(), intermediate);
            } else if(_this.has(first)) {
                intermediate(_this.get(first));
            }

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
        },

        die: function(selectors, callback, context) {

        }
    });
}).call(this);