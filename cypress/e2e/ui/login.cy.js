// cypress/e2e/login.cy.js
import { getUserName } from "../../support/helpers/env";
import { loginSession } from "../../support/helpers/session";
import HomePage from "../../support/pages/homePage";
import Auth from "../../support/pages/loginPage";

const home = new HomePage();
const auth = new Auth();

describe("Login", () => {
  it("logs in with fixed user from env (via session helper)", () => {
    loginSession();
    cy.visit("/");
    home.getWelcomeUser().should("contain.text", `Welcome ${getUserName()}`);
    home.getLogoutButton().should("be.visible");

    home.clickLogout();
    home.getLogoutButton().should("not.be.visible");
  });

  it("cancels login from the modal (Close button)", () => {
    cy.visit("/");
    auth.open();
    auth.getModal().should("be.visible");

    auth.clickCancel();

    home.getLogoutButton().should("not.be.visible");
    home.getLoginButton().should("be.visible");
  });

  it("cancels login from the modal (X icon)", () => {
    cy.visit("/");
    auth.open();
    auth.getModal().should("be.visible");

    auth.clickCloseX();

    home.getLogoutButton().should("not.be.visible");
    home.getLoginButton().should("be.visible");
  });
});
