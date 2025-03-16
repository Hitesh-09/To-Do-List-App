document.addEventListener("DOMContentLoaded", function () {
    const taskInput = document.getElementById("task-input");
    const addTaskBtn = document.getElementById("add-task");
    const categorySelect = document.getElementById("category-select");
    const dueDateInput = document.getElementById("due-date");
    const workTasks = document.getElementById("work-tasks");
    const personalTasks = document.getElementById("personal-tasks");
    const shoppingTasks = document.getElementById("shopping-tasks");
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    function calculateTimeLeft(dueDate) {
        const now = new Date();
        const due = new Date(dueDate);
        const diff = due - now;

        if (diff <= 0) return "Overdue!";
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        return `${days} days, ${hours} hours left`;
    }

    function renderTasks() {
        workTasks.innerHTML = "";
        personalTasks.innerHTML = "";
        shoppingTasks.innerHTML = "";

        let hasWorkTasks = false;
        let hasPersonalTasks = false;
        let hasShoppingTasks = false;

        tasks.forEach((task, index) => {
            const li = document.createElement("li");
            li.classList.add("task-item");

            const timeLeft = task.dueDate ? calculateTimeLeft(task.dueDate) : "No due date";
            const isOverdue = timeLeft === "Overdue!" ? "overdue" : "";

            li.innerHTML = `
                <input type="checkbox" class="task-check" ${task.completed ? "checked" : ""} data-index="${index}">
                <span class="task-text ${task.completed ? "completed" : ""}">${task.text}</span>
                <span class="due-date ${isOverdue}">${timeLeft}</span>
                <button class="edit-task" data-index="${index}">✏️</button>
                <button class="delete-task" data-index="${index}">❌</button>
            `;

            if (task.category === "Work") {
                workTasks.appendChild(li);
                hasWorkTasks = true;
            } else if (task.category === "Personal") {
                personalTasks.appendChild(li);
                hasPersonalTasks = true;
            } else if (task.category === "Shopping") {
                shoppingTasks.appendChild(li);
                hasShoppingTasks = true;
            }
        });

        document.getElementById("work-heading").style.display = hasWorkTasks ? "block" : "none";
        document.getElementById("personal-heading").style.display = hasPersonalTasks ? "block" : "none";
        document.getElementById("shopping-heading").style.display = hasShoppingTasks ? "block" : "none";
    }

    function showNotification(task) {
        const notification = new Notification('Task Reminder', {
            body: `🚀 You have a task due today at ${task.dueTime}!`,
            icon: '/path/to/icon.png' // Optional: Add an icon for the notification
        });
    }

    function setTaskReminder(task) {
        const now = new Date();
        const taskDueDate = new Date(task.dueDate);
        const timeUntilDue = taskDueDate - now;

        if (timeUntilDue > 0) {
            setTimeout(() => {
                showNotification(task);
            }, timeUntilDue);
        }
    }

    addTaskBtn.addEventListener("click", function () {
        const taskText = taskInput.value.trim();
        const taskCategory = categorySelect.value;
        const dueDate = dueDateInput.value;

        if (taskText !== "") {
            const newTask = { text: taskText, category: taskCategory, completed: false, dueDate: dueDate };
            tasks.push(newTask);
            localStorage.setItem("tasks", JSON.stringify(tasks));
            renderTasks();
            taskInput.value = "";
            dueDateInput.value = "";
            setTaskReminder(newTask);
        }
    });

    document.body.addEventListener("click", function (event) {
        const index = event.target.dataset.index;

        // ✅ Mark Task as Completed
        if (event.target.classList.contains("task-check")) {
            tasks[index].completed = event.target.checked;
            localStorage.setItem("tasks", JSON.stringify(tasks));
            renderTasks();
        }

        // ✅ Delete Task Functionality
        if (event.target.classList.contains("delete-task")) {
            tasks.splice(index, 1); // Remove task from array
            localStorage.setItem("tasks", JSON.stringify(tasks)); // Update local storage
            renderTasks(); // Refresh UI
        }

        // ✅ Edit Task Functionality
        if (event.target.classList.contains("edit-task")) {
            const newText = prompt("Edit your task:", tasks[index].text);
            if (newText !== null && newText.trim() !== "") {
                tasks[index].text = newText.trim();
                localStorage.setItem("tasks", JSON.stringify(tasks));
                renderTasks();
            }
        }
    });

    document.getElementById('enable-notifications').addEventListener('click', () => {
        if (Notification.permission !== 'granted') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    alert('Notifications enabled!');
                } else {
                    alert('Notifications denied!');
                }
            });
        } else {
            alert('Notifications are already enabled.');
        }
    });

    renderTasks();
});
