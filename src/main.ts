import { Game } from "./Game";
import "~/styles/main.scss";

window.addEventListener("load", () => {
	new Game().run();
});
