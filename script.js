// ------- ascii art -------
let CELL_SIZE = 8;
let CELL_GAP = 2;
let CELL_STEP = CELL_SIZE + CELL_GAP;
const GRID_COLOR = "#171717";
const CHAT_COLOR = "#dadada";
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
// ------- ascii art -------
