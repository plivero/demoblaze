// cypress/support/pages/loginPage.js

/// <reference types="cypress" />

export default class LoginPage {
  elements = {
    openLoginButton: () => cy.get("#login2"),
    modal: () => cy.get("#logInModal"),
    usernameInput: () => cy.get("#loginusername"),
    passwordInput: () => cy.get("#loginpassword"),
    submitButton: () => cy.get("#logInModal .btn-primary"),
    cancelButton: () => cy.get("#logInModal .btn-secondary"),
    closeX: () => cy.get("#logInModal .close"),
  };

  open() {
    this.elements.openLoginButton().click();
  }

  getModal() {
    return this.elements.modal();
  }

  fillUsername(username) {
    this.elements.usernameInput().clear().type(username);
  }

  fillPassword(password) {
    this.elements.passwordInput().clear().type(password);
  }

  fillLogin(username, password) {
    this.fillUsername(username);
    this.fillPassword(password);
  }

  submitLogin() {
    this.elements.submitButton().click({ force: true });
    this.elements.modal().should("not.be.visible");
  }

  clickSubmit() {
    this.elements.submitButton().click({ force: true });
  }

  clickCancel() {
    this.elements.cancelButton().click({ force: true });
  }

  clickCloseX() {
    this.elements.closeX().click({ force: true });
  }
}
