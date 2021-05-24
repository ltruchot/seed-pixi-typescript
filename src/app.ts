import {
  Application, Loader, Resource, Texture,
} from 'pixi.js';
import {
  createEntity, getNextEntityDirection, getNextEntityPosition,
} from './app/Entity';

// constants
const SIZE = 512;
const CENTER = SIZE / 2;

// create and append app
const app = new Application({
  width: SIZE,
  height: SIZE,
  backgroundColor: 0x1099bb, // light blue
});
document.body.appendChild(app.view);

// preload needed assets
const loader = Loader.shared;
loader.add('samir', '/assets/img/hero.png');

// when loader is ready
loader.load(() => {
  // create and append hero
  const heroTexture = loader.resources.samir.texture as Texture<Resource>;
  const hero = createEntity(heroTexture, CENTER, CENTER);
  app.stage.addChild(hero.sprite);

  // animate hero each "tick": go left or right continuously
  app.ticker.add(() => {
    hero.direction = getNextEntityDirection(app.view.width, hero);
    hero.sprite.x = getNextEntityPosition(hero);
  });
});
