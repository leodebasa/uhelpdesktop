const content = document.querySelector(".content");
const btnNew = document.querySelector(".addNote-content");

let items_db = localStorage.getItem("items_db")
  ? JSON.parse(localStorage.getItem("items_db"))
  : [];

const colors = ["#a559e3", "#eea214"];
const randomColor = () => colors[Math.floor(Math.random() * colors.length)];

function loadItems() {
  content.innerHTML = "";
  verifyNulls();

  items_db.forEach((item, i) => {
    addHTML(item, i);
  });

  addEvents();
}

btnNew.onclick = () => {
  const newItem = { text: "", color: randomColor() };
  items_db.push(newItem);
  addHTML(newItem, items_db.length - 1);
  localStorage.setItem("items_db", JSON.stringify(items_db));
  addEvents();
};

function addHTML(item, index) {
  const div = document.createElement("div");

  div.innerHTML = `<div class="item" style="background-color: ${
    item.color
  }">
    <span class="remove">X</span>
    <textarea>${item.text}</textarea>
  </div>`;

  content.appendChild(div);
}

function addEvents() {
  const notes = document.querySelectorAll(".item textarea");
  const remove = document.querySelectorAll(".item .remove");

  notes.forEach((item, i) => {
    item.oninput = () => {
      items_db[i] = {
        text: item.value,
        color: items_db[i]?.color || item.parentElement.style.backgroundColor,
      };

      localStorage.setItem("items_db", JSON.stringify(items_db));
    };
  });

  remove.forEach((item, i) => {
    item.onclick = () => {
      content.children[i].remove();
      items_db.splice(i, 1);
      localStorage.setItem("items_db", JSON.stringify(items_db));
      addEvents();
    };
  });
}

function verifyNulls() {
  items_db = items_db.filter((item) => item);
  localStorage.setItem("items_db", JSON.stringify(items_db));
}

loadItems();
