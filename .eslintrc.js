module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
  extends: ['plugin:vue/essential'],
  rules: {
    'no-console': 0,
    'no-lonely-if': 0,
    // 'no-unused-vars': ['warn', { args: 'after-used' }],
    'no-unused-vars': 0,
    'no-undef': 1,
    'vue/no-unused-vars': 0,
    'vue/valid-template-root': 0,
    'vue/no-unused-components': 1,
    eqeqeq: 1,
  },
  globals: { VERSION: true },
}
