import { Application, loader } from 'pixi.js';
import { Character } from '@app/character.class';
class Game {
  private app: Application;
  constructor() {
    // instantiate app
    this.app = new Application({
      width: 800,
      height: 600,
      backgroundColor: 0x1099bb // light blue
    });

    // create view in DOM
    document.body.appendChild(this.app.view);

    // preload needed assets
    loader.add('samir', '/assets/img/hero.png');

    // then launch app
    loader.load(this.setup.bind(this));
  }

  setup(): void {
    // append hero
    const hero = new Character(loader.resources['samir'].texture);
    const heroSprite = hero.sprite;
    this.app.stage.addChild(heroSprite);
    heroSprite.y = 300;

    //  animate hero
    let moveLeft = true;
    this.app.ticker.add(() => {
      const speed = 2;
      if (heroSprite.x < this.app.view.width && moveLeft) {
        heroSprite.x += speed;
      } else {
        heroSprite.x -= speed;
        moveLeft = heroSprite.x <= 0;
      }
    });
  }
}

new Game();
