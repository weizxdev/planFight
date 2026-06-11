import { _decorator, Component, director, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("StatGame")
export class StatGame extends Component {
  start() {}

  update(deltaTime: number) {}

  startGame() {
    director.loadScene("Game");
  }
}
