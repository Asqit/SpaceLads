export class KeyHandler {
	private key: any = {};

	constructor() {
		this.initHandlers = this.initHandlers.bind(this);
		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.handleKeyUp = this.handleKeyUp.bind(this);
	}

	public isKeyDown(key: string) {
		return this.key[key];
	}

	private setKey(e: KeyboardEvent, state: boolean) {
		const ASCII = e.keyCode;
		let key = undefined;

		// Searching for exceptions
		// in ASCII table
		switch (ASCII) {
			case 27:
				key = "ESC";
				break;
			case 32:
				key = "SPACE";
				break;
			case 13:
				key = "ENTER";
				break;
			default:
				key = String.fromCharCode(ASCII);
				break;
		}

		this.key[key] = state;
	}

	private handleKeyDown(e: any) {
		this.setKey(e, true);
	}

	private handleKeyUp(e: any) {
		this.setKey(e, false);
	}

	public initHandlers() {
		window.addEventListener("keydown", this.handleKeyDown);
		window.addEventListener("keyup", this.handleKeyUp);
	}
}
