import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("Bullet")
export class Bullet extends Component {
  @property
  speed: number = 500;

  update(deltaTime: number) {
    const pos = this.node.position;
    const s = this.speed * deltaTime;
    this.node.setPosition(pos.x, pos.y + s);

    if (pos.y >= 440) {
      this.node.destroy();
    }
  }
}
