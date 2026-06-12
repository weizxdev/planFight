import { _decorator, Component, Node, EventTouch, Vec2 } from "cc";
import { EnemyManager } from "./EnemyManager";
import { GameManager } from "./GameManager";
const { ccclass, property } = _decorator;

@ccclass("DoubleClick")
export class DoubleClick extends Component {
  // 双击最大时间间隔(毫秒)
  private readonly DOUBLE_CLICK_TIME = 300;
  // 两次点击允许的坐标偏移(像素)
  private readonly CLICK_OFFSET = 5;

  private lastClickTime: number = 0;
  private lastClickPos: Vec2 = new Vec2();

  onLoad() {
    // 注册触摸抬起事件
    this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
  }

  onDestroy() {
    // 移除监听，防止内存泄漏
    this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
  }

  private onTouchEnd(event: EventTouch) {
    const nowTime = Date.now();
    const curPos = event.getUILocation();

    // 第一次点击
    if (this.lastClickTime === 0) {
      this.lastClickTime = nowTime;
      this.lastClickPos.set(curPos);
      return;
    }

    // 计算时间差 & 坐标差
    const timeDiff = nowTime - this.lastClickTime;
    const posDiff = Vec2.distance(this.lastClickPos, curPos);

    // 判定双击
    if (timeDiff < this.DOUBLE_CLICK_TIME && posDiff < this.CLICK_OFFSET) {
      this.onDoubleClick();
      // 重置状态，避免连续触发
      this.lastClickTime = 0;
    } else {
      // 间隔超时/位置偏移过大，刷新为新的第一次点击
      this.lastClickTime = nowTime;
      this.lastClickPos.set(curPos);
    }
  }

  // 双击回调逻辑（在这里写你的业务）
  private onDoubleClick() {
    console.log("✅ 触发双击事件");
    const flag = GameManager.getInstance().hasBoom();
    if (!flag) {
      return;
    }
    EnemyManager.getInstance().destroyAllEnemy();
  }
}
