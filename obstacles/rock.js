import { ctx } from '../canvas.js';
import global from '../global.js';

/* ROCK OBSTACLE CLASS */
export default class Rock {
  constructor(x, y, w, h, rockImg) {
    this.rockImg = rockImg;
    this.x = x + w / 4;
    this.y = y + h / 1.7;
    this.originalW = w;
    this.originalH = h;
    this.w = w;
    this.h = h;

    this.dx = -global.gameSpeed;
    rockImg.width = this.w;
    rockImg.height = this.h;
  }

  update() {
    this.x += this.dx;
    this.dx = -global.gameSpeed;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = 'rgba(0, 0, 0, 0)';
    ctx.fillRect(this.x, this.y, this.w, this.h);
    ctx.drawImage(
      this.rockImg,
      this.x - this.w * 0.2, // MULTIPLIERS TO TWEAK COLLISION AREA
      this.y - this.h * 0.5,
      this.w + this.w * 0.3,
      this.h + this.h * 0.8,
    );
    ctx.closePath();
  }
}
