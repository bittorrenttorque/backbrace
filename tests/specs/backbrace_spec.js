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
	});
}).call(this);
