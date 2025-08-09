const js = require('@eslint/js');
const typescript = require('@typescript-eslint/eslint-plugin');
const typescriptParser = require('@typescript-eslint/parser');
const prettier = require('eslint-plugin-prettier');
const prettierConfig = require('eslint-config-prettier');

module.exports = [
    {
        ignores: ['dist/**/*', 'coverage/**/*', 'node_modules/**/*', 'debug*.js'],
    },
    {
        files: ['src/**/*.ts'],
        languageOptions: {
            parser: typescriptParser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
            globals: {
                console: 'readonly',
                window: 'readonly',
                global: 'readonly',
                localStorage: 'readonly',
                Storage: 'readonly',
                Window: 'readonly',
            },
        },
        plugins: {
            '@typescript-eslint': typescript,
            prettier: prettier,
        },
        rules: {
            // Prettier integration
            ...prettierConfig.rules,
            'prettier/prettier': 'error',
            
            // TypeScript rules
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/no-non-null-assertion': 'off',
            '@typescript-eslint/no-this-alias': 'off',
            
            // General rules
            'no-console': 'off',
            'prefer-const': 'error',
            'no-var': 'error',
        },
    },
    {
        files: ['test/**/*.ts'],
        languageOptions: {
            parser: typescriptParser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
            globals: {
                console: 'readonly',
                global: 'readonly',
                localStorage: 'readonly',
                window: 'readonly',
                describe: 'readonly',
                it: 'readonly',
                beforeEach: 'readonly',
                afterEach: 'readonly',
                expect: 'readonly',
                jest: 'readonly',
            },
        },
        plugins: {
            '@typescript-eslint': typescript,
            prettier: prettier,
        },
        rules: {
            // Prettier integration
            ...prettierConfig.rules,
            'prettier/prettier': 'error',
            
            // TypeScript rules
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/no-non-null-assertion': 'off',
            
            // General rules
            'no-console': 'off',
            'prefer-const': 'error',
            'no-var': 'error',
        },
    },
];