// cypress/support/helpers/env.js
/// <reference types="cypress" />

export function getUserName() {
  return Cypress.env("USER_NAME");
}

export function getUserPassword() {
  return Cypress.env("USER_PASSWORD");
}
