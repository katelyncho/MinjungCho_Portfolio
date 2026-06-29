// ------- typewriter effect -------
const nameTitleText = document.querySelector(".nameTitle h2");

const typewriterParts = [
  { text: 'print ("Hello, World!' },
  { br: true },
  { text: "I'm " },
  { text: "Minjung Cho", className: "font2" },
  { br: true },
  { text: "Technical Artist," },
  { br: true },
  { text: 'creating anything I like.")' },
];

let typePartIndex = 0;
let typeCharIndex = 0;
let currentTarget = null;

const typeSpeed = 55;

if (nameTitleText) {
  nameTitleText.innerHTML = "";

  const cursor = document.createElement("span");
  cursor.className = "typeCursor";
  cursor.textContent = "|";
  nameTitleText.appendChild(cursor);

  function typeNameTitle() {
    const currentPart = typewriterParts[typePartIndex];

    if (!currentPart) return;

    if (currentPart.br) {
      nameTitleText.insertBefore(document.createElement("br"), cursor);
      typePartIndex++;
      typeCharIndex = 0;
      currentTarget = null;
      setTimeout(typeNameTitle, typeSpeed);
      return;
    }

    if (!currentTarget) {
      currentTarget = currentPart.className
        ? document.createElement("span")
        : document.createTextNode("");

      if (currentPart.className) {
        currentTarget.className = currentPart.className;
      }

      nameTitleText.insertBefore(currentTarget, cursor);
    }

    if (typeCharIndex < currentPart.text.length) {
      if (currentTarget.nodeType === Node.TEXT_NODE) {
        currentTarget.textContent += currentPart.text[typeCharIndex];
      } else {
        currentTarget.textContent += currentPart.text[typeCharIndex];
      }

      typeCharIndex++;
      setTimeout(typeNameTitle, typeSpeed);
    } else {
      typePartIndex++;
      typeCharIndex = 0;
      currentTarget = null;
      setTimeout(typeNameTitle, typeSpeed);
    }
  }

  typeNameTitle();
}
// ------- typewriter effect -------

// ------- water droop -------
const waterClipPath = document.getElementById("waterClipPath");
const waterTintPath = document.getElementById("waterTintPath");
const waterGif = document.getElementById("waterGif");

let waterStartTime = null;

function buildWaterPath(progress) {
  const w = 1000;
  const h = 420;

  const topY = -80;
  // change last number to change total drooping distance
  const baseY = -40 + progress * h * 0.6;

  const leftX = 0;
  const rightX = w;

  const droop1X = w * 0.18;
  const droop2X = w * 0.5;
  const droop3X = w * 0.8;

  const droop1Y = baseY + 60 + Math.sin(progress * Math.PI * 2) * 18;
  const droop2Y = baseY + 130 + Math.sin(progress * Math.PI * 2 + 1.5) * 30;
  const droop3Y = baseY + 80 + Math.sin(progress * Math.PI * 2 + 3) * 22;

  return `
    M ${leftX} ${topY}
    L ${rightX} ${topY}
    L ${rightX} ${baseY}

    C ${w * 0.9} ${baseY + 30}, ${w * 0.86} ${droop3Y}, ${droop3X} ${droop3Y}
    C ${w * 0.7} ${droop3Y}, ${w * 0.66} ${baseY + 35}, ${w * 0.6} ${baseY + 45}

    C ${w * 0.56} ${baseY + 55}, ${w * 0.58} ${droop2Y}, ${droop2X} ${droop2Y}
    C ${w * 0.42} ${droop2Y}, ${w * 0.44} ${baseY + 55}, ${w * 0.36} ${baseY + 45}

    C ${w * 0.3} ${baseY + 35}, ${w * 0.32} ${droop1Y}, ${droop1X} ${droop1Y}
    C ${w * 0.12} ${droop1Y}, ${w * 0.1} ${baseY + 30}, ${leftX} ${baseY}

    Z
  `;
}

function animateWater(timestamp) {
  if (!waterClipPath) return;

  if (!waterStartTime) {
    waterStartTime = timestamp;
  }

  const elapsed = timestamp - waterStartTime;
  // speed of water drooping
  const duration = 8000;

  const rawProgress = Math.min(elapsed / duration, 1);
  const progress = 1 - Math.pow(1 - rawProgress, 3);

  const path = buildWaterPath(progress);

  waterClipPath.setAttribute("d", path);

  if (waterTintPath) {
    waterTintPath.setAttribute("d", path);
  }

  if (rawProgress < 1) {
    requestAnimationFrame(animateWater);
  }
}

requestAnimationFrame(animateWater);
// ------- water droop -------

// ------- ascii art -------
let CELL_SIZE = 8;
let CELL_GAP = 2;
let CELL_STEP = CELL_SIZE + CELL_GAP;
const GRID_COLOR = "#171717";
const CHAR_COLOR = "#dadada";
// const ASCII_CHARS = ".:-=+*#%@";
const ASCII_CHARS = ".:+*#%@0369";
const THRESHOLD = 0.5;
const PUSH_RADIUS = 5;
const PUSH_FORCE = 30;
const SPRING = 0.025;
const DAMPING = 0.5;

const canvas = document.getElementById("grid");
const ctx = canvas.getContext("2d", { alpha: true });
const dpr = window.devicePixelRatio || 1;
const logoImg = document.getElementById("source");

let cols,
  rows,
  cells = [];

function setupCanvas() {
  CELL_SIZE = window.innerWidth < 768 ? 3 : 8;
  CELL_GAP = window.innerWidth < 768 ? 1 : 2;
  CELL_STEP = CELL_SIZE + CELL_GAP;
  cols = Math.floor(window.innerWidth / CELL_STEP);
  rows = Math.floor(window.innerHeight / CELL_STEP);
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function drawGrid() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  ctx.fillStyle = GRID_COLOR;
  for (let row = 0; row < rows; row++)
    for (let col = 0; col < cols; col++)
      ctx.fillRect(col * CELL_STEP, row * CELL_STEP, CELL_SIZE, CELL_SIZE);
}

setupCanvas();
drawGrid();

function sampleLogoIntoCells() {
  const rect = logoImg.getBoundingClientRect();
  const logoCols = Math.ceil(rect.width / CELL_STEP);
  const logoRows = Math.ceil(rect.height / CELL_STEP);
  const startCol = Math.floor(rect.left / CELL_STEP);
  const startRow = Math.floor(rect.top / CELL_STEP);

  const sampleCanvas = document.createElement("canvas");
  sampleCanvas.width = logoCols;
  sampleCanvas.height = logoRows;
  const sampleCtx = sampleCanvas.getContext("2d");
  sampleCtx.fillStyle = "#000";
  sampleCtx.fillRect(0, 0, logoCols, logoRows);
  sampleCtx.drawImage(logoImg, 0, 0, logoCols, logoRows);
  const { data } = sampleCtx.getImageData(0, 0, logoCols, logoRows);

  cells = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const inLogo =
        col >= startCol &&
        col < startCol + logoCols &&
        row >= startRow &&
        row < startRow + logoRows;
      let isLit = false,
        char = " ";
      if (inLogo) {
        const idx = ((row - startRow) * logoCols + (col - startCol)) * 4;
        const brightness =
          (data[idx] * 0.299 + data[idx + 1] * 0.587 + data[idx + 2] * 0.144) /
          255;
        isLit = brightness > THRESHOLD;
        char = isLit
          ? ASCII_CHARS[
              Math.min(
                ASCII_CHARS.length - 1,
                Math.floor(brightness * ASCII_CHARS.length),
              )
            ]
          : " ";
      }
      cells.push({
        col,
        row,
        char,
        isLit,
        offsetX: 0,
        offsetY: 0,
        velX: 0,
        velY: 0,
      });
    }
  }
}

function renderFrame() {
  ctx.font = `${CELL_SIZE + 2}px monospace`;
  ctx.textBaseline = "top";
  ctx.textAlign = "center";
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  ctx.fillStyle = GRID_COLOR;
  for (const { col, row } of cells)
    ctx.fillRect(col * CELL_STEP, row * CELL_STEP, CELL_SIZE, CELL_SIZE);

  ctx.fillStyle = CHAR_COLOR;
  for (const { col, row, char, isLit, offsetX, offsetY } of cells) {
    if (!isLit) continue;
    const x = (col + Math.round(offsetX)) * CELL_STEP;
    const y = (row + Math.round(offsetY)) * CELL_STEP;
    ctx.fillText(char, x + CELL_SIZE / 2, y);
  }
}

function init() {
  setupCanvas();
  sampleLogoIntoCells();
  renderFrame();
}

window.addEventListener("resize", init);
logoImg.complete ? init() : logoImg.addEventListener("load", init);

setInterval(() => {
  for (const cell of cells)
    if (cell.isLit)
      cell.char = ASCII_CHARS[Math.floor(Math.random() * ASCII_CHARS.length)];
  renderFrame();
}, 50);

let mouse = { col: -999, row: -999, isMoving: false };
let idleTimer = null;

function updatePhysics() {
  for (const cell of cells) {
    if (!cell.isLit) continue;
    if (mouse.isMoving) {
      const dx = cell.col + cell.offsetX - mouse.col;
      const dy = cell.row + cell.offsetY - mouse.row;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < PUSH_RADIUS && dist > 0) {
        const force = (1 - dist / PUSH_RADIUS) ** 2 * PUSH_FORCE;
        cell.velX += (dx / dist) * force;
        cell.velY += (dy / dist) * force;
      }
    }
    cell.velX += -cell.offsetX * SPRING;
    cell.velY += -cell.offsetY * SPRING;
    cell.velX *= DAMPING;
    cell.velY *= DAMPING;
    cell.offsetX += cell.velX;
    cell.offsetY += cell.velY;
    if (Math.abs(cell.offsetX) < 0.01 && Math.abs(cell.velX) < 0.01) {
      cell.offsetX = cell.velX = 0;
    }
    if (Math.abs(cell.offsetY) < 0.01 && Math.abs(cell.velY) < 0.01) {
      cell.offsetY = cell.velY = 0;
    }
  }
}

function animationLoop() {
  updatePhysics();
  renderFrame();
  requestAnimationFrame(animationLoop);
}

window.addEventListener("mousemove", (e) => {
  mouse.col = e.clientX / CELL_STEP;
  mouse.row = e.clientY / CELL_STEP;
  mouse.isMoving = true;
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    mouse.isMoving = false;
  }, 50);
});

window.addEventListener("mouseleave", () => {
  mouse.col = mouse.row = -999;
  mouse.isMoving = false;
});

animationLoop();
// ------- ascii art -------
