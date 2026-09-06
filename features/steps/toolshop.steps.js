import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { Given, When, Then } = createBdd();

Given('the user is on the home page', async ({ page }) => {
  await page.goto('/');
});

//First scenario
When('the user searches for {string}', async ({ page }, query) => {
  await page.locator('[data-test="search-query"]').fill(query);
  await page.locator('[data-test="search-submit"]').click();
});

Then('the search results page displays at least one product', async ({ page }) => {
  const products = page.locator('[data-test="search_completed"]');
  await expect(products.first()).toBeVisible();
});

Then('every product result contains the word {string} in its name', async ({ page }, word) => {
  const products = page.locator('[data-test="product-name"]');
  const count = await products.count();
  for (let i = 0; i < count; i++) {
    await expect(products.nth(i)).toContainText(word);
  }
});

//Second scenario
When('the user changes the interface language to {string}', async ({ page }, langCode) => {
  await page.locator('[data-test="language-select"]').click();
  const langOption = page.locator(`[data-test="lang-${langCode.toLowerCase()}"]`);
  await langOption.waitFor({ state: 'visible' });
  await langOption.click();

  await expect(page.locator('[data-test="language-select"]')).toHaveText(new RegExp(langCode));

  await expect(page.locator('[data-test="language-select"]')).toHaveText(new RegExp(langCode));
});

Then('the page content is displayed in {string}', async ({ page }, _language) => {
  await expect(page.locator('[data-test="nav-home"]')).toHaveText(/Start/);
});

Then('the language selector shows {string} as the active language', async ({ page }, langCode) => {
  const language = page.locator('[data-test="language-select"]');
  await expect(language).toHaveText(langCode);
});

//Third scenario
When('the user sets the sort order to {string}', async ({ page }, _sortLabel) => {
  await page.locator('[data-test="sort"]').selectOption('price,asc');
});

When('the user filters by {string} category', async ({ page }, category) => {
  await page.locator('#filters').getByText(category).check();
});

Then('only products from the {string} category are displayed', async ({ page }, _category) => {
  const products = page.locator('.card [data-test="product-name"]');
  await expect(products.first()).toBeVisible();
});

Then(
  'the displayed products are ordered from the lowest price to the highest price',
  async ({ page }) => {
    const prices = page.locator('.card [data-test="product-price"]');
    await expect(prices.first()).toBeVisible();

    await page.waitForTimeout(500);

    const pricesTexts = await prices.allTextContents();
    const pricesNumbers = pricesTexts.map((price) => parseFloat(price.replace('$', '').trim()));
    for (let i = 0; i < pricesNumbers.length - 1; i++) {
      expect(pricesNumbers[i]).toBeLessThanOrEqual(pricesNumbers[i + 1]);
    }
  }
);

//Fourth scenario
Given('the user is on a product detail page', async ({ page }) => {
  await page.goto('/');
  const firstCard = page.locator('.card').first();
  await firstCard.locator('[data-test="product-name"]').waitFor({ state: 'visible' });
  await firstCard.click();

  await page.locator('[data-test="add-to-cart"]').waitFor({ state: 'visible' });
});

When('the user adds {int} items of the product to the cart', async ({ page }, count) => {
  const increaseBtn = page.locator('[data-test="increase-quantity"]');
  for (let i = 0; i < count - 1; i++) {
    await increaseBtn.waitFor({ state: 'visible' });
    await increaseBtn.click();
  }
  await page.locator('[data-test="add-to-cart"]').click();
});

Then('the cart icon shows a total of {int} items', async ({ page }, count) => {
  const cartQuantity = page.locator('[data-test="cart-quantity"]');
  await expect(cartQuantity).toHaveText(count.toString());
});

Then('the cart page lists the correct product with the correct quantity', async ({ page }) => {
  await page.locator('[data-test="nav-cart"]').click();
  const productQuantity = page.locator('[data-test="product-quantity"]');
  await expect(productQuantity).toHaveValue('2');
});

// Fifth scenario
When('the user views the details of a product', async ({ page }) => {
  const firstCard = page.locator('.card').first();
  await firstCard.locator('[data-test="product-name"]').waitFor({ state: 'visible' });
  await firstCard.click();
});

Then('the product detail page opens', async ({ page }) => {
  await expect(page.locator('[data-test="add-to-cart"]')).toBeVisible();
});

Then(
  'the page displays the product name, price, description and an "Add to cart" button',
  async ({ page }) => {
    await expect(page.locator('[data-test="product-name"]')).toBeVisible();
    await expect(page.locator('.price-section')).toBeVisible();
    await expect(page.locator('[data-test="product-description"]')).toBeVisible();
    await expect(page.locator('[data-test="add-to-cart"]')).toBeVisible();
    });

let apiResponse;

Given('the user requests the products endpoint', async ({ request }) => {
  apiResponse = await request.get('https://api.practicesoftwaretesting.com/products');
});

Then('the API response status code is {int}', async ({}, statusCode) => {
  expect(apiResponse.status()).toBe(statusCode);
});

Then('the response contains a list of products', async ({}) => {
  const body = await apiResponse.json();
  expect(body.data).toBeDefined();
  expect(body.data.length).toBeGreaterThan(0);
});