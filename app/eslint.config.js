const { defineConfig } = require("eslint/config");
const expo = require("eslint-config-expo/flat");
const prettier = require("eslint-plugin-prettier/recommended");

module.exports = defineConfig([
  expo,
  prettier,
  {
    ignores: ["dist/*"],
  },
]);
