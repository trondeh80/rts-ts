import { Container, Graphics } from "pixi.js";

const CELL_SIZE = 32;

export class Grid {
  private width: number;
  private height: number;
  private cells: number[][];

  constructor(width: number, height: number) {
    this.width = width / CELL_SIZE;
    this.height = height / CELL_SIZE;
    this.cells = Array.from({ length: this.height }, () =>
      Array(this.width).fill(0)
    );
  }

  public async init(container: Container) {
    this.generateCaveSystem();
    const gridGraphics = new Graphics();

    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        if (this.cells[y][x] === 1) {
          gridGraphics.fill(0x000000);
          gridGraphics.rect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
      }
    }

    container.addChild(gridGraphics);
  }

  private generateCaveSystem() {
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        this.cells[y][x] = Math.random() < 0.45 ? 1 : 0;
      }
    }

    for (let i = 0; i < 4; i++) {
      this.smoothCave();
    }
  }

  private smoothCave() {
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        const neighbors = this.countAliveNeighbors(x, y);
        if (neighbors > 4) {
          this.cells[y][x] = 1;
        } else if (neighbors < 4) {
          this.cells[y][x] = 0;
        }
      }
    }
  }

  private countAliveNeighbors(x: number, y: number): number {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;
        const nx = x + i;
        const ny = y + j;
        if (nx >= 0 && ny >= 0 && nx < this.width && ny < this.height) {
          count += this.cells[ny][nx];
        } else {
          count++;
        }
      }
    }
    return count;
  }

  public isWalkable(x: number, y: number): boolean {
    const gridX = Math.floor(x / CELL_SIZE);
    const gridY = Math.floor(y / CELL_SIZE);
    const isWalkable = this.cells[gridY] && this.cells[gridY][gridX] === 0;
    console.log(`Checking walkability at (${gridX}, ${gridY}): ${isWalkable}`);
    return isWalkable;
  }

  public getCellSize(): number {
    return CELL_SIZE;
  }
}
