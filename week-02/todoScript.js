(function(){
  "use strict";
  var STORAGE_KEY = "ledger_tasks_v1";
  var state = { tasks: [], view: "active", editingId: null, deleteId: null };

  // ---------- persistence ----------
  function loadTasks(){
    try{
      var raw = localStorage.getItem(STORAGE_KEY);
      state.tasks = raw ? JSON.parse(raw) : [];
    }catch(e){ state.tasks = []; }
  }
  function saveTasks(){
    try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(state.tasks)); }
    catch(e){ showToast("Couldn't save — storage unavailable"); }
  }

  // ---------- helpers ----------
  function uid(){ return 't' + Date.now().toString(36) + Math.random().toString(36).slice(2,8); }
  function nowIso(){ return new Date().toISOString(); }

  function formatDateTime(iso){
    if(!iso) return "";
    var d = new Date(iso);
    if(isNaN(d)) return "";
    var opts = { day:'numeric', month:'short', year:'numeric', hour:'numeric', minute:'2-digit' };
    return d.toLocaleString(undefined, opts);
  }
  function formatDate(iso){
    if(!iso) return "";
    var d = new Date(iso);
    if(isNaN(d)) return "";
    return d.toLocaleDateString(undefined, { day:'numeric', month:'short', year:'numeric' });
  }
  function isOverdue(task){
    return task.status === 'active' && task.deadline && new Date(task.deadline).getTime() < Date.now();
  }
  function reminderLabel(t){
    var map = { '15m':'15 min before', '30m':'30 min before', '1h':'1 hr before', '2h':'2 hrs before', '1d':'1 day before' };
    return map[t] || t;
  }

  function showToast(msg){
    var el = document.getElementById('toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(function(){ el.classList.remove('show'); }, 2200);
  }

  // ---------- CRUD ----------
  function addTask(data){
    var task = {
      id: uid(),
      title: data.title,
      status: "active",
      createdAt: nowIso(),
      completedAt: null,
      deadline: data.deadline || null,
      reminder: data.reminder || { enabled:false, timing:null, email:"", whatsapp:"" }
    };
    state.tasks.unshift(task);
    saveTasks();
    showToast("Task added successfully");
  }
  function updateTask(id, data){
    var t = state.tasks.find(function(x){ return x.id === id; });
    if(!t) return;
    t.title = data.title;
    t.deadline = data.deadline || null;
    t.reminder = data.reminder || { enabled:false, timing:null, email:"", whatsapp:"" };
    saveTasks();
    showToast("Task updated successfully");
  }
  function completeTask(id){
    var t = state.tasks.find(function(x){ return x.id === id; });
    if(!t) return;
    t.status = "completed";
    t.completedAt = nowIso();
    saveTasks(); renderAll();
    showToast("Task completed");
  }
  function restoreToActive(id){
    var t = state.tasks.find(function(x){ return x.id === id; });
    if(!t) return;
    t.status = "active";
    t.completedAt = null;
    saveTasks(); renderAll();
    showToast("Task moved to Active");
  }
  function archiveTask(id){
    var t = state.tasks.find(function(x){ return x.id === id; });
    if(!t) return;
    t.status = "archived";
    saveTasks(); renderAll();
    showToast("Task archived");
  }
  function restoreArchived(id){
    var t = state.tasks.find(function(x){ return x.id === id; });
    if(!t) return;
    t.status = "active";
    saveTasks(); renderAll();
    showToast("Task restored");
  }
  function deleteTask(id){
    state.tasks = state.tasks.filter(function(x){ return x.id !== id; });
    saveTasks(); renderAll();
    showToast("Task deleted");
  }

  // ---------- rendering ----------
  function renderAll(){
    ['active','completed','archived'].forEach(function(s){
      document.getElementById('cnt-'+s).textContent = state.tasks.filter(function(t){return t.status===s;}).length;
    });
    renderTasks();
  }

  function renderTasks(){
    renderView(state.view);
  }
  function renderActiveTasks(){ renderView('active'); }
  function renderCompletedTasks(){ renderView('completed'); }
  function renderArchivedTasks(){ renderView('archived'); }

  function renderView(view){
    var list = document.getElementById('list');
    var items = state.tasks.filter(function(t){ return t.status === view; });
    if(view === 'active'){
      items.sort(function(a,b){
        if(!!a.deadline !== !!b.deadline) return a.deadline ? -1 : 1;
        if(a.deadline && b.deadline) return new Date(a.deadline)-new Date(b.deadline);
        return new Date(b.createdAt)-new Date(a.createdAt);
      });
    } else {
      items.sort(function(a,b){ return new Date(b.createdAt)-new Date(a.createdAt); });
    }

    if(items.length === 0){
      var msgs = {
        active: ["No active tasks","You're all caught up!"],
        completed: ["No completed tasks yet",""],
        archived: ["No archived tasks",""]
      };
      var m = msgs[view];
      list.innerHTML = '<div class="empty"><div class="big">'+esc(m[0])+'</div>' + (m[1] ? '<div class="small">'+esc(m[1])+'</div>' : '') + '</div>';
      return;
    }

    list.innerHTML = items.map(function(t){ return cardHtml(t, view); }).join('');
    // wire actions
    list.querySelectorAll('[data-action]').forEach(function(btn){
      btn.addEventListener('click', function(){
        var id = btn.getAttribute('data-id');
        var action = btn.getAttribute('data-action');
        if(action === 'complete') completeTask(id);
        else if(action === 'toActive') restoreToActive(id);
        else if(action === 'archive') archiveTask(id);
        else if(action === 'restore') restoreArchived(id);
        else if(action === 'edit') openTaskForm(id);
        else if(action === 'delete') openDeleteConfirm(id);
      });
    });
  }

  function esc(s){
    return String(s == null ? "" : s).replace(/[&<>"']/g, function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }

  function cardHtml(t, view){
    var overdue = isOverdue(t);
    var badges = "";
    if(view === 'active' && t.deadline){
      badges += overdue
        ? '<span class="badge overdue">Overdue</span>'
        : '<span class="badge upcoming">Due '+esc(formatDateTime(t.deadline))+'</span>';
      if(t.reminder && t.reminder.enabled){
        badges += '<span class="badge reminder">Reminder '+esc(reminderLabel(t.reminder.timing))+'</span>';
      }
    }
    var meta = '<span>Created '+esc(formatDateTime(t.createdAt))+'</span>';
    if(view === 'completed') meta += '<span>Completed '+esc(formatDateTime(t.completedAt))+'</span>';
    if(view === 'archived' && t.deadline) meta += '<span>Deadline was '+esc(formatDateTime(t.deadline))+'</span>';

    var actions = "";
    if(view === 'active'){
      actions = '<button class="btn-text" data-action="edit" data-id="'+t.id+'" aria-label="Edit task">Edit</button>'
        + '<button class="btn-text" data-action="archive" data-id="'+t.id+'" aria-label="Archive task">Archive</button>'
        + '<button class="btn-text btn-danger-text" data-action="delete" data-id="'+t.id+'" aria-label="Delete task">Delete</button>';
    } else if(view === 'completed'){
      actions = '<button class="btn-text" data-action="toActive" data-id="'+t.id+'">Move to Active</button>'
        + '<button class="btn-text btn-danger-text" data-action="delete" data-id="'+t.id+'">Delete</button>';
    } else {
      actions = '<button class="btn-text" data-action="restore" data-id="'+t.id+'">Restore</button>'
        + '<button class="btn-text btn-danger-text" data-action="delete" data-id="'+t.id+'">Delete</button>';
    }

    var checkbox = view === 'active'
      ? '<input type="checkbox" class="chk" data-action="complete" data-id="'+t.id+'" onclick="window.__completeClick(this)" aria-label="Mark complete">'
      : (view === 'completed' ? '<input type="checkbox" class="chk" checked disabled aria-label="Completed">' : '<span style="width:19px;display:inline-block;"></span>');

    return '<div class="card'+(view==='completed'?' completed':'')+'">'
      + checkbox
      + '<div class="card-body">'
      + '<div class="title">'+esc(t.title)+'</div>'
      + (badges ? '<div class="meta">'+badges+'</div>' : '')
      + '<div class="meta">'+meta+'</div>'
      + '</div>'
      + '<div class="card-actions">'+actions+'</div>'
      + '</div>';
  }
  window.__completeClick = function(el){
    completeTask(el.getAttribute('data-id'));
  };

  // ---------- tabs ----------
  document.querySelectorAll('.tab').forEach(function(tab){
    tab.addEventListener('click', function(){
      document.querySelectorAll('.tab').forEach(function(x){ x.classList.remove('active'); x.setAttribute('aria-selected','false'); });
      tab.classList.add('active'); tab.setAttribute('aria-selected','true');
      state.view = tab.getAttribute('data-view');
      renderTasks();
    });
  });

  // ---------- form (add/edit) ----------
  var formOverlay = document.getElementById('formOverlay');
  var taskForm = document.getElementById('taskForm');

  function openTaskForm(id){
    state.editingId = id || null;
    taskForm.reset();
    document.getElementById('emailField').style.display = 'none';
    document.getElementById('waField').style.display = 'none';
    document.getElementById('remindSub').classList.remove('show');
    hideErr('err-title'); hideErr('err-deadline'); hideErr('err-remind');

    if(id){
      var t = state.tasks.find(function(x){ return x.id === id; });
      document.getElementById('formTitle').textContent = 'Edit task';
      document.getElementById('formSubmit').textContent = 'Save changes';
      document.getElementById('f-title').value = t.title;
      if(t.deadline){
        var d = new Date(t.deadline);
        document.getElementById('f-date').value = toDateInput(d);
        document.getElementById('f-time').value = toTimeInput(d);
      }
      if(t.reminder && t.reminder.enabled){
        document.getElementById('f-remind').checked = true;
        document.getElementById('remindSub').classList.add('show');
        document.getElementById('f-timing').value = t.reminder.timing || '1h';
        if(t.reminder.email){
          document.getElementById('f-method-email').checked = true;
          document.getElementById('emailField').style.display = 'block';
          document.getElementById('f-email').value = t.reminder.email;
        }
        if(t.reminder.whatsapp){
          document.getElementById('f-method-whatsapp').checked = true;
          document.getElementById('waField').style.display = 'block';
          document.getElementById('f-whatsapp').value = t.reminder.whatsapp;
        }
      }
    } else {
      document.getElementById('formTitle').textContent = 'Add task';
      document.getElementById('formSubmit').textContent = 'Add task';
    }
    formOverlay.classList.add('show');
    document.getElementById('f-title').focus();
  }
  function closeTaskForm(){ formOverlay.classList.remove('show'); state.editingId = null; }
  function toDateInput(d){ return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate()); }
  function toTimeInput(d){ return pad(d.getHours())+':'+pad(d.getMinutes()); }
  function pad(n){ return (n<10?'0':'')+n; }

  document.getElementById('quickAddBtn').addEventListener('click', function(){
    var v = document.getElementById('quickTitle').value.trim();
    if(!v){ document.getElementById('quickTitle').focus(); return; }
    addTask({ title:v, deadline:null, reminder:{enabled:false,timing:null,email:"",whatsapp:""} });
    document.getElementById('quickTitle').value = '';
    if(state.view !== 'active'){
      document.querySelector('.tab[data-view="active"]').click();
    } else { renderAll(); }
  });
  document.getElementById('quickTitle').addEventListener('keydown', function(e){
    if(e.key === 'Enter'){ e.preventDefault(); document.getElementById('quickAddBtn').click(); }
  });

  document.querySelectorAll('.wrap').forEach(function(){}); // no-op placeholder to keep structure
  document.querySelector('.addbar').insertAdjacentHTML('afterend', '');

  // open full form via a dedicated affordance too (title bar "+ Add New Task" behavior folded into quick add;
  // full form opens automatically when deadline/reminder needed via Edit, or by clicking title text)
  document.getElementById('formCancel').addEventListener('click', closeTaskForm);
  formOverlay.addEventListener('click', function(e){ if(e.target === formOverlay) closeTaskForm(); });

  document.getElementById('f-remind').addEventListener('change', function(){
    document.getElementById('remindSub').classList.toggle('show', this.checked);
    hideErr('err-remind');
  });
  document.getElementById('f-method-email').addEventListener('change', function(){
    document.getElementById('emailField').style.display = this.checked ? 'block' : 'none';
  });
  document.getElementById('f-method-whatsapp').addEventListener('change', function(){
    document.getElementById('waField').style.display = this.checked ? 'block' : 'none';
  });

  function showErr(id){ document.getElementById(id).style.display = 'block'; }
  function hideErr(id){ document.getElementById(id).style.display = 'none'; }

  function validateTaskForm(){
    var ok = true;
    var title = document.getElementById('f-title').value.trim();
    hideErr('err-title'); hideErr('err-deadline'); hideErr('err-remind');

    if(!title){ showErr('err-title'); ok = false; }

    var dateVal = document.getElementById('f-date').value;
    var timeVal = document.getElementById('f-time').value;
    var hasDate = !!dateVal, hasTime = !!timeVal;
    if(hasDate !== hasTime && (hasDate || hasTime)){
      // allow date without time (defaults later) but require date if time given
      if(hasTime && !hasDate){ showErr('err-deadline'); ok = false; }
    }
    if(hasDate){
      var iso = dateVal + 'T' + (timeVal || '23:59') + ':00';
      if(isNaN(new Date(iso).getTime())){ showErr('err-deadline'); ok = false; }
    }

    var remindOn = document.getElementById('f-remind').checked;
    if(remindOn && !hasDate){ showErr('err-remind'); ok = false; }

    return ok;
  }

  taskForm.addEventListener('submit', function(e){
    e.preventDefault();
    if(!validateTaskForm()) return;

    var title = document.getElementById('f-title').value.trim();
    var dateVal = document.getElementById('f-date').value;
    var timeVal = document.getElementById('f-time').value || '23:59';
    var deadline = dateVal ? (dateVal + 'T' + timeVal + ':00') : null;

    var remindOn = document.getElementById('f-remind').checked;
    var reminder = {
      enabled: remindOn,
      timing: remindOn ? document.getElementById('f-timing').value : null,
      email: remindOn && document.getElementById('f-method-email').checked ? document.getElementById('f-email').value.trim() : "",
      whatsapp: remindOn && document.getElementById('f-method-whatsapp').checked ? document.getElementById('f-whatsapp').value.trim() : ""
    };

    var data = { title:title, deadline:deadline, reminder:reminder };
    if(state.editingId){ updateTask(state.editingId, data); }
    else { addTask(data); }

    closeTaskForm();
    renderAll();
  });

  // ---------- delete confirm ----------
  var deleteOverlay = document.getElementById('deleteOverlay');
  function openDeleteConfirm(id){ state.deleteId = id; deleteOverlay.classList.add('show'); }
  function closeDeleteConfirm(){ deleteOverlay.classList.remove('show'); state.deleteId = null; }
  document.getElementById('delCancel').addEventListener('click', closeDeleteConfirm);
  deleteOverlay.addEventListener('click', function(e){ if(e.target === deleteOverlay) closeDeleteConfirm(); });
  document.getElementById('delConfirm').addEventListener('click', function(){
    if(state.deleteId) deleteTask(state.deleteId);
    closeDeleteConfirm();
  });

  // full "add task" affordance with deadline/reminder: click app title area's Add button opens quick add;
  // provide an explicit "Add New Task" full-form trigger under the addbar via long form
  var addFullBtn = document.createElement('button');
  addFullBtn.type = 'button'; addFullBtn.className = 'btn btn-ghost';
  addFullBtn.textContent = '+ Deadline / reminder';
  addFullBtn.style.marginTop = '-10px';
  addFullBtn.addEventListener('click', function(){ openTaskForm(null); });
  document.querySelector('.addbar').insertAdjacentElement('afterend', addFullBtn);

  // refresh overdue badges periodically
  setInterval(function(){ if(state.view === 'active') renderTasks(); }, 60000);

  // ---------- init ----------
  loadTasks();
  renderAll();
})();