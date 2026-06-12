import { _decorator, Component, Label, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("GameOverUI")
export class GameOverUI extends Component {
  @property(Label)
  maxSocre: Label = null;

  @property(Label)
  currentSocre: Label = null;

  showGameOverUI(maxSocre: number, currentSocre: number) {
    this.node.active = true;
    this.maxSocre.string = maxSocre.toString();
    this.currentSocre.string = currentSocre.toString();
  }
}
