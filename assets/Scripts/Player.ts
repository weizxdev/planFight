import {
  _decorator,
  Component,
  EventTouch,
  Input,
  input,
  instantiate,
  Node,
  Prefab,
  Vec3,
} from "cc";
const { ccclass, property } = _decorator;

enum ShootType {
  OneShoot,
  TwoShoot,
}

@ccclass("Player")
export class Player extends Component {
  @property
  shootRate: number = 0.3;
  shootTimer: number = 0;

  @property(Prefab)
  bullet1Prefa: Prefab = null;
  @property(Prefab)
  bullet2Prefa: Prefab = null;
  @property(Prefab)
  bullet3Prefa: Prefab = null;

  @property(Node)
  bullet1Pos: Node = null;
  @property(Node)
  bullet2Pos: Node = null;
  @property(Node)
  bullet3Pos: Node = null;

  @property(Node)
  bulletParent: Node = null;

  @property(typeof ShootType)
  shootType: ShootType = ShootType.OneShoot;

  protected onLoad(): void {
    input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
  }

  protected update(dt: number): void {
    switch (this.shootType) {
      case ShootType.OneShoot:
        this.shootRate = 0.3;
        this.oneShoot(dt);
        break;
      case ShootType.TwoShoot:
        this.shootRate = 0.2;
        this.twoShoot(dt);
        break;
    }
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

  oneShoot(dt: number) {
    this.shootTimer += dt;
    if (this.shootTimer > this.shootRate) {
      this.shootTimer = 0;
      const bullet1 = instantiate(this.bullet1Prefa);
      this.bulletParent.addChild(bullet1);
      bullet1.setWorldPosition(this.bullet1Pos.getWorldPosition());
    }
  }

  twoShoot(dt: number) {
    this.shootTimer += dt;
    if (this.shootTimer > this.shootRate) {
      this.shootTimer = 0;
      const bullet2 = instantiate(this.bullet2Prefa);
      const bullet3 = instantiate(this.bullet3Prefa);
      this.bulletParent.addChild(bullet2);
      this.bulletParent.addChild(bullet3);
      bullet2.setWorldPosition(this.bullet2Pos.getWorldPosition());
      bullet3.setWorldPosition(this.bullet3Pos.getWorldPosition());
    }
  }
}
