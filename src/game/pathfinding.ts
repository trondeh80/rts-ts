import { Grid } from "./grid";

class PriorityQueue<T> {
  private elements: { item: T; priority: number }[] = [];

  enqueue(item: T, priority: number) {
    this.elements.push({ item, priority });
    this.elements.sort((a, b) => a.priority - b.priority);
  }

  dequeue(): T | undefined {
    return this.elements.shift()?.item;
  }

  isEmpty(): boolean {
    return this.elements.length === 0;
  }
}

export class Pathfinder {
  private grid: Grid;
  private cellSize: number;

  constructor(grid: Grid) {
    this.grid = grid;
    this.cellSize = grid.getCellSize();
  }

  public findPath(
    start: { x: number; y: number },
    end: { x: number; y: number }
  ): { x: number; y: number }[] {
    const startNode = {
      x: Math.floor(start.x / this.cellSize),
      y: Math.floor(start.y / this.cellSize),
    };
    const endNode = {
      x: Math.floor(end.x / this.cellSize),
      y: Math.floor(end.y / this.cellSize),
    };

    const frontier = new PriorityQueue<{ x: number; y: number }>();
    frontier.enqueue(startNode, 0);

    const cameFrom: Map<string, { x: number; y: number } | null> = new Map();
    const costSoFar: Map<string, number> = new Map();
    cameFrom.set(`${startNode.x},${startNode.y}`, null);
    costSoFar.set(`${startNode.x},${startNode.y}`, 0);

    const directions = [
      { x: 1, y: 0 },
      { x: -1, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: -1 },
      { x: 1, y: 1 }, // Diagonal up-right
      { x: -1, y: 1 }, // Diagonal up-left
      { x: 1, y: -1 }, // Diagonal down-right
      { x: -1, y: -1 }, // Diagonal down-left
    ];

    while (!frontier.isEmpty()) {
      const current = frontier.dequeue();
      if (current && current.x === endNode.x && current.y === endNode.y) {
        break;
      }

      if (current) {
        for (const dir of directions) {
          const next = { x: current.x + dir.x, y: current.y + dir.y };
          if (
            !this.grid.isWalkable(
              next.x * this.cellSize,
              next.y * this.cellSize
            )
          )
            continue;

          const newCost = (costSoFar.get(`${current.x},${current.y}`) || 0) + 1;
          if (
            !costSoFar.has(`${next.x},${next.y}`) ||
            newCost < (costSoFar.get(`${next.x},${next.y}`) || Infinity)
          ) {
            costSoFar.set(`${next.x},${next.y}`, newCost);

            // Calculate the priority by adding the manhattan distance
            const priority = newCost + this.manhattanDistance(next, endNode);

            frontier.enqueue(next, priority);
            cameFrom.set(`${next.x},${next.y}`, current);
          }
        }
      }
    }

    const path: { x: number; y: number }[] = [];
    let current = endNode;
    const visitedNodes = new Set<string>();

    while (current) {
      const key = `${current.x},${current.y}`;
      if (visitedNodes.has(key)) {
        console.error("Detected loop in path reconstruction.");
        break;
      }
      visitedNodes.add(key);

      path.push({ x: current.x * this.cellSize, y: current.y * this.cellSize });
      const prev = cameFrom.get(key);
      if (!prev) break;
      current = prev;
    }

    path.reverse();
    return path;
  }

  private manhattanDistance(
    a: { x: number; y: number },
    b: { x: number; y: number }
  ) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  }
}

/******

import { Grid } from "./grid";

class PriorityQueue<T> {
  private elements: { item: T; priority: number }[] = [];

  enqueue(item: T, priority: number) {
    this.elements.push({ item, priority });
    this.elements.sort((a, b) => a.priority - b.priority);
  }

  dequeue(): T | undefined {
    return this.elements.shift()?.item;
  }

  isEmpty(): boolean {
    return this.elements.length === 0;
  }
}

export class Pathfinder {
  private grid: Grid;
  private cellSize: number;

  constructor(grid: Grid) {
    this.grid = grid;
    this.cellSize = grid.getCellSize();
  }

  public findPath(
    start: { x: number; y: number },
    end: { x: number; y: number }
  ): { x: number; y: number }[] {
    const startNode = {
      x: Math.floor(start.x / this.cellSize),
      y: Math.floor(start.y / this.cellSize),
    };
    const endNode = {
      x: Math.floor(end.x / this.cellSize),
      y: Math.floor(end.y / this.cellSize),
    };

    const frontier = new PriorityQueue<{ x: number; y: number }>();
    frontier.enqueue(startNode, 0);

    const cameFrom: Map<string, { x: number; y: number } | null> = new Map();
    const costSoFar: Map<string, number> = new Map();
    cameFrom.set(`${startNode.x},${startNode.y}`, null);
    costSoFar.set(`${startNode.x},${startNode.y}`, 0);

    const directions = [
      { x: 1, y: 0 },
      { x: -1, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: -1 },
    ];

    while (!frontier.isEmpty()) {
      const current = frontier.dequeue();
      if (current && current.x === endNode.x && current.y === endNode.y) {
        break;
      }

      if (current) {
        for (const dir of directions) {
          const next = { x: current.x + dir.x, y: current.y + dir.y };
          if (
            !this.grid.isWalkable(
              next.x * this.cellSize,
              next.y * this.cellSize
            )
          )
            continue;

          const newCost = (costSoFar.get(`${current.x},${current.y}`) || 0) + 1;
          if (
            !costSoFar.has(`${next.x},${next.y}`) ||
            newCost < (costSoFar.get(`${next.x},${next.y}`) || Infinity)
          ) {
            costSoFar.set(`${next.x},${next.y}`, newCost);
            const priority = newCost;
            frontier.enqueue(next, priority);
            cameFrom.set(`${next.x},${next.y}`, current);
          }
        }
      }
    }

    const path: { x: number; y: number }[] = [];
    let current = endNode;
    const visitedNodes = new Set<string>();

    while (current) {
      const key = `${current.x},${current.y}`;
      if (visitedNodes.has(key)) {
        console.error("Detected loop in path reconstruction.");
        break;
      }
      visitedNodes.add(key);

      path.push({ x: current.x * this.cellSize, y: current.y * this.cellSize });
      const prev = cameFrom.get(key);
      if (!prev) break;
      current = prev;
    }

    path.reverse();
    return path;
  }
}


*/
