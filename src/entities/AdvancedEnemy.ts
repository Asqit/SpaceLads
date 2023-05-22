import { Maths } from "~/utils/Math";
import { Entity } from "./Entity";
import { Game } from "~/Game";
import player from "./Player";

export class AdvancedEnemy extends Entity {
	private color: string = "#ff0000";
	private speed: number = 250;

	constructor() {
		const x = Maths.rand(0, Game.WIDTH);
		const y = 0;

		super(x, y, 32, 32, "ADVANCED_ENEMY");
	}

	public update(step: number): void {
		let dirx = player.x - this.x;
		let diry = player.y - this.y;
		let hyp = Math.sqrt(dirx * dirx + diry * diry);

		if (hyp) {
			dirx = dirx / hyp;
			diry = diry / hyp;
		}

		this.x += dirx * this.speed * step;
		this.y += diry * this.speed * step;
	}

	public render(step: number, ctx: CanvasRenderingContext2D): void {
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.w, this.h);
	}
}
