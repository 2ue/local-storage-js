const js = require('@eslint/js');
const typescript = require('@typescript-eslint/eslint-plugin');
const typescriptParser = require('@typescript-eslint/parser');
const prettier = require('eslint-plugin-prettier');

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
            // Prettier integration - manually disable conflicting rules for Node.js 16 compatibility
            'prettier/prettier': 'error',
            'arrow-body-style': 'off',
            'prefer-arrow-callback': 'off',
            'curly': 'off',
            'lines-around-comment': 'off',
            'max-len': 'off',
            'no-confusing-arrow': 'off',
            'no-mixed-operators': 'off',
            'no-tabs': 'off',
            'no-unexpected-multiline': 'off',
            'quotes': 'off',
            'semi': 'off',
            '@typescript-eslint/quotes': 'off',
            '@typescript-eslint/brace-style': 'off',
            '@typescript-eslint/comma-dangle': 'off',
            '@typescript-eslint/comma-spacing': 'off',
            '@typescript-eslint/func-call-spacing': 'off',
            '@typescript-eslint/indent': 'off',
            '@typescript-eslint/keyword-spacing': 'off',
            '@typescript-eslint/member-delimiter-style': 'off',
            '@typescript-eslint/no-extra-parens': 'off',
            '@typescript-eslint/no-extra-semi': 'off',
            '@typescript-eslint/object-curly-spacing': 'off',
            '@typescript-eslint/semi': 'off',
            '@typescript-eslint/space-before-function-paren': 'off',
            '@typescript-eslint/space-infix-ops': 'off',
            '@typescript-eslint/type-annotation-spacing': 'off',
            
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
            // Prettier integration - manually disable conflicting rules for Node.js 16 compatibility
            'prettier/prettier': 'error',
            'arrow-body-style': 'off',
            'prefer-arrow-callback': 'off',
            'curly': 'off',
            'lines-around-comment': 'off',
            'max-len': 'off',
            'no-confusing-arrow': 'off',
            'no-mixed-operators': 'off',
            'no-tabs': 'off',
            'no-unexpected-multiline': 'off',
            'quotes': 'off',
            'semi': 'off',
            '@typescript-eslint/quotes': 'off',
            '@typescript-eslint/brace-style': 'off',
            '@typescript-eslint/comma-dangle': 'off',
            '@typescript-eslint/comma-spacing': 'off',
            '@typescript-eslint/func-call-spacing': 'off',
            '@typescript-eslint/indent': 'off',
            '@typescript-eslint/keyword-spacing': 'off',
            '@typescript-eslint/member-delimiter-style': 'off',
            '@typescript-eslint/no-extra-parens': 'off',
            '@typescript-eslint/no-extra-semi': 'off',
            '@typescript-eslint/object-curly-spacing': 'off',
            '@typescript-eslint/semi': 'off',
            '@typescript-eslint/space-before-function-paren': 'off',
            '@typescript-eslint/space-infix-ops': 'off',
            '@typescript-eslint/type-annotation-spacing': 'off',
            
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