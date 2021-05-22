import {
  Application, Loader, Resource, Texture,
} from 'pixi.js';
import { createCharacter, moveCharacter } from './app/character';

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
  const hero = createCharacter(heroTexture, CENTER, CENTER);
  app.stage.addChild(hero.sprite);

  // animate hero each "tick"
  app.ticker.add(() => {
    if (hero.sprite.x >= app.view.width) {
      hero.direction = 'left';
    } else if (hero.sprite.x <= 0) {
      hero.direction = 'right';
    }
    moveCharacter(hero);
  });
});
