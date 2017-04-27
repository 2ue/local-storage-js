//阿拉伯数字转换为中文
;
//默认配置
var UNIT_ARRAY = ['千','百','十'];
var NUM_ARRAY = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
var NUM_UNIT_ARRAY = ['万', '亿', '兆', '京', '垓', '秭', '穰', '沟', '涧', '正', '载', '极', '恒河沙', '阿僧祗', '那由他', '不可思议', '无量', '大数'];
//删除连续重复字符
var REG_DEL_REPEAT = /(.)\1+/g;
//正向四位分割字符串
var REG_SPLIT_LEN = /(\d{4}(?=\d)(?!\d+\.|$))/g;
//反向四位分割字符串
var REG_SPLIT_LEN_R = /(\d{1,4})(?=(?:\d{4})+(?!\d))/g;


//以四位数分割
function splitNum(num,_len,_type){

    if(!num || isNaN(num)) return [];
    return num.replace(REG_SPLIT_LEN_R,'$1,').split(',');

};

//拆分四位数，转换成几千几百几十几
function switchNum(num,_index){
    // num 需要转换的数字
    //_isFirst 是否为首位
    
    var _isFirst = !!_index;
    //最终返回结果的数组
    var res = [];
    if(!num) return '';
    //不足四位的补足四位，以便补零
    num = num.split('').reverse().concat([0,0,0,0]).splice(0,4).reverse();
    num.map(function(n,i){
        if(!n || n == 0){
            res.push((num[i+1] == 0 || !num[i+1] || _isFirst) ? '' : NUM_ARRAY[n]);
        }else{
            res.push(NUM_ARRAY[n] + (n > 0 && i < 3 ? UNIT_ARRAY[i] : ''));
        }
        
    });
    return res.join('').replace(REG_DEL_REPEAT,'$1');

}

//拼接
function jionNum (num) {
    num = splitNum(num);
    var len = num.length;
    var reslt = '';
    for(let i = 0; i < len; i++){
        var temp = switchNum(num[i],i == 0);
        if(!temp) temp = NUM_ARRAY[0];
        if(len - 1 == i || temp == NUM_ARRAY[0]){
            reslt += temp;
        }else{
            reslt += (temp + NUM_UNIT_ARRAY[len - i - 2]);
        }
    };

    return reslt.replace(REG_DEL_REPEAT,'$1');
        
};

console.log(jionNum('300000000056747740230023050789'));

//向外提供接口
module.exports = {
    tsNum: jionNum
};