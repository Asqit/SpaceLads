import { Game } from "~/Game";
import { AdvancedEnemy } from "~/entities/AdvancedEnemy";
import { BasicEnemy } from "~/entities/BasicEnemy";
import { Boss } from "~/entities/Boss";
import player from "~/entities/Player";
import { Star } from "~/entities/Star";
import { IState } from "~/interfaces/IState";
import { EntityHandler } from "~/utils/EntityHandler";
import { StateManager } from "~/utils/StateManager";

export class Play implements IState {
	public stateManRef: StateManager;
	public ctx: CanvasRenderingContext2D;
	private entityHandler: EntityHandler;

	constructor(stateManRef: StateManager, ctx: CanvasRenderingContext2D) {
		this.stateManRef = stateManRef;
		this.ctx = ctx;
		this.entityHandler = new EntityHandler();
	}

	private preShake() {
		this.ctx.save();
		let dx = Math.random() * 10;
		let dy = Math.random() * 10;
		this.ctx.translate(dx, dy);
	}

	private postShake() {
		this.ctx.restore();
	}

	public onEnter(): void {
		for (let i = 0; i < 30; i++) {
			this.entityHandler.entities.push(new Star());
		}

		for (let i = 0; i < 10; i++) {
			const x = Game.WIDTH / 10 + 16;
			this.entityHandler.entities.push(new BasicEnemy(i * x, 0));
		}

		player.assignHandler(this.entityHandler);
		this.entityHandler.entities.push(player);
		this.entityHandler.entities.push(new AdvancedEnemy());
		this.entityHandler.entities.push(new AdvancedEnemy());
		this.entityHandler.entities.push(new Boss(this.entityHandler));
	}

	public onExit(): void {}
	public onPause(): void {}
	public onResume(): void {}

	public render(step: number): void {
		this.ctx.clearRect(0, 0, innerWidth, innerHeight);

		this.entityHandler.render(step, this.ctx);
	}
	public update(step: number): void {
		this.entityHandler.update(step);
	}
}
