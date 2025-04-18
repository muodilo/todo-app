const titleDateEl = document.querySelector('#title-date');
const now = new Date().toString().slice(0, 16);
titleDateEl.innerText = now;

const todoList = document.getElementById('todo-list');
const titleInput = document.getElementById('todo-title');
const dueInput = document.getElementById('todo-due');
const filterCompletedCheckbox = document.getElementById('filter-completed');

let todos = [];
let isAscending = true;
