import { test, expect } from '@playwright/test';

test('GET / returns 200', async ({ request }) => {
  const res = await request.get('/');
  expect(res.status()).toBe(200);
});

test('home hero H1 is visible', async ({ page }) => {
  await page.goto('/');
  const h1 = page.locator('h1').first();
  await expect(h1).toBeVisible({ timeout: 10_000 });
  const text = await h1.innerText();
  expect(text.length).toBeGreaterThan(0);
});

test('primary CTA is visible', async ({ page }) => {
  await page.goto('/');
  const cta = page.locator('a, button').filter({ hasText: /build|generate|get started|create|start/i }).first();
  await expect(cta).toBeVisible({ timeout: 10_000 });
});

test('POST /api/generate returns non-empty JSON', async ({ request }) => {
  const res = await request.post('/api/generate', {
    data: {
      mode: 'analyze',
      jobDesc: 'Software Engineer at Acme Corp. Skills: React, Node.js.',
      experience: '3 years React developer.',
      skills: 'React, TypeScript, Node.js',
      name: 'Jane Doe',
      currentTitle: 'Frontend Developer',
    },
    timeout: 10_000,
  });
  expect(res.status()).toBe(200);
  const body = await res.text();
  expect(body.length).toBeGreaterThan(10);
});

test('mobile viewport has no horizontal overflow', async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const page = await ctx.newPage();
  await page.goto('/');
  const overflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > document.documentElement.clientWidth;
  });
  expect(overflow).toBe(false);
  await ctx.close();
});
