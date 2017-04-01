// 提供一些公用的检测方法
;
module.exports = {
    isNum: isNumber,
	isStr: isString,
    isArr: isArray,
    isFun: isFunction,
    isObj: isObject,
    isSto: isStorage,
    //
    toStr: toString,
    toArr: toArray,
    toObj: toObject,
    //methods
    map: map


};

//判断类型
//判断数字(非严格)
function isNumber(_v){
    return !isNaN(_v);
};
//判断数字(严格)
//在必要的情况下使用，因为此种方法会把'1'识别成`string`类型
function isStrictNumber(_v){
    return !isNaN(_v) && typeof _v === 'number';
};
//判断字符串（非严格）
function isString(_v){
    return typeof _v === 'string';
};
//判断字符串（严格）
//在必要的情况下使用，因为此种方法会把'1'识别成`number`类型
function isStrictString(_v){
    return isNaN(_v) && typeof _v === 'string';
};
//判断是否为Null(不能识别'')
function isNull(_v){
    return !_v && typeof _v === 'object';
};
//判断是否为''(不能识别null)
function isStringNull(_v){
    return !_v && typeof _v === 'string' && isNaN(_v);
};
function isArray(_v){
    return Object.prototype.toString.call(_v) === '[object Array]';
};
function isFunction(_v){
    return typeof _v === 'function';
};
function isObject(_v){
    return Object.prototype.toString.call(_v) === '[object Object]';
};
function isStorage(_v){
    return Object.prototype.toString.call(_v) === '[object Storage]';
};
function isBasicType(_v){
    const _type = typeof _v;
    return _type === 'undefined' || _type === 'number' || _type === 'string' || type === 'boolean';
};

//判断是否自身属性
function isOwnPro(obj,key){
    return isObject(obj) && isString(key) && obj.hasOwnProperty(key);
};

//数据类型互转的方法
function toString(_v, _symbol){
    // if(isNull(_v) || isStringNull(_v)) return null;
    if(!_v) return null;
    if(isBasicType(_v)) return _v;
    // if(isFunction(_v)　|| isStorage(_v)) return null;
    _symbol = !_symbol ? '&' : _symbol;
    // console.log(isArray(_v))
    if(isArray(_v)) return _v.join(_symbol);
    if(isObject(_v) || isFunction(_v)　|| isStorage(_v)) return JSON.stringify(_v);
    return _v;

};
function toArray(_v, _symbol){
    if(isString(_v)) return _v.split(!_symbol ? '&' : _symbol);
    return undefined;
};
function toJSON(_v, _symbol){
    if(isString(_v)) return JSON.parse(_v);
    return undefined;
};

//数据处理方法
function map(_v,fn){

    const isArr = isArray(_v);
    const isobj = isObject(_v);
    const isFun = isFunction(fn);
    if(!isArr && !isobj) return;
    if(isArr){
        for(let i = 0; i < _v.length; i++){
            if(isFun) fn(i, _v[i], _v);
        };
    }else{
        for(let key in _v){
            if(isFun) fn(key, _v[key], _v);
        }
    }

};