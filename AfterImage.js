class AfterImage {
  constructor(pixels, x, y, w, h, sourceX = 0, sourceY = 0) {
    this.pixels = pixels;
    this.pos = createVector(x, y);
    this.w = w;
    this.h = h;
    // Where to sample pixels from on the canvas
    this.sourceX = sourceX;
    this.sourceY = sourceY;
  }

  render() {
    for (let i = 0; i < this.w; i++) {
      for (let j = 0; j < this.h; j++) {
        strokeWeight(1);
        stroke(this.pixels[i][j][0], this.pixels[i][j][1], this.pixels[i][j][2], this.pixels[i][j][3])
        point(i + this.pos.x, j + this.pos.y);
      }
    }
  }

  copyImage() {
    const ctx = canvas.getContext('2d');
    for (let i = 0; i < this.w; i++) {
      for (let j = 0; j < this.h; j++) {
        this.pixels[i][j] = ctx.getImageData(this.sourceX + i, this.sourceY + j, 1, 1).data;
      }
    }
  }
  
  roundColors(place) {
    for (let i = 0; i < this.w; i++) {
      for (let j = 0; j < this.h; j++) {
        let pixel = this.pixels[i][j];
        
        let newR = tenPowNRound(pixel[0], place);
        let newG = tenPowNRound(pixel[1], place);
        let newB = tenPowNRound(pixel[2], place);
        
        this.pixels[i][j][0] = newR;
        this.pixels[i][j][1] = newG;
        this.pixels[i][j][2] = newB;
      }
    }
  }
  
  invertColors() {
    for (let i = 0; i < this.w; i++) {
      for (let j = 0; j < this.h; j++) {
        let pixel = this.pixels[i][j];
        
        let newR = 255 - pixel[0];
        let newG = 255 - pixel[1];
        let newB = 255 - pixel[2];
        
        this.pixels[i][j][0] = newR;
        this.pixels[i][j][1] = newG;
        this.pixels[i][j][2] = newB;
      }
    }
  }
  
  flip() {
    for (let i = 0; i < this.w / 2; i++) {
      for (let j = 0; j < this.h; j++) {
        let newX = this.w - 1 - i;
        
        let ogPixel = this.pixels[i][j];
        let newPixel = this.pixels[newX][j];
        
        this.pixels[i][j] = newPixel;
        this.pixels[newX][j] = ogPixel;
      }
    }
  }
  
  scramble(rounds) {
    for (let r = 0; r < rounds; r++) {
      let i1 = floor(random(this.w));
      let j1 = floor(random(this.h));
      let pixel1 = this.pixels[i1][j1];

      let i2 = floor(random(this.w));
      let j2 = floor(random(this.h));
      let pixel2 = this.pixels[i2][j2];

      this.pixels[i1][j1] = pixel2;
      this.pixels[i2][j2] = pixel1;
    }
  }
  
  rainbowStatic(min, max) {
    for (let i = 0; i < this.w; i++) {
      for (let j = 0; j < this.h; j++) {
        for (let col = 0; col < 3; col++) {
          this.pixels[i][j][col] += round(random(min, max));
        }
      }
    }
  }
  
  onlyMainColors(threshold) {
    for (let i = 0; i < this.w; i++) {
      for (let j = 0; j < this.h; j++) {
        for (let col = 0; col < 3; col++) {
          if (this.pixels[i][j][col] > threshold) {
            this.pixels[i][j][col] = 255;
          } else {
            this.pixels[i][j][col] = 0;
          }
        }
      }
    }
  }

  pixelate(ppp) {
    let avg = [0, 0, 0];
    let last = false;
    let remainder = createVector(this.w % ppp, this.h % ppp);

    for (let xoff = 0; xoff < this.w / ppp; xoff++) {
      for (let yoff = 0; yoff < this.h / ppp; yoff++) {
        for (let i = ppp * xoff; i < ppp + ppp * xoff; i++) {
          for (let j = ppp * yoff; j < ppp + ppp * yoff; j++) {
            if (j < this.h && i < this.w) {
              avg[0] += this.pixels[i][j][0];
              avg[1] += this.pixels[i][j][1];
              avg[2] += this.pixels[i][j][2];
              last = false;
            } else {
              last = true;
              break;
            }
          }
        }

        if (last === true) {
          avg[0] /= (remainder.x * remainder.y);
          avg[1] /= (remainder.x * remainder.y);
          avg[2] /= (remainder.x * remainder.y);
        } else {
          avg[0] /= (ppp * ppp);
          avg[1] /= (ppp * ppp);
          avg[2] /= (ppp * ppp);
        }


        for (let i = ppp * xoff; i < ppp + ppp * xoff; i++) {
          for (let j = ppp * yoff; j < ppp + ppp * yoff; j++) {
            if (j < this.h && i < this.w) {
              this.pixels[i][j][0] = avg[0];
              this.pixels[i][j][1] = avg[1];
              this.pixels[i][j][2] = avg[2];
            } else {
              break;
            }
          }
        }

        avg[0] = 0;
        avg[1] = 0;
        avg[2] = 0;
      }
    }
  }
  
  grayScale() {
    for (let i = 0; i < this.w; i++) {
      for (let j = 0; j < this.h; j++) {
        let r = this.pixels[i][j][0];
        let g = this.pixels[i][j][1];
        let b = this.pixels[i][j][2];
        
        let avg = (r + g + b) / 3;
        
        this.pixels[i][j][0] = avg;
        this.pixels[i][j][1] = avg;
        this.pixels[i][j][2] = avg;
      }
    }
  }

  blackAndWhite(inverse) {
    for (let i = 0; i < this.w; i++) {
      for (let j = 0; j < this.h; j++) {
        if ((this.pixels[i][j][0] + this.pixels[i][j][1] + this.pixels[i][j][2]) < 383 && inverse === false) {
          this.pixels[i][j][0] = 0;
          this.pixels[i][j][1] = 0;
          this.pixels[i][j][2] = 0;
        } else if ((this.pixels[i][j][0] + this.pixels[i][j][1] + this.pixels[i][j][2]) >= 383 && inverse === false) {
          this.pixels[i][j][0] = 255;
          this.pixels[i][j][1] = 255;
          this.pixels[i][j][2] = 255;
        }

        if ((this.pixels[i][j][0] + this.pixels[i][j][1] + this.pixels[i][j][2]) < 383 && inverse === true) {
          this.pixels[i][j][0] = 255;
          this.pixels[i][j][1] = 255;
          this.pixels[i][j][2] = 255;
        } else if ((this.pixels[i][j][0] + this.pixels[i][j][1] + this.pixels[i][j][2]) >= 383 && inverse === true) {
          this.pixels[i][j][0] = 0;
          this.pixels[i][j][1] = 0;
          this.pixels[i][j][2] = 0;
        }
      }
    }
  }

  makeCutLines() {
    let count = 0;

    for (let i = 0; i < this.w; i++) {
      for (let j = 0; j < this.h; j++) {
        if (this.pixels[i][j][0] === 0) {
          for (let xoff = -1; xoff <= 1; xoff++) {
            for (let yoff = -1; yoff <= 1; yoff++) {
              let check = createVector(i + xoff, j + yoff);
              if (check.x > -1 && check.x < this.w && check.y > -1 && check.y < this.h) {
                if (this.pixels[i + xoff][j + yoff][0] === 255 && this.pixels[i + xoff][j + yoff][1] === 255 && this.pixels[i + xoff][j + yoff][2] === 255) {
                  count++;
                }
              }
            }
          }
        }

        if (count > 0) {
          this.pixels[i][j][0] = 255;
        }

        count = 0;
      }
    }
  }
}

// Return a number rounded to tens, hundredth, etc
function tenPowNRound(num, n) {
  return round(num / Math.pow(10, n)) * Math.pow(10, n);
}
