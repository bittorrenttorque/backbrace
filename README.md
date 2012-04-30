#Backbrace

##Why?
Taller Backbone data sets tend to slouch. Let them stand tall and proud, by allowing for jQueryesque *.live()* calls.
##How?
```html
<script type="text/javascript" src="backbrace.js"></script>
```
```js
var model = new Backbone.Model;
model.live('a b c d e f g h', function(e) {
  console.log('I only care about h in g in f in e in d in c in b in a...nothing in between');
});

model.set('a', new Backbone.Model);
model.get('a').set('b' new Backbone.Model);
model.get('a').get('b').set('c', new Backbone.Model);
model.get('a').get('b').get('c').set('d', new Backbone.Model);
model.get('a').get('b').get('c').get('d').set('e', new Backbone.Model);
model.get('a').get('b').get('c').get('d').get('e').set('f', new Backbone.Model);
model.get('a').get('b').get('c').get('d').get('e').get('f').set('g', new Backbone.Model);
model.get('a').get('b').get('c').get('d').get('e').get('f').get('g').set('h', new Backbone.Model);

//Your callback was just called!
```

This also works when intermediate objects are Collections, though the id of the model is used to match the selector, where the attribute key is used for Models.
##Todo
- Support * as part of the selector

<br><br>
Special thanks to Andrew de Andrade for the inspiration!
