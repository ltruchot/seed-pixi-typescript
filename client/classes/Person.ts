import {  Sprite,  loader } from 'pixi.js';
import {  ICoordinate } from './../models/common.model';

export class Person {

	sprite: Sprite

	constructor (public name: string, private img: string) {
		console.log('Hello, my name is ' + this.name)
		this.sprite = new Sprite(loader.resources[this.img].texture);
	}

	moveRandomly (options: ICoordinate) {
		if (Math.random() > 0.5) {
			this.sprite.position.x += options.x;
		} else {
			this.sprite.position.y += options.y;
		}
	}
}
