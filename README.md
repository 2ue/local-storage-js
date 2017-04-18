#一个简单的localstorage封装

> 对localStore的一个封装，方便项目中更简洁的实现持久化

## API
`set(_key,_val)`

- 作用：写入数据

- _key类型为string、number、array，且不能为空
    - string、number作为键值对直接储存
    - array拆分成键值对储存
- _val理论支持任何类型的值，包括空
    - 当_val为array时，如果_key为string、number类型，则_array会被转化成字符串以&符号链接
    - 当_val为array时，如果_key为arry类型，则会_val会被解构赋值，并且_val.length = _key.length
    - 当_val为object时，

``` javascript
//key为string/number
set('name','2ue')// name:2ue
set('name',222)//name:222
//有BUG，当array中包含多种数据类型时
//所以目前暂时只支持纯数组
set('names',['2ue',222,'uu'])//names：'2u3&222&uu'
set('names',{name:'2ue',nicName:'monork'}) //对{name:2ue,nicName:'monork'}调用JSON.stringify()方法

//key为array
set(['name','nicName'],'2ue')//name:'2ue',nicName:'2ue'
set(['name','nicName'],['2ue'])//name:'2ue',nicName:''
set(['name','nicName'],['2ue','monork'])//name:'2ue',nicName:'monork'
set(['name','nicName'],['2ue','monork','duoyude'])//name:'2ue',nicName:'monork'
set(['name','nicName'],{name:'2ue',nicName:'monork'})//自动根据前面拆分的key匹配{name:'2ue',nicName:'monork'}中相同的key值

`setAll(_obj)`  

- 作用：批量写入，不会覆盖清除以前数据

- _obj类型为object，表示需要写入的数据。必须参数。
- 此方法会对对_obj循环，然后每次都会调用set(_key,_obj[_key]);

``` javascript
setAll({'["nannn",999]':[888],'nicName4':{test:'uuuu',uuu:8777}})
```

`coverAll(_obj)` 

- 作用：批量覆盖写入，设置之前会清空localstorage，不依赖于setAll()方法
- _obj同setAll()

`get(_key,_type)`  

- 作用：获取数据
- _key类型为string，number，array，object，必须
- 默认_key为string，number时，返回string，为array和object时返回json
- _type类型为字符串，非必须，表示最终返回结果的格式。json表示返回json格式数据，为空或者string表示返回一般字符串类型数据

``` javascript
get(['name','nicName3','nicName4'])//{name:'2ue',nicName3:'2ue3',nicName4:'2UE4'}
get({names:['name','nicName3','nicName4'],others:[66555,'test','nannn']})//{names:{name:'2ue',nicName3:'2ue3',nicName4:'2UE4'},others:{66555:'5werwe,test:444,nannn:'ttt'}}
```

`getAll()`

- 作用：返回所有的localstorage数据，返回一个新副本，和localstorage无关联

`has(_key)`

- 作用：判断是否包含又当前_key，返回布尔值
- _key目前只支持string类型，后期考虑添加array类型

`remove(_key)`

- 作用：移除当前_key，
- 支持string和array

`clear(_t)`

- 作用：清除所有的localstorage
- _t支持number类型，可以为空，表示定时再某段时间内清除

`keys()`

- 作用：返回localstorage中所有的_key的数组