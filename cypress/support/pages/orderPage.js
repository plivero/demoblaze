/// <reference types="cypress" />

export default class Order {
  elements = {
    modal: () => cy.get("#orderModal"),
    name: () => cy.get("#name"),
    country: () => cy.get("#country"),
    city: () => cy.get("#city"),
    card: () => cy.get("#card"),
    month: () => cy.get("#month"),
    year: () => cy.get("#year"),
    purchaseBtn: () => cy.get("#orderModal .btn-primary"),
    confirmTitle: () => cy.get(".sweet-alert.showSweetAlert h2"),
    confirmText: () =>
      cy.get(".sweet-alert.showSweetAlert .lead, .sweet-alert p"),
    okButton: () => cy.get(".sweet-alert .confirm"),
    sweetAlert: () => cy.get(".sweet-alert"),
    closeBtn: () => cy.get("#orderModal .btn-secondary"),
  };

  fill(d) {
    this.elements.name().clear().type(d.name);
    this.elements.country().clear().type(d.country);
    this.elements.city().clear().type(d.city);
    this.elements.card().clear().type(d.card);
    this.elements.month().clear().type(d.month);
    this.elements.year().clear().type(d.year);
  }

  clickPurchase() {
    this.elements.purchaseBtn().click();
  }
  clickOk() {
    this.elements.okButton().click();
  }

  getConfirmMessage() {
    return this.elements.confirmTitle();
  }
  getConfirmText() {
    return this.elements.confirmText();
  }
  getSweetAlert() {
    return this.elements.sweetAlert();
  }
  getModal() {
    return this.elements.modal();
  }

  close() {
    this.elements.closeBtn().click({ force: true });
  }
}
