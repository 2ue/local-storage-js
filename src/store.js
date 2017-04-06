//封装一些简单的localstorage API
//一些代码风格约定
//下划线(_)开头的变量一律表示传入参数

//关闭标签是是否清除localstorage
//超出localstorage大小限制时怎么处理：新增的时候超出，改变值的时候超出

;
var localStorage = window.localStorage;
localStorage.clear()

function store (obj){
    this._init(obj);
};

store.prototype = {

    _init: function(obj){
        const DEFAULT_OPTIONS = {
            isClear: false,//是否先清除localstorage
            clearAllTime: 5,//是否定时清除所有数据，不设置表示不清除，并设置时间，单位m
            clearSingleTime:5,//设置默认单个清除时间，不设置表示不清除，并设置时间，单位m
            limitSize:5//大小限制，单位MB
        };

        if(!obj || _isStrictObject(obj)){
            obj = DEFAULT_OPTIONS;
        }else{
            myMap(DEFAULT_OPTIONS,function(key,val){
                if(typeof obj[key] === 'undefined' || obj[key] == null) obj[key] = val;
            });
        };
        this.options = obj;
        this._methods();
    },
    _methods: function(){
        var _self = this;
        _self.get = function(_key,_v,_t){

        }
    }

}

//抽象方法
// function getItem(_key,_v,_v){
//     if()
// }


//API START
//添加数据
function set(_key,_v,_t){
    //_key支持string，array
    //_t为定时清除localstorage，类型为number，单位为ms
    //验证_key是否为空，string，arry

    const isStr = isString(_key);
    const isArr = isArray(_key);
    const isArrV = isArray(_v);
    const isObjV = isStrictObject(_v);

    if(!isStr || !isArr) return;
    var keys = isArr  ? _key : (isStr && _key.indexOf('[') === 0) ? JSON.parse(_key) : [_key];
    for(let i = 0; i < keys.length; i++){
        var tempV = '';
        if(isArrV){
            _v.length = keys.length;
            tempV = typeof _v[i] === 'undefined' ? '' : _v[i];
        }else if(isObjV){
            tempV = typeof _v[keys[i]] === 'undefined' ? '' : _v[keys[i]];
        }else{
            tempV = !_v ? '' : toString(_v);
        };
        
        localStorage.setItem(keys[i],tempV);
        //定时清除
        if(isNumber(_t) && _t > 0){
            setTimeout(function() {
                localStorage.removeItem(keys[i]);
            }, _t);
        }
    }
    
};
//批量添加数据
function setAll(_data,_t){
    if(!_data || !isStrictObject(_data)) return;
    myMap(_data,function(key,val){
        set(key,val,_t);
    });
};
//覆盖批量添加数据
function coverAll(_data,_t){
    if(!_data || !isStrictObject(_data)) return;
    //又BUG，思考应该再判断数据类型正确之后才清空
    localStorage.clear();
    // for(let key in _data){
    //     set(key,_data[key],_t);
    // };
    myMap(_data,function(key){
        set(key,_data[key],_t);
    })
};
//get相关
//获取数据
function get(_key,_type){
    const isStr = isString(_key);
    const isArr = isString(_key);
    const isObj = isStrictObject(_key);

    if(!isStr && !isArr && !isObj) return;
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
        // for(let i = 0; i < _arr.length; i++){
        //     tmpRes[_arr[i]] = localStorage.getItem(_arr[i]);
        // };
        myMap(_arr,function(index,val){
            tmpRes[val] = localStorage.getItem(val);
        })
        return tmpRes;
    }

};

//获取所有数据
function getAll(){
    var res = {};
    myMap(localStorage,function(key,val){
        res[key] = localStorage.getItem(key);
    })
    return res;
};

//判断是否包含key
function has(_key){
    var res = false;
    //用hasOwnProperty？
    myMap(localStorage,function(key){
        if(key != _key) return;
        res = true;
        break;
    })
    return res;
};

//移除key
function remove(_key){
    var isStr = isString(_key);
    var isArr = isArray(_key);
    var isStrictObj = isStrictObject(_key);
    if(!isStr || !isArr || !isStrictObj) return;
    _key = isArr ? _key : isStrictObj ? key : [_key];
    myMap(_key,function(i,val){
        localStorage.removeItem(isStrictObj ? i : val);
    });
};
function clear(_t){
    if(isNumber(_t) && _t > 0){
        setTimeout(function() {
            localStorage.clear();
        }, _t);
    }else{
        localStorage.clear();
    };
};

function keys(){
    var res = [];
    myMap(localStorage,function(key,item){
        res.push(key);
    });
    return res;
}

// set([3123,66555],[900980,7878786668])
// set('nicName3',{vsxcv:'u42342uuu',dasda:23441312})
// setAll({'["nannn",999]':[888],'nicName4':{test:'uuuu',uuu:8777}},10)

// console.log(get({name:['name','nicName4','nicName3'],other:[66555,'test','nannn']}));
// console.log(getAll())
// console.log(has(9991))
// console.log(get('nannn'))
// coverAll({hhhh:9999})
// console.log(localStorage);

//API END



//判断类型

/*
* isNaN(para) --> ?

-1,0,1 --> false
'',' ',null,undefined,NaN,a,true,{},[],function(){}, --> false

###注意对字普通类型进行布尔转换时，空格也会被转化成true
*
*/

/*
* typeof para --> ?

-1,0,1,NaN --> number
'1',a,'',' ' --> string
undefined --> undefined
true --> boolean
null,{},[],function(){} --> object
function(){} --> function

*
*/

/*
* !para --> ?

0,'',flase,undefined,NaN --> true
-1,1,' ',a,null,true,{},[],function(){}, --> false

*
*/

/*
* Object.prototype.toString.call(para)
{} --> [object Object]
[] --> [object Array]
function(){} --> [object Function]
null --> [object Null]
undefined --> [object Undefined]
true --> [object Boolean]
-1,0,1,NaN --> [object Number]
'',' ','1',a, --> [object String]

###注意对字普通类型进行布尔转换时，空格也会被转化成true
*
*/

//判断是否定义，参数是否存在: typeof para === 'undefined'
//判断number（可以运算的）： !isNaN(para)
//判断string: 
    //1.空格也会被识别为string，判断之前应该先确定是否需要空格参与判断
    //2.'1'也会被识别成string，判断之前应该先确定是否需要格式化number
    // typeof para !== 'undefined' && typeof para === 'string' 
    //或者
    //!!para && && typeof para === 'string' 
//判断数组、对象，必须使用Object.prototype.toString.call(para)

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
//判断字符串（非严格1--所有的obejct对象）
function isAllObject(_v){
    return typeof _v === 'obejct';
};
//判断字符串（非严格2--除去null的所有object对象）
function isObject(_v){
    return !!v && typeof _v === 'obejct';
};
//判断字符串（严格--只识别{}JSON对象）
function isStrictObject(_v){
    return Object.prototype.toString.call(_v) === '[object Object]';
};
function isFunction(_v){
    return typeof _v === 'function';
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
    return isStrictObject(obj) && isString(key) && obj.hasOwnProperty(key);
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
    if(isStrictObject(_v) || isFunction(_v)　|| isStorage(_v)) return JSON.stringify(_v);
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
window.myMap = function(_v,fn){
    const isArr = isArray(_v);
    const isobj = isStrictObject(_v);
    const isFun = isFunction(fn);
    if(!isArr && !isobj) return;
    // if(!window.Map){
        if(isArr){
            for(let i = 0; i < _v.length; i++){
                if(isFun) fn(i, _v[i], _v);
            };
        }else{
            for(let key in _v){
                if(isFun) fn(key, _v[key], _v);
            };
        }
    // }else{
    //      _v.map(function(v,i,quote){
    //         if(isFun) fn(i, v, quote);
    //     })
    // }
 }

//深度遍历一个对象
//判断数据类型，判断私有属性
//遍历方法

var data = {
    name:['2ue','monork',333,'test'],
    getMethods:{
        getDefualtName: 'aaa',
        setDefualtName: 'nicName',
        getName: function(i){
            console.log(this.name[i])
        },
        setName: function(val){
            return val;
        }
    },
    quoteName: 'list',
    date: '2017-4-5 10:39:42',
    ages: '27'
}

var test = eachTo(data);
console.log(test);

function eachTo (_data, res){
    const isStrictObj = isStrictObject(_data);
    var res = !res ? {} : res;
    if(!isStrictObj) return _data;
    myMap(_data, function(i,v){
        console.log(i + ': ' + !isStrictObject(v));
        if(!isStrictObject(v)) {
            res[i] = v;
        };
        eachTo (v);
    },true);
    return res;
}