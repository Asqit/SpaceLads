import { Star } from "~/entities/Star";
import { IState, Tuple } from "~/interfaces/IState";
import { Doom } from "~/utils/Doom";
import { EntityHandler } from "~/utils/EntityHandler";
import { StateManager } from "~/utils/StateManager";
import MenuSection from "~/sections/MenuSection";
import player from "~/entities/Player";

export class Menu implements IState {
	public stateManRef: StateManager;
	public ctx: CanvasRenderingContext2D;
	public scene: Tuple<string, HTMLElement> = MenuSection();
	private handler: EntityHandler = new EntityHandler();
	private doom: Doom = new Doom();

	constructor(stateManRef: StateManager, ctx: CanvasRenderingContext2D) {
		this.stateManRef = stateManRef;
		this.ctx = ctx;

		this.scene = MenuSection();
	}

	public onEnter(): void {
		this.doom.appendSection(this.scene[1]);

		player.assignHandler(this.handler);
		this.handler.entities.push(player);

		for (let i = 0; i < 60; i++) {
			this.handler.entities.push(new Star());
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
		this.doom.removeSection(this.scene[0]);
		this.handler.entities = [];
	}
}
