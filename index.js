import { juego } from "./juego.js";

const DOM = document.querySelector("#root");
DOM.innerHTML = "";
DOM.appendChild(juego());
