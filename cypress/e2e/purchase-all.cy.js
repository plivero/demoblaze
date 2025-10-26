// cypress/e2e/purchase-all.cy.js
import HomePage from "../support/pages/homePage";
import CartPage from "../support/pages/cartPage";
import OrderPage from "../support/pages/orderPage";

const home = new HomePage();
const cart = new CartPage();
const order = new OrderPage();

describe("Purchase - one from each category", () => {
  beforeEach(() => {
    cy.ensureSession();
    cy.visit("/");
    home.openCart();

    cart.emptyCart();
    cy.visit("/");
  });

  it("adds 1 Laptop + 1 Phone + 1 Monitor and completes purchase", () => {
    home.addProductByCategoryAndIndex("Laptops", 0);
    home.addProductByCategoryAndIndex("Phones", 0);
    home.addProductByCategoryAndIndex("Monitors", 0);
    home.openCart();

    cart.getItems().should("have.length.at.least", 3);
    cart.clickPlaceOrder();

    order.fill();
    order.clickPurchase();
    order.getConfirmMessage().should("contain.text", "Thank you");
    order.getConfirmText().should("contain.text", "Id:");
    order.getConfirmText().should("contain.text", "Amount:");
    order.clickOk();
    order.getModal().should("not.be.visible", { timeout: 10000 });
  });
});
