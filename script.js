function getTasks() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}
function saveTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
function getCompletedTasks() {
  return JSON.parse(localStorage.getItem("completedTasks")) || [];
}
function saveCompletedTasks(tasks) {
  localStorage.setItem("completedTasks", JSON.stringify(tasks));
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
        <div>
          <button onclick="removeTask(${index})">Remove</button>
          <button onclick="completeTask(${index})">Complete</button>
        </div>
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
          <div>
            <button onclick="removeTask(${index})">Remove</button>
            <button onclick="completeTask(${index})">Complete</button>
          </div>
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

if (document.getElementById("completedTasksDisplay")) {
  function displayCompletedTasks() {
    const tasks = getCompletedTasks();
    const list = document.getElementById("completedTasksDisplay");
    list.innerHTML = "";

    tasks.forEach((task, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <div>
          <strong>${task.title}</strong> - ${task.desc}<br>
          Completed: ${new Date(task.due).toLocaleString()}
        </div>
        <div>
          <button onclick="removeCompletedTask(${index})">Remove</button>
        </div>
      `;
      list.appendChild(li);
    });
  }

  window.removeCompletedTask = function(index) {
    const tasks = getCompletedTasks();
    tasks.splice(index, 1);
    saveCompletedTasks(tasks);
    displayCompletedTasks();
  };

  displayCompletedTasks();
}

window.completeTask = function(index) {
  const tasks = getTasks();
  const completed = getCompletedTasks();

  const [done] = tasks.splice(index, 1);
  completed.unshift(done);

  saveTasks(tasks);
  saveCompletedTasks(completed);

  if (document.getElementById("recentTasksDisplay")) displayRecentTasks();
  if (document.getElementById("waitlistDisplay")) displayTasksPage();
  if (document.getElementById("completedTasksDisplay")) displayCompletedTasks();
};

window.restoreTask = function(index) {
  const completed = getCompletedTasks();
  const tasks = getTasks();
  const [restored] = completed.splice(index, 1);
  tasks.unshift(restored);
  saveCompletedTasks(completed);
  saveTasks(tasks);
  displayCompletedTasks();
};
