// Helper: get CSRF token (Django) 
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.startsWith(name + "=")) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Append a single todo to list
function appendTodoToList(todo) {
    const listContainer = document.getElementById("todo-list");
    const li = document.createElement("li");
    li.classList.add("todo-item");

    const textSpan = document.createElement("span");
    textSpan.textContent = todo.text;
    textSpan.classList.add("todo-text");

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.classList.add("edit-btn");
    editBtn.onclick = () => editTodo(todo.id, textSpan);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.onclick = () => deleteTodo(todo.id);

    li.appendChild(textSpan);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);

    listContainer.appendChild(li);
}

// Fetch all todos
async function fetchTodoList() {
    try {
        const response = await fetch("/api/gettodolist/");
        if (!response.ok) throw new Error("Failed to fetch todos");
        const data = await response.json();
        const listContainer = document.getElementById("todo-list");
        listContainer.innerHTML = "";

        if (!data.list || data.list.length === 0) {
            const emptyLi = document.createElement("li");
            emptyLi.textContent = "No todos found.";
            emptyLi.classList.add("todo-empty");
            listContainer.appendChild(emptyLi);
            return;
        }

        data.list.forEach(todo => appendTodoToList(todo));
    } catch (error) {
        console.error(error);
        const listContainer = document.getElementById("todo-list");
        listContainer.innerHTML = "<li class='todo-error'>Failed to load todos.</li>";
    }
}

// Add new todo
async function addTodo() {
    const input = document.getElementById("new-todo");
    const text = input.value.trim();
    if (!text) return;

    try {
        const response = await fetch("/api/create_todo/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCookie("csrftoken")
            },
            body: JSON.stringify({ text })
        });

        if (response.ok) {
            const newTodo = await response.json();
            appendTodoToList(newTodo);
            input.value = "";
        } else {
            console.error("Failed to create todo");
        }
    } catch (error) {
        console.error(error);
    }
}

// Edit todo
async function editTodo(id, textSpan) {
    const newText = prompt("Edit your todo:", textSpan.textContent);
    if (!newText) return;

    try {
        const response = await fetch(`/api/update_todo/${id}/`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCookie("csrftoken")
            },
            body: JSON.stringify({ text: newText })
        });

        if (response.ok) {
            textSpan.textContent = newText;
        } else {
            console.error("Failed to edit todo");
        }
    } catch (error) {
        console.error(error);
    }
}

// Delete todo
async function deleteTodo(id) {
    if (!confirm("Are you sure you want to delete this todo?")) return;

    try {
        const response = await fetch(`/api/delete_todo/${id}/`, {
            method: "DELETE",
            headers: { "X-CSRFToken": getCookie("csrftoken") }
        });

        if (response.ok) {
            fetchTodoList();
        } else {
            console.error("Failed to delete todo");
        }
    } catch (error) {
        console.error(error);
    }
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
    fetchTodoList();
    document.getElementById("add-todo-btn").addEventListener("click", addTodo);
});