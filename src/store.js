//封装一些简单的localstorage API

//超出localstorage大小限制时怎么处理：新增的时候超出，改变值的时候超出
;

var util = require('./lib/util.js');

//初始化实例
function store (obj){
    this._init(obj);
};

store.prototype = {

    _init: function(obj){
        var DEFAULT_OPTIONS = {
            isClear: false, //是否先清除localstorage
            // clearAllTime: 5000, //是否定时清除所有数据，不设置表示不清除，并设置时间，单位ms
            // clearSingleTime:5000, //设置默认单个清除时间，不设置表示不清除，并设置时间，单位ms
            limitSize:5 //大小限制，单位MB
        };

        if(!obj || util.isStObject(obj)){
            obj = DEFAULT_OPTIONS;
        }else{
            util.map(DEFAULT_OPTIONS,function(key,val){
                if(typeof obj[key] === 'undefined' || obj[key] == null) obj[key] = val;
            });
        };
        this._options = obj;
        this.localStorage = window.localStorage;
        this._initMethods();
        if(this._options.isClear) this.clear();
    },
    _initMethods: function(){
        var _self = this;
        //添加数据
        _self.set = function (_key,_v,_t){
            
            //_key支持string，array
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
                
                _self.localStorage.setItem(keys[i],tempV);
                //定时清除
                if(util.isNumber(_t) && _t > 0){
                    setTimeout(function() {
                        _self.localStorage.removeItem(keys[i]);
                    }, _t);
                }
            }
        };
        //批量添加数据
        _self.setAll = function (_data,_t){
            if(!_data || !util.isStObject(_data)) return;
            util.map(_data,function(key,val){
                set(key,val,_t);
            });
        };
        //覆盖批量添加数据
        _self.coverAll = function (_data,_t){
            if(!_data || !util.isStObject(_data)) return;
            //存在BUG，思考应该再判断数据类型正确之后才清空
            _self.localStorage.clear();
            util.map(_data,function(key){
                set(key,_data[key],_t);
            })
        };
        //get相关
        //获取数据
        _self.get = function (_key,_type){
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
                res = _self.localStorage.getItem(_key);
            };

            return res;

            function getList(_arr){
                let tmpRes = isStr ? '' : {};
                util.map(_arr,function(index,val){
                    tmpRes[val] = _self.localStorage.getItem(val);
                })
                return tmpRes;
            }

        };

        //获取所有数据
        _self.getAll = function (){
            var res = {};
            util.map(_self.localStorage,function(key,val){
                res[key] = _self.localStorage.getItem(key);
            })
            return res;
        };

        //判断是否包含key
        _self.has = function (_key){
            var res = false;
            //用hasOwnProperty？
            util.map(_self.localStorage,function(key){
                if(key != _key) return;
                res = true;
                // break;
            })
            return res;
        };

        //移除key
        _self.remove = function(_key,_t){
            var isStr = util.isString(_key);
            var isArr = util.isArray(_key);
            var isStrictObj = util.isStObject(_key);
            if(!isStr || !isArr || !isStrictObj) return;
            _key = isArr ? _key : isStrictObj ? key : [_key];
            util.map(_key,function(i,val){
                setTimeout(function() {
                    _self.localStorage.removeItem(isStrictObj ? i : val);
                }, (util.isNumber(_t) && _t > 0) ? _t : 0);
            });
        };
        _self.clear = function (_t){
            _t = !util.isNumber(_t) || _t < 0 ? 0 : _t;
            setTimeout(function() {
                _self.localStorage.clear();
            }, _t);
        };

        _self.keys = function (){
            var res = [];
            util.map(_self.localStorage,function(key,item){
                res.push(key);
            });
            return res;
        }
    }

};

//向外提供接口
module.exports = store;