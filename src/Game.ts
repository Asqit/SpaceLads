import { Menu } from "./states/Menu";
import { Color } from "./utils/Color";
import { Frame } from "./utils/Frame";
import { StateManager } from "./utils/StateManager";

export class Game {
	private frame: Frame = new Frame(innerWidth, innerHeight);
	private stateManager: StateManager = new StateManager();
	private ctx: CanvasRenderingContext2D | null;

	// Statics ---------------------------------------------->
	public static readonly WIDTH: number = innerWidth;
	public static readonly HEIGHT: number = innerHeight;

	constructor() {
		let canvas = this.frame.getCanvas;

		canvas.style.backgroundColor = Color.black;

		this.ctx = canvas.getContext("2d");
		this.stateManager.addState(new Menu(this.stateManager, this.ctx!));
	}

	// Game Loop --------------------------------------------->
	private now: number = 0;
	private delta: number = 0;
	private last = Game.timestamp();
	private readonly STEP = 1 / 60;
	private fps = 0;

	public run() {
		this.now = Game.timestamp();
		this.delta += Math.min(1, (this.now - this.last) / 1000);

		while (this.delta > this.STEP) {
			this.delta -= this.STEP;

			this.tick(this.STEP);
		}

		this.render(this.delta);

		this.fps = 1 / this.delta;
		this.last = this.now;

		requestAnimationFrame(() => this.run());
	}

	private tick(delta: number): void {
		this.stateManager.updateState(delta);
	}

	private render(delta: number): void {
		this.ctx?.clearRect(0, 0, Game.WIDTH, Game.HEIGHT);
		this.stateManager.renderState(delta);

		if (this.ctx) {
			this.ctx.font = "16px monospace";
			this.ctx.fillStyle = "#ffffff";
			this.ctx.fillText(this.fps.toString(), 30, Game.HEIGHT - 16);
		}
	}

	private static timestamp() {
		return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
	}
}
