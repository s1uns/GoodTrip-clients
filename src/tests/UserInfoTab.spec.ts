import { test, expect } from "@playwright/test";

const mockUser = {
	firstName: "John",
	lastName: "Doe",
	email: "john.doe@mail.com",
	bio: "Traveler and photographer",
	rating: 4.5,
	reviewsCount: 10,
	joinDate: "2023-01-15T00:00:00.000Z",
};

test.describe("UserInfoTab E2E", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("http://localhost:3000/profile");

		await page.evaluate(
			({ user }) => {
				(window as any).__USER__ = user;
			},
			{ user: mockUser },
		);
	});

	test("renders user info and disables inputs by default", async ({
		page,
	}) => {
		await expect(page.getByLabel("First Name")).toHaveValue(
			mockUser.firstName,
		);
		await expect(page.getByLabel("Last Name")).toHaveValue(
			mockUser.lastName,
		);
		await expect(page.getByLabel("Email")).toHaveValue(mockUser.email);
		await expect(page.getByLabel("Bio")).toHaveValue(mockUser.bio);

		await expect(page.getByLabel("First Name")).toBeDisabled();
		await expect(page.getByLabel("Last Name")).toBeDisabled();
		await expect(page.getByLabel("Email")).toBeDisabled();
		await expect(page.getByLabel("Bio")).toBeDisabled();

		await expect(page.getByRole("button", { name: "Edit" })).toBeVisible();

		await expect(page.locator("text=4.5 User Rating")).toBeVisible();
		await expect(page.locator("text=10 Reviews Written")).toBeVisible();

		await expect(page.locator(`text=Joined on 15 Jan 2023`)).toBeVisible();
	});

	test("enables inputs after clicking Edit and allows editing", async ({
		page,
	}) => {
		await page.getByRole("button", { name: "Edit" }).click();

		await expect(page.getByLabel("First Name")).toBeEnabled();
		await expect(page.getByLabel("Last Name")).toBeEnabled();
		await expect(page.getByLabel("Email")).toBeEnabled();
		await expect(page.getByLabel("Bio")).toBeEnabled();

		await page.getByLabel("First Name").fill("Jane");
		await expect(page.getByLabel("First Name")).toHaveValue("Jane");

		await page.getByLabel("Bio").fill("New bio content");
		await expect(page.getByLabel("Bio")).toHaveValue("New bio content");

		const prefSelector = page
			.locator('label:has-text("Travel Preferences")')
			.locator("..")
			.locator('div[role="listbox"]');
		await prefSelector.click();

		await page.locator("text=Adventure").click();

		await expect(prefSelector.locator("text=Adventure")).toBeVisible();

		const catSelector = page
			.locator('label:has-text("Travel Categories")')
			.locator("..")
			.locator('div[role="listbox"]');
		await catSelector.click();
		await page.locator("text=Beach").click();
		await expect(catSelector.locator("text=Beach")).toBeVisible();

		await expect(page.getByRole("button", { name: "Save" })).toBeVisible();
	});

	test("disables inputs and saves on clicking Save", async ({ page }) => {
		await page.getByRole("button", { name: "Edit" }).click();

		await page.getByLabel("First Name").fill("Jane");
		await page.getByLabel("Bio").fill("Updated bio");

		await page.getByRole("button", { name: "Save" }).click();

		await expect(page.getByLabel("First Name")).toBeDisabled();
		await expect(page.getByLabel("Bio")).toBeDisabled();

		await expect(page.getByRole("button", { name: "Edit" })).toBeVisible();
	});
});
