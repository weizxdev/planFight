import {
  _decorator,
  Animation,
  Collider2D,
  Component,
  Contact2DType,
  Sprite,
} from "cc";
import { Bullet } from "./Bullet";
import { GameManager } from "./GameManager";
const { ccclass, property } = _decorator;

@ccclass("Enemy")
export class Enemy extends Component {
  @property
  speed: number = 300;

  @property(Animation)
  animation: Animation = null;

  @property
  hp: number = 1;

  @property
  hit: string = "";

  @property
  down: string = "";

  @property
  socreNum: number = 100;

  collider: Collider2D = null;

  protected start(): void {
    // 注册单个碰撞体的回调函数
    this.collider = this.getComponent(Collider2D);
    if (this.collider) {
      this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }
  }

  update(deltaTime: number) {
    if (this.hp > 0) {
      const pos = this.node.position;
      const s = this.speed * deltaTime;
      this.node.setPosition(pos.x, pos.y - s);
    }

    if (this.node.y < -582) {
      this.node.destroy();
    }
  }

  protected onDestroy(): void {
    if (this.collider) {
      this.collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }
  }

  onBeginContact(_: Collider2D, otherCollider: Collider2D) {
    if (otherCollider.getComponent(Bullet)) {
      otherCollider.enabled = false;
      otherCollider.getComponent(Sprite).enabled = false;
    }
    this.hp -= 1;
    if (this.hp > 0) {
      this.animation.play(this.hit);
    } else {
      this.animation.play(this.down);
    }

    if (this.hp <= 0) {
      GameManager.getInstance().updateSocre(this.socreNum);

      if (this.collider) {
        this.collider.enabled = false;
      }
      this.scheduleOnce(() => {
        this.node.destroy();
      }, 1);
    }
  }
}
