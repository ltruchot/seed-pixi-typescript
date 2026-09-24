import { Rectangle } from "pixi.js";
import { describe, expect, it } from "vite-plus/test";
import { createEntity, moveEntity, normalize } from "../src/entity.ts";
import { directionFrom } from "../src/input.ts";

const area = { width: 800, height: 600 };
const hero = createEntity({ x: 400, y: 300 }, 20, 100);

describe("moveEntity", () => {
  it("moves speed * time toward the direction", () => {
    expect(moveEntity(hero, { x: 1, y: 0 }, area, 1000).position).toStrictEqual({ x: 500, y: 300 });
  });

  it("does not move without a direction", () => {
    expect(moveEntity(hero, { x: 0, y: 0 }, area, 1000).position).toStrictEqual(hero.position);
  });

  it("stops at the edge of the area", () => {
    const moved = moveEntity(hero, { x: -1, y: 1 }, area, 60_000);
    expect(moved.position).toStrictEqual({ x: 20, y: 580 });
  });

  it("is not faster diagonally", () => {
    const moved = moveEntity(hero, { x: 1, y: 1 }, area, 1000);
    expect(Math.hypot(moved.position.x - 400, moved.position.y - 300)).toBeCloseTo(100);
  });
});

describe("moveEntity with walls", () => {
  // Just below the hero (its bottom edge is at y = 320).
  const below = [new Rectangle(360, 340, 80, 80)];

  it("stops against a wall it walks into", () => {
    const moved = moveEntity(hero, { x: 0, y: 1 }, area, 1000, below);
    expect(moved.position).toStrictEqual({ x: 400, y: 320 });
  });

  it("stops against a wall from any side", () => {
    const right = [new Rectangle(450, 280, 40, 40)];
    expect(moveEntity(hero, { x: 1, y: 0 }, area, 1000, right).position.x).toBe(430);
    const under = createEntity({ x: 400, y: 500 }, 20, 100);
    expect(moveEntity(under, { x: 0, y: -1 }, area, 1000, below).position.y).toBe(440);
  });

  it("slides along a wall", () => {
    // Standing on the wall; 0.2 s later still above it: y is blocked, not x.
    const onWall = createEntity({ x: 400, y: 320 }, 20, 100);
    const moved = moveEntity(onWall, { x: 1, y: 1 }, area, 200, below);
    expect(moved.position.y).toBe(320);
    expect(moved.position.x).toBeCloseTo(400 + 20 / Math.SQRT2);
  });

  it("walks freely once past the wall", () => {
    const beside = createEntity({ x: 500, y: 300 }, 20, 100);
    expect(moveEntity(beside, { x: 0, y: 1 }, area, 1000, below).position.y).toBe(400);
  });
});

describe("normalize", () => {
  it("keeps a zero vector at zero", () => {
    expect(normalize({ x: 0, y: 0 })).toStrictEqual({ x: 0, y: 0 });
  });
});

describe("directionFrom", () => {
  it("reads arrows and WASD", () => {
    expect(directionFrom(["ArrowRight", "KeyW"])).toStrictEqual({ x: 1, y: -1 });
  });

  it("cancels opposite keys", () => {
    expect(directionFrom(["ArrowLeft", "KeyD"])).toStrictEqual({ x: 0, y: 0 });
  });
});
