/** @type {import('eslint').Linter.Config} */
const config = {
  root: true,
  extends: [
    "@ameleco/eslint-config/base",
    "@ameleco/eslint-config/nextjs",
    "@ameleco/eslint-config/react",
  ],
};

module.exports = config;
