module.exports = {
    extends: [
      'airbnb-typescript/base',
      'plugin:@typescript-eslint/recommended',
      'plugin:@typescript-eslint/recommended-requiring-type-checking',
    ],
    plugins: ['import'],
    parserOptions: {
        project: './tsconfig.json',
    },
    rules: {
        'no-underscore-dangle': 0,
        'import/prefer-default-export': 0,
        'no-param-reassign': 0,
        'import/no-mutable-exports': 0,
        'no-restricted-syntax': 0,
        'no-await-in-loop': 0,
        'no-bitwise': 0,
        'no-void': 0,
        "import/extensions": [
            "error",
            "ignorePackages",
            {
              "js": "never",
              "ts": "never",
            }
        ],
        'max-lines': ["error", 160],
        'max-len': ['error', {
          code: 120,
          ignoreComments: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
        }],

        '@typescript-eslint/restrict-template-expressions': 'off',

        '@typescript-eslint/no-non-null-assertion': 'error',
        '@typescript-eslint/no-unused-vars': 'error',

        '@typescript-eslint/ban-ts-comment': 'warn',
        '@typescript-eslint/no-unsafe-assignment': 'warn',
        '@typescript-eslint/no-unsafe-call': 'warn',
        '@typescript-eslint/no-misused-promises': 'warn',
    },
    settings: {
      "import/resolver": {
        "node": {
          "extensions": [
            ".js",
            ".ts",
          ]
        }
      }
    },
    globals: {}
};