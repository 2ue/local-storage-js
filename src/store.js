//封装一些简单的localstorage API

//超出localstorage大小限制时怎么处理：新增的时候超出，改变值的时候超出
;

const util = require('./lib/util.js');

//初始化实例
function store(obj) {
    this._init(obj);
};

store.prototype = {

    _init: function (obj) {
        this.localStorage = window.localStorage;
        this.setOption();
    },
    //只能通过此方法对参数进行配置
    setOption: function () {
        const DEFAULT_OPTIONS = {
            limitSize: 5 //大小限制，单位MB
        };

        if (!obj || util.isStObject(obj)) {
            obj = DEFAULT_OPTIONS;
        } else {
            util.map(DEFAULT_OPTIONS, function (key, val) {
                if (typeof obj[key] === 'undefined' || obj[key] == null) obj[key] = val;
            });
        };
        this._options = obj;
        this._initMethods();
    },
    _initMethods: function () {
        const _self = this;
        //添加数据
        _self.setItem = function (_key, _v) {

            //_key支持string，array
            //验证_key是否为空，string，arry
            const isStr = util.isString(_key);
            const isArr = util.isArray(_key);
            const isStrV = util.isString(_v);
            const isArrV = util.isArray(_v);
            const isObjV = util.isStObject(_v);

            if (!isStr && !isArr) return;
            //TO DO
            //先判断才能使用JSON.stringify(_v)
            if (isStr) {
                _self.localStorage.setItem(keys, JSON.stringify(_v));
            } else {
                util.map(_key, function (i, key) {
                    let tempV = '';
                    if (isArrV) {
                        tempV = typeof _v[i] === 'undefined' ? '' : _v[i];
                    } else if (isObjV) {
                        tempV = typeof _v[key] === 'undefined' ? '' : _v[key];
                    } else {
                        tempV = _v;
                    };

                    _self.localStorage.setItem(key, JSON.stringify(tempV));
                })
            }
        };
        //批量添加数据
        _self.setItems = function (_data) {
            if (!_data || !util.isStObject(_data)) return;
            util.map(_data, function (key, val) {
                _self.set(key, val);
            });
        };
        //覆盖批量添加数据
        _self.coverSetItems = function (_data) {
            if (!_data || !util.isStObject(_data)) return;
            //存在BUG，思考应该再判断数据类型正确之后才清空
            _self.localStorage.clear();
            util.map(_data, function (key) {
                _self.set(key, _data[key]);
            })
        };
        //get相关
        //获取数据
        _self.getVal = function (_key, _type) {
            const isStr = util.isString(_key);
            const isArr = util.isArray(_key);
            const isObj = util.isStObject(_key);

            if (!isStr && !isArr && !isObj) return;
            _type = isStr ? 'string' : 'object';
            let res;
            if (isObj) {
                for (let key in _key) {
                    res[key] = getList(_key[key]);
                }
            } else {
                res = _self.localStorage.getItem(_key);
            };

            return res;

            function getList(_arr) {
                let tmpRes = isStr ? '' : {};
                util.map(_arr, function (index, val) {
                    tmpRes[val] = _self.localStorage.getItem(val);
                })
                return tmpRes;
            }

        };

        //获取所有数据
        _self.getAll = function () {
            let res = {};
            util.map(_self.localStorage, function (key, val) {
                res[key] = _self.localStorage.getItem(key);
            })
            return res;
        };

        //获取所有的keys
        _self.getKeys = function () {
            let res = [];
            util.map(_self.localStorage, function (key, item) {
                res.push(key);
            });
            return res;
        }
        //判断是否包含某个key
        _self.hasKey = function (_key) {
            let res = false;
            //用hasOwnProperty？
            util.map(_self.localStorage, function (key, item) {
                if (_key == key) res = true;
            });
            return res;
        }
        //批量移除key
        _self.removeItems = function (_key) {
            const isStr = util.isString(_key);
            const isArr = util.isArray(_key);
            const isStrictObj = util.isStObject(_key);
            if (!isStr || !isArr || !isStrictObj) return;
            keys = isStr ? [_key] : _key;
            util.map(keys, function (i, key) {
                _self.localStorage.removeItem(key);
            });
        };
        //单个移除
        _self.removeItem = function (_key) {
            _self.localStorage.removeItem(_key);
        };
        //全部清除
        _self.remove = function () {
            _self.localStorage.clear();
        };
    }

};

//向外提供接口
module.exports = store;