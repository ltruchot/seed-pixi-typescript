import { Sprite, Texture, loader } from 'pixi.js';

export class Character {
  sprite: Sprite;
  constructor(public texture: Texture) {
    this.sprite = new Sprite(loader.resources['samir'].texture);
    this.sprite.anchor.y = 0.5;
    this.sprite.anchor.x = 0.5;
  }
}
