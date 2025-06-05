import { test, expect } from "@playwright/test";

test.describe("PlaceView page", () => {
	test("renders place info and reviews", async ({ page }) => {
		await page.goto("http://localhost:1337/places/1");

		await expect(page.getByText("Pinchuk Art Centre")).toBeVisible();

		const reviewCards = await page
			.locator("text=Great place to visit")
			.count();
		expect(reviewCards).toBeGreaterThan(0);

		await page.getByRole("button", { name: "Write a Review" }).click();
		await expect(
			page.getByPlaceholder("Share your experience..."),
		).toBeVisible();
	});

	test("can switch review sort", async ({ page }) => {
		await page.goto("http://localhost:1337/places/1");

		await page.getByRole("button", { name: "Sort" }).click();
		await page.getByRole("option", { name: "Newest first" }).click();

		await expect(
			page.locator("text=One of my favorite places in the city!"),
		).toBeVisible();
	});
});
