// Entry point: create the Pixi app, load the assets, run the game loop.
import { Application, Assets, Graphics, Sprite, Text, type Texture } from "pixi.js";
import heroUrl from "./assets/hero.png";
import { createEntity, moveEntity } from "./entity.ts";
import { directionFrom, trackKeys } from "./input.ts";

const app = new Application();
await app.init({ background: 0x1099bb, resizeTo: globalThis.window });
document.body.append(app.canvas);

const center = { x: app.screen.width / 2, y: app.screen.height / 2 };

// A wall: an 80px square just below the hero.
const wall = new Graphics().rect(center.x - 40, center.y + 40, 80, 80).fill(0x0b4f6c);

const texture = await Assets.load<Texture>(heroUrl);
const heroSprite = new Sprite({ texture, anchor: 0.5, position: center });
const fps = new Text({ text: "FPS: 0", style: { fill: 0xffffff } });
app.stage.addChild(wall, heroSprite, fps);

// Collision boxes, read once from what is drawn: the wall never moves.
const walls = [wall.getBounds().rectangle];
const heldKeys = trackKeys();
let hero = createEntity(center, heroSprite.width / 2);

// Every frame: update the game state, then copy it onto the sprites.
app.ticker.add((ticker) => {
  hero = moveEntity(hero, directionFrom(heldKeys()), app.screen, ticker.deltaMS, walls);
  heroSprite.position.set(hero.position.x, hero.position.y);
  fps.text = `FPS: ${ticker.FPS.toFixed(0)}`;
});
