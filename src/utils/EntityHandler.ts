import { IEntity } from "~/interfaces/IEntity";
import { Collision } from "./Collision";
import player from "~/entities/Player";
import { Laser } from "~/entities/Laser";

export class EntityHandler {
	public entities: IEntity[] = [];

	/**
	 * This method will handle entire game collision detection.
	 * Currently we will use narrow type of collision handling.
	 * This can be improved by using "broad" handling.
	 *
	 * To handle broad, we need to split the screen into cells.
	 * Here is TypeScript implementation of Spacial HashMap.
	 * https://github.com/adam-arthur/spatial-hashmap
	 * After splitting the screen into cells, use this to
	 * Handle collision.
	 */
	private collisionHandler(): void {
		const lasers = this.entities.filter((e) => e.id === "LASER");
		const enemies = this.entities.filter((e) => ["ADVANCED_ENEMY", "BASIC_ENEMY", "BOSS"].includes(e.id));
		const pickups = this.entities.filter((e) => ["COIN", "MED"].includes(e.id));

		// Player vs Enemies
		for (const enemy of enemies) {
			if (Collision.areRectanglesColliding(player, enemy)) {
				player.hit();
				enemy.hit();
				player.incrementScore();
			}

			for (const laser of lasers) {
				if (laser instanceof Laser) {
					if (laser.owner === "ENEMY" && Collision.areRectanglesColliding(laser, player)) {
						player.hit();
						laser.hit();
						return;
					}

					if (laser.owner === "PLAYER" && Collision.areRectanglesColliding(laser, enemy)) {
						enemy.hit();
						laser.hit();
						player.incrementScore();
						return;
					}
				}
			}
		}

		// Player vs Pickups
		for (const pickup of pickups) {
			if (Collision.areRectanglesColliding(pickup, player)) {
				player.receivePickup(pickup);
			}
		}
	}

	public update(step: number) {
		for (const entity of this.entities) {
			entity.update(step);
		}

		this.entities = this.entities.filter((e) => e.isActive);
		this.collisionHandler();
	}

	public render(step: number, ctx: CanvasRenderingContext2D) {
		for (const entity of this.entities) {
			entity.render(step, ctx);
		}
	}
}
