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

interface UtilityFunctions {
    getType(para: any): DataType;
    map(para: any, fn: (keyOrIndex: string | number, value: any, original: any) => void): void;
    filterValue(val: any): string;
}

// 模块定义
(function (root: Window | typeof globalThis) {
    const _store: Storage | null =
        root.localStorage || (typeof localStorage !== 'undefined' ? localStorage : null);

    // 检测是否支持localStorage
    if (!_store) {
        console.log('不支持localStorage');
        return;
    }

    const _util: UtilityFunctions = {
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
            para: any,
            fn: (keyOrIndex: string | number, value: any, original: any) => void
        ): void {
            const paraType = _util.getType(para);
            const fnType = _util.getType(fn);

            if (paraType === 'array') {
                const arr = para as any[];
                for (let i = 0; i < arr.length; i++) {
                    if (fnType === 'function') fn(i, arr[i], para);
                }
            } else if (paraType === 'object') {
                const obj = para as Record<string, any>;
                for (const key in obj) {
                    if (fnType === 'function') fn(key, obj[key], para);
                }
            } else {
                console.log('必须为数组或Json对象');
            }
        },

        // 过滤值
        filterValue: function (val: any): string {
            const valType = _util.getType(val);
            const nullVal: DataType[] = ['null', 'undefined', 'NaN'];
            const stringVal: DataType[] = ['boolean', 'number', 'string'];

            if (nullVal.indexOf(valType) >= 0) return '';
            if (stringVal.indexOf(valType) >= 0) return String(val);
            return JSON.stringify(val);
        },
    };

    const store: LocalStorageEnhanced = {
        /**
         * @function 设置值 替代和增强localStorage的setItem方法
         * @param _k 必须参数，当为array, object时，类似解构赋值
         * @param _v 非必须参数，当_k为object时，会忽略此参数
         * @param _d 非必须，默认为false，是否开启深度遍历赋值
         */
        setItem: function <T = any>(
            _k: string | string[] | Record<string, T>,
            _v?: T | T[] | null,
            _d?: boolean
        ): void {
            const _this = this;
            const keyType = _util.getType(_k);
            const valType = _util.getType(_v);

            if (keyType === 'string') {
                _store!.setItem(_k as string, _util.filterValue(_v));
            } else if (keyType === 'array') {
                const keys = _k as string[];
                _util.map(keys, function (i: string | number, key: string) {
                    const val =
                        valType === 'array'
                            ? (_v as T[])[i as number]
                            : valType === 'object'
                              ? (_v as Record<string, T>)[key]
                              : _v;
                    if (_d) {
                        _this.setItem(key, val);
                    } else {
                        _store!.setItem(key, _util.filterValue(val));
                    }
                });
            } else if (keyType === 'object') {
                const keyValueMap = _k as Record<string, T>;
                _util.map(keyValueMap, function (key: string | number, val: T) {
                    if (_d) {
                        _this.setItem(key as string, val);
                    } else {
                        _store!.setItem(key as string, _util.filterValue(val));
                    }
                });
            } else {
                console.log('key只能为字符串或者数组');
            }
        },

        /**
         * @function 获取数据 替代和增强localStorage的getItem方法
         * @param _k 必须参数，当为array, object时，按照对应解构返回数据，深度遍历
         */
        getItem: function (_k: string | string[] | Record<string, string>): any {
            const _this = this;
            const keyType = _util.getType(_k);
            let res: any;

            if (keyType === 'string') {
                res = _store!.getItem(_k as string);
            } else if (keyType === 'array') {
                res = [];
                const keys = _k as string[];
                _util.map(keys, function (i: string | number, val: string) {
                    res.push(_this.getItem(val));
                });
            } else if (keyType === 'object') {
                res = {};
                const keyStructure = _k as Record<string, string>;
                _util.map(keyStructure, function (key: string | number, val: string) {
                    res[key] = _this.getItem(val);
                });
            } else {
                console.log('key只能为字符串、数组和json对象');
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
                if (key) {
                    res[key] = _this.getItem(key);
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
                if (key) {
                    res.push(key);
                }
            }
            return res;
        },

        /**
         * @function 移除key 替代和增强localStorage的removeItem
         * @param _k 必须参数，当为array, object时，深度遍历
         */
        removeItem: function (_k: string | string[] | Record<string, any>): void {
            const keyType = _util.getType(_k);

            if (keyType === 'string') {
                _store!.removeItem(_k as string);
            } else if (keyType === 'array') {
                const keys = _k as string[];
                _util.map(keys, function (i: string | number, key: string) {
                    _store!.removeItem(key);
                });
            } else if (keyType === 'object') {
                const keyValueMap = _k as Record<string, any>;
                _util.map(keyValueMap, function (key: string | number) {
                    _store!.removeItem(key as string);
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
            return typeof _k !== 'undefined' && _k !== null && _store!.hasOwnProperty(_k);
        },
    };

    // 导出到全局
    (root as any).store = store;
})(typeof window !== 'undefined' ? window : (global as any));

// 类型声明扩展
declare global {
    interface Window {
        store: LocalStorageEnhanced;
    }

    var store: LocalStorageEnhanced;
}

export default typeof window !== 'undefined' ? window.store : (global as any).store;
