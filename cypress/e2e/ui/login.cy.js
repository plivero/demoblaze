// cypress/e2e/login.cy.js
import HomePage from "../../support/pages/homePage";
import Auth from "../../support/pages/loginPage";

const home = new HomePage();
const auth = new Auth();

describe("Login", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("logs in with fixed user from env (via cy.ensureSession)", () => {
    cy.ensureSession();
    cy.visit("/");

    home
      .getWelcomeUser()
      .should("contain.text", `Welcome ${Cypress.env("USER_NAME")}`);
    home.getLogoutButton().should("be.visible");

    home.clickLogout();
    home.getLogoutButton().should("not.be.visible");
  });

  it("cancels login from the modal (Close button)", () => {
    auth.open();
    auth.getModal().should("be.visible");
    auth.clickCancel();

    home.getLogoutButton().should("not.be.visible");
    home.getLoginButton().should("be.visible");
  });

  it("cancels login from the modal (X icon)", () => {
    auth.open();
    auth.getModal().should("be.visible");
    auth.clickCloseX();

    home.getLogoutButton().should("not.be.visible");
    home.getLoginButton().should("be.visible");
  });
});
