import { _decorator, Component, Label, Node } from "cc";
import { GameManager } from "../GameManager";
const { ccclass, property } = _decorator;

@ccclass("LifeCountUI")
export class LifeCountUI extends Component {
  @property(Label)
  numLabel: Label = null;

  updateLifeCountUI(num: number) {
    this.numLabel.string = num.toString();
  }
}
