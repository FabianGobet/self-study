document.addEventListener("DOMContentLoaded", () => {
    const todoInput = document.getElementById("todo-input");
    const addTaskButton = document.getElementById("add-task-btn");
    const todoList = document.getElementById("todo-list");

    let tasks = localStorage.getItem("tasks")
        ? JSON.parse(localStorage.getItem("tasks"))
        : [];
    tasks.forEach((task) => renderTask(task));

    function saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function renderTask(task) {
        const li = document.createElement("li");
        li.setAttribute("data-id", task.id);
        li.innerHTML = `
            <span>${task.text}</span>
            <button class="delete-btn">Delete</button>
        `;
        li.addEventListener("click", (e) => {
            if (e.target.tagName === "BUTTON") {
                const taskId = e.target.parentElement.getAttribute("data-id");
                tasks = tasks.filter((t) => t.id != taskId);
                todoList.removeChild(li);
            } else {
                li.querySelector("span").classList.toggle("completed");
                const taskId = li.getAttribute("data-id");
                const task = tasks.find((t) => t.id == taskId);
                task.completed = !task.completed;
            }
            saveTasks();
        });
        todoList.appendChild(li);
    }

    addTaskButton.addEventListener("click", () => {
        const inputText = todoInput.value.trim();
        if (inputText === "") return;
        const task = {
            id: Date.now(),
            text: inputText,
            completed: false,
        };
        tasks.push(task);
        saveTasks();
        renderTask(task);
        todoInput.value = "";
    });
});
