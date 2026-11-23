export const dashboardHtml = /* html */ `<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<title>السكرتير</title>
<style>
  :root {
    --bg: #0f172a;
    --surface: #1e293b;
    --surface-2: #273449;
    --text: #e2e8f0;
    --text-dim: #94a3b8;
    --accent: #38bdf8;
    --danger: #f87171;
    --ok: #4ade80;
    --warn: #fbbf24;
    --radius: 14px;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    background: var(--bg);
    color: var(--text);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Tahoma, Arial, sans-serif;
    padding-bottom: 76px;
  }
  header {
    padding: 18px 16px 10px;
    position: sticky;
    top: 0;
    background: var(--bg);
    z-index: 10;
    border-bottom: 1px solid #1f2b40;
  }
  header h1 { margin: 0; font-size: 20px; }
  header .date { color: var(--text-dim); font-size: 13px; margin-top: 2px; }

  main { padding: 14px 16px 24px; max-width: 640px; margin: 0 auto; }

  .cards { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 18px; }
  .card {
    background: var(--surface);
    border-radius: var(--radius);
    padding: 14px;
  }
  .card .n { font-size: 24px; font-weight: 700; }
  .card .l { font-size: 12px; color: var(--text-dim); margin-top: 2px; }

  .section-title { font-size: 15px; color: var(--text-dim); margin: 18px 0 8px; }

  .list { display: flex; flex-direction: column; gap: 8px; }
  .item {
    background: var(--surface);
    border-radius: var(--radius);
    padding: 12px 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
  }
  .item .main { flex: 1; min-width: 0; }
  .item .title { font-weight: 600; font-size: 14px; }
  .item .sub { font-size: 12px; color: var(--text-dim); margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .item .actions { display: flex; gap: 6px; flex-shrink: 0; }

  .badge { font-size: 11px; padding: 3px 8px; border-radius: 999px; white-space: nowrap; }
  .badge.low { background: #1e3a5f; color: #7dd3fc; }
  .badge.medium { background: #4a3a14; color: var(--warn); }
  .badge.high { background: #4a1a1a; color: var(--danger); }
  .badge.pending { background: #4a3a14; color: var(--warn); }
  .badge.done, .badge.delivered { background: #143a24; color: var(--ok); }
  .badge.confirmed, .badge.shipped { background: #1e3a5f; color: #7dd3fc; }
  .badge.cancelled { background: #3a1414; color: var(--danger); }

  button {
    font-family: inherit;
    border: none;
    cursor: pointer;
  }
  .btn-icon {
    background: var(--surface-2);
    color: var(--text);
    border-radius: 8px;
    width: 30px;
    height: 30px;
    font-size: 14px;
  }
  .fab {
    position: fixed;
    bottom: 86px;
    left: 18px;
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: var(--accent);
    color: #05283a;
    font-size: 26px;
    font-weight: 700;
    box-shadow: 0 6px 18px rgba(56,189,248,.35);
  }

  nav.tabs {
    position: fixed;
    bottom: 0;
    inset-inline: 0;
    background: var(--surface);
    border-top: 1px solid #1f2b40;
    display: flex;
    padding: 8px 6px calc(8px + env(safe-area-inset-bottom));
  }
  nav.tabs button {
    flex: 1;
    background: transparent;
    color: var(--text-dim);
    padding: 8px 2px;
    border-radius: 10px;
    font-size: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
  }
  nav.tabs button.active { color: var(--accent); background: var(--surface-2); }
  nav.tabs .icon { font-size: 18px; }

  dialog {
    border: none;
    border-radius: var(--radius);
    background: var(--surface);
    color: var(--text);
    padding: 18px;
    width: min(420px, 92vw);
  }
  dialog::backdrop { background: rgba(0,0,0,.55); }
  dialog h3 { margin: 0 0 12px; font-size: 16px; }
  .field { margin-bottom: 10px; }
  .field label { display: block; font-size: 12px; color: var(--text-dim); margin-bottom: 4px; }
  .field input, .field select, .field textarea {
    width: 100%;
    background: var(--surface-2);
    border: 1px solid #334155;
    color: var(--text);
    border-radius: 8px;
    padding: 9px 10px;
    font-size: 14px;
    font-family: inherit;
  }
  .field textarea { resize: vertical; min-height: 60px; }
  .dialog-actions { display: flex; gap: 8px; margin-top: 14px; }
  .btn {
    flex: 1;
    padding: 10px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 600;
  }
  .btn.primary { background: var(--accent); color: #05283a; }
  .btn.ghost { background: var(--surface-2); color: var(--text); }

  .empty { color: var(--text-dim); font-size: 13px; text-align: center; padding: 30px 10px; }

  #gate {
    position: fixed; inset: 0; background: var(--bg); z-index: 50;
    display: flex; align-items: center; justify-content: center; padding: 24px;
  }
  #gate .box { width: 100%; max-width: 320px; text-align: center; }
  #gate h2 { margin-bottom: 6px; }
  #gate p { color: var(--text-dim); font-size: 13px; margin-bottom: 16px; }
</style>
</head>
<body>

<div id="gate">
  <div class="box">
    <h2>🔐 السكرتير</h2>
    <p>أدخل رمز الدخول للمتابعة</p>
    <div class="field"><input id="gate-input" type="password" placeholder="رمز الدخول" /></div>
    <button class="btn primary" style="width:100%" onclick="saveToken()">دخول</button>
  </div>
</div>

<header>
  <h1 id="title">الرئيسية</h1>
  <div class="date" id="today-date"></div>
</header>

<main id="content"></main>

<button class="fab" id="fab" onclick="openCreateDialog()">+</button>

<nav class="tabs">
  <button data-tab="home" onclick="switchTab('home')"><span class="icon">🏠</span>الرئيسية</button>
  <button data-tab="tasks" onclick="switchTab('tasks')"><span class="icon">✅</span>المهام</button>
  <button data-tab="notes" onclick="switchTab('notes')"><span class="icon">📝</span>ملاحظات</button>
  <button data-tab="customers" onclick="switchTab('customers')"><span class="icon">👥</span>العملاء</button>
  <button data-tab="orders" onclick="switchTab('orders')"><span class="icon">📦</span>الطلبات</button>
</nav>

<dialog id="dialog">
  <form method="dialog" id="dialog-form"></form>
</dialog>

<script>
const TOKEN_KEY = 'app_token';
let currentTab = 'home';
let customersCache = [];

function getToken() { return localStorage.getItem(TOKEN_KEY); }

function saveToken() {
  const v = document.getElementById('gate-input').value.trim();
  if (!v) return;
  localStorage.setItem(TOKEN_KEY, v);
  document.getElementById('gate').style.display = 'none';
  boot();
}

async function api(path, options = {}) {
  const res = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + getToken(),
      ...(options.headers || {}),
    },
  });
  if (res.status === 401) {
    localStorage.removeItem(TOKEN_KEY);
    document.getElementById('gate').style.display = 'flex';
    throw new Error('unauthorized');
  }
  if (res.status === 204) return null;
  return res.json();
}

function fmtDate(d) {
  if (!d) return '';
  return d.slice(0, 10);
}

function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, (m) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[m]));
}

async function switchTab(tab) {
  currentTab = tab;
  document.querySelectorAll('nav.tabs button').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  const titles = { home: 'الرئيسية', tasks: 'المهام', notes: 'الملاحظات', customers: 'العملاء', orders: 'الطلبات' };
  document.getElementById('title').textContent = titles[tab];
  document.getElementById('fab').style.display = tab === 'home' ? 'none' : 'flex';
  await render();
}

async function render() {
  const el = document.getElementById('content');
  el.innerHTML = '<div class="empty">...جارٍ التحميل</div>';
  try {
    if (currentTab === 'home') return renderHome(el);
    if (currentTab === 'tasks') return renderTasks(el);
    if (currentTab === 'notes') return renderNotes(el);
    if (currentTab === 'customers') return renderCustomers(el);
    if (currentTab === 'orders') return renderOrders(el);
  } catch (e) {
    if (e.message !== 'unauthorized') el.innerHTML = '<div class="empty">حدث خطأ أثناء التحميل</div>';
  }
}

async function renderHome(el) {
  const s = await api('/api/summary');
  el.innerHTML = \`
    <div class="cards">
      <div class="card"><div class="n">\${s.due_today}</div><div class="l">مهام اليوم</div></div>
      <div class="card"><div class="n">\${s.overdue}</div><div class="l">متأخرة</div></div>
      <div class="card"><div class="n">\${s.pending_orders}</div><div class="l">طلبات قيد التنفيذ</div></div>
      <div class="card"><div class="n">\${s.customers}</div><div class="l">عدد العملاء</div></div>
    </div>
    <div class="section-title">مهام قادمة</div>
    <div class="list" id="home-tasks"></div>
  \`;
  const tasks = await api('/api/tasks?status=pending');
  const upcoming = tasks.slice(0, 5);
  document.getElementById('home-tasks').innerHTML = upcoming.length
    ? upcoming.map(taskItemHtml).join('')
    : '<div class="empty">لا توجد مهام معلّقة</div>';
}

function priorityLabel(p) { return { low: 'منخفضة', medium: 'متوسطة', high: 'عالية' }[p] || p; }
function orderStatusLabel(s) {
  return { pending: 'قيد الانتظار', confirmed: 'مؤكد', shipped: 'تم الشحن', delivered: 'تم التسليم', cancelled: 'ملغي' }[s] || s;
}

function taskItemHtml(t) {
  return \`
    <div class="item">
      <div class="main" onclick="toggleTask(\${t.id}, '\${t.status}')">
        <div class="title" style="\${t.status === 'done' ? 'text-decoration:line-through;color:var(--text-dim)' : ''}">\${escapeHtml(t.title)}</div>
        <div class="sub">\${t.due_date ? fmtDate(t.due_date) : 'بدون موعد'}</div>
      </div>
      <span class="badge \${t.priority}">\${priorityLabel(t.priority)}</span>
      <div class="actions">
        <button class="btn-icon" onclick="deleteItem('tasks', \${t.id})">🗑</button>
      </div>
    </div>
  \`;
}

async function toggleTask(id, status) {
  await api('/api/tasks/' + id, { method: 'PATCH', body: JSON.stringify({ status: status === 'done' ? 'pending' : 'done' }) });
  render();
}

async function renderTasks(el) {
  const tasks = await api('/api/tasks');
  el.innerHTML = tasks.length
    ? '<div class="list">' + tasks.map(taskItemHtml).join('') + '</div>'
    : '<div class="empty">لا توجد مهام بعد. اضغط + لإضافة واحدة</div>';
}

async function renderNotes(el) {
  const notes = await api('/api/notes');
  el.innerHTML = notes.length
    ? '<div class="list">' + notes.map(n => \`
      <div class="item">
        <div class="main">
          <div class="title">\${escapeHtml(n.title)}</div>
          <div class="sub">\${escapeHtml(n.content || '')}</div>
        </div>
        <div class="actions"><button class="btn-icon" onclick="deleteItem('notes', \${n.id})">🗑</button></div>
      </div>
    \`).join('') + '</div>'
    : '<div class="empty">لا توجد ملاحظات بعد</div>';
}

async function renderCustomers(el) {
  const customers = await api('/api/customers');
  customersCache = customers;
  el.innerHTML = customers.length
    ? '<div class="list">' + customers.map(c => \`
      <div class="item">
        <div class="main">
          <div class="title">\${escapeHtml(c.name)}</div>
          <div class="sub">\${escapeHtml(c.phone || c.email || '')}</div>
        </div>
        <div class="actions"><button class="btn-icon" onclick="deleteItem('customers', \${c.id})">🗑</button></div>
      </div>
    \`).join('') + '</div>'
    : '<div class="empty">لا يوجد عملاء بعد</div>';
}

async function renderOrders(el) {
  if (!customersCache.length) customersCache = await api('/api/customers');
  const orders = await api('/api/orders');
  el.innerHTML = orders.length
    ? '<div class="list">' + orders.map(o => \`
      <div class="item">
        <div class="main">
          <div class="title">\${escapeHtml(o.customer_name)} — \${o.total_amount}</div>
          <div class="sub">\${fmtDate(o.order_date)}</div>
        </div>
        <span class="badge \${o.status}">\${orderStatusLabel(o.status)}</span>
        <div class="actions"><button class="btn-icon" onclick="deleteItem('orders', \${o.id})">🗑</button></div>
      </div>
    \`).join('') + '</div>'
    : '<div class="empty">لا توجد طلبات بعد</div>';
}

async function deleteItem(resource, id) {
  if (!confirm('تأكيد الحذف؟')) return;
  await api('/api/' + resource + '/' + id, { method: 'DELETE' });
  render();
}

function openCreateDialog() {
  const dialog = document.getElementById('dialog');
  const form = document.getElementById('dialog-form');
  const builders = {
    tasks: () => \`
      <h3>مهمة جديدة</h3>
      <div class="field"><label>العنوان</label><input name="title" required /></div>
      <div class="field"><label>التفاصيل</label><textarea name="description"></textarea></div>
      <div class="field"><label>تاريخ الاستحقاق</label><input name="due_date" type="date" /></div>
      <div class="field"><label>الأولوية</label>
        <select name="priority"><option value="low">منخفضة</option><option value="medium" selected>متوسطة</option><option value="high">عالية</option></select>
      </div>
    \`,
    notes: () => \`
      <h3>ملاحظة جديدة</h3>
      <div class="field"><label>العنوان</label><input name="title" required /></div>
      <div class="field"><label>المحتوى</label><textarea name="content"></textarea></div>
    \`,
    customers: () => \`
      <h3>عميل جديد</h3>
      <div class="field"><label>الاسم</label><input name="name" required /></div>
      <div class="field"><label>الهاتف</label><input name="phone" /></div>
      <div class="field"><label>البريد الإلكتروني</label><input name="email" type="email" /></div>
      <div class="field"><label>العنوان</label><input name="address" /></div>
    \`,
    orders: () => \`
      <h3>طلب جديد</h3>
      <div class="field"><label>العميل</label>
        <select name="customer_id" required>\${customersCache.map(c => \`<option value="\${c.id}">\${escapeHtml(c.name)}</option>\`).join('')}</select>
      </div>
      <div class="field"><label>الوصف / الأصناف</label><textarea name="items_text" placeholder="مثال: 10 أنابيب اختبار، 2 مجهر"></textarea></div>
      <div class="field"><label>المبلغ الإجمالي</label><input name="total_amount" type="number" step="0.01" /></div>
      <div class="field"><label>تاريخ التسليم المتوقع</label><input name="delivery_date" type="date" /></div>
    \`,
  };
  if (currentTab === 'home' || !builders[currentTab]) return;
  form.innerHTML = builders[currentTab]() + \`
    <div class="dialog-actions">
      <button type="button" class="btn ghost" onclick="document.getElementById('dialog').close()">إلغاء</button>
      <button type="submit" class="btn primary">حفظ</button>
    </div>
  \`;
  form.onsubmit = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    if (currentTab === 'orders') {
      data.items = data.items_text ? [data.items_text] : [];
      delete data.items_text;
      data.total_amount = data.total_amount ? parseFloat(data.total_amount) : 0;
      data.customer_id = parseInt(data.customer_id, 10);
    }
    await api('/api/' + currentTab, { method: 'POST', body: JSON.stringify(data) });
    dialog.close();
    render();
  };
  dialog.showModal();
}

function boot() {
  document.getElementById('today-date').textContent = new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  switchTab('home');
}

if (getToken()) {
  document.getElementById('gate').style.display = 'none';
  boot();
}
</script>
</body>
</html>`;
