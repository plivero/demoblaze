// cypress/support/helpers/session.js

/// <reference types="cypress" />
import HomePage from "../pages/homePage";
import Auth from "../pages/loginPage";

export function loginSession() {
  cy.session(`ui-${Cypress.env("USER_NAME")}`, () => {
    const home = new HomePage();
    const auth = new Auth();

    cy.visit("/");

    auth.open();
    auth.getModal().should("be.visible").and("have.class", "show");

    cy.wait(1000);

    auth.fillUsername(Cypress.env("USER_NAME"));
    auth.elements
      .usernameInput()
      .should("have.value", Cypress.env("USER_NAME"));

    auth.fillPassword(Cypress.env("USER_PASSWORD"));
    auth.elements
      .passwordInput()
      .should("have.value", Cypress.env("USER_PASSWORD"));

    auth.clickSubmit();

    home.getWelcomeUser().should("contain.text", Cypress.env("USER_NAME"));
    home.getLogoutButton().should("be.visible");
  });
}
