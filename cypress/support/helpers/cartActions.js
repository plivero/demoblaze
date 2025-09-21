// cypress/support/helpers/cartActions.js
/// <reference types="cypress" />

export function addSameProductNTimes(page, times = 1) {
  for (let i = 0; i < times; i++) {
    page.getAddToCartButton().should("be.visible").click();
    cy.on("window:alert", (txt) => expect(txt).to.match(/added/i));
    if (i < times - 1) cy.wait(1000);
  }
}
