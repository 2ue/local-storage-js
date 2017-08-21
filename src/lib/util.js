// 提供一些公用方法
;


//判断数字(非严格)
//字符串'`1`'会被识别成`number`
function isNumber(para) {
    return !isNaN(para);
};
//判断数字(严格)
//在必要的情况下使用：此方法会把字符串'`1`'识别成`string`类型
function isStrictNumber(para) {
    return !isNaN(para) && typeof para === 'number';
};
//判断字符串（非严格）
function isString(para) {
    return typeof para === 'string';
};
//判断字符串（严格）
//在必要的情况下使用：此种方法会把字符串'`1`'识别成`number`类型
function isStrictString(para) {
    return isNaN(para) && typeof para === 'string';
};
//判断是否为null(不能识别'')
//此方法只能识别`null`，如果要包含''，请结合方法`isStringNull()`一起使用
function isNull(para) {
    return para === null;
};
//判断是否为空字符串(不包含空格)
//此方法只能识别`''`，如果要包含`null`，请结合方法`isNull()`一起使用
function isStringNull(para) {
    return para === '';
};
//判断是否为undefined
function isUndefined(para) {
    return typeof para === 'undefined';
};

//判断是否为`false`
//当为`null`,`undefined`,`''`,`0`,`-0`,`false`,`NaN`
function isFalse(para) {
    return !para;
};

function isArray(para) {
    return Object.prototype.toString.call(para) === '[object Array]';
};
//判断字符串（非严格1--所有的object对象,包括null）
function isAllObject(para) {
    return typeof para === 'object';
};
//判断字符串（非严格2--除去null的所有object对象）
function isObject(para) {
    return !!para && typeof para === 'object';
};
//判断字符串（严格--只识别{}JSON对象）
function isStrictObject(para) {
    return Object.prototype.toString.call(para) === '[object Object]';
};
function isFunction(para) {
    return typeof para === 'function';
};
function isStorage(para) {
    return Object.prototype.toString.call(para) === '[object Storage]';
};
//判断一般数据类型(即非引用类型)
//注意：使用typeof判断`null`结果为`object`
function isBasicType(para) {
    return typeof para !== 'object';
};

//判断是否自身属性
function isOwnProp(obj, key) {
    return isStrictObject(obj) && isString(key) && obj.hasOwnProperty(key);
};

//数据类型互转的方法
function toArray(para, _symbol) {
    if (isString(para)) return para.split(!_symbol ? '&' : _symbol);
    return undefined;
};
function toJSON(para, _symbol) {
    if (isString(para)) return JSON.parse(para);
    return undefined;
};

//数据处理方法
function myMap(para, fn) {
    var isBasic = isBasicType(para);
    var isNl = isNull(para);
    var isArr = isArray(para);
    var isFun = isFunction(fn);
    if (isBasic || isNl) return;
    if (isArr) {
        for (let i = 0; i < para.length; i++) {
            if (isFun) fn(i, para[i], para);
        };
    } else {
        for (let key in para) {
            if (isFun) fn(key, para[key], para);
        };
    }
}

module.exports = {
    //typeof
    isNumber: isNumber,
    isStNumber: isStrictNumber,
    isString: isString,
    isStString: isStrictString,
    isNull: isNull,
    isStringNull: isStringNull,
    isUndefined: isUndefined,
    isFalse: isFalse,
    isArray: isArray,
    isAllObject: isAllObject,
    isObject: isObject,
    isStObject: isStrictObject,
    isBasicType: isBasicType,
    isFunction: isFunction,
    isSto: isStorage,
    //type swtich
    toArr: toArray,
    toObj: toJSON,
    //methods
    map: myMap
};