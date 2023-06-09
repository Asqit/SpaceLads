import { WeaponOwner } from "~/types/WeaponOwner";
import { EntityHandler } from "~/utils/EntityHandler";

export interface IWeapon {
	owner: WeaponOwner;
	handler: EntityHandler | undefined;
	shoot: () => void;
	update: (x: number, y: number) => void;
	assignHandler: (entityHandler: EntityHandler) => void;
}
