import {
  Sprite, Texture, Resource,
} from 'pixi.js';

type Character = {
  sprite: Sprite;
  speed: number;
  direction: 'left' | 'right';
}

export const createCharacter = (texture: Texture<Resource>, x: number, y: number): Character => {
  const sprite = new Sprite(texture); // create sprite
  sprite.anchor.set(0.5); // center origin of sprite
  sprite.y = y; // center in canvas
  sprite.x = x;
  return {
    sprite,
    speed: 2,
    direction: 'right',
  };
};

export const moveCharacter = (c: Character): void => {
  if (c.direction === 'right') {
    c.sprite.x += c.speed;
  } else {
    c.sprite.x -= c.speed;
  }
};
