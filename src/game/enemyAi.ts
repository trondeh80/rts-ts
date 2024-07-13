// game/enemyAI.ts
import { Enemy } from "./enemy";
import { Player } from "./player";

export class EnemyAI {
  private enemies: Enemy[] = [];
  private player: Player;

  constructor(player: Player) {
    this.player = player;
  }

  public addEnemy(enemy: Enemy) {
    this.enemies.push(enemy);
  }

  public update() {
    const playerSprite = this.player.getSprite();
    if (!playerSprite) return;

    this.enemies.forEach((enemy) => {
      enemy.moveTo(playerSprite.x, playerSprite.y);
    });
  }
}
