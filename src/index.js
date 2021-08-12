"use strict";

import "./style.css";

(async () => {
  const res = await fetch("http://localhost:3000/todos");
  const todos = await res.json();
  console.log("todos: ", todos);
})();
