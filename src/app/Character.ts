import { Sprite, Texture, Loader } from 'pixi.js';

const loader = Loader.shared;

export default class Character {
  sprite: Sprite;

  speed = 2;

  direction: 'left' | 'right' = 'right';

  constructor(public texture: Texture) {
    this.sprite = new Sprite(loader.resources.samir.texture);
    this.sprite.anchor.y = 0.5;
    this.sprite.anchor.x = 0.5;
  }

  setTopPosition(y: number): void {
    this.sprite.y = y;
  }

  move(): void {
    if (this.direction === 'right') {
      this.sprite.x += this.speed;
    } else {
      this.sprite.x -= this.speed;
    }
  }
}
