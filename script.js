// ---------- UTIL: LOG ----------
const log = (...args) => { try { console.log(...args); } catch {} };

// ---------- LOCAL STORAGE HELPERS ----------
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

// ---------- DATA NORMALIZATION ----------
function normalizeTasks() {
  // Add missing ids and remove invalid entries
  const tasks = getTasks()
    .filter(t => t && typeof t === "object") // drop nulls
    .map(t => {
      if (!t.id) t.id = Date.now() + Math.floor(Math.random() * 1000000);
      return t;
    });
  saveTasks(tasks);

  const completed = getCompletedTasks()
    .filter(t => t && typeof t === "object")
    .map(t => {
      if (!t.id) t.id = Date.now() + Math.floor(Math.random() * 1000000);
      return t;
    });
  saveCompletedTasks(completed);
}
normalizeTasks();

// ---------- SAFE RENDER HELPERS ----------
function safeRender(elementId, renderFn) {
  const el = document.getElementById(elementId);
  if (!el) return false;
  try { renderFn(el); } catch (e) { log("Render error for", elementId, e); }
  return true;
}

// ---------- UNIVERSAL ACTIONS (by id) ----------
function removeTaskById(id) {
  const tasks = getTasks();
  const idx = tasks.findIndex(t => t.id === id);
  if (idx === -1) return;
  tasks.splice(idx, 1);
  saveTasks(tasks);
  // Re-render only if elements exist (no crashes on other pages)
  safeRender("nextTaskDisplay", () => displayTasksPage());
  safeRender("completedTasksDisplay", () => displayCompletedTasks());
}

function completeTaskById(id) {
  const tasks = getTasks();
  const completed = getCompletedTasks();
  const idx = tasks.findIndex(t => t.id === id);
  if (idx === -1) return;
  const [task] = tasks.splice(idx, 1);
  completed.unshift(task);
  saveTasks(tasks);
  saveCompletedTasks(completed);

  safeRender("nextTaskDisplay", () => displayTasksPage());
  safeRender("completedTasksDisplay", () => displayCompletedTasks());

  // Navigate to Completed page after completing
  window.location.href = "page3.html";
}

function removeCompletedTaskById(id) {
  const tasks = getCompletedTasks();
  const idx = tasks.findIndex(t => t.id === id);
  if (idx === -1) return;
  tasks.splice(idx, 1);
  saveCompletedTasks(tasks);
  safeRender("completedTasksDisplay", () => displayCompletedTasks());
}

// ---------- PAGE 1: ADD TASK ----------
safeRender("taskForm", (form) => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("taskTitle").value.trim();
    const desc = document.getElementById("taskDesc").value.trim();
    const due = document.getElementById("taskDue").value;

    if (!title || !desc || !due) {
      alert("Please fill in title, description, and due date.");
      return;
    }

    const tasks = getTasks();
    const id = Date.now() + Math.floor(Math.random() * 1000000);
    tasks.push({ id, title, desc, due });
    saveTasks(tasks);

    form.reset();
    window.location.href = "page2.html";
  });
});

// ---------- PAGE 2: VIEW TASKS ----------
function displayTasksPage() {
  const nextDisplay = document.getElementById("nextTaskDisplay");
  const waitlistDisplay = document.getElementById("waitlistDisplay");
  if (!nextDisplay || !waitlistDisplay) return;

  // Clean and prepare tasks
  let tasks = getTasks()
    .filter(t => t && t.title && t.desc && t.due); // drop invalid rows

  nextDisplay.innerHTML = "";
  waitlistDisplay.innerHTML = "";

  if (tasks.length === 0) {
    nextDisplay.innerHTML = "<em>No tasks yet</em>";
    return;
  }

  // Sort by due date ascending
  const sorted = [...tasks].sort((a, b) => new Date(a.due) - new Date(b.due));
  const now = new Date();

  // Next due task
  const next = sorted[0];
  const nextDue = new Date(next.due);
  let nextClass = "later";
  if (nextDue < now) nextClass = "overdue";
  else if ((nextDue - now) / (1000 * 60 * 60 * 24) <= 2) nextClass = "upcoming";

  nextDisplay.innerHTML = `
    <div class="${nextClass}">
      <strong>${next.title}</strong><br>
      ${next.desc}<br>
      Due: ${nextDue.toLocaleString()}
    </div>
  `;

  // All upcoming tasks
  sorted.forEach((task) => {
    const dueDate = new Date(task.due);
    let cssClass = "later";
    if (dueDate < now) cssClass = "overdue";
    else if ((dueDate - now) / (1000 * 60 * 60 * 24) <= 2) cssClass = "upcoming";

    const li = document.createElement("li");
    li.className = cssClass;
    li.innerHTML = `
      <div>
        <strong>${task.title}</strong><br>
        ${task.desc}<br>
        Due: ${dueDate.toLocaleString()}
      </div>
      <div>
        <button onclick="completeTaskById(${task.id})">Complete</button>
        <button onclick="removeTaskById(${task.id})">Remove</button>
      </div>
    `;
    waitlistDisplay.appendChild(li);
  });
}
safeRender("nextTaskDisplay", () => displayTasksPage());

// ---------- PAGE 3: COMPLETED TASKS ----------
function displayCompletedTasks() {
  const list = document.getElementById("completedTasksDisplay");
  if (!list) return;

  const tasks = getCompletedTasks()
    .filter(t => t && t.title && t.desc && t.due);

  list.innerHTML = "";

  if (tasks.length === 0) {
    list.innerHTML = "<li class='completed'><em>No completed tasks yet</em></li>";
    return;
  }

  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = "completed";
    li.innerHTML = `
      <div>
        <strong>${task.title}</strong><br>
        ${task.desc}<br>
        Completed: ${new Date(task.due).toLocaleString()}
      </div>
      <div>
        <button onclick="removeCompletedTaskById(${task.id})">Remove</button>
      </div>
    `;
    list.appendChild(li);
  });
}
safeRender("completedTasksDisplay", () => displayCompletedTasks());
