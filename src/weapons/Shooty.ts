import { Laser } from "~/entities/Laser";
import { WeaponOwner } from "~/types/WeaponOwner";
import { Color } from "~/utils/Color";
import { Vector2D } from "~/utils/Math";
import { Weapon } from "./Weapon";

export class Shooty extends Weapon {
	protected coolDownDecrement: number = 6;
	protected coolDown: number = 0;
	protected x: number = 0;
	protected y: number = 0;
	protected w: number = 4;
	protected h: number = 16;
	protected velocity: Vector2D;

	constructor(owner: WeaponOwner, w: number, h: number) {
		super(owner, w, h);

		if (this.owner === "ENEMY") {
			this.velocity = new Vector2D(0, 850);
			return this;
		}

		this.velocity = new Vector2D(0, -850);
	}

	public shoot(): void {
		if (this.handler && this.coolDown <= 0) {
			this.coolDown = 120;

			this.handler.entities.push(
				new Laser(
					this.x + this.ownerWidth / 2 - this.w,
					this.y,
					this.w,
					this.h,
					this.velocity,
					Color["red-1"],
					this.owner
				)
			);
		}
	}
	public update(x: number, y: number): void {
		if (this.coolDown > 0) {
			this.coolDown -= this.coolDownDecrement;
		}

		this.x = x;
		this.y = y;
	}
}
