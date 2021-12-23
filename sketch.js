let img;
let pixelData;
let colorArray;
let afterImage;

function preload() {
  img = loadImage("./pic.jpeg");
}

function setup() {  
  const cnv = createCanvas(window.innerWidth, window.innerHeight);
  
  image(img, 0, 0);
  
  let ppp = floor(img.width / 8);
  
  colorArray = make2dArray(img.width, img.height);
  afterImage = new AfterImage(colorArray, img.width, 0, img.width, img.height);
  afterImage.copyImage();
  //afterImage.blackAndWhite(false);
  //afterImage.makeCutLines();
  afterImage.pixelate(ppp);
  
  afterImage.render();
}

const make2dArray = (rows, cols) => {
  let arr = new Array(rows);

  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(cols);
  }

  return arr;
}
