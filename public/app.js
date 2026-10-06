async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'حدث خطأ غير متوقع.' }));
    throw new Error(error.error || 'حدث خطأ غير متوقع.');
  }

  return response.json();
}

const elements = {
  clientsCount: document.querySelector('#clientsCount'),
  projectsCount: document.querySelector('#projectsCount'),
  tasksCount: document.querySelector('#tasksCount'),
  conversationsCount: document.querySelector('#conversationsCount'),
  clientsList: document.querySelector('#clientsList'),
  projectsList: document.querySelector('#projectsList'),
  tasksList: document.querySelector('#tasksList'),
  voiceInput: document.querySelector('#voiceInput'),
  voiceButton: document.querySelector('#voiceButton'),
  submitVoiceBtn: document.querySelector('#submitVoiceBtn'),
  voiceStatus: document.querySelector('#voiceStatus'),
  clientForm: document.querySelector('#clientForm'),
  projectForm: document.querySelector('#projectForm'),
};

async function loadSummary() {
  const result = await fetchJson('/api/summary');
  const { clients, projects, tasks, conversations } = result.stats;
  elements.clientsCount.textContent = clients;
  elements.projectsCount.textContent = projects;
  elements.tasksCount.textContent = tasks;
  elements.conversationsCount.textContent = conversations;
}

function renderClients(items) {
  elements.clientsList.innerHTML = items.length
    ? items.map(client => `
      <li>
        <strong>${client.name}</strong>
        <small>${client.email || 'بدون بريد'} • ${client.phone || 'بدون هاتف'}</small>
      </li>
    `).join('')
    : '<li><small>لا توجد بيانات بعد.</small></li>';
}

function renderProjects(items) {
  elements.projectsList.innerHTML = items.length
    ? items.map(project => `
      <li>
        <strong>${project.title}</strong>
        <small>${project.client_name || 'عميل غير محدد'} • ${project.type || 'website'} • ${project.budget || 0} ر.س</small>
      </li>
    `).join('')
    : '<li><small>لا توجد مشاريع بعد.</small></li>';
}

function renderTasks(items) {
  elements.tasksList.innerHTML = items.length
    ? items.map(task => `
      <li>
        <strong>${task.title}</strong>
        <small>${task.status || 'pending'} • ${task.notes || 'بدون تفاصيل'}</small>
      </li>
    `).join('')
    : '<li><small>لا توجد مهام بعد.</small></li>';
}

async function loadAllData() {
  try {
    const [clients, projects, tasks] = await Promise.all([
      fetchJson('/api/clients'),
      fetchJson('/api/projects'),
      fetchJson('/api/tasks'),
    ]);

    renderClients(clients);
    renderProjects(projects);
    renderTasks(tasks);
  } catch (error) {
    console.error(error);
  }
}

async function handleClientSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const payload = Object.fromEntries(formData.entries());

  await fetchJson('/api/clients', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  elements.clientForm.reset();
  await loadSummary();
  await loadAllData();
}

async function handleProjectSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const payload = Object.fromEntries(formData.entries());

  await fetchJson('/api/projects', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  elements.projectForm.reset();
  await loadSummary();
  await loadAllData();
}

async function handleVoiceSubmit() {
  const text = elements.voiceInput.value.trim();
  if (!text) {
    elements.voiceStatus.textContent = 'يرجى كتابة نص أو استخدام الميكروفون.';
    return;
  }

  elements.voiceStatus.textContent = 'جاري معالجة الأمر...';
  const result = await fetchJson('/api/voice', {
    method: 'POST',
    body: JSON.stringify({ text }),
  });

  elements.voiceStatus.textContent = result.reply;
  elements.voiceInput.value = '';
  await loadSummary();
  await loadAllData();
}

function attachVoiceRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    elements.voiceStatus.textContent = 'ميزة الصوت غير مدعومة في هذا المتصفح.';
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'ar-SA';

  elements.voiceButton.addEventListener('click', () => {
    recognition.start();
    elements.voiceStatus.textContent = 'جاري الاستماع...';
  });

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    elements.voiceInput.value = transcript;
    elements.voiceStatus.textContent = `تم الاستماع: ${transcript}`;
  };

  recognition.onerror = () => {
    elements.voiceStatus.textContent = 'حدثت مشكلة أثناء الاستماع، جرّب كتابة الأمر.';
  };
}

elements.clientForm.addEventListener('submit', handleClientSubmit);
elements.projectForm.addEventListener('submit', handleProjectSubmit);
elements.submitVoiceBtn.addEventListener('click', handleVoiceSubmit);
attachVoiceRecognition();

(async function init() {
  await loadSummary();
  await loadAllData();
})();
