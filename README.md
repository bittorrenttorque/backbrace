# Backbrace.js

## Why?
Taller [Backbone](https://github.com/documentcloud/backbone) data sets tend to slouch. Let them stand tall and proud, by allowing for jQueryesque *.live()* calls.
## How?
```html
<!-- http://github.com/pwmckenna/backbrace/ -->
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

collection.add(new Backbone.Model({name: 'Daniel'}));
collection.add(new Backbone.Model({name: 'Robert'}));
collection.add(new Backbone.Model({name: 'Mary'}));

//The following works too!
var person = new Backbone.Model;
collection.add(person);
person.set('name', 'Patrick');
```
## When?
This is probably not useful if your collections just mirror flat database tables. However, if you are using something like [BitTorrent's btapp library](http://github.com/pwmckenna/btapp/), it tends to be a struggle to cleanly interact with a tree of Backbone models and collections that grows to be quite deep. In most cases, you're only interested in the leaves of the tree, and this is an attempt to simplify that experience.  


To borrow an example, imagine a root object, that has a collection of torrents, which each contain a list of files, which have a properties attribute, which itself is chocked full of key value pairs. If we wanted a simple way to create a Backbone.View for each of these files, we might do the following:
```js
var btapp = new Btapp;
btapp.live('torrent * file * properties', function(properties) {
  var view = new FilePropertiesView({model: properties});
  $('#files').append(view.render().el);
});
```
## Testing
Tests are written using [jasmine](https://github.com/pivotal/jasmine).  
To run the test suite yourself, open tests/SpecRunner.html in a browser.  

## Todo
- Support idAttribute
- Support id changes

## Feedback
I'd love feedback. [@pwmckenna](https://twitter.com/#!/pwmckenna)

<br><br>
Special thanks to Andrew de Andrade ([@andrewdeandrade](https://twitter.com/#!/andrewdeandrade)) for the inspiration!
