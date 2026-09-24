import { expect, test, type Page } from "@playwright/test";

const SIZE = 40;

// A 40px square of the page, as a PNG. The hero (32px) starts at the center;
// the bottom-right corner only ever shows the background.
const square = (page: Page, where: "center" | "corner"): Promise<Buffer> => {
  const { width, height } = page.viewportSize() ?? { width: 0, height: 0 };
  const [x, y] =
    where === "center" ? [(width - SIZE) / 2, (height - SIZE) / 2] : [width - SIZE, height - SIZE];
  return page.screenshot({ clip: { x, y, width: SIZE, height: SIZE } });
};

const centerShowsBackground = async (page: Page): Promise<boolean> =>
  (await square(page, "center")).equals(await square(page, "corner"));

// Uncaught exceptions and console.error calls, collected while the test runs.
const collectErrors = (page: Page): readonly string[] => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") {
      errors.push(message.text());
    }
  });
  return errors;
};

const hold = async (page: Page, key: string, ms: number): Promise<void> => {
  await page.keyboard.down(key);
  await page.waitForTimeout(ms);
  await page.keyboard.up(key);
};

test("starts without errors and the hero moves with the keyboard", async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto("/");
  // Not just "a canvas exists": the hero is drawn at the center.
  await expect.poll(() => centerShowsBackground(page)).toBe(false);

  await hold(page, "ArrowRight", 500);

  // 300 px/s for 0.5 s: the hero left the center.
  await expect.poll(() => centerShowsBackground(page)).toBe(true);
  expect(errors).toStrictEqual([]);
});

test("the wall below the hero blocks it", async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto("/");
  await expect.poll(() => centerShowsBackground(page)).toBe(false);

  await hold(page, "ArrowDown", 500);

  // Without the wall it would be 150 px lower; it stops 24 px lower, still at the center.
  expect(await centerShowsBackground(page)).toBe(false);
  expect(errors).toStrictEqual([]);
});
