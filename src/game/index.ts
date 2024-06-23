import { Application, Container, Ticker } from "pixi.js";
import { Grid } from "./grid";
import { Player } from "./player";
import { setupInput } from "./input";

export class Game {
  private app: Application;
  private container: Container;
  private grid: Grid;
  private player: Player;

  constructor() {
    this.app = new Application();
    this.container = new Container();
    this.grid = new Grid(4096, 4096);
    this.player = new Player(this.container, this.grid);
    this.initalizeGame();
  }

  private async initalizeGame() {
    await this.app.init({
      width: 800,
      height: 600,
      backgroundColor: 0x1099bb,
    });

    this.app.stage.addChild(this.container);
    document.body.appendChild(this.app.canvas);
    this.app.ticker.add(this.update.bind(this));
  }

  public async init() {
    await this.grid.init(this.container);
    await this.player.init();
    setupInput(this.app, this.container, this.player, this.grid);
  }

  private update(ticker: Ticker) {
    this.player.update(ticker);
  }
}

/*

import { Application, Container } from "pixi.js";
import { Grid } from "./grid";
import { Player } from "./player";
import { setupInput } from "./input";

export class Game {
  private app: Application;
  private container: Container;
  private grid: Grid;
  private player: Player;

  constructor() {
    this.app = new Application();
    this.container = new Container();
    this.grid = new Grid(4096, 4096);
    this.player = new Player(this.container);
    this.initalizeGame();
  }

  private async initalizeGame() {
    await this.app.init({
      width: 800,
      height: 600,
      backgroundColor: 0x1099bb,
    });

    this.app.stage.addChild(this.container);
    document.body.appendChild(this.app.canvas);
  }

  public async init() {
    await this.grid.init(this.container);
    await this.player.init();
    setupInput(this.app, this.container, this.player, this.grid);
  }
}

*/
