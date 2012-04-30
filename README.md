# Backbrace.js

## Why?
Taller [Backbone](https://github.com/documentcloud/backbone) data sets tend to slouch. Let them stand tall and proud, by allowing for jQueryesque *.live()* calls.
## How?
```html
<script type="text/javascript" src="backbrace.js"></script>
```
```js
var model = new Backbone.Model;
var callback = function(val) {
  console.log('I only care about d in c in b in a...nothing in between');
};
model.live('a b c d', callback);

model.set('a', new Backbone.Model);
model.get('a').set('b' new Backbone.Model);
model.get('a').get('b').set('c', new Backbone.Model);
model.get('a').get('b').get('c').set('d', new Backbone.Model);

//Your callback was just called!
```

This also works when intermediate objects are Collections, though the *id* of the model is used to match the selector, where the attribute key is used for Models.  
__For example:__
```js
var model = new Backbone.Model;
model.live('a b c d', function(e) {
  console.log('I only care about d in c in b in a...and I like using collections');
});

model.set('a', new Backbone.Collection);
model.get('a').add(new Backbone.Model({id: 'b'}));
model.get('a').get('b').set('c', new Backbone.Collection);
model.get('a').get('b').get('c').add(new Backbone.Model({id: 'd'}));

//Your callback was just called!
```
## Regex?
Almost. * is supported.  
__For example:__
```js
var model = new Backbone.Model;
model.live('a * c *', function(e) {
  console.log('I care about anything called c, if its in any child attribute/model of a...and I still want to use collections');
});

model.set('a', new Backbone.Collection);
model.get('a').add(new Backbone.Model({id: 'b'}));
model.get('a').get('b').set('c', new Backbone.Collection);
model.get('a').get('b').get('c').add(new Backbone.Model({id: 'd'}));
model.get('a').get('b').get('c').add(new Backbone.Model({id: 'e'}));
model.get('a').get('b').get('c').add(new Backbone.Model({id: 'f'}));

//Your callback was just called...three times!
```
__or for a much less contrived example:__
```js
var collection = new Backbone.Collection;
collection.live('* name', function(name) {
  console.log('Someone has the name: ' + name);
});

collection.add(new Backbone.Model({name: 'Patrick'});
collection.add(new Backbone.Model({name: 'Daniel'});
collection.add(new Backbone.Model({name: 'Mary'});
collection.add(new Backbone.Model({name: 'Robert'});
```
## Todo
- Support idAttribute
- Support id changes

<br><br>
Special thanks to Andrew de Andrade for the inspiration!
