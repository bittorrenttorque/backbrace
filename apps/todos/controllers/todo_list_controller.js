sc_require('todos');

Todos.todoListController = SC.ArrayController.create({
  // Initialize the array controller with an empty array.
  content: [],
  unsorted: [],
  ordered: false,
  // Creates a new todo with the passed title, then adds it
  // to the array.

  createTodo: function(title) {
    var todo = Todos.Todo.create({ title: title });
    this.pushObject(todo);
    this.unsorted.pushObject(todo);
  },

  addTag: function(title, tag){
    var todo = Todos.Todo.create({ title: title, tag: tag });
    this.pushObject(todo);
    this.unsorted.pushObject(todo);
  },

  remaining: function() {
    return this.filterProperty('isDone', false).get('length');
  }.property('@each.isDone'),

  clearCompletedTodos: function() {
    this.filterProperty('isDone', true).forEach(this.removeObject, this);
  },

  allAreDone: function(key, value) {
    if (value !== undefined) {
      this.setEach('isDone', value);
      return value;
    } else {
      return this.get('length') && this.everyProperty('isDone', true);
    }
  }.property('@each.isDone'),

  sortTodos: function() {
    var currentContent = this.get('content');
    var length = this.content.length;
    var i = 0;

    if(this.get('ordered') === false) {
      var sorted = this.unsorted.copy();
      sorted = sorted.sortProperty('tag');
      for (i = length-1 ; i > -1 ; i-- ) {
        this.removeObject(this.content[i]);
      }

      sorted.forEach(function(item) {
        this.pushObject(item);
      }, this);

      this.set('ordered', true);
    } else {
      for (i = length-1 ; i > -1 ; i-- ) {
        console.log("b content: " + this.content[i]);
        this.removeObject(this.content[i]);
      }

      this.unsorted.forEach(function(item) {
        this.pushObject(item);
      }, this);

      this.set('ordered', false);
    }


  }

});
