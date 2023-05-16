import { Game } from "~/Game";
import { Entity } from "./Entity";

export type LaserOwner = "ENEMY" | "PLAYER";

export class Laser extends Entity {
	private owner: LaserOwner = "PLAYER";
	private color: string = "#ffffff";
	private speed: number = 800;

	constructor(x: number, y: number, owner: LaserOwner) {
		super(x, y, 2, 8, "LASER");
		this.owner = owner;
		this.color = this.owner === "ENEMY" ? "red" : "blue";
		this.speed = this.owner === "ENEMY" ? 800 : -800;
	}

	update(step: number): void {
		if (this.y < 0) {
			this.isActive = false;
		} else if (this.y + this.h > Game.HEIGHT) {
			this.isActive = false;
		}

		this.y += this.speed * step;
	}

	render(step: number, ctx: CanvasRenderingContext2D): void {
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.w, this.h);
	}
}
