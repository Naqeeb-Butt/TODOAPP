document.addEventListener("DOMContentLoaded", () => {
  /* =====================
      Data & Variables
  ===================== */
  let tasks = [
    {
      id: 101,
      text: "ALL OUR WITNESSES NEED TO BE PREPARED",
      name: "Azgh",
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
      name: "aa",
      priority: 7,
      schedule: "TN",
      dateTime: new Date().toLocaleString(),
      level: 2,
      parentId: 101,
      collapsed: false
    },
    {
      id: 103,
      text: "Review case documents",
      name: "Sarah",
      priority: 10,
      schedule: "Monday",
      dateTime: new Date().toLocaleString(),
      level: 1,
      parentId: null,
      collapsed: false
    },
    {
      id: 104,
      text: "Prepare opening statement",
      name: "Mike",
      priority: 5,
      schedule: "Wednesday",
      dateTime: new Date().toLocaleString(),
      level: 1,
      parentId: null,
      collapsed: false
    },
    {
      id: 105,
      text: "Contact expert witnesses",
      name: "Jennifer",
      priority: 3,
      schedule: "Friday",
      dateTime: new Date().toLocaleString(),
      level: 1,
      parentId: null,
      collapsed: false
    },
    {
      id: 106,
      text: "Research precedent cases",
      name: "David",
      priority: 6,
      schedule: "Today",
      dateTime: new Date().toLocaleString(),
      level: 2,
      parentId: 103,
      collapsed: false
    },
    {
      id: 107,
      text: "Schedule deposition",
      name: "Lisa",
      priority: 9,
      schedule: "Next Week",
      dateTime: new Date().toLocaleString(),
      level: 1,
      parentId: null,
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
      dateCell.style.display = showDateTime ? "" : "none";
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
      .map(t => ({ 
        ...t, // Preserve all original task properties
        children: buildTree(t.id) 
      }));
  }

  function flattenTree(tree) {
    let flat = [];
    tree.forEach(node => {
      // Create a clean task object without the children property
      const { children, ...task } = node;
      flat.push(task);
      if (children && children.length > 0) {
        flat = flat.concat(flattenTree(children));
      }
    });
    return flat;
  }

  function sortTree(tree, key, isNumeric = false) {
    // Sort the current level
    tree.sort((a, b) => {
      if (isNumeric) {
        return b[key] - a[key]; // Descending for priority (higher priority first)
      } else {
        // Handle both string and non-string values
        const aVal = String(a[key] || '').toLowerCase();
        const bVal = String(b[key] || '').toLowerCase();
        return aVal.localeCompare(bVal);
      }
    });
    
    // Recursively sort children
    tree.forEach(node => {
      if (node.children && node.children.length > 0) {
        sortTree(node.children, key, isNumeric);
      }
    });
  }

  function sortBy(key) {
    // Build tree structure maintaining hierarchy
    let tree = buildTree();
    
    // Sort each level of the tree
    const isNumeric = key === "priority";
    sortTree(tree, key, isNumeric);
    
    // Flatten back to array while preserving the sorted hierarchy
    const sortedTasks = flattenTree(tree);
    
    // Update the tasks array
    tasks = sortedTasks;
    
    // Re-render the table
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
    const dateHeader = document.querySelector(".date-time-header");
    const dateCells = document.querySelectorAll(".modern-table td:nth-child(6)");
    
    if (showDateTime) {
      dateHeader.style.display = "";
      dateCells.forEach(cell => {
        cell.style.display = "";
      });
      // Update button text to indicate current state
      document.getElementById("toggleDateTime").textContent = "Hide Date/Time";
    } else {
      dateHeader.style.display = "none";
      dateCells.forEach(cell => {
        cell.style.display = "none";
      });
      // Update button text to indicate current state
      document.getElementById("toggleDateTime").textContent = "Show Date/Time";
    }
    
    // Ensure the change persists by re-rendering
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

  // Enhanced mobile-friendly font controls
  document.getElementById("fontSelect").addEventListener("change", applyFontSettings);
  document.getElementById("fontSizeSelect").addEventListener("change", applyFontSettings);
  document.getElementById("colorSelect").addEventListener("change", applyFontSettings);

  // Add touch event support for mobile toggle icons
  document.addEventListener("touchstart", (e) => {
    if (e.target.classList.contains("toggle-icon")) {
      e.target.style.opacity = "0.7";
    }
  });

  document.addEventListener("touchend", (e) => {
    if (e.target.classList.contains("toggle-icon")) {
      e.target.style.opacity = "1";
    }
  });

  /* =====================
      Initialize
  ===================== */
  populateDropdowns();
  renderTasks();
  
  // Set initial button text based on showDateTime state
  document.getElementById("toggleDateTime").textContent = showDateTime ? "Hide Date/Time" : "Show Date/Time";
});
