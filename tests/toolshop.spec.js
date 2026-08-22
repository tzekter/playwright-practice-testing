import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page })=>{
     await page.goto('https://practicesoftwaretesting.com/');
})

test('User finds a specific product using the search bar',async ({ page })=>{
   
    await page.locator('[data-test="search-query"]').fill('Pliers');
    await page.locator('[data-test="search-submit"]').click();

    const products = page.locator('[data-test="search_completed"]');
    await expect(products).toHaveText(/Pliers/);

});

test('User changes the interface language to German', async({ page })=>{
    await page.locator('[data-test="language-select"]').click();
    await page.locator('[data-test="lang-de"]').click();

    const language = page.locator('[data-test="language-select"]');
    await expect(language).toHaveText(/DE/);
});

test('User filters products by category and sorts them by price ascending ', async ({ page })=>{
    await page.locator('[data-test="sort"]').selectOption('price,asc');
    await page.locator('#filters').getByText('Hand Tools').check();
    
    
    const prices = page.locator('.card [data-test="product-price"]');
    await expect(prices.first()).toBeVisible();

    const pricesTexts = await prices.allTextContents();
    const pricesNumbers = pricesTexts.map(price => parseFloat(price.replace('$','').trim()));
    console.log(pricesNumbers)
    for(let i = 0 ; i< pricesNumbers.length-1; i++){
        expect(pricesNumbers[i]).toBeLessThanOrEqual(pricesNumbers[i+1]);
    }
});

test('User adds a product to the cart and verifies cart contents', async({ page })=>{
    await page.locator('.card').first().click();

    await page.locator('[data-test="increase-quantity"]').click();
    await page.locator('[data-test="add-to-cart"]').click();

    const cartQuantity = page.locator('[data-test="cart-quantity"]');
    await expect(cartQuantity).toHaveText('2');

    await page.locator('[data-test="nav-cart"]').click();
    const productQuantity = page.locator('[data-test="product-quantity"]');
    await expect(productQuantity).toHaveValue('2');
    })
