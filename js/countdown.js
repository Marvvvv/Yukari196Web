function ff(e) {
    var _this = $(e);
    if(!$(this).hasClass("on")){
        $.leftTime(15,function(d){
            if(d.status){
                _this.addClass("on");
                _this.text((parseInt(d.m)*60+parseInt(d.s))+"秒");
            }else{
                _this.removeClass("on");
                _this.text("结束");
            }
        },true);
    }
}