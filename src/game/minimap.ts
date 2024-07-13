// game/minimap.ts
import { Application, Container, Graphics, Sprite } from "pixi.js";
import { Grid } from "./grid";
import { Player } from "./player";
import { Enemy } from "./enemy";

export class Minimap {
  private app: Application;
  private container: Container;
  private grid: Grid;
  private player: Player;
  private enemies: Enemy[];
  private minimap: Graphics;

  constructor(
    app: Application,
    container: Container,
    grid: Grid,
    player: Player,
    enemies: Enemy[]
  ) {
    this.app = app;
    this.container = container;
    this.grid = grid;
    this.player = player;
    this.enemies = enemies;
    this.minimap = new Graphics();
  }

  public init() {
    this.minimap.x = 800 - 10;
    this.minimap.y = 600 - 10;
    this.minimap.scale.set(0.01, 0.01);
    this.container.addChild(this.minimap);
  }

  public update() {
    this.minimap.clear();
    this.drawGrid();
    this.drawPlayer();
    this.drawEnemies();
  }

  private drawGrid() {
    this.grid.getCells().forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell === 1) {
          this.minimap.fill(0x000000);
        } else {
          this.minimap.fill(0xffffff);
        }
        this.minimap.rect(x * 32, y * 32, 32, 32);
      });
    });
  }

  private drawPlayer() {
    const playerSprite = this.player.getSprite();
    if (!playerSprite) return;

    this.minimap.fill(0x00ff00);
    this.minimap.rect(
      playerSprite.x,
      playerSprite.y,
      playerSprite.width,
      playerSprite.height
    );
  }

  private drawEnemies() {
    this.enemies.forEach((enemy) => {
      const enemySprite = enemy.getSprite();
      if (!enemySprite) return;

      this.minimap.fill(0xff0000);
      this.minimap.rect(
        enemySprite.x,
        enemySprite.y,
        enemySprite.width,
        enemySprite.height
      );
    });
  }
}
