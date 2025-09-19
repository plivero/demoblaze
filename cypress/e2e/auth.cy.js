import HomePage from "../support/pages/homePage";
import Auth from "../support/pages/auth";

describe("Auth - Login with .env", () => {
  it("should login using env credentials", () => {
    const username = Cypress.env("USER_NAME");
    const password = Cypress.env("USER_PASSWORD");

    const homePage = new HomePage();
    const auth = new Auth();

    homePage.visit();
    homePage.openLogin();
    auth.getModal().should("be.visible");

    auth.fillUsername(username);
    auth.fillPassword(password);
    auth.clickSubmit();

    homePage.getLogoutButton().should("be.visible");
    homePage.getWelcomeUser().should("contain.text", `Welcome ${username}`);
  });
});
