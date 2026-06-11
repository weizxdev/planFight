import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;

export enum RewardType {
  TwoShoot,
  Boom,
}

@ccclass("Reward")
export class Reward extends Component {
  @property
  speed: number = 80;

  @property
  rewardType: RewardType = RewardType.TwoShoot;

  start() {}

  update(deltaTime: number) {
    const pos = this.node.position;
    const s = this.speed * deltaTime;
    this.node.setPosition(pos.x, pos.y - s);
    if (this.node.y < -582) {
      this.node.destroy();
    }
  }
}
