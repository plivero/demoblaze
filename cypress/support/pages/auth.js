// cypress/support/pages/auth.js

/// <reference types="cypress" />

export default class Auth {
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
    this.elements.usernameInput().click().clear().type(username);
  }

  fillPassword(password) {
    this.elements.passwordInput().click().clear().type(password);
  }

  clickSubmit() {
    this.elements.submitButton().click();
  }

  clickCancel() {
    this.elements.cancelButton().click();
  }

  clickCloseX() {
    this.elements.closeX().click();
  }
}
