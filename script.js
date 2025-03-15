function addTask() {
    let taskInput = document.getElementById("task-input");
    let taskText = taskInput.value.trim();

    if (taskText === "") return; // Prevent adding empty tasks

    let taskList = document.getElementById("task-list");

    // Create a new task item
    let li = document.createElement("li");
    li.innerHTML = `${taskText} <button onclick="removeTask(this)">Delete</button>`;

    taskList.appendChild(li);
    taskInput.value = ""; // Clear input field
}

function removeTask(button) {
    let taskList = document.getElementById("task-list");
    taskList.removeChild(button.parentElement);
}
