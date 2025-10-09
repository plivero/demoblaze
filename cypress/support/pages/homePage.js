// cypress/support/pages/homePage.js
/// <reference types="cypress" />

export default class HomePage {
  elements = {
    loginButton: () => cy.get("#login2"),
    logoutButton: () => cy.get("#logout2"),
    welcomeUser: () => cy.get("#nameofuser"),
    cartButton: () => cy.get("#cartur"),
    laptopsCategory: () => cy.get("[onclick=\"byCat('notebook')\"]"),
    phonesCategory: () => cy.get("[onclick=\"byCat('phone')\"]"),
    monitorsCategory: () => cy.get("[onclick=\"byCat('monitor')\"]"),
    productTitles: () => cy.get("a.hrefch"),
    detailContainer: () => cy.get("#tbodyid"),
    addToCartButton: () => cy.get("#tbodyid a.btn-success"),
    detailName: () => cy.get("#tbodyid .name"),
    detailPrice: () => cy.get("#tbodyid .price-container"),
    nextPage: () => cy.get("#next2"),
    prevPage: () => cy.get("#prev2"),
    allCategories: () => cy.get("#cat"),
  };

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
    cy.ignoreNextAlert();
    this.getAddToCartButton().filter(":visible").first().click({ force: true });
  }

  openAllCategories() {
    this.elements.allCategories().click();
  }

  openProductAt(index) {
    this.elements
      .productTitles()
      .filter(":visible")
      .eq(index)
      .scrollIntoView()
      .click({ force: true });
    this.elements.detailContainer().should("exist");
  }

  openCart() {
    this.elements.cartButton().click({ force: true });
  }

  openLaptops() {
    this.elements.laptopsCategory().click({ force: true });
    this.elements.productTitles().filter(":visible").should("exist");
  }

  openPhones() {
    this.elements.phonesCategory().click({ force: true });
    this.elements.productTitles().filter(":visible").should("exist");
  }

  openMonitors() {
    this.elements.monitorsCategory().click({ force: true });
    this.elements.productTitles().filter(":visible").should("exist");
  }

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

  getProductByName(name) {
    return cy.contains("a.hrefch", name);
  }

  addLaptopsByIndexes(indexes = []) {
    Cypress._.each(indexes, (i) => {
      this.openLaptops();
      this.openProductAt(i);
      this.getAddToCartButton().should("be.visible");
      this.clickAddToCart();
      cy.visit("/");
    });
  }

  addPhonesByIndexes(indexes = []) {
    Cypress._.each(indexes, (i) => {
      this.openPhones();
      this.openProductAt(i);
      this.getAddToCartButton().should("be.visible");
      this.clickAddToCart();
      cy.visit("/");
    });
  }

  addMonitorsByIndexes(indexes = []) {
    Cypress._.each(indexes, (i) => {
      this.openMonitors();
      this.openProductAt(i);
      this.getAddToCartButton().should("be.visible");
      this.clickAddToCart();
      cy.visit("/");
    });
  }

  addCurrentProductToCart() {
    cy.ignoreNextAlert();
    this.elements
      .addToCartButton()
      .filter(":visible")
      .first()
      .click({ force: true });
  }

  addProductNTimes(times = 3) {
    Cypress._.times(times, () => {
      this.addCurrentProductToCart();
    });
  }
}
