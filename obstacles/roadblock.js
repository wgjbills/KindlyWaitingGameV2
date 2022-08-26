import { ctx } from '../canvas.js';
import global from '../global.js';

/* ROADBLOCK OBSTACLE CLASS */
export default class Roadblock {
	constructor(x, y, w, h, roadblockImg) {
		this.roadblockImg = roadblockImg;
		(this.x = x);
		(this.y = y);
		(this.w = w);
		(this.h = h);

		this.dx = -global.gameSpeed;
		roadblockImg.width = this.w;
		roadblockImg.height = this.h;
	}

	update() {
		this.x += this.dx;
		this.dx = -global.gameSpeed;
	}

	draw() {
		ctx.beginPath();
		ctx.fillStyle = 'rgba(0, 0, 0, 0)';
		ctx.fillRect(this.x, this.y + (this.h / 3), this.w, this.h);
		ctx.drawImage(
			this.roadblockImg,
			this.x,
			this.y - this.h * 0.1,
			this.w,
			this.h * 1.25,
		);
		ctx.closePath();
	}
}
