// Task Manager JS
// Handles tab switching, task CRUD, and a simple calendar

document.addEventListener('DOMContentLoaded', function() {
  // Tab switching
  const taskTab = document.querySelector('.category-tab[data-category="Task Manager"]');
  const taskContainer = document.getElementById('task-manager-container');
  const tmCalendar = document.getElementById('tm-calendar');
  const tmTaskList = document.getElementById('tm-task-list');
  const addTaskBtn = document.getElementById('add-task-btn');
  const addTaskForm = document.getElementById('add-task-form');
  const saveTaskBtn = document.getElementById('save-task-btn');
  const cancelTaskBtn = document.getElementById('cancel-task-btn');
  const taskTitle = document.getElementById('task-title');
  const taskTitleJa = document.getElementById('task-title-ja');
  const taskDate = document.getElementById('task-date');
  const taskDesc = document.getElementById('task-desc');
  const taskTime = document.getElementById('task-time');
  const taskDescJa = document.getElementById('task-desc-ja');
  // Day modal elements
  const dayModal = document.getElementById('tm-day-modal');
  const dayModalTitle = document.getElementById('tm-day-modal-title');
  const dayModalTasks = document.getElementById('tm-day-modal-tasks');
  const dayModalClose = document.getElementById('tm-day-modal-close');
  const dayModalAdd = document.getElementById('tm-day-modal-add');
  let dayModalDate = null;
  const todayBtn = document.getElementById('tm-today-btn');

  // Firebase helpers
  const db = window.firebaseDb;
  const { collection, addDoc, getDocs, deleteDoc, doc, Timestamp, query, where, updateDoc } = window.firebaseServices;
  const TASKS_COLLECTION = 'tasks';

  // State
  let tasks = [];
  let loadingTasks = false;
  let calendarMonth = (new Date()).getMonth();
  let calendarYear = (new Date()).getFullYear();

  // Load tasks from Firebase
  async function loadTasks() {
    loadingTasks = true;
    tmTaskList.innerHTML = '<div style="text-align:center; color:#888; padding:40px;">Loading tasks...</div>';
    const q = collection(db, TASKS_COLLECTION);
    const snapshot = await getDocs(q);
    tasks = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    loadingTasks = false;
    renderTasks();
    renderCalendar(calendarMonth, calendarYear);
  }

  // Save a new task to Firebase
  async function saveTaskToFirebase(task) {
    await addDoc(collection(db, TASKS_COLLECTION), {
      ...task,
      createdAt: Timestamp.now()
    });
    await loadTasks();
  }

  // Delete a task from Firebase
  async function deleteTaskFromFirebase(taskId) {
    await deleteDoc(doc(db, TASKS_COLLECTION, taskId));
    await loadTasks();
  }

  // Add recurrence options to the form
  let recurrenceType = 'once'; // 'once', 'weekly', 'multiple'
  let recurrenceDays = [];

  // Extend the add task form with recurrence controls
  function extendAddTaskForm() {
    let recurrenceDiv = document.getElementById('tm-recurrence');
    if (!recurrenceDiv) {
      recurrenceDiv = document.createElement('div');
      recurrenceDiv.id = 'tm-recurrence';
      recurrenceDiv.style.marginBottom = '12px';
      recurrenceDiv.innerHTML = `
        <label style="font-weight:bold; color:#333; margin-bottom:6px; display:block;">Repeat:</label>
        <select id="tm-recurrence-type" style="width:100%; padding:8px; border-radius:6px; border:1px solid #e0e0e0; margin-bottom:8px;">
          <option value="once">Once</option>
          <option value="weekly">Every week (choose day)</option>
          <option value="multiple">Multiple days of week</option>
        </select>
        <div id="tm-recurrence-weekly" style="display:none; margin-bottom:8px;">
          <label style="font-size:14px; color:#555;">Day of week:</label>
          <select id="tm-weekly-day" style="width:100%; padding:8px; border-radius:6px; border:1px solid #e0e0e0;">
            <option value="0">Sunday</option>
            <option value="1">Monday</option>
            <option value="2">Tuesday</option>
            <option value="3">Wednesday</option>
            <option value="4">Thursday</option>
            <option value="5">Friday</option>
            <option value="6">Saturday</option>
          </select>
        </div>
        <div id="tm-recurrence-multiple" style="display:none; margin-bottom:8px;">
          <label style="font-size:14px; color:#555;">Days of week:</label>
          <div id="tm-multiple-days" style="display:flex; gap:6px; flex-wrap:wrap; margin-top:4px;"></div>
        </div>
      `;
      const form = document.getElementById('add-task-form');
      form.insertBefore(recurrenceDiv, form.firstChild);
      // Add day checkboxes for multiple
      const days = ['S','M','T','W','T','F','S'];
      const daysDiv = recurrenceDiv.querySelector('#tm-multiple-days');
      days.forEach((d, i) => {
        const label = document.createElement('label');
        label.style.display = 'flex';
        label.style.alignItems = 'center';
        label.style.gap = '2px';
        label.style.fontSize = '15px';
        label.innerHTML = `<input type="checkbox" value="${i}" style="margin-right:2px;">${d}`;
        daysDiv.appendChild(label);
      });
      // Event listeners for recurrence type
      recurrenceDiv.querySelector('#tm-recurrence-type').addEventListener('change', function() {
        recurrenceType = this.value;
        recurrenceDiv.querySelector('#tm-recurrence-weekly').style.display = (this.value === 'weekly') ? 'block' : 'none';
        recurrenceDiv.querySelector('#tm-recurrence-multiple').style.display = (this.value === 'multiple') ? 'block' : 'none';
      });
    }
  }

  // Show add task form with recurrence options
  function showAddTaskForm(dateStr) {
    addTaskForm.style.display = 'block';
    addTaskBtn.style.display = 'none';
    if (dateStr) {
      taskDate.value = dateStr;
    }
    extendAddTaskForm();
    // Reset recurrence
    recurrenceType = 'once';
    recurrenceDays = [];
    document.getElementById('tm-recurrence-type').value = 'once';
    document.getElementById('tm-recurrence-weekly').style.display = 'none';
    document.getElementById('tm-recurrence-multiple').style.display = 'none';
    // Uncheck all multiple days
    document.querySelectorAll('#tm-multiple-days input[type="checkbox"]').forEach(cb => cb.checked = false);
    taskTime.value = '';
    taskDescJa.value = '';
    taskTitleJa.value = '';
  }

  addTaskBtn.addEventListener('click', () => showAddTaskForm());
  cancelTaskBtn.addEventListener('click', () => {
    addTaskForm.style.display = 'none';
    addTaskBtn.style.display = 'block';
    taskTitle.value = '';
    taskDate.value = '';
    taskDesc.value = '';
  });

  // Update save/cancel handlers to use Firebase
  saveTaskBtn.addEventListener('click', async () => {
    if (!taskTitle.value && !taskTitleJa.value) {
      alert('At least one title is required');
      return;
    }
    if (!taskDate.value && recurrenceType === 'once') {
      alert('Date required');
      return;
    }
    let rec = { type: recurrenceType };
    if (recurrenceType === 'weekly') {
      rec.day = parseInt(document.getElementById('tm-weekly-day').value);
    } else if (recurrenceType === 'multiple') {
      rec.days = Array.from(document.querySelectorAll('#tm-multiple-days input[type="checkbox"]:checked')).map(cb => parseInt(cb.value));
    }
    const newTask = {
      title: taskTitle.value,
      titleJa: taskTitleJa.value,
      date: taskDate.value,
      time: taskTime.value,
      desc: taskDesc.value,
      descJa: taskDescJa.value,
      recurrence: rec
    };
    await saveTaskToFirebase(newTask);
    addTaskForm.style.display = 'none';
    addTaskBtn.style.display = 'block';
    taskTitle.value = '';
    taskTitleJa.value = '';
    taskDate.value = '';
    taskTime.value = '';
    taskDesc.value = '';
    taskDescJa.value = '';
  });

  todayBtn.addEventListener('click', () => {
    const now = new Date();
    calendarMonth = now.getMonth();
    calendarYear = now.getFullYear();
    renderCalendar(calendarMonth, calendarYear);
  });

  // Show/hide day modal
  function openDayModal(dateStr) {
    dayModalDate = dateStr;
    dayModal.style.display = 'flex';
    dayModalTitle.textContent = `Tasks for ${dateStr}`;
    renderDayModalTasks(dateStr);
  }
  function closeDayModal() {
    dayModal.style.display = 'none';
    dayModalDate = null;
  }
  dayModalClose.addEventListener('click', closeDayModal);
  dayModalAdd.addEventListener('click', () => {
    closeDayModal();
    showAddTaskForm(dayModalDate);
  });
  dayModal.addEventListener('click', (e) => {
    if (e.target === dayModal) closeDayModal();
  });

  function getTaskDisplayTitle(task) {
    if (window.currentLang === 'ja' && task.titleJa) return task.titleJa;
    return task.title || task.titleJa || '';
  }

  function renderDayModalTasks(dateStr) {
    let filtered = tasks.filter(t => {
      if (t.recurrence) {
        if (t.recurrence.type === 'weekly') {
          const d = new Date(dateStr);
          return d.getDay() === t.recurrence.day;
        } else if (t.recurrence.type === 'multiple') {
          const d = new Date(dateStr);
          return t.recurrence.days && t.recurrence.days.includes(d.getDay());
        }
      }
      return t.date === dateStr;
    });
    if (filtered.length === 0) {
      dayModalTasks.innerHTML = '<p style="color:#888; text-align:center;">No tasks for this day.</p>';
      return;
    }
    dayModalTasks.innerHTML = '';
    filtered.forEach((task) => {
      const div = document.createElement('div');
      div.className = 'task-item';
      div.style.background = '#f8f9fa';
      div.style.borderRadius = '8px';
      div.style.padding = '16px';
      div.style.marginBottom = '14px';
      div.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)';
      let recurrenceLabel = '';
      if (task.recurrence) {
        if (task.recurrence.type === 'weekly') {
          recurrenceLabel = `<span style="color:#1976d2; font-size:13px; margin-left:8px;">(Every ${['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][task.recurrence.day]})</span>`;
        } else if (task.recurrence.type === 'multiple') {
          const days = task.recurrence.days.map(d => ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d]).join(', ');
          recurrenceLabel = `<span style="color:#1976d2; font-size:13px; margin-left:8px;">(Every: ${days})</span>`;
        }
      }
      div.innerHTML = `<div style="display:flex; align-items:center; justify-content:space-between;">
        <div><strong style="color:var(--primary); font-size:18px;">${getTaskDisplayTitle(task)}</strong> <span style="color:#888; font-size:14px;">${task.time ? task.time : ''}</span> ${recurrenceLabel}</div>
        <button data-id="${task.id}" class="delete-task" style="background:none; border:none; color:#dc3545; font-size:18px; cursor:pointer;">🗑️</button>
      </div>
      <div style="margin-top:8px; color:#333; font-size:15px;">${task.desc || ''}</div>
      <div style="margin-top:4px; color:#1976d2; font-size:14px;">${task.descJa || ''}</div>`;
      dayModalTasks.appendChild(div);
    });
    dayModalTasks.querySelectorAll('.delete-task').forEach(btn => {
      btn.addEventListener('click', async function() {
        const id = this.getAttribute('data-id');
        await deleteTaskFromFirebase(id);
        renderDayModalTasks(dateStr);
      });
    });
  }

  function renderCalendar(month, year) {
    tmCalendar.innerHTML = '';
    // Header with month navigation
    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.justifyContent = 'center';
    header.style.alignItems = 'center';
    header.style.gap = '24px';
    header.style.marginBottom = '18px';
    const prevBtn = document.createElement('button');
    prevBtn.textContent = '←';
    prevBtn.style.background = 'none';
    prevBtn.style.border = 'none';
    prevBtn.style.fontSize = '22px';
    prevBtn.style.cursor = 'pointer';
    prevBtn.style.color = 'var(--primary)';
    prevBtn.onclick = () => {
      if (month === 0) {
        calendarMonth = 11;
        calendarYear = year - 1;
      } else {
        calendarMonth = month - 1;
      }
      renderCalendar(calendarMonth, calendarYear);
    };
    const nextBtn = document.createElement('button');
    nextBtn.textContent = '→';
    nextBtn.style.background = 'none';
    nextBtn.style.border = 'none';
    nextBtn.style.fontSize = '22px';
    nextBtn.style.cursor = 'pointer';
    nextBtn.style.color = 'var(--primary)';
    nextBtn.onclick = () => {
      if (month === 11) {
        calendarMonth = 0;
        calendarYear = year + 1;
      } else {
        calendarMonth = month + 1;
      }
      renderCalendar(calendarMonth, calendarYear);
    };
    const monthYear = document.createElement('div');
    monthYear.textContent = `${new Date(year, month).toLocaleString('default', { month: 'long' })} ${year}`;
    monthYear.style.fontWeight = 'bold';
    monthYear.style.color = 'var(--primary)';
    monthYear.style.fontSize = '20px';
    header.appendChild(prevBtn);
    header.appendChild(monthYear);
    header.appendChild(nextBtn);
    tmCalendar.appendChild(header);
    // Calendar grid
    const grid = document.createElement('div');
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'repeat(7, 1fr)';
    grid.style.gap = '10px';
    grid.style.marginTop = '10px';
    // Day headers
    const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    days.forEach(day => {
      const dayHeader = document.createElement('div');
      dayHeader.textContent = day;
      dayHeader.style.textAlign = 'center';
      dayHeader.style.fontWeight = 'bold';
      dayHeader.style.padding = '8px';
      dayHeader.style.color = 'var(--primary)';
      dayHeader.style.fontSize = '16px';
      grid.appendChild(dayHeader);
    });
    // Get first day and total days
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    for (let i = 0; i < firstDay; i++) {
      const emptyCell = document.createElement('div');
      emptyCell.style.height = '80px';
      emptyCell.style.backgroundColor = '#f8f9fa';
      emptyCell.style.borderRadius = '4px';
      grid.appendChild(emptyCell);
    }
    const today = new Date();
    for (let d = 1; d <= totalDays; d++) {
      const cell = document.createElement('div');
      cell.style.height = '80px';
      cell.style.backgroundColor = 'white';
      cell.style.border = '1px solid #e0e0e0';
      cell.style.borderRadius = '4px';
      cell.style.padding = '8px';
      cell.style.position = 'relative';
      cell.style.overflow = 'hidden';
      cell.style.cursor = 'pointer';
      cell.style.transition = 'background-color 0.2s';
      const dayNumber = document.createElement('div');
      dayNumber.textContent = d;
      dayNumber.style.fontWeight = 'bold';
      dayNumber.style.marginBottom = '5px';
      dayNumber.style.fontSize = '16px';
      dayNumber.style.textAlign = 'center';
      // Highlight today
      if (d === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
        cell.style.backgroundColor = 'var(--primary)';
        dayNumber.style.color = 'white';
      }
      // Highlight if task exists
      const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      const hasTask = tasks.some(t => t.date === dateStr);
      if (hasTask) {
        const dot = document.createElement('div');
        dot.style.width = '10px';
        dot.style.height = '10px';
        dot.style.background = 'var(--primary)';
        dot.style.borderRadius = '50%';
        dot.style.position = 'absolute';
        dot.style.bottom = '8px';
        dot.style.left = '50%';
        dot.style.transform = 'translateX(-50%)';
        grid.appendChild(cell);
        cell.appendChild(dot);
      }
      cell.appendChild(dayNumber);
      cell.onmouseover = () => {
        if (!(d === today.getDate() && month === today.getMonth() && year === today.getFullYear()))
          cell.style.backgroundColor = '#f8f9fa';
      };
      cell.onmouseout = () => {
        if (d === today.getDate() && month === today.getMonth() && year === today.getFullYear())
          cell.style.backgroundColor = 'var(--primary)';
        else
          cell.style.backgroundColor = 'white';
      };
      // Open day modal on click
      cell.onclick = (e) => {
        e.stopPropagation();
        const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
        openDayModal(dateStr);
      };
      grid.appendChild(cell);
    }
    tmCalendar.appendChild(grid);
  }

  // Update renderTasks to use Firebase IDs for delete
  function renderTasks(dateFilter) {
    tmTaskList.innerHTML = '';
    if (loadingTasks) {
      tmTaskList.innerHTML = '<div style="text-align:center; color:#888; padding:40px;">Loading tasks...</div>';
      return;
    }
    let filtered = tasks;
    if (dateFilter) {
      filtered = tasks.filter(t => {
        if (t.recurrence) {
          if (t.recurrence.type === 'weekly') {
            const d = new Date(dateFilter);
            return d.getDay() === t.recurrence.day;
          } else if (t.recurrence.type === 'multiple') {
            const d = new Date(dateFilter);
            return t.recurrence.days && t.recurrence.days.includes(d.getDay());
          }
        }
        return t.date === dateFilter;
      });
    }
    if (filtered.length === 0) {
      tmTaskList.innerHTML = '<p style="color:#888; text-align:center;">No tasks for this day.</p>';
      return;
    }
    filtered.forEach((task) => {
      const div = document.createElement('div');
      div.className = 'task-item';
      div.style.background = '#f8f9fa';
      div.style.borderRadius = '8px';
      div.style.padding = '16px';
      div.style.marginBottom = '14px';
      div.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)';
      let recurrenceLabel = '';
      if (task.recurrence) {
        if (task.recurrence.type === 'weekly') {
          recurrenceLabel = `<span style="color:#1976d2; font-size:13px; margin-left:8px;">(Every ${['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][task.recurrence.day]})</span>`;
        } else if (task.recurrence.type === 'multiple') {
          const days = task.recurrence.days.map(d => ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d]).join(', ');
          recurrenceLabel = `<span style="color:#1976d2; font-size:13px; margin-left:8px;">(Every: ${days})</span>`;
        }
      }
      div.innerHTML = `<div style="display:flex; align-items:center; justify-content:space-between;">
        <div><strong style="color:var(--primary); font-size:18px;">${getTaskDisplayTitle(task)}</strong> <span style="color:#888; font-size:14px;">${task.time ? task.time : ''}</span> ${recurrenceLabel}</div>
        <button data-id="${task.id}" class="delete-task" style="background:none; border:none; color:#dc3545; font-size:18px; cursor:pointer;">🗑️</button>
      </div>
      <div style="margin-top:8px; color:#333; font-size:15px;">${task.desc || ''}</div>
      <div style="margin-top:4px; color:#1976d2; font-size:14px;">${task.descJa || ''}</div>`;
      tmTaskList.appendChild(div);
    });
    document.querySelectorAll('.delete-task').forEach(btn => {
      btn.addEventListener('click', async function() {
        const id = this.getAttribute('data-id');
        await deleteTaskFromFirebase(id);
      });
    });
  }

  // --- UPCOMING TASK BANNER LOGIC ---
  function updateUpcomingTaskBanner() {
    const banner = document.getElementById('upcoming-task-banner');
    if (!banner) return;
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
    // Find all tasks for today (including recurring)
    let todayTasks = tasks.filter(t => {
      if (t.recurrence) {
        if (t.recurrence.type === 'weekly') {
          return now.getDay() === t.recurrence.day;
        } else if (t.recurrence.type === 'multiple') {
          return t.recurrence.days && t.recurrence.days.includes(now.getDay());
        }
      }
      return t.date === todayStr;
    });
    // Only show tasks that have a time, and sort by time ascending
    todayTasks = todayTasks.filter(t => t.time).sort((a, b) => (a.time || '').localeCompare(b.time || ''));
    // If no timed tasks, show untimed ones
    if (todayTasks.length === 0) {
      todayTasks = tasks.filter(t => {
        if (t.recurrence) {
          if (t.recurrence.type === 'weekly') {
            return now.getDay() === t.recurrence.day;
          } else if (t.recurrence.type === 'multiple') {
            return t.recurrence.days && t.recurrence.days.includes(now.getDay());
          }
        }
        return t.date === todayStr;
      });
    }
    if (todayTasks.length > 0) {
      // Show the soonest task
      const nextTask = todayTasks[0];
      let timeStr = nextTask.time ? nextTask.time.slice(0,5) : '';
      let title = getTaskDisplayTitle(nextTask);
      banner.textContent = `${timeStr ? timeStr + ' ' : ''}${title}`;
      banner.style.display = '';
    } else {
      banner.textContent = '';
      banner.style.display = 'none';
    }
  }

  // Patch: update banner after tasks load/save/delete and on language change
  const origLoadTasks = loadTasks;
  loadTasks = async function() {
    await origLoadTasks.apply(this, arguments);
    updateUpcomingTaskBanner();
  };
  const origSaveTaskToFirebase = saveTaskToFirebase;
  saveTaskToFirebase = async function(task) {
    await origSaveTaskToFirebase.apply(this, arguments);
    updateUpcomingTaskBanner();
  };
  const origDeleteTaskFromFirebase = deleteTaskFromFirebase;
  deleteTaskFromFirebase = async function(taskId) {
    await origDeleteTaskFromFirebase.apply(this, arguments);
    updateUpcomingTaskBanner();
  };
  // Also update on language change
  window.addEventListener('languagechange', updateUpcomingTaskBanner);
  // And on DOMContentLoaded (in case tasks are already loaded)
  document.addEventListener('DOMContentLoaded', updateUpcomingTaskBanner);

  // Initial render
  extendAddTaskForm();
  renderCalendar(calendarMonth, calendarYear);
  renderTasks();

  // On load, fetch tasks from Firebase
  document.addEventListener('firebaseReady', loadTasks);
  // Also reload when switching to Task Manager tab
  taskTab.addEventListener('click', () => {
    document.querySelectorAll('div[id$="-container"]').forEach(c => c.style.display = 'none');
    taskContainer.style.display = 'block';
    loadTasks();
  });
  // Hide task manager container when switching to other tabs
  document.querySelectorAll('.category-tab').forEach(tab => {
    if (tab !== taskTab) {
      tab.addEventListener('click', () => {
        taskContainer.style.display = 'none';
        addTaskForm.style.display = 'none';
        addTaskBtn.style.display = 'block';
      });
    }
  });
}); 