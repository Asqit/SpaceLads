import { BasicEnemy } from "~/entities/BasicEnemy";
import { IState } from "~/interfaces/IState";
import { EntityHandler } from "~/utils/EntityHandler";
import { StateManager } from "~/utils/StateManager";
import player from "~/entities/Player";

export class Menu implements IState {
	public stateManRef: StateManager;
	public ctx: CanvasRenderingContext2D;
	private handler: EntityHandler = new EntityHandler();

	constructor(stateManRef: StateManager, ctx: CanvasRenderingContext2D) {
		this.stateManRef = stateManRef;
		this.ctx = ctx;
	}

	public onEnter(): void {
		this.handler.entities.push(player);

		for (let i = 0; i < 10; i++) {
			this.handler.entities.push(new BasicEnemy(i * 34, 0));
		}
	}

	public onPause(): void {}

	public onResume(): void {}

	public render(step: number): void {
		this.handler.render(step, this.ctx);
	}

	public update(step: number): void {
		this.handler.update(step);
	}

	public onExit(): void {
		this.handler.entities = [];
	}
}
