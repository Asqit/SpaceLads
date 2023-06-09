import { Game } from "~/Game";
import { Entity } from "./Entity";
import player from "./Player";
import { Maths, Vector2D } from "~/utils/Math";
import { EntityHandler } from "~/utils/EntityHandler";
import { Particle } from "./Particle";
import { Color } from "~/utils/Color";
import { IWeapon } from "~/interfaces/IWeapon";
import { Shooty } from "~/weapons/Shooty";

export class Boss extends Entity {
	private health: number = 1000;
	private speedX: number = 0;
	private handler: EntityHandler;
	private color: string = "#ff0000";
	private weapon: IWeapon = new Shooty("ENEMY", this.w, this.h);

	constructor(handler: EntityHandler) {
		super(Game.WIDTH / 2 - 32, 64, 64, 64, "BOSS");
		this.handler = handler;
		this.weapon.assignHandler(handler);
	}

	public hit() {
		for (let i = 0; i < 15; i++) {
			this.handler.entities.push(
				new Particle(
					this.x + this.w / 2 - 1,
					this.y + this.h / 2 - 1,
					2,
					2,
					Color["red-1"],
					new Vector2D(Maths.rand(-250, 250), Maths.rand(-250, 250)),
					1200
				)
			);
		}

		player.incrementScore();

		if (this.health > 0) {
			this.health -= 25;

			return;
		}

		this.isActive = false;
	}

	private shoot() {
		this.weapon.shoot();
	}

	public update(step: number): void {
		if (player.x - this.x > 0) {
			this.speedX = 150;
		} else if (player.x - this.x < 0) {
			this.speedX = -150;
		}

		if (Maths.isNumberBetween(this.x, player.x - 5, player.x + 5) && player.isActive) {
			this.shoot();
		}

		if (player.isActive === false) {
			this.y += 300 * step;
		}

		this.x += this.speedX * step;
		this.weapon.update(this.x, this.y);
	}

	public render(step: number, ctx: CanvasRenderingContext2D): void {
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.w, this.h);

		ctx.fillStyle = Color["red-0"];
		ctx.fillRect(this.x, this.y - 25, this.health, 10);
	}
}
