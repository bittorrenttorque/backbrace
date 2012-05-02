Todos.AddTagView = SC.TextField.extend({
  insertNewline: function() {
    var value = this.get('value');

    if (value) {
      var text = $('#new-todo').val();
      Todos.todoListController.addTag(text, value);
      this.set('value', '');
      $('#new-todo').val('');
    }
  }
});
