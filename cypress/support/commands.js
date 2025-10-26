// cypress/support/commands.js
/// <reference types="cypress" />

import HomePage from "./pages/homePage";
import LoginPage from "./pages/loginPage";

Cypress.Commands.add("getNextAlertText", () => {
  return new Cypress.Promise((resolve) => {
    cy.once("window:alert", resolve);
  });
});

Cypress.Commands.add("ensureSession", () => {
  const home = new HomePage();
  const auth = new LoginPage();

  function uiLogin() {
    cy.visit("/");

    home.getLoginButton().should("be.visible").click();

    auth.getModal().should("be.visible");
    auth.fillLogin(Cypress.env("USER_NAME"), Cypress.env("USER_PASSWORD"));
    auth.elements
      .submitButton()
      .should("be.visible")
      .then(($btn) => {
        cy.wrap($btn).click({ force: true });
      });

    home
      .getWelcomeUser()
      .should("be.visible")
      .and("contain.text", Cypress.env("USER_NAME"));
  }

  cy.session(["login@stable", Cypress.env("USER_NAME")], uiLogin, {
    cacheAcrossSpecs: true,
    validate() {
      cy.visit("/");
      home.getWelcomeUser().should("contain.text", Cypress.env("USER_NAME"));
    },
  });
});
