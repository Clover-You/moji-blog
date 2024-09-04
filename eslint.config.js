import antfu from '@antfu/eslint-config'

export default antfu(
  // {
  // },
  {
    react: true,
    rules: {
      'semi': ['error', 'never'],
      'prefer-const': 'error',
      'react-refresh/only-export-components': 'off',
    },
  },
)
