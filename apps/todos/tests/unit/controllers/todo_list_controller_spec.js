describe('Todos.todoListController', function() {
  beforeEach(function() {
      // clear any previous todos created that weren't cleared out
      var length = Todos.todoListController.get('content').length;
      var i = 0;
      for (i = length-1 ; i > -1; i--) {
        var removeTodo = Todos.todoListController.get('content').get(i);
        Todos.todoListController.removeObject(removeTodo);
      }
  });

  describe('#createTodo', function() {
    var createTodoSpy, title, todo, todoHash;

    beforeEach(function() {
      title = 'title';
      todoHash = {title: title};
      createTodoSpy = spyOn(Todos.Todo, 'create').andCallThrough();
      Todos.todoListController.createTodo(title);
      todo = Todos.todoListController.get('content').get(0);
    });

    afterEach(function () {
      // clean up after each spec run
      Todos.todoListController.removeObject(todo);
    });

    it('creates a todo with the passed in title', function() {
      expect(createTodoSpy).toHaveBeenCalledWith({title: title});
    });

    it('adds that todo to it\'s content', function() {
      expect(Todos.todoListController.get('content')).toContain(todo);
    });
  });

  describe("remaining", function() {
    var createTodoSpy, title, firstTodo, secondTodo, todoHash;
    beforeEach(function() {
      title = 'title';
      todoHash = {title: title};
      Todos.todoListController.createTodo(title);
      Todos.todoListController.createTodo(title);
      firstTodo = Todos.todoListController.get('content').get(0);
      secondTodo = Todos.todoListController.get('content').get(1);
    });

    afterEach(function () {
      // clean up after each spec run
      Todos.todoListController.removeObject(firstTodo);
      Todos.todoListController.removeObject(secondTodo);
    });

    it("should calculate number of remaining items", function() {
      expect(Todos.todoListController.remaining()).toEqual(2);
    });

  });

  describe("clearCompletedTodos", function() {
    var createTodoSpy, title, firstTodo, secondTodo, todoHash;
    beforeEach(function() {
      title = 'title clearCompletedTodos 1';
      todoHash = {title: title};
      createTodoSpy = spyOn(Todos.Todo, 'create').andCallThrough();
      Todos.todoListController.createTodo(title);
      title = 'title clearCompletedTodos 2';
      Todos.todoListController.createTodo(title);
      firstTodo = Todos.todoListController.get('content').get(0);
      secondTodo = Todos.todoListController.get('content').get(1);
    });

    afterEach(function () {
      // clean up after each spec run
      Todos.todoListController.removeObject(firstTodo);
      Todos.todoListController.removeObject(secondTodo);
    });

    it("removes completed todos", function() {
      firstTodo.set('isDone', true);
      Todos.todoListController.clearCompletedTodos();

      expect(Todos.todoListController.get('content')).toContain(secondTodo);
      expect(Todos.todoListController.get('content').length).toEqual(1);
      expect(Todos.todoListController.get('content')).not.toContain(firstTodo);
    });
  });

  describe("allAreDone", function() {
    var createTodoSpy, title, firstTodo, secondTodo, todoHash;
    beforeEach(function() {
      title = 'title allAreDone 1';
      todoHash = {title: title};
      createTodoSpy = spyOn(Todos.Todo, 'create').andCallThrough();
      Todos.todoListController.createTodo(title);
      title = 'title allAreDone 2';
      Todos.todoListController.createTodo(title);
      firstTodo = Todos.todoListController.get('content').get(0);
      secondTodo = Todos.todoListController.get('content').get(1);
    });

    afterEach(function () {
      // clean up after each spec run
      Todos.todoListController.removeObject(firstTodo);
      Todos.todoListController.removeObject(secondTodo);
      Todos.todoListController.clearCompletedTodos();
    });

    it("can mark all as done", function() {
      Todos.todoListController.allAreDone(Todos.todoListController.allAreDone(), true);
      expect(firstTodo.isDone).toEqual(true);
      expect(secondTodo.isDone).toEqual(true);
    });

    it("marks all as done with some already done", function() {
      firstTodo.set('isDone', true);
      expect(firstTodo.isDone).toEqual(true);
      Todos.todoListController.allAreDone(Todos.todoListController.allAreDone(), true);
      expect(firstTodo.isDone).toEqual(true);
      expect(secondTodo.isDone).toEqual(true);
    });

    it("marks all as done already all done", function() {
      firstTodo.set('isDone', true);
      secondTodo.set('isDone', true);
      expect(firstTodo.isDone).toEqual(true);
      expect(secondTodo.isDone).toEqual(true);
      Todos.todoListController.allAreDone(Todos.todoListController.allAreDone(), true);
      expect(firstTodo.isDone).toEqual(true);
      expect(secondTodo.isDone).toEqual(true);
    });
  });

  describe("sortTodos", function() {
    var createTodoSpy, title, firstTodo, secondTodo, tag;
    beforeEach(function() {
      var length = Todos.todoListController.get('unsorted').length;
      var i = 0;
      for (i = length-1 ; i > -1; i--) {
        var removeTodo = Todos.todoListController.get('unsorted').get(i);
        Todos.todoListController.unsorted.removeObject(removeTodo);
      }

      title = 'title sortTodos 1';
      tag = "b";
      createTodoSpy = spyOn(Todos.Todo, 'create').andCallThrough();
      Todos.todoListController.addTag(title, tag);
      title = 'title sortTodos 2';
      tag = "a";
      Todos.todoListController.addTag(title, tag);
      firstTodo = Todos.todoListController.get('content').get(0);
      secondTodo = Todos.todoListController.get('content').get(1);
    });

    afterEach(function () {
      // clean up after each spec run
      Todos.todoListController.removeObject(firstTodo);
      Todos.todoListController.removeObject(secondTodo);
    });

    it("sorts the list by tag", function() {
      Todos.todoListController.sortTodos();
      var content = Todos.todoListController.get('content');
      console.log("first: " + firstTodo);
      console.log("second: " + secondTodo);
      console.log("content " + content);
      expect(content[0]).toEqual(secondTodo);
      expect(content[1]).toEqual(firstTodo);

    });
  });

});

