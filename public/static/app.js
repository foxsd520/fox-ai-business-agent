const API_BASE = "";
let currentSessionId = localStorage.getItem("sessionId") || generateSessionId();

function generateSessionId() {
  const id = "session_" + Date.now();
  localStorage.setItem("sessionId", id);
  return id;
}

function displayMessage(text, sender) {
  const box = document.getElementById("messagesBox");
  const msg = document.createElement("div");
  msg.className = `message ${sender}`;
  msg.innerHTML = `<div class="message-bubble">${escapeHtml(text)}</div>`;
  box.appendChild(msg);
  box.scrollTop = box.scrollHeight;
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

async function sendMessage() {
  const input = document.getElementById("userInput");
  const text = input.value.trim();

  if (!text) return;

  displayMessage(text, "user");
  input.value = "";
  input.focus();

  try {
    const response = await fetch(`${API_BASE}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, session_id: currentSessionId }),
    });

    if (!response.ok) throw new Error("Network error");
    const data = await response.json();
    displayMessage(data.response, "ai");
  } catch (error) {
    displayMessage("حدث خطأ في الاتصال. حاول مرة أخرى.", "ai");
    console.error(error);
  }
}

function switchTab(tabName) {
  document.querySelectorAll(".tab-content").forEach((el) => {
    el.classList.remove("active");
  });
  document.querySelectorAll(".nav-item").forEach((el) => {
    el.classList.remove("active");
  });

  document.getElementById(tabName).classList.add("active");
  event.target.classList.add("active");

  if (tabName === "history") loadHistory();
  if (tabName === "stats") loadStats();
}

async function loadHistory() {
  try {
    const response = await fetch(`${API_BASE}/history/${currentSessionId}`);
    const data = await response.json();
    const historyBox = document.getElementById("historyBox");
    historyBox.innerHTML = "";

    if (data.conversations.length === 0) {
      historyBox.innerHTML = "<p style='color: var(--text-muted)'>لا توجد محادثات بعد.</p>";
      return;
    }

    data.conversations.forEach((conv) => {
      const item = document.createElement("div");
      item.className = "history-item";
      item.innerHTML = `
        <div class="history-item-user">أنت: ${escapeHtml(conv.user_message.substring(0, 50))}...</div>
        <div class="history-item-time">${new Date(conv.created_at).toLocaleString("ar-SA")}</div>
      `;
      historyBox.appendChild(item);
    });
  } catch (error) {
    console.error(error);
  }
}

async function loadStats() {
  try {
    const response = await fetch(`${API_BASE}/stats`);
    const data = await response.json();
    document.getElementById("statConversations").textContent = data.stats.conversations;
    document.getElementById("statTraining").textContent = data.stats.training_data;
    document.getElementById("statUsers").textContent = data.stats.users;
  } catch (error) {
    console.error(error);
  }
}

document.getElementById("sendBtn").addEventListener("click", sendMessage);
document.getElementById("userInput").addEventListener("keypress", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

document.querySelectorAll(".nav-item").forEach((btn) => {
  btn.addEventListener("click", (e) => switchTab(e.target.dataset.tab));
});

document.getElementById("trainingForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const category = document.getElementById("trainCategory").value;
  const content = document.getElementById("trainContent").value;
  const keywords = document
    .getElementById("trainKeywords")
    .value.split(",")
    .map((k) => k.trim());

  try {
    const response = await fetch(`${API_BASE}/train`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, content, keywords }),
    });

    if (response.ok) {
      alert("تمت إضافة مادة التدريب بنجاح!");
      e.target.reset();
    }
  } catch (error) {
    alert("حدث خطأ أثناء الإضافة.");
    console.error(error);
  }
});

window.addEventListener("load", loadStats);
