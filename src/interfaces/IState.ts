import { StateManager } from "~/utils/StateManager";

/**
 * **Description:** This interface represents how State should be represented
 * in game
 */
export interface IState {
	stateManRef: StateManager;
	ctx: CanvasRenderingContext2D;
	props?: any;
	onEnter: () => void;
	onExit: () => void;
	onPause: () => void;
	onResume: () => void;
	render: (step: number) => void;
	update: (step: number) => void;
}
