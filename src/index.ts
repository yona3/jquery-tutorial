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
const $aboutLink = $("#about-link");

const setTodoContent = (clone: any, todo: Todo) => {
  const $li = $("li", clone);
  const $input = $('input[type="checkbox"]', $li);
  const $p = $("p", $li);
  const $button = $("button", $li);

  if (todo.isDone) {
    $input.prop("checked", true);
    $p.addClass("checked");
  }
  $li.attr("id", todo.id);
  $p.text(todo.title);

  // update isDone event
  $input.on("change", async () => {
    const isDone = $input.prop("checked");

    try {
      const res = await fetch(`http://localhost:3000/todos/${todo.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isDone }),
      });
      const data = await res.json();

      if (data) {
        $input.prop("checked", data.isDone);
        $p.toggleClass("checked");
      }
    } catch (err) {
      console.error(err);
    }
  });

  // delete todo event
  $button.on("click", async () => {
    try {
      const res = await fetch(`http://localhost:3000/todos/${todo.id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data) {
        const updatedTodoState = state.todos.filter((t) => t.id !== todo.id);
        state.todos = updatedTodoState;
        $li.remove();
      }
    } catch (err) {
      console.error(err);
    }
  });

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

// about link
$aboutLink.on("click", () => {
  window.location.href = "/about";
});
