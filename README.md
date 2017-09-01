# turntable
基于zepto/Jquery大转盘插件

不能带动你们做出自己的东西让我无地自容，那么自己动手做一个让你们无地自容 By:大后端

用法：



引入样式：
```
<link rel="stylesheet" href="xxxxxxxx/turntable.css"/>
```
引入脚本：
```
<script type="text/javascript" src="//apps.bdimg.com/libs/zepto/1.1.4/zepto.min.js"></script>
<script type="text/javascript" src="http://xxxx/zepto.rotate.min.js"></script>
<script type="text/javascript" src="http://xxxxxx/turntable.js"></script>
```
```
<script>
$(document).ready(function () {

    var lottery_callback = function (e) {
        $.ajax({
            type: 'POST',
            url: 'http://xxxx.com/lottery',
            data: data,
            timeout: 5000, //超时时间不得超过10秒，推荐设置<=6秒，超过后大转盘自动认为网络繁忙，调用error_callback
            dataType: 'json',
            success: function (result) {
                //设置中奖奖品，
                var prize = result.prize;//比如，prize=1，则大转盘停留在 turntable_config.prizes第一项，中一等奖
                e.set_prize(prize, function () {
                    alert('恭喜你抽中了xxx');
                });
            }
        });
    };

    var error_callback = function (e) {
        alert('抱歉，现在访问的人数过多，请刷新后查看中奖结果或者重试');
    };
    
    //以下配置均为默认值（除lottery_callback，error_callback）
    var turntable_config = {
        prizes: [
            {title: '一等奖', color: '#fe7771'},
            {title: '二等奖', color: '#fe7771'},
            {title: '三等奖', color: '#fe7771'}
        ],
        default_color: '#fe7771',
        width: 300, //大转盘宽度
        height: 300, //大转盘高度
        end_color: '#FF5B5C', //中奖后区块对应背景颜色
        circle_bgcolor: '#ff5859', //大转盘颜色背景颜色
        circle_shadow_bgcolor: '#ff5758', //大转盘阴影颜色
        outside_radius: 140, //外圆的半径
        inside_radius: 30, //内圆的半径
        text_radius: 105, //奖品位置距离圆心的距离
        start_angle: 1, //开始角度
        duration: 10000, //大转盘旋转时间 10秒
        lottery_callback: lottery_callback, //点击抽奖按钮后回调函数
        error_callback: error_callback, //大转盘先转起来，如果10s内异步调用接口还没有返回数据并调用set_prize，，失败回调次方法
        repeat_callback: undefined, //当大转盘正在转动的时候，重复点击时触发
    };
    $('#lotterys').turntable(turntable_config);
});
</script>
```


感谢以下动力源赞助支持：
50%出于对完善系统使命感，自家系统如同自家孩子一般，看着他长大，看着他强壮！
30%出于可视化管理的活动不足，目前只有摇一摇，签到、邀约、数据收集，还有一些动不动就得改代码的小活动。
15%前端可以不懂后端代码，但是后端基本都懂前端，so，碰到这种问题，当然自己写咯（当然也借鉴了网上渲染canvas大转盘代码以及他们的素材，封装成zepto/jQuery插件）
5% 对前端的不满，为毛一个大转盘可以做一个多星期都做不出，而且还是一年前的事情了到现在还没有搞定，其实不是不行，而是不上心!