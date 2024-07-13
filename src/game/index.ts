import { Application, Container, Ticker } from "pixi.js";
import { Grid } from "./grid";
import { Player } from "./player";
import { setupInput } from "./input";
import { EnemyAI } from "./enemyAi";
import { Minimap } from "./minimap";
import { Enemy } from "./enemy";
import { Building } from "./building";

export class Game {
  private app: Application;
  private container: Container;
  private grid: Grid;

  private player: Player;
  private enemies: Enemy[] = [];
  private enemyAI: EnemyAI;
  private buildings: Building[] = [];
  private minimap: Minimap;

  constructor() {
    this.app = new Application();
    this.container = new Container();
    this.grid = new Grid(4096, 4096);

    this.player = new Player(this.container, this.grid);
    this.enemyAI = new EnemyAI(this.player);
    this.minimap = new Minimap(
      this.app,
      this.container,
      this.grid,
      this.player,
      this.enemies
    );

    this.initalizeGame();
  }

  private async initalizeGame() {
    await this.app.init({
      width: 800,
      height: 600,
      backgroundColor: 0x1099bb,
    });

    await this.grid.init(this.container);

    // Now initiate the player
    await this.player.init();

    setupInput(this.app, this.container, this.player, this.grid);

    // Ad rest of initial enemies and buildings:
    await this.addEnemiesToGrid();
    await this.addBuildingsToGrid();
    this.minimap.init();

    this.app.stage.addChild(this.container);
    document.body.appendChild(this.app.canvas);
    this.app.ticker.add(this.update.bind(this));
  }

  private async addEnemiesToGrid() {
    // Initialize enemies
    for (let i = 0; i < 5; i++) {
      const enemy = new Enemy(this.container, this.grid);
      await enemy.init();
      this.enemies.push(enemy);
      this.enemyAI.addEnemy(enemy);
    }
  }

  private async addBuildingsToGrid() {
    const building = new Building(this.container, this.grid);
    await building.init(200, 200);
    this.buildings.push(building);
  }

  /*
    Main method for game ticks and gets called by pixie
  */
  private update(ticker: Ticker) {
    this.player.update(ticker);
    this.enemies.forEach((enemy) => enemy.update(ticker));
    this.enemyAI.update();
    this.minimap.update();
  }
}
