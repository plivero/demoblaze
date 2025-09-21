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
    addToCartButton: () => cy.get("a.btn-success"),
    detailPrice: () => cy.get(".price-container"),
    nextPage: () => cy.get("#next2"),
    prevPage: () => cy.get("#prev2"),
    allCategories: () => cy.get("#cat"),
  };

  // header actions
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

  // catalog list
  getProductTitles() {
    return this.elements.productTitles();
  }
  // product detail
  getAddToCartButton() {
    return this.elements.addToCartButton();
  }
  getDetailPrice() {
    return this.elements.detailPrice();
  }
  clickAddToCart() {
    this.elements.addToCartButton().click();
  }

  // navigation
  openAllCategories() {
    this.elements.allCategories().click();
  }
  openProductAt(index) {
    this.elements.productTitles().filter(":visible").eq(index).click();
  }
  openCart() {
    this.elements.cartButton().click();
  }
  openLaptops() {
    this.elements.laptopsCategory().click();
    cy.wait(3000);
  }
  openPhones() {
    this.elements.phonesCategory().click();
  }
  openMonitors() {
    this.elements.monitorsCategory().click();
  }

  // pagination
  getNextPageButton() {
    return this.elements.nextPage();
  }
  getPreviousPageButton() {
    return this.elements.prevPage();
  }
  clickNext() {
    this.elements
      .nextPage()
      .scrollIntoView()
      .should("be.visible")
      .click({ force: true });
  }
  clickPrevious() {
    this.elements
      .prevPage()
      .scrollIntoView()
      .should("be.visible")
      .click({ force: true });
  }

  // utils
  getProductByName(name) {
    return cy.contains("a.hrefch", name);
  }
}
