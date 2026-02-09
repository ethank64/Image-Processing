let img = null;
let colorArray;
let afterImage;
let currentEffect = 'invert';
let originalRect = { x: 0, y: 0, w: 0, h: 0 };
let processedRect = { x: 0, y: 0, w: 0, h: 0 };

function getCanvasSize() {
  const wrapper = document.querySelector('.canvas-wrapper');
  if (!wrapper) return { w: window.innerWidth, h: window.innerHeight };
  return { w: wrapper.clientWidth, h: wrapper.clientHeight };
}

function setup() {
  const { w, h } = getCanvasSize();
  const cnv = createCanvas(w, h);
  cnv.parent(document.querySelector('.canvas-wrapper'));
  pixelDensity(1);

  background(3, 6, 24);

  // Expose hooks for the UI
  window.setEffect = (effect) => {
    currentEffect = effect;
  };

  window.applyEffect = () => {
    applyCurrentEffect();
  };

  const placeholder = document.querySelector('.canvas-placeholder');
  const setPlaceholderVisible = (visible) => {
    if (!placeholder) return;
    placeholder.style.opacity = visible ? '1' : '0';
  };

  setPlaceholderVisible(true);

  window.loadUserImage = (dataUrl) => {
    loadImage(dataUrl, (loaded) => {
      img = loaded;
      const { w, h } = getCanvasSize();
      resizeCanvas(w, h);
      setPlaceholderVisible(false);
      initializeFromImage();
    });
  };
}

function windowResized() {
  const { w, h } = getCanvasSize();
  resizeCanvas(w, h);
  if (img) {
    initializeFromImage();
  }
}

function initializeFromImage() {
  background(0);

  // We want original on the left, processed on the right, same size
  const halfWidth = width / 2;
  const scale = Math.min(halfWidth / img.width, height / img.height, 1);
  const displayW = Math.floor(img.width * scale);
  const displayH = Math.floor(img.height * scale);

  const originalX = Math.floor((halfWidth - displayW) / 2);
  const y = Math.floor((height - displayH) / 2);
  const processedX = Math.floor(halfWidth + (halfWidth - displayW) / 2);

  originalRect = { x: originalX, y, w: displayW, h: displayH };
  processedRect = { x: processedX, y, w: displayW, h: displayH };

  // Draw original on the left
  image(img, originalRect.x, originalRect.y, originalRect.w, originalRect.h);

  // Prepare AfterImage to render into the right half
  colorArray = make2dArray(displayW, displayH);
  afterImage = new AfterImage(colorArray, processedRect.x, processedRect.y, displayW, displayH);
  afterImage.copyImage();
}

function applyCurrentEffect() {
  if (!img || !afterImage) return;

  // Always redraw the original on the left
  image(img, originalRect.x, originalRect.y, originalRect.w, originalRect.h);

  // Clear the processed area
  push();
  noStroke();
  fill(0);
  rect(processedRect.x, processedRect.y, processedRect.w, processedRect.h);
  pop();

  if (currentEffect === 'original') {
    // No processed version, just show original
    return;
  }

  // Copy the pixels from the processed region before applying effects
  afterImage.copyImage();

  const ppp = Math.max(1, Math.floor(processedRect.w / 32));

  switch (currentEffect) {
    case 'round':
      afterImage.roundColors(2);
      break;
    case 'flip':
      afterImage.flip();
      break;
    case 'scramble':
      afterImage.scramble(10000);
      break;
    case 'rainbow':
      afterImage.rainbowStatic(0, 100);
      break;
    case 'mainColors':
      afterImage.onlyMainColors(70);
      break;
    case 'grayscale':
      afterImage.grayScale();
      break;
    case 'bw':
      afterImage.blackAndWhite(false);
      break;
    case 'bwInverse':
      afterImage.blackAndWhite(true);
      break;
    case 'pixelate':
      afterImage.pixelate(ppp);
      break;
    case 'cutLines':
      afterImage.makeCutLines();
      break;
    case 'invert':
    default:
      afterImage.invertColors();
      break;
  }

  afterImage.render();
}

function draw() {
  // Rendering handled via canvas + HTML placeholder; no per-frame drawing needed.
}

const make2dArray = (rows, cols) => {
  let arr = new Array(rows);

  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(cols);
  }

  return arr;
};
