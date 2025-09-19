// cypress/support/pages/homePage.js
/// <reference types="cypress" />

export default class HomePage {
  elements = {
    loginButton: () => cy.get("#login2"),
    logoutButton: () => cy.get("#logout2"),
    welcomeUser: () => cy.get("#nameofuser"),
    cartLink: () => cy.get("#cartur"),
  };

  visit() {
    cy.visit("/");
  }

  openLogin() {
    this.elements.loginButton().click();
  }

  clickLogout() {
    this.elements.logoutButton().click();
  }

  goToLaptops() {
    this.elements.laptopsCategory().click();
  }

  openCart() {
    this.elements.cartLink().click();
  }

  getWelcomeUser() {
    return this.elements.welcomeUser();
  }
}
