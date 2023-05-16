import { Vector2D } from "~/utils/Math";
import { IEntity } from "./IEntity";

export interface IParticle extends IEntity {
	acceleration: Vector2D;
	color: string;
}
