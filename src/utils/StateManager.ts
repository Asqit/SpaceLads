import { Stack } from "./Stack";
import { IState } from "~/interfaces/IState";

export class StateManager {
	private stack: Stack<IState> = new Stack();

	constructor() {}

	public addState(state: IState): void {
		this.stack.push(state);
		state.onEnter();
	}

	public popState(): void {
		this.stack.pop()?.onExit();
	}

	public pauseState(): void {
		this.stack.peek()?.onPause();
	}

	public resumeState(): void {
		this.stack.peek()?.onResume();
	}

	public renderState(delta: number): void {
		this.stack.peek()?.render(delta);
	}

	public updateState(delta: number): void {
		this.stack.peek()?.update(delta);
	}

	public getState() {
		return this.stack.peek()!;
	}
}
