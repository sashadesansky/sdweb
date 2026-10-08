/*
  Roxy's Churu Run — a small Mario-style platformer.
  Pure canvas 2D + vanilla JS, no dependencies. Roxy and the level-3
  enemy are drawn from images/roxy-sprite.jpg and images/jake-sprite.jpg
  when available; until then (or if either fails to load) a simple drawn
  face is used instead, so the game always works.
*/

(function () {
  "use strict";

  const CANVAS_W = 960;
  const CANVAS_H = 540;
  const GROUND_Y = 480;
  const GRAVITY = 0.6;
  const JUMP_VELOCITY = -15.5;
  const MOVE_SPEED = 4.2;
  const PLAYER_W = 46;
  const PLAYER_H = 58;
  const ENEMY_W = 44;
  const ENEMY_H = 46;
  const CHURU_RADIUS = 16;
  const TOTAL_LIVES = 9;

  const canvas = document.getElementById("game-canvas");
  const ctx = canvas.getContext("2d");

  // Render at device pixel ratio for a crisp image on retina screens,
  // while all game/draw code below keeps working in 960x540 units.
  const dpr = Math.min(window.devicePixelRatio || 1, 3);
  canvas.width = CANVAS_W * dpr;
  canvas.height = CANVAS_H * dpr;
  ctx.scale(dpr, dpr);

  // ---- Sprites (with graceful fallback) ------------------------------------
  // roxy-sprite.jpg is a square face-crop of Roxy, drawn inside a circular
  // "head" on top of a drawn cat body. jake-image.jpg is Jake's photo, used
  // the same way for the level-3 enemy. If either is missing, a simple
  // drawn face fills the same circle, so the game always works.
  const roxyImg = new Image();
  let roxyImgReady = false;
  roxyImg.onload = () => { roxyImgReady = true; };
  roxyImg.onerror = () => { roxyImgReady = false; };
  roxyImg.src = "../images/roxy-sprite.jpg";

  const jakeImg = new Image();
  let jakeImgReady = false;
  jakeImg.onload = () => { jakeImgReady = true; };
  jakeImg.onerror = () => { jakeImgReady = false; };
  jakeImg.src = "../images/jake-sprite.jpg";

  function drawFallbackFace(cx, cy, r, skinColor, angry) {
    ctx.fillStyle = skinColor;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    // ears
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.55, cy - r * 0.55);
    ctx.lineTo(cx - r * 0.85, cy - r * 1.35);
    ctx.lineTo(cx - r * 0.05, cy - r * 0.75);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(cx + r * 0.55, cy - r * 0.55);
    ctx.lineTo(cx + r * 0.85, cy - r * 1.35);
    ctx.lineTo(cx + r * 0.05, cy - r * 0.75);
    ctx.fill();
    if (angry) {
      // angry eyebrows
      ctx.strokeStyle = "#2b1b10";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx - r * 0.5, cy - r * 0.1);
      ctx.lineTo(cx - r * 0.08, cy - r * 0.32);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx + r * 0.5, cy - r * 0.1);
      ctx.lineTo(cx + r * 0.08, cy - r * 0.32);
      ctx.stroke();
    }
    // eyes
    ctx.fillStyle = "#1a1a1a";
    ctx.beginPath();
    ctx.arc(cx - r * 0.3, cy, r * 0.09, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx + r * 0.3, cy, r * 0.09, 0, Math.PI * 2);
    ctx.fill();
  }

  // Draws a simple cartoon cat body (tail + legs + torso) in the local,
  // already facing-flipped coordinate space spanning 0..w horizontally.
  function drawCatBody(w, y, h, furColor, furDark) {
    const cx = w / 2;
    const bodyTop = y + h * 0.48;
    const bodyH = h - h * 0.48;
    const bodyW = w * 0.86;
    const bodyCY = bodyTop + bodyH * 0.5;

    // tail trails behind (negative-x side in local space)
    ctx.strokeStyle = furColor;
    ctx.lineWidth = Math.max(3, w * 0.14);
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(cx - bodyW * 0.32, bodyCY - bodyH * 0.05);
    ctx.quadraticCurveTo(cx - w * 0.55, bodyCY - h * 0.05, cx - w * 0.35, bodyTop - h * 0.1);
    ctx.stroke();

    // legs/paws
    ctx.fillStyle = furDark;
    const legY = y + h - h * 0.04;
    ctx.beginPath();
    ctx.ellipse(cx - bodyW * 0.2, legY, w * 0.13, h * 0.06, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx + bodyW * 0.2, legY, w * 0.13, h * 0.06, 0, 0, Math.PI * 2);
    ctx.fill();

    // body
    ctx.fillStyle = furColor;
    ctx.beginPath();
    ctx.ellipse(cx, bodyCY, bodyW / 2, bodyH * 0.52, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawRoxy(x, y, w, h, facing) {
    ctx.save();
    ctx.translate(x + w / 2, 0);
    ctx.scale(facing, 1);
    ctx.translate(-w / 2, 0);

    drawCatBody(w, y, h, "#b8763f", "#7a4b25");

    const headR = w * 0.52;
    const headCX = w / 2;
    const headCY = y + headR * 0.95;
    if (roxyImgReady && roxyImg.naturalWidth) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(headCX, headCY, headR, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(roxyImg, headCX - headR, headCY - headR, headR * 2, headR * 2);
      ctx.restore();
    } else {
      drawFallbackFace(headCX, headCY, headR, "#c78349", false);
    }

    ctx.restore();
  }

  // ---- Level-3 enemy ("Jake") ---------------------------------------------
  function drawEnemyBody(w, y, h) {
    const cx = w / 2;
    const bodyTop = y + h * 0.42;
    const bodyH = h - h * 0.42;
    ctx.fillStyle = "#6b4226";
    ctx.beginPath();
    ctx.ellipse(cx, bodyTop + bodyH * 0.55, w * 0.46, bodyH * 0.58, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#3a2415";
    const legY = y + h - h * 0.03;
    ctx.beginPath();
    ctx.ellipse(cx - w * 0.24, legY, w * 0.17, h * 0.08, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx + w * 0.24, legY, w * 0.17, h * 0.08, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawEnemy(enemy) {
    const x = enemy.x - camera;
    if (x + ENEMY_W < 0 || x > CANVAS_W) return;
    const y = GROUND_Y - ENEMY_H;

    ctx.save();
    ctx.translate(x + ENEMY_W / 2, 0);
    ctx.scale(enemy.dir, 1);
    ctx.translate(-ENEMY_W / 2, 0);

    drawEnemyBody(ENEMY_W, y, ENEMY_H);

    const headR = ENEMY_W * 0.44;
    const headCX = ENEMY_W / 2;
    const headCY = y + headR * 0.85;
    if (jakeImgReady && jakeImg.naturalWidth) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(headCX, headCY, headR, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(jakeImg, headCX - headR, headCY - headR, headR * 2, headR * 2);
      ctx.restore();
    } else {
      drawFallbackFace(headCX, headCY, headR, "#8b5e3c", true);
    }

    ctx.restore();
  }

  // ---- Level data -----------------------------------------------------
  // Coordinates are in the same virtual units as the canvas (960x540),
  // scrolled horizontally by a camera as Roxy moves through the level.
  function buildLevels() {
    return [
      // ---------------- Level 1 — churu collecting, no hazards ----------------
      {
        width: 2200,
        theme: "sky",
        ground: [{ x: 0, width: 2200 }],
        platforms: [
          { x: 520, y: 372, width: 130, height: 20 },
          { x: 1080, y: 340, width: 150, height: 20 },
          { x: 1650, y: 380, width: 140, height: 20 }
        ],
        cords: [],
        churus: [
          { x: 260, y: 430 }, { x: 420, y: 430 }, { x: 585, y: 330 },
          { x: 690, y: 430 }, { x: 800, y: 430 }, { x: 900, y: 430 },
          { x: 1040, y: 430 }, { x: 1145, y: 298 }, { x: 1300, y: 430 },
          { x: 1400, y: 430 }, { x: 1500, y: 430 }, { x: 1560, y: 430 },
          { x: 1715, y: 338 }, { x: 1820, y: 430 }, { x: 1950, y: 430 },
          { x: 2050, y: 430 }
        ],
        goal: { x: 2130, y: GROUND_Y }
      },

      // ---------------- Level 2 — cords introduced, inside the house ----------------
      {
        width: 2800,
        theme: "house",
        ground: [
          { x: 0, width: 900 },
          { x: 1000, width: 600 },
          { x: 1700, width: 1100 }
        ],
        platforms: [
          { x: 560, y: 360, width: 130, height: 20 },
          { x: 900, y: 400, width: 110, height: 20 },
          { x: 1250, y: 350, width: 140, height: 20 },
          { x: 1600, y: 400, width: 110, height: 20 },
          { x: 1980, y: 330, width: 150, height: 20 },
          { x: 2350, y: 380, width: 140, height: 20 }
        ],
        cords: [
          { x: 260, width: 60 }, { x: 480, width: 60 }, { x: 700, width: 70 },
          { x: 1040, width: 60 }, { x: 1260, width: 60 }, { x: 1480, width: 60 },
          { x: 1780, width: 70 }, { x: 2020, width: 60 }, { x: 2260, width: 70 },
          { x: 2500, width: 70 }
        ],
        churus: [
          { x: 200, y: 430 }, { x: 400, y: 430 }, { x: 625, y: 318 },
          { x: 800, y: 430 }, { x: 955, y: 358 }, { x: 1150, y: 430 },
          { x: 1320, y: 308 }, { x: 1450, y: 430 }, { x: 1655, y: 358 },
          { x: 1850, y: 430 }, { x: 2055, y: 288 }, { x: 2200, y: 430 },
          { x: 2420, y: 338 }, { x: 2600, y: 430 }, { x: 2700, y: 430 }
        ],
        goal: { x: 2730, y: GROUND_Y }
      },

      // ---------------- Level 3 — cords + a Jake enemy to avoid or stomp ----------------
      {
        width: 3400,
        theme: "house",
        ground: [
          { x: 0, width: 700 },
          { x: 800, width: 500 },
          { x: 1400, width: 600 },
          { x: 2100, width: 1300 }
        ],
        enemies: [
          { min: 500, max: 640, speed: 1.3 },
          { min: 1520, max: 1660, speed: 1.5 },
          { min: 2320, max: 2480, speed: 1.4 },
          { min: 3010, max: 3140, speed: 1.6 }
        ],
        platforms: [
          { x: 420, y: 370, width: 110, height: 20 },
          { x: 860, y: 400, width: 100, height: 20 },
          { x: 1000, y: 330, width: 100, height: 20 },
          { x: 1150, y: 400, width: 100, height: 20 },
          { x: 1460, y: 360, width: 120, height: 20 },
          { x: 1700, y: 310, width: 120, height: 20 },
          { x: 1950, y: 380, width: 110, height: 20 },
          { x: 2200, y: 420, width: 100, height: 20 },
          { x: 2380, y: 340, width: 100, height: 20 },
          { x: 2560, y: 400, width: 100, height: 20 },
          { x: 2800, y: 350, width: 130, height: 20 },
          { x: 3050, y: 400, width: 120, height: 20 }
        ],
        cords: [
          { x: 220, width: 40 }, { x: 460, width: 40 },
          { x: 830, width: 35 }, { x: 940, width: 35 },
          { x: 1150, width: 40 },
          { x: 1440, width: 40 }, { x: 1560, width: 35 },
          { x: 1780, width: 40 }, { x: 1980, width: 40 },
          { x: 2170, width: 40 }, { x: 2400, width: 40 },
          { x: 2650, width: 45 }, { x: 2900, width: 45 },
          { x: 3150, width: 45 }
        ],
        churus: [
          { x: 160, y: 430 }, { x: 340, y: 430 }, { x: 475, y: 328 },
          { x: 620, y: 430 }, { x: 895, y: 358 }, { x: 1035, y: 288 },
          { x: 1185, y: 358 }, { x: 1330, y: 430 }, { x: 1495, y: 318 },
          { x: 1620, y: 430 }, { x: 1735, y: 268 }, { x: 1900, y: 430 },
          { x: 1985, y: 338 }, { x: 2150, y: 430 }, { x: 2235, y: 378 },
          { x: 2415, y: 298 }, { x: 2595, y: 358 }, { x: 2760, y: 430 },
          { x: 2835, y: 308 }, { x: 3020, y: 430 }, { x: 3085, y: 358 },
          { x: 3300, y: 430 }
        ],
        goal: { x: 3330, y: GROUND_Y }
      }
    ];
  }

  const LEVELS = buildLevels();

  // Flatten each level's ground segments + platforms into one collidable
  // "surfaces" list, and give ground segments a tall filled height.
  function prepareLevel(level) {
    const surfaces = [];
    level.ground.forEach((g) => {
      surfaces.push({ x: g.x, y: GROUND_Y, width: g.width, height: CANVAS_H - GROUND_Y + 40, isGround: true });
    });
    level.platforms.forEach((p) => {
      surfaces.push({ x: p.x, y: p.y, width: p.width, height: p.height, isGround: false });
    });
    const cords = level.cords.map((c) => ({
      x: c.x,
      y: GROUND_Y - 22,
      width: c.width,
      height: 22
    }));
    const churus = level.churus.map((c) => ({ x: c.x, y: c.y, collected: false }));
    const enemies = (level.enemies || []).map((e) => ({
      x: e.min,
      min: e.min,
      max: e.max,
      speed: e.speed || 1.4,
      dir: 1,
      defeated: false
    }));
    return { ...level, surfaces, cords, churus, enemies };
  }

  // ---- Game state -----------------------------------------------------
  let state = "start"; // start | playing | levelComplete | gameOver | win
  let levelIndex = 0;
  let current = prepareLevel(LEVELS[0]);
  let camera = 0;
  let score = 0;
  let lives = TOTAL_LIVES;
  let churuTotalThisLevel = current.churus.length;

  // ---- Leaderboard tracking (time to complete all 3 levels + churus collected) ----
  let runStartTime = null; // performance.now() when the current run began
  let frozenElapsedMs = 0; // elapsed time locked in at win/game-over
  let totalChurusThisRun = 0; // cumulative churus held across the whole run

  const player = {
    x: 40,
    y: GROUND_Y - PLAYER_H,
    vx: 0,
    vy: 0,
    onGround: false,
    facing: 1
  };

  function resetPlayerToLevelStart() {
    player.x = 40;
    player.y = GROUND_Y - PLAYER_H;
    player.vx = 0;
    player.vy = 0;
    player.facing = 1;
    camera = 0;
  }

  function loadLevel(index) {
    levelIndex = index;
    current = prepareLevel(LEVELS[index]);
    churuTotalThisLevel = current.churus.length;
    resetPlayerToLevelStart();
  }

  function restartGame() {
    score = 0;
    lives = TOTAL_LIVES;
    totalChurusThisRun = 0;
    runStartTime = performance.now();
    loadLevel(0);
  }

  // ---- Input ------------------------------------------------------------
  const keys = { left: false, right: false, jump: false };
  let jumpPressedEdge = false;

  window.addEventListener("keydown", (e) => {
    if (["ArrowLeft", "a", "A"].includes(e.key)) keys.left = true;
    if (["ArrowRight", "d", "D"].includes(e.key)) keys.right = true;
    if (["ArrowUp", "w", "W", " "].includes(e.key)) {
      if (!keys.jump) jumpPressedEdge = true;
      keys.jump = true;
      e.preventDefault();
    }
  });
  window.addEventListener("keyup", (e) => {
    if (["ArrowLeft", "a", "A"].includes(e.key)) keys.left = false;
    if (["ArrowRight", "d", "D"].includes(e.key)) keys.right = false;
    if (["ArrowUp", "w", "W", " "].includes(e.key)) keys.jump = false;
  });

  function bindTouchButton(id, onDown, onUp) {
    const el = document.getElementById(id);
    if (!el) return;
    const down = (e) => { e.preventDefault(); onDown(); };
    const up = (e) => { e.preventDefault(); onUp(); };
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointerleave", up);
    el.addEventListener("pointercancel", up);
  }

  bindTouchButton("btn-left", () => (keys.left = true), () => (keys.left = false));
  bindTouchButton("btn-right", () => (keys.right = true), () => (keys.right = false));
  bindTouchButton(
    "btn-jump",
    () => {
      if (!keys.jump) jumpPressedEdge = true;
      keys.jump = true;
    },
    () => (keys.jump = false)
  );

  // ---- Overlay UI ---------------------------------------------------------
  const overlay = document.getElementById("overlay");
  const overlayTitle = document.getElementById("overlay-title");
  const overlayText = document.getElementById("overlay-text");
  const overlayButton = document.getElementById("overlay-button");

  const overlayControls = document.querySelector(".overlay-controls");
  const overlayPortrait = document.getElementById("overlay-portrait");

  function showOverlay(title, text, buttonLabel, showControls) {
    overlayTitle.textContent = title;
    overlayText.textContent = text;
    overlayButton.textContent = buttonLabel;
    overlayControls.hidden = !showControls;
    overlayPortrait.hidden = !showControls;
    overlay.hidden = false;
  }
  function hideOverlay() {
    overlay.hidden = true;
  }

  overlayButton.addEventListener("click", () => {
    if (state === "start") {
      runStartTime = performance.now();
      state = "playing";
      hideOverlay();
    } else if (state === "levelComplete") {
      if (levelIndex + 1 < LEVELS.length) {
        loadLevel(levelIndex + 1);
        state = "playing";
        hideOverlay();
      }
    } else if (state === "gameOver" || state === "win") {
      restartGame();
      state = "playing";
      hideOverlay();
    }
  });

  showOverlay(
    "Roxy's Churu Run",
    "Help Roxy collect churus and reach the yarn ball at the end of each level — watch out for computer cords along the way!",
    "Start Game",
    true
  );

  // ---- Leaderboard (saved in this browser's localStorage only) ------------
  const LEADERBOARD_KEY = "roxyChuruRunLeaderboard";
  const LEADERBOARD_SIZE = 5;
  const leaderboardList = document.getElementById("leaderboard-list");
  const leaderboardReset = document.getElementById("leaderboard-reset");

  function formatTime(ms) {
    const totalTenths = Math.floor(ms / 100);
    const minutes = Math.floor(totalTenths / 600);
    const seconds = Math.floor((totalTenths % 600) / 10);
    const tenths = totalTenths % 10;
    return `${minutes}:${String(seconds).padStart(2, "0")}.${tenths}`;
  }

  function loadLeaderboard() {
    try {
      const raw = localStorage.getItem(LEADERBOARD_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      return [];
    }
  }

  function saveLeaderboard(entries) {
    try {
      localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(entries));
    } catch (err) {
      // localStorage unavailable (private browsing, quota, etc.) — leaderboard
      // just won't persist across reloads; the game itself still works fine.
    }
  }

  function renderLeaderboard(entries, highlightIndex) {
    if (!leaderboardList) return;
    if (!entries.length) {
      leaderboardList.innerHTML = `<p class="leaderboard-empty">No completions yet — be the first to beat all 3 levels!</p>`;
      return;
    }
    const rows = entries
      .map((entry, i) => {
        const date = new Date(entry.date);
        const dateLabel = Number.isNaN(date.getTime())
          ? ""
          : date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
        return `
        <tr${i === highlightIndex ? ' class="leaderboard-newest"' : ""}>
          <td>${i + 1}</td>
          <td>${formatTime(entry.timeMs)}</td>
          <td>${entry.churus}</td>
          <td>${dateLabel}</td>
        </tr>`;
      })
      .join("");
    leaderboardList.innerHTML = `
      <table class="leaderboard-table">
        <thead>
          <tr><th>Rank</th><th>Time</th><th>Churus</th><th>Date</th></tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    `;
  }

  // Records a completed run, keeping only the fastest LEADERBOARD_SIZE times.
  // Returns the entry's rank (1-based) if it made the leaderboard, else null.
  function recordLeaderboardEntry(timeMs, churus) {
    const entries = loadLeaderboard();
    const newEntry = { timeMs, churus, date: new Date().toISOString(), _id: Math.random() };
    entries.push(newEntry);
    entries.sort((a, b) => a.timeMs - b.timeMs);
    const trimmed = entries.slice(0, LEADERBOARD_SIZE);
    saveLeaderboard(trimmed.map(({ _id, ...rest }) => rest));
    const rank = trimmed.findIndex((e) => e._id === newEntry._id);
    renderLeaderboard(trimmed, rank);
    return rank === -1 ? null : rank + 1;
  }

  if (leaderboardReset) {
    leaderboardReset.addEventListener("click", () => {
      saveLeaderboard([]);
      renderLeaderboard([], -1);
    });
  }

  renderLeaderboard(loadLeaderboard(), -1);

  // ---- Collision helpers ------------------------------------------------
  function rectsOverlap(a, b) {
    return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
  }

  function loseLife() {
    lives -= 1;
    if (lives <= 0) {
      frozenElapsedMs = performance.now() - runStartTime;
      state = "gameOver";
      showOverlay("Game Over", `Roxy needs a nap. Final score: ${score}.`, "Try Again");
    } else {
      resetPlayerToLevelStart();
      const churusLostThisHit = current.churus.filter((c) => c.collected).length;
      current.churus.forEach((c) => (c.collected = false));
      current.enemies.forEach((e) => {
        e.defeated = false;
        e.x = e.min;
        e.dir = 1;
      });
      score = Math.max(0, score - churusLostThisHit * 10);
      totalChurusThisRun = Math.max(0, totalChurusThisRun - churusLostThisHit);
    }
  }

  // ---- Update loop ------------------------------------------------------
  function update() {
    if (state !== "playing") return;

    // Horizontal movement
    player.vx = 0;
    if (keys.left) {
      player.vx = -MOVE_SPEED;
      player.facing = -1;
    }
    if (keys.right) {
      player.vx = MOVE_SPEED;
      player.facing = 1;
    }
    player.x += player.vx;
    player.x = Math.max(0, Math.min(player.x, current.width - PLAYER_W));

    // Jump
    if (jumpPressedEdge && player.onGround) {
      player.vy = JUMP_VELOCITY;
      player.onGround = false;
    }
    jumpPressedEdge = false;

    // Gravity
    const prevBottom = player.y + PLAYER_H;
    player.vy += GRAVITY;
    player.y += player.vy;

    // Landing collision (only when falling onto a surface's top edge —
    // platforms are meant to be jumped up onto from below, not treated
    // as solid ceilings, so ascent passes through freely)
    player.onGround = false;
    if (player.vy >= 0) {
      const newBottom = player.y + PLAYER_H;
      current.surfaces.forEach((s) => {
        const withinX = player.x + PLAYER_W > s.x && player.x < s.x + s.width;
        if (withinX && prevBottom <= s.y + 1 && newBottom >= s.y) {
          player.y = s.y - PLAYER_H;
          player.vy = 0;
          player.onGround = true;
        }
      });
    }

    // Fell into a pit
    if (player.y > CANVAS_H + 40) {
      loseLife();
      return;
    }

    // Cord collisions (hazards)
    const playerBox = { x: player.x + 8, y: player.y + 8, width: PLAYER_W - 16, height: PLAYER_H - 12 };
    for (const cord of current.cords) {
      if (rectsOverlap(playerBox, cord)) {
        loseLife();
        return;
      }
    }

    // Enemy patrol + collision (stomp from above defeats them, side contact costs a life)
    current.enemies.forEach((e) => {
      if (e.defeated) return;
      e.x += e.dir * e.speed;
      if (e.x < e.min) {
        e.x = e.min;
        e.dir = 1;
      }
      if (e.x > e.max) {
        e.x = e.max;
        e.dir = -1;
      }
    });
    const enemyTop = GROUND_Y - ENEMY_H;
    for (const e of current.enemies) {
      if (e.defeated) continue;
      const enemyBox = { x: e.x + 6, y: enemyTop + 6, width: ENEMY_W - 12, height: ENEMY_H - 10 };
      const playerFull = { x: player.x, y: player.y, width: PLAYER_W, height: PLAYER_H };
      if (rectsOverlap(playerFull, enemyBox)) {
        const playerBottomBeforeGravity = player.y + PLAYER_H - player.vy;
        if (player.vy > 0 && playerBottomBeforeGravity <= enemyTop + 12) {
          e.defeated = true;
          player.vy = JUMP_VELOCITY * 0.55;
          score += 20;
        } else {
          loseLife();
          return;
        }
      }
    }

    // Churu collection
    current.churus.forEach((c) => {
      if (c.collected) return;
      const dx = player.x + PLAYER_W / 2 - c.x;
      const dy = player.y + PLAYER_H / 2 - c.y;
      if (Math.sqrt(dx * dx + dy * dy) < CHURU_RADIUS + PLAYER_W / 2 - 6) {
        c.collected = true;
        score += 10;
        totalChurusThisRun += 1;
      }
    });

    // Goal reached
    const goalBox = { x: current.goal.x - 18, y: current.goal.y - 60, width: 36, height: 60 };
    if (rectsOverlap({ x: player.x, y: player.y, width: PLAYER_W, height: PLAYER_H }, goalBox)) {
      if (levelIndex + 1 < LEVELS.length) {
        state = "levelComplete";
        showOverlay(
          `Level ${levelIndex + 1} Complete!`,
          `Score: ${score} · Churus collected: ${current.churus.filter((c) => c.collected).length}/${churuTotalThisLevel}`,
          "Next Level"
        );
      } else {
        frozenElapsedMs = performance.now() - runStartTime;
        const rank = recordLeaderboardEntry(frozenElapsedMs, totalChurusThisRun);
        state = "win";
        showOverlay(
          "You Did It!",
          `Roxy made it through all 3 levels in ${formatTime(frozenElapsedMs)} with ${totalChurusThisRun} churus! Final score: ${score}.` +
            (rank ? ` That's #${rank} on the leaderboard!` : ""),
          "Play Again"
        );
      }
    }

    // Camera follows player, clamped to level bounds
    camera = Math.max(0, Math.min(player.x - CANVAS_W / 2 + PLAYER_W / 2, current.width - CANVAS_W));
  }

  // ---- Drawing ------------------------------------------------------------
  function drawSkyBackground() {
    const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
    grad.addColorStop(0, "#cfe8f5");
    grad.addColorStop(1, "#f5f0fa");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // soft parallax circles ("clouds")
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    for (let i = 0; i < 6; i++) {
      const cx = (i * 320 - camera * 0.3) % (CANVAS_W + 400) - 200;
      ctx.beginPath();
      ctx.ellipse(cx, 70 + (i % 3) * 30, 60, 24, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawWindow(x, y, w, h) {
    if (x + w < 0 || x > CANVAS_W) return;
    ctx.fillStyle = "#7c5a37";
    ctx.fillRect(x - 6, y - 6, w + 12, h + 12);
    ctx.fillStyle = "#bfe3f2";
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = "#7c5a37";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x + w / 2, y);
    ctx.lineTo(x + w / 2, y + h);
    ctx.moveTo(x, y + h / 2);
    ctx.lineTo(x + w, y + h / 2);
    ctx.stroke();
  }

  function drawOutlet(x, y) {
    if (x < -40 || x > CANVAS_W + 40) return;
    ctx.fillStyle = "#e9e2d6";
    ctx.beginPath();
    ctx.roundRect(x - 14, y -20, 28, 40, 4);
    ctx.fill();
    ctx.strokeStyle = "#a89f8f";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = "#333333";
    ctx.fillRect(x - 6, y -10, 3, 8);
    ctx.fillRect(x + 3, y -10, 3, 8);
    ctx.beginPath();
    ctx.arc(x, y + 6, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawHouseBackground() {
    ctx.fillStyle = "#f1e3cf";
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    // baseboard strip near the floor
    ctx.fillStyle = "#e3cca4";
    ctx.fillRect(0, GROUND_Y - 36, CANVAS_W, 36);

    for (let i = 0; i < 6; i++) {
      const wx = (i * 380 - camera * 0.4) % (CANVAS_W + 500) - 250;
      drawWindow(wx, 60, 120, 150);
    }
    for (let i = 0; i < 9; i++) {
      const ox = (i * 300 - camera * 0.7) % (CANVAS_W + 400) - 200;
      drawOutlet(ox, GROUND_Y - 65);
    }
  }

  function drawBackground() {
    if (current.theme === "house") {
      drawHouseBackground();
    } else {
      drawSkyBackground();
    }
  }

  function drawSurfaces() {
    const isHouse = current.theme === "house";
    const groundColor = isHouse ? "#a9784a" : "#caa06b";
    const groundEdge = isHouse ? "#8a5f38" : "#a97e4c";
    current.surfaces.forEach((s) => {
      const x = s.x - camera;
      if (x + s.width < 0 || x > CANVAS_W) return;
      if (s.isGround) {
        ctx.fillStyle = groundColor;
        ctx.fillRect(x, s.y, s.width, Math.min(s.height, CANVAS_H - s.y));
        ctx.fillStyle = groundEdge;
        ctx.fillRect(x, s.y, s.width, 8);
        if (isHouse) {
          // plank lines
          ctx.strokeStyle = "rgba(0,0,0,0.12)";
          ctx.lineWidth = 1;
          for (let px = 40; px < s.width; px += 60) {
            ctx.beginPath();
            ctx.moveTo(x + px, s.y + 8);
            ctx.lineTo(x + px, Math.min(s.y + s.height, CANVAS_H));
            ctx.stroke();
          }
        }
      } else {
        ctx.fillStyle = "#8f6b4a";
        ctx.fillRect(x, s.y, s.width, s.height);
        ctx.fillStyle = "#d9c39f";
        ctx.fillRect(x, s.y, s.width, 4);
      }
    });
  }

  function drawCord(cord) {
    const x = cord.x - camera;
    if (x + cord.width < 0 || x > CANVAS_W) return;
    ctx.strokeStyle = "#1a1a1a";
    ctx.lineWidth = 6;
    ctx.lineCap = "round";
    ctx.beginPath();
    const midY = cord.y + cord.height / 2;
    ctx.moveTo(x, cord.y + cord.height);
    ctx.quadraticCurveTo(x + cord.width * 0.25, cord.y - 4, x + cord.width * 0.5, midY);
    ctx.quadraticCurveTo(x + cord.width * 0.75, cord.y + cord.height + 4, x + cord.width, cord.y);
    ctx.stroke();
    // little plug ends
    ctx.fillStyle = "#333333";
    ctx.fillRect(x - 3, cord.y + cord.height - 6, 8, 8);
    ctx.fillRect(x + cord.width - 5, cord.y - 2, 8, 8);
  }

  function drawChuru(c) {
    if (c.collected) return;
    const x = c.x - camera;
    if (x < -30 || x > CANVAS_W + 30) return;
    const bob = Math.sin((Date.now() / 260 + c.x) % (Math.PI * 2)) * 4;
    const y = c.y + bob;
    // pouch
    ctx.fillStyle = "#d8d8d8";
    ctx.beginPath();
    ctx.roundRect(x - 9, y - 16, 18, 22, 6);
    ctx.fill();
    ctx.fillStyle = "#f2a341";
    ctx.beginPath();
    ctx.roundRect(x - 9, y - 2, 18, 8, 3);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x - 3, y - 22, 6, 8);
  }

  function drawGoal() {
    const x = current.goal.x - camera;
    if (x < -60 || x > CANVAS_W + 60) return;
    const y = current.goal.y;
    // pole
    ctx.strokeStyle = "#1a1a1a";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y - 90);
    ctx.stroke();
    // yarn ball
    ctx.fillStyle = "#c0508a";
    ctx.beginPath();
    ctx.arc(x, y - 100, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#8f3868";
    ctx.lineWidth = 2;
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.arc(x, y - 100, 20, (i / 5) * Math.PI * 2, (i / 5) * Math.PI * 2 + 2.4);
      ctx.stroke();
    }
  }

  function drawPlayer() {
    drawRoxy(player.x - camera, player.y, PLAYER_W, PLAYER_H, player.facing);
  }

  function drawPaw(cx, cy, size) {
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.ellipse(cx, cy + size * 0.15, size * 0.5, size * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();
    const toePositions = [-0.5, -0.17, 0.17, 0.5];
    toePositions.forEach((t) => {
      ctx.beginPath();
      ctx.ellipse(cx + t * size, cy - size * 0.45, size * 0.16, size * 0.2, 0, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function currentElapsedMs() {
    if (runStartTime === null) return 0;
    if (state === "gameOver" || state === "win") return frozenElapsedMs;
    return performance.now() - runStartTime;
  }

  function drawHUD() {
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.fillRect(0, 0, CANVAS_W, 60);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 16px Inter, sans-serif";
    ctx.textBaseline = "middle";
    ctx.fillText(`Level ${levelIndex + 1}/${LEVELS.length}`, 16, 18);
    ctx.fillText(`Score: ${score}`, 190, 18);
    const collected = current.churus.filter((c) => c.collected).length;
    ctx.fillText(`Churus: ${collected}/${churuTotalThisLevel}`, 340, 18);

    ctx.fillText(`Time: ${formatTime(currentElapsedMs())}`, 16, 44);
    ctx.fillText("Lives:", 220, 44);
    for (let i = 0; i < Math.max(0, lives); i++) {
      drawPaw(288 + i * 26, 44, 9);
    }
  }

  function draw() {
    drawBackground();
    drawSurfaces();
    current.cords.forEach(drawCord);
    current.enemies.forEach((e) => {
      if (!e.defeated) drawEnemy(e);
    });
    current.churus.forEach(drawChuru);
    drawGoal();
    drawPlayer();
    drawHUD();
  }

  function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);

  // Test hook only — lets automated checks inspect/drive game state
  // without affecting normal play. No UI surfaces this.
  window.__roxyDebug = {
    getState: () => ({
      state,
      levelIndex,
      score,
      lives,
      playerX: player.x,
      playerY: player.y,
      onGround: player.onGround,
      churusCollected: current.churus.filter((c) => c.collected).length,
      churuTotal: churuTotalThisLevel,
      enemiesDefeated: current.enemies.filter((e) => e.defeated).length,
      enemyCount: current.enemies.length,
      totalChurusThisRun,
      elapsedMs: currentElapsedMs()
    }),
    skipToLevel: (index) => {
      if (runStartTime === null) runStartTime = performance.now();
      state = "playing";
      hideOverlay();
      loadLevel(index);
    },
    getLeaderboard: () => loadLeaderboard(),
    clearLeaderboard: () => {
      saveLeaderboard([]);
      renderLeaderboard([], -1);
    },
    teleportNearGoal: () => {
      player.x = current.goal.x - PLAYER_W - 4;
      player.y = GROUND_Y - PLAYER_H;
      player.vy = 0;
    },
    teleportOntoCord: (i) => {
      const cord = current.cords[i];
      player.x = cord.x;
      player.y = GROUND_Y - PLAYER_H;
      player.vy = 0;
    },
    teleportOntoChuru: (i) => {
      const churu = current.churus[i];
      player.x = churu.x - PLAYER_W / 2;
      player.y = churu.y - PLAYER_H / 2;
      player.vy = 0;
    },
    teleportBesideEnemy: (i) => {
      const e = current.enemies[i];
      player.x = e.x - PLAYER_W - 2;
      player.y = GROUND_Y - PLAYER_H;
      player.vy = 0;
    },
    teleportAboveEnemy: (i) => {
      const e = current.enemies[i];
      player.x = e.x;
      player.y = GROUND_Y - ENEMY_H - PLAYER_H;
      player.vy = 5;
    },
    teleportTo: (x, y) => {
      player.x = x;
      player.y = y;
      player.vy = 0;
      player.vx = 0;
    },
    getPlatforms: () => current.surfaces.filter((s) => !s.isGround),
    resetForTest: () => {
      lives = TOTAL_LIVES;
      score = 0;
    }
  };
})();
