import { Game } from "~/Game";
import { Entity } from "./Entity";
import { Color } from "~/utils/Color";
import { Vector2D } from "~/utils/Math";

export type LaserOwner = "ENEMY" | "PLAYER";

export class Laser extends Entity {
	private owner: LaserOwner = "PLAYER";
	private color: string = "#ffffff";
	private speed: number = 800;
	private trail: Vector2D[] = [];
	private MAX_TRAIL_LENGTH: number = 10;

	constructor(x: number, y: number, owner: LaserOwner) {
		super(x, y, 4, 16, "LASER");
		this.owner = owner;
		this.color = Color["red-1"];
		this.speed = this.owner === "ENEMY" ? 800 : -800;
	}

	private addTrail() {
		this.trail.push(new Vector2D(this.x, this.y));

		if (this.trail.length > this.MAX_TRAIL_LENGTH) {
			this.trail.shift();
		}
	}

	update(step: number): void {
		if (this.y < 0) {
			this.isActive = false;
		} else if (this.y + this.h > Game.HEIGHT) {
			this.isActive = false;
		}

		this.y += this.speed * step;
		this.addTrail();
	}

	private renderTrail(ctx: CanvasRenderingContext2D) {
		for (let i = 0; i < this.trail.length; i++) {
			let ratio = (i + 1) / this.trail.length;

			ctx.fillStyle = `rgba(255, 0, 0, ${ratio / 2})`;
			ctx.fillRect(this.trail[i].x, this.trail[i].y, this.w, this.h);
		}
	}

	render(step: number, ctx: CanvasRenderingContext2D): void {
		this.renderTrail(ctx);

		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.w, this.h);
	}
}
