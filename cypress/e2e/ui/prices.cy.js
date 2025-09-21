// cypress/e2e/prices.cy.js

import HomePage from "../../support/pages/homePage";
import CartPage from "../../support/pages/cartPage";
import { asNumber } from "../../support/helpers/price";
import { getCartSumAndTotal } from "../../support/helpers/cartActions";

const home = new HomePage();
const cart = new CartPage();

describe("Price validations on Demoblaze", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("List price (before click) must match detail price (after selecting product)", () => {
    home.openLaptops();

    cart
      .getFirstListPrice()
      .invoke("text")
      .then((price) => {
        const listPrice = asNumber(price);

        home.openProductAt(0);

        home
          .getDetailPrice()
          .invoke("text")
          .then((price2) => {
            const detailPrice = asNumber(price2);
            expect(detailPrice).to.eq(listPrice);
          });
      });
  });

  it("Detail price must match cart row price after adding the product", () => {
    home.openLaptops();
    home.openProductAt(0);

    home
      .getDetailPrice()
      .invoke("text")
      .then((price) => {
        const detailPrice = asNumber(price);

        home.clickAddToCart();

        home.openCart();

        cart
          .getLastCartItemPrice()
          .invoke("text")
          .then((rowText) => {
            const rowPrice = asNumber(rowText);
            expect(rowPrice).to.eq(detailPrice);
          });
      });
  });

  it("Sum of cart item prices must match #totalp after adding multiple products", () => {
    cy.visit("/");

    home.openLaptops();
    home.openProductAt(0);
    home.getAddToCartButton().should("be.visible");
    home.clickAddToCart();

    cy.visit("/");
    home.openLaptops();
    home.openProductAt(1);
    home.getAddToCartButton().should("be.visible");
    home.clickAddToCart();

    cy.visit("/");
    home.openLaptops();
    home.openProductAt(2);
    home.getAddToCartButton().should("be.visible");
    home.clickAddToCart();

    home.openCart();

    cart.getItemPrices().should("have.length", 3);

    getCartSumAndTotal(cart).then(({ count, sum, total }) => {
      expect(count).to.eq(3);
      expect(total).to.eq(sum);
    });
  });
});
