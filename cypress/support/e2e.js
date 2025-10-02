// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************
// cypress/support/e2e.js
import "./commands";
import HomePage from "./pages/homePage";
import LoginPage from "./pages/loginPage";

const home = new HomePage();
const auth = new LoginPage();

Cypress.Commands.add("ensureSession", () => {
  function uiLogin() {
    cy.visit("/");
    home.getLoginButton().click(); // abre modal
    auth.fillLogin(Cypress.env("USER_NAME"), Cypress.env("USER_PASSWORD"));
    auth.submitLogin(); // clica e espera o modal sumir
  }

  // troquei a chave pra evitar conflito com sessões antigas
  cy.session(["login@stable", Cypress.env("USER_NAME")], uiLogin, {
    cacheAcrossSpecs: true,
    // Valida de forma mais robusta: estar logado = Logout visível
    validate() {
      cy.visit("/");
      cy.get("#logout2").should("be.visible");
    },
  });
});

// (opcional, mas recomendado se o Bootstrap insistir em soltar a exceção de transição)
// Mantém seus testes limpos sem if/esperas na spec/POM
Cypress.on("uncaught:exception", (err) => {
  if (String(err).includes("Modal is transitioning")) return false;
});
