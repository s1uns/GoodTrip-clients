import { test, expect } from "@playwright/test";

test.describe("LoginForm E2E", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("http://localhost:1337/login");
	});

	test("renders form inputs and login button", async ({ page }) => {
		await expect(page.getByPlaceholder("Email")).toBeVisible();
		await expect(page.getByPlaceholder("Password")).toBeVisible();
		await expect(page.getByRole("button", { name: "Login" })).toBeVisible();
	});

	test("allows typing into inputs", async ({ page }) => {
		const emailInput = page.getByPlaceholder("Email");
		const passwordInput = page.getByPlaceholder("Password");

		await emailInput.fill("test@mail.com");
		await passwordInput.fill("12345678");

		await expect(emailInput).toHaveValue("test@mail.com");
		await expect(passwordInput).toHaveValue("12345678");
	});

	test("submits form and calls login", async ({ page }) => {
		await page.route("**/api/login", async (route) => {
			await route.fulfill({
				status: 200,
				contentType: "application/json",
				body: JSON.stringify({ token: "mock-token" }),
			});
		});

		await page.getByPlaceholder("Email").fill("test@m.c");
		await page.getByPlaceholder("Password").fill("12345678");
		await page.getByRole("button", { name: "Login" }).click();

		await page.waitForTimeout(500);
	});

	test("shows error when server returns error", async ({ page }) => {
		await page.route("**/api/login", async (route) => {
			await route.fulfill({
				status: 401,
				contentType: "application/json",
				body: JSON.stringify({ message: "Invalid credentials" }),
			});
		});

		await page.getByPlaceholder("Email").fill("test@m.c");
		await page.getByPlaceholder("Password").fill("wrongpass");
		await page.getByRole("button", { name: "Login" }).click();

		await expect(page.getByText("Invalid credentials")).toBeVisible();
	});
});
