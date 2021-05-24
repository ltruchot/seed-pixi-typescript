/* eslint-disable no-param-reassign */
import {
  Sprite, Texture, Resource,
} from 'pixi.js';

export type Entity = {
  sprite: Sprite;
  speed: number;
  direction: 'left' | 'right';
}

export const createEntity = (texture: Texture<Resource>, x: number, y: number): Entity => {
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

export const getNextEntityDirection = (viewWidth: number, c: Entity): 'left' | 'right' => {
  if (c.sprite.x >= viewWidth) {
    return 'left';
  }
  if (c.sprite.x <= 0) {
    return 'right';
  }
  return c.direction;
};

export const getNextEntityPosition = (c: Entity): number => {
  if (c.direction === 'right') {
    return c.sprite.x + c.speed;
  }
  return c.sprite.x - c.speed;
};
