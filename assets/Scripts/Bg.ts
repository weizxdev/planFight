import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("Bg")
export class Bg extends Component {
  @property(Node)
  bg01: Node = null;
  @property(Node)
  bg02: Node = null;
  @property
  speed: number = 150;

  start() {}

  update(deltaTime: number) {
    this.bg01.y -= this.speed * deltaTime;
    this.bg02.y -= this.speed * deltaTime;
    if (this.bg01.y < -852) {
      this.bg01.y += 852 * 2;
    }
    if (this.bg02.y < -852) {
      this.bg02.y += 852 * 2;
    }
  }
}
