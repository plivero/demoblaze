// cypress/support/pages/auth.js
/// <reference types="cypress" />

export default class AuthModal {
  elements = {
    modal: () => cy.get("#logInModal"),
    usernameInput: () => cy.get("#loginusername"),
    passwordInput: () => cy.get("#loginpassword"),
    submitButton: () => cy.get("#logInModal").contains("button", "Log in"),
  };

  fillUsername(username) {
    this.elements.usernameInput().clear().type(username);
  }

  fillPassword(password) {
    this.elements.passwordInput().clear().type(password);
  }

  clickSubmit() {
    this.elements.submitButton().click();
  }

  getModal() {
    return this.elements.modal();
  }
}
