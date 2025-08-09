import * as fs from 'fs';

// 类型定义
interface MockLocalStorage {
    data: Record<string, string>;
    length: number;
    key(index: number): string | null;
    setItem(key: string, value: string): void;
    getItem(key: string): string | null;
    removeItem(key: string): void;
    clear(): void;
    hasOwnProperty(key: string): boolean;
}

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

// 扩展global类型
declare global {
    namespace NodeJS {
        interface Global {
            localStorage?: MockLocalStorage;
            window?: {
                localStorage: MockLocalStorage;
                store?: LocalStorageEnhanced;
            };
        }
    }
}

describe('localStorage增强库测试', () => {
    let originalLocalStorage: any;
    let mockLocalStorage: MockLocalStorage;
    let store: LocalStorageEnhanced;

    beforeEach(() => {
        originalLocalStorage = global.localStorage;
        mockLocalStorage = {
            data: {},
            get length(): number {
                return Object.keys(this.data).length;
            },
            key: function (index: number): string | null {
                const keys = Object.keys(this.data);
                return keys[index] || null;
            },
            setItem: function (key: string, value: string): void {
                this.data[key] = value === null ? '' : String(value);
            },
            getItem: function (key: string): string | null {
                return key in this.data ? this.data[key] : null;
            },
            removeItem: function (key: string): void {
                delete this.data[key];
            },
            clear: function (): void {
                this.data = {};
            },
            hasOwnProperty: function (key: string): boolean {
                return key in this.data;
            },
        };

        // 设置全局环境
        global.localStorage = mockLocalStorage;
        (global as any).window = {
            localStorage: mockLocalStorage,
        };

        // 重新加载store模块
        const storeCode = fs.readFileSync('./dist/store.js', 'utf8');

        // 创建一个函数来执行store代码，提供exports对象
        const exports = {};
        const executeStoreCode = new Function('window', 'global', 'exports', storeCode);
        executeStoreCode((global as any).window, global, exports);

        // 获取store实例
        store = (global as any).window.store;
    });

    afterEach(() => {
        if (originalLocalStorage) {
            global.localStorage = originalLocalStorage;
        }
        if ((global as any).window) {
            delete (global as any).window;
        }
    });

    describe('工具函数测试', () => {
        it('应该正确处理各种数据类型', () => {
            // 测试基础功能，通过实际调用API来验证类型处理
            store.setItem('numberTest', 123);
            store.setItem('stringTest', 'hello');
            store.setItem('boolTest', true);
            store.setItem('arrayTest', [1, 2, 3]);
            store.setItem('objectTest', { key: 'value' });

            expect(mockLocalStorage.getItem('numberTest')).toBe('123');
            expect(mockLocalStorage.getItem('stringTest')).toBe('hello');
            expect(mockLocalStorage.getItem('boolTest')).toBe('true');
            expect(mockLocalStorage.getItem('arrayTest')).toBe('[1,2,3]');
            expect(mockLocalStorage.getItem('objectTest')).toBe('{"key":"value"}');
        });
    });

    describe('setItem方法测试', () => {
        it('应该能设置字符串键值对', () => {
            store.setItem('testKey', 'testValue');
            expect(mockLocalStorage.getItem('testKey')).toBe('testValue');
        });

        it('应该能设置数字值', () => {
            store.setItem('numberKey', 123);
            expect(mockLocalStorage.getItem('numberKey')).toBe('123');
        });

        it('应该能设置布尔值', () => {
            store.setItem('boolKey', true);
            expect(mockLocalStorage.getItem('boolKey')).toBe('true');
        });

        it('应该能设置对象（JSON序列化）', () => {
            const testObj = { name: 'test', age: 25 };
            store.setItem('objKey', testObj);
            expect(mockLocalStorage.getItem('objKey')).toBe('{"name":"test","age":25}');
        });

        it('应该能设置数组（JSON序列化）', () => {
            const testArr = [1, 2, 3];
            store.setItem('arrKey', testArr);
            expect(mockLocalStorage.getItem('arrKey')).toBe('[1,2,3]');
        });

        it('应该正确处理null/undefined/NaN值', () => {
            store.setItem('nullKey', null);
            store.setItem('undefinedKey', undefined);
            store.setItem('nanKey', NaN);

            expect(mockLocalStorage.getItem('nullKey')).toBe('');
            expect(mockLocalStorage.getItem('undefinedKey')).toBe('');
            expect(mockLocalStorage.getItem('nanKey')).toBe('');
        });

        it('应该支持数组形式的key（批量设置）', () => {
            const keys = ['key1', 'key2', 'key3'];
            const values = ['value1', 'value2', 'value3'];

            store.setItem(keys, values);

            expect(mockLocalStorage.getItem('key1')).toBe('value1');
            expect(mockLocalStorage.getItem('key2')).toBe('value2');
            expect(mockLocalStorage.getItem('key3')).toBe('value3');
        });

        it('应该支持数组key配合单个value（所有key设置相同值）', () => {
            const keys = ['sameKey1', 'sameKey2', 'sameKey3'];
            const value = 'sameValue';

            store.setItem(keys, value);

            keys.forEach(key => {
                expect(mockLocalStorage.getItem(key)).toBe('sameValue');
            });
        });

        it('应该支持对象形式的key（解构赋值）', () => {
            const keyValueObj = {
                objKey1: 'objValue1',
                objKey2: 42,
                objKey3: { nested: 'object' },
            };

            store.setItem(keyValueObj);

            expect(mockLocalStorage.getItem('objKey1')).toBe('objValue1');
            expect(mockLocalStorage.getItem('objKey2')).toBe('42');
            expect(mockLocalStorage.getItem('objKey3')).toBe('{"nested":"object"}');
        });

        it('深度遍历模式应该正确序列化复杂对象', () => {
            const complexObj = {
                simple: 'value',
                nested: { deep: 'nested value' },
                array: [1, 2, { in_array: 'test' }],
            };

            store.setItem(complexObj, null, true);

            expect(mockLocalStorage.getItem('simple')).toBe('value');
            expect(mockLocalStorage.getItem('nested')).toBe('{"deep":"nested value"}');
            expect(mockLocalStorage.getItem('array')).toBe('[1,2,{"in_array":"test"}]');
        });
    });

    describe('getItem方法测试', () => {
        beforeEach(() => {
            mockLocalStorage.setItem('stringKey', 'testValue');
            mockLocalStorage.setItem('numberKey', '123');
            mockLocalStorage.setItem('boolKey', 'true');
            mockLocalStorage.setItem('objKey', '{"name":"test","age":25}');
            mockLocalStorage.setItem('arrKey', '[1,2,3]');
        });

        it('应该能获取字符串值', () => {
            const result = store.getItem('stringKey');
            expect(result).toBe('testValue');
        });

        it('应该支持数组形式的key（批量获取）', () => {
            const keys = ['stringKey', 'numberKey', 'boolKey'];
            const result = store.getItem(keys);

            expect(Array.isArray(result)).toBe(true);
            expect(result).toEqual(['testValue', '123', 'true']);
        });

        it('应该支持对象形式的key（结构化获取）', () => {
            const keyStructure = {
                str: 'stringKey',
                num: 'numberKey',
                bool: 'boolKey',
            };

            const result = store.getItem(keyStructure);

            expect(typeof result).toBe('object');
            expect(result.str).toBe('testValue');
            expect(result.num).toBe('123');
            expect(result.bool).toBe('true');
        });

        it('获取不存在的key应该返回null', () => {
            const result = store.getItem('nonExistentKey');
            expect(result).toBeNull();
        });
    });

    describe('getItems方法测试', () => {
        it('应该返回所有存储的项目', () => {
            mockLocalStorage.setItem('key1', 'value1');
            mockLocalStorage.setItem('key2', 'value2');
            mockLocalStorage.setItem('key3', 'value3');

            const result = store.getItems();

            expect(typeof result).toBe('object');
            expect(result.key1).toBe('value1');
            expect(result.key2).toBe('value2');
            expect(result.key3).toBe('value3');
        });

        it('空存储时应该返回空对象', () => {
            const result = store.getItems();
            expect(result).toEqual({});
        });
    });

    describe('getKeys方法测试', () => {
        it('应该返回所有存储的key', () => {
            mockLocalStorage.setItem('key1', 'value1');
            mockLocalStorage.setItem('key2', 'value2');
            mockLocalStorage.setItem('key3', 'value3');

            const result = store.getKeys();

            expect(Array.isArray(result)).toBe(true);
            expect(result.sort()).toEqual(['key1', 'key2', 'key3']);
        });

        it('空存储时应该返回空数组', () => {
            const result = store.getKeys();
            expect(result).toEqual([]);
        });
    });

    describe('removeItem方法测试', () => {
        beforeEach(() => {
            mockLocalStorage.setItem('removeKey1', 'value1');
            mockLocalStorage.setItem('removeKey2', 'value2');
            mockLocalStorage.setItem('removeKey3', 'value3');
            mockLocalStorage.setItem('keepKey', 'keepValue');
        });

        it('应该能删除单个key', () => {
            store.removeItem('removeKey1');

            expect(mockLocalStorage.getItem('removeKey1')).toBeNull();
            expect(mockLocalStorage.getItem('keepKey')).toBe('keepValue');
        });

        it('应该支持数组形式批量删除', () => {
            store.removeItem(['removeKey1', 'removeKey2']);

            expect(mockLocalStorage.getItem('removeKey1')).toBeNull();
            expect(mockLocalStorage.getItem('removeKey2')).toBeNull();
            expect(mockLocalStorage.getItem('removeKey3')).toBe('value3');
            expect(mockLocalStorage.getItem('keepKey')).toBe('keepValue');
        });

        it('应该支持对象形式批量删除', () => {
            store.removeItem({
                removeKey1: 'any',
                removeKey2: 'value',
            });

            expect(mockLocalStorage.getItem('removeKey1')).toBeNull();
            expect(mockLocalStorage.getItem('removeKey2')).toBeNull();
            expect(mockLocalStorage.getItem('removeKey3')).toBe('value3');
        });

        it('删除不存在的key不应该报错', () => {
            expect(() => {
                store.removeItem('nonExistentKey');
            }).not.toThrow();
        });
    });

    describe('clear方法测试', () => {
        it('应该清除所有存储的数据', () => {
            mockLocalStorage.setItem('key1', 'value1');
            mockLocalStorage.setItem('key2', 'value2');
            mockLocalStorage.setItem('key3', 'value3');

            store.clear();

            expect(mockLocalStorage.getItem('key1')).toBeNull();
            expect(mockLocalStorage.getItem('key2')).toBeNull();
            expect(mockLocalStorage.getItem('key3')).toBeNull();
            expect(Object.keys(mockLocalStorage.data).length).toBe(0);
        });

        it('对空存储调用clear不应该报错', () => {
            expect(() => {
                store.clear();
            }).not.toThrow();
        });
    });

    describe('hasKey方法测试', () => {
        beforeEach(() => {
            mockLocalStorage.setItem('existingKey', 'value');
        });

        it('存在的key应该返回true', () => {
            const result = store.hasKey('existingKey');
            expect(result).toBe(true);
        });

        it('不存在的key应该返回false', () => {
            const result = store.hasKey('nonExistentKey');
            expect(result).toBe(false);
        });

        it('undefined参数应该返回false', () => {
            const result = store.hasKey(undefined);
            expect(result).toBe(false);
        });

        it('null参数应该返回false', () => {
            const result = store.hasKey(null);
            expect(result).toBe(false);
        });
    });

    describe('边界情况和错误处理测试', () => {
        it('应该处理localStorage不支持的情况', () => {
            const originalConsoleLog = console.log;
            let loggedMessage = '';
            console.log = jest.fn((msg: string) => {
                loggedMessage = msg;
            });

            // 创建没有localStorage的环境
            const noStorageWindow = {};
            let storeCode = fs.readFileSync('./dist/store.js', 'utf8');

            // 修改代码中的localStorage检测逻辑，移除fallback
            storeCode = storeCode.replace(
                /const _store = .*?;/,
                'const _store = root.localStorage || null;'
            );

            const exports = {};
            const executeStoreCode = new Function('window', 'global', 'exports', storeCode);
            executeStoreCode(noStorageWindow, global, exports);

            expect(loggedMessage).toBe('不支持localStorage');
            expect((noStorageWindow as any).store).toBeUndefined();

            console.log = originalConsoleLog;
        });

        it('setItem使用无效key类型应该输出错误信息', () => {
            const originalConsoleLog = console.log;
            let loggedMessage = '';
            console.log = jest.fn((msg: string) => {
                loggedMessage = msg;
            });

            (store as any).setItem(123, 'value');

            expect(loggedMessage).toBe('key只能为字符串或者数组');

            console.log = originalConsoleLog;
        });

        it('getItem使用无效key类型应该输出错误信息', () => {
            const originalConsoleLog = console.log;
            let loggedMessage = '';
            console.log = jest.fn((msg: string) => {
                loggedMessage = msg;
            });

            (store as any).getItem(123);

            expect(loggedMessage).toBe('key只能为字符串、数组和json对象');

            console.log = originalConsoleLog;
        });

        it('应该处理循环引用的对象', () => {
            const circularObj: any = { name: 'test' };
            circularObj.self = circularObj;

            expect(() => {
                store.setItem('circularKey', circularObj);
            }).toThrow();
        });

        it('应该处理特殊字符的key', () => {
            const specialKeys = [
                'key with spaces',
                'key-with-dashes',
                'key_with_underscores',
                'key.with.dots',
            ];

            specialKeys.forEach(key => {
                store.setItem(key, 'value');
                expect(mockLocalStorage.getItem(key)).toBe('value');
            });
        });
    });

    describe('性能和集成测试', () => {
        it('应该能处理大量数据的批量操作', () => {
            const keys: string[] = [];
            const values: string[] = [];

            for (let i = 0; i < 100; i++) {
                keys.push(`key${i}`);
                values.push(`value${i}`);
            }

            store.setItem(keys, values);

            const result = store.getItem(keys) as string[];
            expect(result.length).toBe(100);
            expect(result[0]).toBe('value0');
            expect(result[99]).toBe('value99');

            store.removeItem(keys);

            keys.forEach(key => {
                expect(mockLocalStorage.getItem(key)).toBeNull();
            });
        });

        it('复杂的混合操作测试', () => {
            // 设置各种类型的数据
            store.setItem({
                string: 'hello',
                number: 42,
                boolean: true,
                array: [1, 2, 3],
                object: { nested: 'value' },
            });

            // 验证数据
            expect(store.hasKey('string')).toBe(true);
            expect(store.hasKey('number')).toBe(true);

            // 获取所有数据
            const allItems = store.getItems();
            expect(Object.keys(allItems).length).toBe(5);

            // 获取所有keys
            const allKeys = store.getKeys();
            expect(allKeys.length).toBe(5);

            // 批量删除部分数据
            store.removeItem(['string', 'number']);

            expect(store.hasKey('string')).toBe(false);
            expect(store.hasKey('boolean')).toBe(true);

            // 清除剩余数据
            store.clear();

            expect(store.getKeys().length).toBe(0);
        });
    });
});
