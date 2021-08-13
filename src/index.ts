import $ from "jquery";
import "./style.css";
import { TemplateEl, Todo } from "./type";

// global state
const state: { todos: Todo[] } = {
  todos: [],
};

const $main = $("main");
const $loading = $("#loading");
const templateContent = ($("#todo-template")[0] as TemplateEl).content;
const $form = $("form");
const $input = $('input[type="text"]', $form);
const $aboutLink = $("#about-link");

const setTodoContent = (clone: any, todo: Todo) => {
  const $li = $("li", clone);
  const $checkbox = $('input[type="checkbox"]', $li);
  const $p = $("p", $li);
  const $button = $("button", $li);

  if (todo.isDone) {
    $checkbox.prop("checked", true);
    $p.addClass("checked");
  }
  $li.attr("id", todo.id);
  $p.text(todo.title);

  // update isDone event
  $checkbox.on("change", async () => {
    await updateTodo(todo, $checkbox, $p);
  });

  // delete todo event
  $button.on("click", async () => {
    await deleteTodo(todo, $li);
  });

  return clone;
};

// initalize the app
(async () => {
  $main.hide();
  $loading.show();

  try {
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
  } catch (err) {
    console.error(err);
  } finally {
    // to check the loading operation
    setTimeout(() => {
      $loading.hide();
      $main.show();
    }, 500);
  }
})();

// todo operation

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

    // add the todo to the DOM
    const clone = document.importNode(templateContent, true);
    const configuredClone = setTodoContent(clone, data);
    $("#todos").append(configuredClone);

    state.todos.push(data);

    // clear the form
    $input.val("");
  } catch (err) {
    console.error(err);
  }
};

const updateTodo = async (
  todo: Todo,
  $checkbox: JQuery<HTMLElement>,
  $p: JQuery<HTMLElement>
) => {
  const isDone = $checkbox.prop("checked");

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
      $checkbox.prop("checked", data.isDone);
      $p.toggleClass("checked");
      state.todos.map((t) => {
        if (t.id === todo.id) {
          t.isDone = data.isDone;
        }
      });
    }
  } catch (err) {
    console.error(err);
  }
};

const deleteTodo = async (todo: Todo, $li: JQuery<HTMLElement>) => {
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
};

// add Todo event
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
