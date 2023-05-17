/**
 * Doom aka DOM, Object manipulator :D
 */
export class Doom {
	private readonly root = document.getElementById("app");

	appendSection(section: HTMLElement) {
		this.root?.appendChild(section);
	}

	removeSection(id: string) {
		const section = document.getElementById(id)!;
		this.root?.removeChild(section);
	}
}
