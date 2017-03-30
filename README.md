#一个简单的localstorage封装

> 目前只是做一个很简单的封装，还未做兼容检测等

## API
set(_key,_val)
- _key支持string、number、array，且不能为空
    - string、number作为键值对直接储存
    - array拆分成键值对储存
- _val理论支持任何类型的值，包括空
    - 当_val为array时，如果_key为string、number类型，则_array会被转化成字符串以&符号链接
    - 当_val为array时，如果_key为arry类型，则会_val会被解构赋值，并且_val.length = _key.length
    - 当_val为object时，

``` javascript
set('name','2ue')// name:2ue
set('name',222)//name:222
//有BUG，当array中包含多种数据类型时
set('name',['2ue',222,'uu'])//name：'2u3&222&uu'
set(name)
```
