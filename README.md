#Backbrace

##Why?
Backbone tends to slouch when dealing with all but the shallowest data sets. Let it stand tall and proud, by allowing for jQueryesque *.live()* calls.
##How?
```js
MyCollection = Backbone.Collection.extend(Backbrace) {};
MyModel = Backbone.Model.extend(Backbrace) {};
```
or
```js
_.extend(Backbone.Collection.prototype, Backbrace);
_.extend(Backbone.Model.prototype, Backbrace);
```
then
```js
var model = new MyModel;
model.live('a b c d', function(e) {
  console.log('I only care about d in c in b in a...nothing in between');
});

model.set('a', new MyModel);
model.get('a').set('b' new MyModel);
model.get('a').get('b').set('c', new MyModel);
model.get('a').get('b').get('c').set('d', new MyModel);

//Your callback was just called!
```

This also works when intermediate objects are Collections, though the id of the model is used to match the selector, where the attribute key is used for Models.
