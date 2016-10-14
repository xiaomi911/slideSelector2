var Swiper = function(targetEle,callback){
    this.wrap = document.querySelector(targetEle);
    if(!this.wrap)return;
    this.items = this.wrap.querySelectorAll("p");
    this.len = this.items.length;
    //this.setStyle();
    this.itemHeight = this.items[0].offsetHeight;
    this.bindEvent();
    if(callback)this.callback = callback;
};
Swiper.prototype={
    transitionEnd:function(){
        var el = document.createElement('element');

        var transitions = {
            'WebkitTransform': 'webkitTransitionEnd',
            'OTransform': 'oTransitionEnd',
            'MozTransform': 'TransitionEnd',
            'MsTransform': 'msTransitionEnd',
            'transform': 'transitionEnd'
        };
        for (var t in transitions) {
            if (el.style[t] !== undefined) {
                this.transform = t;
                return transitions[t];
            }
        }
    },
    moveTo:function(idx){
        this.wrap.style.top =  -idx*this.itemHeight +"px";
    },
    stopDefault:function (e) {
        e = e || window.event;
        if (e && e.preventDefault) {
            e.preventDefault();
            e.stopPropagation();
        } else  {
            window.event.returnValue = false;
            e.cancelBubble = true;
            window.event.cancelBubble = true;
        }
        return false;
    },
    bindEvent:function(){
        this.currentSpan = 0;
        this.index = 0;
        this.timeSpan = 0;
        this.isTouched = false;
        var l = this.len -5;
        var startTime,endTime;
        var that =this;
        function _touchstart(e){
            that.stopDefault(e);
            that.isTouched = !0;
            var computedStyle = window.getComputedStyle(that.wrap),
                top = computedStyle.getPropertyValue("top");
            this.style.top = top;
            that.removeTransition();
            clearInterval(that.timer);
            startTime = new Date().getTime();
            that.startPoint = e.touches[0].pageY;
            that.startPointX = e.touches[0].pageX;
            that.currentSpan = parseFloat(top);
        }
        function _touchmove(e) {
            that.stopDefault(e);
            that.movePoint = e.touches[0].pageY;
            that.movePointX = e.touches[0].pageX;

            that._span = that.movePoint-that.startPoint;
            that._spanX = that.movePointX-that.startPointX;
            if(Math.abs(that._spanX)-Math.abs(that._span) > 0){
                return;//上下滑动幅度比左右滑动幅度大，阻止页面切换
            }
            this.style.top = that._span + that.currentSpan + "px";
        }
        function _touchend(e){
            that.stopDefault(e);
            if(that._span == 0) return;
            that.isTouched = !1;
            endTime = new Date().getTime();
            that.timeSpan = endTime- startTime;
            var idx = that.index;
            that.wrap.style.webkitTransition = "top .15s ease-in-out";
            var count = 1;
            function getIndex(c){
                //to the right
                if(that._span>0){
                    idx-=c;
                    if(idx<0)idx=0;
                }
                //to the left
                if(that._span<0){
                    idx+=c;
                    if(idx>l)idx=l;
                }
            }
            if(Math.abs(that._span)>=that.itemHeight*0.5){
                count = Math.ceil(Math.abs(that._span/that.itemHeight));
            }else if(that.timeSpan<300 && that.timeSpan>120 && Math.abs(that._span)>that.itemHeight*0.3 ){
                count = Math.ceil(Math.abs(that.timeSpan-120/10-12));
            }
            getIndex(count);

            that.index = idx;
            that._span = 0; //重置移动距离
            that.moveTo(idx);

            that.callback && that.callback(idx);
        }

        this.wrap.addEventListener("touchstart",_touchstart,false);
        this.wrap.addEventListener("touchmove",_touchmove,false);
        this.wrap.addEventListener("touchend",_touchend,false);
        this.wrap.addEventListener(this.transitionEnd(),function(){
            that.removeTransition();
            that.currentSpan = parseFloat(this.style.top);
        },false);
    },
    removeTransition:function(){
        this.wrap.style.webkitTransition =  "";
    }
};
