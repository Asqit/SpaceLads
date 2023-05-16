export class Frame {
	private readonly canvas: HTMLCanvasElement = document.createElement("canvas");
	private id: string = Date.now() + "-" + Math.random() * 1000;
	private parent: HTMLElement = document.body;

	constructor(width: number, height: number, parent?: HTMLElement) {
		this.canvas.width = width;
		this.canvas.height = height;
		this.canvas.id = this.id;
		this.parent = parent ?? document.body;

		this.parent.appendChild(this.canvas);
	}

	public setParent(parent: HTMLElement): void {
		this.parent.removeChild(this.canvas);
		this.parent = parent;
		this.parent.appendChild(this.canvas);
	}

	public getParent(): HTMLElement {
		return this.parent;
	}

	public get getId(): string {
		return this.id;
	}

	public set setId(id: string) {
		this.id = id;
		this.canvas.id = this.id;
	}

	public get getCanvas() {
		return this.canvas;
	}

	public static getInstance(canvas: HTMLCanvasElement) {
		return new this(canvas.width, canvas.height, canvas.parentElement ?? undefined);
	}
}
