import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: ["cypress"],
    extends: ["eslint:recommended", "plugin:cypress/recommended"],
    rules: {
      semi: ["error", "always"],
      quotes: ["error", "double"],
    },
  },
]);
