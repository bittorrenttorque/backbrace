Todos.ListView = SC.TemplateCollectionView.extend({
  contentBinding: "Todos.todoListController",
  itemClassBinding: "content.isDone"
});