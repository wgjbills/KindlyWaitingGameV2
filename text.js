import { ctx } from './canvas.js';

/* SCORE/HIGHSCORE CLASS */
export default class Text {
	constructor(t, x, y, a, c, s) {
		this.t = t;
		this.x = x;
		this.y = y;
		this.a = a;
		this.c = c;
		this.s = s;
	}

	draw() {
		ctx.beginPath();
		ctx.fillStyle = this.c;
		ctx.font = `${this.s}px Courier New`;
		ctx.textAlign = this.a;
		ctx.fillText(this.t, this.x, this.y);
		ctx.closePath();
	}
}
