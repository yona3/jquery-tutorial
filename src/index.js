"use strict";

import $ from "jquery";
import "./style.css";

// global state
const state = {
  todos: [],
};

const templateContent = $("#todo-template")[0].content;
const $form = $("form");
const $input = $("input", $form);

const setTodoContent = (clone, data) => {
  const $input = $("input", clone);
  const $li = $("li", clone);
  const $p = $("p", $li);

  $input.attr("checked", data.isDone);
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

const addTodo = async (todo) => {
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
    const configuredClone = setTodoContent(clone, todo);
    $("#todos").append(configuredClone);

    state.todos.push(todo);
    console.log(state.todos);

    // clear the form
    $input[0].value = "";
  } catch (err) {
    console.error(err);
  }
};

// add Todo
$form.on("submit", async (e) => {
  e.preventDefault();

  const title = $input[0].value;
  const todo = {
    title,
    isDone: false,
  };

  await addTodo(todo);
});
