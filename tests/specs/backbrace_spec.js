(function() {
	describe('Tests', function() {
		it('works on all models', function() {
			runs(function() {
				MyCollection = Backbone.Collection.extend(Backbrace.Collection, {});
				MyModel = Backbone.Model.extend(Backbrace.Model, {});

				var callback = jasmine.createSpy();
				var model = new MyModel;
				model.live('a b c d', callback);

				model.set('a', new MyModel);
				model.get('a').set('b', new MyModel);
				model.get('a').get('b').set('c', new MyModel);
				model.get('a').get('b').get('c').set('d', new MyModel);

				expect(callback).toHaveBeenCalled();
			});
		});
	});
}).call(this);
