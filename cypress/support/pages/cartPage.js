// cypress/support/pages/cartPage.js
/// <reference types="cypress" />

const deleteSelector = 'a[onclick*="deleteItem"]';

export default class CartPage {
  elements = {
    container: () => cy.get("#tbodyid"),
    rows: () => cy.get("#tbodyid tr"),
    deleteLinks: () => cy.get(`#tbodyid ${deleteSelector}`),
    placeOrder: () => cy.contains("button", "Place Order"),
    itemPrices: () => cy.get("#tbodyid tr td:nth-child(3)"),
    total: () => cy.get("#totalp"),
    listPrices: () => cy.get("#tbodyid h5"),
  };

  getItems() {
    return this.elements.rows();
  }
  getDeleteLinks() {
    return this.elements.deleteLinks();
  }
  getItemPrices() {
    return this.elements.itemPrices();
  }
  getTotal() {
    return this.elements.total();
  }
  getListPrices() {
    return this.elements.listPrices();
  }
  getFirstListPrice() {
    return this.elements.listPrices().filter(":visible").first();
  }
  getLastCartItemPrice() {
    return this.elements.itemPrices().last();
  }

  clickPlaceOrder() {
    this.elements.placeOrder().click({ force: true });
  }
  removeItemAt(index) {
    this.elements.deleteLinks().eq(index).click({ force: true });
  }
  removeFirstItem() {
    this.elements.deleteLinks().first().click({ force: true });
  }
  deleteFirstItem() {
    this.removeFirstItem();
  }
  emptyCart() {
    this.elements
      .container()
      .should("exist")
      .then(($cart) => {
        const $deletes = $cart.find(deleteSelector);
        if ($deletes.length) {
          cy.wrap($deletes).click({ multiple: true, force: true });
        }
      });

    this.getItems().should("have.length", 0);
  }
}
