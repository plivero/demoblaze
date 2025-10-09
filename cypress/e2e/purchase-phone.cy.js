// cypress/e2e/purchase-phone.cy.js
import { orderData } from "../support/helpers/orderData";
import HomePage from "../support/pages/homePage";
import CartPage from "../support/pages/cartPage";
import Order from "../support/pages/orderPage";

const home = new HomePage();
const cart = new CartPage();
const order = new Order();

describe("Purchase - Phone", () => {
  beforeEach(() => {
    cy.ensureSession();
    cy.visit("/");
    home.openCart();
    cart.emptyCart();
    cy.visit("/");
  });

  it("buys a phone (happy path)", () => {
    home
      .getWelcomeUser()
      .should("contain.text", `Welcome ${Cypress.env("USER_NAME")}`);

    home.openPhones();
    home.openProductAt(0);
    home.getAddToCartButton().should("be.visible");
    home.clickAddToCart();
    home.openCart();

    cart.clickPlaceOrder();

    order.fill(orderData());
    order.clickPurchase();
    order.getConfirmMessage().should("contain.text", "Thank you");
    order.getConfirmText().should("contain.text", "Id:");
    order.getConfirmText().should("contain.text", "Amount:");
    order.clickOk();
    order.getSweetAlert().should("not.be.visible", { timeout: 10000 });
    order.close();
    order.getModal().should("not.be.visible", { timeout: 10000 });

    home.clickLogout();
    home.getLogoutButton().should("not.be.visible");
  });

  it("adds one phone and deletes it", () => {
    home.openPhones();
    home.openProductAt(0);
    home.getAddToCartButton().should("be.visible");
    home.clickAddToCart();
    home.openCart();

    cart.getItems().should("have.length.at.least", 1);
    cart.deleteFirstItem();
    cart.getItems().should("have.length", 0);
  });

  it("buys three units of the same phone", () => {
    home.openPhones();
    home.getProductByName("Samsung galaxy s6").should("be.visible");
    home.openProductAt(0);
    home.getAddToCartButton().should("be.visible");
    home.addProductNTimes();
    home.openCart();

    cart.clickPlaceOrder();

    order.fill(orderData());
    order.clickPurchase();
    order.getConfirmMessage().should("contain.text", "Thank you");
    order.getConfirmText().should("contain.text", "Id:");
    order.getConfirmText().should("contain.text", "Amount:");
    order.clickOk();
    order.getSweetAlert().should("not.be.visible", { timeout: 10000 });
    order.close();
    order.getModal().should("not.be.visible", { timeout: 10000 });

    home.clickLogout();
    home.getLogoutButton().should("not.be.visible");
  });

  it("adds all phones (first page) and completes purchase", () => {
    home.addPhonesByIndexes([0, 1, 2, 3, 4, 5, 6]);
    home.openCart();

    cart.getItems().should("have.length", 7);
    cart.clickPlaceOrder();

    order.fill(orderData());
    order.clickPurchase();
    order.getConfirmMessage().should("contain.text", "Thank you");
    order.getConfirmText().should("contain.text", "Id:");
    order.getConfirmText().should("contain.text", "Amount:");
    order.clickOk();
    order.close();
    order.getModal().should("not.be.visible", { timeout: 10000 });
  });

  it("Place Order with empty cart does not conclude", () => {
    home
      .getWelcomeUser()
      .should("contain.text", `Welcome ${Cypress.env("USER_NAME")}`);
    home.openCart();

    cart.getItems().should("have.length", 0);
    cart.clickPlaceOrder();

    order.getModal().should("be.visible");
    order.fill(orderData());
    order.clickPurchase();
    order.getConfirmMessage().should("contain.text", "Thank you");
    order.clickOk();
    order.getModal().should("not.be.visible");
  });

  it("shows required-fields alert when purchasing with empty form", () => {
    home.openCart();

    cart.getItems().should("have.length", 0);
    cart.clickPlaceOrder();

    order.getModal().should("be.visible");
    order.clickPurchase();
    order.expectRequiredFieldsAlert("Please fill out Name and Creditcard.");
    order.getModal().should("be.visible");
  });
});
