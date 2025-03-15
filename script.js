document.addEventListener("DOMContentLoaded", loadTasks);

function addTask() {
    let taskInput = document.getElementById("task-input");
    let taskText = taskInput.value.trim();

    if (taskText === "") return; // Prevent adding empty tasks

    let taskList = document.getElementById("task-list");

    // Create a new task item
    let li = document.createElement("li");
    li.innerHTML = `${taskText} <button onclick="removeTask(this)">Delete</button>`;

    taskList.appendChild(li);

    saveTasks(); // Save tasks to Local Storage

    taskInput.value = ""; // Clear input field
}

function removeTask(button) {
    let taskList = document.getElementById("task-list");
    taskList.removeChild(button.parentElement);

    saveTasks(); // Save updated tasks
}

function saveTasks() {
    let taskList = document.getElementById("task-list");
    let tasks = [];

    taskList.querySelectorAll("li").forEach(task => {
        tasks.push(task.textContent.replace("Delete", "").trim());
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    let savedTasks = localStorage.getItem("tasks");

    if (savedTasks) {
        let taskList = document.getElementById("task-list");
        let tasks = JSON.parse(savedTasks);

        tasks.forEach(taskText => {
            let li = document.createElement("li");
            li.innerHTML = `${taskText} <button onclick="removeTask(this)">Delete</button>`;
            taskList.appendChild(li);
        });
    }
}
