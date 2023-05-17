import { Maths } from "~/utils/Math";
import { Entity } from "./Entity";
import { Game } from "~/Game";
import { Color } from "~/utils/Color";

export class Star extends Entity {
	private speed: number = Maths.rand(50, 250);

	constructor() {
		const w = Maths.randInt(2, 8);
		const h = w;
		const x = Maths.randInt(0, Game.WIDTH - w);
		const y = Maths.randInt(0, Game.HEIGHT);

		super(x, y, w, h, "STAR");
	}

	update(step: number): void {
		if (this.y > Game.HEIGHT) {
			this.y = -400;
		}

		this.y += this.speed * step;
	}

	render(step: number, ctx: CanvasRenderingContext2D): void {
		ctx.fillStyle = Color["yellow-1"];
		ctx.fillRect(this.x, this.y, this.w, this.h);
	}
}