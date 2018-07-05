/*!
 * User: dingding <352926@qq.com>
 * Date: 2017/8/30
 * Time: 14:22
 * https://github.com/352926/turntable
 */

/*! turntable.js v1.0.0 */
(function ($) {
    var turntable_config = {
        prizes: [
            {title: '一等奖', color: '#fe807d', font_color: '#000'},
            {title: '二等奖', color: '#fe7771'},
            {title: '三等奖', color: '#fe807d'},
            {title: '四等奖', color: '#fe7771'},
            {title: '五等奖', color: '#fe807d'},
            {title: '六等奖', color: '#fe7771'},
            {title: '谢谢参与', color: '#fe807d'},
            {title: '谢谢参与', color: '#fe7771'}
        ],
        default_color: '#fe7771',
        width: 300,
        height: 300,
        end_color: '#FF5B5C', //中奖后区块对应背景颜色
        circle_bgcolor: '#ff5859', //大转盘颜色背景颜色
        circle_shadow_bgcolor: '#ff5758', //大转盘阴影颜色
        prize_border_color: '#ffffff', //奖项与奖项的边框颜色
        default_font_color: '#ffffff', //奖项字体颜色
        outside_radius: 140, //外圆的半径
        inside_radius: 30, //内圆的半径
        text_radius: 105, //奖品位置距离圆心的距离
        start_angle: 0, //开始角度
        duration: 10000, //大转盘旋转时间 10秒
        lottery_callback_pre_rotate: undefined, //点击抽奖按钮后在转盘滚动前回调函数
        lottery_callback: undefined, //点击抽奖按钮后回调函数
        error_callback: undefined, //大转盘先转起来，如果10s内异步调用接口还没有返回数据并调用set_prize，，失败回调次方法
        repeat_callback: undefined, //重复点击回调，当大转盘正在转动的时候，重复点击时触发
        is_lock: false, //false:停止; ture:旋转
        bind_go_btn: false //点击按钮是否绑定
    };
    $.extend($.fn, {
        turntable: function (option) {
            if ($(this).length <= 0) {
                return false;
            }
            $.extend(turntable_config, option);

            var config = turntable_config;
            var self = $(this);

            self.css('-webkit-animation', 'fd 1s ease both');
            self.css('-webkit-animation-delay', '.5s');
            self.html(turntable_tpl());

            if (config.bind_go_btn === false) {
                self.find('.go_btn').on('click', function () {
                    if (config.lottery_callback_pre_rotate !== undefined) {
                        if (!config.lottery_callback_pre_rotate()) {
                            return;
                        }
                    }
                    //让大转盘先转动10秒，10秒内如果没有设置中奖奖品则调用error_callback
                    if (turntable_config.is_lock === true) {
                        //console.log('不要贪心哦~~~');//重复抽取，上次抽取还没有完成
                        if (turntable_config.repeat_callback !== undefined) {
                            turntable_config.repeat_callback();
                        }
                        return;
                    }
                    var $canvas = self.find('canvas.turntable_canvas');
                    $canvas.rotate({
                        angle: 0,
                        animateTo: 271 + 360 * 5,
                        duration: 10000,
                        callback: function () {
                            if (config.error_callback !== undefined) {
                                config.error_callback(self);
                            } else {
                                alert('抱歉，网络请求异常，请切换网络且刷新后查看中奖结果或者重试');
                            }
                            turntable_config.is_lock = false;
                        }
                    });
                    if (config.lottery_callback !== undefined) {
                        config.lottery_callback(self);
                    }
                    config.bind_go_btn = true;
                });
            }

            drawLottery(self.find('canvas.turntable_canvas')[0]);

            //画出转盘
            function drawLottery(canvas, lottery_index) {
                var ctx = canvas.getContext('2d');
                //动态添加大转盘的奖品与奖品区域背景颜色
                if (canvas.getContext) {
                    var arc = Math.PI / (config.prizes.length / 2); //根据奖品个数计算圆周角度
                    ctx.clearRect(0, 0, config.width, config.height); //在给定矩形内清空一个矩形
                    ctx.strokeStyle = "#e95455"; //strokeStyle 属性设置或返回用于笔触的颜色、渐变或模式
                    ctx.font = '16px Microsoft YaHei'; //font 属性设置或返回画布上文本内容的当前字体属性
                    for (var i = 0; i < config.prizes.length; i++) {
                        var angle = config.start_angle + i * arc;
                        ctx.fillStyle = typeof config.prizes[i].color === 'undefined' ? config.default_color : config.prizes[i].color;

                        //创建阴影（两者同时使用） shadowBlur:阴影的模糊级数   shadowColor:阴影颜色 【注：相当耗费资源】
                        ctx.shadowBlur = 1;
                        ctx.shadowColor = config.prize_border_color;

                        ctx.beginPath();
                        //arc(x,y,r,起始角,结束角,绘制方向) 方法创建弧/曲线（用于创建圆或部分圆）
                        ctx.arc(config.width / 2, config.height / 2, config.outside_radius, angle, angle + arc, false);
                        ctx.arc(config.width / 2, config.height / 2, config.inside_radius, angle + arc, angle, true);
                        ctx.stroke();
                        ctx.fill();
                        ctx.save();

                        //----绘制奖品开始----
                        //中奖后改变背景色
                        if (lottery_index != undefined && i == lottery_index) {
                            ctx.fillStyle = config.end_color;
                            ctx.fill();
                        }
                        ctx.fillStyle = typeof config.prizes[i].font_color === 'undefined' ? config.default_font_color : config.prizes[i].font_color;

                        var text = config.prizes[i].title, line_height = 17, x, y;
                        x = config.width / 2 + Math.cos(angle + arc / 2) * config.text_radius;
                        y = config.height / 2 + Math.sin(angle + arc / 2) * config.text_radius;
                        ctx.translate(x, y); //translate方法重新映射画布上的 (0,0) 位置
                        ctx.rotate(angle + arc / 2 + Math.PI / 2); //rotate方法旋转当前的绘图
                        ctx.fillText(text, -ctx.measureText(text).width / 2, 0); //measureText()方法返回包含一个对象，该对象包含以像素计的指定字体宽度
                        ctx.restore(); //把当前画布返回（调整）到上一个save()状态之前
                        //----绘制奖品结束----
                    }
                    turntable_config.is_lock = false;
                }
            }

            function turntable_tpl() {
                return '<div class="turntable" style="width:' + config.width + 'px;height:' + config.height + 'px;background-color:' + config.circle_bgcolor + ';box-shadow:-1px 2px 4px ' + config.circle_shadow_bgcolor + '">' +
                    '<div class="turntable_circle"></div>' +
                    '<canvas class="turntable_canvas" width="' + config.width + '" height="' + config.height + '"></canvas>' +
                    '<div class="go_btn" style="-webkit-animation:fd 1s ease both;"></div></div>';
            }
        },
        set_prize: function (item, callback, duration) {
            var angles = item * (360 / turntable_config.prizes.length) - (360 / (turntable_config.prizes.length * 2));
            if (angles < 270) {
                angles = 270 - angles;
            } else {
                angles = 360 - angles + 270;
            }
            if (item === 0) {
                angles = 271;
            }

            var self = $(this);

            turntable_config.is_lock = true;
            var $canvas = self.find('canvas.turntable_canvas');
            $canvas.stopRotate();
            $canvas.rotate({
                angle: 0,
                animateTo: angles + 1800,
                duration: duration === undefined ? turntable_config.duration : duration,
                callback: function () {
                    if (callback !== undefined) {
                        callback();
                    }
                    turntable_config.is_lock = false;
                }
            });
        }
    });
})(Zepto);