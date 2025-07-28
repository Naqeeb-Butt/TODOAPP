document.addEventListener("DOMContentLoaded", () => {
  /* =====================
      Data & Variables
  ===================== */
  let tasks = [
    {
      id: 101,
      text: "ALL OUR WITNESSES NEED TO BE PREPARED",
      name: "LORD",
      priority: 8,
      schedule: "TN",
      dateTime: new Date().toLocaleString(),
      level: 1,
      parentId: null,
      collapsed: false
    },
    {
      id: 102,
      text: "JOHN ADAMS",
      name: "LORD",
      priority: 9,
      schedule: "TN",
      dateTime: new Date().toLocaleString(),
      level: 2,
      parentId: 101,
      collapsed: false
    }
  ];

  let showDateTime = true;
  let editModeId = null;

  /* =====================
      Utility Functions
  ===================== */
  function generateRandomId() {
    let id;
    do {
      id = Math.floor(100 + Math.random() * 900);
    } while (tasks.some(t => t.id === id));
    return id;
  }

  function hasChildren(id) {
    return tasks.some(t => t.parentId === id);
  }

  function isHidden(task) {
    if (task.parentId === null) return false;
    let parent = tasks.find(t => t.id === task.parentId);
    while (parent) {
      if (parent.collapsed) return true;
      parent = tasks.find(t => t.id === parent.parentId);
    }
    return false;
  }

  function toggleCollapse(id) {
    const task = tasks.find(t => t.id === id);
    task.collapsed = !task.collapsed;
    renderTasks();
  }

  /* =====================
      Font Dropdowns
  ===================== */
  const fontOptions = ["Arial","Verdana","Times New Roman","Courier New","Georgia","Tahoma","Trebuchet MS","Impact","Comic Sans MS","Helvetica"];
  const sizeOptions = [6,8,10,12,14,16,18,20,24,28,30];
  const colorOptions = ["Black","Red","Green","Blue","Orange","Purple"];

  function populateDropdowns() {
    const fontSelect = document.getElementById("fontSelect");
    const fontSizeSelect = document.getElementById("fontSizeSelect");
    const colorSelect = document.getElementById("colorSelect");

    fontOptions.forEach(f => {
      const opt = document.createElement("option");
      opt.value = f;
      opt.textContent = f;
      fontSelect.appendChild(opt);
    });

    sizeOptions.forEach(s => {
      const opt = document.createElement("option");
      opt.value = s;
      opt.textContent = `${s}pt`;
      fontSizeSelect.appendChild(opt);
    });

    colorOptions.forEach(c => {
      const opt = document.createElement("option");
      opt.value = c.toLowerCase();
      opt.textContent = c;
      colorSelect.appendChild(opt);
    });
  }

  function applyFontSettings() {
    const font = document.getElementById("fontSelect").value;
    const size = document.getElementById("fontSizeSelect").value;
    const color = document.getElementById("colorSelect").value;

    document.getElementById("taskTable").style.fontFamily = font;
    document.getElementById("taskTable").style.fontSize = size + "pt";
    document.getElementById("taskTable").style.color = color;
  }

  /* =====================
      Rendering Tasks
  ===================== */
  function renderTasks() {
    const tbody = document.getElementById("taskTable");
    tbody.innerHTML = "";

    tasks.forEach(task => {
      if (isHidden(task)) return;

      const row = document.createElement("tr");

      // ID
      const idCell = document.createElement("td");
      idCell.textContent = task.id;
      row.appendChild(idCell);

      // Task
      const taskCell = document.createElement("td");
      taskCell.classList.add("task-cell");
      taskCell.setAttribute("data-level", task.level);

      if (hasChildren(task.id)) {
        const icon = document.createElement("span");
        icon.textContent = task.collapsed ? "▶" : "▼";
        icon.className = "toggle-icon";
        icon.addEventListener("click", () => toggleCollapse(task.id));
        taskCell.appendChild(icon);
      } else {
        const bullet = document.createElement("span");
        bullet.textContent = "•";
        bullet.className = "toggle-icon";
        taskCell.appendChild(bullet);
      }

      taskCell.appendChild(document.createTextNode(task.text));
      row.appendChild(taskCell);

      // Name
      const nameCell = document.createElement("td");
      nameCell.textContent = task.name;
      row.appendChild(nameCell);

      // Priority
      const priorityCell = document.createElement("td");
      priorityCell.textContent = task.priority;
      row.appendChild(priorityCell);

      // Schedule
      const scheduleCell = document.createElement("td");
      scheduleCell.textContent = task.schedule;
      row.appendChild(scheduleCell);

      // Date
      const dateCell = document.createElement("td");
      dateCell.textContent = task.dateTime;
      if (!showDateTime) dateCell.style.display = "none";
      row.appendChild(dateCell);

      // Actions
      const actionsCell = document.createElement("td");
      actionsCell.className = "actions-cell";

      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.classList.add("edit-btn");
      editBtn.addEventListener("click", () => openModal(task));

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.classList.add("delete-btn");
      deleteBtn.addEventListener("click", () => deleteTask(task.id));

      actionsCell.appendChild(editBtn);
      actionsCell.appendChild(deleteBtn);
      row.appendChild(actionsCell);

      tbody.appendChild(row);
    });
  }
  const modal = document.getElementById("taskModal");
  const form = document.getElementById("taskForm");
  const parentSelect = document.getElementById("parentSelect");
  const cancelBtn = document.getElementById("cancelModal");

  function openModal(task = null) {
    editModeId = task ? task.id : null;
    document.getElementById("modalTitle").textContent = task ? "Edit Task" : "Add Task";

    document.getElementById("taskText").value = task ? task.text : "";
    document.getElementById("taskName").value = task ? task.name : "";
    document.getElementById("taskPriority").value = task ? task.priority : 1;
    document.getElementById("taskSchedule").value = task ? task.schedule : "";

    populateParentDropdown(task ? task.parentId : null, task ? task.id : null);
    modal.classList.remove("hidden");
  }

  function closeModal() {
    modal.classList.add("hidden");
  }

  cancelBtn.addEventListener("click", closeModal);

  function populateParentDropdown(selectedParent = null, excludeId = null) {
    parentSelect.innerHTML = "";
    let noneOpt = document.createElement("option");
    noneOpt.value = "";
    noneOpt.textContent = "None (Top-level)";
    parentSelect.appendChild(noneOpt);

    tasks.forEach(t => {
      if (excludeId && t.id === excludeId) return; // prevent selecting self
      const opt = document.createElement("option");
      opt.value = t.id;
      opt.textContent = `${"—".repeat(t.level - 1)} ${t.text} (ID:${t.id})`;
      if (t.id === selectedParent) opt.selected = true;
      parentSelect.appendChild(opt);
    });
  }

  form.addEventListener("submit", e => {
    e.preventDefault();

    const text = document.getElementById("taskText").value;
    const name = document.getElementById("taskName").value;
    const priority = parseInt(document.getElementById("taskPriority").value, 10);
    const schedule = document.getElementById("taskSchedule").value;
    const parentId = parentSelect.value ? parseInt(parentSelect.value) : null;
    const level = parentId ? (tasks.find(t => t.id === parentId).level + 1) : 1;

    if (editModeId) {
      const task = tasks.find(t => t.id === editModeId);
      task.text = text;
      task.name = name;
      task.priority = priority;
      task.schedule = schedule;
      task.parentId = parentId;
      task.level = level;
    } else {
      const newTask = {
        id: generateRandomId(),
        text,
        name,
        priority,
        schedule,
        dateTime: new Date().toLocaleString(),
        level,
        parentId,
        collapsed: false
      };
      tasks.push(newTask);
    }

    closeModal();
    renderTasks();
  });

  /* =====================
      Delete Task Logic
  ===================== */
  function deleteTask(id) {
    if (!confirm("Delete this task and all its subtasks?")) return;
    removeWithChildren(id);
    renderTasks();
  }

  function removeWithChildren(id) {
    const children = tasks.filter(t => t.parentId === id).map(t => t.id);
    tasks = tasks.filter(t => t.id !== id);
    children.forEach(childId => removeWithChildren(childId));
  }

  /* =====================
      Sorting (Hierarchy)
  ===================== */
  function buildTree(parentId = null) {
    return tasks
      .filter(t => t.parentId === parentId)
      .map(t => ({ ...t, children: buildTree(t.id) }));
  }

  function flattenTree(tree) {
    let flat = [];
    tree.forEach(node => {
      flat.push(node);
      flat = flat.concat(flattenTree(node.children));
    });
    return flat;
  }

  function sortTree(tree, key, isNumeric = false) {
    tree.sort((a, b) => {
      if (isNumeric) return b[key] - a[key]; // Desc for priority
      return String(a[key]).localeCompare(String(b[key]));
    });
    tree.forEach(node => sortTree(node.children, key, isNumeric));
  }

  function sortBy(key) {
    let tree = buildTree();
    const isNumeric = key === "priority";
    sortTree(tree, key, isNumeric);
    tasks = flattenTree(tree);
    renderTasks();
  }

  /* =====================
      Button Event Listeners
  ===================== */
  document.getElementById("addTaskBtn").addEventListener("click", () => openModal());
  document.getElementById("sortNameBtn").addEventListener("click", () => sortBy("name"));
  document.getElementById("sortPriorityBtn").addEventListener("click", () => sortBy("priority"));
  document.getElementById("sortScheduleBtn").addEventListener("click", () => sortBy("schedule"));

  document.getElementById("toggleDateTime").addEventListener("click", () => {
    showDateTime = !showDateTime;
    document.querySelector(".date-time-header").style.display = showDateTime ? "" : "none";
    renderTasks();
  });

  document.getElementById("expandAll").addEventListener("click", () => {
    tasks.forEach(t => t.collapsed = false);
    renderTasks();
  });

  document.getElementById("collapseAll").addEventListener("click", () => {
    tasks.forEach(t => {
      if (hasChildren(t.id)) t.collapsed = true;
    });
    renderTasks();
  });

  document.getElementById("printBtn").addEventListener("click", () => {
    window.print();
  });

  document.getElementById("fontSelect").addEventListener("change", applyFontSettings);
  document.getElementById("fontSizeSelect").addEventListener("change", applyFontSettings);
  document.getElementById("colorSelect").addEventListener("change", applyFontSettings);

  /* =====================
      Initialize
  ===================== */
  populateDropdowns();
  renderTasks();
});
