import { Game } from "~/Game";
import { Entity } from "./Entity";
import { Vector2D } from "~/utils/Math";
import { WeaponOwner } from "~/types/WeaponOwner";

export class Laser extends Entity {
	public owner: WeaponOwner = "PLAYER";
	private color: string = "#ffffff";
	private speed: Vector2D = new Vector2D(0, 0);
	private trail: Vector2D[] = [];
	private MAX_TRAIL_LENGTH: number = 10;

	constructor(x: number, y: number, w: number, h: number, velocity: Vector2D, color: string, owner: WeaponOwner) {
		super(x, y, w, h, "LASER");
		this.owner = owner;
		this.color = color;
		this.speed = velocity;
	}

	private addTrail() {
		this.trail.push(new Vector2D(this.x, this.y));

		if (this.trail.length > this.MAX_TRAIL_LENGTH) {
			this.trail.shift();
		}
	}

	hit(): void {
		this.isActive = false;
	}

	update(step: number): void {
		if (this.y < 0) {
			this.isActive = false;
		} else if (this.y + this.h > Game.HEIGHT) {
			this.isActive = false;
		}

		this.x += this.speed.x * step;
		this.y += this.speed.y * step;

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
