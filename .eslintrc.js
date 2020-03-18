module.exports = {
  'env': {
    'es6': true,
    'node': true,
  },
  'extends': [
    'plugin:@typescript-eslint/recommended',
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript"
  ],
  'globals': {
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly',
  },
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaVersion': 7,
    'sourceType': 'module',
  },
  'plugins': [
    '@typescript-eslint',
    "prefer-arrow",
    "import"
  ],
  'rules': {
    "prefer-arrow/prefer-arrow-functions": [
      "warn",
      {
        "disallowPrototype": true,
        "singleReturnOnly": false,
        "classPropertiesAllowed": false
      }
    ],
    "import/first": ["warn"],
    "import/exports-last": ["warn"],
    "import/no-duplicates": ["warn"],
    "quotes": [
      "error", "double", { "allowTemplateLiterals": true }
    ],
    "semi": "off",
    "@typescript-eslint/semi": ["error"]
  },
};
