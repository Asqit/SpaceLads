import { Tuple } from "~/interfaces/IState";

interface MenuSectionProps {
	onPlayCallback?: () => void;
	onHighScoreCallback?: () => void;
	onStoreCallback?: () => void;
	onCreditsCallback?: () => void;
}

export default function MenuSection(): Tuple<string, HTMLElement> {
	const section = document.createElement("section");
	const id = "menu";

	section.id = id;

	section.innerHTML = `
		<article>
			<h1>SpaceLads</h1>
			<ul>
				<li>
					<button>Play</button>
				</li>
				<li>
					<button>High Score</button>
				</li>
				<li>
					<button>Store</button>
				</li>
				<li>
					<button>Credits</button>
				</li>
			</ul>
		</article>	
	`;

	return [id, section];
}
