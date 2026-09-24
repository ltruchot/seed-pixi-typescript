// Game logic: plain readonly data and pure functions. Pixi math (Rectangle)
// is fine here, display objects are not: main.ts copies the result onto the
// sprites. Tested in tests/entity.test.ts.
import { Rectangle } from "pixi.js";

export type Vector = { readonly x: number; readonly y: number };
export type Size = { readonly width: number; readonly height: number };

export type Entity = {
  readonly position: Vector;
  /** Half of the sprite's size: the entity stops when its edge hits a wall. */
  readonly radius: number;
  /** Pixels per second. */
  readonly speed: number;
};

export const createEntity = (position: Vector, radius: number, speed = 300): Entity => ({
  position,
  radius,
  speed,
});

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

/** Same direction, length 1 (or 0): moving diagonally is not faster. */
export const normalize = (direction: Vector): Vector => {
  const length = Math.hypot(direction.x, direction.y);
  return length === 0 ? { x: 0, y: 0 } : { x: direction.x / length, y: direction.y / length };
};

/** The square the entity takes up, to test collisions with `intersects`. */
export const hitBox = (entity: Entity): Rectangle =>
  new Rectangle(
    entity.position.x - entity.radius,
    entity.position.y - entity.radius,
    entity.radius * 2,
    entity.radius * 2,
  );

const withAxis = (entity: Entity, axis: "x" | "y", value: number): Entity => ({
  ...entity,
  position: { ...entity.position, [axis]: value },
});

// Moves along one axis, stopped by the area's edges and by the walls: a wall
// hit puts the entity right against it.
const moveAxis = (
  entity: Entity,
  axis: "x" | "y",
  delta: number,
  area: Size,
  walls: readonly Rectangle[],
): Entity => {
  const max = (axis === "x" ? area.width : area.height) - entity.radius;
  const moved = withAxis(entity, axis, clamp(entity.position[axis] + delta, entity.radius, max));
  const wall = walls.find((box) => hitBox(moved).intersects(box));
  if (wall === undefined) {
    return moved;
  }
  const [start, end] = axis === "x" ? [wall.left, wall.right] : [wall.top, wall.bottom];
  return withAxis(entity, axis, delta > 0 ? start - entity.radius : end + entity.radius);
};

/**
 * Moves `entity` toward `direction` for `deltaMs` milliseconds, inside `area`,
 * never through `walls`. One axis at a time, so it slides along a wall.
 */
export const moveEntity = (
  entity: Entity,
  direction: Vector,
  area: Size,
  deltaMs: number,
  walls: readonly Rectangle[] = [],
): Entity => {
  const step = normalize(direction);
  const distance = (entity.speed * deltaMs) / 1000;
  const movedX = moveAxis(entity, "x", step.x * distance, area, walls);
  return moveAxis(movedX, "y", step.y * distance, area, walls);
};
