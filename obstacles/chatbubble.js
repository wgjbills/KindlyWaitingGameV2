/* eslint-disable no-tabs */
/* eslint-disable indent */
/* eslint-disable linebreak-style */
import { ctx } from '../canvas.js';
import global from '../global.js';

export default /* CHATBUBBLE OBSTACLE CLASS */
class Obstacle {
  constructor(x, y, w, h, obsImg) {
    this.obsImg = obsImg;
    (this.x = x);
    (this.y = y);
    (this.w = w);
    (this.h = h);

    this.dx = -global.gameSpeed; // OBSTACLE MOVEMENT
    obsImg.width = this.w;
    obsImg.height = this.h;
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
      this.obsImg,
      this.x,
      this.y,
      this.w * 1.1,
      this.h,
    );
    ctx.closePath();
  }
}
