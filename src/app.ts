import * as PIXI from 'pixi.js';
import * as _ from 'lodash';

const renderer = PIXI.autoDetectRenderer(256, 256);

// the renderer is a pure and simple HTML canvas
document.body.appendChild(renderer.view);

// stage is the first container to put in canvas
const stage = new PIXI.Container();
renderer.render(stage);

//Use Pixi's built-in `loader` object to load an image
PIXI.loader
  .add("/assets/img/hero-white.png")
  .load(setup);

  //This `setup` function will run when the image has loaded
function setup() {

  //Create the `cat` sprite from the texture
  var cat = new PIXI.Sprite(
    PIXI.loader.resources["/assets/img/hero-white.png"].texture
  );

  //Add the cat to the stage
  stage.addChild(cat);

  //Render the stage
  renderer.render(stage);
}
console.log('coucou')
