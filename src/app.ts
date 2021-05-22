import {
  Application, Loader, Resource, Texture,
} from 'pixi.js';
<<<<<<< HEAD
import Character from './app/Character';

const loader = Loader.shared;

class Game {
  private app: Application;

  constructor() {
    // instantiate app
    this.app = new Application({
      width: 512,
      height: 512,
      backgroundColor: 0x1099bb, // light blue
    });

    // create view in DOM
    document.body.appendChild(this.app.view);

    // preload needed assets
    loader.add('samir', '/assets/img/hero.png');

    // then launch app on loader ready
    loader.load(this.setup.bind(this));
  }

  setup(): void {
    // append hero
    const hero = new Character(loader.resources.samir.texture as Texture<Resource>);
    this.app.stage.addChild(hero.sprite);
    hero.setTopPosition(256);

    //  animate hero
    this.app.ticker.add(() => {
      if (hero.sprite.x >= this.app.view.width) {
        hero.direction = 'left';
      } else if (hero.sprite.x < 0) {
        hero.direction = 'right';
      }
      hero.move();
    });
  }
}

// eslint-disable-next-line no-new
new Game();
=======
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
>>>>>>> master
