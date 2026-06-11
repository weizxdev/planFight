import { _decorator, Component, Label, Node } from "cc";
import { GameManager } from "../GameManager";
const { ccclass, property } = _decorator;

@ccclass("BoomUI")
export class BoomUI extends Component {
  @property(Label)
  numLabel: Label = null;

  gameManagerInstance: GameManager = null;

  start() {
    this.gameManagerInstance = GameManager.getInstance();
  }

  update(deltaTime: number) {}

  updateBoomUI(num: number) {
    this.numLabel.string = num.toString();
  }
}
