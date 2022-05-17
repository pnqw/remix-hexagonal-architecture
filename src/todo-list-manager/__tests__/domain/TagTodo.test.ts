import { TodosInMemory } from "./fakes/TodosInMemory";
import { Todos } from "../../domain/Todos";
import { aTodo } from "./builders/Todo";
import { TagTodo } from "../../usecase/TagTodo";

describe("Tagging a todo", () => {
  let todos: Todos;
  let tagTodo: TagTodo;

  beforeEach(() => {
    todos = new TodosInMemory();
    tagTodo = new TagTodo(todos);
  });

  it("adds new tags to the todo", async () => {
    // Arrange
    const theTodoId = "todo/1";
    const theOwnerId = "owner/1";
    const theTodo = aTodo().withId(theTodoId).ownedBy(theOwnerId).build();
    await todos.save(theTodo);

    // Act
    await tagTodo.execute(theTodoId, theOwnerId, "feature");
    await tagTodo.execute(theTodoId, theOwnerId, "top priority");
    await tagTodo.execute(theTodoId, theOwnerId, "feature");

    // Assert
    expect((await todos.ofId(theTodoId, theOwnerId)).tags).toEqual([
      "feature",
      "top priority",
    ]);
  });
});
