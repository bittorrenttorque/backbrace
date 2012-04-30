(function() {
    var Live = {
        live: function(selector, callback, context) {
            console.log('live(' + selector + ')');
            var selectors = jQuery.trim(selector).split(' ');
            if(selectors.length == 0) return;

            console.log('selectors length: ' + selectors.length);

            // Detect existing matches, as well as matches that will be added.
            // The callbacks should differ depending on if this is the last selector. 
            if(selectors.length > 1) {
                var finisher = callback;
                callback = function(elem) {
                    var tmp = _(selectors).tail().reduce(function(memo, num) { return memo + num + ' '; });
                    console.log('tmp: ' + tmp);
                    elem.live(tmp, finisher, context);
                };
            }

            var next = selectors[0];
            console.log('next: ' + next);
            if(this.get(next)) {
                console.log('found next');
                callback.call(context, this.get(next));
            }

            // Even if it already exists, it may disappear, or match multiple not yet added objects.
            this.on('add:' + next, callback, context);
        }
    };

    Backbrace = {
        Model: _.extend({}, Live),
        Collection: _.extend({}, Live)
    };
}).call(this);