const express = require('express');
const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

const app = express();
const PORT = process.env.PORT || 3000;
const dbDir = path.join(__dirname, 'data');
const dbPath = path.join(dbDir, 'foxdb.sqlite');

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

function initDatabase() {
  const schemaSql = fs.readFileSync(path.join(__dirname, 'data', 'schema.sql'), 'utf8');
  db.exec(schemaSql);

  const seedSql = fs.readFileSync(path.join(__dirname, 'data', 'seed.sql'), 'utf8');
  if (seedSql && seedSql.trim()) {
    db.exec(seedSql);
  }
}

initDatabase();

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

function parseRequestIntent(rawText) {
  const text = (rawText || '').trim();
  if (!text) return { action: 'note' };

  const lower = text.toLowerCase();
  if (lower.includes('عقد') || lower.includes('project') || lower.includes('مشروع')) {
    return { action: 'project', summary: text };
  }

  if (lower.includes('عميل') || lower.includes('client') || lower.includes('زبون')) {
    return { action: 'client', summary: text };
  }

  if (lower.includes('مهمة') || lower.includes('task') || lower.includes('عمل')) {
    return { action: 'task', summary: text };
  }

  return { action: 'note', summary: text };
}

app.get('/api/summary', (req, res) => {
  const stats = {
    clients: db.prepare('SELECT COUNT(*) as count FROM clients').get(),
    projects: db.prepare('SELECT COUNT(*) as count FROM projects').get(),
    tasks: db.prepare('SELECT COUNT(*) as count FROM tasks').get(),
    conversations: db.prepare('SELECT COUNT(*) as count FROM conversations').get(),
  };

  res.json({
    brand: 'FoxSD',
    agent: 'Fox AI',
    stats: {
      clients: stats.clients.count,
      projects: stats.projects.count,
      tasks: stats.tasks.count,
      conversations: stats.conversations.count,
    },
  });
});

app.get('/api/clients', (req, res) => {
  const rows = db.prepare('SELECT * FROM clients ORDER BY created_at DESC').all();
  res.json(rows);
});

app.get('/api/projects', (req, res) => {
  const rows = db.prepare(`
    SELECT p.*, c.name AS client_name
    FROM projects p
    LEFT JOIN clients c ON c.id = p.client_id
    ORDER BY p.created_at DESC
  `).all();
  res.json(rows);
});

app.get('/api/tasks', (req, res) => {
  const rows = db.prepare('SELECT * FROM tasks ORDER BY created_at DESC').all();
  res.json(rows);
});

app.get('/api/conversations', (req, res) => {
  const rows = db.prepare('SELECT * FROM conversations ORDER BY created_at DESC').all();
  res.json(rows);
});

app.post('/api/clients', (req, res) => {
  const { name, email, phone, notes } = req.body;
  if (!name) return res.status(400).json({ error: 'اسم العميل مطلوب.' });

  const stmt = db.prepare(`
    INSERT INTO clients (name, email, phone, notes)
    VALUES (?, ?, ?, ?)
  `);

  const result = stmt.run(name, email || '', phone || '', notes || '');
  res.status(201).json({ id: result.lastInsertRowid, name, email, phone, notes });
});

app.post('/api/projects', (req, res) => {
  const { title, client_id, type, budget, notes } = req.body;
  if (!title) return res.status(400).json({ error: 'عنوان المشروع مطلوب.' });

  const stmt = db.prepare(`
    INSERT INTO projects (title, client_id, type, budget, notes)
    VALUES (?, ?, ?, ?, ?)
  `);

  const result = stmt.run(title, client_id || null, type || 'website', budget || 0, notes || '');
  res.status(201).json({ id: result.lastInsertRowid, title, client_id, type, budget, notes });
});

app.post('/api/tasks', (req, res) => {
  const { title, project_id, status, notes } = req.body;
  if (!title) return res.status(400).json({ error: 'عنوان المهمة مطلوب.' });

  const stmt = db.prepare(`
    INSERT INTO tasks (title, project_id, status, notes)
    VALUES (?, ?, ?, ?)
  `);

  const result = stmt.run(title, project_id || null, status || 'pending', notes || '');
  res.status(201).json({ id: result.lastInsertRowid, title, project_id, status, notes });
});

app.post('/api/voice', (req, res) => {
  const { text } = req.body;
  const parsed = parseRequestIntent(text);

  const stmt = db.prepare(`
    INSERT INTO conversations (speaker, message, intent, metadata)
    VALUES (?, ?, ?, ?)
  `);

  stmt.run('user', text || '', parsed.action, JSON.stringify(parsed));

  const reply = `تم استلام طلبك بنجاح. سأعمل على ${parsed.action === 'project' ? 'تحديد مشروع' : parsed.action === 'client' ? 'إدارة عميل' : parsed.action === 'task' ? 'تنظيم مهمة' : 'تسجيل ملاحظاتك'} بناءً على بيانات FoxSD.`;

  const responseStmt = db.prepare(`
    INSERT INTO conversations (speaker, message, intent, metadata)
    VALUES (?, ?, ?, ?)
  `);

  responseStmt.run('assistant', reply, parsed.action, JSON.stringify({ source: 'voice', action: parsed.action }));

  res.json({
    ok: true,
    intent: parsed.action,
    summary: parsed.summary,
    reply,
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Fox AI Business Agent running on http://localhost:${PORT}`);
});
