import { Vector2D } from "~/utils/Math";
import { Entity } from "./Entity";
import { Game } from "~/Game";

export class Particle extends Entity {
	private direction: Vector2D = new Vector2D(0, 0);
	private color: string = "#ffffff";

	constructor(x: number, y: number, w: number, h: number, color: string, direction: Vector2D, killAfter?: number) {
		super(x, y, w, h, "PARTICLE");
		this.direction = direction;
		this.color = color;

		if (killAfter) {
			setTimeout(() => (this.isActive = false), killAfter);
		}
	}

	public update(step: number): void {
		if (this.x < 0) this.isActive = false;
		if (this.x > Game.WIDTH) this.isActive = false;
		if (this.y < 0) this.isActive = false;
		if (this.y > Game.HEIGHT) this.isActive = false;

		this.x += this.direction.x * step;
		this.y += this.direction.y * step;
	}

	public render(step: number, ctx: CanvasRenderingContext2D): void {
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.w, this.h);
	}
}
