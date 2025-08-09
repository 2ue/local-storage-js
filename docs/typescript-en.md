# TypeScript Type Definitions

This document provides detailed information about the TypeScript type definitions and usage methods for the localStorage enhancement library.

## Core Interfaces

### LocalStorageEnhanced

The main library interface containing all enhanced localStorage methods:

```typescript
interface LocalStorageEnhanced {
    // setItem method overloads
    setItem<T = any>(key: string, value: T): void;
    setItem<T = any>(keys: string[], values: T[] | T, deepTraversal?: boolean): void;
    setItem<T = any>(keyValueMap: Record<string, T>, _?: null, deepTraversal?: boolean): void;
    
    // getItem method overloads
    getItem(key: string): string | null;
    getItem(keys: string[]): (string | null)[];
    getItem<T = Record<string, string | null>>(keyStructure: Record<string, string>): T;
    
    // Other methods
    getItems(): Record<string, string | null>;
    getKeys(): string[];
    
    // removeItem method overloads
    removeItem(key: string): void;
    removeItem(keys: string[]): void;
    removeItem(keyValueMap: Record<string, any>): void;
    
    clear(): void;
    hasKey(key: string | null | undefined): boolean;
}
```

### Internal Utility Types

```typescript
type DataType = 
    | 'string' 
    | 'number' 
    | 'boolean' 
    | 'object' 
    | 'array' 
    | 'null' 
    | 'undefined' 
    | 'NaN' 
    | 'function' 
    | 'date';

interface UtilityFunctions {
    getType(para: any): DataType;
    map(para: any, fn: (keyOrIndex: string | number, value: any, original: any) => void): void;
    filterValue(val: any): string;
}
```

## Global Type Declarations

The library automatically declares the `store` object in the global scope:

```typescript
declare global {
    interface Window {
        store: LocalStorageEnhanced;
    }
    
    var store: LocalStorageEnhanced;
}
```

## Usage Examples

### Basic Type-Safe Usage

```typescript
// Recommended: Explicit import
import store from 'local-storage-js';

// Type inference examples
const name: string | null = store.getItem('name');
const keys: string[] = store.getKeys();
const allItems: Record<string, string | null> = store.getItems();
const exists: boolean = store.hasKey('someKey');

// Generic usage
interface User {
    name: string;
    age: number;
}

// Although stored as serialized string, type system knows our intent
store.setItem<User>('user', { name: 'John', age: 25 });
```

### Batch Operations Type Safety

```typescript
// Recommended: Explicit import
import store from 'local-storage-js';

// Array batch operations
const keys: string[] = ['key1', 'key2', 'key3'];
const values: string[] = ['value1', 'value2', 'value3'];
store.setItem(keys, values);

const results: (string | null)[] = store.getItem(keys);

// Object batch operations
const keyValueMap: Record<string, any> = {
    name: 'John',
    age: 25,
    config: { theme: 'dark' }
};
store.setItem(keyValueMap);

// Structured retrieval
const userStructure: Record<string, string> = {
    username: 'name',
    userAge: 'age'
};
const user = store.getItem(userStructure);
// user type: Record<string, string | null>
```

### Method Overload Details

#### setItem Method Overloads

```typescript
// Recommended: Explicit import
import store from 'local-storage-js';

// Overload 1: Single key-value pair
store.setItem('key', 'value');
store.setItem('user', { name: 'John' });

// Overload 2: Array keys + values
store.setItem(['k1', 'k2'], ['v1', 'v2']);
store.setItem(['k1', 'k2'], 'sameValue');
store.setItem(['k1', 'k2'], ['v1', 'v2'], true); // Deep traversal

// Overload 3: Object key-value mapping
store.setItem({ key1: 'value1', key2: 'value2' });
store.setItem({ key1: 'value1', key2: 'value2' }, null, true); // Deep traversal
```

#### getItem Method Overloads

```typescript
// Recommended: Explicit import
import store from 'local-storage-js';

// Overload 1: Single key
const value: string | null = store.getItem('key');

// Overload 2: Array keys
const values: (string | null)[] = store.getItem(['k1', 'k2', 'k3']);

// Overload 3: Structured retrieval
const structure = { alias1: 'key1', alias2: 'key2' };
const result: Record<string, string | null> = store.getItem(structure);
```

#### removeItem Method Overloads

```typescript
// Recommended: Explicit import
import store from 'local-storage-js';

// Overload 1: Single key
store.removeItem('key');

// Overload 2: Array keys
store.removeItem(['key1', 'key2', 'key3']);

// Overload 3: Object keys (ignore values)
store.removeItem({ key1: 'ignored', key2: 'ignored' });
```

## Type Safety Best Practices

### 1. Using Type Assertions for Type Conversion

```typescript
// Recommended: Explicit import
import store from 'local-storage-js';

interface UserConfig {
    theme: 'light' | 'dark';
    language: string;
}

// Store
const config: UserConfig = { theme: 'dark', language: 'en-US' };
store.setItem('config', config);

// Retrieve and type convert
const rawConfig = store.getItem('config');
if (rawConfig) {
    const parsedConfig = JSON.parse(rawConfig) as UserConfig;
    console.log(parsedConfig.theme); // Type safe
}
```

### 2. Creating Type-Safe Wrapper Functions

```typescript
// Recommended: Explicit import
import store from 'local-storage-js';

function setTypedItem<T>(key: string, value: T): void {
    store.setItem(key, value);
}

function getTypedItem<T>(key: string): T | null {
    const raw = store.getItem(key);
    if (raw === null) return null;
    try {
        return JSON.parse(raw) as T;
    } catch {
        return raw as unknown as T;
    }
}

// Usage
interface Settings {
    notifications: boolean;
    autoSave: boolean;
}

setTypedItem<Settings>('settings', { notifications: true, autoSave: false });
const settings = getTypedItem<Settings>('settings');
```

### 3. Leveraging Union Types for Multiple Scenarios

```typescript
// Recommended: Explicit import
import store from 'local-storage-js';

type StorageKey = 'user' | 'config' | 'preferences';
type StorageValue<K extends StorageKey> = 
    K extends 'user' ? { name: string; id: number } :
    K extends 'config' ? { theme: string; lang: string } :
    K extends 'preferences' ? boolean[] :
    never;

function typedStore<K extends StorageKey>(
    key: K, 
    value: StorageValue<K>
): void {
    store.setItem(key, value);
}

// Type-safe usage
typedStore('user', { name: 'John', id: 123 }); // ✅ Correct
typedStore('config', { theme: 'dark', lang: 'en' }); // ✅ Correct
// typedStore('user', { theme: 'dark' }); // ❌ Type error
```

## IDE Integration

### VS Code IntelliSense

The library provides complete type definitions, VS Code will automatically provide:

- Method signature hints
- Parameter type checking
- Return value type inference
- Error squiggly line marking

### TypeScript Compiler Integration

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

In strict mode, the compiler will:
- Check null value handling
- Verify parameter type matching
- Infer correct return types

## Common Type Errors and Solutions

### 1. Null Value Handling

```typescript
// Recommended: Explicit import
import store from 'local-storage-js';

// ❌ Potential null value error
const name = store.getItem('name');
console.log(name.toUpperCase()); // Type error

// ✅ Correct null value handling
const name = store.getItem('name');
if (name !== null) {
    console.log(name.toUpperCase()); // Type safe
}

// ✅ Using optional chaining operator
const name = store.getItem('name');
console.log(name?.toUpperCase());
```

### 2. Array Type Matching

```typescript
// Recommended: Explicit import
import store from 'local-storage-js';

// ❌ Type mismatch
const keys: string[] = ['k1', 'k2'];
const values: number[] = [1, 2];
store.setItem(keys, values); // Type check passes, but note serialization

// ✅ Clear type intent
const keys: string[] = ['k1', 'k2'];
const values: (string | number)[] = [1, 2];
store.setItem(keys, values);
```

### 3. Generic Usage

```typescript
// Recommended: Explicit import
import store from 'local-storage-js';

// ❌ Missing type information
const data = store.getItem({ user: 'userData' });
// data type: Record<string, string | null>

// ✅ Using generics to specify more precise type
interface UserData {
    user: string;
}
const data = store.getItem<UserData>({ user: 'userData' });
// data type: UserData
```

## Advanced Type Techniques

### Conditional Types

```typescript
type GetItemReturnType<T> = 
    T extends string ? string | null :
    T extends string[] ? (string | null)[] :
    T extends Record<string, string> ? Record<string, string | null> :
    never;
```

### Mapped Types

```typescript
type StorageSchema = {
    user: { name: string; age: number };
    settings: { theme: string; lang: string };
    cache: string[];
};

type StorageKeys = keyof StorageSchema;
type StorageValue<K extends StorageKeys> = StorageSchema[K];
```

These type definitions ensure complete type safety when using the localStorage enhancement library.