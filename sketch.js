let img;
let pixelData;
let colorArray;
let afterImage;

function preload() {
  img = loadImage("./pic.jpeg", img => {
    if (img.width % 2 != 0) {
      img.width++;
    } else if (img.height % 2 != 0) {
      img.height++;
    }
  });
}

function setup() {
  createCanvas(img.width * 2, img.height);
  
  image(img, 0, 0, width / 2, height);
  
  colorArray = make2dArray(width / 2, height);
  afterImage = new AfterImage(colorArray, width / 2, 0);
  afterImage.fillArray();
  afterImage.pixelate(4);
  //afterImage.blackAndWhite(false);
  //afterImage.makeCutLines();
}

function draw() {
  background(220);
  image(img, 0, 0, width / 2, height);
  afterImage.render();
}

const make2dArray = (rows, cols) => {
  let arr = new Array(rows);

  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(cols);
  }

  return arr;
}
