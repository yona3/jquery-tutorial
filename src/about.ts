import $ from "jquery";
import "./style.css";

const $topLink = $("#top-link");

// top link
$topLink.on("click", () => {
  window.location.href = "/";
});
