module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "next/core-web-vitals",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    "@typescript-eslint/no-explicit-any": "warn",
  },
};

