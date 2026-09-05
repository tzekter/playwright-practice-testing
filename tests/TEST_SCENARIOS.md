1. Scenario: User finds a specific product using the search bar
   Given the user is on the home page
   When the user types "Pliers" into the search field
   And the user submits the search
   Then the search results page displays at least one product
   And every product result contains the word "Pliers" in its name

2. Scenario: User changes the interface language to German
   Given the user is on the home page
   When the user opens the language selector in the navigation bar
   And the user selects "DE" from the language options
   Then the page content is displayed in German
   And the language selector shows "DE" as the active language

3. Scenario: User filters products by category and sorts them by price ascending
   Given the user is on the home page
   When the user selects the "Hand Tools" category filter
   And the user sets the sort order to "Price (Low to High)"
   Then only products from the "Hand Tools" category are displayed
   And the displayed products are ordered from the lowest price to the highest price

4. Scenario: User adds a product to the cart and verifies cart contents
   Given the user is on a product detail page
   When the user selects a quantity of 2
   And the user clicks the "Add to cart" button
   Then the cart icon shows a total of 2 items
   And the cart page lists the correct product with the correct quantity
