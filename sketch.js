let img;
let pixelData;
let colorArray;
let afterImage;

function preload() {
  img = loadImage("./pic.jpeg");
}

function setup() {  
  const cnv = createCanvas(window.innerWidth, window.innerHeight);
  
  pixelDensity(1);
  
  image(img, 0, 0);
  
  let ppp = floor(img.width / 32);
  
  colorArray = make2dArray(img.width, img.height);
  afterImage = new AfterImage(colorArray, img.width, 0, img.width, img.height);
  afterImage.copyImage();
  //afterImage.roundColors(2);
  afterImage.invertColors();
  //afterImage.flip();
  //afterImage.scramble(10000);
  //afterImage.rainbowStatic(0, 100);
  //afterImage.onlyMainColors(70);
  //afterImage.grayScale();
  //afterImage.pixelate(ppp);
  //afterImage.blackAndWhite(false);
  //afterImage.makeCutLines();
  
  afterImage.render();
}

function draw() {
  //afterImage.scramble(500);
  //afterImage.render();
}

const make2dArray = (rows, cols) => {
  let arr = new Array(rows);

  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(cols);
  }

  return arr;
}
