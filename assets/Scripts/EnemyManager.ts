import {
  _decorator,
  AudioClip,
  Component,
  director,
  instantiate,
  math,
  Node,
  Prefab,
} from "cc";
import { GameManager } from "./GameManager";
import { Enemy } from "./Enemy";
import { AudioMgr } from "./AudioMgr";
const { ccclass, property } = _decorator;

@ccclass("EnemyManager")
export class EnemyManager extends Component {
  private static instance: EnemyManager;
  public static getInstance(): EnemyManager {
    return this.instance;
  }

  @property
  enemy0SpawnRate: number = 1;

  @property(Prefab)
  enemy0Prefab: Prefab = null;

  @property
  enemy1SpawnRate: number = 3;

  @property(Prefab)
  enemy1Prefab: Prefab = null;

  @property
  enemy2SpawnRate: number = 5;

  @property(Prefab)
  enemy2Prefab: Prefab = null;

  @property
  rewardSpawnRate: number = 15;

  @property(Prefab)
  reward1Prefab: Prefab = null;

  @property(Prefab)
  reward2Prefab: Prefab = null;

  @property([Node])
  enemyList: Node[] = [];

  @property(AudioClip)
  useBombAudio: AudioClip = null;

  protected onLoad(): void {
    EnemyManager.instance = this;
  }

  start() {
    this.schedule(this.enemy0Spawn, this.enemy0SpawnRate);
    this.schedule(this.enemy1Spawn, this.enemy1SpawnRate);
    this.schedule(this.enemy2Spawn, this.enemy2SpawnRate);
    this.schedule(this.rewardSpawn, this.rewardSpawnRate);
  }

  protected onDestroy(): void {
    this.unschedule(this.enemy0Spawn);
    this.unschedule(this.enemy1Spawn);
    this.unschedule(this.enemy2Spawn);
    this.unschedule(this.rewardSpawn);
  }

  update(deltaTime: number) {}

  enemy0Spawn() {
    this.enemySpawn(this.enemy0Prefab, -215, 215, 450);
  }

  enemy1Spawn() {
    this.enemySpawn(this.enemy1Prefab, -200, 200, 475);
  }

  enemy2Spawn() {
    this.enemySpawn(this.enemy2Prefab, -115, 115, 560);
  }

  rewardSpawn() {
    let prefab = null;
    const num = math.randomRangeInt(0, 2);

    if (num == 0) {
      prefab = this.reward1Prefab;
    } else {
      prefab = this.reward2Prefab;
    }
    this.enemySpawn(prefab, -207, 207, 474, true);
  }

  enemySpawn(
    prefab: Prefab,
    minX: number,
    maxX: number,
    y: number,
    isReward = false,
  ) {
    const enemy = instantiate(prefab);
    if (!isReward) {
      this.addEnemy(enemy);
    }
    this.node.addChild(enemy);
    const x = math.randomRangeInt(minX, maxX);
    enemy.setPosition(x, y);
  }

  addEnemy(enemy: Node) {
    this.enemyList.push(enemy);
  }

  removeEnemy(enemy: Node) {
    const index = this.enemyList.indexOf(enemy);
    if (index !== -1) {
      this.enemyList.splice(index, 1);
    }
  }

  destroyAllEnemy() {
    AudioMgr.inst.playOneShot(this.useBombAudio);
    GameManager.getInstance().updateBoomNum(-1);
    for (const e of this.enemyList) {
      const enemy = e.getComponent(Enemy);
      enemy.killNow();
    }
  }
}
