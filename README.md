# Backbrace.js

## Why?
Taller [Backbone](https://github.com/documentcloud/backbone) data sets tend to slouch. Let them stand tall and proud, by allowing for jQueryesque *.live()* calls.
## How?
```html
<script type="text/javascript" src="backbrace.js"></script>
```
```js
var model = new Backbone.Model;
model.live('a b c d e f g h', function(e) {
  console.log('I only care about d in c in b in a...nothing in between');
});

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
  console.log('I only care about d in c in b in a...and I like using collections');
});

model.set('a', new Backbone.Collection);
model.get('a').add(new Backbone.Model({id: 'b'}));
model.get('a').get('b').set('c', new Backbone.Collection);
model.get('a').get('b').get('c').add(new Backbone.Model({id: 'd'}));
model.get('a').get('b').get('c').add(new Backbone.Model({id: 'e'}));
model.get('a').get('b').get('c').add(new Backbone.Model({id: 'f'}));

//Your callback was just called...three times!
```
## Todo
- Support idAttribute
- Support id changes

<br><br>
Special thanks to Andrew de Andrade for the inspiration!
