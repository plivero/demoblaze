// cypress/e2e/purchase-all.cy.js
import HomePage from "../../support/pages/homePage";
import CartPage from "../../support/pages/cartPage";
import OrderPage from "../../support/pages/orderPage";
import { orderData } from "../../support/helpers/orderData";

const home = new HomePage();
const cart = new CartPage();
const order = new OrderPage();

describe("Purchase - one from each category", () => {
  beforeEach(() => {
    cy.ensureSession();
    cy.visit("/");

    // clean cart before the test (keep tests independent)
    home.openCart();
    cart.emptyCart();
    cy.visit("/");
  });

  it("adds 1 Laptop + 1 Phone + 1 Monitor and completes purchase", () => {
    // 1) Laptop
    home.openLaptops();
    home.openProductAt(0);
    home.getAddToCartButton().should("be.visible");
    home.clickAddToCart();

    // 2) Phone
    cy.visit("/");
    home.openPhones();
    home.openProductAt(0);
    home.getAddToCartButton().should("be.visible");
    home.clickAddToCart();

    // 3) Monitor
    cy.visit("/");
    home.openMonitors();
    home.openProductAt(0);
    home.getAddToCartButton().should("be.visible");
    home.clickAddToCart();

    // Go to cart and finish the order
    home.openCart();
    cart.getItems().should("have.length.at.least", 3);
    cart.clickPlaceOrder();

    order.fill(orderData());
    order.clickPurchase();

    order.getConfirmMessage().should("contain.text", "Thank you");
    order.getConfirmText().should("contain.text", "Id:");
    order.getConfirmText().should("contain.text", "Amount:");
    order.clickOk();

    order.getModal().should("not.be.visible", { timeout: 10000 });
  });
});
