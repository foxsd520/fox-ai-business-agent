<!DOCTYPE html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Fox AI | FoxSD</title>
    <style>
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: 'Tahoma', 'Segoe UI', sans-serif;
        background: linear-gradient(135deg, #0f172a, #111827 35%, #1f2937);
        color: #e5e7eb;
      }
      .app-shell {
        max-width: 1200px;
        margin: 0 auto;
        padding: 24px;
      }
      .topbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 16px;
        margin-bottom: 24px;
      }
      .eyebrow {
        margin: 0;
        color: #7dd3fc;
        font-size: 12px;
        letter-spacing: 1px;
      }
      h1, h2, h3, p { margin: 0; }
      .brand-box {
        background: rgba(255,255,255,0.05);
        border: 1px solid rgba(125,211,252,0.35);
        padding: 12px 16px;
        border-radius: 12px;
        text-align: left;
      }
      .brand-box span {
        display: block;
        font-weight: 700;
        color: #f8fafc;
      }
      .brand-box small {
        color: #cbd5e1;
      }
      .dashboard { display: grid; gap: 24px; }
      .summary-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(150px, 1fr));
        gap: 16px;
      }
      .stat-card, .list-card, .form-card, .assistant-card {
        background: rgba(15, 23, 42, 0.75);
        border: 1px solid rgba(148,163,184,0.2);
        border-radius: 16px;
        padding: 20px;
        box-shadow: 0 10px 30px rgba(15, 23, 42, 0.2);
      }
      .stat-card label {
        display: block;
        color: #cbd5e1;
        margin-bottom: 8px;
      }
      .stat-card strong {
        font-size: 2rem;
        color: #f8fafc;
      }
      .stat-card.accent { border-color: rgba(96, 165, 250, 0.8); }
      .controls, .lists-grid {
        display: grid;
        grid-template-columns: 1.2fr 0.8fr;
        gap: 16px;
      }
      .voice-panel, .forms-panel {
        display: grid;
        gap: 16px;
      }
      textarea, input, button {
        width: 100%;
        border-radius: 12px;
        border: 1px solid rgba(148,163,184,0.25);
        background: rgba(15,23,42,0.8);
        color: #f8fafc;
        padding: 12px 14px;
        font: inherit;
      }
      textarea {
        min-height: 120px;
        resize: vertical;
      }
      button {
        cursor: pointer;
        transition: 0.2s ease;
      }
      .primary-btn {
        background: linear-gradient(135deg, #0ea5e9, #2563eb);
        border: none;
      }
      .secondary-btn {
        background: rgba(148,163,184,0.15);
      }
      .action-row {
        display: flex;
        gap: 10px;
        margin-top: 12px;
      }
      .status-box {
        margin-top: 12px;
        color: #bae6fd;
        min-height: 24px;
      }
      .form-card form {
        display: grid;
        gap: 10px;
        margin-top: 10px;
      }
      .lists-grid {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }
      .wide { grid-column: span 1; }
      ul {
        list-style: none;
        padding: 0;
        margin: 16px 0 0;
        display: grid;
        gap: 10px;
      }
      li {
        background: rgba(30,41,59,0.7);
        border: 1px solid rgba(148,163,184,0.15);
        border-radius: 12px;
        padding: 12px;
      }
      li strong, li small { display: block; }
      li small { color: #cbd5e1; }
      .assistant-card {
        display: grid;
        gap: 12px;
      }
      .assistant-meta {
        display: grid;
        gap: 8px;
        padding: 12px;
        background: rgba(30,41,59,0.7);
        border-radius: 12px;
      }
      .assistant-output {
        min-height: 120px;
        background: rgba(15,23,42,0.8);
        border-radius: 12px;
        border: 1px solid rgba(148,163,184,0.2);
        padding: 14px;
        line-height: 1.8;
        color: #e2e8f0;
      }
      @media (max-width: 900px) {
        .summary-grid, .controls, .lists-grid { grid-template-columns: 1fr; }
        .topbar { flex-direction: column; align-items: flex-start; }
      }
    </style>
  </head>
  <body>
    <div class="app-shell">
      <header class="topbar">
        <div>
          <p class="eyebrow">وكيل ذكاء تجاري</p>
          <h1>Fox AI</h1>
        </div>
        <div class="brand-box">
          <span id="profileName">FoxSD</span>
          <small id="profileEmail">foxsd520@gmail.com</small>
        </div>
      </header>

      <main class="dashboard">
        <section class="summary-grid">
          <article class="stat-card accent">
            <label>العملاء</label>
            <strong id="clientsCount">0</strong>
          </article>
          <article class="stat-card">
            <label>المشاريع</label>
            <strong id="projectsCount">0</strong>
          </article>
          <article class="stat-card">
            <label>المهام</label>
            <strong id="tasksCount">0</strong>
          </article>
          <article class="stat-card">
            <label>المحادثات</label>
            <strong id="conversationsCount">0</strong>
          </article>
        </section>

        <section class="controls">
          <div class="voice-panel">
            <div class="assistant-card">
              <h2>ذكاء Fox الشخصي</h2>
              <div class="assistant-meta">
                <strong id="profileTitle">مطور وتقني ومهندس حلول</strong>
                <small id="profileSummary">أنا Fox...</small>
              </div>
              <textarea id="assistantInput" placeholder="اكتب سؤالاً عن البرمجة، الأمن، الموقع، أو مشروعك..."></textarea>
              <div class="action-row">
                <button id="assistantBtn" class="primary-btn">اسأل Fox</button>
              </div>
              <div id="assistantOutput" class="assistant-output">جاهز لمساعدتك.</div>
            </div>

            <div class="voice-panel">
              <h2>أمر صوتي</h2>
              <textarea id="voiceInput" placeholder="اكتب أو تحدث: أريد مشروع موقع، نظام إدارة، أو عميل جديد..."></textarea>
              <div class="action-row">
                <button id="voiceButton" class="primary-btn">🎙️ تفعيل الميكروفون</button>
                <button id="submitVoiceBtn" class="secondary-btn">إرسال الأمر</button>
              </div>
              <div id="voiceStatus" class="status-box">جاهز للاستقبال.</div>
            </div>
          </div>

          <div class="forms-panel">
            <div class="form-card">
              <h3>إضافة عميل</h3>
              <form id="clientForm">
                <input name="name" placeholder="اسم العميل" required />
                <input name="email" type="email" placeholder="البريد الإلكتروني" />
                <input name="phone" placeholder="رقم الهاتف" />
                <textarea name="notes" placeholder="ملاحظات"></textarea>
                <button type="submit">حفظ العميل</button>
              </form>
            </div>

            <div class="form-card">
              <h3>إضافة مشروع</h3>
              <form id="projectForm">
                <input name="title" placeholder="عنوان المشروع" required />
                <input name="type" placeholder="نوع المشروع (موقع/تطبيق/نظام)" />
                <input name="budget" type="number" placeholder="ميزانية المشروع" />
                <textarea name="notes" placeholder="تفاصيل المشروع"></textarea>
                <button type="submit">حفظ المشروع</button>
              </form>
            </div>
          </div>
        </section>

        <section class="lists-grid">
          <article class="list-card">
            <h2>العملاء</h2>
            <ul id="clientsList"></ul>
          </article>

          <article class="list-card">
            <h2>المشاريع</h2>
            <ul id="projectsList"></ul>
          </article>

          <article class="list-card wide">
            <h2>المهام</h2>
            <ul id="tasksList"></ul>
          </article>
        </section>
      </main>
    </div>

    <script src="/app.js"></script>
  </body>
</html>
