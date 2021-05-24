import {
  Application, Loader, Resource, Text, Texture, Ticker,
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
  sharedTicker: true,
  sharedLoader: true,
});
document.body.appendChild(app.view);
const loader = Loader.shared;
const ticker = Ticker.shared;

// preload needed assets
loader.add('samir', '/assets/img/hero.png');

// when loader is ready
loader.load(() => {
  // create and append FPS text
  const fps = new Text('FPS: 0', { fill: 0xffffff });
  app.stage.addChild(fps);

  // create and append hero
  const heroTexture = loader.resources.samir.texture as Texture<Resource>;
  const hero = createEntity(heroTexture, CENTER, CENTER);
  app.stage.addChild(hero.sprite);

  // animate hero each "tick": go left or right continuously
  ticker.add(() => {
    fps.text = `FPS: ${ticker.FPS.toFixed(2)}`;
    hero.direction = getNextEntityDirection(app.view.width, hero);
    hero.sprite.x = getNextEntityPosition(hero);
  });
});
