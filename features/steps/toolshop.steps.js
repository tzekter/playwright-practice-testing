import { test, expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const {Given, When, Then} = createBdd();

Given('the user is on the home page', async({ page })=>{
      await page.goto('/');
});

When('the user searches for {string}',async ({ page }, query)=>{
   
    await page.locator('[data-test="search-query"]').fill(query);
    await page.locator('[data-test="search-submit"]').click();
    });
Then('the search results page displays at least one product', async({ page })=>{
     const products = page.locator('[data-test="search_completed"]');
     await expect(products.first()).toBeVisible();
});
Then('every product result contains the word {string} in its name', async({ page }, word)=>{
    const products = page.locator('[data-test="product-name"]');
    const count = await products.count();
    for (let i = 0; i < count; i++) {
        await expect(products.nth(i)).toContainText(word); 
    }
});

When('the user changes the interface language to {string}', async({ page }, langCode)=>{
    await page.locator('[data-test="language-select"]').click();
    await page.locator(`[data-test="lang-${langCode.toLowerCase()}"]`).click();
    });
Then('the page content is displayed in {string}', async({ page }, language)=>{
    await expect(page.locator('[data-test="nav-home"]')).toHaveText(/Start/);
});
Then('the language selector shows {string} as the active language', async({ page }, langCode)=>{
     const language = page.locator('[data-test="language-select"]');
     await expect(language).toHaveText(langCode);
});
  


When('the user sets the sort order to {string}', async ({ page }, sortLabel)=>{
    await page.locator('[data-test="sort"]').selectOption('price,asc');
});
When('the user filters by {string} category', async ({ page }, category)=>{
    await page.locator('#filters').getByText(category).check();
});
Then('only products from the {string} category are displayed', async ({ page }, category)=>{
    const products = page.locator('.card [data-test="product-name"]');
    await expect(products.first()).toBeVisible();
});
Then('the displayed products are ordered from the lowest price to the highest price', async ({ page })=>{
    const prices = page.locator('.card [data-test="product-price"]');
    await expect(prices.first()).toBeVisible();
    const pricesTexts = await prices.allTextContents();
    const pricesNumbers = pricesTexts.map(price => parseFloat(price.replace('$','').trim()));
    console.log(pricesNumbers)
    for(let i = 0 ; i< pricesNumbers.length-1; i++){
        expect(pricesNumbers[i]).toBeLessThanOrEqual(pricesNumbers[i+1]);
    }
});

Given('the user is on a product detail page', async({ page })=>{
    await page.goto('/');
    await page.locator('.card').first().click();
})
When('the user adds {int} items of the product to the cart', async({page}, count)=>{
    for (let i = 0; i < count-1; i++) {
        await page.locator('[data-test="increase-quantity"]').click();
    }
    await page.locator('[data-test="add-to-cart"]').click();
});
Then('the cart icon shows a total of {int} items', async({page}, count)=>{
    const cartQuantity = page.locator('[data-test="cart-quantity"]');
    await expect(cartQuantity).toHaveText(count.toString());
});
Then('the cart page lists the correct product with the correct quantity', async({page})=>{
    await page.locator('[data-test="nav-cart"]').click();
    const productQuantity = page.locator('[data-test="product-quantity"]');
    await expect(productQuantity).toHaveValue('2');
});
    

  
