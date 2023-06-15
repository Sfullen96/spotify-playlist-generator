module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  plugins: ["prettier"],
  extends: ["prettier", "airbnb"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    "no-new": "off",
    "prettier/prettier": ["error", { endOfLine: "auto" }],
    quotes: ["error", "double"],
    // Following rules disabled or changed to prevent conflicts with Prettier rules
    "prefer-arrow-callback": "off",
    "arrow-body-style": "off",
    "arrow-parens": "off",
    "object-curly-newline": "off",
    "operator-linebreak": "off",
    // Disabled due to long implicit return of invoked function
    "implicit-arrow-linebreak": "off",
    "no-confusing-arrow": "off",
    "import/no-cycle": "off",
    indent: "off",
    "no-case-declarations": "off",
    "function-paren-newline": "off",
    "ts-styled-plugin": "off",
    "linebreak-style": "off",
    "no-bitwise": "off",
    "react/forbid-prop-types": "off",
    "react/function-component-definition": [
      2,
      {
        namedComponents: "arrow-function",
        unnamedComponents: "arrow-function",
      },
    ],
    "no-underscore-dangle": "off",
    "no-unexpected-multiline": "off",
    "import/prefer-default-export": "off",
  },
};
