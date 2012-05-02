describe('Todos.CreateTodoView', function() {
  afterEach(function() {
    Todos.mainPane.remove();
  });

  describe('#insertNewline', function() {
    var createTodoSpy, value, todo;
    beforeEach(function() {
      value = 'Do Something';
      view = Todos.CreateTodoView.create({value: value});
      createTodoSpy = spyOn(Todos.todoListController, 'createTodo');
      view.insertNewline();
      todo = Todos.todoListController.get('content').get(0);
    });

    afterEach(function () {
      // clean up after each spec run
      Todos.todoListController.removeObject(todo);
    });

    it('delegates to create a new todo with it\'s current value', function() {
      expect(createTodoSpy).toHaveBeenCalledWith(value);
    });
  });
});
