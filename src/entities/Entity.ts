import { EntityID } from "~/types/EntityID";
import { IEntity } from "~/interfaces/IEntity";

/**
 * Entity is a `abstract` class of every entity present in the game.
 * It is fully complaint with `IEntity` interface.
 */
export abstract class Entity implements IEntity {
	public x: number;
	public y: number;
	public w: number;
	public h: number;
	public id: EntityID;
	public isActive: boolean;

	constructor(x: number, y: number, w: number, h: number, id: EntityID) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.id = id;
		this.isActive = true;
	}

	/**
	 * A standard method used for moving the Entity.
	 * @param step A delta time, which is used for actually synchronizing physics, animations etc.
	 */
	abstract update(step: number): void;

	/**
	 * A method for actually rendering the Entity
	 * @param step A delta time for smooth animations / sprites...
	 * @param ctx canvas context.
	 */
	abstract render(step: number, ctx: CanvasRenderingContext2D): void;

	/**
	 * A method for taking and handling damage.
	 */
	abstract hit(): void;
}
