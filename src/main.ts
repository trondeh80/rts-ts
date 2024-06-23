// Main file
import { Game } from "./game/index";

document.addEventListener("DOMContentLoaded", () => {
  const game = new Game();
  game.init();
});
