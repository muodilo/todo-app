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


function renderTodos() {
    todoList.innerHTML = "";

    
    const filteredTodos = filterCompletedCheckbox.checked
        ? todos.filter(todo => todo.completed)
        : todos;

    if (filteredTodos.length === 0) {
        const emptyMsg = document.createElement("div");
        emptyMsg.className = "text-center text-gray-500 mt-10";
        emptyMsg.innerHTML = `
            <p class="text-xl font-medium">📝 No tasks yet</p>
        `;
        todoList.appendChild(emptyMsg);
        return;
    }

    filteredTodos.forEach(todo => {
        const li = document.createElement("li");
        li.className = "bg-white px-4 py-2 rounded shadow flex justify-between items-center gap-4";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = todo.completed;
        checkbox.className = "accent-blue-600";
        checkbox.addEventListener("change", () => {
            todo.completed = checkbox.checked;
            renderTodos();
        });

        const content = document.createElement("div");
        content.className = "flex-1";

        const title = document.createElement("p");
        title.textContent = todo.title;
        title.className = todo.completed
            ? "line-through text-gray-500"
            : "font-semibold";

        const date = document.createElement("p");
        date.textContent = `Due ${new Date(todo.dueDate).toLocaleString()}`;
        date.className = "text-xs text-gray-500";

        content.appendChild(title);
        content.appendChild(date);

        // Edit Button
        const editBtn = document.createElement("button");
        editBtn.textContent = "🖋️";
        editBtn.title = "Edit";
        editBtn.className = "hover:scale-110 transition";
        editBtn.addEventListener("click", () => {
            showEditForm(todo);
        });

        // Delete Button
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "🗑️";
        deleteBtn.title = "Delete";
        deleteBtn.className = "text-red-500 text-lg hover:scale-110 transition";
        deleteBtn.addEventListener("click", () => {
            todos = todos.filter(t => t.id !== todo.id);
            renderTodos();
        });

        li.appendChild(checkbox);
        li.appendChild(content);
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);

        todoList.appendChild(li);
    });
}

function showEditForm(todo) {
    const editFormContainer = document.createElement("div");
    editFormContainer.className = "fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50";

    const editForm = document.createElement("div");
    editForm.className = "bg-white p-6 rounded-lg shadow-lg w-96";

    const titleInput = document.createElement("input");
    titleInput.value = todo.title;
    titleInput.className = "w-full p-2 border border-gray-300 rounded mb-4";
    titleInput.placeholder = "Edit Task Title";

    const dateInput = document.createElement("input");
    dateInput.type = "datetime-local";
    dateInput.value = todo.dueDate.slice(0, 16); 
    dateInput.className = "w-full p-2 border border-gray-300 rounded mb-4";

    const updateBtn = document.createElement("button");
    updateBtn.textContent = "Update Task";
    updateBtn.className = "bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full";
    updateBtn.addEventListener("click", () => {
        const newTitle = titleInput.value.trim();
        const newDueDate = dateInput.value;

        if (!newTitle || !newDueDate) {
            alert("Please enter both title and due date.");
            return;
        }

        const selectedDate = new Date(newDueDate);
        const now = new Date();

        if (selectedDate <= now) {
            alert("Please select a due date in the future.");
            return;
        }

        todo.title = newTitle;
        todo.dueDate = newDueDate;

        document.body.removeChild(editFormContainer);
        renderTodos();
    });

    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "Cancel";
    cancelBtn.className = "bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 mt-2 w-full";
    cancelBtn.addEventListener("click", () => {
        document.body.removeChild(editFormContainer);
    });

    editForm.appendChild(titleInput);
    editForm.appendChild(dateInput);
    editForm.appendChild(updateBtn);
    editForm.appendChild(cancelBtn);
    editFormContainer.appendChild(editForm);

    document.body.appendChild(editFormContainer);
}


const addBtn = document.getElementById('add-btn');
addBtn.addEventListener('click', () => {
    const title = titleInput.value.trim();
    const dueDate = dueInput.value;

    if (!title || !dueDate) {
        alert("Please enter both title and due date.");
        return;
    }

    const selectedDate = new Date(dueDate);
    const now = new Date();

    if (selectedDate <= now) {
        alert("Please select a due date in the future.");
        return;
    }

    const newTodo = {
        id: todos.length + 1,
        title,
        dueDate,
        completed: false
    };

    todos.push(newTodo);
    titleInput.value = "";
    dueInput.value = "";
    renderTodos();
});

filterCompletedCheckbox.addEventListener('change', renderTodos);


const sortBtn = document.getElementById('sort-btn');
sortBtn.addEventListener('click', () => {
    todos.sort((a, b) => {
        const dateA = new Date(a.dueDate);
        const dateB = new Date(b.dueDate);
        return isAscending ? dateA - dateB : dateB - dateA;
    });
    isAscending = !isAscending; 
    renderTodos();
});


fetchTodos();
