// cypress/support/pages/cartPage.js
/// <reference types="cypress" />

export default class CartPage {
  elements = {
    rows: () => cy.get("body").find("#tbodyid tr"),
    placeOrder: () => cy.contains("button", "Place Order"),
    itemPrices: () => cy.get("#tbodyid tr td:nth-child(3)"),
    total: () => cy.get("#totalp"),
    // moved from PricesPage: list prices on catalog pages
    listPrices: () => cy.get("#tbodyid h5"),
  };

  // getters
  getItems() {
    return this.elements.rows();
  }
  getItemPrices() {
    return this.elements.itemPrices();
  }
  getTotal() {
    return this.elements.total();
  }
  // getters moved from PricesPage
  getListPrices() {
    return this.elements.listPrices();
  }
  getFirstListPrice() {
    return this.elements.listPrices().filter(":visible").first();
  }
  getLastCartItemPrice() {
    return this.elements.itemPrices().last();
  }

  // actions
  clickPlaceOrder() {
    this.elements.placeOrder().click();
  }
  deleteFirstItem() {
    this.elements
      .rows()
      .first()
      .within(() => {
        cy.contains("Delete").click();
      });
  }
}
