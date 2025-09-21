// cypress/e2e/purchase-laptop.cy.js
import { loginSession } from "../support/helpers/session";
import { getUserName } from "../support/helpers/env";
import { orderData } from "../support/helpers/orderData";
import { addSameProductNTimes } from "../support/helpers/cartActions";
import HomePage from "../support/pages/homePage";
import CartPage from "../support/pages/cartPage";
import Order from "../support/pages/orderPage";

describe("Purchase - Laptop", () => {
  const home = new HomePage();
  const cart = new CartPage();
  const order = new Order();

  beforeEach(() => {
    loginSession();
  });

  it("buys a laptop (happy path)", () => {
    cy.visit("/");
    home.getWelcomeUser().should("contain.text", `Welcome ${getUserName()}`);

    home.openLaptops();
    home.openFirstLaptop();

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

  it.only("adds one product and deletes it", () => {
    cy.visit("/");

    home.openLaptops();
    home.getProductTitles().first().should("be.visible");
    home.openFirstLaptop();

    home.getAddToCartButton().should("be.visible");
    home.clickAddToCart();

    home.openCart();
    cart.getItems().should("have.length.at.least", 1);
    cart.deleteFirstItem();
    cart.getItems().should("have.length", 0);
    cy.wait(700);
  });

  it.only("buys three units of the same laptop", () => {
    cy.visit("/");

    home.openLaptops();
    home.getProductTitles().contains("Sony vaio i5").should("be.visible");
    home.openFirstLaptop();

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

  it("adds all 6 laptops (first page) and completes purchase", () => {
    cy.visit("/");

    home.openLaptops();
    cy.on("window:alert", (txt) => expect(txt).to.match(/added/i));

    // 1
    home.openProductAt(0);
    home.getAddToCartButton().should("be.visible");
    home.clickAddToCart();
    cy.visit("/");
    home.openLaptops();

    // 2
    home.openProductAt(1);
    home.getAddToCartButton().should("be.visible");
    home.clickAddToCart();
    cy.visit("/");
    home.openLaptops();

    // 3
    home.openProductAt(2);
    home.getAddToCartButton().should("be.visible");
    home.clickAddToCart();
    cy.visit("/");
    home.openLaptops();

    // 4
    home.openProductAt(3);
    home.getAddToCartButton().should("be.visible");
    home.clickAddToCart();
    cy.visit("/");
    home.openLaptops();

    // 5
    home.openProductAt(4);
    home.getAddToCartButton().should("be.visible");
    home.clickAddToCart();
    cy.visit("/");
    home.openLaptops();

    // 6
    home.openProductAt(5);
    home.getAddToCartButton().should("be.visible");
    home.clickAddToCart();

    home.openCart();

    cart.getItems().should("have.length", 6);
    cart.clickPlaceOrder();

    order.fill(orderData());
    order.clickPurchase();

    order.getConfirmMessage().should("contain.text", "Thank you");
    order.getConfirmText().should("contain.text", "Id:");
    order.getConfirmText().should("contain.text", "Amount:");

    order.clickOk();

    order.close();
    order.getModal().should("not.be.visible", { timeout: 10000 });

    home.clickLogout();
    home.getLogoutButton().should("not.be.visible");
  });
});
