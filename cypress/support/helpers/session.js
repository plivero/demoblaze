// cypress/support/helpers/session.js

/// <reference types="cypress" />
import HomePage from "../pages/homePage";
import Auth from "../pages/auth";
import { getUserName, getUserPassword } from "./env";

export function loginSession() {
  const username = getUserName();
  const password = getUserPassword();

  cy.session(`ui-${username}`, () => {
    const home = new HomePage();
    const auth = new Auth();

    cy.visit("/");

    auth.open();
    auth.getModal().should("be.visible").and("have.class", "show");

    cy.wait(1000);

    auth.fillUsername(username);
    auth.elements.usernameInput().should("have.value", username);

    auth.fillPassword(password);
    auth.elements.passwordInput().should("have.value", password);

    auth.clickSubmit();

    home.getWelcomeUser().should("contain.text", username);
    home.getLogoutButton().should("be.visible");
  });
}
