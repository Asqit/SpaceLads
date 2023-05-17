import { StateManager } from "~/utils/StateManager";

export type Tuple<T, J> = [T, J];

/**
 * **Description:** This interface represents how State should be represented
 * in game
 */
export interface IState {
	stateManRef: StateManager;
	ctx: CanvasRenderingContext2D;
	scene?: Tuple<string, HTMLElement>;
	onEnter: () => void;
	onExit: () => void;
	onPause: () => void;
	onResume: () => void;
	render: (step: number) => void;
	update: (step: number) => void;
}
