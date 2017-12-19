# store

> 对`localstorage`的简单增强，方便应对项目中各种情况。目前暂未对不支持`localstorage`的平台做兼容处理，所以使用之前一定要确保平台支持`localstorage`功能

## 前言

为了减少学习成本，做了以下事情:

- 最大程度的保持和原生API同名以及语义化命名
- 最大程度的减少新增API以及API的参数

对一些情况的说明：

原则上储存在`localstorage`中的`key`值只允许为字符串，其它类型的`key`无意义。但是在方法中允许传递`array`和`object`两种`key`，会对做类解构赋值处理

## Document

### use

> 引入后会在window上注册全局方法store，所有的实例方法都挂载到store下

``` bash
npm install --save local-storage-js
```

#### script标签方式引入

``` html
<script src='./node_modules/local-storage-js/src/store.js'></script>
```

#### require方式引入

``` javascript
require('local-storage-js');
//或者
import form('local-storage-js');
```

### API

#### setItem(_k, _v, _d)

> 和`localstorage.setItem`作用相同，但是对它的增强

- `_k` 必须参数，允许`string`、`array`，`object`
    - 为`string`时，直接调用`localstorage.setItem`方法，
    - 为`array`时，`array`内的每一个元素表示一个`key`
    - 为`object`时，将会按照对象的键值取得`key`，如果`_v`不是`object`类型，则忽略
- `_v` 必须参数（`_k`为`object`时可省略），允许任何类型数据，对于非基础类型数据，会自动调用`JSON.stringify`方法转换，以下情况除外：
    - 当`_k`和`_v`同时为`array`时，`array`内的每一个元素表示一个`key`和一个对应的`val`，类似结构赋值
    - 当`_k`和`_v`同时为`object`时，会基于`_k`合并`_v`，每个键值对表示一个储存的`item`和`val`
- `_d` 非必须参数，针对`_k`为复杂类型数据时是否深度变量，默认false只变量一层

``` javascript
//key为string
setItem('name', '2ue') // name:2ue
setItem('name', 222) //name:222
setItem('names',['2ue',222,'uu']) //names："['2ue',222,'uu']" 调用JSON.stringify()方法
setItem('names',{name:'2ue',nicName:'monork'}) //names："{name:2ue,nicName:'monork'}" 调用JSON.stringify()方法

//key为array
setItem(['name','nicName'],'2ue')//name:'2ue',nicName:'2ue'
setItem(['name','nicName'],['2ue'])//name:'2ue',nicName:''
setItem(['name','nicName'],['2ue','monork'])//name:'2ue',nicName:'monork'
setItem(['name','nicName'],['2ue','monork','duoyude'])//name:'2ue',nicName:'monork'
setItem(['name','nicName'],{name:'2ue',nicName:'monork'})//自动根据前面拆分的key匹配{name:'2ue',nicName:'monork'}中相同的key值==>name:'2ue',nicName:'monork'
setItem(['name'],{name:'2ue',nicName:'monork'})//自动根据前面拆分的key匹配{name:'2ue',nicName:'monork'}中相同的key值==>name:'2ue'

//key为obejct
setItem({name:'2ue',nicName:'monork'})
setItem({name:'2ue',nicName:'monork'},'test') //等价于第一种
setItem({name:'2ue',nicName:'monork'},['test']) //等价于第一种


setItem({name:'2ue',nicName:'monork'},{name:'heheda'}) //==>{name:'heheda',nicName:'monork'}
setItem({name:'2ue',nicName:'monork'},{name:'heheda',sex: 1}) //==>{name:'heheda',nicName:'monork'}
```

#### getItem(_k)

> 和`localstorage.getItem`作用相同，但是对它的增强

- `_k` 必须参数，允许`string`,`array`, `object`。当为`array`, `object`时，按照对应结构返回json数据，默认深度遍历
- 支持`obejct`主要是对`setItem`一种对应，以便以最小的代价获取对应的值

``` javascript
getItem('name'); //{name:2ue}
getItem(['nicName']) //{nicName:'monork'}
getItem({name:'test',nicName:'test'}) //{name:'2ue',nicName:'monork'}
```
#### getItems()

> 获取所有的值，返回一个json对象

``` javascript
getItems(); //{name:'2ue',nicName:'monork'}
```

#### getKeys()

> 获取所有的key，返回一个数组

``` javascript
getKeys(); //['name','nicName']
```
#### removeItem(_k)

> 和`localstorage.removeItem`作用相同，但是对它的增强

- `_k` 必须参数，允许`string`,`array`,`object`，深度遍历，无返回值

``` javascript
removeItem('name');
removeItem(['name']) //等价removeItem('name')
removeItem(['name','nicName']) //等价removeItem('name')+removeItem('nicName');
getItem({name:'test',nicName:'test'}) //等价于removeItem(['name','nicName'])
```

#### clear()

> 和`localstorage.removeItem`作用相同


#### hasKey(_k)

> 判断是否存在某个key

- `_k` 必须参数，只允许string类型，返回布尔值
