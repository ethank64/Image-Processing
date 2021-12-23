class AfterImage {
  constructor(pixels, x, y, w, h) {
    this.pixels = pixels;
    this.pos = createVector(x, y);
    this.w = w;
    this.h = h;
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
    for (let i = 0; i < this.w; i++) {
      for (let j = 0; j < this.h; j++) {
        this.pixels[i][j] = canvas.getContext('2d').getImageData(i, j, 1, 1).data;
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
