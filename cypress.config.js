const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://www.demoblaze.com",
    specPattern: "cypress/e2e/**/*.cy.js",
    defaultCommandTimeout: 10000,
    video: false,
    setupNodeEvents(on, config) {
      return config;
    },
  },
});
