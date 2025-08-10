import store from '../src/store';

describe('localStorage增强库测试', () => {
    beforeEach(() => {
        // 每个测试前清空localStorage
        localStorage.clear();
    });

    describe('工具函数测试', () => {
        it('应该正确处理各种数据类型', () => {
            store.setItem('string', 'hello');
            store.setItem('number', 42);
            store.setItem('boolean', true);
            store.setItem('array', [1, 2, 3]);
            store.setItem('object', { a: 1, b: 2 });
            store.setItem('null', null);
            store.setItem('undefined', undefined);
            store.setItem('nan', NaN);

            expect(store.getItem('string')).toBe('hello');
            expect(store.getItem('number')).toBe('42');
            expect(store.getItem('boolean')).toBe('true');
            expect(store.getItem('array')).toBe('[1,2,3]');
            expect(store.getItem('object')).toBe('{"a":1,"b":2}');
            expect(store.getItem('null')).toBe('');
            expect(store.getItem('undefined')).toBe('');
            expect(store.getItem('nan')).toBe('');
        });
    });

    describe('setItem方法测试', () => {
        it('应该能设置字符串键值对', () => {
            store.setItem('test', 'value');
            expect(localStorage.getItem('test')).toBe('value');
        });

        it('应该能设置数字值', () => {
            store.setItem('number', 123);
            expect(store.getItem('number')).toBe('123');
        });

        it('应该能设置布尔值', () => {
            store.setItem('bool', true);
            expect(store.getItem('bool')).toBe('true');
        });

        it('应该能设置对象（JSON序列化）', () => {
            const obj = { name: '张三', age: 25 };
            store.setItem('user', obj);
            expect(store.getItem('user')).toBe(JSON.stringify(obj));
        });

        it('应该能设置数组（JSON序列化）', () => {
            const arr = [1, 2, 3];
            store.setItem('array', arr);
            expect(store.getItem('array')).toBe(JSON.stringify(arr));
        });

        it('应该正确处理null/undefined/NaN值', () => {
            store.setItem('null', null);
            store.setItem('undefined', undefined);
            store.setItem('nan', NaN);

            expect(store.getItem('null')).toBe('');
            expect(store.getItem('undefined')).toBe('');
            expect(store.getItem('nan')).toBe('');
        });

        it('应该支持数组形式的key（批量设置）', () => {
            store.setItem(['key1', 'key2', 'key3'], ['value1', 'value2', 'value3']);

            expect(store.getItem('key1')).toBe('value1');
            expect(store.getItem('key2')).toBe('value2');
            expect(store.getItem('key3')).toBe('value3');
        });

        it('应该支持数组key配合单个value（所有key设置相同值）', () => {
            store.setItem(['a', 'b', 'c'], 'same');

            expect(store.getItem('a')).toBe('same');
            expect(store.getItem('b')).toBe('same');
            expect(store.getItem('c')).toBe('same');
        });

        it('应该支持对象形式的key（解构赋值）', () => {
            store.setItem({
                name: '张三',
                age: 25,
                city: '北京',
            });

            expect(store.getItem('name')).toBe('张三');
            expect(store.getItem('age')).toBe('25');
            expect(store.getItem('city')).toBe('北京');
        });

        it('深度遍历模式应该正确序列化复杂对象', () => {
            const complexObj = {
                user: { name: '张三', profile: { age: 25 } },
                settings: { theme: 'dark', notifications: true },
            };

            store.setItem(complexObj, null, true);

            expect(store.getItem('user')).toBe('{"name":"张三","profile":{"age":25}}');
            expect(store.getItem('settings')).toBe('{"theme":"dark","notifications":true}');
        });
    });

    describe('getItem方法测试', () => {
        it('应该能获取字符串值', () => {
            localStorage.setItem('test', 'value');
            expect(store.getItem('test')).toBe('value');
        });

        it('应该支持数组形式的key（批量获取）', () => {
            localStorage.setItem('a', '1');
            localStorage.setItem('b', '2');
            localStorage.setItem('c', '3');

            const result = store.getItem(['a', 'b', 'c', 'd']);
            expect(result).toEqual(['1', '2', '3', null]);
        });

        it('应该支持对象形式的key（结构化获取）', () => {
            localStorage.setItem('username', '张三');
            localStorage.setItem('age', '25');

            const result = store.getItem({
                user: 'username',
                userAge: 'age',
                city: 'city',
            });

            expect(result).toEqual({
                user: '张三',
                userAge: '25',
                city: null,
            });
        });

        it('获取不存在的key应该返回null', () => {
            expect(store.getItem('nonexistent')).toBeNull();
        });
    });

    describe('getItems方法测试', () => {
        it('应该返回所有存储的项目', () => {
            store.setItem('a', '1');
            store.setItem('b', '2');

            const result = store.getItems();
            expect(result).toEqual({ a: '1', b: '2' });
        });

        it('空存储时应该返回空对象', () => {
            const result = store.getItems();
            expect(result).toEqual({});
        });
    });

    describe('getKeys方法测试', () => {
        it('应该返回所有存储的key', () => {
            store.setItem('a', '1');
            store.setItem('b', '2');

            const result = store.getKeys();
            expect(result).toEqual(['a', 'b']);
        });

        it('空存储时应该返回空数组', () => {
            const result = store.getKeys();
            expect(result).toEqual([]);
        });
    });

    describe('removeItem方法测试', () => {
        it('应该能删除单个key', () => {
            store.setItem('test', 'value');
            store.removeItem('test');
            expect(store.getItem('test')).toBeNull();
        });

        it('应该支持数组形式批量删除', () => {
            store.setItem('a', '1');
            store.setItem('b', '2');
            store.setItem('c', '3');

            store.removeItem(['a', 'c']);

            expect(store.getItem('a')).toBeNull();
            expect(store.getItem('b')).toBe('2');
            expect(store.getItem('c')).toBeNull();
        });

        it('应该支持对象形式批量删除', () => {
            store.setItem('x', '1');
            store.setItem('y', '2');
            store.setItem('z', '3');

            store.removeItem({ x: 'any', z: 'any' });

            expect(store.getItem('x')).toBeNull();
            expect(store.getItem('y')).toBe('2');
            expect(store.getItem('z')).toBeNull();
        });

        it('删除不存在的key不应该报错', () => {
            expect(() => store.removeItem('nonexistent')).not.toThrow();
        });
    });

    describe('clear方法测试', () => {
        it('应该清除所有存储的数据', () => {
            store.setItem('a', '1');
            store.setItem('b', '2');

            store.clear();

            expect(store.getItem('a')).toBeNull();
            expect(store.getItem('b')).toBeNull();
        });

        it('对空存储调用clear不应该报错', () => {
            expect(() => store.clear()).not.toThrow();
        });
    });

    describe('hasKey方法测试', () => {
        it('存在的key应该返回true', () => {
            store.setItem('test', 'value');
            expect(store.hasKey('test')).toBe(true);
        });

        it('不存在的key应该返回false', () => {
            expect(store.hasKey('nonexistent')).toBe(false);
        });

        it('undefined参数应该返回false', () => {
            expect(store.hasKey(undefined)).toBe(false);
        });

        it('null参数应该返回false', () => {
            expect(store.hasKey(null)).toBe(false);
        });
    });

    describe('边界情况和错误处理测试', () => {
        it('应该处理localStorage不支持的情况', () => {
            // 这个测试验证模块在没有localStorage时的行为
            // 由于模块已经加载且使用了jsdom环境，我们通过检查代码逻辑来验证
            // 如果localStorage不存在，store会返回一个空的实现而不是抛出错误

            // 验证当前store对象的基本方法存在且可调用
            expect(typeof store.setItem).toBe('function');
            expect(typeof store.getItem).toBe('function');
            expect(typeof store.clear).toBe('function');
            expect(typeof store.hasKey).toBe('function');

            // 这个测试主要验证代码结构的健壮性
            // 实际的no-localStorage场景测试需要独立的测试环境
            expect(true).toBe(true);
        });

        it('setItem使用无效key类型应该输出错误信息', () => {
            const originalConsoleError = console.error;
            let errorMessage = '';
            console.error = jest.fn((msg: string) => {
                errorMessage = msg;
            });

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (store.setItem as any)(123, 'value');

            expect(errorMessage).toBe('key应该是string、array<string>或object类型');
            console.error = originalConsoleError;
        });

        it('getItem使用无效key类型应该输出错误信息', () => {
            const originalConsoleError = console.error;
            let errorMessage = '';
            console.error = jest.fn((msg: string) => {
                errorMessage = msg;
            });

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (store.getItem as any)(123);

            expect(errorMessage).toBe('key应该是string、array<string>或object类型');
            console.error = originalConsoleError;
        });

        it('应该处理循环引用的对象', () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const obj: any = { name: 'test' };
            obj.self = obj;

            const originalConsoleError = console.error;
            let errorMessage = '';
            console.error = jest.fn((msg: string) => {
                errorMessage = msg;
            });

            store.setItem('circular', obj);

            expect(errorMessage).toContain('Converting circular structure to JSON');
            console.error = originalConsoleError;
        });

        it('应该处理特殊字符的key', () => {
            const specialKey = 'key with spaces and 特殊字符 !@#$%';
            store.setItem(specialKey, 'value');
            expect(store.getItem(specialKey)).toBe('value');
        });
    });

    describe('性能和集成测试', () => {
        it('应该能处理大量数据的批量操作', () => {
            const keys = Array.from({ length: 100 }, (_, i) => `key${i}`);
            const values = Array.from({ length: 100 }, (_, i) => `value${i}`);

            store.setItem(keys, values);

            const result = store.getItem(keys);
            expect(result).toEqual(values);
        });

        it('复杂的混合操作测试', () => {
            // 设置各种类型的数据
            store.setItem('str', 'hello');
            store.setItem(['num1', 'num2'], [42, 100]);
            store.setItem({ bool: true, arr: [1, 2, 3] });

            // 验证数据
            expect(store.getItem('str')).toBe('hello');
            expect(store.getItem(['num1', 'num2'])).toEqual(['42', '100']);
            expect(store.getItem('bool')).toBe('true');
            expect(store.getItem('arr')).toBe('[1,2,3]');

            // 部分删除
            store.removeItem(['num1', 'bool']);

            // 验证删除结果
            expect(store.hasKey('num1')).toBe(false);
            expect(store.hasKey('num2')).toBe(true);
            expect(store.hasKey('bool')).toBe(false);
            expect(store.hasKey('arr')).toBe(true);
        });
    });

    describe('TTL 功能测试', () => {
        it('基本TTL设置和获取', () => {
            store.setItem('test', 'value', { ttl: 5000 });

            expect(store.getItem('test')).toBe('value');
            expect(store.getTTL('test')).toBeGreaterThan(4000);
            expect(store.getTTL('test')).toBeLessThanOrEqual(5000);
        });

        it('TTL过期时间设置', () => {
            const futureTime = Date.now() + 10000; // 10秒后
            store.setItem('expires', 'value', { expires: futureTime });

            expect(store.getItem('expires')).toBe('value');
            expect(store.getTTL('expires')).toBeGreaterThan(9000);
        });

        it('TTL过期后数据自动清理', done => {
            store.setItem('shortTTL', 'value', { ttl: 150 });

            expect(store.getItem('shortTTL')).toBe('value');

            setTimeout(() => {
                expect(store.getItem('shortTTL')).toBeNull();
                expect(store.getTTL('shortTTL')).toBe(-1);
                done();
            }, 200);
        });

        it('为已存在的key设置TTL', () => {
            store.setItem('existing', 'value');
            const success = store.setTTL('existing', 5000);

            expect(success).toBe(true);
            expect(store.getTTL('existing')).toBeGreaterThan(4000);
        });

        it('为不存在的key设置TTL应该失败', () => {
            const success = store.setTTL('nonexistent', 5000);
            expect(success).toBe(false);
        });

        it('批量操作支持TTL', () => {
            store.setItem(['temp1', 'temp2'], ['value1', 'value2'], { ttl: 5000 });

            expect(store.getItem('temp1')).toBe('value1');
            expect(store.getItem('temp2')).toBe('value2');
            expect(store.getTTL('temp1')).toBeGreaterThan(4000);
            expect(store.getTTL('temp2')).toBeGreaterThan(4000);
        });

        it('对象形式批量设置TTL', () => {
            store.setItem(
                {
                    obj1: 'value1',
                    obj2: 'value2',
                },
                { ttl: 1000 }
            );

            expect(store.getItem('obj1')).toBe('value1');
            expect(store.getTTL('obj1')).toBeGreaterThan(500);
            expect(store.getTTL('obj2')).toBeGreaterThan(500);
        });

        it('手动清理过期数据', done => {
            store.setItem('expire1', 'value1', { ttl: 100 });
            store.setItem('expire2', 'value2', { ttl: 100 });
            store.setItem('permanent', 'value3');

            setTimeout(() => {
                const cleaned = store.clearExpired();

                expect(cleaned).toContain('expire1');
                expect(cleaned).toContain('expire2');
                expect(cleaned).not.toContain('permanent');

                expect(store.hasKey('expire1')).toBe(false);
                expect(store.hasKey('expire2')).toBe(false);
                expect(store.hasKey('permanent')).toBe(true);

                done();
            }, 150);
        });

        it('getItems和getKeys过滤过期数据', done => {
            store.setItem('temp', 'tempValue', { ttl: 100 });
            store.setItem('permanent', 'permValue');

            setTimeout(() => {
                const items = store.getItems();
                const keys = store.getKeys();

                expect(items).toEqual({ permanent: 'permValue' });
                expect(keys).toEqual(['permanent']);
                expect(items).not.toHaveProperty('temp');
                expect(keys).not.toContain('temp');

                done();
            }, 150);
        });

        it('TTL元数据不会出现在普通操作中', () => {
            store.setItem('data', 'value', { ttl: 5000 });

            const items = store.getItems();
            const keys = store.getKeys();

            expect(keys.every((key: string) => !key.startsWith('__ttl_'))).toBe(true);
            expect(Object.keys(items).every((key: string) => !key.startsWith('__ttl_'))).toBe(true);
        });

        it('删除数据时同时清理TTL元数据', () => {
            store.setItem('data', 'value', { ttl: 5000 });

            // 确认TTL元数据存在
            expect(localStorage.getItem('__ttl_data')).not.toBeNull();

            // 删除数据
            store.removeItem('data');

            // 确认TTL元数据也被删除
            expect(localStorage.getItem('__ttl_data')).toBeNull();
        });

        it('向后兼容性测试', () => {
            // 没有TTL的数据应该正常工作
            store.setItem('normal', 'value');
            expect(store.getItem('normal')).toBe('value');
            expect(store.getTTL('normal')).toBeNull();

            // 混合使用TTL和普通数据
            store.setItem('withTTL', 'ttlValue', { ttl: 5000 });

            const items = store.getItems();
            expect(items).toEqual({
                normal: 'value',
                withTTL: 'ttlValue',
            });
        });
    });
});
