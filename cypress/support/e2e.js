import "./commands";

Cypress.on("uncaught:exception", (err) => {
  if (String(err).includes("Modal is transitioning")) return false;
});
