import { _decorator, Component, director, Node } from "cc";
import { BoomUI } from "./UI/BoomUI";
import { SocreUI } from "./UI/SocreUI";
import { Player } from "./Player";
import { GameOverUI } from "./UI/GameOverUI";
const { ccclass, property } = _decorator;

@ccclass("GameManager")
export class GameManager extends Component {
  private static instance: GameManager;
  public static getInstance(): GameManager {
    return this.instance;
  }

  @property
  private boomNum: number = 0;

  @property(BoomUI)
  boomUI: BoomUI = null;

  @property(SocreUI)
  socreUI: SocreUI = null;

  @property
  private socre: number = 0;

  @property(Player)
  player: Player = null;

  @property(Node)
  pauseBtn: Node = null;

  @property(Node)
  resumeBtn: Node = null;

  @property(GameOverUI)
  gameOverUI: GameOverUI = null;

  protected onLoad(): void {
    GameManager.instance = this;
  }

  public updateBoomNum(num: number) {
    this.boomNum += num;
    this.boomUI.updateBoomUI(this.boomNum);
  }

  public getBoonNum(): number {
    return this.boomNum;
  }

  public updateSocre(num: number) {
    this.socre += num;
    this.socreUI.updateSocreUI(this.socre);
  }

  pauseGame() {
    director.pause();
    this.player.disableControl();
    this.pauseBtn.active = false;
    this.resumeBtn.active = true;
  }

  resumeGame() {
    director.resume();
    this.player.enableControl();
    this.pauseBtn.active = true;
    this.resumeBtn.active = false;
  }

  gameOver() {
    this.pauseGame();
    const key = "maxSocre";
    const maxSocreItem = localStorage.getItem(key);
    let maxSocre = Number(JSON.parse(maxSocreItem || "0") || 0);
    if (maxSocre < this.socre) {
      maxSocre = this.socre;
      localStorage.setItem(key, JSON.stringify(this.socre));
    }
    this.gameOverUI.showGameOverUI(maxSocre, this.socre);
  }

  resartGame() {
    director.loadScene(director.getScene().name);
    this.resumeGame();
  }

  hasBoom(): boolean {
    return this.boomNum > 0;
  }
}
