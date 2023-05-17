import { Maths } from "~/utils/Math";
import { Entity } from "./Entity";
import { Game } from "~/Game";

export class AdvancedEnemy extends Entity {
	constructor() {
		const x = Maths.rand(0, Game.WIDTH);
		const y = 0;

		super(x, y, 32, 32, "ADVANCED_ENEMY");
	}

	public update(step: number): void {}

	public render(step: number, ctx: CanvasRenderingContext2D): void {
		ctx.fillRect(this.x, this.y, this.w, this.h);
	}
}
