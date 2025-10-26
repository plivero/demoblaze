// cypress/e2e/login.cy.js
import HomePage from "../support/pages/homePage";
import Login from "../support/pages/loginPage";

const home = new HomePage();
const login = new Login();

describe("Login", () => {
  beforeEach(() => {
    Cypress.session.clearAllSavedSessions();
    cy.visit("/");
  });

  it("logs in with fixed user from env", () => {
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
    login.open();
    login.getModal().should("be.visible");
    login.clickCancel();

    home.getLogoutButton().should("not.be.visible");
    home.getLoginButton().should("be.visible");
  });

  it("cancels login from the modal (X icon)", () => {
    login.open();
    login.getModal().should("be.visible");
    login.clickCloseX();

    home.getLogoutButton().should("not.be.visible");
    home.getLoginButton().should("be.visible");
  });

  it("fails login with invalid credentials (keeps user logged out)", () => {
    cy.visit("/");
    login.open();
    login.getModal().should("be.visible");

    login.fillLogin(
      "User-Not-Valid_fJ93jKi4fs347ik",
      "Password-Not-Valid_fJ93jKi4fs347ik"
    );

    login.clickSubmit();

    cy.getNextAlertText().then((msg) => {
      expect(msg).to.contain("User does not exist");
    });

    home.getLogoutButton().should("not.be.visible");
    home.getLoginButton().should("be.visible");

    login.clickCloseX();
  });
});
