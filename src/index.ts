import $ from "jquery";
import "./style.css";
import { TemplateEl, Todo } from "./type";

// global state
const state: { todos: Todo[] } = {
  todos: [],
};

const templateContent = ($("#todo-template")[0] as TemplateEl).content;
const $form = $("form");
const $input = $('input[type="text"]', $form);

const setTodoContent = (clone: any, data: Todo) => {
  const $input = $('input[type="checkbox"]', clone);
  const $li = $("li", clone);
  const $p = $("p", $li);

  if (data.isDone) $input.prop("checked", true);
  $li.attr("id", data.id);
  $p.text(data.title);
  return clone;
};

// initalize the app
(async () => {
  // fetch the data
  const res = await fetch("http://localhost:3000/todos");
  const todos = await res.json();
  state.todos = todos;

  const fragment = document.createDocumentFragment();

  // add the todos to the DOM
  $.each(state.todos, (_, todo) => {
    const clone = document.importNode(templateContent, true);
    const configuredClone = setTodoContent(clone, todo);
    fragment.appendChild(configuredClone);
  });

  $("#todos").append(fragment);
})();

const addTodo = async (todo: Omit<Todo, "id">) => {
  try {
    // post the data
    const res = await fetch("http://localhost:3000/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todo),
    });
    const data = await res.json();
    if (!data) throw new Error("No data returned");
    console.log(data);

    // add the todo to the DOM
    const clone = document.importNode(templateContent, true);
    const configuredClone = setTodoContent(clone, data);
    $("#todos").append(configuredClone);

    state.todos.push(data);
    console.log(state.todos);

    // clear the form
    $input.val("");
  } catch (err) {
    console.error(err);
  }
};

// add Todo
$form.on("submit", async (e) => {
  e.preventDefault();

  const title = $input.val() as string;
  const todo = {
    title,
    isDone: false,
  };

  await addTodo(todo);
});
