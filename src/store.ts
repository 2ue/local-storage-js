/**
 * @Author: 2ue
 * @Date: 2017-3-18 13:02:55
 * @Last Modified by: 2ue (Refactored to TypeScript)
 * @Last Modified time: 2024-12-19 10:03:51
 * @description: 对localStorage的一些简单封装
 * @ps: 未对不支持localStorage的浏览器做兼容处理
 */

// 类型定义
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

// TTL选项接口
interface StorageOptions {
    ttl?: number; // 生存时间，毫秒为单位
    expires?: number; // 过期时间戳，毫秒为单位
}

interface LocalStorageEnhanced {
    // setItem 方法重载 - 保持向后兼容
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setItem<T = any>(key: string, value: T): void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setItem<T = any>(key: string, value: T, options: StorageOptions): void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setItem<T = any>(keys: string[], values: T[] | T, deepTraversal?: boolean): void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setItem<T = any>(
        keys: string[],
        values: T[] | T,
        options: StorageOptions,
        deepTraversal?: boolean
    ): void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setItem<T = any>(keyValueMap: Record<string, T>, _?: null, deepTraversal?: boolean): void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setItem<T = any>(
        keyValueMap: Record<string, T>,
        options: StorageOptions | null,
        deepTraversal?: boolean
    ): void;

    getItem(key: string): string | null;
    getItem(keys: string[]): (string | null)[];
    getItem<T = Record<string, string | null>>(keyStructure: Record<string, string>): T;

    getItems(): Record<string, string | null>;
    getKeys(): string[];

    removeItem(key: string): void;
    removeItem(keys: string[]): void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    removeItem(keyValueMap: Record<string, any>): void;

    clear(): void;
    hasKey(key: string | null | undefined): boolean;

    // 新增TTL相关方法
    getTTL(key: string): number | null; // 获取剩余TTL时间
    setTTL(key: string, ttl: number): boolean; // 为已存在的key设置TTL
    clearExpired(): string[]; // 手动清理所有过期数据，返回清理的key列表
}

interface UtilityFunctions {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getType(para: any): DataType;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    map(para: any, fn: (keyOrIndex: string | number, value: any, original: any) => void): void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filterValue(val: any): string;
    // TTL相关工具函数
    isExpired(key: string): boolean; // 检查key是否过期
    setWithTTL(key: string, value: string, options: StorageOptions): void; // 设置带TTL的数据
    getWithTTL(key: string): string | null; // 获取数据并自动检查过期
    getTTLKey(key: string): string; // 获取TTL元数据key
}

// 模块定义
(function (root: Window | typeof globalThis) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const _store: Storage | null = (root as any).localStorage || null;

    // 检测是否支持localStorage
    if (!_store) {
        console.log('不支持localStorage');
        // 返回一个空的store实现，避免报错
        const emptyStore = {
            setItem: () => {},
            getItem: () => null,
            getItems: () => ({}),
            getKeys: () => [],
            removeItem: () => {},
            clear: () => {},
            hasKey: () => false,
            getTTL: () => null,
            setTTL: () => false,
            clearExpired: () => [],
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (root as any).store = emptyStore;
        return;
    }

    const _util: UtilityFunctions = {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        getType: function (para: any): DataType {
            const type = typeof para;
            if (type === 'number' && isNaN(para)) return 'NaN';
            if (type !== 'object') return type as DataType;
            return Object.prototype.toString
                .call(para)
                .replace(/[\[\]]/g, '')
                .split(' ')[1]
                .toLowerCase() as DataType;
        },

        map: function (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            para: any,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            fn: (keyOrIndex: string | number, value: any, original: any) => void
        ): void {
            const paraType = _util.getType(para);
            const fnType = _util.getType(fn);

            if (paraType === 'array') {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const arr = para as any[];
                for (let i = 0; i < arr.length; i++) {
                    if (fnType === 'function') fn(i, arr[i], para);
                }
            } else if (paraType === 'object') {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const obj = para as Record<string, any>;
                for (const key in obj) {
                    if (fnType === 'function') fn(key, obj[key], para);
                }
            } else {
                console.log('必须为数组或Json对象');
            }
        },

        // 过滤值
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        filterValue: function (val: any): string {
            const valType = _util.getType(val);
            const nullVal: DataType[] = ['null', 'undefined', 'NaN'];
            const stringVal: DataType[] = ['boolean', 'number', 'string'];

            if (nullVal.indexOf(valType) >= 0) return '';
            if (stringVal.indexOf(valType) >= 0) return String(val);

            try {
                return JSON.stringify(val);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
            } catch (error: any) {
                console.error('Converting circular structure to JSON');
                return String(val);
            }
        },

        // TTL相关工具函数
        getTTLKey: function (key: string): string {
            return `__ttl_${key}`;
        },

        isExpired: function (key: string): boolean {
            const ttlKey = _util.getTTLKey(key);
            const expiresStr = _store!.getItem(ttlKey);
            if (!expiresStr) return false;

            const expires = parseInt(expiresStr, 10);
            const now = Date.now();

            if (now > expires) {
                // 已过期，清理数据但保留TTL元数据，让getTTL能返回-1
                _store!.removeItem(key);
                // 不立即删除TTL元数据，让getTTL能检测到过期状态
                return true;
            }
            return false;
        },

        setWithTTL: function (key: string, value: string, options: StorageOptions): void {
            _store!.setItem(key, value);

            let expires: number | undefined;
            if (options.expires) {
                expires = options.expires;
            } else if (options.ttl) {
                expires = Date.now() + options.ttl;
            }

            if (expires) {
                _store!.setItem(_util.getTTLKey(key), expires.toString());
            }
        },

        getWithTTL: function (key: string): string | null {
            if (_util.isExpired(key)) {
                return null;
            }
            const value = _store!.getItem(key);
            // 如果值为空字符串（表示null/undefined/NaN），保持原样返回
            return value;
        },
    };

    const store: LocalStorageEnhanced = {
        /**
         * @function 设置值 替代和增强localStorage的setItem方法
         * @param _k 必须参数，当为array, object时，类似解构赋值
         * @param _v 非必须参数，当_k为object时，会忽略此参数
         * @param _d_or_options 非必须，可以是boolean(深度遍历)或StorageOptions对象
         * @param _d 非必须，当第三个参数是StorageOptions时，这个参数表示深度遍历
         */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setItem: function <T = any>(
            _k: string | string[] | Record<string, T>,
            _v?: T | T[] | null,
            _d_or_options?: boolean | StorageOptions,
            _d?: boolean
        ): void {
            const _this = this;
            const keyType = _util.getType(_k);
            const valType = _util.getType(_v);

            // 参数解析：支持向后兼容
            let deepTraversal = false;
            let options: StorageOptions | undefined;

            if (keyType === 'object') {
                // 对象形式：setItem({key: value}, options?, deepTraversal?)
                if (
                    _v &&
                    typeof _v === 'object' &&
                    !Array.isArray(_v) &&
                    ('ttl' in _v || 'expires' in _v)
                ) {
                    options = _v as StorageOptions;
                    deepTraversal = (_d_or_options as boolean) || false;
                } else if (typeof _v === 'boolean') {
                    deepTraversal = _v;
                } else if (_d_or_options && typeof _d_or_options === 'object') {
                    options = _d_or_options;
                    deepTraversal = _d || false;
                } else if (typeof _d_or_options === 'boolean') {
                    deepTraversal = _d_or_options;
                }
            } else {
                // 字符串/数组形式
                if (typeof _d_or_options === 'boolean') {
                    // 原有的调用方式：setItem(key, value, deepTraversal)
                    deepTraversal = _d_or_options;
                } else if (_d_or_options && typeof _d_or_options === 'object') {
                    // 新的调用方式：setItem(key, value, options) 或 setItem(key, value, options, deepTraversal)
                    options = _d_or_options;
                    deepTraversal = _d || false;
                }
            }

            if (keyType === 'string') {
                const key = _k as string;
                const value = _util.filterValue(_v);

                if (options && (options.ttl || options.expires)) {
                    _util.setWithTTL(key, value, options);
                } else {
                    _store!.setItem(key, value);
                }
            } else if (keyType === 'array') {
                const keys = _k as string[];
                _util.map(keys, function (i: string | number, key: string) {
                    const val =
                        valType === 'array'
                            ? (_v as T[])[i as number]
                            : valType === 'object'
                              ? (_v as Record<string, T>)[key]
                              : _v;
                    if (deepTraversal) {
                        if (options) {
                            _this.setItem(key, val, options);
                        } else {
                            _this.setItem(key, val);
                        }
                    } else {
                        const value = _util.filterValue(val);
                        if (options && (options.ttl || options.expires)) {
                            _util.setWithTTL(key, value, options);
                        } else {
                            _store!.setItem(key, value);
                        }
                    }
                });
            } else if (keyType === 'object') {
                const keyValueMap = _k as Record<string, T>;
                _util.map(keyValueMap, function (key: string | number, val: T) {
                    if (deepTraversal) {
                        if (options) {
                            _this.setItem(key as string, val, options);
                        } else {
                            _this.setItem(key as string, val);
                        }
                    } else {
                        const value = _util.filterValue(val);
                        if (options && (options.ttl || options.expires)) {
                            _util.setWithTTL(key as string, value, options);
                        } else {
                            _store!.setItem(key as string, value);
                        }
                    }
                });
            } else {
                console.error('key应该是string、array<string>或object类型');
            }
        },

        /**
         * @function 获取数据 替代和增强localStorage的getItem方法
         * @param _k 必须参数，当为array, object时，按照对应解构返回数据，深度遍历
         */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        getItem: function (_k: string | string[] | Record<string, string>): any {
            const _this = this;
            const keyType = _util.getType(_k);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let res: any;

            if (keyType === 'string') {
                res = _util.getWithTTL(_k as string);
            } else if (keyType === 'array') {
                res = [];
                const keys = _k as string[];
                _util.map(keys, function (_i: string | number, val: string) {
                    res.push(_this.getItem(val));
                });
            } else if (keyType === 'object') {
                res = {};
                const keyStructure = _k as Record<string, string>;
                _util.map(keyStructure, function (key: string | number, val: string) {
                    res[key] = _this.getItem(val);
                });
            } else {
                console.error('key应该是string、array<string>或object类型');
            }
            return res;
        },

        /**
         * @function 获取所有数据 增强localStorage
         * @returns 返回一个json对象
         */
        getItems: function (): Record<string, string | null> {
            const _this = this;
            const res: Record<string, string | null> = {};

            for (let i = 0; i < _store!.length; i++) {
                const key = _store!.key(i);
                if (key && !key.startsWith('__ttl_')) {
                    // 过滤掉TTL元数据key，并使用支持TTL的getItem方法
                    const value = _this.getItem(key);
                    if (value !== null) {
                        res[key] = value;
                    }
                }
            }
            return res;
        },

        /**
         * @function 获取所有key 增强localStorage
         * @returns 返回一个数组
         */
        getKeys: function (): string[] {
            const res: string[] = [];
            for (let i = 0; i < _store!.length; i++) {
                const key = _store!.key(i);
                if (key && !key.startsWith('__ttl_')) {
                    // 过滤掉TTL元数据key，并检查是否过期
                    if (!_util.isExpired(key)) {
                        res.push(key);
                    }
                }
            }
            return res;
        },

        /**
         * @function 移除key 替代和增强localStorage的removeItem
         * @param _k 必须参数，当为array, object时，深度遍历
         */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        removeItem: function (_k: string | string[] | Record<string, any>): void {
            const keyType = _util.getType(_k);

            if (keyType === 'string') {
                const key = _k as string;
                _store!.removeItem(key);
                // 同时删除对应的TTL数据
                _store!.removeItem(_util.getTTLKey(key));
            } else if (keyType === 'array') {
                const keys = _k as string[];
                _util.map(keys, function (_i: string | number, key: string) {
                    _store!.removeItem(key);
                    _store!.removeItem(_util.getTTLKey(key));
                });
            } else if (keyType === 'object') {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const keyValueMap = _k as Record<string, any>;
                _util.map(keyValueMap, function (key: string | number) {
                    const keyStr = key as string;
                    _store!.removeItem(keyStr);
                    _store!.removeItem(_util.getTTLKey(keyStr));
                });
            }
        },

        /**
         * @function 清除全部key 替代localStorage的clear
         */
        clear: function (): void {
            _store!.clear();
        },

        /**
         * @function 判断是否包含某个key 增强localStorage
         * @param _k 必须参数
         * @return 返回布尔值
         */
        hasKey: function (_k: string | null | undefined): boolean {
            if (typeof _k !== 'undefined' && _k !== null) {
                // 检查key是否存在且未过期
                return _store!.getItem(_k) !== null && !_util.isExpired(_k);
            }
            return false;
        },

        /**
         * @function 获取key的剩余TTL时间
         * @param key 键名
         * @returns 剩余时间（毫秒），如果没有TTL返回null，如果已过期返回-1
         */
        getTTL: function (key: string): number | null {
            const ttlKey = _util.getTTLKey(key);
            const expiresStr = _store!.getItem(ttlKey);

            if (!expiresStr) return null;

            const expires = parseInt(expiresStr, 10);
            const now = Date.now();
            const remaining = expires - now;

            // 如果已过期，返回-1（无论数据是否已被清理）
            if (remaining <= 0) {
                return -1;
            }

            return remaining;
        },

        /**
         * @function 为已存在的key设置TTL
         * @param key 键名
         * @param ttl TTL时间（毫秒）
         * @returns 是否设置成功
         */
        setTTL: function (key: string, ttl: number): boolean {
            if (_store!.getItem(key) === null) return false;

            const expires = Date.now() + ttl;
            _store!.setItem(_util.getTTLKey(key), expires.toString());
            return true;
        },

        /**
         * @function 手动清理所有过期数据
         * @returns 被清理的key列表
         */
        clearExpired: function (): string[] {
            const expiredKeys: string[] = [];
            const keysToCheck: string[] = [];

            // 收集所有需要检查的key
            for (let i = 0; i < _store!.length; i++) {
                const key = _store!.key(i);
                if (key && !key.startsWith('__ttl_')) {
                    keysToCheck.push(key);
                }
            }

            // 检查每个key是否过期
            keysToCheck.forEach(key => {
                if (_util.isExpired(key)) {
                    expiredKeys.push(key);
                    // 清理过期的TTL元数据
                    _store!.removeItem(_util.getTTLKey(key));
                }
            });

            return expiredKeys;
        },
    };

    // 导出到全局
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (root as any).store = store;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
})(typeof window !== 'undefined' ? window : (global as any));

// 类型声明扩展
declare global {
    interface Window {
        store: LocalStorageEnhanced;
    }

    var store: LocalStorageEnhanced;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default typeof window !== 'undefined' ? window.store : (global as any).store;
