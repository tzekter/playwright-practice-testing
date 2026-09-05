Feature: Practice Software Testing Website Scenarios
  As a customer
  I want to be able to use the shop functions 
  So that I can purchase tools efficiently

  Scenario: User finds a specific product using the search bar
    Given the user is on the home page
    When the user searches for "Pliers" 
    Then the search results page displays at least one product 
    And every product result contains the word "Pliers" in its name

  Scenario: User changes the interface language to German
    Given the user is on the home page
    When the user changes the interface language to "DE"
    Then the page content is displayed in "German"
    And the language selector shows "DE" as the active language

  Scenario: User filters products by category and sorts them by price ascending
    Given the user is on the home page 
    When the user sets the sort order to "Price (Low - High)" 
    And the user filters by "Hand Tools" category       
    Then only products from the "Hand Tools" category are displayed
    And the displayed products are ordered from the lowest price to the highest price  

  Scenario: User adds a product to the cart and verifies cart contents
    Given the user is on a product detail page 
    When the user adds 2 items of the product to the cart
    Then the cart icon shows a total of 2 items
    And the cart page lists the correct product with the correct quantity