import * as PIXI from './../node_modules/pixi.js/dist/pixi.js';

const renderer = PIXI.autoDetectRenderer(256, 256);

document.body.appendChild(renderer.view);

const stage = new PIXI.Container();
renderer.render(stage);