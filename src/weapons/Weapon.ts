import { IWeapon } from "~/interfaces/IWeapon";
import { WeaponOwner } from "~/types/WeaponOwner";
import { EntityHandler } from "~/utils/EntityHandler";
import { Vector2D } from "~/utils/Math";

/**
 * ## Weapon
 *
 * Weapon is abstract class used to ease up my work
 * while creating a new weapon classes.
 */
export abstract class Weapon implements IWeapon {
	public owner: WeaponOwner;
	public handler: EntityHandler | undefined;
	protected abstract coolDown: number;
	protected abstract coolDownDecrement: number;
	protected abstract x: number;
	protected abstract y: number;
	protected abstract w: number;
	protected abstract h: number;
	protected abstract velocity: Vector2D;
	protected ownerWidth: number;
	protected ownerHeight: number;

	/**
	 * @param owner - The entity who is using this weapon
	 * @param w - Owner's width, so that we can dynamically calculate initial laser positions, thus direction.
	 * @param h - Owner's height, so that we can dynamically calculate initial laser positions, thus direction.
	 */
	constructor(owner: WeaponOwner, w: number, h: number) {
		this.owner = owner;
		this.ownerWidth = w;
		this.ownerHeight = h;
	}

	/**
	 * Method used to actually shoot from the weapon.
	 */
	public abstract shoot(): void;

	/**
	 * Method used to update weapon
	 * @param x - current position of the weapon owner
	 * @param y - current position of the weapon owner
	 */
	public abstract update(x: number, y: number): void;

	/**
	 * This method will obtain `EntityHandler` used in current state.
	 * The handler then will be assigned and used to hold all lasers
	 * shot by this weapon.
	 * @param entityHandler
	 */
	public assignHandler(entityHandler: EntityHandler): void {
		this.handler = entityHandler;
	}
}
