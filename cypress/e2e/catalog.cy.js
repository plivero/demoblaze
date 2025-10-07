// cypress/e2e/catalog.cy.js
import HomePage from "../support/pages/homePage";

describe("Catalog / Navigation", () => {
  const home = new HomePage();

  beforeEach(() => {
    cy.ensureSession();
    cy.visit("/");
  });

  it("opens Phones and sees 'Samsung galaxy s6'", () => {
    home.openPhones();
    home.getProductByName("Samsung galaxy s6").should("be.visible");
  });

  it("opens Monitors and sees 'Apple monitor 24'", () => {
    home.openMonitors();
    home.getProductByName("Apple monitor 24").should("be.visible");
  });
});
