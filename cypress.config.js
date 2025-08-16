const { defineConfig } = require("cypress");

module.exports = defineConfig({
  viewportHeight: 1080,
  viewportWidth: 1920,
  video: false,
  env: {
    username: "djtest@hotmail.com",
    password: "cesar0581998",
    apiURL: "https://conduit-api.bondaracademy.com"
  },
  retries: 5,
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },

    baseUrl: "https://conduit.bondaracademy.com/",
    specPattern: "cypress/e2e/**/*.spec.{js,jsx,ts,tsx}",
    reporter: 'cypress-multi-reporters',
    reporterOptions: {
      reporterEnabled: 'mocha-junit-reporter, mochawesome',
      mochaJunitReporterReporterOptions: {
        mochaFile: 'cypress/results/junit/results-[hash].xml'
      },
      mochawesomeReporterOptions: {
        charts: true,
        reportPageTitle: 'Cypress Test Results',
        embeddedScreenshots: true,
        inlineAssets: true,
        saveAllAttempts: false,
        reportDir: 'cypress/results/mochawesome',
        reportFilename: 'mochawesome'
      }
    }
  },
});
