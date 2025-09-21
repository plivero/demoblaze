// cypress/e2e/login.cy.js

import HomePage from "../../support/pages/homePage";
import Auth from "../../support/pages/auth";
import { getUserName } from "../../support/helpers/env";
import { loginSession } from "../../support/helpers/session";

describe("Login", () => {
  it("logs in with fixed user from env (via session helper)", () => {
    const home = new HomePage();

    loginSession();
    cy.visit("/");
    home.getWelcomeUser().should("contain.text", `Welcome ${getUserName()}`);
    home.getLogoutButton().should("be.visible");

    home.clickLogout();
    home.getLogoutButton().should("not.be.visible");
  });

  it("cancels login from the modal (Close button)", () => {
    const home = new HomePage();
    const auth = new Auth();

    cy.visit("/");
    auth.open();
    auth.getModal().should("be.visible");

    cy.on("uncaught:exception", () => false);
    auth.clickCancel();

    home.getLogoutButton().should("not.be.visible");
    home.getLoginButton().should("be.visible");
  });

  it("cancels login from the modal (X icon)", () => {
    const home = new HomePage();
    const auth = new Auth();

    cy.visit("/");
    auth.open();
    auth.getModal().should("be.visible");

    cy.on("uncaught:exception", () => false);
    auth.clickCloseX();

    home.getLogoutButton().should("not.be.visible");
    home.getLoginButton().should("be.visible");
  });
});
