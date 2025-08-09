# localStorage Enhanced Library (local-storage-js)

[![npm version](https://img.shields.io/npm/v/local-storage-js.svg)](https://www.npmjs.com/package/local-storage-js)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![Test Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen.svg)](https://github.com/2ue/storejs)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> A comprehensive enhancement of `localStorage` with support for batch operations, complex data types, and TypeScript type safety. Provides a more powerful and flexible local storage solution.

## ✨ Features

- 🚀 **Fully Compatible** - Maintains native localStorage API semantics
- 📦 **Batch Operations** - Supports array and object-based batch store/retrieve/delete
- 🔒 **Type Safe** - Complete TypeScript type definitions
- 🎯 **Smart Serialization** - Automatically handles complex data types
- 🧪 **Comprehensive Testing** - 36 test cases with 100% test coverage
- 📝 **Code Quality** - ESLint + Prettier ensures code quality
- 🔧 **Zero Dependencies** - Lightweight with no external dependencies

## 📦 Installation

```bash
npm install --save local-storage-js
```

## 🚀 Quick Start

### Recommended Usage - ES6/TypeScript

```typescript
// Recommended: Explicit import (best practice)
import store from 'local-storage-js';

store.setItem('user', { name: 'John', age: 25 });
const user = store.getItem('user'); // string | null
console.log(user); // "{\"name\":\"John\",\"age\":25}"
```

### Recommended Usage - CommonJS

```javascript
// Recommended: Explicit import (best practice)
const store = require('local-storage-js').default;

store.setItem('config', { theme: 'dark', lang: 'en-US' });
const config = store.getItem('config');
console.log(config); // "{\"theme\":\"dark\",\"lang\":\"en-US\"}"
```

> **⚠️ CommonJS Usage Limitations**  
> Since localStorage is a browser API, CommonJS is mainly applicable for:
> - Electron applications (renderer process)
> - Client-side parts of server-side rendering projects
> - Mixed projects using build tools  
> - Node.js environments with localStorage simulation (e.g., using jsdom)

### Browser Environment - Script Tag

```html
<!-- Auto-register global store object in browser -->
<script src="./node_modules/local-storage-js/dist/store.js"></script>
<script>
    // Direct use of global store in browser environment
    store.setItem('data', [1, 2, 3]);
    console.log(store.getItem('data')); // "[1,2,3]"
</script>
```

### Other Usage Methods

```typescript
// Method 1: Named import (for renaming)
import localStore from 'local-storage-js';
localStore.setItem('key', 'value');

// Method 2: Complete CommonJS form
const { default: store } = require('local-storage-js');
store.setItem('key', 'value');
```

### CDN Usage

```html
<!-- Via CDN, auto-register global store object -->
<script src="https://unpkg.com/local-storage-js@latest/dist/store.js"></script>
<script>
    // CDN method can directly use global store
    store.setItem('data', { message: 'Hello from CDN!' });
    console.log(store.getItem('data'));
</script>

<!-- Or via ES Module CDN -->
<script type="module">
    // Side-effect import, suitable for CDN scenarios
    import 'https://unpkg.com/local-storage-js@latest/dist/store.js';
    
    // Global store automatically available
    store.setItem('moduleData', [1, 2, 3]);
    console.log(store.getItem('moduleData'));
</script>
```

### ⚠️ Important Notes

```typescript
// ❌ Side-effect imports not recommended in Node.js/build tool projects
// import 'local-storage-js'; // Registers global store, but not best practice
// store.setItem('key', 'value'); // Relies on global variable, hard to trace source

// ✅ Recommended explicit import (traceable, type-safe)
import store from 'local-storage-js';
store.setItem('key', 'value');
```

## 📚 API Documentation

### setItem(key, value, deepTraversal?)

Enhanced `localStorage.setItem` supporting multiple data types and batch operations.

#### Parameters

- `key`: `string | string[] | Record<string, any>` - Storage key
- `value`: `any` - Storage value (optional when key is object)
- `deepTraversal`: `boolean` - Enable deep traversal (default false)

#### Usage Examples

```typescript
// Import library
import store from 'local-storage-js';

// Basic usage
store.setItem('name', 'John');
store.setItem('age', 25);
store.setItem('user', { name: 'John', hobbies: ['swimming', 'reading'] });

// Batch setting - array form
store.setItem(['key1', 'key2', 'key3'], ['value1', 'value2', 'value3']);
store.setItem(['theme', 'lang'], 'default'); // Set same value for all keys

// Batch setting - object form
store.setItem({
    theme: 'dark',
    lang: 'en-US',
    version: '1.0.0'
});

// Deep traversal mode
store.setItem({
    user: { name: 'John' },
    config: { theme: 'dark' }
}, null, true);
```

### getItem(key)

Enhanced `localStorage.getItem` supporting batch retrieval and structured data return.

#### Parameters

- `key`: `string | string[] | Record<string, string>` - Key(s) to retrieve

#### Return Values

- Single string key: returns `string | null`
- Array keys: returns `(string | null)[]`
- Object keys: returns corresponding structured object

#### Usage Examples

```typescript
// Import library
import store from 'local-storage-js';

// Single retrieval
const name = store.getItem('name'); // string | null

// Batch retrieval - array form
const values = store.getItem(['name', 'age', 'city']); 
// Returns: ['John', '25', null]

// Structured retrieval - object form
const user = store.getItem({
    username: 'name',
    userAge: 'age',
    city: 'city'
});
// Returns: { username: 'John', userAge: '25', city: null }
```

### getItems()

Get all stored items.

```typescript
import store from 'local-storage-js';

const allItems = store.getItems();
// Returns: { name: 'John', age: '25', theme: 'dark' }
```

### getKeys()

Get all storage keys.

```typescript
import store from 'local-storage-js';

const allKeys = store.getKeys();
// Returns: ['name', 'age', 'theme']
```

### removeItem(key)

Enhanced `localStorage.removeItem` supporting batch deletion.

#### Usage Examples

```typescript
import store from 'local-storage-js';

// Single deletion
store.removeItem('name');

// Batch deletion - array form
store.removeItem(['key1', 'key2', 'key3']);

// Batch deletion - object form (only delete object keys, ignore values)
store.removeItem({
    key1: 'anyValue',
    key2: 'ignored'
});
```

### clear()

Clear all stored items.

```typescript
import store from 'local-storage-js';

store.clear();
```

### hasKey(key)

Check if specified key exists.

```typescript
import store from 'local-storage-js';

const exists = store.hasKey('name'); // boolean
```

## 🛠️ Development

### Environment Requirements

- Node.js >= 14
- TypeScript >= 4.0

### Development Commands

```bash
# Install dependencies
npm install

# Development build
npm run build

# Run tests
npm test

# Test coverage
npm run test:coverage

# Code formatting
npm run format

# Code quality check
npm run lint

# Auto fix
npm run fix

# Complete check (format + quality)
npm run check
```

### Project Structure

```
local-storage-js/
├── src/                    # Source code
│   └── store.ts           # Main implementation file
├── test/                  # Test files
│   └── store.test.ts      # Complete test suite
├── dist/                  # Build output
│   ├── store.js           # Compiled JavaScript
│   └── store.d.ts         # TypeScript type definitions
├── docs/                  # Documentation
│   ├── typescript.md      # TypeScript usage guide
│   ├── development.md     # Development guide
│   └── code-quality.md    # Code quality documentation
├── .prettierrc.json       # Prettier configuration
├── eslint.config.js       # ESLint configuration
├── tsconfig.json          # TypeScript configuration
└── jest.config.json       # Jest test configuration
```

## 📊 Data Type Handling

### Automatic Serialization

The library automatically handles serialization of different data types:

```typescript
import store from 'local-storage-js';

store.setItem('string', 'hello');      // Direct storage
store.setItem('number', 42);           // Convert to '42'
store.setItem('boolean', true);        // Convert to 'true'
store.setItem('array', [1, 2, 3]);     // JSON.stringify
store.setItem('object', {a: 1});       // JSON.stringify
store.setItem('null', null);           // Convert to empty string
store.setItem('undefined', undefined); // Convert to empty string
store.setItem('nan', NaN);             // Convert to empty string
```

### Special Value Handling

- `null`, `undefined`, `NaN` are converted to empty string `''`
- Complex objects are serialized via `JSON.stringify`
- Circular reference objects will throw an error

## 🔧 TypeScript Support

Complete TypeScript type definitions:

```typescript
interface LocalStorageEnhanced {
    setItem<T = any>(key: string, value: T): void;
    setItem<T = any>(keys: string[], values: T[] | T, deepTraversal?: boolean): void;
    setItem<T = any>(keyValueMap: Record<string, T>, _?: null, deepTraversal?: boolean): void;
    
    getItem(key: string): string | null;
    getItem(keys: string[]): (string | null)[];
    getItem<T = Record<string, string | null>>(keyStructure: Record<string, string>): T;
    
    getItems(): Record<string, string | null>;
    getKeys(): string[];
    
    removeItem(key: string): void;
    removeItem(keys: string[]): void;
    removeItem(keyValueMap: Record<string, any>): void;
    
    clear(): void;
    hasKey(key: string | null | undefined): boolean;
}

declare global {
    var store: LocalStorageEnhanced;
}
```

## 📝 Changelog

### v0.0.8 (Latest)

- 🔄 **Major Refactor**: Complete migration to TypeScript
- 🧪 **Test Enhancement**: Added 36 comprehensive test cases with 100% coverage
- 🔧 **Development Tools**: Integrated ESLint + Prettier code quality tools
- 🐛 **Bug Fixes**: Fixed multiple core logic errors
- 📚 **Documentation Update**: Enhanced TypeScript type definitions and usage examples
- ⚡ **Performance Optimization**: Optimized type detection and data processing logic

## 🤝 Contributing

Issues and Pull Requests are welcome!

### Contribution Steps

1. Fork the project
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Development Standards

- Follow existing code style
- Add corresponding test cases
- Ensure all tests pass
- Run `npm run check` to ensure code quality

## 📄 License

[MIT License](https://opensource.org/licenses/MIT)

## ⚠️ Compatibility Notes

- This library does not provide compatibility handling for environments that don't support localStorage
- Please ensure the runtime environment supports localStorage before use
- Stored data will be converted to string format
- Large data storage may impact performance, use judiciously

## 📞 Support

- 🐛 Bug Reports: [GitHub Issues](https://github.com/2ue/storejs/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/2ue/storejs/discussions)
- 📧 Email Contact: jie746635835@163.com

---

If this library helps you, please give it a ⭐️ Star!