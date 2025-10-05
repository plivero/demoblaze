// cypress/e2e/purchase-monitor.cy.js
import { getUserName } from "../../support/helpers/env";
import { orderData } from "../../support/helpers/orderData";
import { addSameProductNTimes } from "../../support/helpers/cartActions";
import HomePage from "../../support/pages/homePage";
import CartPage from "../../support/pages/cartPage";
import Order from "../../support/pages/orderPage";

const home = new HomePage();
const cart = new CartPage();
const order = new Order();

describe("Purchase - Monitor", () => {
  beforeEach(() => {
    cy.ensureSession();
    cy.visit("/");
  });

  it("buys a monitor (happy path)", () => {
    home.getWelcomeUser().should("contain.text", `Welcome ${getUserName()}`);

    home.openMonitors();
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

  it("adds one monitor and deletes it", () => {
    home.openMonitors();
    home.openProductAt(0);

    home.getAddToCartButton().should("be.visible");
    home.clickAddToCart();

    home.openCart();
    cart.getItems().should("have.length.at.least", 1);
    cart.deleteFirstItem();
    cart.getItems().should("have.length", 0);
    cy.wait(700);
  });

  it("buys three units of the same monitor", () => {
    home.openMonitors();
    home.getProductByName("Apple monitor 24").should("be.visible");
    home.openProductAt(0);

    addSameProductNTimes(home, 3);

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

  it("adds all monitors (first page) and completes purchase", () => {
    home.addMonitorsByIndexes([0, 1]);

    home.openCart();
    cart.getItems().should("have.length", 2);
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
    home.getWelcomeUser().should("contain.text", `Welcome ${getUserName()}`);
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
    cy.on("window:alert", (txt) => {
      expect(txt).to.contain("Please fill out Name and Creditcard.");
    });
    order.getModal().should("be.visible");
  });
});
