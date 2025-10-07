// cypress/e2e/prices.cy.js
import HomePage from "../support/pages/homePage";
import CartPage from "../support/pages/cartPage";

const home = new HomePage();
const cart = new CartPage();

describe("Price checks", () => {
  beforeEach(() => {
    cy.ensureSession();
    cy.visit("/");
  });

  // Laptops
  it("shows detail price for 'Sony vaio i5'", () => {
    home.openLaptops();
    home.getProductByName("Sony vaio i5").should("be.visible");
    home.openProductAt(0);
    home.getDetailPrice().should("contain.text", "790");
  });

  it("shows cart row price for 'Sony vaio i5' after adding", () => {
    home.openLaptops();
    home.getProductByName("Sony vaio i5").should("be.visible");
    home.openProductAt(0);
    home.clickAddToCart();
    home.openCart();

    cart.getItems().last().should("contain.text", "Sony vaio i5");
    cart.getItemPrices().last().should("contain.text", "790");
  });

  // Phones
  it("shows detail price for 'Samsung galaxy s6'", () => {
    home.openPhones();
    home.getProductByName("Samsung galaxy s6").should("be.visible");
    home.openProductAt(0);
    home.getDetailPrice().should("contain.text", "360");
  });

  it("shows cart row price for 'Samsung galaxy s6' after adding", () => {
    home.openPhones();
    home.getProductByName("Samsung galaxy s6").should("be.visible");
    home.openProductAt(0);
    home.clickAddToCart();
    home.openCart();

    cart.getItems().last().should("contain.text", "Samsung galaxy s6");
    cart.getItemPrices().last().should("contain.text", "360");
  });

  // Monitors
  it("shows detail price for 'Apple monitor 24'", () => {
    home.openMonitors();
    home.getProductByName("Apple monitor 24").should("be.visible");
    home.openProductAt(0);
    home.getDetailPrice().should("contain.text", "400");
  });

  it("shows cart row price for 'Apple monitor 24' after adding", () => {
    home.openMonitors();
    home.getProductByName("Apple monitor 24").should("be.visible");
    home.openProductAt(0);
    home.clickAddToCart();
    home.openCart();

    cart.getItems().last().should("contain.text", "Apple monitor 24");
    cart.getItemPrices().last().should("contain.text", "400");
  });
});
