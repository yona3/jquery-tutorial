"use strict";

import $ from "jquery";
import "./style.css";

// global state
const state = {
  todos: [],
};

// initalize the app
(async () => {
  // fetch the data
  const res = await fetch("http://localhost:3000/todos");
  const todos = await res.json();
  state.todos = todos;

  const templateContent = $("#todo-template")[0].content;
  const fragment = document.createDocumentFragment();

  // add the todos to the DOM
  $.each(state.todos, (_, todo) => {
    const clone = document.importNode(templateContent, true);
    const $input = $("input", clone);
    const $li = $("li", clone);
    const $p = $("p", $li);
    $input.attr("checked", todo.isDone);
    $li.attr("id", todo.id);
    $p.text(todo.title);
    fragment.appendChild(clone);
  });

  $("#todos").append(fragment);
})();
