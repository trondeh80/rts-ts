// game/enemy.ts
import { Container, Sprite, Ticker } from "pixi.js";
import { Assets } from "pixi.js";
import { Pathfinder } from "./pathfinding";
import { Grid } from "./grid";

export class Enemy {
  private sprite: Sprite | null = null;
  private container: Container;
  private pathfinder: Pathfinder;
  private path: { x: number; y: number }[] = [];
  private target: { x: number; y: number } | null = null;
  private speed = 1;
  private grid: Grid;

  private isAggro = true;

  constructor(container: Container, grid: Grid) {
    this.container = container;
    this.grid = grid;
    this.pathfinder = new Pathfinder(grid);
  }

  public async init() {
    const texture = await Assets.load("/images/enemy-worm.png");
    this.sprite = new Sprite(texture);
    this.sprite.width = 32;
    this.sprite.height = 32;

    const { x, y } = this.getStartPosition();

    this.sprite.x = x;
    this.sprite.y = y;

    this.container.addChild(this.sprite);
  }

  private getStartPosition(): { x: number; y: number } {
    const x = Math.floor(Math.random() * 800);
    const y = Math.floor(Math.random() * 600);
    if (!this.grid.isWalkable(x, y)) {
      return this.getStartPosition();
    }
    return { x, y };
  }

  public moveTo(x: number, y: number) {
    if (!this.sprite) {
      console.log("Cannot move an enemy that has not been initialized");
      return;
    }

    if (!this.isAggro) {
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

        const centerX = nextX + this.sprite.width / 2;
        const centerY = nextY + this.sprite.height / 2;

        if (this.grid.isWalkable(centerX, centerY)) {
          this.sprite.x = nextX;
          this.sprite.y = nextY;
        } else {
          this.target = this.path.shift() || null;
        }
      }
    }
  }

  public getSprite() {
    return this.sprite;
  }
}
