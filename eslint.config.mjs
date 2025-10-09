// eslint.config.mjs
import globals from "globals";
import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import cypress from "eslint-plugin-cypress";
import noOnlyTests from "eslint-plugin-no-only-tests";

export default defineConfig([
  js.configs.recommended,

  {
    files: ["**/*.{js,mjs,cjs}"],

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.mocha,
        cy: "readonly",
        Cypress: "readonly",
      },
    },

    plugins: {
      cypress,
      "no-only-tests": noOnlyTests,
    },

    rules: {
      ...cypress.configs.recommended.rules,

      semi: ["error", "always"],
      quotes: ["error", "double"],
      "no-only-tests/no-only-tests": "error",
    },
  },
]);
