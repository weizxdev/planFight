import { _decorator, Component, Label, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("SocreUI")
export class SocreUI extends Component {
  @property(Label)
  numLabel: Label = null;

  updateSocreUI(num: number) {
    this.numLabel.string = num.toString();
  }
}
