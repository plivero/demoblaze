// cypress/e2e/automation-exercise/ae-intercept-login.cy.js
describe("AutomationExercise - login intercept (discover)", () => {
  it("logs in and captures the first POST", () => {
    // Bloqueia ruído de ads opcional (tira o ping 204 do log)
    cy.intercept("POST", "https://pagead2.googlesyndication.com/**", {
      statusCode: 204,
      body: "",
    }).as("ads");

    // Intercept amplo pra capturar QUALQUER POST e ver a URL real
    cy.intercept("POST", "**").as("anyPost");

    cy.visit("https://automationexercise.com/login");

    cy.get('[data-qa="login-email"]').type("kobefib946@blaxion.com");
    cy.get('[data-qa="login-password"]').type("123456", { log: false });

    // pega o botão e sobe até o <form> correto
    cy.get('[data-qa="login-button"]')
      .should("be.visible")
      .closest("form")
      .submit();

    cy.wait("@anyPost", { timeout: 15000 }).then((i) => {
      cy.log(`POST to: ${i.request.url}`);
      expect([200, 204, 302, 303]).to.include(i.response?.statusCode);
    });

    cy.contains("Logged in as", { timeout: 10000 }).should("be.visible");
  });
});
