import { IEntity } from "~/interfaces/IEntity";

export class EntityHandler {
	public entities: IEntity[] = [];

	public update(step: number) {
		for (const entity of this.entities) {
			entity.update(step);
		}

		this.entities = this.entities.filter((e) => e.isActive);
	}

	public render(step: number, ctx: CanvasRenderingContext2D) {
		for (const entity of this.entities) {
			entity.render(step, ctx);
		}
	}
}
