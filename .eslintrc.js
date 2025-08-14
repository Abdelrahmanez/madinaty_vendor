module.exports = {
  root: true,
  extends: [
    '@react-native',
    'plugin:import/errors',
    'plugin:import/warnings',
  ],
  plugins: ['import'],
  rules: {
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    'import/no-unresolved': ['error', { commonjs: true, caseSensitive: false }],
    'import/named': 'error',
    'import/default': 'error',
    'import/namespace': 'error',
    'import/no-duplicates': 'error',
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx'],
      },
    },
  },
};
