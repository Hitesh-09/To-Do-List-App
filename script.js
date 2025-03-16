document.addEventListener("DOMContentLoaded", function () {
    const taskInput = document.getElementById("task-input");
    const addTaskBtn = document.getElementById("add-task");
    const categorySelect = document.getElementById("category-select");
    const dueDateInput = document.getElementById("due-date");
    const dueTimeInput = document.getElementById("due-time");
    const workTasks = document.getElementById("work-tasks");
    const personalTasks = document.getElementById("personal-tasks");
    const shoppingTasks = document.getElementById("shopping-tasks");
    const homeWorkTasks = document.getElementById("home-work-tasks");
    const homePersonalTasks = document.getElementById("home-personal-tasks");
    const homeShoppingTasks = document.getElementById("home-shopping-tasks");
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    function calculateTimeLeft(dueDate, dueTime) {
        const now = new Date();
        const due = new Date(`${dueDate}T${dueTime}`);
        const diff = due - now;

        if (diff <= 0) return "Overdue!";
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `${days} days, ${hours} hours, ${minutes} minutes left`;
    }

    function renderTasks() {
        workTasks.innerHTML = "";
        personalTasks.innerHTML = "";
        shoppingTasks.innerHTML = "";
        homeWorkTasks.innerHTML = "";
        homePersonalTasks.innerHTML = "";
        homeShoppingTasks.innerHTML = "";

        tasks.forEach((task, index) => {
            const li = document.createElement("li");
            li.classList.add("task-item");

            const timeLeft = task.dueDate && task.dueTime ? calculateTimeLeft(task.dueDate, task.dueTime) : "No due date";
            const isOverdue = timeLeft === "Overdue!" ? "overdue" : "";

            li.innerHTML = `
                <input type="checkbox" class="task-check" ${task.completed ? "checked" : ""} data-index="${index}">
                <span class="task-text ${task.completed ? "completed" : ""}">${task.text}</span>
                <span class="due-date ${isOverdue}">${timeLeft}</span>
                <button class="edit-task" data-index="${index}">✏️</button>
                <button class="delete-task" data-index="${index}">❌</button>
            `;

            if (task.category === "Work") {
                workTasks.appendChild(li.cloneNode(true));
                homeWorkTasks.appendChild(li);
            } else if (task.category === "Personal") {
                personalTasks.appendChild(li.cloneNode(true));
                homePersonalTasks.appendChild(li);
            } else if (task.category === "Shopping") {
                shoppingTasks.appendChild(li.cloneNode(true));
                homeShoppingTasks.appendChild(li);
            }
        });
    }

    addTaskBtn.addEventListener("click", function () {
        const taskText = taskInput.value.trim();
        const taskCategory = categorySelect.value;
        const dueDate = dueDateInput.value;
        const dueTime = dueTimeInput.value;

        if (taskText !== "") {
            const newTask = { text: taskText, category: taskCategory, completed: false, dueDate: dueDate, dueTime: dueTime };
            tasks.push(newTask);
            localStorage.setItem("tasks", JSON.stringify(tasks));
            renderTasks();
            taskInput.value = "";
            dueDateInput.value = "";
            dueTimeInput.value = "";
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

    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            const sectionId = this.dataset.section;
            document.querySelectorAll('.section').forEach(section => {
                section.classList.remove('active');
            });
            document.getElementById(sectionId).classList.add('active');
        });
    });

    // Show Home section by default
    document.getElementById('home').classList.add('active');

    renderTasks();
});
