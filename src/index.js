"use strict";

import $ from "jquery";
import "./style.css";

// initalize the app
(async () => {
  // fetch the data
  const res = await fetch("http://localhost:3000/todos");
  const todos = await res.json();

  const templateContent = $("#todo-template")[0].content;
  const fragment = document.createDocumentFragment();

  // add the todos to the DOM
  $.each(todos, (_, todo) => {
    const clone = document.importNode(templateContent, true);
    const $li = $("li", clone);
    const $p = $("p", $li);
    $li.attr("id", todo.id);
    $p.text(todo.title);
    fragment.appendChild(clone);
  });

  $("#todos").append(fragment);
})();
