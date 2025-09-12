import { test, expect } from '@playwright/test';

const BACKEND = process.env.BACKEND_URL || 'http://localhost:4000';

test.describe('Modulist smoke', () => {
  test('backend health is ok', async ({ request }) => {
    const res = await request.get(`${BACKEND}/health`);
    expect(res.ok()).toBeTruthy();
    const json = await res.json();
    expect(json.status).toBe('ok');
  });

  test('home page loads and has basic content', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Modulist|Vite|React/i);
  });
});

