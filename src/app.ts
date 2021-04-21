import {
  Application, Loader, Resource, Texture,
} from 'pixi.js';
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
