import { default as defaultConfig } from '@epic-web/config/eslint';
import stylistic from '@stylistic/eslint-plugin';

/** @type {import("eslint").Linter.Config} */
export default [
  ...defaultConfig,
  // add custom config objects here:
  {
    ignores: ['.storybook/*'],
  },
  {
    files: ['**/tests/**/*.ts'],
    rules: { 'react-hooks/rules-of-hooks': 'off' },
  },
  {
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      '@stylistic/indent': ['error', 2],
      '@stylistic/comma-spacing': ['error', { 'before': false, 'after': true }],
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/eol-last': ['error', 'always'],
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/quotes': ['error', 'single'],
    },
  },
];
