// cypress/e2e/automation-exercise/ae-intercept-home.cy.js
describe("AutomationExercise - home intercept", () => {
  it("should load home and wait for main request", () => {
    cy.intercept("GET", "https://automationexercise.com/").as("getHome");

    cy.visit("https://automationexercise.com/");

    cy.wait("@getHome").its("response.statusCode").should("eq", 200);

    cy.contains("Features Items").should("be.visible");
  });
});
