(function() {
	"use strict";
	describe('Tests', function() {
		afterEach(function(){
			expect(Backbrace.isClean()).toBeTruthy();
		});		
		describe('Live Tests', function() {
			it('makes live available on Backbone.Models', function() {
				var model = new Backbone.Model();
				expect(model.live).toBeDefined();
			});
			it('makes live available on Backbone.Collection', function() {
				var collection = new Backbone.Collection();
				expect(collection.live).toBeDefined();
			});
			it('calls a callback for a static selector containing only models that are added after live call', function() {
				runs(function() {
					var callback = jasmine.createSpy();
					var model = new Backbone.Model();
					var cb = function(d, c, b, a) {
						expect(d.id).toEqual('d');
						expect(c.id).toEqual('c');
						expect(b.id).toEqual('b');
						expect(a.id).toEqual('a');
						callback();
					};
					model.live('a b c d', cb, this);

					model.set('a', new Backbone.Model({id: 'a'}));
					model.get('a').set('b', new Backbone.Model({id: 'b'}));
					model.get('a').get('b').set('c', new Backbone.Model({id: 'c'}));
					model.get('a').get('b').get('c').set('d', new Backbone.Model({id: 'd'}));
					expect(callback).toHaveBeenCalled();
					model.die('a b c d', cb, this);
				});
			});
			it('calls a callback for a static selector containing only models that are added before live call', function() {
				runs(function() {
					var callback = jasmine.createSpy();
					var model = new Backbone.Model();

					model.set('a', new Backbone.Model());
					model.get('a').set('b', new Backbone.Model());
					model.get('a').get('b').set('c', new Backbone.Model());
					model.get('a').get('b').get('c').set('d', new Backbone.Model());

					model.live('a b c d', callback);
					expect(callback).toHaveBeenCalled();
					model.die('a b c d', callback);
				});
			});
			it('calls a callback for a static selector containing models and collections that are added after live call', function() {
				runs(function() {
					var callback = jasmine.createSpy();
					var model = new Backbone.Model();
					model.live('a b c d', callback);

					model.set('a', new Backbone.Collection());
					model.get('a').add(new Backbone.Model({id: 'b'}));
					model.get('a').get('b').set('c', new Backbone.Collection());
					model.get('a').get('b').get('c').add(new Backbone.Model({id: 'd'}));

					expect(callback).toHaveBeenCalled();
					model.die('a b c d', callback);
				});
			});
			it('calls a callback for a static selector containing models and collections that are added before live call', function() {
				runs(function() {
					var callback = jasmine.createSpy();
					var model = new Backbone.Model();

					model.set('a', new Backbone.Collection());
					model.get('a').add(new Backbone.Model({id: 'b'}));
					model.get('a').get('b').set('c', new Backbone.Collection());
					model.get('a').get('b').get('c').add(new Backbone.Model({id: 'd'}));

					model.live('a b c d', callback);
					expect(callback).toHaveBeenCalled();
					model.die('a b c d', callback);
				});
			});
			it('calls a callback for a wildcard selector containing models and collections that are added after live call', function() {
				runs(function() {
					var callback = jasmine.createSpy();
					var model = new Backbone.Model();
					model.live('a * * name', callback);

					model.set('a', new Backbone.Collection());
					model.get('a').add(new Backbone.Model({id: 'b'}));
					model.get('a').add(new Backbone.Model({id: 'c'}));
					model.get('a').get('b').set('d', new Backbone.Model());
					model.get('a').get('c').set('e', new Backbone.Model());

					model.get('a').get('b').get('d').set('name', new Backbone.Model());
					model.get('a').get('c').get('e').set('name', new Backbone.Model());

					expect(callback).toHaveBeenCalled();

					model.die('a * * name', callback);
				});
			});
			it('calls a callback for a wildcard selector containing models and collections that are added before live call', function() {
				runs(function() {
					var callback = jasmine.createSpy();
					var model = new Backbone.Model();

					model.set('a', new Backbone.Collection());
					model.get('a').add(new Backbone.Model({id: 'b'}));
					model.get('a').get('b').set('c', new Backbone.Collection());
					model.get('a').get('b').get('c').add(new Backbone.Model({id: 'd'}));

					model.live('a b c d', callback);
					expect(callback).toHaveBeenCalled();
					model.die('a b c d', callback);
				});
			});		
			it('does not call a callback when not all models are added before live call', function() {
				runs(function() {
					var callback = jasmine.createSpy();
					var model = new Backbone.Model();

					model.set('a', new Backbone.Model());
					model.get('a').set('b', new Backbone.Model());
					model.get('a').get('b').set('c', new Backbone.Model());

					model.live('a b c d', callback);
					expect(callback).not.toHaveBeenCalled();
					model.die('a b c d', callback);
				});
			});
			it('handles the * example', function() {
				var callback = jasmine.createSpy();
				var model = new Backbone.Model();
				model.live('a * c *', callback);

				model.set('a', new Backbone.Collection());
				model.get('a').add(new Backbone.Model({id: 'b'}));
				model.get('a').get('b').set('c', new Backbone.Collection());
				model.get('a').get('b').get('c').add(new Backbone.Model({id: 'd'}));
				model.get('a').get('b').get('c').add(new Backbone.Model({id: 'e'}));
				model.get('a').get('b').get('c').add(new Backbone.Model({id: 'f'}));
				expect(callback.callCount).toEqual(3);
				model.die('a * c *', callback);
			});
			it('handles the * name example', function() {
				var callback = jasmine.createSpy();
				var collection = new Backbone.Collection();
				collection.live('* name', callback);

				var daniel = new Backbone.Model({name: 'Daniel'});
				collection.add(daniel);
				expect(callback).toHaveBeenCalledWith('Daniel', daniel);	

				var robert = new Backbone.Model({name: 'Robert'});
				collection.add(robert);
				expect(callback).toHaveBeenCalledWith('Robert', robert);

				var mary = new Backbone.Model({name: 'Mary'});
				collection.add(mary);
				expect(callback).toHaveBeenCalledWith('Mary', mary);

				expect(callback.callCount).toEqual(3);
				//The following works too!
				var person = new Backbone.Model();
				collection.add(person);
				person.set('name', 'Patrick');
				expect(callback.callCount).toEqual(4);
				collection.die('* name', callback);
			});
			it('does not call a callback when not all models are added after live call', function() {
				runs(function() {
					var callback = jasmine.createSpy();
					var model = new Backbone.Model();
					model.live('a b c d', callback);

					model.set('a', new Backbone.Model());
					model.get('a').set('b', new Backbone.Model());
					model.get('a').get('b').set('c', new Backbone.Model());

					expect(callback).not.toHaveBeenCalled();
					model.die('a b c d', callback);
				});
			});
			it('calls a callback for purely model selector with the correct context', function() {
				runs(function() {
					var context = 'hi i am a context';
					var spy = jasmine.createSpy();
					var callback = function() {
						expect(this === context);
						spy();
					};
					var model = new Backbone.Model();

					model.set('a', new Backbone.Model());
					model.get('a').set('b', new Backbone.Model());
					model.get('a').get('b').set('c', new Backbone.Model());
					model.get('a').get('b').get('c').set('d', new Backbone.Model());

					model.live('a b c d', callback, context);
					expect(spy).toHaveBeenCalled();

					model.die('a b c d', callback, context);
				});
			});
			it('calls a callback for mixed model/collection selector with the correct context', function() {
				runs(function() {
					var context = 'hi i am a context';
					var spy = jasmine.createSpy();
					var callback = function() {
						expect(this === context);
						spy();
					};
					var model = new Backbone.Model();
					model.live('a b c d', callback, context);

					model.set('a', new Backbone.Collection());
					model.get('a').add(new Backbone.Model({id: 'b'}));
					model.get('a').get('b').set('c', new Backbone.Collection());
					model.get('a').get('b').get('c').add(new Backbone.Model({id: 'd'}));

					expect(spy).toHaveBeenCalled();

					model.die('a b c d', callback, context);
				});
			});
			it('calls a callback for mixed model/collection selector with the correct tree of objects', function() {
				runs(function() {
					var context = 'hi i am a context';
					var spy = jasmine.createSpy();
					var model = new Backbone.Model();
					model.live('a b c d', spy, context);

					var a = new Backbone.Collection();
					var b = new Backbone.Model({id: 'b'});
					var c = new Backbone.Collection();
					var d = new Backbone.Model({id: 'd'});
					model.set('a', a);
					model.get('a').add(b);
					model.get('a').get('b').set('c', c);
					model.get('a').get('b').get('c').add(d);

					expect(spy).toHaveBeenCalledWith(d, c, b, a);

					model.die('a b c d', spy, context);
				});
			});
			it('calls the callback for the tree (collection - > model) and * the correct number of times', function() {
				runs(function() {
					var btapp = new Backbone.Collection();
					var spy = jasmine.createSpy();
					btapp.live('*', spy);

					for(var i = 0; i < 5; i++) {
						var torrent = new Backbone.Model();
						btapp.add(torrent);
					}

					expect(spy.callCount).toEqual(5);

					btapp.die('*', spy);
				});
			});
			it('calls the callback for the tree (model -> collection -> model) and * the correct number of times', function() {
				runs(function() {
					var btapp = new Backbone.Model();
					var spy = jasmine.createSpy();
					btapp.live('torrent *', spy);

					var torrent_list = new Backbone.Collection();
					for(var i = 0; i < 5; i++) {
						var torrent = new Backbone.Model();
						torrent_list.add(torrent);
					}
					btapp.set({torrent: torrent_list});

					expect(spy.callCount).toEqual(5);

					btapp.die('torrent *', spy);
				});
			});
			it('calls the callback for the tree (model -> collection -> model -> model) and * the correct number of times', function() {
				runs(function() {
					var btapp = new Backbone.Model();
					var spy = jasmine.createSpy();
					btapp.live('torrent * properties', spy);

					var torrent_list = new Backbone.Collection();
					for(var i = 0; i < 5; i++) {
						var torrent = new Backbone.Model();
						var properties = new Backbone.Model();
						torrent.set({properties: properties});
						torrent_list.add(torrent);
					}
					btapp.set({torrent: torrent_list});

					expect(spy.callCount).toEqual(5);

					btapp.die('torrent * properties', spy);
				});
			});
			it('calls the callback for the tree (model -> collection -> model -> collection -> model -> model) and * the correct number of times', function() {
				runs(function() {
					var btapp = new Backbone.Model();
					var spy = jasmine.createSpy();
					btapp.live('torrent * file * properties', spy);

					var torrent_list = new Backbone.Collection();
					for(var i = 0; i < 5; i++) {
						var torrent = new Backbone.Model();
						var file_list = new Backbone.Collection();
						for(var j = 0; j < 5; j++) {
							var file = new Backbone.Model();
							var properties = new Backbone.Model();

							file.set({properties: properties});
							file_list.add(file);
						}

						torrent.set({file: file_list});
						torrent_list.add(torrent);
					}
					btapp.set({torrent: torrent_list});

					expect(spy.callCount).toEqual(25);

					btapp.die('torrent * file * properties', spy);
				});
			});
			it('on a model in several matching parents, calls the callback once per parent', function() {
				runs(function() {
					var context = 'hi i am a context';
					var spy = jasmine.createSpy();
					var callback1 = function() {
						expect(this === context);
						spy();
					};
					var callback2= function() {
						expect(this === context);
						spy();
					};
					var model = new Backbone.Model();
					var a = new Backbone.Model();
					var b = new Backbone.Model();
					var c = new Backbone.Model();
					model.live('* c', callback1, context);

					a.set({c: c});
					b.set({c: c});
					model.set({
						a: a,
						b: b
					});

					model.live('* c', callback2, context);

					expect(spy.callCount).toEqual(4);
					model.die('* c', callback1, context);
					model.die('* c', callback2, context);
				});
			});
		});
		describe('Die Tests', function() {
			it('makes die available on Backbone.Models', function() {
				var model = new Backbone.Model();
				expect(model.die).toBeDefined();
			});
			it('makes die available on Backbone.Collection', function() {
				var collection = new Backbone.Collection();
				expect(collection.die).toBeDefined();
			});
			it('live, callback, die, no callback', function() {
				runs(function() {
					var context = 'hi i am a context';
					var spy = jasmine.createSpy();
					var model = new Backbone.Model();
					var selectors = 'a b c d';
					model.live(selectors, spy, context);

					var a = new Backbone.Collection();
					var b = new Backbone.Model({id: 'b'});
					var c = new Backbone.Collection();
					var d = new Backbone.Model({id: 'd'});
					model.set('a', a);
					model.get('a').add(b);
					model.get('a').get('b').set('c', c);
					model.get('a').get('b').get('c').add(d);
					model.get('a').get('b').get('c').remove(d);
					model.get('a').get('b').get('c').add(d);
					model.get('a').get('b').get('c').remove(d);
					expect(spy).toHaveBeenCalledWith(d, c, b, a);
					expect(spy.callCount).toEqual(2);

					model.die(selectors, spy, context);
					model.get('a').get('b').get('c').add(d);
					model.get('a').get('b').get('c').remove(d);
					expect(spy.callCount).toEqual(2);
				});
			});			
			it('live, die, no callback', function() {
				runs(function() {
					var context = 'hi i am a context';
					var spy = jasmine.createSpy();
					var model = new Backbone.Model();
					var selectors = 'a b c d';
					model.live(selectors, spy, context);
					model.die(selectors, spy, context);

					var a = new Backbone.Collection();
					var b = new Backbone.Model({id: 'b'});
					var c = new Backbone.Collection();
					var d = new Backbone.Model({id: 'd'});
					model.set('a', a);
					model.get('a').add(b);
					model.get('a').get('b').set('c', c);
					model.get('a').get('b').get('c').add(d);

					expect(spy).not.toHaveBeenCalled();
				});		
			});
			it('live on base, live on child, callback on both, die on child, callback on base, die on base, no callback', function() {
				runs(function() {
					var context = 'hi i am a context';
					var basespy = jasmine.createSpy();
					var childspy = jasmine.createSpy();
					var model = new Backbone.Model();
					model.set('a', new Backbone.Model());
					model.get('a').set('b', new Backbone.Model());
					model.get('a').get('b').set('c', new Backbone.Model());
					model.get('a').get('b').get('c').set('d', new Backbone.Model());

					model.live('a b c d', basespy, context);
					model.get('a').live('b c d', childspy, context);
					expect(basespy).toHaveBeenCalled();		
					expect(childspy).toHaveBeenCalled();

					model.get('a').die('b c d', childspy, context);

					model.get('a').get('b').get('c').unset('d');
					model.get('a').get('b').get('c').set('d', new Backbone.Model());

					expect(basespy.callCount).toEqual(2);
					expect(childspy.callCount).toEqual(1);

					model.die('a b c d', basespy, context);
					model.get('a').get('b').get('c').unset('d');
					model.get('a').get('b').get('c').set('d', new Backbone.Model());

					expect(basespy.callCount).toEqual(2);
					expect(childspy.callCount).toEqual(1);
				});		
			});
		});
		describe('Wildcard Tests', function() {
			it('throws an exception when attempting to use delimiter as a wildcard', function() {
				expect(function() {
					Backbrace.setWildcard(' ');
				}).toThrow('setting the wildcard to the same value as the delimiter can cause unexpected behavior');
			});
			it('using @, handles the wildcard name example', function() {
				Backbrace.setWildcard('@');
				var callback = jasmine.createSpy();
				var collection = new Backbone.Collection();
				collection.live('@ name', callback);

				var daniel = new Backbone.Model({name: 'Daniel'});
				collection.add(daniel);
				expect(callback).toHaveBeenCalledWith('Daniel', daniel);	

				var robert = new Backbone.Model({name: 'Robert'});
				collection.add(robert);
				expect(callback).toHaveBeenCalledWith('Robert', robert);

				var mary = new Backbone.Model({name: 'Mary'});
				collection.add(mary);
				expect(callback).toHaveBeenCalledWith('Mary', mary);

				expect(callback.callCount).toEqual(3);
				//The following works too!
				var person = new Backbone.Model();
				collection.add(person);
				person.set('name', 'Patrick');
				expect(callback.callCount).toEqual(4);
				collection.die('@ name', callback);
				Backbrace.setWildcard('*');
			});			
		});
		describe('Delimiter Tests', function() {
			it('throws an exception when attempting to use , as a delimiter', function() {
				expect(function() {
					Backbrace.setDelimiter(',');
				}).toThrow('cannot use , as a delimiter as it will prevent event callbacks from being set properly');
			});
			it('throws an exception when attempting to use wildcard as a delimiter', function() {
				expect(function() {
					Backbrace.setDelimiter('*');
				}).toThrow('setting the delimiter to the same value as the wildcard can cause unexpected behavior');
			});
			it('throws an exception when setting the delimiter after live has been used', function() {
				var model = new Backbone.Model();
				var callback = jasmine.createSpy();
				Backbrace.setDelimiter('@');

				model.live('a@b@c@d', callback, this);
				expect(function() {
					Backbrace.setDelimiter('@');
				}).toThrow('setting the delimiter after calling live can cause unexpected behavior');
				model.die('a@b@c@d', callback, this);
				Backbrace.setDelimiter(' ');
			});
			it('uses $ delimiter to live on base, live on child, callback on both, die on child, callback on base, die on base, no callback', function() {
				runs(function() {
					Backbrace.setDelimiter('$');
					var context = 'hi i am a context';
					var basespy = jasmine.createSpy();
					var childspy = jasmine.createSpy();
					var model = new Backbone.Model();
					model.set('a', new Backbone.Model());
					model.get('a').set('b', new Backbone.Model());
					model.get('a').get('b').set('c', new Backbone.Model());
					model.get('a').get('b').get('c').set('d', new Backbone.Model());

					model.live('a$b$c$d', basespy, context);
					model.get('a').live('b$c$d', childspy, context);
					expect(basespy).toHaveBeenCalled();		
					expect(childspy).toHaveBeenCalled();

					model.get('a').die('b$c$d', childspy, context);

					model.get('a').get('b').get('c').unset('d');
					model.get('a').get('b').get('c').set('d', new Backbone.Model());

					expect(basespy.callCount).toEqual(2);
					expect(childspy.callCount).toEqual(1);

					model.die('a$b$c$d', basespy, context);
					model.get('a').get('b').get('c').unset('d');
					model.get('a').get('b').get('c').set('d', new Backbone.Model());

					expect(basespy.callCount).toEqual(2);
					expect(childspy.callCount).toEqual(1);

					//just to test that the cleanup was successful
					Backbrace.setDelimiter(' ');
				});		
			});			
		});
		describe('Callback Cleanup Tests', function() {
			it('expects all these tests to have completely cleaned up their event handlers', function() {
				expect(Backbrace.isClean()).toBeTruthy();
			});
		});
	});
}).call(this);
