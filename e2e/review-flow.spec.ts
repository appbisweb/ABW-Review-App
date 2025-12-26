import { test, expect } from '@playwright/test';

test.describe('Review Generation Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('page loads with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Bewertung/);
  });

  test('displays the main heading', async ({ page }) => {
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
  });

  test('shows all topic checkboxes', async ({ page }) => {
    const checkboxes = page.getByRole('checkbox');
    await expect(checkboxes).toHaveCount(5);
  });

  test('shows dropdowns for style and customer type', async ({ page }) => {
    const dropdowns = page.getByRole('combobox');
    await expect(dropdowns).toHaveCount(2);
  });

  test('generate button exists', async ({ page }) => {
    const generateButton = page.getByRole('button').filter({ hasText: /vorschlagen/i });
    await expect(generateButton).toBeVisible();
  });

  test('hint input accepts text with character limit', async ({ page }) => {
    const hintInput = page.getByRole('textbox');
    await expect(hintInput).toBeVisible();
    await expect(hintInput).toHaveAttribute('maxlength', '80');

    await hintInput.fill('Super freundlicher Service');
    await expect(hintInput).toHaveValue('Super freundlicher Service');
  });

  test('style dropdown is visible and clickable', async ({ page }) => {
    const styleDropdown = page.getByRole('combobox').first();
    await expect(styleDropdown).toBeVisible();
    await styleDropdown.click();
  });

  test('customer type dropdown is visible and clickable', async ({ page }) => {
    const customerDropdown = page.getByRole('combobox').nth(1);
    await expect(customerDropdown).toBeVisible();
    await customerDropdown.click();
  });

  test('all checkbox labels are visible', async ({ page }) => {
    // Verify each topic label exists
    const labels = page.locator('label').filter({ has: page.getByRole('checkbox') });
    await expect(labels).toHaveCount(5);

    // All labels should be visible
    for (let i = 0; i < 5; i++) {
      await expect(labels.nth(i)).toBeVisible();
    }
  });
});

// API-dependent tests - skip in CI and when no server is manually started
test.describe('Review Generation with API', () => {
  // Skip in CI since they require API keys
  test.skip(() => !!process.env.CI, 'Skipping API tests in CI');

  // Use a longer timeout for API calls
  test.setTimeout(60000);

  // Note: Radix UI checkboxes have known issues with Playwright click events
  // This test may be flaky - run manually to verify full flow
  test.fixme('full generation flow works', async ({ page }) => {
    await page.goto('/');

    // Click directly on a checkbox element using force: true for Radix components
    const firstCheckbox = page.getByRole('checkbox').first();
    await firstCheckbox.click({ force: true });

    // Wait a moment for React state to update
    await page.waitForTimeout(200);

    // Click generate button
    const generateButton = page.getByRole('button').filter({ hasText: /vorschlagen/i });

    // Wait for button to be enabled
    await expect(generateButton).toBeEnabled({ timeout: 5000 });
    await generateButton.click();

    // Wait for textarea to appear (API response)
    const textarea = page.locator('textarea');
    await expect(textarea).toBeVisible({ timeout: 45000 });

    // Verify character counter
    await expect(page.getByText(/\d+ \/ 500/)).toBeVisible();
  });
});
