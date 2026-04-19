var phone_control_router = {
    isMobileFlag: false,
    timer: null,
	sn:null,
	mac:null,
	type:null,
	model:null,
	iosUrl:"https://apps.apple.com/app/id6756294226",
	androidUrl:"https://play.google.com/store/apps/details?id=com.netis.quicksmb",
    phonePageReset: function () {
        var me = this, s = 1;
        var w = document.documentElement.clientWidth;
        var h = document.documentElement.clientHeight;

        if (w < h) {
            s = w / 750;
        } else {
            s = w / 1200;
        }
        
        if (s>1){
            s=1;
        }
        
        // console.log(s, w, h,w/600,w/1200);
        var newH = $('.article')[0].clientWidth * s;
        $('.article').css({
            // zoom: s,
            transform: "scale(" + s + ")",
        });
        if ((newH +75)>h){
            $('.g-wrapper').css({
                height: newH,
            });
            
        }
    },
    isMobile: function () {
        // alert(window.innerWidth+"==="+window.innerHeight)
        var me = this;
        var reg = new RegExp(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
        me.isMobileFlag = reg.test(navigator.userAgent);
        if (me.isMobileFlag) {
           
            $('.phone_preview').hide();
            me.phonePageReset();
            $('body').addClass('is-app');
			
			
			if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) { //ÅÐ¶ÏiPhone|iPad|iPod|iOS
				$('.qr-code-con .item').eq(0).hide();
			} else if (/(Android)/i.test(navigator.userAgent)) {  //ÅÐ¶ÏAndroid
				$('.qr-code-con .item').eq(1).hide();
			}
        } else {
            $('body').removeClass('is-app');
        }



        me.addEvent();
    },
    delay: function (callback, ms) {
        var me = this;
        return function () {
            if (me.timer) {
                clearTimeout(me.timer);
            }
            me.timer = setTimeout(function () {
                callback();
            }, ms);
        }
    },
	get:function(){
		var me = this;
		var dfd = $.Deferred();
		
	var param = '{"jsonrpc": "2.0", "id": 1, "method": "call", "params": [ "'+localStorage.getItem('token_id')+'", "routerd", "router_wechat_get", {} ] }'
		
		request({
			url:"ubus",
			dataType:'text',
			data:param
		}).done(function(data){
			data = dataDeal(data);
			data = data["result"][1];
			me.sn = data.serialNo;
			me.mac = data.devid;
			me.model=data.model;
			me.type=data.type;
			// lang.setVendor(data);
			render_page(data);
			scrollIntoView();
			dfd.resolve(data);
		}).fail(function(){
			show_err_page();
			dfd.reject();
		});
		return dfd.promise();
	},
	initQRcode:function(type){
		var me = this;
		$(".qr-code-con .img").eq(type== "ios" ? 1 : 0).qrcode({
			text: type == "ios" ? me.iosUrl : me.androidUrl,
			width: me.isMobileFlag ? "280" : "120",
			height: me.isMobileFlag ? "280" : "120"
		});
	},
	initBindQRcode:function(){
		var me = this;
		
		var str = "DEVICE" + me.mac.replace(/:/g,"");
		
		str = me.padEnd(str,38,"0");
		if(me.type=="" || me.type==undefined){
			str=str+"&"+me.model;
		}else{
			str=str+"&"+me.type+"&"+me.model;
		}
		var width = $("#bindCode").width();
		$("#bindCode").qrcode({
			text:str,
			width: width,
			height:width
		});
	},
	padEnd:function(str, targetLength, padChar) {
	  while (str.length < targetLength) {
		str += padChar;
	  }
	  return str;
	},
    addEvent: function () {
        var me = this;
        $('.icon').off(E).on(E, function () {
            $("#bindModal").modal();
        });
        $('.opt_desc').off(E).on(E, function () {
           
        });
        if (me.isMobileFlag) {
            var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
            $(window).off(resizeEvt).on(resizeEvt, me.delay(me.phonePageReset, 200));
            $(window).off('DOMContentLoaded').on('DOMContentLoaded', me.delay(me.phonePageReset, 200), false);
            $(window).off('load').on('load', me.delay(me.phonePageReset, 200), false);
        }
    },
	preloadImg:function(){
		var images = [
			"./images/phone_bg_m.jpg",
			"./images/phone_bg.jpg",
		];

		for (var i = 0; i < images.length; i++) {
			var img = new Image();
			img.src = images[i];
		}
	},
    init: function () {
		
		var me = this;
		
		me.preloadImg();
        me.isMobile();
		me.initQRcode("ios");
		me.initQRcode("android");
		
        $.when(me.get()).then(function(){
			show_content();
			me.initBindQRcode();
		});
    }
};
current_html = "phone_control_router";
$(document).ready(function () {
	
  init_breadcrumbs();
  $(".navigation a").removeClass("current");//§Ö	
  $(".navigation a").eq(4).addClass("current");//

  appJs = language[language_type]["PAGES"][current_html]["js"];
  render_page();
  show_loading_page();
   
    // adjust_pages();
    lang.init(language[language_type]["PAGES"][current_html]);
	phone_control_router.init();
	// $(".navigation a").removeClass("current");
	// $(".navigation a").eq(5).addClass("current");
});
