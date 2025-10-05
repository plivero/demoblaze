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

    // detail scope
    detailContainer: () => cy.get("#tbodyid"),
    addToCartButton: () => cy.get("#tbodyid a.btn-success"),

    detailName: () => cy.get("#tbodyid .name"),
    detailPrice: () => cy.get("#tbodyid .price-container"),

    nextPage: () => cy.get("#next2"),
    prevPage: () => cy.get("#prev2"),
    allCategories: () => cy.get("#cat"),
  };

  // header
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

  // list
  getProductTitles() {
    return this.elements.productTitles();
  }

  // detail
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
    cy.once("window:alert", () => {}); // silencia o alert
    cy.get("a.btn-success").filter(":visible").first().click({ force: true });
  }

  // navigation
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
    this.elements.detailContainer(); // garante que entrou no detalhe
  }

  openCart() {
    this.elements.cartButton().click({ force: true });
  }
  openLaptops() {
    this.elements.laptopsCategory().click({ force: true });
    cy.wait(3000); // espera fixa combinada para Laptops
  }
  openPhones() {
    this.elements.phonesCategory().click({ force: true });
  }
  openMonitors() {
    this.elements.monitorsCategory().click({ force: true });
  }

  // pagination
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

  // utils
  getProductByName(name) {
    return cy.contains("a.hrefch", name);
  }

  // ------------------------------------------------------------------
  // Helpers simples por categoria (sem condições)
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
}
