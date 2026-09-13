const navbar = document.getElementById("navbar");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const themeToggle = document.getElementById("themeToggle");

window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 10);
});

menuToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", open);
});

document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => navLinks.classList.remove("open"));
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("portfolio-theme", document.body.classList.contains("dark") ? "dark" : "light");
});

if (localStorage.getItem("portfolio-theme") === "dark") {
  document.body.classList.add("dark");
}

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

/* -----------------------------
   AI CHATBOT
   Portfolio answers + general questions through Groq
------------------------------ */
const chatLauncher = document.getElementById("chatLauncher");
const chatbot = document.getElementById("chatbot");
const chatClose = document.getElementById("chatClose");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const chatMessages = document.getElementById("chatMessages");

const conversation = [];

chatLauncher.addEventListener("click", () => {
  chatbot.classList.toggle("open");
  if (chatbot.classList.contains("open")) chatInput.focus();
});

chatClose.addEventListener("click", () => chatbot.classList.remove("open"));

function addMessage(text, type) {
  const wrap = document.createElement("div");
  wrap.className = `message ${type}`;
  wrap.innerHTML = `<span class="message-label">${type === "bot" ? "ASSISTANT" : "YOU"}</span><p></p>`;
  wrap.querySelector("p").textContent = text;
  chatMessages.appendChild(wrap);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addTyping() {
  const typing = document.createElement("div");
  typing.className = "message bot typing";
  typing.innerHTML = `<span class="message-label">ASSISTANT</span><p>Thinking...</p>`;
  chatMessages.appendChild(typing);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return typing;
}

async function askAI(text) {
  const typing = addTyping();

  conversation.push({ role: "user", content: text });

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: conversation })
    });

    const data = await response.json();
    typing.remove();

    if (!response.ok) {
      throw new Error(data.error || "Unable to contact the AI.");
    }

    conversation.push({ role: "assistant", content: data.reply });
    addMessage(data.reply, "bot");
  } catch (error) {
    typing.remove();

    // Keep the portfolio-specific preview working if Groq has not been configured.
    const fallback = getPortfolioFallback(text);
    if (fallback) {
      conversation.pop();
      addMessage(fallback, "bot");
    } else {
      conversation.pop();
      addMessage("I can answer general questions when Groq is connected. For now, please add your GROQ_API_KEY to the .env file, then restart the server.", "bot");
      console.error(error);
    }
  }
}

function getPortfolioFallback(text) {
  const normalized = text.toLowerCase();

  if (["experience", "work", "ojt", "intern", "job", "support"].some(k => normalized.includes(k))) {
    return "Jessica is an IT Support Intern / On-the-Job Trainee. Her work includes technical support and troubleshooting, checking and maintaining computer equipment, managing borrowed IT devices, assisting with equipment pickup and delivery, and supporting daily IT operations.";
  }
  if (["skill", "technical", "office", "excel", "word", "powerpoint"].some(k => normalized.includes(k))) {
    return "Jessica's technical skills include Microsoft Word, Excel, and PowerPoint, including document formatting, mail merge, VLOOKUP/XLOOKUP, pivot tables, charts, formulas, presentation design, animations, master slides, and infographic design.";
  }
  if (["education", "school", "study", "college", "university"].some(k => normalized.includes(k))) {
    return "Jessica is studying at Philippine Christian University. She previously attended Concordia College.";
  }
  if (["seminar", "training"].some(k => normalized.includes(k))) {
    return "Jessica has attended seminars including the Blockchain Summit, Building the Future: Real-World Tools for IT and CS Students, PEAC, and Data Privacy Act 2012 Awareness.";
  }
  if (["achievement", "award", "dean"].some(k => normalized.includes(k))) {
    return "Jessica's listed achievement is being part of the College Dean's List for 2025–2026.";
  }
  if (["contact", "email", "phone", "number", "reach"].some(k => normalized.includes(k))) {
    return "You can contact Jessica through jdaniellecamacho7@gmail.com or 0995 093 1497.";
  }
  if (["about", "who is jessica", "who's jessica"].some(k => normalized.includes(k))) {
    return "Jessica Danielle C. Ande is an Information Technology student and IT Support Intern who is motivated, hardworking, eager to learn, and open to new ideas.";
  }
  return null;
}

chatForm.addEventListener("submit", event => {
  event.preventDefault();
  const text = chatInput.value.trim();
  if (!text) return;
  addMessage(text, "user");
  chatInput.value = "";
  askAI(text);
});

document.querySelectorAll(".suggestions button").forEach(button => {
  button.addEventListener("click", () => {
    const question = button.dataset.question;
    addMessage(question, "user");
    askAI(question);
  });
});
