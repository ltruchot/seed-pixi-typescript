import * as PIXI from 'pixi.js';
import * as _ from 'lodash'

const renderer = PIXI.autoDetectRenderer(256, 256);

document.body.appendChild(renderer.view);

const stage = new PIXI.Container();
renderer.render(stage);