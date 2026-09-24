// Keyboard input. `KeyboardEvent.code` is the physical key, so WASD is also
// ZQSD on an AZERTY keyboard.
import type { Vector } from "./entity.ts";

const LEFT = ["ArrowLeft", "KeyA"];
const RIGHT = ["ArrowRight", "KeyD"];
const UP = ["ArrowUp", "KeyW"];
const DOWN = ["ArrowDown", "KeyS"];

const isAnyPressed = (keys: readonly string[], pressed: readonly string[]): boolean =>
  keys.some((key) => pressed.includes(key));

/** The direction the pressed keys point to, each axis in -1, 0 or 1. */
export const directionFrom = (pressed: readonly string[]): Vector => ({
  x: Number(isAnyPressed(RIGHT, pressed)) - Number(isAnyPressed(LEFT, pressed)),
  y: Number(isAnyPressed(DOWN, pressed)) - Number(isAnyPressed(UP, pressed)),
});

/** Listens to the keyboard; the returned function gives the keys held down now. */
export const trackKeys = (): (() => readonly string[]) => {
  const pressed = new Set<string>();
  globalThis.addEventListener("keydown", (event) => {
    pressed.add(event.code);
  });
  globalThis.addEventListener("keyup", (event) => {
    pressed.delete(event.code);
  });
  // A key released while the window is not focused never sends "keyup".
  globalThis.addEventListener("blur", () => {
    pressed.clear();
  });
  return () => [...pressed];
};
