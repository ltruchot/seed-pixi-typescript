import { Application, Sprite, loader } from 'pixi.js';

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

  setup() {
    // append hero
    const heroSprite = new Sprite(loader.resources['samir'].texture);
    heroSprite.anchor.y = 0.5;
    heroSprite.anchor.x = 0.5;
    heroSprite.y = this.app.view.height / 2;
    this.app.stage.addChild(heroSprite);

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
