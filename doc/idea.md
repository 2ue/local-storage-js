# 一个简单的localstorage封装

假设目前叫做store.js,向外暴露的接口为sotre

## 想法

> 默认以&符号链接

- 假设一：在对象内部缓存一个变量副本，每次set或这个get都触发更新这个副本
- 假设二：在对象内部缓存一个方法，每次调用都触发此方法，也许会用到call或者apply，argument

兼容-->不支持的怎么处理？

- 假设设置一个全局的变量保存？
- 利用sesstion保存？

过期时间？

- 利用setimeout？
- 支持全部设置？
- 单个设置？
- 后期加入的不算做过期时间内？
- 如果要加入，那么缓存的就应该是一个方法，而不是变量，每次都去动态的读取store变量

## 猜想API

store.set(key, val)||store.setData(data)

- key不能为空，参数类型为string，arry
- val为空表示，当前key的值为空，不为空数据类型为string，object，arry
- val与key支持解构赋值当key.length>val.length，val以空补齐，反之则截断val.length = key.length
- data只支持object（不支持string和arry的原因：没有键值（key）即使保存后也不利于get），并且不支持深度遍历，只遍历最外层

```javascript
store.set('name', '2ue') <==> store.setData({name:'2ue'});//两者等价
store.set('name', ['2ue','monork']);//如果val是arry，则以字符串拼接(调用val会调用jion('&')方法)
store.set('name', {name:'2ue',nicName:'monork'});//如果val是object，则以字符串拼接(调用JSON.stringify(val)方法)
store.set(['name','nicName'], '2ue');//name,nicName都会被设置成2ue
store.set(['name','nicName'], ['2ue']);//name='2ue',nicName=''
store.set(['name','nicName'], ['2ue','monork']);//以es6的解构形式name=2ue,nicName=monork
```

store.get(key,type)||store.getAll(cb(this))||store.has(key)

获取然后缓存

- key 为string，arry，object，理论上不能为空，为空不做返回空，但不报错
- type为返回数据的类型，值为s(string)，o(object)。当key为sting是，默认返回sting，当key为arry和object时默认返回object，如果对应的key不存在则返回undefined
- getAll()获得所有的object的键值对，如果没有则返回空
- has返回是否存在当前key，返回布尔值

``` javascript
store.get('name');
store.get(['name','nicName']);//返回{name:'2ue',nicName:'monork'}
//store.key(['name','nicName'],'o');//返回{name:'2ue',nicName:'monork'}
store.get({names:['name','nicName'],ids:['userId','listId','formId']});//返回{names:{name:'2ue',nicName:'monork'},ids:{userId:78650928,listId:16662228890,formId:6554242}}
```

store.remove(key) || store.clear()

- key支持string，arry，移除键值
- clear清楚所有，不可逆（考虑是否支持可逆，增加参数true或者false）



store.keys()

返回所有的keys数组

JSON.stringify(localStorage).length检测容量上限

[检测容量上限](https://arty.name/localstorage.html)


##注意
检测localstorage是否存在，不存在返回错误
检测变量类型，fun，arry，obj，string 
检测key值，key只能大小写、下划线开头加数字，正则检测