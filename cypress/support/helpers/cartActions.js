// cypress/support/helpers/cartActions.js
/// <reference types="cypress" />

import { asNumber, sumPriceElements } from "./price";

export function addSameProductNTimes(page, times = 1) {
  for (let i = 0; i < times; i++) {
    page.getAddToCartButton().should("be.visible").click();
    cy.on("window:alert", (txt) => expect(txt).to.match(/added/i));
    if (i < times - 1) cy.wait(1000);
  }
}

export function addProductsByIndexes(homePage, indexes = []) {
  homePage.openLaptops();

  for (let i = 0; i < indexes.length; i++) {
    homePage.openProductAt(indexes[i]);
    homePage.getAddToCartButton().should("be.visible");
    homePage.clickAddToCart();

    if (i < indexes.length - 1) {
      cy.visit("/");
      homePage.openLaptops();
    }
  }
}
