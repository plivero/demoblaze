// cypress/e2e/product-detail.cy.js
import HomePage from "../../support/pages/homePage";

describe("Product Detail", () => {
  const home = new HomePage();

  beforeEach(() => {
    cy.ensureSession();
    cy.visit("/");
  });

  it("opens first product and shows name and price", () => {
    home.openLaptops();
    home.openProductAt(0);
    home
      .getDetailName()
      .should("be.visible")
      .and("contain.text", "Sony vaio i5");
    home.getDetailPrice().should("be.visible").and("contain.text", "790");
  });

  it('"Add to cart" is visible and clickable on detail page', () => {
    home.openLaptops();
    home.openProductAt(0);
    home.getAddToCartButton().should("be.visible");
    home.clickAddToCart();
  });
});
