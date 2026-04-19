if(!ROUTE_INFO)
	ROUTE_INFO={};
delayTimer = null;
delayTime = 500;
var wifi_get_data={};
current_html = "guide";
var appJs = language[language_type]["PAGES"][current_html]["js"];
var reg_map = {
	pppoe_frm:[
		{id:"input-pppoe-username",type:"pppoe_string"},
		{id:"input-pppoe-password",type:"password_blank"}
	],
	static_frm:[
		{id:"input-static-ip",type:"ip"},
		{id:"input-static-mask",type:"mask"},
		{id:"input-static-gateway",type:"getway"},
		{id:"input-static-dns1",type:"dns"},
		{id:"input-static-dns2",type:"dns noneed"}
	],
	wifi_name_frm:[
		{id:"input-wifi-ssid",type:"string"}
	],
	wifi_admin_frm:[
		{id:"wifi-input-admin-password",type:"password eq8_63"}
	],
	wifi_wifi_frm:[
		{id:"wifi-input-wifi-password",type:"password eq8_63"}
	],
	complex_wifi_frm:[
		{id:"wifi-input-wifi-password",type:"password eq8_63"}
	],
	pppoe_r_frm:[
		{id: "russia_pppoe_user", type: "string"},
        {id: "russia_pppoe_password", type: "password"},
        {id:"russia_other_dns1",type:"dns noneed"},
		{id:"russia_other_dns1",type:"dns noneed"}
	],
	pppoe_r_static_address_frm:[
		{id: "russia_other_ipaddr", type: "ip"},
		{id: "russia_other_netmask", type: "mask"},
		{id: "russia_other_gateway", type: "getway"},
		{id:"russia_other_dns1",type:"dns"},
		{id:"russia_other_dns1",type:"dns noneed"}
	],
	l2tp_frm:[
		{id: "russia_l2tp_user", type: "string"},
        {id: "russia_l2tp_password", type: "password"},
		{id: "l2tp_domain_id", type: "string_blank noneed"},//ip地址和域名2选1暂未完成
		{id:"other_l2tp_dns1",type:"dns noneed"},
		{id:"other_l2tp_dns2",type:"dns noneed"}
	],
	l2tp_static_address_frm:[
		{id: "other_ipaddr_l2tp", type: "ip"},
		{id: "other_netmask_l2tp", type: "mask"},
		{id: "other_gateway_l2tp", type: "getway"},
		{id:"other_l2tp_dns1",type:"dns"},
		{id:"other_l2tp_dns2",type:"dns noneed"}
	],
	pptp_frm:[
		{id: "russia_pptp_user", type: "string"},
        {id: "russia_pptp_password", type: "password"},
		{id: "pptp_domain_id", type: "string_blank noneed"},//ip地址和域名2选1暂未完成
		{id:"other_pptp_dns1",type:"dns noneed"},
		{id:"other_pptp_dns2",type:"dns noneed"}
	],
	pptp_r_static_address_frm:[
		{id: "other_ipaddr_pptp", type: "ip"},
		{id: "other_netmask_pptp", type: "mask"},
		{id: "other_gateway_pptp", type: "getway"},
		{id:"other_pptp_dns1",type:"dns"},
		{id:"other_pptp_dns2",type:"dns noneed"}
	],
};

function delay(msg){
	if(delayTimer)
		window.clearTimeout(delayTimer);
	delayTimer = window.setTimeout(function(){
		router.init.showMsgBox(null,msg);
	},delayTime);
}

function Validator(elem,msg,options){
	var defaults = {
		errorLabel:"<label class=\"invalid\">"+ msg +"</label>"
	};
	this.elem = (typeof elem == "string")? $("#" + elem) : elem;
	this.errorTimeOut = null;
	this.options = $.extend(defaults,options);
	this.init(msg);
};

Validator.prototype.init = function(msg){
	var me = this;
	me.showError(msg);
	me.errorTimeOut && clearTimeout(me.errorTimeOut);
	me.errorTimeOut = setTimeout(function () {
		me.removeError();
	}, 1000 * 3)
};

Validator.prototype.showError = function(){
	this.elem.parent().append(this.options.errorLabel);
}

Validator.prototype.removeError = function(){
	this.elem.parent().find(".invalid").remove();
}

var router = {};

//----------------------libs----------------------
router.init = {
	countDownTimer:null,
	msgTimer:null,
	get_lan_ip:function(){
		var ip = window.location.href.toString().split("/")[2].split(":")[0];
		if(ip)
			ROUTE_INFO.lan_ip = ip;
		ROUTE_INFO.lan_mask = ROUTE_INFO.default_lan_mask;
	},
	showPage:function(page){
		$(".page").addClass("off");
		$(".page-" + page).removeClass("off");
		var type = $("#device").val();
		$(".page-" + page).find("input").eq(0).focus();	
	},
	countdown:function(elem,time){
		var countDown = time;
		var dfd = $.Deferred();
		var me = this;
		if($(".page-" + elem + ' .count-down').length == 0)
			dfd.reject();
		$(".page-" + elem + ' .count-down').text(countDown);
		if(me.countDownTimer)
			 window.clearInterval(me.countDownTimer);
		me.countDownTimer = setInterval(function () {
			countDown--;
			if (countDown == 0) {
				window.clearInterval(me.countDownTimer);
				dfd.resolve();
			}
			$(".page-" + elem + ' .count-down').text(countDown);
		}, 1000);
		
		return dfd.promise();
	},
	checkFormData:function(key){
		var map = reg_map[key];
		for(var i in map){
			var _input = $("#" + map[i].id);
			var reg_val = _input.val();
			var len = _input.attr("maxlength");
			var types = map[i].type.split(' ');
			
			if (reg_val == '') {
                if (map[i].type.indexOf("noneed") != -1) {
                    continue;
                }
           }

			for (var p in types) {
                if (types[p] == "noneed")
                    continue;
                var reg_type = types[p];
				var msg = null;
				if(reg_type == "string" || reg_type == "pppoe_string"){
					var lbl = $("label[for="+ map[i].id +"]");
					if(lbl.length != 0)
						msg = lbl.text() + L.not_null;
						
				}
                var res = check_map[reg_type](reg_val,msg);
                
                if (res == true) {
                	var tmp = {};
                	tmp.value = reg_val;
                	tmp.maxLength = len;
                	res = CheckLength(tmp);
					if(res != true){
						$("#" + map[i].id).val(tmp.value);
						new Validator(_input,res);
						return false;
					}
                }

                if (res != true) {
                    new Validator(_input,res);
                    return false;
                }
            }
		}
		return true;	
	},
	initStepDom:function(index){
		var arr = appJs.step;
		
		var str = "";
			str += '<div class="step-wizard">';
			str += 		'<div class="progress">';
			str += 			'<div class="progress_bg"></div>';
			str += 			'<div class="progress_bar"></div>';
			str += 		'</div>';
			str += 		'<ul class="clearfix">';
		
			for(var i = 0; i < arr.length; i++){
				
				var status = "";
				if(i < index){
					status = "done";
				}
				else if(i == index){
					status = "current";
				}
				
				str += '<li class="'+ status +'">';
				str += 	'<a class="clearfix" href="javascript:void(0)">';
				str += 		'<span class="step-number"><b>'+ (i+1) +'</b></span>';
				str += 		'<span class="step-text">'+ arr[i] +'</span>';
				str += 	'</a>';
				str += '</li>';
			}
			str += '</ul>';
		str += '</div>';
		return str;
	},
	initStep:function(){
		var me = this;
		
		var len = $(".steps").length;
		for(var i=0; i < len; i++){
			var elem = $(".steps").eq(i);
			elem.empty();
			var index = elem.attr("data-step") * 1;
			elem.html(me.initStepDom(index));
		}
	}
};

//------------------welcome---------------------------------
router.init.welcome = {
	detectWanType:null,
	placeholder:{
		wifi:appJs.wifi_placeholder,
		wisp:appJs.wisp_placeholder
	},
	getWanType:function(){
		var me = this;
		//if(delayTimer)
			//window.clearTimeout(delayTimer);
		//router.init.hideMsgBox();
		var param = '{"jsonrpc": "2.0","id": 15,"method":"call","params":["00000000000000000000000000000000", "routerd", "get_wan_type", {"uiname":"WAN1"}]}';
		
		request({
			url:"/ubus",
			data:param
		}).done(function(data){
			if(data.result){
				//WAN口类型，0:未知， 1:DHCP  2:PPPOE 3: DHCP+PPPOE
				var wan_type = data.result[1].wan_type;
//				var wan_type = 2;
				if(wan_type == 0){
					me.detectWanType = "UNKNOWN";
				}
				if (wan_type == 1) {
					me.detectWanType = "DHCP";
				}
				if(wan_type == 2) {
					me.detectWanType = "PPPOE";
				}
				if (wan_type == 3) {
					me.detectWanType = "PPPOE";
				}
			}
			else{
				me.detectWanType = "UNKNOWN";
			}
			me.setWanType(me.detectWanType);
		}).fail(function(data){
			//show_request_err(data);
		})
	},
	setWanType:function(type,flag){
		router.init.showPage("set-network");
		router.init.net.pageToggle(type);
		router.init.net.WanInfoText(type,flag);
	},
	getParamStatus:function(){
		var dfd = $.Deferred();
		var param ='{"jsonrpc":"2.0","id":16,"method":"call","params": ["00000000000000000000000000000000", "routerd", "param_status", {"action":"get" }]}';
		
		request({
			url:"/ubus",
			data:param
		}).done(function(data){
			if(data.result){
				if(data.result[1].initialized==1){
					location.href = "/login.html";
					dfd.reject();
				}
				else if(data.result[1].initialized==0){
					dfd.resolve();
				}
				else{
					show_message_gt("error",data.result[0]);
				}
			}
			else{
				show_message_gt("error",data.error.code);
				dfd.reject();
			}
		}).fail(function(data){
			//show_request_err(data);
		})
		return dfd.promise();
	},
	setParamStatus:function(){
		var dfd = $.Deferred();
		return '{"jsonrpc": "2.0", "id": 1, "method": "call", "params": [ "00000000000000000000000000000000", "routerd", "param_status", {"action": "set"} ]}';
	},
	detectNet:function(){
		//检测联网状态
	},
	detectCable:function(){
		//检测线缆状态
	},
	getTimeZone:function(){
		var d = new Date();
		var timeZone = "";
		var timeZoneOffset = d.getTimezoneOffset()/60;	
		if(timeZoneOffset > 0){
			timeZone = Math.abs(timeZoneOffset);
//			timeZone = "+" + Math.abs(timeZoneOffset);
		}
		else if(timeZoneOffset == 0){
			timeZone = "0";
		}
		else{
			timeZone = "-" + Math.abs(timeZoneOffset);
		}
		return timeZone;
	},
	getZoneName:function(zone){
		var zoneName = null;
		var zoneList = language[language_type].PAGES["timeSetting"]["select"]["time_zone_sel"];
		for(var i in zoneList){
			if(zoneList[i].value == zone){
				zoneName = zoneList[i].txt;
				break;
			}
		}
		if(zoneName==null){
			return false;
		}else{
			return zoneName.replace(/\(.*?\)/g,'');
		}
	},
	setTimeZone:function(){
		var me = this;
		var dfd = $.Deferred();
		var data = {};
		var time_zone=$("#time_zone_sel").val();
//		data.timezone = me.getTimeZone();
//		data.zonename = me.getZoneName(data.timezone);
		data.timezone=time_zone;
		data.zonename = me.getZoneName(data.timezone);
		return JSON.stringify({"jsonrpc": "2.0", "id": 18, "method": "call", "params": ["00000000000000000000000000000000", "uci", "set", {"config": "system","type": "system","values":data}]});
	},
	netSubmit:function(data){
		var me = this;
		/*$.when(me.detectCable()).then(function(ret){{
			if(ret == 1){//疑似网页未连接
				//router.init.showPage("cable-error");
				router.init.welcome.setWanType("UNKNOWN");
			}
			else{//接线正常
				$.when(me.getParamStatus()).then(function(){
					//检测有没有联网,这里按照需求，只检查一次detect_net.cgi返回值
					//$.when(me.detectNet()).then(function(result){
						//if(result == 0){
							//if(data == "no-result")
								//router.init.welcome.setWanType("DHCP");
							//else
								//router.init.wifi.showWifiPage();
						//}
						//else{
							me.getWanType();
							router.init.showPage("get-method");
							router.init.countdown("get-method",5);
						//}
					//});
				});
			}
		}});*/
		me.getTimeZone();
		
		/*delay("正在获取参数状态");*/
		$.when().then(function(){
			$.when().then(function(){
				me.getWanType();
				router.init.showPage("get-method");
				router.init.countdown("get-method",5);
			});
		});
		
	},
	addEvent:function(){
		var me = this;
		
		$(".btn-start").off("click").on("click",function(){
			me.netSubmit();
		});
		

		$(".page-cable-error .set-net").off("click").on("click",function(){
			router.init.showPage("set-network");
			router.init.net.pageToggle("UNKNOWN");
			router.init.net.WanInfoText("UNKNOWN");
		});
		
		$(".page-cable-error .set-wisp").off("click").on("click",function(){
			router.init.wisp.getWisp();
		});
		
		$(".page-cable-error dd").off("click").on("click",function(){
			var type = $(this).attr("data-type");
			if(type == "network-mode"){
				router.init.showPage("set-network");
				router.init.net.pageToggle("UNKNOWN");
				router.init.net.WanInfoText("UNKNOWN");
			}
			else{
				router.init.wisp.getWisp();
			}
		});
	},
	//一些复用的函数暂时也丢在这个位置
	isSame:function(prefix){
		var me = this;
		$("#"+ prefix +"-same-password").off("click").on("click",function(){
			if($(this).prop("checked")){
				me.fold(prefix);
			}
			else{
				me.unfold(prefix);
			}
		});
	},
	fold:function(prefix,flag){
		var me = this;
		if(flag)
			$("#"+ prefix +"-same-password").prop("checked",true);
		$("#"+ prefix +"-admin-pwd").addClass("off");
		$("#"+ prefix +"-input-admin-password").val("");
		me.initPlaceholder(prefix);
	},
	unfold:function(prefix,flag){
		var me = this;
		if(flag)
			$("#"+ prefix +"-same-password").prop("checked",false);
		
		$("#"+ prefix +"-admin-pwd").removeClass("off");
		me.initPlaceholder(prefix,true);
	},
	initPlaceholder:function(prefix,flag){
		var me = this;
		if(flag){//各密码框提示分别赋值
			//wifi则提示密码是否可以为空
			$("#"+ prefix +"-input-wifi-password").attr("placeholder",me.placeholder.wifi[1]);
			//管理密码提示	
			$("#"+ prefix +"-input-admin-password").attr("placeholder",me.placeholder.wifi[3]);
		}
		else//统一赋值
			$("#"+ prefix +"-input-wifi-password,#"+ prefix +"-input-admin-password").attr("placeholder",me.placeholder.wifi[0]);
	},
	init:function(){
		var me = this;
		var arr = ["wifi"];
		for(var i in arr){
			me.isSame(arr[i]);
			me.initPlaceholder(arr[i]);
		}
		me.addEvent();
	}
};

//------------------------net-------------------------
router.init.net = {
	user:null,
	pwd:null,
	wanData:null,
	settingWanType:null,
	detectTimer:null,
	isJump:null,
	checkNet:function(type){
		if(type == "PPPOE"){
			if(!router.init.checkFormData("pppoe_frm"))
        		return false;
		}
		if(type == "STATIC"){
			if(!router.init.checkFormData("static_frm"))
        		return false;
        	var ip = $('#input-static-ip').val();
	        var mask = $("#input-static-mask").val();
	        var gw = $("#input-static-gateway").val();
	        
	        var res1 = check_ip_mask(ip,mask);
	        if(res1 != true){
	        	new Validator("input-static-ip",res1);
	        	return false;
	        }
	        
	        var res2 = check_getway_mask(gw,mask);
	        if(res2 != true){
	        	new Validator("input-static-gateway",res2)
	        	return false;
	        }
	        
	        var res3 = check_wan_lan_ip(ip,gw,mask);
        	if(res3 != true){
        		new Validator("input-static-ip",res3)
        		return false;
        	}
		}
//		验证俄罗斯接入pppoe
		if(type == "PPPOE_R"){
			if(!router.init.checkFormData("pppoe_r_frm"))
        		return false;
        	var russia_rdio=$("input[name='russia_rdio']:checked").val();
        	if(russia_rdio=="static"){
        		if(!router.init.checkFormData("pppoe_r_static_address_frm"))
        		return false;
        	}
		}
		if(type == "L2TP"){
			if(!router.init.checkFormData("l2tp_frm"))
        		return false;
        	var russia_rdio=$("input[name='russia_l2tp_rdio']:checked").val();
        	if(russia_rdio=="static"){
        		if(!router.init.checkFormData("l2tp_static_address_frm"))
        		return false;
        	}
		}
		if(type == "PPTP"){
			if(!router.init.checkFormData("pptp_frm"))
        		return false;
        	var russia_rdio=$("input[name='russia_pptp_rdio']:checked").val();
        	if(russia_rdio=="static"){
        		if(!router.init.checkFormData("pptp_static_address_frm"))
        		return false;
        	}
		}
		return true;
	},
	getWanInfo:function(){
		var dfd = $.Deferred();
		var param = '{"jsonrpc": "2.0", "id": 17, "method": "call", "params": ["00000000000000000000000000000000","routerd","wan_config_get", {"wanid":1}]}';
	
		request({
			url:"/ubus",
			data:param
		}).done(function(data){
			dfd.resolve(data);
		}).fail(function(data){
			//show_request_err(data);
		})
		return dfd.promise();
	},
	returnNet:function(){
		//优先级最高的是实际设置的参数，其次是预检结果
		//当无实际设置参数时，则判断预检结果，无预检测结果则说明是DHCP或者是未联网，有预检测结果则证明用户选择的是跳过
		//如果用户跳过，则读取预检参数，如果预检参数为空，则说明预检失败，则重新检测，如果预检测成功，则显示预检结果，清空用户之前输入的参数
		var me = this;
		if(me.settingWanType){//有实际参数
			me.fillWanInfo(router.init.net.wanData);
			router.init.welcome.setWanType(me.settingWanType,true);
		}
		else{
			if(!!router.init.welcome.detectWanType){//有预检结果
				if(router.init.welcome.detectWanType == "UNKNOWN"){
					router.init.welcome.netSubmit();
				}
				else{
					router.init.welcome.setWanType(router.init.welcome.detectWanType);
				}
			}
			else{//无预结果
				router.init.welcome.netSubmit("no-result");
			}
		}
	},
	fillWanInfo:function(data){
		var arr = ["input-pppoe-username","input-pppoe-password","input-static-ip","input-static-mask","input-static-gateway","input-static-dns1","input-static-dns2"];
		var value = null;
		if(data){
			value = [router.init.net.user,router.init.net.pwd,data.ip,data.mask,data.gw,data.dns1,data.dns2];
		}
		for(var i in arr){
			if(data){
				$("#" + arr[i]).val(value[i]);
			}
			else
				$("#" + arr[i]).val("");
		}
	},
	setWanInfo:function(data){
		var me = this;
		var dfd = $.Deferred();
		var proto = $("#wan_type_sel").val();
		var wanConfigSetData = {};
		
		wanConfigSetData.wanid = 1;
		wanConfigSetData.enable=1;
		wanConfigSetData.mtu=1500;
		wanConfigSetData.ports=63;
		me.settingWanType = wanConfigSetData.proto = proto;
		if(data==0){
		if(proto == "pppoe"){
			wanConfigSetData.username = $("#input-pppoe-username").val();
			wanConfigSetData.password = $("#input-pppoe-password").val();
			wanConfigSetData.mtu=1480;
		}
		else if(proto == "static"){
			wanConfigSetData.ipaddr = $("#input-static-ip").val();
			wanConfigSetData.netmask = $("#input-static-mask").val();
			wanConfigSetData.gateway = $("#input-static-gateway").val();
			wanConfigSetData.dns1 = $("#input-static-dns1").val();
			if($("#input-static-dns2").val()!=""){
				wanConfigSetData.dns2 = $("#input-static-dns2").val();
			}
			wanConfigSetData.mtu=1500;
			
		}else if(proto == "pppoe_r"){
			wanConfigSetData.username=$("#russia_pppoe_user").val();
			wanConfigSetData.password=$("#russia_pppoe_password").val();
			wanConfigSetData.other_proto=$("input[name='russia_rdio']:checked").val();
			if(wanConfigSetData.other_proto=="static"){
				wanConfigSetData.other_ipaddr=$("#russia_other_ipaddr").val();
				wanConfigSetData.other_netmask=$("#russia_other_netmask").val();
				wanConfigSetData.other_gateway=$("#russia_other_gateway").val();
				wanConfigSetData.dns1=$("#russia_other_dns1").val();
				if($("#russia_other_dns2").val()!=""){
					wanConfigSetData.dns2 = $("#russia_other_dns2").val();
				}
			}
			wanConfigSetData.mtu=1492;
		}else if(proto == "l2tp"){
			wanConfigSetData.l2tp_username=$("#russia_l2tp_user").val();
			wanConfigSetData.l2tp_password=$("#russia_l2tp_password").val();
			wanConfigSetData.server=$("#l2tp_domain_id").val();
			wanConfigSetData.other_proto=$("input[name='russia_l2tp_rdio']:checked").val();
			if(wanConfigSetData.other_proto=="static"){
				wanConfigSetData.other_ipaddr=$("#other_ipaddr_l2tp").val();
				wanConfigSetData.other_netmask=$("#other_netmask_l2tp").val();
				wanConfigSetData.other_gateway=$("#other_gateway_l2tp").val();	
				wanConfigSetData.dns1=$("#other_l2tp_dns1").val();
				if($("#other_l2tp_dns2").val()!=""){
					wanConfigSetData.dns2 = $("#other_l2tp_dns2").val();
				}
			}
			wanConfigSetData.mtu=1460;
		}else if(proto == "pptp"){
			wanConfigSetData.pptp_username=$("#russia_pptp_user").val();
			wanConfigSetData.pptp_password=$("#russia_pptp_password").val();
			wanConfigSetData.mppe=Number($("#mppe_encryption").val());
			wanConfigSetData.server=$("#pptp_domain_id").val();
			wanConfigSetData.other_proto=$("input[name='russia_pptp_rdio']:checked").val();
			if(wanConfigSetData.other_proto=="static"){
				wanConfigSetData.other_ipaddr=$("#other_ipaddr_pptp").val();
				wanConfigSetData.other_netmask=$("#other_netmask_pptp").val();
				wanConfigSetData.other_gateway=$("#other_gateway_pptp").val();	
				wanConfigSetData.dns1=$("#other_pptp_dns1").val();
				if($("#other_pptp_dns2").val()!=""){
					wanConfigSetData.dns2 = $("#other_pptp_dns2").val();
				}
			}
			wanConfigSetData.mtu=1400;
		}
	}else{
			wanConfigSetData={};
			wanConfigSetData.enable=1;
			wanConfigSetData.wanid = 1;
	}
		return JSON.stringify({"jsonrpc":"2.0","id":18,"method":"call","params": ["00000000000000000000000000000000", "routerd","wan_config_set",wanConfigSetData]});
	},
	setIpv6:function(){//调用是否以用ipv6接口
		var wan_ipv6_Data={};
		wan_ipv6_Data.wanid=1;
		wan_ipv6_Data.enable=Number($("#ipv6_enable").val());
		wan_ipv6_Data.wanmode="auto";
		wan_ipv6_Data.dnsmode="auto";
		return JSON.stringify({"jsonrpc": "2.0", "id": 19, "method": "call", "params": ["00000000000000000000000000000000", "routerd","wan_ipv6_config_set",wan_ipv6_Data]});
	},
	detectNet:function(){
		var me = this;
		var dfd = $.Deferred();
		var timeout = 15,count = 0;
		router.init.showPage("detect-net");
		router.init.countdown("detect-net",timeout);
		
		if(me.detectTimer)
			window.clearTimeout(me.detectTimer);
		me.detectTimer = window.setTimeout(function(){
			var calleeFN = arguments.callee;
			count++;
			request({
				url:"/router/detect_net.cgi",
				data:{timeout: 10}
			}).done(function(data){
				router.init.hideMsgBox();
				if(data.detect_res * 1 == 1){//检测成功
					window.clearTimeout(me.detectTimer);
					dfd.resolve(0);
				}
				else if(data.detect_res * 1 == 0 || count >= 15){//超时
					window.clearTimeout(me.detectTimer);
					dfd.resolve(-1);
				}
				else{//-1代表不能上网
					me.detectTimer = window.setTimeout(calleeFN,1000);
				}
			}).fail(function(data){
				//show_request_err(data);
			})
			
		},1000);
		return dfd.promise();
	},
	WanInfoText:function(type,flag){
		var typeInfo = {
			"unknown":{
				"title":appJs.detect_result[0],
				"discription":""
			},
			"pppoe":{
				"title":"",
				"discription":appJs.wan_describe[0]
			},
			"dhcp":{
				"title":"",
				"discription":appJs.wan_describe[1]
			},
			"static":{
				"title":"",
				"discription":""
			}
		};
		if(flag){
			typeInfo["pppoe"]["title"] = appJs.detect_result[2];
			typeInfo["dhcp"]["title"] = appJs.detect_result[1];
			typeInfo["static"]["title"] = appJs.detect_result[3];
			
		}
		else{
			typeInfo["pppoe"]["title"] = appJs.detect_result[5];
			typeInfo["dhcp"]["title"] = appJs.detect_result[6];
			typeInfo["static"]["title"] = "";
		}

		var name = type.toLowerCase();
		$(".wan-type-info").find("h2").html(typeInfo[name].title);
		$(".wan-type-info").find("p").html(typeInfo[name].discription);
		if(name == "unknown"){
			$(".forget-password,.igd-sw-link").removeClass("off");
		}
		else{
			$(".forget-password,.igd-sw-link").addClass("off");
		}
	},
	pageToggle:function(type){
		if(type == "UNKNOWN"){
			type = "pppoe";
		}
		else{
			type = type.toLowerCase();
		}

		$("#wan_type_sel").val(type);
		
		$('.form').addClass("off");
		$('.form-' + type).removeClass("off");
	},
	showDetectPage:function(){
		var me = this;
		$.when(me.detectNet()).then(function(data){
			if(data == -1)
				router.init.showPage("detect-error");
			else{
				router.init.wifi.showWifiPage();
			}
		});
	},
	addEvent:function(){
		var me = this;
		
		$(".page-get-method-error .next").off("click").on("click",function(){
			me.pageToggle("UNKNOWN");
			me.WanInfoText(type);
		});
		
		$(".page-set-network .btn-next").off('click').on('click', function() {
			
			var time_zone_val=$("#time_zone_sel").val();
			
			
			var type = $("#wan_type_sel").val().toUpperCase();
			console.log(type)
			if(!me.checkNet(type))
				return;
			if(time_zone_val==""){
				$("#time_zone_sel").css("border-color","#f04142");
				setTimeout(function(){
					$("#time_zone_sel").css("border-color","#ccc");
				},3000)
				return false;
			}
			me.isJump = 0;
			router.init.wifi.showWifiPage();
		});
		
		$(".page-detect-error .next").off('click').on('click', function() {
			router.init.wifi.showWifiPage();
		});
		
		$(".page-detect-error .return").off('click').on('click', function() {
			router.init.net.returnNet();
		});
		
		
		$(".page-set-network .sub-choose").off("click").on("click",function(){
			me.isJump = 1;
			router.init.wifi.showWifiPage();
			
		})
		
		$('#wan_type_sel').off('change').on('change', function() {
			var type = $(this).val();
			me.pageToggle(type);
		});
	},
	init:function(){
		this.addEvent();
	}
};


//------------------------wifi-------------------------
router.init.wifi = {
	ssid:"",
	wifi_pwd:"",
	checkWifi:function(){
		if(!router.init.checkFormData("wifi_name_frm"))
	    	return false;
		if(!router.init.wifi.checkWifiPwd("wifi"))
			return false;
		return true;
	},
	checkIsStrongPwd:function(val){
		if(checkStrong(val) < igd.global_param.pwd_strong_level){
			return false;
		}
		return true;
	},
	checkWifiPwd:function(prefix){
		var me = this;
		var wifi_elem = $("#"+ prefix +"-input-wifi-password");
		var admin_elem = $("#"+ prefix +"-input-admin-password");
		var admin_layer = $("#" + prefix +"-admin-pwd");
		var ck_elem = $("#"+ prefix + "-same-password");
		
		var check_pwd_level = function(value){
			if(!router.init.wifi.checkIsStrongPwd(value)){
				router.init.welcome.unfold(prefix,true);
				alert(igd.err[igd.global_param.pwd_strong_level - 2 + 106],3000);
				admin_elem.focus();
				return false;
			}
			else
				return true;
		} 
		
		if(ck_elem.prop("checked")){
			if(wifi_elem.val() == ""){//如果wifi为空，给出提示则去掉勾选，让用户输入管理密码
				router.init.welcome.unfold(prefix,true);
				show_message("error",L.admin_pwd_not_empty);
				admin_elem.focus();
				return false;
			}
			else{//因管理密码和wifi密码相同，只用校验复合密码强度
				if(!router.init.checkFormData("complex_wifi_frm"))
					return false;
				//检查是不是wifi是不是强密码
				/*if(!check_pwd_level(wifi_elem.val()))
					return;
				*/
			}
				
		}
		else{
			if(!router.init.checkFormData(prefix +"_admin_frm"))
        		return false;
			//检查是不是管理密码是不是强密码
			/*if(!check_pwd_level(admin_elem.val()))
					return;
			*/
			
			if(wifi_elem.val() != ""){//wifi不为空则校验
				if(!router.init.checkFormData(prefix +"_wifi_frm"))
					return false;
			}
			else{//二次确认wifi密码是不是为空
				$("#wifiPwdModal").modal();
				return false;
			}
		}
		return true;
	},
	uciApply:function(){
		var me = this;
		var dfd = $.Deferred();
		//判断是否UCI参数保存与生效
		return '{"jsonrpc": "2.0", "id": 10, "method": "call", "params": [ "00000000000000000000000000000000", "uci", "apply",{"timeout": "60"}]}';
	},
	getWifi:function(){
		var me = this;
		var dfd = $.Deferred();
		var param = '{"jsonrpc": "2.0", "id": 19,"method": "call", "params": ["00000000000000000000000000000000", "uci", "get", {"config": "wificfg","section": "2G"}]}';
		
		request({
			url:"/ubus",
			data:param
		}).done(function(data){
			if(data.result){
				data=data.result[1].values;
				wifi_get_data=data;
				if(data.SSID1){
					me.ssid = data.SSID1;
					$("#input-wifi-ssid").val(me.formatWifi(data.SSID1));
				}
				if(data.Passwd1){
					me.wifi_pwd = data.Passwd1;
					$("#input-wifi-password").val(data.Passwd1);
				}
			}
			dfd.resolve();
		}).fail(function(data){
			//show_request_err(data);
		})
		
		return dfd.promise();
	},
	formatWifi:function(ssid){
		var str = "";
		var d = ssid.length - str.length;
		var index = ssid.lastIndexOf(str);
		
		if(d >= 0 && index == d){
			return ssid.substring(0,index);
		}
		else
			return ssid;
	},
	setWifi:function(ssid,pwd,type){
		var dfd = $.Deferred();
		var data = {};
		data["Enable1"] = "1";
		data["SSID1"] = ssid;
		data["DeviceRole"]="1";
	//	data["dual_frequency_switch"]="0";//双频合一开关
		if(pwd == ""){
			data["EncrypType1"] = "NONE";
		}
		else{
			data["EncrypType1"] = "AES";
			data["AuthMode1"] = "WPAPSKWPA2PSK";
			data["Passwd1"] = pwd;
			
		}
		if(type=="5G"){
			data["Enable3"] = "0";
			data["Enable4"] = "0";
			data["SSID3"] = ssid;
			
			if(pwd == ""){
				data["EncrypType3"] = "NONE";
				data["EncrypType4"] = "NONE";
			}
			else{
				data["EncrypType3"] = "AES";
				data["EncrypType4"] = "AES";
				data["AuthMode3"] = "WPAPSKWPA2PSK";
				data["AuthMode4"] = "WPAPSKWPA2PSK";
				data["Passwd3"] = pwd;
				data["Passwd4"] = pwd;
			}
		}
		if(wifi_get_data.dual_frequency_switch==1){
			data["dual_frequency_switch"]="1";//双频合一开关
		}else{
			data["dual_frequency_switch"]="0";//双频合一开关
			
		}
		return JSON.stringify({"jsonrpc": "2.0", "id": 20, "method": "call", "params": [ "00000000000000000000000000000000", "uci", "set", {"config": "wificfg","section": type,"values":data}]});
	
	},
	getAdmin:function(prefix){
		var pwd = "";
		if($("#"+ prefix + "-same-password").prop("checked"))
			pwd = $("#"+ prefix +"-input-wifi-password").val();
		else
			pwd = $("#"+ prefix +"-input-admin-password").val();
		return pwd;
	},
	setAdmin:function(prefix){
		var me = this;
		var admin_pwd = me.getAdmin(prefix);
		var dfd = $.Deferred();
		return JSON.stringify({"jsonrpc": "2.0", "id": 22, "method": "call", "params": [ "00000000000000000000000000000000", "routerd", "passwd_set", {"user": ROUTE_INFO.username,"pwd":admin_pwd}]});
	},
	setAutoUpdate:function(){
		var dfd = $.Deferred();
//		var allow = $("#chk-auto_update").prop("checked") ? "1":"0";
		var allow = $("input[name='chk_auto_update']").eq(0).prop("checked") ? "1":"0";
		
		return JSON.stringify({"jsonrpc": "2.0", "id": 23, "method": "call", "params": ["00000000000000000000000000000000", "auto_update", "auto_update_set",{"allow":allow}]});
	},
	wifiSubmit:function(){
		var me = this;
		var ssid = $("#input-wifi-ssid").val();
		var ssid_24g = ssid ;
		if(ssid_24g.indexOf("2.4G") != -1){
			var ssid_5g = ssid.replace('2.4G','5G');
		}else if(ssid_24g.indexOf("2G") != -1){
			var ssid_5g = ssid.replace('2G','5G');
		}else if(ssid_24g.indexOf("24G") != -1){
			var ssid_5g = ssid.replace('24G','5G');
		}else if(ssid_24g.indexOf("2.4g") != -1){
			var ssid_5g = ssid.replace('2.4g','5g');
		}else if(ssid_24g.indexOf("2g") != -1){
			var ssid_5g = ssid.replace('2g','5g');
		}else if(ssid_24g.indexOf("24g") != -1){
			var ssid_5g = ssid.replace('24g','5g');
		}else{
			if(wifi_get_data.dual_frequency_switch==1){
					var ssid_5g = ssid;
			}else{
				var ssid_5g = ssid + "-5G";
			}
		}
		
		var pwd = $("#wifi-input-wifi-password").val();
		
		
		var paramArr = [];
		
//		paramArr.push(router.init.net.setWanInfo(router.init.net.isJump));
		if(router.init.net.isJump == 0){
			paramArr.push(router.init.welcome.setTimeZone());
		}
//		paramArr.push(router.init.net.setIpv6());
		paramArr.push(me.setAutoUpdate());
		paramArr.push(me.setAdmin("wifi"));
//		paramArr.push(me.setWifi(ssid_24g,pwd,"2G"));
//		paramArr.push(me.setWifi(ssid_5g,pwd,"5G"));
//		paramArr.push(me.uciApply());
		paramArr.push(router.init.welcome.setParamStatus());
		
		var flag = true;
		var msg = null;
		request({
			url:"/ubus",
			data:"[" + paramArr.toString() + "]"
		}).done(function(data){
			for(var i in data){
				if(data[i].result){
					if(data[i].result[0]!=0){
						flag = false;
						msg = data[i].result[0];
						break;
					}
				}
				else{
					flag = false;
					msg = data[i].error.code;
					break;
				}
			}
			
			if(flag){
				me.end(ssid_24g,ssid_5g,pwd);
			}
			else{
				show_message_gt("error",msg);
			}
		}).fail(function(data){
			//show_request_err(data);
		})
		
	

	},

	end:function(ssid,ssid2,pwd){
		var me = this;
		//if(delayTimer)
			//window.clearTimeout(delayTimer);
		//router.init.hideMsgBox();
		if(ssid == ssid2){
			$("#lbl-ssid-2-4G").html(L.lbl_wifi);
			$("#ssid-5g").addClass("off");
		}
		if(wifi_get_data.dual_frequency_switch==1){
			$("#lbl-ssid-2-4G").html(L.lbl_wifi);
			$("#wifi-name-2-4G").text(ssid);
			$("#ssid-5g").addClass("off");
		}else{
			$("#wifi-name-2-4G").text(ssid);
			$("#wifi-name-5g").text(ssid2);
		}
		
		router.init.showPage("end");
	},
	showWifiPage:function(){
		/*delay("正在初始化WiFi参数");*/
		$.when(router.init.wifi.getWifi()).then(function(){
			/*if(delayTimer)
				window.clearTimeout(delayTimer);
			router.init.hideMsgBox();*/
			router.init.showPage("set-wifi");
		});
	},
	addEvent:function(){
		var me = this;
		
		$(".page-set-wifi .btn-save").off("click").on("click",function(){
			if(!me.checkPwd("wifi_admin_frm"))
				return;
//			阅读申明没出来前用此方法
			var chk_auto_update1=$("input[name='chk_auto_update']").eq(0).prop("checked");
			var chk_auto_update2=$("input[name='chk_auto_update']").eq(1).prop("checked");
			if(chk_auto_update1==false && chk_auto_update2==false){
				show_message("error",L.upgrade_options);
				return;
			}
			/*delay("正在设置您的无线名称和密码");*/
			me.wifiSubmit();
		});
		
		$("#wifiPwdModal .btn-cancel").off("click").on("click",function(){
			$("#wifiPwdModal").modal("hide");
			//用户仍然选择不加密，参数继续下发
			me.wifiSubmit();
		});
		
		
		
		$(".page-end .btn-end").off("click").on("click",function(){
			window.location.href = "/login.html";
		});
		
		$(".page-set-wifi .sub-choose").off("click").on("click",function(){
			//如果预检测有结果，则不需要再次检测
			router.init.net.returnNet();
		});
		
		
	},
	init:function(){
		this.addEvent();
	}
};



$(document).ready(function(){
	var init = router.init;
	lang.init(language[language_type]["PAGES"][current_html]);
	render_page();
	show_loading_page();
	
	
	$.when(configurationState()).then(function(){
		
		hide_loading_page();
		show_content();
		
		init.get_lan_ip();
		init.initStep();
		init.welcome.init();
		init.net.init();
		init.wifi.init();
		init.showPage("welcome");
		if(router.exam_flag){
			init.showPage("set-work-mode");
			$("#adminPwdModal .btn-cancel").remove();
		}
		else{
			init.showPage("welcome");
		}
	});
	
	
	$("#lbl-ssid-2-4G").html(L.lbl_2_4_wifi);
	$("#lbl-ssid-5G").html(L.lbl_5_wifi);
	$("#wifiPwdModal .modal-title").html(language[language_type]["DIALOG"]["wifi-encrypt"].title);
	var $p = $("<p/>").attr("class","single-tip").html(language[language_type]["DIALOG"]["wifi-encrypt"].content);
	$("#wifiPwdModal .modal-body").html($p);
	$(".checkbox2 input").click(function(){
//		var timer_day=$("#timer_day").val().split('');//获取数组
			$(this).toggleClass("checkedCurrent");
			if($(this).hasClass("checkedCurrent")){
				$(this).val(1);
			}else{
				$(this).val(0);
			}
			
			
	});
	//	连接类型的点击事件
	$(".russia_static .radio2").on('click',function(){//1关闭  0打开
		var this_v=$(this).children("input").val();
		var this_name=$(this).children("input").attr("name");
		if(this_v=="dhcp"){
			$(this).parents(".russia_static").siblings(".russia_static_address").addClass("off");
				if(this_name=="russia_rdio"){
					$("#russia_other_dns1_tips").removeClass("hidden");
				}else if(this_name=="russia_l2tp_rdio"){
					$("#other_l2tp_dns1_tips").removeClass("hidden");
				}else if(this_name=="russia_pptp_rdio"){
					$("#other_pptp_dns1_tips").removeClass("hidden");
				}
		}else{
			$(this).parents(".russia_static").siblings(".russia_static_address").removeClass("off");
				if(this_name=="russia_rdio"){
					$("#russia_other_dns1_tips").addClass("hidden");
				}else if(this_name=="russia_l2tp_rdio"){
					$("#other_l2tp_dns1_tips").addClass("hidden");
				}else if(this_name=="russia_pptp_rdio"){
					$("#other_pptp_dns1_tips").addClass("hidden");
				}
		}
//		console.log($(this).parents(".russia_static").siblings(".russia_static_address"))
	})
//	router.init.welcome.getParamStatus();
	login_name();
//	configurationState();
});
