// cypress/e2e/pagination.cy.js

import HomePage from "../../support/pages/homePage";

describe("Pagination", () => {
  const home = new HomePage();

  it("navega com Next e Previous validando itens de referência (sem invoke)", () => {
    cy.visit("/");
    home.openAllCategories();

    home.getProductByName("Samsung galaxy s6").should("be.visible");
    home.getProductByName("Nokia lumia 1520").should("be.visible");

    home.getNextPageButton().should("be.visible");
    home.clickNext();

    home.getProductByName("Samsung galaxy s7").should("not.exist");

    home.getPreviousPageButton().should("be.visible");

    home.clickPrevious();

    home.getProductByName("Samsung galaxy s7").should("be.visible");
    home.getNextPageButton().should("be.visible");
  });
});
