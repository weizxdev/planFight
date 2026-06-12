import {
  _decorator,
  Animation,
  AudioClip,
  Collider2D,
  Component,
  Contact2DType,
  EventTouch,
  Input,
  input,
  instantiate,
  Node,
  Prefab,
  Sprite,
  Vec2,
} from "cc";
import { Reward, RewardType } from "./Reward";
import { GameManager } from "./GameManager";
import { LifeCountUI } from "./UI/LifeCountUI";
import { AudioMgr } from "./AudioMgr";
const { ccclass, property } = _decorator;

enum ShootType {
  OneShoot,
  TwoShoot,
  None,
}

@ccclass("Player")
export class Player extends Component {
  @property
  shootRate: number = 0.3;

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

  @property(Animation)
  animation: Animation = null;

  @property
  lifeCount: number = 3;

  @property
  hit: string = "";

  @property
  down: string = "";

  @property
  invoRate: number = 0.3;

  @property
  twoShootTime: number = 8;

  @property(LifeCountUI)
  lifeCountUI: LifeCountUI = null;

  @property(AudioClip)
  bulletAduio: AudioClip = null;

  @property(AudioClip)
  getBombAudio: AudioClip = null;

  @property(AudioClip)
  getDoubleShootAudio: AudioClip = null;

  shootTimer: number = 0;
  invoTimer: number = 0;
  twoShootTimer: number = 0;
  isInvo: boolean = false;
  collider: Collider2D = null;
  isCanControl: boolean = true;

  // 修正为 Vec2，匹配 getUILocation 参数类型
  private touchStartUI: Vec2 = new Vec2();
  private currentTouchId: number = -1;

  protected onLoad(): void {
    input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
    input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
    input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    input.on(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
  }

  protected start(): void {
    this.changeLifeCOunt(0);
    this.collider = this.getComponent(Collider2D);
    if (this.collider) {
      this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }
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

    if (this.isInvo) {
      this.invoTimer += dt;
      if (this.invoTimer > this.invoRate) {
        this.isInvo = false;
      }
    }
  }

  protected onDestroy(): void {
    input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
    input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
    input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    input.off(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);

    if (this.collider) {
      this.collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }
  }

  changeLifeCOunt(count: number) {
    this.lifeCount += count;
    this.lifeCountUI.updateLifeCountUI(this.lifeCount);
  }

  onBeginContact(_: Collider2D, otherCollider: Collider2D) {
    const reward = otherCollider.getComponent(Reward);
    if (reward) {
      this.onContactToReward(reward);
    } else {
      this.onContactToEnemy(otherCollider);
    }
  }

  beginOneShoot() {
    this.shootType = ShootType.OneShoot;
  }

  beginTwoShoot() {
    this.twoShootTimer = 0;
    this.shootType = ShootType.TwoShoot;
  }

  lastReward: Reward = null;
  onContactToReward(reward: Reward) {
    if (this.lastReward == reward) {
      return;
    }
    this.lastReward = reward;
    switch (reward.rewardType) {
      case RewardType.TwoShoot:
        AudioMgr.inst.playOneShot(this.getDoubleShootAudio, 1);
        this.beginTwoShoot();
        break;
      case RewardType.Boom:
        AudioMgr.inst.playOneShot(this.getBombAudio, 1);
        GameManager.getInstance().updateBoomNum(1);
        break;
    }
    reward.getComponent(Sprite).enabled = false;
    reward.getComponent(Collider2D).enabled = false;
  }

  onContactToEnemy(otherCollider: Collider2D) {
    if (this.isInvo) {
      return;
    }

    this.isInvo = true;
    this.invoTimer = 0;
    this.changeLifeCOunt(-1);
    if (this.lifeCount > 0) {
      this.animation.play(this.hit);
    } else {
      this.animation.play(this.down);
    }

    if (this.lifeCount <= 0) {
      this.shootType = ShootType.None;
      if (this.collider) {
        this.collider.enabled = false;
      }

      this.scheduleOnce(() => {
        GameManager.getInstance().gameOver();
      }, 1);
    }
  }

  onTouchStart(event: EventTouch) {
    if (this.lifeCount < 1 || !this.isCanControl) return;
    if (this.currentTouchId !== -1) return;

    this.currentTouchId = event.getID();
    // 获取 UI 坐标系坐标（和设计分辨率一致，不受编辑器缩放影响）
    event.getUILocation(this.touchStartUI);
  }

  onTouchMove(event: EventTouch) {
    if (this.lifeCount < 1 || !this.isCanControl) return;
    if (event.getID() !== this.currentTouchId) return;

    const curUI = new Vec2();
    event.getUILocation(curUI);

    // 计算 UI 坐标偏移（和世界坐标 1:1 对应，不受显示比例影响）
    const offsetX = curUI.x - this.touchStartUI.x;
    const offsetY = curUI.y - this.touchStartUI.y;

    let targetX = this.node.position.x + offsetX;
    let targetY = this.node.position.y + offsetY;

    // 完全保留你原始边界数值
    if (targetX <= -230) targetX = -230;
    if (targetX >= 230) targetX = 230;
    if (targetY >= 380) targetY = 380;
    if (targetY <= -380) targetY = -380;

    this.node.setPosition(targetX, targetY);
    // 每帧更新起点，消除累计偏移
    this.touchStartUI.set(curUI);
  }

  onTouchEnd(event: EventTouch) {
    if (event.getID() === this.currentTouchId) {
      this.currentTouchId = -1;
    }
  }

  oneShoot(dt: number) {
    this.shootTimer += dt;
    if (this.shootTimer > this.shootRate) {
      this.shootTimer = 0;
      AudioMgr.inst.playOneShot(this.bulletAduio, 0.2);
      const bullet1 = instantiate(this.bullet1Prefa);
      this.bulletParent.addChild(bullet1);
      bullet1.setWorldPosition(this.bullet1Pos.getWorldPosition());
    }
  }

  twoShoot(dt: number) {
    this.shootTimer += dt;
    if (this.shootTimer > this.shootRate) {
      this.shootTimer = 0;
      AudioMgr.inst.playOneShot(this.bulletAduio, 0.2);
      const bullet2 = instantiate(this.bullet2Prefa);
      const bullet3 = instantiate(this.bullet3Prefa);
      this.bulletParent.addChild(bullet2);
      this.bulletParent.addChild(bullet3);
      bullet2.setWorldPosition(this.bullet2Pos.getWorldPosition());
      bullet3.setWorldPosition(this.bullet3Pos.getWorldPosition());
    }

    this.twoShootTimer += dt;
    if (this.twoShootTimer > this.twoShootTime) {
      this.beginOneShoot();
    }
  }

  disableControl() {
    this.isCanControl = false;
  }

  enableControl() {
    this.isCanControl = true;
  }
}
