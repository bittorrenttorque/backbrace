/*
describe('Scenario: Adding a todo', function() {
  Given('I have loaded the todo application', function() {
    afterEach(function() {
      Todos.mainPane.remove();
    });

    When('I add a new todo item', function() {
      var description;

      beforeEach(function() {
        description = 'Do Something';
        Simulo.fillIn('#new-todo', description).pressEnter();
      });

      Then('I should see the item in the list of available items', function(page) {
        page.within('#all-todos', function(page) {
          expect(page).toHaveContent(description);
        });
      });
    });
  });
});
*/