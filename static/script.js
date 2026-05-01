const textarea = document.getElementById("jobDesc");
const charCount = document.getElementById("charCount");
const mascotBubble = document.getElementById("mascotBubble");

const mascotMessages = {
  idle: "hire me! 💼",
  analyzing: "checking fit... 🔍",
  strong: "great match! 🎉",
  average: "getting there! 💪",
  low: "needs work! 📝",
  error: "uh oh! 😬"
};

textarea.addEventListener("input", function () {
  charCount.textContent = this.value.length;
});

document.getElementById("resumeFile").addEventListener("change", function () {
  const name = this.files[0]?.name || "";
  const fileNameEl = document.getElementById("fileName");
  if (name) {
    fileNameEl.textContent = "✓ " + name;
    mascotBubble.textContent = "got it! 📄";
  }
});

function setMascot(state) {
  mascotBubble.textContent = mascotMessages[state];
}

function toggleTheme() {
  document.body.classList.toggle("dark");
  const btn = document.getElementById("themeBtn");
  btn.textContent = document.body.classList.contains("dark") ? "☀ Light" : "☾ Dark";
}

function clearAll() {
  document.getElementById("jobDesc").value = "";
  document.getElementById("resumeFile").value = "";
  document.getElementById("fileName").textContent = "";
  charCount.textContent = "0";
  document.getElementById("resultSection").classList.remove("show");
  document.getElementById("resultEmpty").style.display = "flex";
  document.getElementById("errorBox").style.display = "none";
  setMascot("idle");
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function animateScore(el, target, duration) {
  const start = performance.now();
  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(target * eased) + "%";
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

async function revealResult(data) {
  const resultEmpty = document.getElementById("resultEmpty");
  const resultSection = document.getElementById("resultSection");
  const scoreBig = document.getElementById("scoreBig");
  const scoreBar = document.getElementById("scoreBar");
  const feedbackTag = document.getElementById("feedbackTag");
  const keywordsRow = document.getElementById("keywordsRow");

  scoreBig.textContent = "0%";
  scoreBar.style.width = "0%";
  feedbackTag.style.display = "none";
  keywordsRow.style.opacity = "0";

  resultEmpty.style.display = "none";
  resultSection.classList.add("show");

  await delay(200);
  animateScore(scoreBig, data.score, 1000);

  await delay(300);
  const level = data.feedback.level;
  const barColor =
    level === "strong" ? "linear-gradient(90deg, #10b981, #34d399)" :
    level === "average" ? "linear-gradient(90deg, #f59e0b, #fbbf24)" :
    "linear-gradient(90deg, #ef4444, #f87171)";

  scoreBar.style.background = barColor;
  scoreBar.style.width = data.score + "%";

  await delay(800);
  feedbackTag.textContent = data.feedback.level === "strong" ? "✦ " + data.feedback.text :
    data.feedback.level === "average" ? "⚡ " + data.feedback.text : "⚠ " + data.feedback.text;
  feedbackTag.className = "feedback-tag feedback-" + data.feedback.level;
  feedbackTag.style.display = "inline-block";
  feedbackTag.style.animation = "popIn 0.3s ease";

  await delay(400);
  const colors = ["kw-0", "kw-1", "kw-2", "kw-3", "kw-4"];
  keywordsRow.innerHTML = data.missing_keywords.map((kw, i) =>
    `<span class="kw ${colors[i % colors.length]}">${kw}</span>`
  ).join("");
  keywordsRow.style.transition = "opacity 0.4s ease";
  keywordsRow.style.opacity = "1";

  setMascot(level);
}

async function analyze() {
  const file = document.getElementById("resumeFile").files[0];
  const jobDesc = textarea.value.trim();
  const errorBox = document.getElementById("errorBox");

  errorBox.style.display = "none";

  if (!file) {
    errorBox.textContent = "Please upload a resume PDF first.";
    errorBox.style.display = "block";
    setMascot("error");
    return;
  }

  if (!jobDesc) {
    errorBox.textContent = "Please paste a job description.";
    errorBox.style.display = "block";
    setMascot("error");
    return;
  }

  if (jobDesc.split(" ").length < 10) {
    errorBox.textContent = "Job description is too short. Paste the full description.";
    errorBox.style.display = "block";
    setMascot("error");
    return;
  }

  document.querySelector(".btn-analyze").textContent = "✦ Analyzing...";
  setMascot("analyzing");

  try {
    const formData = new FormData();
    formData.append("resume", file);
    formData.append("job_desc", jobDesc);

    const res = await fetch("/analyze", {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    if (data.error) {
      errorBox.textContent = data.error;
      errorBox.style.display = "block";
      setMascot("error");
      return;
    }

    await revealResult(data);

  } catch (err) {
    errorBox.textContent = "Could not connect to server. Make sure the app is running.";
    errorBox.style.display = "block";
    setMascot("error");
  } finally {
    document.querySelector(".btn-analyze").textContent = "✦ Analyze Match";
  }
}