import { Container,  autoDetectRenderer, loader } from 'pixi.js';
import { Person } from './classes/Person';

// create PIXI renderer
const canvas = document.getElementById('adneoport') as HTMLCanvasElement;
const renderer: any = autoDetectRenderer(window.innerWidth, window.innerHeight, {
	view: canvas
});

// stage is the first container to put in canvas
const stage = new Container();

// Use Pixi's loader to preload an image
loader
	.add('/public/img/hero-white.png')
	.load(setup);

// setup function will run when the image has loaded
function setup () {

	// Create the hero sprite from the texture
	const hero = new Person('Samir The Machine', '/public/img/hero-white.png');

	// Add the cat to the stage
	stage.addChild(hero.sprite);

	const gameLoop = () => {
		window.requestAnimationFrame(gameLoop);
		hero.moveRandomly({x: 1, y: 1})
		renderer.render(stage);
	}
	gameLoop();
}
