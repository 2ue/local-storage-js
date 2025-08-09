# Code Quality Tools Configuration Guide

This document provides detailed information about the code quality tools configuration and usage methods in the project.

## 🛠️ Tools Overview

| Tool | Version | Purpose | Configuration File |
|------|---------|---------|-------------------|
| **ESLint** | 9.33.0 | Code quality checking | `eslint.config.js` |
| **Prettier** | 3.6.2 | Code formatting | `.prettierrc.json` |
| **TypeScript** | 5.9.2 | Type checking | `tsconfig.json` |
| **Jest** | 30.0.5 | Testing framework | `jest.config.json` |

## 📝 ESLint Configuration

### Configuration File Structure

```javascript
// eslint.config.js - ESLint v9 new format
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
            globals: {
                console: 'readonly',
                window: 'readonly',
                // ... more global variables
            }
        },
        plugins: {
            '@typescript-eslint': typescript,
            prettier: prettier,
        },
        rules: {
            // TypeScript rules
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/explicit-function-return-type': 'off',
            
            // General rules
            'prefer-const': 'error',
            'no-var': 'error',
        },
    }
];
```

### Key Configuration Explanation

#### 1. File Matching

```javascript
{
    files: ['src/**/*.ts'],        // Source code files
    files: ['test/**/*.ts'],       // Test files
    ignores: ['dist/**/*'],        // Ignore build artifacts
}
```

#### 2. Language Configuration

```javascript
languageOptions: {
    parser: typescriptParser,      // Use TypeScript parser
    parserOptions: {
        ecmaVersion: 'latest',     // Support latest JS syntax
        sourceType: 'module',      // Use ES modules
    },
    globals: {
        console: 'readonly',       // Allow console usage
        window: 'readonly',        // Browser environment
        // Jest testing environment variables...
    }
}
```

#### 3. Rule Configuration

**TypeScript Rules:**
```javascript
'@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
// Allow parameters starting with _ to be unused

'@typescript-eslint/no-explicit-any': 'warn',
// Warn about any type usage (allowed but not recommended)

'@typescript-eslint/no-this-alias': 'off',
// Allow this aliases (const _this = this)
```

**Code Quality Rules:**
```javascript
'prefer-const': 'error',          // Force const usage
'no-var': 'error',               // Prohibit var
'no-console': 'off',             // Allow console.log
```

### Run Commands

```bash
# Check code quality
npm run lint

# Auto fix fixable issues
npm run lint:fix

# Check specific file
npx eslint src/store.ts

# Check and show rule names
npx eslint --print-config src/store.ts
```

## 🎨 Prettier Configuration

### Configuration File

```json
{
  "semi": true,                    // Use semicolons
  "trailingComma": "es5",         // ES5 compatible trailing commas
  "singleQuote": true,            // Use single quotes
  "printWidth": 100,              // Line width limit 100 characters
  "tabWidth": 4,                  // 4 spaces indentation
  "useTabs": false,               // Use spaces instead of tabs
  "bracketSpacing": true,         // Object literal spacing { foo: bar }
  "bracketSameLine": false,       // JSX tag line breaks
  "arrowParens": "avoid",         // Arrow function parameter parentheses
  "endOfLine": "lf"               // Use LF line endings
}
```

### Ignore File Configuration

```bash
# .prettierignore
dist/                             # Build artifacts
coverage/                         # Coverage reports
node_modules/                     # Dependencies
*.js                             # JavaScript files (project mainly TS)
*.log                            # Log files
.DS_Store                        # macOS system files
```

### Run Commands

```bash
# Format all files
npm run format

# Check format (don't modify files)
npm run format:check

# Format specific file
npx prettier --write src/store.ts

# Check specific file format
npx prettier --check src/store.ts
```

## 🔧 Tool Integration

### ESLint + Prettier Integration

To avoid conflicts, the project configured `eslint-config-prettier`:

```javascript
// In ESLint configuration
rules: {
    ...prettierConfig.rules,      // Disable rules conflicting with Prettier
    'prettier/prettier': 'error', // Treat Prettier rules as ESLint errors
}
```

### VS Code Integration

Recommended VS Code settings:

```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.includePackageJsonAutoImports": "on"
}
```

Recommended VS Code extensions:

- ESLint (`dbaeumer.vscode-eslint`)
- Prettier (`esbenp.prettier-vscode`)
- TypeScript Importer (`pmneo.tsimporter`)

## 🚀 Automated Workflows

### Pre-commit Check

```bash
# Complete code quality check
npm run check

# Equivalent to:
npm run format:check && npm run lint
```

### Pre-publish Check

```bash
# Pre-publish script configured in package.json
"prepublishOnly": "npm run clean && npm run check && npm run build && npm test"
```

Execution order:
1. Clean old files
2. Check code format
3. Run ESLint check
4. Build project
5. Run all tests

### Continuous Integration

```yaml
# GitHub Actions example
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run check    # Code quality check
      - run: npm run build    # Build check
      - run: npm test         # Test check
```

## 🔍 Problem Diagnosis and Solutions

### Common ESLint Errors

#### 1. Unused Variables

```typescript
// ❌ Error: 'i' is declared but its value is never read
_util.map(keys, function (i: string | number, val: string) {
    res.push(_this.getItem(val));
});

// ✅ Fix: Use underscore prefix
_util.map(keys, function (_i: string | number, val: string) {
    res.push(_this.getItem(val));
});
```

#### 2. Any Type Warning

```typescript
// ⚠️ Warning: Unexpected any. Specify a different type
function processData(data: any) { }

// ✅ Better approach: Use generics or union types
function processData<T>(data: T) { }
function processData(data: string | number | object) { }
```

#### 3. Undefined Global Variables

```typescript
// ❌ Error: 'window' is not defined
window.store = store;

// ✅ Fix: Add global variables in ESLint configuration
globals: {
    window: 'readonly'
}
```

### Common Prettier Issues

#### 1. Line Width Exceeded

```typescript
// ❌ Exceeds 100 characters
const veryLongVariableName = someFunction(parameter1, parameter2, parameter3, parameter4);

// ✅ Auto-formatted to multiple lines
const veryLongVariableName = someFunction(
    parameter1,
    parameter2,
    parameter3,
    parameter4
);
```

#### 2. Inconsistent Quotes

```typescript
// ❌ Mixed quotes
const str1 = "hello";
const str2 = 'world';

// ✅ Consistent single quotes
const str1 = 'hello';
const str2 = 'world';
```

### TypeScript Compilation Errors

#### 1. Type Mismatch

```typescript
// Recommended: Explicit import
import store from 'local-storage-js';

// ❌ Type error
const result: string = store.getItem('key'); // Returns string | null

// ✅ Correct type handling
const result = store.getItem('key'); // Auto-inferred as string | null
if (result !== null) {
    // Here result is string type
}
```

#### 2. Strict Mode Errors

```typescript
// ❌ Strict null check error
_store.setItem(key, value); // _store might be null

// ✅ Use non-null assertion or null check
_store!.setItem(key, value); // Non-null assertion
// or
if (_store) {
    _store.setItem(key, value);
}
```

## 📊 Code Quality Metrics

### ESLint Report

```bash
# Run complete check
npm run lint

# Output example
/src/store.ts
  24:17  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
  
✖ 38 problems (0 errors, 38 warnings)
```

**Quality Goals:**
- 🟢 **0 errors**
- 🟡 **Minimize warnings**

### Prettier Check

```bash
# Format check
npm run format:check

# Output example
Checking formatting...
All matched files use Prettier code style!
```

**Format Goals:**
- 🟢 **All files consistently formatted**
- 🟢 **No format errors**

### Comprehensive Check

```bash
# Run complete check
npm run check

# Success output example
> format:check && lint
Checking formatting...
All matched files use Prettier code style!

✖ 38 problems (0 errors, 38 warnings)
```

**Comprehensive Quality Standards:**
- ✅ Format check passes
- ✅ No ESLint errors
- ✅ TypeScript compilation passes
- ✅ All tests pass

## 🔧 Custom Configuration

### Adding New ESLint Rules

```javascript
// eslint.config.js
rules: {
    // Add new rules
    'no-magic-numbers': ['warn', { ignore: [0, 1, -1] }],
    'max-lines-per-function': ['warn', { max: 50 }],
    
    // Override default rules
    '@typescript-eslint/no-explicit-any': 'error', // Elevate to error
}
```

### Custom Prettier Rules

```json
{
  "printWidth": 120,        // Increase line width
  "tabWidth": 2,           // Reduce indentation
  "semi": false,           // Don't use semicolons
  "trailingComma": "all"   // Use trailing commas everywhere
}
```

### Adding Project-Specific Rules

```javascript
// Rules for specific files
{
    files: ['test/**/*.ts'],
    rules: {
        '@typescript-eslint/no-explicit-any': 'off', // Allow any in test files
        'max-lines-per-function': 'off',             // Test functions can be long
    }
}
```

## 📚 Best Practices

### 1. Pre-commit Checks

```bash
# Must run before commit
npm run check
npm test

# Or set up Git Hook
# .git/hooks/pre-commit
#!/bin/sh
npm run check && npm test
```

### 2. Team Collaboration Standards

- 🔄 **Unified tool versions** - Lock versions using package.json
- 📏 **Consistent configuration** - Share configuration files
- 🚫 **Don't skip checks** - Don't commit with `--no-verify`
- 📝 **Fix warnings promptly** - Don't accumulate technical debt

### 3. Performance Optimization

```bash
# Cache ESLint results
npx eslint --cache src/

# Only check changed files
git diff --name-only --cached | xargs npx eslint
```

### 4. IDE Configuration Sync

Create `.vscode/settings.json` to ensure team uses consistent IDE configuration:

```json
{
  "editor.formatOnSave": true,
  "editor.formatOnPaste": true,
  "eslint.validate": ["typescript"],
  "typescript.suggest.autoImports": true
}
```

---

## 🎯 Summary

Through a comprehensive code quality toolchain, the project achieves:

- ✅ **Consistent code style** - Prettier automatic formatting
- ✅ **High-quality code** - ESLint rule checking  
- ✅ **Type safety** - TypeScript strict mode
- ✅ **Automated checks** - Git hooks and CI/CD integration
- ✅ **Team collaboration** - Unified development environment configuration

These tools ensure long-term maintainability and high-quality standards for the codebase.