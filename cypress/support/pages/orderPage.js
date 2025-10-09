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

  fill(data) {
    this.elements.name().clear().type(data.name);
    this.elements.country().clear().type(data.country);
    this.elements.city().clear().type(data.city);
    this.elements.card().clear().type(data.card);
    this.elements.month().clear().type(data.month);
    this.elements.year().clear().type(data.year);
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
  expectRequiredFieldsAlert(text) {
    cy.expectRequiredFieldsAlert(text);
  }
}
