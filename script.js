// Array to store tasks
let tasks = [];

// Function to save tasks to local storage
function saveTasks() {
    let tasks = [];
    document.querySelectorAll("#task-list .task-text").forEach(task => {
        tasks.push(task.textContent);
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Function to load tasks from local storage
function loadTasks() {
    let savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
        tasks.forEach(task => addTaskToDOM(task));
    }
}

// Function to add a task to the DOM
function addTaskToDOM(taskText) {
    let taskList = document.getElementById("task-list"); // Assuming your task list has this ID

    let li = document.createElement("li");
    li.innerHTML = `
        <span class="task-text">${taskText}</span>
        <button class="edit-btn">✏️</button>
        <button class="delete-btn">❌</button>
    `;

    // Add event listener for Edit button
    li.querySelector(".edit-btn").addEventListener("click", function () {
        editTask(li);
    });

    // Add event listener for Delete button
    li.querySelector(".delete-btn").addEventListener("click", function () {
        li.remove();
        saveTasks(); // Update storage after deletion
    });

    taskList.appendChild(li);
}

// Function to edit a task
function editTask(taskElement) {
    let taskTextElement = taskElement.querySelector(".task-text");
    let newText = prompt("Edit your task:", taskTextElement.textContent);

    if (newText !== null && newText.trim() !== "") {
        taskTextElement.textContent = newText;
        saveTasks(); // Save updated tasks
    }
}

// Function to add a new task
function addTask() {
    let taskInput = document.getElementById("task-input"); // Assuming an input field with this ID
    let taskText = taskInput.value.trim();

    if (taskText !== "") {
        addTaskToDOM(taskText);
        saveTasks(); // Save tasks after adding
        taskInput.value = ""; // Clear input field
    } else {
        alert("Please enter a task!");
    }
}

// Load saved tasks on page load
document.addEventListener("DOMContentLoaded", loadTasks);
