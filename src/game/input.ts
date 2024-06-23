import { Application, Container } from "pixi.js";
import { Player } from "./player";
import { Grid } from "./grid";

let selectedPlayer: Player | null = null;

export function setupInput(
  app: Application,
  container: Container,
  player: Player,
  grid: Grid
) {
  const playerSprite = player.getSprite();
  if (!playerSprite) {
    console.log("Player sprite is not initialized");
    return;
  }

  playerSprite.on("pointerdown", () => {
    selectedPlayer = player;
  });

  app.canvas.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    if (selectedPlayer) {
      const rect = app.canvas.getBoundingClientRect();

      const x = event.clientX - rect.left - container.x;
      const y = event.clientY - rect.top - container.y;

      selectedPlayer.moveTo(x, y);
    }
  });

  window.addEventListener("keydown", (event) => {
    const speed = 10;
    switch (event.key) {
      case "w":
        container.y += speed;
        break;
      case "s":
        container.y -= speed;
        break;
      case "a":
        container.x += speed;
        break;
      case "d":
        container.x -= speed;
        break;
    }
  });
}
