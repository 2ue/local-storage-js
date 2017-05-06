//封装一些简单的localstorage API

//超出localstorage大小限制时怎么处理：新增的时候超出，改变值的时候超出
;
var util = require('./lib/util.js');
var localStorage = window.localStorage;
// localStorage.clear()

function store (obj){
    this._init(obj);
};

store.prototype = {

    _init: function(obj){
        var DEFAULT_OPTIONS = {
            isClear: false,//是否先清除localstorage
            clearAllTime: 5000,//是否定时清除所有数据，不设置表示不清除，并设置时间，单位ms
            clearSingleTime:5000,//设置默认单个清除时间，不设置表示不清除，并设置时间，单位ms
            limitSize:5//大小限制，单位MB
        };

        if(!obj || util.isStObject(obj)){
            obj = DEFAULT_OPTIONS;
        }else{
            util.map(DEFAULT_OPTIONS,function(key,val){
                if(typeof obj[key] === 'undefined' || obj[key] == null) obj[key] = val;
            });
        };
        this.options = obj;
        this._methods();
    },
    _methods: function(){
        var _self = this;
        _self.set = function(_key,_v,_t){
            var isStr = util.isString(_key);
            var isArr = util.isArray(_key);
            var isArrV = util.isArray(_v);
            var isObjV = util.isStObject(_v);

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
                    tempV = !_v ? '' : util.toStr(_v);
                };
                
                localStorage.setItem(keys[i],tempV);
                //定时清除
                if(util.isNumber(_t) && _t > 0){
                    setTimeout(function() {
                        localStorage.removeItem(keys[i]);
                    }, _t);
                }
            }
        }
    }

}

//API START
//添加数据
function set(_key,_v,_t){
    //_key允许为string，array
    //_t为定时清除localstorage，类型为number，单位为ms
    //验证_key是否为空，string，arry

    var isStr = util.isString(_key);
    var isArr = util.isArray(_key);
    var isArrV = util.isArray(_v);
    var isObjV = util.isStObject(_v);

    if(!isStr && !isArr) return;
    var keys = isArr  ? _key : (isStr && _key.indexOf('[') === 0) ? JSON.parse(_key) : [_key];
    for(let i = 0; i < keys.length; i++){
        var tempV = '';
        if(isArrV){
            _v.length = keys.length;
            tempV = typeof _v[i] === 'undefined' ? '' : _v[i];
        }else if(isObjV){
            tempV = typeof _v[keys[i]] === 'undefined' ? '' : _v[keys[i]];
        }else{
            tempV = !_v ? '' : util.toStr(_v);
        };
        
        localStorage.setItem(keys[i],tempV);
        //定时清除
        if(util.isNumber(_t) && _t > 0){
            setTimeout(function() {
                localStorage.removeItem(keys[i]);
            }, _t);
        }
    }
    
};
//批量添加数据
function setAll(_data,_t){
    if(!_data || !util.isStObject(_data)) return;
    util.map(_data,function(key,val){
        set(key,val,_t);
    });
};
//覆盖批量添加数据
function coverAll(_data,_t){
    if(!_data || !util.isStObject(_data)) return;
    //存在BUG，思考应该再判断数据类型正确之后才清空
    localStorage.clear();
    util.map(_data,function(key){
        set(key,_data[key],_t);
    })
};
//get相关
//获取数据
function get(_key,_type){
    //当_key只允许string、array和object类型
    var isStr = util.isString(_key);
    var isArr = util.isString(_key);
    var isObj = util.isStObject(_key);

    if(!isStr && !isArr && !isObj) return;
    _type = isStr ? 'string' : 'object';
    var res;
    if(isObj){
        for(let key in _key){
            res[key] = getList(_key[key]);
        }
    }else{
        res = localStorage.getItem(_key);
    };

    return res;

    function getList(_arr){
        let tmpRes = isStr ? '' : {};
        util.map(_arr,function(index,val){
            tmpRes[val] = localStorage.getItem(val);
        })
        return tmpRes;
    }

};

//获取所有数据
function getAll(){
    var res = {};
    util.map(localStorage,function(key,val){
        res[key] = localStorage.getItem(key);
    })
    return res;
};

//判断是否包含key
function has(_key){
    var res = false;
    //用hasOwnProperty？
    util.map(localStorage,function(key){
        console.log(key)
        if(key != _key) return;
        res = true;
        // break;
    })
    return res;
};

//移除key
function remove(_key){
    var isStr = util.isString(_key);
    var isArr = util.isArray(_key);
    var isStrictObj = util.isStObject(_key);
    if(!isStr || !isArr || !isStrictObj) return;
    _key = isArr ? _key : isStrictObj ? key : [_key];
    util.map(_key,function(i,val){
        localStorage.removeItem(isStrictObj ? i : val);
    });
};
function clear(_t){
    _t = !util.isNumber(_t) ? 0 : _t;
    setTimeout(function() {
        localStorage.clear();
    }, _t);
};

function keys(){
    var res = [];
    util.map(localStorage,function(key,item){
        res.push(key);
    });
    return res;
}

//API END


//test
set("name","jieyuanfei");
console.log(get('name'))