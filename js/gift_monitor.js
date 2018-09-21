var tbody = $("#monitorInfo");
// var socket;

$(function(){

    console.log("onReady");

    // 加载未结束倒计时的礼物信息
    getNotOverYetGift();

    // 连接socket服务端
    if (!window.WebSocket) {
        window.WebSocket = window.MozWebSocket;
    }

    if (window.WebSocket) {
        socket = new WebSocket("ws:103.45.9.132:8888/websocket");

        socket.onmessage = function (event) {
            var data = JSON.parse(event.data);
            console.log(data);
            var giftSrc = data.gift_src;

            var img = "";
            if (giftSrc == null  || giftSrc =="") {
                img = '<td style="text-align: center"><img height="30px"></td>';
            } else {
                img = '<td style="text-align: center"><img height="30px" src="'+ giftSrc +'"></td>';
            }

            /*var date = new Date(parseInt(data.date));
            var time = date.format("yyyy-MM-dd hh:mm:ss");*/
            var text = "";
            var cls = "time" + guid();
            if (data.radioType == 1) {
                text = '<td><span>'+ data.giveName +' 赠送给 <b style="color: red;">'+ data.achorName +'</b> 一个 '+ data.gift_name +'</span></td> \n';
            } else if (data.radioType == 2) {
                text = '<td><span>'+ data.giveName +' 在 <b style="color: red;">'+ data.achorName +'</b> 的直播间开通了 '+ data.gift_name +'</span></td> \n';
            }
            var element = '<tr>\n' +
                img +
                '                                <td>'+ data.date +'</td>\n' +
                text +
                '                                <td>剩余<span onclick="countDownStart(this)" class="'+ cls +'">179</span></td>\n' +
                '                                <td><a onclick="gotoRoom('+ data.roomId +',this);" target="_blank" class="btn btn-block btn-primary btn-flat" style="width: 50%;">冲鸭</button></td>\n' +
                '                            </tr>';

            tbody.append(element);
            $("." + cls).click(); // 启动倒计时
        }

        socket.onopen = function (event) {

        }

        socket.onclose = function (event) {
            alert('服务器突然死亡（#-_-)┯━┯');
        }

    } else {
        alert('未能连接上服务器（#-_-)┯━┯');
    }

})


// 获取未结束的礼物信息，并添加至table中
function getNotOverYetGift() {
    $.ajax({
        url:'http://103.45.9.132:8080/giftRadio/getNotOverYetGiftInfo',
        method:'GET',
        dataType:'JSON',
        success:function (rsps) {
            createGiftRadio(rsps.data);
        }

    });
}

function createGiftRadio(data) {

    for (let i = 0; i < data.length; i++) {
        var obj = data[i];
        var giftSrc = obj.gift_src;

        var img = "";
        if (giftSrc == null  || giftSrc =="") {
            img = '<td style="text-align: center"><img height="30px"></td>';
        } else {
            img = '<td style="text-align: center"><img height="30px" src="'+ giftSrc +'"></td>';
        }

        var text = "";
        var cls = "time" + guid();
        if (obj.radioType == 1) {
            text = '<td><span>'+ obj.giveName +' 赠送给 <b style="color: red;">'+ obj.achorName +'</b> 一个 '+ obj.gift_name +'</span></td> \n';
        } else if (obj.radioType == 2) {
            text = '<td><span>'+ obj.giveName +' 在 <b style="color: red;">'+ obj.achorName +'</b> 的直播间开通了 '+ obj.gift_name +'</span></td> \n';
        }
        var element = '<tr>\n' +
            img +
            '                                <td>'+ obj.date +'</td>\n' +
            text +
            '                                <td>剩余<span onclick="initCountDown(this,'+ obj.remainTime +')" class="'+ cls +'"></span></td>\n' +
            '                                <td><a onclick="gotoRoom('+ obj.roomId +',this);" target="_blank" class="btn btn-block btn-primary btn-flat" style="width: 50%;">冲鸭</button></td>\n' +
            '                            </tr>';
        tbody.append(element);
        $("." + cls).click(); // 启动倒计时
    }
}



// 前往直播间
function gotoRoom(roomId,e) {
    $(e).attr("disabled","disabled");
    $(e).attr("class","btn btn-block btn-danger btn-flat");
    window.open("http://www.douyu.com/" + roomId);
}

function initCountDown(e,time) {
    var _this = $(e);
    if(!$(this).hasClass("on")){
        $.leftTime(time,function(d){
            if(d.status){
                _this.addClass("on");
                _this.text((parseInt(d.m)*60+parseInt(d.s))+"秒");
            }else{
                _this.removeClass("on");
                _this.parent().parent().fadeOut(1500);
                setTimeout(function () {
                    _this.parent().parent().remove();
                },2000);
            }
        },true);
    }
}


function countDownStart(e) {
    var _this = $(e);
    if(!$(this).hasClass("on")){
        $.leftTime(179,function(d){
            if(d.status){
                _this.addClass("on");
                _this.text((parseInt(d.m)*60+parseInt(d.s))+"秒");
            }else{
                _this.removeClass("on");
                _this.parent().parent().fadeOut(1500);
                setTimeout(function () {
                    _this.parent().parent().remove();
                },2000);
            }
        },true);
    }
}



function guid() {
    function S4() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    }
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}


Date.prototype.Format = function(fmt) {
    var o = {
        "M+" : this.getMonth()+1, //月份
        "d+" : this.getDate(), //日
        "h+" : this.getHours(), //小时
        "m+" : this.getMinutes(), //分
        "s+" : this.getSeconds(), //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S" : this.getMilliseconds() //毫秒
    };
    if(/(y+)/.test(fmt))
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)
        if(new RegExp("("+ k +")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    return fmt;
}








