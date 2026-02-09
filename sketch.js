let img = null;
let colorArray;
let afterImage;
let currentEffect = 'invert';
let canvasOrigin = { x: 0, y: 0, w: 0, h: 0 };

function setup() {
  const cnv = createCanvas(window.innerWidth, window.innerHeight);
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
      resizeCanvas(window.innerWidth, window.innerHeight);
      setPlaceholderVisible(false);
      initializeFromImage();
    });
  };
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
  if (img) {
    initializeFromImage();
  }
}

function initializeFromImage() {
  background(0);

  const scale = Math.min(width / img.width, height / img.height, 1);
  const displayW = Math.floor(img.width * scale);
  const displayH = Math.floor(img.height * scale);
  const x = Math.floor((width - displayW) / 2);
  const y = Math.floor((height - displayH) / 2);

  canvasOrigin = { x, y, w: displayW, h: displayH };

  image(img, x, y, displayW, displayH);

  colorArray = make2dArray(displayW, displayH);
  afterImage = new AfterImage(colorArray, x, y, displayW, displayH);
  afterImage.copyImage();

  applyCurrentEffect();
}

function applyCurrentEffect() {
  if (!afterImage) return;

  // Reset from original image before applying the selected effect
  image(img, canvasOrigin.x, canvasOrigin.y, canvasOrigin.w, canvasOrigin.h);
  afterImage.copyImage();

  const ppp = Math.max(1, Math.floor(canvasOrigin.w / 32));

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
