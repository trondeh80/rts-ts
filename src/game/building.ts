// game/building.ts
import { Container, Sprite } from "pixi.js";
import { Assets } from "pixi.js";
import { Grid } from "./grid";

export class Building {
  private sprite: Sprite | null = null;
  private container: Container;
  private grid: Grid;

  constructor(container: Container, grid: Grid) {
    this.container = container;
    this.grid = grid;
  }

  public async init(x: number, y: number) {
    const texture = await Assets.load("/images/building.png");
    this.sprite = new Sprite(texture);
    this.sprite.width = 64;
    this.sprite.height = 64;

    if (!this.grid.isWalkable(x, y)) {
      console.log("Cannot place building on non-walkable terrain");
      return;
    }

    this.sprite.x = x;
    this.sprite.y = y;

    this.container.addChild(this.sprite);
  }

  public getSprite() {
    return this.sprite;
  }
}
