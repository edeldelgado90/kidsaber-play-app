module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-native/all',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: { jsx: true },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', 'react-hooks', '@typescript-eslint', 'react-native'],
  settings: {
    react: { version: 'detect' },
  },
  env: {
    'react-native/react-native': true,
    es2021: true,
  },
  rules: {
    // TypeScript
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-non-null-assertion': 'warn',

    // React
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',

    // React Native
    'react-native/no-unused-styles': 'error',
    'react-native/split-platform-components': 'warn',
    'react-native/no-inline-styles': 'warn',
    'react-native/no-color-literals': 'off',
    'react-native/no-raw-text': ['error', { skip: ['Button'] }],

    // Hooks
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
  overrides: [
    {
      files: ['**/__tests__/**/*.{ts,tsx}', '**/*.test.{ts,tsx}'],
      env: { jest: true },
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        // `jest.mock` factories are hoisted above the imports, so they can only
        // pull in modules with `require`.
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
    {
      // react-three-fiber scenes use three.js JSX elements whose props
      // (position, args, intensity…) are unknown to the react plugin.
      files: ['src/presentation/components/pet3d/**/*.tsx'],
      rules: {
        'react/no-unknown-property': 'off',
      },
    },
  ],
  ignorePatterns: ['node_modules/', '.expo/', 'coverage/', 'babel.config.js'],
};
