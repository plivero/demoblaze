// cypress/support/pages/homePage.js
/// <reference types="cypress" />

export default class HomePage {
  elements = {
    loginButton: () => cy.get("#login2"),
    logoutButton: () => cy.get("#logout2"),
    welcomeUser: () => cy.get("#nameofuser"),
    cartButton: () => cy.get("#cartur"),

    // Categories
    categoryLink: (cat) => cy.contains("a.list-group-item", cat),

    // Listing / detail
    productTitles: () => cy.get("a.hrefch"),
    detailContainer: () => cy.get("#tbodyid"),
    addToCartButton: () => cy.get("#tbodyid a.btn-success"),
    detailName: () => cy.get("#tbodyid .name"),
    detailPrice: () => cy.get("#tbodyid .price-container"),

    // Pagination
    nextPage: () => cy.get("#next2"),
    prevPage: () => cy.get("#prev2"),

    // “All”
    allCategories: () => cy.get("#cat"),
  };

  // Auth
  clickLogin() {
    this.elements.loginButton().click();
  }
  clickLogout() {
    this.elements.logoutButton().click({ force: true });
  }
  getLoginButton() {
    return this.elements.loginButton();
  }
  getLogoutButton() {
    return this.elements.logoutButton();
  }
  getWelcomeUser() {
    return this.elements.welcomeUser();
  }

  // ---- Categories (single API) ----
  openCategory(label) {
    this.elements.categoryLink(label).click();
    this.elements.productTitles().filter(":visible").should("exist");
  }
  openAllCategories() {
    this.elements.allCategories().click();
  }

  // Listing / detail
  getProductTitles() {
    return this.elements.productTitles();
  }
  getAddToCartButton() {
    return this.elements.addToCartButton();
  }
  getDetailName() {
    return this.elements.detailName();
  }
  getDetailPrice() {
    return this.elements.detailPrice();
  }

  clickAddToCart() {
    this.getAddToCartButton().filter(":visible").first().click({ force: true });
  }

  openProductAt(index) {
    this.elements
      .productTitles()
      .filter(":visible")
      .eq(index)
      .scrollIntoView()
      .click({ force: true });
  }

  getProductByName(name) {
    return cy.contains("a.hrefch", name);
  }

  // Cart
  openCart() {
    this.elements.cartButton().click({ force: true });
  }

  // Pagination
  getNextPageButton() {
    return this.elements.nextPage();
  }
  getPreviousPageButton() {
    return this.elements.prevPage();
  }
  clickNext() {
    this.elements.nextPage().scrollIntoView().click({ force: true });
  }
  clickPrevious() {
    this.elements.prevPage().scrollIntoView().click({ force: true });
  }

  addProductsByIndexes(category, indexes = []) {
    indexes.forEach((i) => {
      this.openCategory(category);
      this.openProductAt(i);
      this.elements.addToCartButton().first().click({ force: true });
      cy.getNextAlertText().then((msg) => {
        expect(msg).to.contain("Product added");
      });
      cy.visit("/");
    });
  }

  addCurrentProductToCart() {
    this.elements
      .addToCartButton()
      .filter(":visible")
      .first()
      .click({ force: true });
  }

  addProductNTimes(times) {
    Cypress._.times(times, () => this.addCurrentProductToCart());
  }

  addProductByCategoryAndIndex(category, index) {
    this.openCategory(category);
    this.openProductAt(index);
    this.getAddToCartButton().should("be.visible");
    this.clickAddToCart();
    cy.visit("/");
  }
}
