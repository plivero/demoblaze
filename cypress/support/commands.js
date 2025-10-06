// cypress/support/commands.js
/// <reference types="cypress" />

import HomePage from "./pages/homePage";
import LoginPage from "./pages/loginPage";

Cypress.Commands.add("ignoreNextAlert", () => {
  cy.once("window:alert", () => {});
});

Cypress.Commands.add("expectNextAlert", (expected) => {
  cy.once("window:alert", (txt) => {
    if (expected instanceof RegExp) {
      expect(txt).to.match(expected);
    } else {
      expect(txt).to.contain(expected);
    }
  });
});

Cypress.Commands.add("ensureSession", () => {
  const home = new HomePage();
  const auth = new LoginPage();

  function uiLogin() {
    cy.visit("/");
    home.getLoginButton().click();
    auth.fillLogin(Cypress.env("USER_NAME"), Cypress.env("USER_PASSWORD"));
    auth.submitLogin();
  }

  cy.session(["login@stable", Cypress.env("USER_NAME")], uiLogin, {
    cacheAcrossSpecs: true,
    validate() {
      cy.visit("/");
      cy.get("#logout2").should("be.visible");
    },
  });
});
