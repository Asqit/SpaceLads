import { IState } from "~/interfaces/IState";
import { StateManager } from "~/utils/StateManager";

export class Play implements IState {
	public stateManRef: StateManager;
	public ctx: CanvasRenderingContext2D;

	constructor(stateManRef: StateManager, ctx: CanvasRenderingContext2D) {
		this.stateManRef = stateManRef;
		this.ctx = ctx;
	}

	public onEnter(): void {}
	public onExit(): void {}
	public onPause(): void {}
	public onResume(): void {}

	public render(step: number): void {}
	public update(step: number): void {}
}
