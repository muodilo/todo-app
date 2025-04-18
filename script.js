const titleDateEl = document.querySelector('#title-date');
const now = new Date().toString().slice(0, 16);
titleDateEl.innerText = now;

const todoList = document.getElementById('todo-list');
const titleInput = document.getElementById('todo-title');
const dueInput = document.getElementById('todo-due');
const filterCompletedCheckbox = document.getElementById('filter-completed');

let todos = [];
let isAscending = true;

async function fetchTodos() {
    try {
        const res = await fetch("https://jsonplaceholder.typicode.com/todos?_limit=10");
        const data = await res.json();
        todos = data.map(todo => ({
            id: todo.id,
            title: todo.title,
            dueDate: generateFakeDate(),
            completed: todo.completed
        }));
        renderTodos();
    } catch (error) {
        console.error("Error fetching todos:", error);
    }
}

function generateFakeDate() {
    const now = new Date();
    const future = new Date(now.getTime() + Math.random() * 7 * 24 * 60 * 1000);
    return future.toISOString().slice(0, 16);
}


