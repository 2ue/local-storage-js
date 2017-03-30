//封装一些简单的localstorage API
//一些代码风格约定
//下划线(_)开头的变量一律表示传入参数

;

var localStorage = window.localStorage;
localStorage.clear()
localStorage.setItem('name','test')
// console.log(localStorage)
// function store (){
//     return localStorage
// }
// console.log(store ())

// for(let key in localStorage){
//     console.log(key +': ' + localStorage[key])
// }
// console.log(JSON.stringify(['aa',9999]))

// var hh = document.getElementById('userName');
// hh.value = localStorage.getItem('name');
// ;
// module.exports = {
// 	isStr: isStr,
//     isArry: isArry,
//     isFun: isFunction,
//     isObj: isObject
// };

//API START
//添加数据
function set(_key,_v,_t){
    //_key支持string，array
    //_t为定时清除localstorage，类型为number，单位为ms
    //验证_key是否为空，string，arry
    if(!_key && (!isString(_key) || !isArray(_key))) return;
    var keys = isArray(_key)  ? _key : (isString(_key) && _key.indexOf('[') === 0) ? JSON.parse(_key) : [_key];
    for(let i = 0; i < keys.length; i++){
        var tempV = '';
        if(isArray(_v)){
            _v.length = keys.length;
            tempV = typeof _v[i] === 'undefined' ? '' : _v[i];
        }else{
            tempV = !_v ? null : toString(_v);
        };
        
        localStorage.setItem(keys[i],tempV);
        //定时清除
        if(!!_t && isNumber(_t) && _t >= 0){
            setTimeout(function() {
                localStorage.removeItem(keys[i]);
            }, _t);
        }
    }
    
};
//批量添加数据
function setAll(_data,_t){
    if(!_data || !isObject(_data)) return;
    for(let key in _data){
        set(key,_data[key],_t);
    };

    map(_data,function(key,val){
        set(key,val,_t);
    });
};
//覆盖批量添加数据
function coverAll(_data,_t){
    if(!_data || !isObject(_data)) return;
    localStorage.clear();
    for(let key in _data){
        set(key,_data[key],_t);
    };
};
//get相关
//获取数据
function get(_key,_type){
    const isStr = isString(_key);
    const isArr = isString(_key);
    const isObj = isObject(_key);

    if(!_key || (!isStr && !isArr && !isObj)) return;
    _type = isStr ? 'string' : 'object';
    var res = {};
    if(isObj){
        for(let key in _key){
            res[key] = getList(_key[key]);
        }
    }else{
        _key = isStr ? [_key] : _key;
        res = getList(_key);

    };

    return res;

    function getList(_arr){
        let tmpRes = {};
        for(let i = 0; i < _arr.length; i++){
            tmpRes[_arr[i]] = localStorage.getItem(_arr[i]);
        };
        return tmpRes;
    }

};

//获取所有数据
function getAll(){
    var res = {};
    for(let key in localStorage){
        res[key] = localStorage.getItem(key);
    };
    return res;
};

//判断是否包含key
function has(_key){
    var res = false;
    for(let key in localStorage){
        if(key == _key){
            res = true;
            break;
        };
    };
    return res;
};

//移除key
function remove(_key){
    if(!_key || isString(_key) || isArray(_key)) return;
    _key = isArray(_key) ? _key : [_key];
    for(let i = 0; i < _key.length; i++){
        localStorage.removeItem(_key);
    };
};
function clear(){
    for(let key in localStorage){
        localStorage.removeItem(key);
    };
};

function keys(){
    var res = [];
    for(let key in localStorage){
        res.push(key);
    };
    return res;
}

set([3123,66555],[900980,7878786668])
set('nicName3',{vsxcv:'u42342uuu',dasda:23441312})
setAll({'["nannn",999]':[888],'nicName4':{test:'uuuu',uuu:8777}},10)

// console.log(get({name:['name','nicName4','nicName3'],other:[66555,'test','nannn']}));
// console.log(getAll())
// console.log(has(9991))
// console.log(get('nannn'))
// coverAll({hhhh:9999})
console.log(localStorage);


//API END


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
            fn(i, _v[i], _v);
        };
    }else{
        for(let key in _v){
            fn(key, _v[key], _v)
        }
    }
};
