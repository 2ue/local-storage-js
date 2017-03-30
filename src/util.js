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
//判断类型
function isNumber(_v){
    return !!_v && (typeof _v === 'number');
};
function isString(_v){
    return !!_v && (typeof _v === 'string' || typeof _v === 'number');
};
function isArray(_v){
    if(typeof _v !== 'object') return false;
    return !!_v && Object.prototype.toString.call(_v) === '[object Array]';
};
function isFunction(_v){
    if(typeof _v !==  'object') return false;
    return !!_v && Object.prototype.toString.call(_v) === '[object Function]';
};
function isObject(_v){
    if(typeof _v !==  'object') return false;
    return !!_v && Object.prototype.toString.call(_v) === '[object Object]';
};
function isStorage(_v){
    if(typeof _v !==  'object') return false;
    return !!_v && Object.prototype.toString.call(_v) === '[object Storage]';
};

//转换类型
function toString(_v, _symbol){

    if(!_v || isFunction(_v)　|| isStorage(_v)) return null;
    _symbol = !_symbol ? '&' : _symbol;
    // console.log(isArray(_v))
    if(toArray(_v)) return _v.join(_symbol);
    if(isObject(_v)) return JSON.stringify(_v);
    return _v;

};
function toArray(_v, _symbol){
    if(isString(_v)) return _v.split(!_symbol ? '&' : _symbol);
    return undefined;
};
function toObject(_v, _symbol){
    if(isString(_v)) return JSON.parse(_v);
    return undefined;
};

//一些数据处理方法

function map(_v,fn){
    const isArr = isArray(_v);
    const isobj = isObject(_v);
    if(!_v || (!isArr && !isobj)) return;
    if(isArr){
        for(let i = 0; i < _v.length; i++){
            if(!!fn && (typeof fn === 'function')) fn(i, _v[i], _v);
        };
    }else{
        for(let key in _v){
            if(!!fn && (typeof fn === 'function')) fn(key, _v[key], _v);
        }
    }
};