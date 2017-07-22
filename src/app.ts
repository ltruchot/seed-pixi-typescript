import * as PIXI from 'pixi.js';

// 3 following are only there as an example of TypeScript app scaffolding.
import { IHuman } from './interfaces/utils';
import { Person } from './classes/Person';
import { values } from './data/values';
console.log(<IHuman>new Person('Raymond'), values)


const renderer = PIXI.autoDetectRenderer(256, 256);

// the renderer is a pure and simple HTML canvas
document.body.appendChild(renderer.view);

// stage is the first container to put in canvas
const stage: PIXI.Container = new PIXI.Container();
renderer.render(stage);

// Use Pixi's loader to preload an image
PIXI.loader
	.add('/assets/img/hero-white.png')
	.load(setup);

// setup function will run when the image has loaded
function setup () {

	// Create the hero sprite from the texture
	const hero: PIXI.Sprite = new PIXI.Sprite(
		PIXI.loader.resources['/assets/img/hero-white.png'].texture
	);

	// Add the cat to the stage
	stage.addChild(hero);

	// Render the stage
	renderer.render(stage);
}
