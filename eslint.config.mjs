// eslint.config.mjs
import globals from "globals";
import { defineConfig } from "eslint/config";
import cypress from "eslint-plugin-cypress";
import noOnlyTests from "eslint-plugin-no-only-tests";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.mocha,
        cy: "readonly",
        Cypress: "readonly",
        expect: "readonly",
        assert: "readonly",
      },
    },
    plugins: {
      cypress,
      "no-only-tests": noOnlyTests,
    },
    extends: ["eslint:recommended", "plugin:cypress/recommended"],
    rules: {
      semi: ["error", "always"],
      quotes: ["error", "double"],
      "no-only-tests/no-only-tests": "error",
    },
  },
]);
