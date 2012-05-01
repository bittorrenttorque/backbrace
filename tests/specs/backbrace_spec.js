(function() {
	describe('Tests', function() {
		it('makes live available on Backbone.Models', function() {
			var model = new Backbone.Model;
			expect(model.live).toBeDefined();
		});
		it('makes live available on Backbone.Collection', function() {
			var collection = new Backbone.Collection;
			expect(collection.live).toBeDefined();
		});
		it('calls a callback for a static selector containing only models that are added after live call', function() {
			runs(function() {
				var callback = jasmine.createSpy();
				var model = new Backbone.Model;
				model.live('a b c d', callback);

				model.set('a', new Backbone.Model);
				model.get('a').set('b', new Backbone.Model);
				model.get('a').get('b').set('c', new Backbone.Model);
				model.get('a').get('b').get('c').set('d', new Backbone.Model);

				expect(callback).toHaveBeenCalled();
			});
		});
		it('calls a callback for a static selector containing only models that are added before live call', function() {
			runs(function() {
				var callback = jasmine.createSpy();
				var model = new Backbone.Model;

				model.set('a', new Backbone.Model);
				model.get('a').set('b', new Backbone.Model);
				model.get('a').get('b').set('c', new Backbone.Model);
				model.get('a').get('b').get('c').set('d', new Backbone.Model);

				model.live('a b c d', callback);
				expect(callback).toHaveBeenCalled();
			});
		});
		it('calls a callback for a static selector containing models and collections that are added after live call', function() {
			runs(function() {
				var callback = jasmine.createSpy();
				var model = new Backbone.Model;
				model.live('a b c d', callback);

				model.set('a', new Backbone.Collection);
				model.get('a').add(new Backbone.Model({id: 'b'}));
				model.get('a').get('b').set('c', new Backbone.Collection);
				model.get('a').get('b').get('c').add(new Backbone.Model({id: 'd'}));

				expect(callback).toHaveBeenCalled();
			});
		});
		it('calls a callback for a static selector containing models and collections that are added before live call', function() {
			runs(function() {
				var callback = jasmine.createSpy();
				var model = new Backbone.Model;

				model.set('a', new Backbone.Collection);
				model.get('a').add(new Backbone.Model({id: 'b'}));
				model.get('a').get('b').set('c', new Backbone.Collection);
				model.get('a').get('b').get('c').add(new Backbone.Model({id: 'd'}));

				model.live('a b c d', callback);
				expect(callback).toHaveBeenCalled();
			});
		});
		it('calls a callback for a wildcard selector containing models and collections that are added after live call', function() {
			runs(function() {
				var callback = jasmine.createSpy();
				var model = new Backbone.Model;
				model.live('a * * name', callback);

				model.set('a', new Backbone.Collection);
				model.get('a').add(new Backbone.Model({id: 'b'}));
				model.get('a').add(new Backbone.Model({id: 'c'}));
				model.get('a').get('b').set('d', new Backbone.Model);
				model.get('a').get('c').set('e', new Backbone.Model);

				model.get('a').get('b').get('d').set('name', new Backbone.Model);
				model.get('a').get('c').get('e').set('name', new Backbone.Model);

				expect(callback).toHaveBeenCalled();
			});
		});
		it('calls a callback for a wildcard selector containing models and collections that are added before live call', function() {
			runs(function() {
				var callback = jasmine.createSpy();
				var model = new Backbone.Model;

				model.set('a', new Backbone.Collection);
				model.get('a').add(new Backbone.Model({id: 'b'}));
				model.get('a').get('b').set('c', new Backbone.Collection);
				model.get('a').get('b').get('c').add(new Backbone.Model({id: 'd'}));

				model.live('a b c d', callback);
				expect(callback).toHaveBeenCalled();
			});
		});		
		it('does not call a callback when not all models are added before live call', function() {
			runs(function() {
				var callback = jasmine.createSpy();
				var model = new Backbone.Model;

				model.set('a', new Backbone.Model);
				model.get('a').set('b', new Backbone.Model);
				model.get('a').get('b').set('c', new Backbone.Model);

				model.live('a b c d', callback);
				expect(callback).not.toHaveBeenCalled();
			});
		});
		it('handles the * example', function() {
			var callback = jasmine.createSpy();
			var model = new Backbone.Model;
			model.live('a * c *', callback);

			model.set('a', new Backbone.Collection);
			model.get('a').add(new Backbone.Model({id: 'b'}));
			model.get('a').get('b').set('c', new Backbone.Collection);
			model.get('a').get('b').get('c').add(new Backbone.Model({id: 'd'}));
			model.get('a').get('b').get('c').add(new Backbone.Model({id: 'e'}));
			model.get('a').get('b').get('c').add(new Backbone.Model({id: 'f'}));
			expect(callback.callCount).toEqual(3);
		});
		it('handles the * name example', function() {
			var callback = jasmine.createSpy();
			var collection = new Backbone.Collection;
			collection.live('* name', callback);

			collection.add(new Backbone.Model({name: 'Daniel'}));
			expect(callback).toHaveBeenCalledWith('Daniel');	

			collection.add(new Backbone.Model({name: 'Robert'}));
			expect(callback).toHaveBeenCalledWith('Robert');	
			collection.add(new Backbone.Model({name: 'Mary'}));
			expect(callback).toHaveBeenCalledWith('Mary');	
			expect(callback.callCount).toEqual(3);
			//The following works too!
			var person = new Backbone.Model;
			collection.add(person);
			person.set('name', 'Patrick');
			expect(callback.callCount).toEqual(4);
		});
		it('does not call a callback when not all models are added after live call', function() {
			runs(function() {
				var callback = jasmine.createSpy();
				var model = new Backbone.Model;
				model.live('a b c d', callback);

				model.set('a', new Backbone.Model);
				model.get('a').set('b', new Backbone.Model);
				model.get('a').get('b').set('c', new Backbone.Model);

				expect(callback).not.toHaveBeenCalled();
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
				var model = new Backbone.Model;

				model.set('a', new Backbone.Model);
				model.get('a').set('b', new Backbone.Model);
				model.get('a').get('b').set('c', new Backbone.Model);
				model.get('a').get('b').get('c').set('d', new Backbone.Model);

				model.live('a b c d', callback, context);
				expect(spy).toHaveBeenCalled();
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
				var model = new Backbone.Model;
				model.live('a b c d', callback, context);

				model.set('a', new Backbone.Collection);
				model.get('a').add(new Backbone.Model({id: 'b'}));
				model.get('a').get('b').set('c', new Backbone.Collection);
				model.get('a').get('b').get('c').add(new Backbone.Model({id: 'd'}));

				expect(spy).toHaveBeenCalled();
			});
		});		
	});
}).call(this);
