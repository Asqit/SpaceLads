import { KeyHandler } from "~/utils/Input";
import { Entity } from "./Entity";
import { Game } from "~/Game";

interface PlayerSave {
	speed: number;
	cooldownDecrement: number;
}

class Player extends Entity {
	private keyHandler: KeyHandler = new KeyHandler();
	private speedX: number = 0;
	private speedY: number = 0;
	private health: number = 100;
	private lastHit: number = Date.now();

	// Upgradable properties
	private speed: number = 250;
	private cooldown: number = 0;
	private cooldownDecrement = 2.5;

	// statics
	private static SAVE_KEY = "spacelads/player_save";

	constructor() {
		super(innerWidth / 2 - 16, innerHeight / 2 - 16, 32, 32, "PLAYER");
		this.handleLoad();
		this.keyHandler.initHandlers();
	}

	private handleLoad() {
		if (!localStorage.getItem(Player.SAVE_KEY)) {
			return;
		}

		const payload: PlayerSave = JSON.parse(localStorage.getItem(Player.SAVE_KEY)!);
		this.cooldownDecrement = payload.cooldownDecrement;
		this.speed = payload.speed;
	}

	private handleSave() {
		if (!localStorage.getItem(Player.SAVE_KEY)) {
			const payload: PlayerSave = { speed: this.speed, cooldownDecrement: this.cooldownDecrement };

			localStorage.setItem(Player.SAVE_KEY, JSON.stringify(payload));
			return;
		}

		let prev: PlayerSave = JSON.parse(localStorage.getItem(Player.SAVE_KEY)!);
		prev = { ...prev, speed: this.speed, cooldownDecrement: this.cooldownDecrement };
		localStorage.setItem(Player.SAVE_KEY, JSON.stringify(prev));
	}

	private handleEdgeWarping(): void {
		// X-Axis Boundary warp
		if (this.x < 0) {
			this.x = Game.WIDTH - this.w;
		} else if (this.x + this.w > Game.WIDTH) {
			this.x = 0;
		}

		// Y-Axis Boundary warp
		if (this.y < 0) {
			this.y = Game.HEIGHT - this.h;
		} else if (this.y + this.h > Game.HEIGHT) {
			this.y = 0;
		}
	}

	private handleMovement(step: number): void {
		const VK = this.keyHandler;

		// Move on Y-Axis
		if (VK.isKeyDown("W") || VK.isKeyDown("K")) {
			this.speedY = this.speed * -1;
		} else if (VK.isKeyDown("S") || VK.isKeyDown("J")) {
			this.speedY = this.speed;
		} else {
			this.speedY = 0;
		}

		// Move on X-Axis
		if (VK.isKeyDown("A") || VK.isKeyDown("H")) {
			this.speedX = this.speed * -1;
		} else if (VK.isKeyDown("D") || VK.isKeyDown("L")) {
			this.speedX = this.speed;
		} else {
			this.speedX = 0;
		}

		// Move the player
		this.x += this.speedX * step;
		this.y += this.speedY * step;
	}

	private handleWeapons() {
		if (this.cooldown > 0) {
			this.cooldown -= this.cooldownDecrement;
		}

		if (this.keyHandler.isKeyDown("SPACE")) {
			this.shoot();
		}
	}

	private shoot() {
		if (this.cooldown <= 0) {
			// shoot();
			this.cooldown = 120;
		}
	}

	private renderHitbox(step: number, ctx: CanvasRenderingContext2D) {
		ctx.strokeStyle = "#fff";
		ctx.strokeRect(this.x, this.y, this.w, this.h);
	}

	public hit() {
		if (Date.now() <= this.lastHit + 5) {
			return;
		}

		if (this.health < 50) {
			this.handleSave();
			this.isActive = false;
			return;
		}

		this.health -= 25;
	}

	public update(step: number) {
		this.handleWeapons();
		this.handleMovement(step);
		this.handleEdgeWarping();
	}

	public render(step: number, ctx: CanvasRenderingContext2D) {
		this.renderHitbox(step, ctx);
	}
}

/** Singleton of Player class */
const player = new Player();

export default player;
