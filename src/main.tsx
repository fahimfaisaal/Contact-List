import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import Contact from "./classes/Contact";
import Person from "./classes/Person";
import "./index.css";
import { Person as PersonType } from "./interfaces";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
