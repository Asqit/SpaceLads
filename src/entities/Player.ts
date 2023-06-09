import { KeyHandler } from "~/utils/Input";
import { Entity } from "./Entity";
import { Game } from "~/Game";
import { EntityHandler } from "~/utils/EntityHandler";
import { Color } from "~/utils/Color";
import { Maths } from "~/utils/Math";
import { IWeapon } from "~/interfaces/IWeapon";
import { TwinShooty } from "~/weapons/TwinShooty";

interface PlayerSave {
	speed: number;
	maxWaves: number;
	highScore: number;
	coins: number;
}

class Player extends Entity {
	private keyHandler: KeyHandler = new KeyHandler();
	private speedX: number = 0;
	private speedY: number = 0;
	private health: number = 100;
	private lastHit: number = Date.now();
	private score: number = 0;
	private waves: number = 1;
	private coins: number = 0;

	// Upgradable properties
	private speed: number = 350;
	private weapon: IWeapon = new TwinShooty("PLAYER", this.w, this.h);

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
		this.speed = payload.speed;
	}

	private handleSave() {
		if (!localStorage.getItem(Player.SAVE_KEY)) {
			const payload: PlayerSave = {
				speed: this.speed,
				highScore: this.score,
				maxWaves: this.waves,
				coins: this.coins,
			};

			localStorage.setItem(Player.SAVE_KEY, JSON.stringify(payload));
			return;
		}

		let prev: PlayerSave = JSON.parse(localStorage.getItem(Player.SAVE_KEY)!);
		prev = {
			speed: this.speed,
			highScore: prev.highScore > this.score ? prev.highScore : this.score,
			maxWaves: prev.maxWaves > this.waves ? prev.maxWaves : this.waves,
			coins: this.coins,
		};
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

		if (VK.isKeyDown("SPACE")) {
			this.shoot();
		}

		// Move the player
		this.x += this.speedX * step;
		this.y += this.speedY * step;
	}

	private shoot() {
		this.weapon.shoot();
	}

	private renderHitBox(ctx: CanvasRenderingContext2D) {
		ctx.strokeStyle = "#fff";
		ctx.strokeRect(this.x, this.y, this.w, this.h);
	}

	private renderHUD(ctx: CanvasRenderingContext2D) {
		// Health bar
		ctx.fillStyle = Color.orange;
		ctx.fillRect(this.x - this.w, this.y + this.h * 2, 100, 4);

		ctx.fillStyle = Color["red-1"];
		ctx.fillRect(this.x - this.w, this.y + this.h * 2, this.health, 4);

		// Score, Waves & Coins
		ctx.font = "yoster 16px";
		ctx.fillText(`Score: ${this.score}`, 30, 30);
		ctx.fillText(`Wave: ${this.waves}`, 30, 60);
		ctx.fillText(`Coins: ${this.coins}`, 30, 90);
	}

	public receivePickup(pickup: Entity): void {
		if (pickup.id === "COIN") {
			this.coins += 1;
			return;
		}

		if (Maths.isNumberBetween(this.health, 25, 75)) {
			this.health += 25;
		}
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

	public incrementScore(): void {
		this.score += 10;
	}

	public update(step: number) {
		this.weapon.update(this.x, this.y);
		this.handleMovement(step);
		this.handleEdgeWarping();
	}

	public render(step: number, ctx: CanvasRenderingContext2D) {
		this.renderHitBox(ctx);
		this.renderHUD(ctx);
	}

	public assignHandler(entityHandler: EntityHandler) {
		this.weapon.assignHandler(entityHandler);
	}
}

/** Singleton of Player class */
const player = new Player();

export default player;
