import { Game } from "~/Game";
import { Entity } from "./Entity";

export class BasicEnemy extends Entity {
	private color: string = "#ff0000";
	private speed: number = 250;

	constructor(x: number, y: number) {
		super(x, y, 32, 32, "BASIC_ENEMY");
		this.isActive = true;
	}

	hit(): void {
		this.isActive = false;
	}

	update(step: number): void {
		if (this.y + this.h > Game.HEIGHT) {
			this.isActive = false;
		}

		this.y += this.speed * step;
	}

	render(step: number, ctx: CanvasRenderingContext2D): void {
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.w, this.h);
	}
}
