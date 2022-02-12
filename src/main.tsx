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

const person1: PersonType = new Person(
  "fahim",
  "faisal",
  ["01721494068"],
  {
    facebook: "https://facebook.com/fahimfaisaal",
  },
  {
    region: "Asia",
    country: "Bangladesh",
    city: "Rajshahi",
    town: "Naogaon",
    postalCode: 6500,
  }
);
const person2: PersonType = new Person(
  "MD",
  "Al amin",
  ["01706853881", "01772184056"],
  {
    facebook: "https://facebook.com/alamin",
  },
  {
    region: "Asia",
    country: "Bangladesh",
    city: "Rajshahi",
    town: "Naogaon",
    postalCode: 6500,
  }
);

const contact1: Contact = new Contact();
contact1.add(person1);
contact1.add(person2);
// console.log(contact1.deleteLast(2));
const contact2: Contact = contact1.clone();
console.log(contact1.search("a"));
console.log(contact1, contact2);
