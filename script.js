// ============================================================
//  Cumpleaños de Patty 💙
//  Para agregar fotos:
//   1) Coloca los archivos dentro de la carpeta images/
//   2) Añade los nombres en la lista PHOTOS de abajo
// ============================================================

// type: "image" o "video"
const MEDIA = [
  { type: "image", src: "images/WhatsApp Image 2026-04-13 at 2.32.20 PM.jpeg" },
  { type: "image", src: "images/WhatsApp Image 2026-04-13 at 2.32.34 PM.jpeg" },
  { type: "image", src: "images/WhatsApp Image 2026-04-13 at 2.32.45 PM.jpeg" },
  { type: "image", src: "images/WhatsApp Image 2026-04-13 at 2.33.35 PM.jpeg" },
  { type: "image", src: "images/WhatsApp Image 2026-04-13 at 2.33.55 PM.jpeg" },
  { type: "image", src: "images/WhatsApp Image 2026-04-13 at 2.34.14 PM.jpeg" },
  { type: "video", src: "images/WhatsApp Video 2026-04-13 at 2.34.30 PM.mp4" },
  { type: "image", src: "images/WhatsApp Image 2026-04-13 at 2.34.55 PM.jpeg" },
  { type: "image", src: "images/WhatsApp Image 2026-04-13 at 2.35.29 PM.jpeg" },
  { type: "image", src: "images/WhatsApp Image 2026-04-13 at 2.36.18 PM.jpeg" },
  { type: "image", src: "images/WhatsApp Image 2026-04-13 at 2.36.39 PM.jpeg" },
  { type: "image", src: "images/WhatsApp Image 2026-04-13 at 2.36.50 PM.jpeg" },
  { type: "image", src: "images/WhatsApp Image 2026-04-13 at 2.38.24 PM.jpeg" },
  { type: "video", src: "images/WhatsApp Video 2026-04-13 at 2.38.38 PM.mp4" },
  { type: "image", src: "images/WhatsApp Image 2026-04-13 at 2.40.52 PM.jpeg" },
  { type: "image", src: "images/WhatsApp Image 2026-04-13 at 2.41.08 PM.jpeg" },
  { type: "image", src: "images/WhatsApp Image 2026-04-13 at 2.44.27 PM.jpeg" },
];

const LOVE_MESSAGES = [
  "¿Segura? 🥺",
  "Mejor piénsalo otra vez…",
  "¿De verdad de verdad?",
  "No me hagas esto Patty 💔",
  "Vamos, sé que me amas 💙",
  "Última oportunidad…",
  "Bebé, no juegues 😢",
];

// ---------- HOME: música ----------
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("music-btn");
  const audio = document.getElementById("bg-music");
  if (!btn || !audio) return;

  let playing = false;
  btn.addEventListener("click", () => {
    if (playing) {
      audio.pause();
      btn.textContent = "🎵 Música";
    } else {
      audio.play().catch(() => {
        btn.textContent = "🎵 Sube tu canción";
      });
      btn.textContent = "⏸ Pausar";
    }
    playing = !playing;
  });
});

// ============================================================
//  GALERÍA
// ============================================================
function initGallery() {
  const slider = document.getElementById("slider");
  const counter = document.getElementById("counter");
  const prev = document.getElementById("prev");
  const next = document.getElementById("next");
  if (!slider) return;

  if (MEDIA.length === 0) {
    slider.innerHTML = `
      <div class="placeholder">
        <span>📷</span>
        <p><b>Aún no hay fotos.</b><br/>
        Pon tus archivos en la carpeta <code>images/</code><br/>
        y agrégalos en <code>script.js</code> → <code>MEDIA</code></p>
      </div>`;
    counter.textContent = "0 / 0";
    return;
  }

  const elements = MEDIA.map((item, i) => {
    let el;
    if (item.type === "video") {
      el = document.createElement("video");
      el.src = item.src;
      el.muted = true;
      el.playsInline = true;
      el.preload = "metadata";
      el.controls = false;
    } else {
      el = document.createElement("img");
      el.src = item.src;
      el.alt = `Recuerdo ${i + 1}`;
    }
    if (i === 0) el.classList.add("active");
    slider.appendChild(el);
    return el;
  });

  let current = 0;
  let autoTimer = null;

  const stopAll = () => {
    elements.forEach((el) => {
      if (el.tagName === "VIDEO") {
        el.pause();
        el.currentTime = 0;
        el.onended = null;
      }
    });
    if (autoTimer) { clearTimeout(autoTimer); autoTimer = null; }
  };

  const goTo = (i) => {
    stopAll();
    current = (i + MEDIA.length) % MEDIA.length;
    elements.forEach((el, idx) => el.classList.toggle("active", idx === current));
    counter.textContent = `${current + 1} / ${MEDIA.length}`;

    const el = elements[current];
    if (el.tagName === "VIDEO") {
      el.play().catch(() => {});
      el.onended = () => goTo(current + 1);
      // Fallback por si el video no dispara ended
      autoTimer = setTimeout(() => goTo(current + 1), 15000);
    } else {
      autoTimer = setTimeout(() => goTo(current + 1), 4000);
    }
  };

  prev.addEventListener("click", () => goTo(current - 1));
  next.addEventListener("click", () => goTo(current + 1));

  goTo(0);
}

// ============================================================
//  JUEGO: Atrapa Corazones
// ============================================================
function initGame() {
  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");
  const scoreEl = document.getElementById("score");
  const livesEl = document.getElementById("lives");
  const timeEl = document.getElementById("time");
  const startBtn = document.getElementById("start-btn");
  const restartBtn = document.getElementById("restart-btn");
  const over = document.getElementById("game-over");
  const goTitle = document.getElementById("go-title");
  const goMsg = document.getElementById("go-msg");

  const W = canvas.width, H = canvas.height;
  let basket = { x: W / 2, y: H - 40, w: 80, h: 20 };
  let items = [];
  let score = 0, lives = 3, time = 60;
  let running = false;
  let timer, spawner;

  function reset() {
    score = 0; lives = 3; time = 60;
    items = [];
    scoreEl.textContent = score;
    livesEl.textContent = lives;
    timeEl.textContent = time;
    over.classList.add("hidden");
  }

  function spawn() {
    const isHeart = Math.random() > 0.3;
    items.push({
      x: Math.random() * (W - 30) + 15,
      y: -20,
      r: 16,
      vy: 2 + Math.random() * 2.5,
      heart: isHeart,
    });
  }

  function drawHeart(x, y, size, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    const s = size;
    ctx.moveTo(x, y + s / 4);
    ctx.bezierCurveTo(x, y, x - s / 2, y, x - s / 2, y + s / 4);
    ctx.bezierCurveTo(x - s / 2, y + s / 2, x, y + s * 0.75, x, y + s);
    ctx.bezierCurveTo(x, y + s * 0.75, x + s / 2, y + s / 2, x + s / 2, y + s / 4);
    ctx.bezierCurveTo(x + s / 2, y, x, y, x, y + s / 4);
    ctx.fill();
  }

  function drawX(x, y, size, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x - size / 2, y - size / 2);
    ctx.lineTo(x + size / 2, y + size / 2);
    ctx.moveTo(x + size / 2, y - size / 2);
    ctx.lineTo(x - size / 2, y + size / 2);
    ctx.stroke();
  }

  function loop() {
    if (!running) return;
    ctx.clearRect(0, 0, W, H);

    // basket
    ctx.fillStyle = "#4A7FB0";
    ctx.fillRect(basket.x - basket.w / 2, basket.y, basket.w, basket.h);
    ctx.fillStyle = "#2F5C87";
    ctx.fillRect(basket.x - basket.w / 2, basket.y, basket.w, 4);

    // items
    items.forEach((it) => {
      it.y += it.vy;
      if (it.heart) drawHeart(it.x, it.y, 24, "#4A7FB0");
      else drawX(it.x, it.y, 22, "#888");
    });

    // collisions
    items = items.filter((it) => {
      const caught =
        it.y + it.r >= basket.y &&
        it.x >= basket.x - basket.w / 2 &&
        it.x <= basket.x + basket.w / 2;
      if (caught) {
        if (it.heart) { score += 10; scoreEl.textContent = score; }
        else { lives--; livesEl.textContent = lives; }
        return false;
      }
      if (it.y > H + 30) {
        if (it.heart) { /* missed heart, no penalty */ }
        return false;
      }
      return true;
    });

    if (lives <= 0) endGame(false);
    requestAnimationFrame(loop);
  }

  function start() {
    reset();
    running = true;
    startBtn.classList.add("hidden");
    spawner = setInterval(spawn, 700);
    timer = setInterval(() => {
      time--;
      timeEl.textContent = time;
      if (time <= 0) endGame(true);
    }, 1000);
    loop();
  }

  function endGame(won) {
    running = false;
    clearInterval(spawner);
    clearInterval(timer);
    over.classList.remove("hidden");
    if (won) {
      goTitle.textContent = "¡Ganaste, Patty! 💙";
      goMsg.textContent = `Atrapaste ${score} corazones. Pero los míos no se cuentan: son infinitos para ti.`;
    } else {
      goTitle.textContent = "¡Casi, Patty!";
      goMsg.textContent = `Lograste ${score} puntos. Inténtalo otra vez, mi amor.`;
    }
  }

  // controls
  canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    basket.x = ((e.clientX - rect.left) / rect.width) * W;
  });
  canvas.addEventListener("touchmove", (e) => {
    const rect = canvas.getBoundingClientRect();
    const t = e.touches[0];
    basket.x = ((t.clientX - rect.left) / rect.width) * W;
    e.preventDefault();
  }, { passive: false });

  startBtn.addEventListener("click", start);
  restartBtn.addEventListener("click", start);

  // initial draw
  ctx.fillStyle = "#4A7FB0";
  ctx.fillRect(basket.x - basket.w / 2, basket.y, basket.w, basket.h);
}

// ============================================================
//  ¿ME AMAS?
// ============================================================
function initLove() {
  const yes = document.getElementById("yes-btn");
  const no = document.getElementById("no-btn");
  const sub = document.getElementById("love-sub");
  const final = document.getElementById("love-final");
  const buttons = document.querySelector(".love-buttons");
  const question = document.getElementById("love-question");
  if (!yes || !no) return;

  let attempts = 0;

  const moveNo = () => {
    attempts++;
    sub.textContent = LOVE_MESSAGES[Math.min(attempts - 1, LOVE_MESSAGES.length - 1)];

    // Hace crecer el botón "Sí"
    const scale = 1 + Math.min(attempts * 0.15, 1.2);
    yes.style.transform = `scale(${scale})`;

    // Mueve el "No" a una posición aleatoria dentro de la pantalla
    const maxX = window.innerWidth - 120;
    const maxY = window.innerHeight - 80;
    const x = Math.random() * maxX;
    const y = Math.random() * maxY;
    no.style.position = "fixed";
    no.style.left = x + "px";
    no.style.top = y + "px";
  };

  // Que el botón se mueva al pasar el mouse encima también
  no.addEventListener("mouseenter", moveNo);
  no.addEventListener("click", moveNo);
  no.addEventListener("touchstart", (e) => { moveNo(); e.preventDefault(); }, { passive: false });

  yes.addEventListener("click", () => {
    buttons.classList.add("hidden");
    question.classList.add("hidden");
    sub.classList.add("hidden");
    final.classList.remove("hidden");
    launchHearts();
  });
}

function launchHearts() {
  for (let i = 0; i < 30; i++) {
    setTimeout(() => {
      const h = document.createElement("div");
      h.textContent = "💙";
      h.style.position = "fixed";
      h.style.left = Math.random() * 100 + "vw";
      h.style.top = "-30px";
      h.style.fontSize = (20 + Math.random() * 30) + "px";
      h.style.transition = "transform 4s linear, opacity 4s";
      h.style.zIndex = 9999;
      document.body.appendChild(h);
      requestAnimationFrame(() => {
        h.style.transform = `translateY(${window.innerHeight + 50}px)`;
        h.style.opacity = "0";
      });
      setTimeout(() => h.remove(), 4200);
    }, i * 120);
  }
}
