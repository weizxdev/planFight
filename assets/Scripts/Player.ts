import {
  _decorator,
  Component,
  EventTouch,
  Input,
  input,
  Node,
  Vec3,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("Player")
export class Player extends Component {
  protected onLoad(): void {
    input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
  }

  protected onDestroy(): void {
    input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
  }

  onTouchMove(evnet: EventTouch) {
    const pos = this.node.position;
    const x = evnet.getDeltaX();
    const y = evnet.getDeltaY();
    let targetPos = new Vec3(pos.x + x, pos.y + y);
    if (targetPos.x <= -230) {
      targetPos.x = -230;
    }
    if (targetPos.x >= 230) {
      targetPos.x = 230;
    }
    if (targetPos.y >= 380) {
      targetPos.y = 380;
    }
    if (targetPos.y <= -380) {
      targetPos.y = -380;
    }
    this.node.setPosition(targetPos);
  }
}
