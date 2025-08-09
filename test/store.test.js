describe('localStorage增强库测试', function() {
    let originalLocalStorage;
    let mockLocalStorage;

    beforeEach(function() {
        originalLocalStorage = global.localStorage;
        mockLocalStorage = {
            data: {},
            get length() {
                return Object.keys(this.data).length;
            },
            key: function(index) {
                const keys = Object.keys(this.data);
                return keys[index] || null;
            },
            setItem: function(key, value) {
                this.data[key] = value === null ? '' : String(value);
            },
            getItem: function(key) {
                return key in this.data ? this.data[key] : null;
            },
            removeItem: function(key) {
                delete this.data[key];
            },
            clear: function() {
                this.data = {};
            },
            hasOwnProperty: function(key) {
                return key in this.data;
            }
        };
        
        // 设置全局环境
        global.localStorage = mockLocalStorage;
        global.window = { localStorage: mockLocalStorage };
        
        // 重新加载store模块
        delete global.window.store;
        const fs = require('fs');
        const storeCode = fs.readFileSync('./src/store.js', 'utf8');
        
        // 创建一个函数来执行store.js代码
        const executeStoreCode = new Function('window', storeCode);
        executeStoreCode(global.window);
    });

    afterEach(function() {
        global.localStorage = originalLocalStorage;
        delete global.window;
    });

    describe('工具函数测试', function() {
        it('应该正确处理各种数据类型', function() {
            // 测试基础功能，通过实际调用API来验证类型处理
            global.window.store.setItem('numberTest', 123);
            global.window.store.setItem('stringTest', 'hello');
            global.window.store.setItem('boolTest', true);
            global.window.store.setItem('arrayTest', [1, 2, 3]);
            global.window.store.setItem('objectTest', { key: 'value' });
            
            expect(mockLocalStorage.getItem('numberTest')).toBe('123');
            expect(mockLocalStorage.getItem('stringTest')).toBe('hello');
            expect(mockLocalStorage.getItem('boolTest')).toBe('true');
            expect(mockLocalStorage.getItem('arrayTest')).toBe('[1,2,3]');
            expect(mockLocalStorage.getItem('objectTest')).toBe('{"key":"value"}');
        });
    });

    describe('setItem方法测试', function() {
        it('应该能设置字符串键值对', function() {
            global.window.store.setItem('testKey', 'testValue');
            expect(mockLocalStorage.getItem('testKey')).toBe('testValue');
        });

        it('应该能设置数字值', function() {
            global.window.store.setItem('numberKey', 123);
            expect(mockLocalStorage.getItem('numberKey')).toBe('123');
        });

        it('应该能设置布尔值', function() {
            global.window.store.setItem('boolKey', true);
            expect(mockLocalStorage.getItem('boolKey')).toBe('true');
        });

        it('应该能设置对象（JSON序列化）', function() {
            const testObj = { name: 'test', age: 25 };
            global.window.store.setItem('objKey', testObj);
            expect(mockLocalStorage.getItem('objKey')).toBe('{"name":"test","age":25}');
        });

        it('应该能设置数组（JSON序列化）', function() {
            const testArr = [1, 2, 3];
            global.window.store.setItem('arrKey', testArr);
            expect(mockLocalStorage.getItem('arrKey')).toBe('[1,2,3]');
        });

        it('应该正确处理null/undefined/NaN值', function() {
            global.window.store.setItem('nullKey', null);
            global.window.store.setItem('undefinedKey', undefined);
            global.window.store.setItem('nanKey', NaN);
            
            expect(mockLocalStorage.getItem('nullKey')).toBe('');
            expect(mockLocalStorage.getItem('undefinedKey')).toBe('');
            expect(mockLocalStorage.getItem('nanKey')).toBe('');
        });

        it('应该支持数组形式的key（批量设置）', function() {
            const keys = ['key1', 'key2', 'key3'];
            const values = ['value1', 'value2', 'value3'];
            
            global.window.store.setItem(keys, values);
            
            expect(mockLocalStorage.getItem('key1')).toBe('value1');
            expect(mockLocalStorage.getItem('key2')).toBe('value2');
            expect(mockLocalStorage.getItem('key3')).toBe('value3');
        });

        it('应该支持数组key配合单个value（所有key设置相同值）', function() {
            const keys = ['sameKey1', 'sameKey2', 'sameKey3'];
            const value = 'sameValue';
            
            global.window.store.setItem(keys, value);
            
            keys.forEach(key => {
                expect(mockLocalStorage.getItem(key)).toBe('sameValue');
            });
        });

        it('应该支持对象形式的key（解构赋值）', function() {
            const keyValueObj = {
                'objKey1': 'objValue1',
                'objKey2': 42,
                'objKey3': { nested: 'object' }
            };
            
            global.window.store.setItem(keyValueObj);
            
            expect(mockLocalStorage.getItem('objKey1')).toBe('objValue1');
            expect(mockLocalStorage.getItem('objKey2')).toBe('42');
            expect(mockLocalStorage.getItem('objKey3')).toBe('{"nested":"object"}');
        });

        it('深度遍历模式应该正确序列化复杂对象', function() {
            const complexObj = {
                simple: 'value',
                nested: { deep: 'nested value' },
                array: [1, 2, { in_array: 'test' }]
            };
            
            global.window.store.setItem(complexObj, null, true);
            
            expect(mockLocalStorage.getItem('simple')).toBe('value');
            expect(mockLocalStorage.getItem('nested')).toBe('{"deep":"nested value"}');
            expect(mockLocalStorage.getItem('array')).toBe('[1,2,{"in_array":"test"}]');
        });
    });

    describe('getItem方法测试', function() {
        beforeEach(function() {
            mockLocalStorage.setItem('stringKey', 'testValue');
            mockLocalStorage.setItem('numberKey', '123');
            mockLocalStorage.setItem('boolKey', 'true');
            mockLocalStorage.setItem('objKey', '{"name":"test","age":25}');
            mockLocalStorage.setItem('arrKey', '[1,2,3]');
        });

        it('应该能获取字符串值', function() {
            const result = global.window.store.getItem('stringKey');
            expect(result).toBe('testValue');
        });

        it('应该支持数组形式的key（批量获取）', function() {
            const keys = ['stringKey', 'numberKey', 'boolKey'];
            const result = global.window.store.getItem(keys);
            
            expect(Array.isArray(result)).toBe(true);
            expect(result).toEqual(['testValue', '123', 'true']);
        });

        it('应该支持对象形式的key（结构化获取）', function() {
            const keyStructure = {
                str: 'stringKey',
                num: 'numberKey',
                bool: 'boolKey'
            };
            
            const result = global.window.store.getItem(keyStructure);
            
            expect(typeof result).toBe('object');
            expect(result.str).toBe('testValue');
            expect(result.num).toBe('123');
            expect(result.bool).toBe('true');
        });

        it('获取不存在的key应该返回null', function() {
            const result = global.window.store.getItem('nonExistentKey');
            expect(result).toBeNull();
        });
    });

    describe('getItems方法测试', function() {
        it('应该返回所有存储的项目', function() {
            mockLocalStorage.setItem('key1', 'value1');
            mockLocalStorage.setItem('key2', 'value2');
            mockLocalStorage.setItem('key3', 'value3');
            
            const result = global.window.store.getItems();
            
            expect(typeof result).toBe('object');
            expect(result.key1).toBe('value1');
            expect(result.key2).toBe('value2');
            expect(result.key3).toBe('value3');
        });

        it('空存储时应该返回空对象', function() {
            const result = global.window.store.getItems();
            expect(result).toEqual({});
        });
    });

    describe('getKeys方法测试', function() {
        it('应该返回所有存储的key', function() {
            mockLocalStorage.setItem('key1', 'value1');
            mockLocalStorage.setItem('key2', 'value2');
            mockLocalStorage.setItem('key3', 'value3');
            
            const result = global.window.store.getKeys();
            
            expect(Array.isArray(result)).toBe(true);
            expect(result.sort()).toEqual(['key1', 'key2', 'key3']);
        });

        it('空存储时应该返回空数组', function() {
            const result = global.window.store.getKeys();
            expect(result).toEqual([]);
        });
    });

    describe('removeItem方法测试', function() {
        beforeEach(function() {
            mockLocalStorage.setItem('removeKey1', 'value1');
            mockLocalStorage.setItem('removeKey2', 'value2');
            mockLocalStorage.setItem('removeKey3', 'value3');
            mockLocalStorage.setItem('keepKey', 'keepValue');
        });

        it('应该能删除单个key', function() {
            global.window.store.removeItem('removeKey1');
            
            expect(mockLocalStorage.getItem('removeKey1')).toBeNull();
            expect(mockLocalStorage.getItem('keepKey')).toBe('keepValue');
        });

        it('应该支持数组形式批量删除', function() {
            global.window.store.removeItem(['removeKey1', 'removeKey2']);
            
            expect(mockLocalStorage.getItem('removeKey1')).toBeNull();
            expect(mockLocalStorage.getItem('removeKey2')).toBeNull();
            expect(mockLocalStorage.getItem('removeKey3')).toBe('value3');
            expect(mockLocalStorage.getItem('keepKey')).toBe('keepValue');
        });

        it('应该支持对象形式批量删除', function() {
            global.window.store.removeItem({
                'removeKey1': 'any',
                'removeKey2': 'value'
            });
            
            expect(mockLocalStorage.getItem('removeKey1')).toBeNull();
            expect(mockLocalStorage.getItem('removeKey2')).toBeNull();
            expect(mockLocalStorage.getItem('removeKey3')).toBe('value3');
        });

        it('删除不存在的key不应该报错', function() {
            expect(() => {
                global.window.store.removeItem('nonExistentKey');
            }).not.toThrow();
        });
    });

    describe('clear方法测试', function() {
        it('应该清除所有存储的数据', function() {
            mockLocalStorage.setItem('key1', 'value1');
            mockLocalStorage.setItem('key2', 'value2');
            mockLocalStorage.setItem('key3', 'value3');
            
            global.window.store.clear();
            
            expect(mockLocalStorage.getItem('key1')).toBeNull();
            expect(mockLocalStorage.getItem('key2')).toBeNull();
            expect(mockLocalStorage.getItem('key3')).toBeNull();
            expect(Object.keys(mockLocalStorage.data).length).toBe(0);
        });

        it('对空存储调用clear不应该报错', function() {
            expect(() => {
                global.window.store.clear();
            }).not.toThrow();
        });
    });

    describe('hasKey方法测试', function() {
        beforeEach(function() {
            mockLocalStorage.setItem('existingKey', 'value');
        });

        it('存在的key应该返回true', function() {
            const result = global.window.store.hasKey('existingKey');
            expect(result).toBe(true);
        });

        it('不存在的key应该返回false', function() {
            const result = global.window.store.hasKey('nonExistentKey');
            expect(result).toBe(false);
        });

        it('undefined参数应该返回false', function() {
            const result = global.window.store.hasKey(undefined);
            expect(result).toBe(false);
        });

        it('null参数应该返回false', function() {
            const result = global.window.store.hasKey(null);
            expect(result).toBe(false);
        });
    });

    describe('边界情况和错误处理测试', function() {
        it('应该处理localStorage不支持的情况', function() {
            const originalConsoleLog = console.log;
            let loggedMessage = '';
            console.log = function(msg) { loggedMessage = msg; };
            
            // 创建没有localStorage的环境
            const noStorageWindow = {};
            const fs = require('fs');
            let storeCode = fs.readFileSync('./src/store.js', 'utf8');
            
            // 修改代码中的localStorage检测逻辑
            storeCode = storeCode.replace(
                'var _store = root.localStorage || (typeof localStorage !== \'undefined\' ? localStorage : null);',
                'var _store = root.localStorage || null;'
            );
            
            const executeStoreCode = new Function('window', storeCode);
            executeStoreCode(noStorageWindow);
            
            expect(loggedMessage).toBe('不支持localStorage');
            expect(noStorageWindow.store).toBeUndefined();
            
            console.log = originalConsoleLog;
        });

        it('setItem使用无效key类型应该输出错误信息', function() {
            const originalConsoleLog = console.log;
            let loggedMessage = '';
            console.log = function(msg) { loggedMessage = msg; };
            
            global.window.store.setItem(123, 'value');
            
            expect(loggedMessage).toBe('key只能为字符串或者数组');
            
            console.log = originalConsoleLog;
        });

        it('getItem使用无效key类型应该输出错误信息', function() {
            const originalConsoleLog = console.log;
            let loggedMessage = '';
            console.log = function(msg) { loggedMessage = msg; };
            
            global.window.store.getItem(123);
            
            expect(loggedMessage).toBe('key只能为字符串、数组和json对象');
            
            console.log = originalConsoleLog;
        });

        it('应该处理循环引用的对象', function() {
            const circularObj = { name: 'test' };
            circularObj.self = circularObj;
            
            expect(() => {
                global.window.store.setItem('circularKey', circularObj);
            }).toThrow();
        });

        it('应该处理特殊字符的key', function() {
            const specialKeys = ['key with spaces', 'key-with-dashes', 'key_with_underscores', 'key.with.dots'];
            
            specialKeys.forEach(key => {
                global.window.store.setItem(key, 'value');
                expect(mockLocalStorage.getItem(key)).toBe('value');
            });
        });
    });

    describe('性能和集成测试', function() {
        it('应该能处理大量数据的批量操作', function() {
            const keys = [];
            const values = [];
            
            for (let i = 0; i < 100; i++) {
                keys.push(`key${i}`);
                values.push(`value${i}`);
            }
            
            global.window.store.setItem(keys, values);
            
            const result = global.window.store.getItem(keys);
            expect(result.length).toBe(100);
            expect(result[0]).toBe('value0');
            expect(result[99]).toBe('value99');
            
            global.window.store.removeItem(keys);
            
            keys.forEach(key => {
                expect(mockLocalStorage.getItem(key)).toBeNull();
            });
        });

        it('复杂的混合操作测试', function() {
            // 设置各种类型的数据
            global.window.store.setItem({
                'string': 'hello',
                'number': 42,
                'boolean': true,
                'array': [1, 2, 3],
                'object': { nested: 'value' }
            });
            
            // 验证数据
            expect(global.window.store.hasKey('string')).toBe(true);
            expect(global.window.store.hasKey('number')).toBe(true);
            
            // 获取所有数据
            const allItems = global.window.store.getItems();
            expect(Object.keys(allItems).length).toBe(5);
            
            // 获取所有keys
            const allKeys = global.window.store.getKeys();
            expect(allKeys.length).toBe(5);
            
            // 批量删除部分数据
            global.window.store.removeItem(['string', 'number']);
            
            expect(global.window.store.hasKey('string')).toBe(false);
            expect(global.window.store.hasKey('boolean')).toBe(true);
            
            // 清除剩余数据
            global.window.store.clear();
            
            expect(global.window.store.getKeys().length).toBe(0);
        });
    });
});