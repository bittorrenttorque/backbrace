[![Build Status](https://secure.travis-ci.org/bittorrenttorque/backbrace.png?branch=master)](https://travis-ci.org/bittorrenttorque/backbrace)

# Backbrace.js

## Why?
Taller [Backbone](https://github.com/documentcloud/backbone) data sets tend to slouch. Let them stand tall and proud, by allowing for jQueryesque *.live()* calls.
## How?
```html
<!-- Make sure the dependencies are loaded before backbrace -->
<script type="text/javascript" src="underscore.js"></script>
<script type="text/javascript" src="backbone.js"></script>
<script type="text/javascript" src="backbrace.js"></script>
```
The first argument is a space deliminated string of attribute keys in models, or model ids in collections. The callback will be called when there is a new instance of the final matching selector.
```js
var model = new Backbone.Model;
model.live('a b c d', function(d) {
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


To borrow an example from the [aforementioned btapp library](http://github.com/pwmckenna/btapp/), imagine a root object, that has a collection of torrents, which each contain a list of files, which have a properties attribute, which itself is chocked full of key value pairs. If we wanted a simple way to create a Backbone.View for each of these files' properties objects, we might do the following:
```js
var btapp = new Btapp;
btapp.live('torrent * file * properties', function(properties) {
  var view = new FilePropertiesView({model: properties});
  $('#files').append(view.render().el);
});
```

## Callback arguments
Every value that matches the filter is passed as an argument, in reverse order. In most cases its just the last value that you'd be interested in, but sometimes its nice to know where you came from.

```js
var families = new Backbone.Collection;
var family = new Backbone.Model({id: 'Marrah/Williams'});
var members = new Backbone.Collection;

members.add(new Backbone.Model({name: 'Daniel'}));
members.add(new Backbone.Model({name: 'Robert'}));
members.add(new Backbone.Model({name: 'Mary'}));
members.add(new Backbone.Model({name: 'Patrick'}));
family.set({members: members});
families.add(family);

families.live('* members * name', function(name, member, members, family) {
  //what to do with all this info?!
});
```
## Die
The *die* function is to *live*, what *off* is to *on*. Call it with the same selector, callback, and context, and your callback won't be called again.
```js
var model = new Backbone.Model;
var cb = function(x, a) {};
model.live('a *', cb, this);

model.set('a', new Backbone.Collection);
model.get('a').add(new Backbone.Model({id: 'b'}));
//callback called
model.die('a b', cb, this);
model.get('a').add(new Backbone.Model({id: 'c'}));
//callback not called
```

## Delimiter
By default, model id/attribute keys are seperated by spaces. Unfortunately those can legally exist in those
variables, so to split up your tokens by a custom delimiter (that you hopefully are sure does not exist in your model ids or attribute keys), use the following functionality.
```js
Backbrace.setDelimiter('@');
```
__Note:__ You must call this before using live/die to avoid unpredictable behavior. You can also technically do this after making all the corresponding die calls, but this is error prone and not advised.  
__Forbidden Values:__ ',' and the character set as your wildcard (by default '*')

## Wildcard
The wildcard (*) suffers from the same problem as the delimiter, in that it can be a valid model id or attribute key.
```js
Backbrace.setWildcard('%');
```

__Note:__ You must call this before using live/die to avoid unpredictable behavior. You can also technically do this after making all the corresponding die calls, but this is error prone and not advised.  
__Forbidden Values:__ ',' and the character set as your delimiter (by default ' ')

## Todo
- Support idAttribute
- Support id changes
- Look into complicated partial tree detatches, then re-adding

## Feedback
I'd love feedback. [@pwmckenna](https://twitter.com/#!/pwmckenna)

##License
Copyright 2012 Patrick Williams, BitTorrent Inc.  
http://torque.bittorrent.com/

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

<br><br>
Special thanks to Andrew de Andrade ([@andrewdeandrade](https://twitter.com/#!/andrewdeandrade)) for the inspiration!
