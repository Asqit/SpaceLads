import { EntityID } from "~/types/EntityID";

export interface IEntity {
	x: number;
	y: number;
	w: number;
	h: number;

	/** An enum differentiating all entities from each other */
	id: EntityID;

	/** Determinate if the entity is alive */
	isActive: boolean;

	/** A method for update the Entity */
	update: (step: number) => void;

	/** A method for rendering the Entity */
	render: (step: number, ctx: CanvasRenderingContext2D) => void;

	hit: () => void;
}
