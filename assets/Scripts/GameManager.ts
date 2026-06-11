import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("GameManager")
export class GameManager extends Component {
  private static instance: GameManager;
  public static getInstance(): GameManager {
    return this.instance;
  }
  public addBoomNum() {
    this.boomNum += 1;
  }

  @property
  boomNum: number = 0;

  protected start(): void {
    GameManager.instance = this;
  }
}
