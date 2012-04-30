#Backbrace

##Why?
Backbone tends to slouch when dealing with all but the shallowest data sets. Let it stand tall and proud, by allowing for jQueryesque *.live()* calls.
##How?
```js
var model = new Backbone.Model;
model.live('a b c d', function(e) {
  console.log('I only care about d in c in b in a...nothing in between');
});

model.set('a', new Backbone.Model);
model.get('a').set('b' new Backbone.Model);
model.get('a').get('b').set('c', new Backbone.Model);
model.get('a').get('b').get('c').set('d', new Backbone.Model);

//Your callback was just called!
```

This also works when intermediate objects are Collections, though the id of the model is used to match the selector, where the attribute key is used for Models.
