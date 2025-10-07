// cypress/e2e/ui/cart.cy.js
import HomePage from "../support/pages/homePage";
import CartPage from "../support/pages/cartPage";

const home = new HomePage();
const cart = new CartPage();

describe("Cart - basic empty state", () => {
  beforeEach(() => {
    cy.ensureSession();
    cy.visit("/");
  });

  it("clears the cart and confirms it stays empty when reopened", () => {
    home.openLaptops();
    home.openProductAt(0);
    home.clickAddToCart();

    home.openCart();
    cart.emptyCart();
    cart.getItems().should("have.length", 0);

    cy.visit("/");
    home.openCart();
    cart.getItems().should("have.length", 0);
  });
});
