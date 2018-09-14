$(document).ready(function(){

    console.log("ready");

    // 加载开播信息


    // 默认加载今天弹幕量排行信息
    bulletRankInit("today");

    // 加载未结束的礼物宝箱信息
    giftRadioInit();

    // 默认加载今天禁言列表信息
    shutUpListInit(1);
});

// 获取弹幕排行信息
function bulletRankInit(timeRange) {
    $.ajax({
        url:'http://127.0.0.1:8080/bullet/countRank',
        method:'GET',
        dataType:'JSON',
        data:{timeRange:timeRange},
        success: function (rsps) {
            if (rsps.code == 0) {
                createBulletRank(rsps.data);
            } else {
                alert(rsps.msg);
            }
        }
    });
}

// 创建弹幕排行html信息
function createBulletRank(arr) {
    $("#bulletRank").empty();
    var element = "";
    for (let i = 0; i < arr.length; i++) {
        var obj = arr[i];
        element += '<li style="height: 180px;">\n' +
            '<img class="bulletRank-img" src="'+ obj.headIcon_url +'"\n' +
            'alt="User Image">\n' +
            '    <a class="users-list-name" target="_blank" href="https://yuba.douyu.com/user/main/'+ obj.uid +'">'+ obj.uname +'</a>\n' +
            '    <span class="users-list-date">'+ obj.count +'条</span>\n' +
            '</li>';
    }
    if (element == "") {
        element = '<li style="text-align: center"><h3>(=・ω・=)服务器突然死亡...</h3></li>';
    }
    $("#bulletRank").html(element);
}

// 弹幕量排行时间范围按钮点击事件
$(".dropdown-child_bullet").click(function () {
    var timeRange = $(this).attr("data-value");
    bulletRankInit(timeRange);
    $("#dropdown-bullet").html($(this).text() + ' <span class="caret"></span>');
});


function giftRadioInit() {
    $.ajax({
        url:'http://127.0.0.1:8080/giftRadio/getNotOverYetGiftInfo',
        method:'GET',
        dataType:'JSON',
        success:function (rsps) {
            if (rsps.code == 0) {
                createGiftRadio(rsps.data);
            }
        }

    });
}


function createGiftRadio(arr) {
    var giftSrc = "https://staticlive.douyucdn.cn/storage/webpic_resources/upload/dygift/1707/86d2b8b0084c7cc60311779a79b76b0b.gif";
    if (arr.length == 0) {
        $("#gift_radio").html('<li style="text-align: center"><h3>暂时没有新的监控信息，点击查看更多实时监控宝箱!</h3></li>');
        return;
    }
    for (let i = 0; i < arr.length; i++) {
        var obj = arr[i];
        var text = "";
        if (obj.radioType == 1) {
            text = '<span class="product-description">'+ obj.giveName +' 赠送给 <b style="color: red">'+ obj.achorName +'</b> 一个 '+ obj.gift_name +'</span>';
        } else if (obj.radioType == 2){
            text = '<span class="product-description">'+ obj.giveName +' 在 <b style="color: red">'+ obj.achorName +'</b> 的直播间开通了 '+ obj.gift_name +'</span>';
        }
        var cls = "time" + guid();
        var element = '<li class="item">\n' +
            '    <div class="product-img">\n' +
            '    <img src="'+ giftSrc +'"\n' +
            'alt="Product Image">\n' +
            '    </div>\n' +
            '    <div class="product-info">\n' +
            '    <a onclick="initCountDown(this,'+ obj.remainTime +');" class="product-title '+ cls +'">178秒</a>\n' +
            '    <span class="label label-success pull-right gotoRoomSpan" onclick="gotoRoom('+ obj.roomId +',this)" >冲鸭</span>\n' +
            text +
            '</div>\n' +
            '</li>';
        $("#gift_radio").append(element);
        $("." + cls).click();
    }
}


// 前往直播间
function gotoRoom(roomId,e) {
    $(e).attr("disabled","disabled");
    window.open("http://www.douyu.com/" + roomId);
}

function guid() {
    function S4() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    }
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

// 获取禁言列表信息
function shutUpListInit(page) {
    if (page == 0) {
        return;
    }

    var timeRange = $("#dropdown-shutup").attr("data-value");
    $.ajax({
        url:'http://127.0.0.1:8080/shutup/byRange',
        method:'GET',
        dataType:'JSON',
        data:{timeRange:timeRange,page:page},
        success: function (rsps) {
            if (rsps.code == 0) {
                createShutupList(rsps.data);
            } else {
                alert(rsps.msg);
            }
        }
    });
}


// 创建禁言列表html信息
function createShutupList(data) {
    $("#shutup-list").empty();
    $("#shutup-page").empty();

    // 生成表格信息
    var tbodyElement = "";
    var list = data.list;
    for (let i = 0; i < list.length; i++) {
        var obj = list[i];
        tbodyElement += '<tr>\n' +
            '<td>'+ obj.date +'</td>\n' +
            '<td>'+ obj.end_time +'</td>\n' +
            '<td>'+ obj.shutUp_name +'</td>\n' +
            '<td><span class="badge bg-red query_bullet" onclick="modalInit('+ obj.shutUp_id +');">看ta的弹幕</span></td>\n' +
            '</tr>';
    }
    if (tbodyElement == "") {
        tbodyElement = '<div style="text-align: center"><h3>(=・ω・=)突然死亡...</h3></div>';
    }
    $("#shutup-list").html(tbodyElement);

    // 生成page信息
    var prePage = data.prePage;
    var nextPage = data.nextPage;
    var pageElement = '<span style="font-size:16px;"> &nbsp; 第'+ data.pageNum +'/'+ data.pages +'页 </span>\n' +
        '<span> 共'+ data.total +'条记录</span>\n' +
        '<ul class="pagination pagination-sm no-margin pull-right">\n' +
        '    <li><a href="javascript:shutUpListInit('+ prePage +');">上一页</a></li>\n' +
        '    <li><a href="javascript:shutUpListInit('+ nextPage +');">下一页</a></li>\n' +
        '</ul>';
    $("#shutup-page").html(pageElement);

}


// 禁言列表时间范围按钮点击事件
$(".dropdown-child_shutup").click(function () {
    var timeRange = $(this).attr("data-value");
    $("#dropdown-shutup").attr("data-value",timeRange);
    shutUpListInit(1);
    $("#dropdown-shutup").html($(this).text() + ' <span class="caret"></span>');
});


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


function modalInit(uid) {
    $('#shutupModal').modal('show');
}

