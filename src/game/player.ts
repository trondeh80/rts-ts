import { Container, Sprite, Ticker } from "pixi.js";
import { Assets } from "pixi.js";
import { Pathfinder } from "./pathfinding";
import { Grid } from "./grid";

export class Player {
  private sprite: Sprite | null = null;
  private container: Container;
  private pathfinder: Pathfinder;
  private path: { x: number; y: number }[] = [];
  private target: { x: number; y: number } | null = null;
  private speed = 2;
  private grid: Grid;

  constructor(container: Container, grid: Grid) {
    this.container = container;
    this.grid = grid;
    this.pathfinder = new Pathfinder(grid);
  }

  public async init() {
    const texture = await Assets.load("/images/player1.png");
    this.sprite = new Sprite(texture);
    this.sprite.width = 50;
    this.sprite.height = 50;
    this.sprite.x = 400;
    this.sprite.y = 300;
    this.sprite.interactive = true;
    this.sprite.cursor = "pointer";

    this.container.addChild(this.sprite);
  }

  public moveTo(x: number, y: number) {
    if (!this.sprite) {
      console.log("Cannot move a player that has not been initialized");
      return;
    }

    this.path = this.pathfinder.findPath(
      { x: this.sprite.x, y: this.sprite.y },
      { x, y }
    );
    this.target = this.path.shift() || null;
  }

  public update(ticker: Ticker) {
    if (this.target && this.sprite) {
      const dx = this.target.x - this.sprite.x;
      const dy = this.target.y - this.sprite.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < this.speed) {
        this.sprite.x = this.target.x;
        this.sprite.y = this.target.y;
        this.target = this.path.shift() || null;
      } else {
        const nextX = this.sprite.x + (dx / dist) * this.speed;
        const nextY = this.sprite.y + (dy / dist) * this.speed;

        // Adjust for the center of the sprite
        const centerX = nextX + this.sprite.width / 2;
        const centerY = nextY + this.sprite.height / 2;

        console.log(`Moving to (${centerX}, ${centerY})`);
        if (this.grid.isWalkable(centerX, centerY)) {
          console.log("moving player");
          this.sprite.x = nextX;
          this.sprite.y = nextY;
        } else {
          console.log("not moving player");
          this.target = this.path.shift() || null;
        }
      }
    }
  }

  public getSprite() {
    return this.sprite;
  }
}
