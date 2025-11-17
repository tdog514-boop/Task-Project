function getTasks() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

function saveTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

if (document.getElementById("taskForm")) {
  const form = document.getElementById("taskForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("taskTitle").value;
    const desc = document.getElementById("taskDesc").value;
    const due = document.getElementById("taskDue").value;

    const tasks = getTasks();
    tasks.unshift({ title, desc, due }); // newest first
    saveTasks(tasks);
    form.reset();
    displayRecentTasks();
  });

  function displayRecentTasks() {
    const tasks = getTasks();
    const list = document.getElementById("recentTasksDisplay");
    list.innerHTML = "";

    tasks.forEach((task, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <div>
          <strong>${task.title}</strong> - ${task.desc}<br>
          Due: ${new Date(task.due).toLocaleString()}
        </div>
        <button onclick="removeTask(${index})">Remove</button>
      `;
      list.appendChild(li);
    });
  }

  window.removeTask = function(index) {
    const tasks = getTasks();
    tasks.splice(index, 1);
    saveTasks(tasks);
    displayRecentTasks();
  };

  displayRecentTasks();
}


if (document.getElementById("nextTaskDisplay")) {
  function displayTasksPage() {
    const tasks = getTasks();
    const nextDisplay = document.getElementById("nextTaskDisplay");
    const waitlistDisplay = document.getElementById("waitlistDisplay");

    nextDisplay.innerHTML = "";
    waitlistDisplay.innerHTML = "";

    if (tasks.length > 0) {
      const sortedByDue = [...tasks].sort((a, b) => new Date(a.due) - new Date(b.due));
      const next = sortedByDue[0];

      nextDisplay.innerHTML = `
        <strong>${next.title}</strong> - ${next.desc}<br>
        Due: ${new Date(next.due).toLocaleString()}
      `;

      tasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
          <div>
            <strong>${task.title}</strong> - ${task.desc}<br>
            Due: ${new Date(task.due).toLocaleString()}
          </div>
          <button onclick="removeTask(${index})">Remove</button>
        `;
        waitlistDisplay.appendChild(li);
      });
    }
  }

  window.removeTask = function(index) {
    const tasks = getTasks();
    tasks.splice(index, 1);
    saveTasks(tasks);
    displayTasksPage();
  };

  displayTasksPage();
}
