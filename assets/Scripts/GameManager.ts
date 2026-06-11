import { _decorator, Component, Node } from "cc";
import { BoomUI } from "./UI/BoomUI";
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

  protected onLoad(): void {
    GameManager.instance = this;
  }

  public addBoomNum() {
    this.boomNum += 1;
    this.boomUI.updateBoomUI(this.boomNum);
  }

  public getBoonNum(): number {
    return this.boomNum;
  }
}
