#Backbrace

##Why?
Backbone tends to slouch when dealing with all but the shallowest data sets. Let it stand tall and proud, by allowing for jQueryesque *.live()* calls.
##How?
```js
_.extend(Backbone.Collection, Backbrace.Collection);  
_.extend(Backbone.Model, Backbrace.Model);  
```
or  
```js
MyCollection = Backbone.Collection.extend(Backbrace.Collection) {};
MyModel = Backbone.Model.extend(Backbrace.Model) {};
```

