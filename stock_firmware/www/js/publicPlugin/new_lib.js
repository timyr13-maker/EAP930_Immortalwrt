
//Point Class
function Point(x, y) {
    this.x = x;
    this.y = y;
}

//获取一个页面元素的绝对坐标
function getPosition(obj) {
    var p = new Point(0, 0);
    while (obj) {
        p.x = p.x + obj.offsetLeft;
        p.y = p.y + obj.offsetTop;
        obj = obj.offsetParent;
    }
    return p;
}


//MessageBox Class
function MessageBox(msg, position, errorId) {
    this.msg = msg || null;
    this.position = position || null;
    this.error = errorId || null;
    if (typeof MessageBox._initialized == "undefined") {
        if (!this.type) {

            MessageBox.prototype.Obj = document.createElement("div");
            MessageBox.prototype.Obj.id = "_MessageBox_";
            MessageBox.prototype.Obj.className = "MessageBox";
            MessageBox.prototype.Obj.appendChild(document.createElement("div"));
            MessageBox.prototype.Obj.firstChild.className = "MessageBox_div";
            MessageBox.prototype.Show = MessageBox.prototype.showMsg;


            MessageBox.prototype.Hide = function () {
                this.Obj.style.visibility = "hidden";
            }
        }
        else {
            MessageBox.prototype.error = errorId;
            MessageBox.prototype.Show = MessageBox.prototype.showErrMsg;
            MessageBox.prototype.Hide = MessageBox.prototype.hideErrMsg;
        }
        MessageBox._initialized = true;
    }

}
MessageBox.prototype.showMsg = function (_msg, _position) {
    var obj = this.Obj;
    obj.style.visibility = "visible";

    if (_msg)
        obj.firstChild.innerHTML = _msg;
    else
        obj.firstChild.innerHTML = this.msg;

    if (_position) {
        obj.style.left = (_position.x) + "px";
        obj.style.top = (_position.y) + "px";
    }
    else {
        obj.style.left = (this.position.x) + "px";
        obj.style.top = (this.position.y) + "px";
    }
    document.body.appendChild(this.Obj);
    $(obj).height($(this.Obj.firstChild).height() + 22);
};
MessageBox.prototype.showErrMsg = function () {
    var me = this;
    $(".error-msg").html(me.msg).css("visibility", "visible");
    if (typeof me.error == "string") {
        $("#" + me.error).addClass("err-line");
    }
    else {
        for (var i = 0; i < me.error.length; i++) {
            $("#" + me.error[i]).addClass("err-line");
        }
    }
//                setTimeout(function () {
//                    $('.error-msg').html("").css('visibility', 'hidden');
//                    $(".err-line").removeClass('err-line');
//                }, 2000);
};
MessageBox.prototype.hideErrMsg = function () {
    $(".error-msg").html("").css("visibility", "hidden");
    $(".err-line").removeClass("err-line");
};

function hide_msgbox() {
    var msgbox = new MessageBox();
    if (msgbox) {
        msgbox.Hide();
    }
}

$(document).ready(function(){
	$("body").mousedown(function (event) {
        hide_msgbox();
    });
});

function Msg(options){
	var defaults = {
		dom:'<div id="lock_div"></div>' + 
			'<div id="message_layer">' + 
			'	<div id="msg_type"></div>' +
			'	<div id="msg" class="word"></div>' + 
			'</div>',
		type:"",
		message:"",
		autFadeTimer:null,
		autoFade:true,//弹出层是否消失
		autoFadeTime:3//弹出层消失时间
	};
	this.options = $.extend(defaults,options);
	//内置常用错误消息
	this.options.template = {
			save:{
				type:"wait",
				message:L.saveMsg
			},
			success:{
				type:"success",
				message:L.sucMsg
			},
			error:{
				type:"error",
				message:L.errMsg
			},
			wait:{
				type:"wait",
				message:L.waitMsg
			},
			file_type_error: {
				type: "error",
				message:L.updateMsg
			},
			exception:{
				type:"error",
				message:L.exceptionMsg
			},
			msg_info:{
				type:"msg-info",
				message:L.msgInfo
			}
	};
	this.init();
} 

Msg.prototype.init = function(){
	var me = this;
	$("body").append(me.options.dom);
	me.addEvent();
};

Msg.prototype.print = function(type,message){
	var me = this;
	
	type = !!me.options.template[type] ? type : "warning";
	message = message || (!!me.options.template[type] ? me.options.template[type].message : "");
	
	var iconStr = "";
	if(type == "wait" || type == "save"){
		iconStr = '<div class="three-quarter-spinner"></div>';
	}
	else if(type == "success"){
		iconStr = '<span class="line tip"></span><span class="line long"></span>';
	}
	else if(type == "error"){
		iconStr = '<span class="x-mark"><span class="line left"></span><span class="line right"></span></span>';
	}
	else if(type == "warning"){
		iconStr = '<span class="body"></span><span class="dot"></span>';
	}
	
	$("#msg_type").attr("class", type).html(iconStr);
	$("#msg").html(message);
	
	if(type == "wait" || type == "save")
		me.options.autoFade = false;
	else
		me.options.autoFade = true;
	
};

Msg.prototype.show = function(){
	var me = this;
	
	if(me.options.autFadeTimer)
		window.clearTimeout(me.options.autFadeTimer);
	
	if(!$("#lock_div").hasClass("show")){
		me.setMsgSize();
		$("#message_layer").addClass("show");
	
		me.setLockSize();
		$("#lock_div").addClass("show");
	}
	
	//success有两种情况，第一种是锁屏要消失，一种是不消失，等待下个操作
	
    if (me.options.autoFade) {
		me.options.autFadeTimer = window.setTimeout(function(){
			me.hide();
		},me.options.autoFadeTime * 1000);
    }
};

Msg.prototype.hide = function(){
	$("#message_layer").removeClass("show");
	$("#lock_div").removeClass("show");
};

Msg.prototype.setLockSize = function(){
	$("#lock_div").css({
		"width":$(document).width(),
		"height":document.documentElement.clientHeight+document.documentElement.scrollTop+document.body.scrollTop+"px"
	});
};

Msg.prototype.setMsgSize = function(){
	var obj = $("#message_layer");
	obj.css({
		left:(parseInt(document.documentElement.scrollWidth) - obj.outerWidth()) / 2 + "px",
		top:(document.documentElement.clientHeight - obj.outerHeight()) / 2 + "px"
	});
};

Msg.prototype.addEvent = function(){
	var me = this;
	$(window).off("resize scroll").on("resize scroll",function () {
		var _state1 = $("#lock_div").css("display");
		if (_state1 == "block") {
			me.setLockSize();
		}
		
		var _state2 = $("#message_layer").css("display");
		if (_state2 == "block") {
			me.setMsgSize();
		}
	});
};
//browser
var browser = {
    versions: function () {
        var u = navigator.userAgent, app = navigator.appVersion;
        return {
            trident: u.indexOf('Trident') > -1, //IE内核
            presto: u.indexOf('Presto') > -1, //opera内核
            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,//火狐内核
            mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            android: u.indexOf('Android') > -1, //android终端
            iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
            iPad: u.indexOf('iPad') > -1, //是否iPad
			iPod: u.indexOf('iPod') > -1, //是否iPod
            webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
            symbian: u.indexOf('Symbian') > -1, //symbian
			BlackBerry: u.indexOf('BlackBerry') > -1, //BlackBerry
			webOS: u.indexOf('webOS') > -1, //webOS
			WinPhone: u.indexOf('Windows Phone') > -1, //Windows Phone
			IEMobile: u.indexOf('IEMobile') > -1, //IEMobile
			OperaMini: u.indexOf('Opera Mini') > -1, //Opera Mini
			Tablet:u.indexOf('Tablet') > -1,//平板
            mac: u.indexOf('Mac OS X') > -1, //Mac OS X
            linux: u.indexOf('Linux') > -1 //Linux
        };
    }(),
    language: (navigator.browserLanguage || navigator.language).toLowerCase()
}

var timer = {};

var E = hasTouch=function(){
	var obj = {};
	obj.isSupportTouch = "ontouchend" in document ? true : false;
	obj.Event = obj.isSupportTouch ? 'tap' : 'click';
	return obj.Event;
}();
function show_differ_tip(elem,msg,options) {
   var defaults = {
		errorLabel:"<label class=\"invalid\">"+ msg +"</label>"
	};
	Validator.prototype.elem = (typeof elem == "string")? $("#" + elem) : elem;
	Validator.prototype.errorTimeOut = null;
	Validator.prototype.options = $.extend(defaults,options);
	Validator.prototype.init(msg);
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
	}, 1000 * 2)
};

Validator.prototype.showError = function(){
	this.removeError();
	this.elem.parent().append(this.options.errorLabel);
}

Validator.prototype.removeError = function(){
	this.elem.parent().find(".invalid").remove();
}
//检测返回结果是否满足重定向条件（6 -32001 -32002重定向到登录页）

function check_data(data){
	if(isApp().app){
		if(location.pathname!="/index.html"){
			if(data){
				if(data.error){
					if(data.error.code==-32001 || data.error.code==-32002){
						window.location.replace("index.html");
						return false;
					}
					else
						return true;
				}
				else{
					if(data.result[0]==6){
						window.location.replace("index.html");
						return false;
					}else{
						return true;
					}
				}
			}
			else{
				window.location.replace("index.html");
				return false;
		}
	}else{
		return true;
	}
			
		
	}else{
	
		if(location.pathname!="/login.html"){
			if(data){
				if(data.error){
					if(data.error.code==-32001 || data.error.code==-32002){
						location.href = "./login.html";
						return false;
					}
					else
						return true;
				}
				else{
					if(data.result[0]==6){
						location.href = "./login.html";
						return false;
					}else{
						return true;
					}
				}
			}
			else{
				location.href = "./login.html";
				return false;
		}
	}else{
		return true;
	}
		
	}
	
}

function check_input(key,needRecover) {
	var map = reg_map[key];
	for(var i in map){
		var _input = $("#" + map[i].id);
		var reg_val = _input.val();
		var len = _input.attr("maxlength");
		
		if(!!map[i].type)
			var types = map[i].type.split(' ');
		else
			continue;
		
		if (reg_val == '') {
			if (map[i].type.indexOf("noneed") != -1) {
				continue;
			}
	   }

		for (var p in types) {
			if (types[p] == "noneed")
				continue;
			var reg_type = types[p];
			
			var res = check_map[reg_type](reg_val,_input);//有些校验可能需要值以外的其他参数
			
			if (res == true) {
				var tmp = {};
				tmp.value = reg_val;
				tmp.maxLength = len;
				res = CheckLength(tmp);
				if(res != true){
					$("#" + map[i].id).val(tmp.value);
					if(needRecover){
						return map[i].id;
					}
					else{
						new Validator(_input,res);
						return false;	
					}

				}
			}

			if (res != true) {
				if(needRecover){
					return map[i].id;
				}
				else{
					new Validator(_input,res);
					return false;	
				}
			}
		}
	}
	return true;
}
function CheckLength(strTemp) {
    var i, sum, count;
    count = strTemp.value.length;
    sum = 0;
	var maxLength = strTemp.maxLength;
	if(maxLength>0) {
		for (i = 0; i < count; i++) {
			var charCode = strTemp.value.charCodeAt(i); 
			if (charCode < 0x007f) { //127
				sum += 1; 
			}
			else if ((0x0080 <= charCode) && (charCode <= 0x07ff)) { //128-2047
				sum += 2; 
			}
			else if ((0x0800 <= charCode) && (charCode <= 0xffff)) { //2048-65535
				sum += 3; 
			} 
			if (sum > maxLength) {
				var v = strTemp.value.substring(0, i);
				strTemp.value = v;
				return L.exceed_max;
			}
		}
	}
    return true;
}

function get_msgbox(id, type) {
    var _input;
    if (typeof(id) == "object") {
        _input = id;
    }
    else {
        _input = document.getElementById(id);
    }
    if (_input == null)
        return;
    var point_xy = getPosition(_input);
    point_xy.x += _input.clientWidth + 10;
    if (_input.nodeName.toLowerCase() == "select")
        point_xy.y -= 20;
    else
        point_xy.y -= _input.clientHeight;
    var reg_val = _input.value;
    var types = type.split(' ');

    for (var p in types) {
        if (types[p] == "noneed")
            continue;
        var reg_type = types[p];
        var res = check_map[reg_type](reg_val);
        if (res == true)res = CheckLength(_input);
        if (res != true) {
            var msgbox = new MessageBox(res, point_xy);
            msgbox.Show();
            return false;
        }
    }
    return true;
}

function check_pwd_differ(val1, val2) {
    var ss;
    if (val2 == "") {
        ss = L.comfirm_pwd;
        return ss;
    }
    else {
        if (val1 != val2) {
            ss = L.pwd_differ;
            return ss;
        }
        else
            return true;
    }
}


var reg_map = {
    i_wired_frm: [],
    quick_wired_frm: [],
	dandelion_networking_frm:[
		{id: "dandelion_admin", type: "string"},
		{id: "dandelion_password", type: "string"},
	],
    diagnosis_ip:[
    	{id: "domain_name", type: "string_blank"},
    ],
	captive_portal_frm:[
		{id: "nasid", type: "string"},
	],
	captive_portal_wifisystem_frm:[
		{id: "password", type: "password"},
	],
    wan_setup_pppoe:[
    	{id: "mtu", type: "pppoe_mtu"},
    	{id: "UserName", type: "string"},
        {id: "Password", type: "password"},
       	{id: "ipv4_dns1", type: "dns noneed"},
       	{id: "ipv4_dns2", type: "dns noneed"},
   
    ],
    wan_setup_vlanid:[
    	{id: "VLANID", type: "between_the_two"},
    ],
    wan_setup_dhcp:[
 	   	{id: "mtu", type: "mtu"},
    	{id: "ipv4_dns1", type: "dns noneed"},
       	{id: "ipv4_dns2", type: "dns noneed"},
    ],
   wan_setup_static: [
  	 	{id: "mtu", type: "mtu"},
        {id: "IPAddress", type: "ip"},
        {id: "subnetMask", type: "mask"},
        {id: "gateWay", type: "getway"},
        {id: "ipv4_dns1", type: "dns"},
        {id: "ipv4_dns2", type: "dns noneed"}
    ],
    wan_setup_lan_frm: [
        {id: "Static_IPAddress", type: "lan_ip"},
        {id: "Static_SubnetMask", type: "mask"},
    ],
    wan_setup_lan_frm2: [
        {id: "Static_SAddress", type: "lan_ip"},
        {id: "Static_EAddress", type: "lan_ip"},
    ],
    port_filter_frm:[
		{id: "name", type: "string"},
		{id: "src_ip", type: "lan_ip"},
		{},
		//{id: "src_port", type: "port"},
		{id: "dest_ip", type: "lan_ip"},
		{}
		//{id: "dest_port", type: "port"}
	],
	acc_set_frm0:[
		/*{id: "sch_name", type: "not_null"},*/
		{id: "start_hour0", type: "hour"},
		{id: "start_minute0", type: "minute"},
		{id: "end_hour0", type: "hour"},
		{id: "end_minute0", type: "minute"}
	],
	acc_set_frm1:[
		/*{id: "sch_name", type: "not_null"},*/
		{id: "start_hour1", type: "hour"},
		{id: "start_minute1", type: "minute"},
		{id: "end_hour1", type: "hour"},
		{id: "end_minute1", type: "minute"}
	],
	extend_frm:[
		{},
		{}
	],
    i_equipment_name_frm: [
    	{id: "equipment_name", type: "string"}
    ],
    host_name_frm:[
    	{id: "host-name", type: "string"}
    ],
    i_wireless_frm: [
        {id: "ssid", type: "string"}/*,
         {id:"wirel_key",type:"password eq8_63"}	*/
    ],
    login_frm: [
        {id: "login_pwd", type: "password"}
    ],
    qos_frm:[
    	 {id: "upward_text", type: "int"},
    	  {id: "down_text", type: "int"}
    ],
    host_name: [
        {id: "w_name_modify", type: "string"}
    ],
    wireless_base_2_4_frm: [
        {id: "wire_2_4_ssid", type: "string"}
    ],
	wireless_base_5_frm: [
        {id: "wire_5_ssid", type: "string"}
    ],
     dual_frequency_ssid_frm:[
    	 {id: "wire_dual_frequency_ssid", type: "string"}
    ],
    firewall_frm:[
    	{id: "firewall_ip", type: "ip"},
    	{id: "firewall_mac", type: "mac"},
    	{id: "firewall_remarks", type: "string noneed"}
    ],
     dual_frequency_password_frm:[
    	 {id: "wireless_dual_frequency_key_val", type: "password eq8_63"}
    ],
     weifSetUp24:[
    	{id: "wire_2_4_ssid", type: "string"},
    	{id: "wireless_2_4_key_val", type: "password eq8_63"}
    ],
     weifSetUp5:[
    	{id: "wire_5_ssid", type: "string"},
    	{id: "wireless_5_key_val", type: "password eq8_63"}
    ],
    external_network_ipv6_dhcp:[//ipv6 dhcp
    	{id: "ipv6_dhcp_dns_name", type: "ipv6_ip"},
        {id: "ipv6_dhcp_dns_name2", type: "ipv6_ip noneed"}	
    ],
    external_network_ipv6_static:[//ipv6 静态
    	{id: "ipv6_static_ip", type: "ipv6_ip"},
    	{id: "ipv6_static_ip_prefix", type: "prefix7_128"},
    	
    	
    	{id: "ipv6_wan_setup_gw", type: "ipv6_ip"}
    ],
    external_ipv6_static_ipprefix:[
    	{id: "ipv6_static_ipprefix", type: "ipv6_ip"},
    	{id: "ipv6_wanprefix", type: "prefix8_64"},
    ],
    external_network_aftr:[
    	{id: "ipv6_aftr", type: "char_not"},
    ],
    external_network_ipv6_pppoe:[//ipv6 pppoe
     	{id: "user_name_ipv6", type: "string"},
       	{id: "user_password_ipv6", type: "password eq8_63"},
       	{id: "server_name_ipv6", type: "string_blank noneed"},
       	{id: "ac_name_ipv6", type: "string_blank noneed"},
       	{id: "wan_setup_mtu_ipv6", type: "pppoe_mtu_ipv6"},	
    ],
    external_network_ipv6_pppoe_dns:[
    	{id: "ipv6_pppoe_dns_name", type: "ipv6_ip"},
        {id: "ipv6_pppoe_dns_name2", type: "ipv6_ip noneed"}  
    ],
    weifSetUpAll:[
    	{id: "wire_2_4_ssid", type: "string"},
    	{id: "wire_5_ssid", type: "string"}
    ],
    weifSetUpAll_encryption:[
    	{id: "wire_2_4_ssid", type: "string"},
    	{id: "wireless_2_4_key_val", type: "password eq8_63"},
    	{id: "wire_5_ssid", type: "string"}
    	
    ],
    http_iport:[
		{id:"port_http_iport",type:"port"}
	],
	ssh_iport:[
		{id:"port_ssh_iport",type:"port"}
	],
	https_iport:[
		{id:"port_https_iport",type:"port"}
	],
	ftp_iport:[
		{id:"port_ftp_iport",type:"port"}
	],
	telnet_iport:[
		{id:"port_telnet_iport",type:"port"}
	],
	wireless_advance_frm_2g: [
        {id: "wireless_fragment_2g", type: "fragment"},
        {id: "wireless_RTSThreshold_2g", type: "RTSThreshold"}
    ],
    wireless_advance_frm_5g: [
        {id: "wireless_fragment_5g", type: "fragment"},
        {id: "wireless_RTSThreshold_5g", type: "RTSThreshold"}
    ],
	wisp_frm:[
        {id:"ssid_flag",type:"string"}
    ],
	ap_frm:[
		{id:"ap_ssid",type:"string"},
		{},//密码动态验证
		{id:"upside",type:"ap_up_speed"},
        {id:"downside",type:"ap_down_speed"},
        {id:"access_number",type:"int"}
	],
	wireless_advance_frm_2: [
        {id: "wireless_fragment", type: "fragment"},
        {id: "wireless_RTSThreshold", type: "RTSThreshold"},
        {id: "deny_ip", type: "ip"}
    ],
    user_pwd_frm: [
//      {id: "igd_webs_old_password", type: "password"},
        {id: "igd_webs_password1", type: "password eq8_63"},
        {id: "igd_webs_password2", type: "password eq8_63"}
    ],
    system_time_frm: [
        {id: "system_year", type: "year"},
        {id: "system_month", type: "mounth"},
        {id: "system_day", type: "day"},
        {id: "system_hour", type: "hour"},
        {id: "system_minute", type: "minute"},
        {id: "system_second", type: "second"}
    ],
    wan_dhcp_form: [
		{id: "wan_setup_mtu1", type: "mtu"},
        {id: "wan_setup_mac1", type: "mac"},
        {id: "wan_setup_dns11", type: "dns noneed"},
        {id: "wan_setup_dns12", type: "dns noneed"}
    ],
	wan_vlan_form:[
		{id: "vlan_id", type: "prefix25_4094"},
	],
    wan_static_form: [
        {id: "wan_setup_ip2", type: "ip"},
        {id: "wan_setup_mask2", type: "mask"},
        {id: "wan_setup_gw2", type: "getway"},
        {id: "wan_setup_mac2", type: "mac"},
		{id: "wan_setup_mtu2", type: "mtu"},
        {id: "wan_setup_dns21", type: "dns"},
        {id: "wan_setup_dns22", type: "dns noneed"}
    ],
     static_routing_tab:[//routing_tab是自己封装的
    	{id: "static_ip_wan", type: "ip"},
    	{id: "static_mask_wan", type: "mask"},
    	{id: "gateway_value", type: "ip"}
    ],
    wan_pppoe_form: [
        {id: "wan_setup_user0", type: "string"},
        {id: "wan_setup_pass0", type: "password"},
        {id: "wan_setup_mac0", type: "mac"},
		{id: "wan_setup_mtu0", type: "pppoe_mtu"},
//      {id: "wan_setup_out_time0", type: "pppoe_out_time"},
        {id: "server_name0", type: "string_blank noneed"},
        {id: "ac_name0", type: "string_blank noneed"},
        {id: "wan_setup_dns01", type: "dns noneed"},
        {id: "wan_setup_dns02", type: "dns noneed"}
    ],
    wan_dhcp_form_advance: [
        {id: "wan_setup_mtu1", type: "mtu"},
        {id: "wan_setup_dns11", type: "dns noneed"},
        {id: "wan_setup_dns12", type: "dns noneed"}
    ],
    wan_static_form_advance: [
        {id: "wan_setup_mtu2", type: "mtu"}
    ],
//  俄罗斯接入russia pppoe
    wan_russia_pppoe_form: [
        {id: "russia_user", type: "string"},
        {id: "russia_pass", type: "password"},
        {id: "wan_setup_mac3", type: "mac"},
		{id: "russia_mtu", type: "pppoe_mtu"},
        {id: "russia_pppoe_server_name0", type: "string_blank noneed"},
        {id: "russia_ac_name0", type: "string_blank noneed"},
        {id: "russia_dns01", type: "dns noneed"},
        {id: "russia_dns02", type: "dns noneed"}
    ],
    wan_russia_pppoe_static_state_form: [
        {id: "russia_user", type: "string"},
        {id: "russia_pass", type: "password"},
        {id: "wan_setup_mac3", type: "mac"},
		{id: "russia_mtu", type: "pppoe_mtu"},
		{id: "russia_other_ipaddr", type: "ip"},
		{id: "russia_other_netmask", type: "mask"},
		{id: "russia_other_gateway", type: "getway"},
		
        {id: "russia_pppoe_server_name0", type: "string_blank noneed"},
        {id: "russia_ac_name0", type: "string_blank noneed"},
        {id: "russia_dns01", type: "dns"},
        {id: "russia_dns02", type: "dns noneed"}
    ],
   //  俄罗斯接入russia L2TP
   wan_russia_L2TP_form: [
        {id: "russia_l2tp_user", type: "string"},
        {id: "russia_l2tp_pass", type: "password"},
        {id: "wan_setup_mac4", type: "mac"},
		{id: "russia_l2tp_mtu", type: "russia_l2tp_mtu"},
		{id: "l2tp_domain_id", type: "string_blank"},//ip地址和域名2选1暂未完成
      
       
        {id: "russia_l2tp_dns01", type: "dns noneed"},
        {id: "russia_l2tp_dns02", type: "dns noneed"}
    ],
    wan_russia_L2TP_static_state_form: [
         {id: "russia_l2tp_user", type: "string"},
        {id: "russia_l2tp_pass", type: "password"},
        {id: "wan_setup_mac4", type: "mac"},
		{id: "russia_l2tp_mtu", type: "russia_l2tp_mtu"},
		{id: "l2tp_domain_id", type: "string_blank"},//ip地址和域名2选1暂未完成
		{id: "other_ipaddr_l2tp", type: "ip"},
		{id: "other_netmask_l2tp", type: "mask"},
		{id: "other_gateway_l2tp", type: "getway"},
		
       
        
        {id: "russia_l2tp_dns01", type: "dns"},
        {id: "russia_l2tp_dns02", type: "dns noneed"}
    ],
    //  俄罗斯接入russia pptp
    wan_russia_pptp_form: [
        {id: "russia_pptp_user", type: "string"},
        {id: "russia_pptp_pass", type: "password"},
        {id: "wan_setup_mac5", type: "mac"},
		{id: "russia_pptp_mtu", type: "pppoe_russia_mtu"},
		{id: "pptp_domain_id", type: "string_blank"},//ip地址和域名2选1暂未完成
       
       
        {id: "russia_pptp_dns01", type: "dns noneed"},
        {id: "russia_pptp_dns02", type: "dns noneed"}
    ],
    wan_russia_pptp_static_state_form: [
         {id: "russia_pptp_user", type: "string"},
        {id: "russia_pptp_pass", type: "password"},
        {id: "wan_setup_mac5", type: "mac"},
		{id: "russia_pptp_mtu", type: "pppoe_russia_mtu"},
		{id: "pptp_domain_id", type: "string_blank"},//ip地址和域名2选1暂未完成
		{id: "other_ipaddr_pptp", type: "ip"},
		{id: "other_netmask_pptp", type: "mask"},
		{id: "other_gateway_pptp", type: "getway"},
		
       
     
        {id: "russia_pptp_dns01", type: "dns"},
        {id: "russia_pptp_dns02", type: "dns noneed"}
    ],
  
    wan_static_advance: [],
    wan_pppoe_form_advance: [
        {id: "wan_setup_mtu0", type: "pppoe_mtu"},
        {id: "server_name0", type: "string_blank noneed"},
        {id: "ac_name0", type: "string_blank noneed"},
        {id: "wan_setup_dns01", type: "dns noneed"},
        {id: "wan_setup_dns02", type: "dns noneed"}
    ],
    lan_setup_frm: [
        {id: "lan_ip_address", type: "lan_ip"},
        {id: "lan_sub_mask", type: "mask"},
    ],
    lan_setup_frm_2: [
        {id: "dhcp_pool_start", type: "lan_ip"},
        {id: "dhcp_pool_end", type: "lan_ip"},
    ],
	lan_setup_more_frm:[
		{id: "lan_ip_address", type: "lan_ip"},
		{id: "dhcpStart", type: "lan_ip"},
		{id: "dhcpEnd", type: "lan_ip"},
		{id: "dhcp_leasetime", type: "int"},
		{id: "dhcp_dns1", type: "dns"},
		{id: "dhcp_dns2", type: "dns noneed"},
	],
	lan_setup_vlan_id_frm:[
		{id: "lan_vlan_id", type: "prefix25_4094"},
	],
/*	dhcp_addr_frm:[
		{id: "dhcp_addr_mac", type: "mac"},
        {id: "dhcp_addr_ip", type: "ip"}
	],*/
	dhcpBindTab:[],
    timed_reboot_form: [
        {id: "hour", type: "hour"},
        {id: "minute", type: "minute"}
    ],
	dmz_set: [
        {id: "dmz_ip_address", type: "in_ip"}
    ],
    dmz_set1: [
        {id: "dmz_ip_address1", type: "in_ip"}
    ],
    dmz_set2: [
        {id: "dmz_ip_address2", type: "in_ip"}
    ],
    dmz_set3: [
        {id: "dmz_ip_address3", type: "in_ip"}
    ],
    dmz_set4: [
        {id: "dmz_ip_address4", type: "in_ip"}
    ],
    g_time_segment: [
        {id: "g_start_hour", type: "hour"},
        {id: "g_start_min", type: "minute"},
        {id: "g_end_hour", type: "hour"},
        {id: "g_end_min", type: "minute"}
    ],
    lan_host: [
        {id: "lan_filter_ip", type: "ip"}
    ],
    lan_sub_host: [
        {id: "lan_filter_ip", type: "ip"},
        {id: "lan_filter_mask", type: "mask"}
    ],
    lan_ip_host: [
        {id: "lan_filter_ip", type: "ip"},
        {id: "lan_filter_mask", type: "ip"}
    ],
	ddnsform: [
		{id: "user_id", type: "char"},
		{id: "user_password", type: "string"},
		{id: "ddns_status", type: "char"}
	],
	led_ctrl_frm: [
		{id: "start_hour", type: "hour"},
		{id: "start_min", type: "minute"},
		{id: "end_hour", type: "hour"},
		{id: "end_min", type: "minute"}
	],
	led_ctrl_frm2: [
		{id: "start_hour2", type: "hour"},
		{id: "start_min2", type: "minute"},
		{id: "end_hour2", type: "hour"},
		{id: "end_min2", type: "minute"}
	],
    net_auth_frm: [
        {id: "user", type: "string"},
        {id: "pass", type: "password"}
    ],
	filter_arp_bind:[
		{id:"filter_arp_ip", type: "ip"},
		{id:"filter_arp_mac", type: "mac"},
		{id:"filter_arp_name", type: "string noneed"}
	],
	filter_arp_defense: [
    ],
	second_protect_set_frm: [
		{id: "question3",type: "string"}
	],
	port_a: [
        {id: "dest_port_a", type: "port"}
    ],
    port_b: [
        {id: "dest_port_a", type: "port"},
        {id: "dest_port_a", type: "port"}
    ],
    virtual_service_frm: [
        {id: "virtual_name", type: "string"},
        {id: "virtual_in_ip", type: "in_ip"},
        {id: "src_port_a", type: "port"},
        {id: "src_port_b", type: "port noneed"}
    ],
	wifi_ctrl_frm: [
		{id: "start_hour", type: "hour"},
		{id: "start_min", type: "minute"},
		{id: "end_hour", type: "hour"},
		{id: "end_min", type: "minute"}
	],
	iptv_vlan:[//ipv6 dhcp
    	{id: "internet_vlan_id", type: "between_the_two"}, 
    	{id: "iptv_vlan_id", type: "between_the_two"}, 
    	{id: "ip_phone_vlan_id", type: "between_the_two"}, 
    ],
    ac_24g:[
    	{id: "stamax_24g", type: "prefix0_32"}, 
    	{id: "assoc_24g", type: "prefix0_100"}, 
    	{id: "disassoc_24g", type: "prefix0_100"}
    ],
    ac_5g:[
    	{id: "stamax_5g", type: "prefix0_32"}, 
    	{id: "assoc_5g", type: "prefix0_100"}, 
    	{id: "disassoc_5g", type: "prefix0_100"}
    ],
    dhcp_address_reservation:[
  	  {id: "dhcp_name", type: "string_blank"}, 
    	{id: "dhcp_mac", type: "mac"}, 
    	{id: "dhcp_ip", type: "in_ip"}
    ],
    policy_routing_tab:[//routing_tab是自己封装的
    	{id: "routing_id", type: "string"},
    ],
     policy_routing_tab_host:[//源主机
     	
    	{id: "routing_id", type: "string"},
    	{id: "clrouting_set_filter_ip", type: "spe_ip"},
    	{id: "clrouting_set_filter_mask", type: "mask"},
    ],
     policy_routing_tab_wan:[//目的主机
   	
    	{id: "routing_id", type: "string"},
    	{id: "clrouting_set_filter_ip_wan", type: "spe_ip"},
    	{id: "clrouting_set_filter_mask_wan", type: "mask"}
    ],
    policy_routing_tab_domain:[
    	{id: "realm_name", type: "char"},
    ],
    iptv_vlan_id_frm:[
    	{id: "iptv_vlan_id", type: "prefix0_4094"},
    ],
    pptp_client_frm:[
    	{id: "pptp_client_server_addr", type: "nin_ip_url"},
    	{id: "pptp_client_server_port", type: "port"},
    	{id: "pptp_client_user", type: "pptp_l2tp"},
    	{id: "pptp_client_pass", type: "password_blank"},
    ],
    l2tp_client_frm:[
    	{id: "l2tp_client_server_addr", type: "nin_ip_url"},
    	{id: "l2tp_client_user", type: "pptp_l2tp"},
    	{id: "l2tp_client_pass", type: "password_blank"},
    ],
    policy_routing_tab_all:[
   		
    	{id: "routing_id", type: "string"},
    	{id: "clrouting_set_filter_ip", type: "spe_ip"},
    	{id: "clrouting_set_filter_mask", type: "mask"},
    	{id: "clrouting_set_filter_ip_wan", type: "spe_ip"},
    	{id: "clrouting_set_filter_mask_wan", type: "mask"}
    ],
	cwmp_frm:[
		{id: "acs_url", type: "url1"},
		{id: "acs_username", type: "string"},
		{id: "acs_password", type: "password"},
		//{id: "access_path", type: "url"},
		{id: "access_username", type: "string"},
		{id: "access_password", type: "password"},
		{id: "access_port", type: "port"}
	],
	inform_frm:[
		{id: "inform_interval", type: "int"}
	],
	url_filter_frm:[
		{id: "url", type: "char"}
	],
	stun_frm:[
		{id: "stun_url", type: "char"},
		{id: "stun_port", type: "port"},
		{id: "stun_username", type: "string noneed"},
		{id: "stun_password", type: "password noneed"}
	],
	restart_frm: [
		{id: "hour", type: "hour"},
		{id: "min", type: "minute"},
		{id: "sec", type: "second"},
	],
	restart_ac_frm: [
		{id: "hour", type: "hour"},
		{id: "min", type: "minute"},
	],
	wireless_settings_ssid_frm:[
		{id: "wifi_name_select", type: "string"},	
	],
	wireless_settings_password_frm:[
		{id: "wifi_key", type: "password eq8_63"},	
	],
	apc_ac_advanced_setting_frm:[
		{id: "maxStaNum_24", type: "prefix0_32"}, 
    	{id: "assoc_24g", type: "prefix0_100"}, 
    	{id: "disassoc_24g", type: "prefix0_100"}, 
    	{id: "maxStaNum_5", type: "prefix0_32"},
    	{id: "assoc_5g", type: "prefix0_100"}, 
    	{id: "disassoc_5g", type: "prefix0_100"}, 
   ],
   apc_ac_dhcp_frm:[
   		{id: "ac_ip", type: "ip"},
        {id: "ac_mask", type: "mask"},
        {id: "ac_gw", type: "getway"},
         {id: "ac_dns", type: "dns"},
   ],
 captive_portal_frm:[
		{id: "nasid", type: "string"},
	],
	captive_portal_manul_frm:[
		{id: "local_network", type: "string"},
		{id: "captive_portal_ur", type: "string noneed"},
		{id: "uam_server", type: "string"},
		{id: "uam_secret", type: "string noneed"},
		{id: "radius_server1", type: "string"},
		{id: "radius_server2", type: "string noneed"},
		{id: "radius_secret", type: "string noneed"},
		{id: "radius_nas_id", type: "string"},
		
		{id: "radius_name", type: "string noneed"},
		{id: "radius_location_id", type: "string noneed"},
		{id: "preferred_dns", type: "dns"},
		{id: "alternate_dns", type: "dns noneed"},
		{id: "leasetime", type: "int"},
		{id: "coa_port", type: "int noneed"},
		{id: "uamAllowed_0", type: "string noneed"},
		{id: "uamDomain_0", type: "string"},
		
	],
	captive_portal_wifisystem_frm:[
		
		{id: "password", type: "password"},
	],
 sch_set_frm:[
		/*{id: "sch_name", type: "not_null"},*/
		{id: "start_hour", type: "hour"},
		{id: "start_minute", type: "minute"}
	],
	wlan_mode_frm: [
		{id: "wifi-pwd", type: "password eq8_63"}
	],
   openvpn_client_frm:[
       {id: "openvpn_client_desc", type: "int_letter"},
       {id: "openvpn_client_username", type: "string noneed"},
   	{id: "openvpn_client_password", type: "password noneed"},
   	{id: "openvpn_client_ip", type: "ip_domain"}
   ],
   openvpn_server_frm:[
   	{id: "openvpn_server_ip", type: "ip_network"},
   	{id: "openvpn_server_mask", type: "mask"},
   	{id: "openvpn_server_port", type: "port"}
   ],
 wireguard_server_frm: [
        { id: "address", type: "ip_cidr" },
        { id: "port", type: "port" },
        { id: "public_key", type: "public_key" }
    ],
    wireguard_client_list_frm:[
        {id: "wireguard_client_desc", type: "string noneed"},
		{id: "client_public_key", type: "public_key"},
		{id: "allowed_ips", type: "ip_basic"}
    ],
	wireguard_client_frm:[
        {id: "address", type: "ip_cidr"},
		{id: "public_key", type: "public_key"},
		{id: "endpoint_port", type: "port"},
        {id: "endpoint_host", type: "ip_basic"},
        {id: "server_public_key", type: "public_key"}
    ],
	captive_portal_frm:[
		{id: "nasid", type: "string"},
	],
	captive_portal_wifisystem_frm:[
		{id: "password", type: "password"},
	],
	pppoe_server_config_frm: [
		{id: "pppoe_server_address", type: "ip_basic"},
		{id: "pppoe_mask", type: "mask"},
		{id: "pppoe_dhcpStart", type: "ip_basic"},
		{id: "pppoe_dhcpEnd", type: "ip_basic"},
		{id: "pppoe_server_dns1", type: "dns noneed"},
		{id: "pppoe_server_dns2", type: "dns noneed"},
		{id: "pppoe_server_vlan_id", type: "prefix0_4094"},
		{id: "lcp_quantity", type: "int"},
	],
	pppoe_white_add_ip_form: [
		{id: "add_ip_comment", type: "string noneed"},
		{id: "add_ip_dhcp_start", type: "ip_basic"},
		{id: "add_ip_dhcp_end", type: "ip_basic"},
	],
	pppoe_white_edit_ip_form: [
		{id: "edit_ip_comment", type: "string noneed"},
		{id: "edit_ip_dhcp_start", type: "ip_basic"},
		{id: "edit_ip_dhcp_end", type: "ip_basic"},
	],
	pppoe_white_edit_mac_form: [
		{id: "edit_mac", type: "mac"},
		{id: "edit_mac_comment", type: "string noneed"},
	],
	account_management_form: [
		{id: "account_management_name", type: "string"},
		{id: "account_management_pwd", type: "password"},
		{id: "band_up", type: "int"},
		{id: "band_down", type: "int"},
		{id: "max_session", type: "int"},
		{id: "max_connection", type: "int"},
		{id: "account_management_comment", type: "string noneed"},
	],
   
   wan_header_dhcp_form: [
   	{id: "wan_setup_dhcp_dns1", type: "dns noneed"},
   	{id: "wan_setup_dhcp_dns2", type: "dns noneed"}
   ],
   wan_header_pppoe_form: [
   	{id: "wan_setup_pppoe_user", type: "string"},
   	{id: "wan_setup_pppoe_password", type: "password"},
   ],
    noneed: []
}

var check_map = {
    "int": check_int,
    decimal: check_decimal,
	char:check_char,
	char_not:check_char_not,
    string: check_string,
    string_blank: check_string_blank,
	pppoe_string:check_pppoe_string,
	nin_ip_url:check_nin_ip_url,
    int_letter: check_int_letter,
    password: check_password,
    password_blank: check_password_blank,
    medium_p:medium_password,
    ip: check_ip,
    ip_basic:check_ip_basic,
     pptp_l2tp: check_pptp_l2tp,
    spe_ip:check_spe_ip,
	ip_fourth:check_ip_fourth,
	in_ip: check_in_ip,
	in_ip2: check_in_ip2,
    getway: check_getway,
    lan_ip: check_lan_ip,
    dns: check_dns,
    port: check_port,
    mask: check_mask,
    mac: check_mac,
    mtu: check_mtu,
    pppoe_mtu: check_pppoe_mtu,
    pppoe_mtu_ipv6: check_pppoe_mtu_ipv6,
    pptp_l2tp_mtu: check_pptp_l2tp_mtu,
    russia_l2tp_mtu:check_russia_l2tp_mtu,
    pppoe_russia_mtu:check_pppoe_russia_time,
    pppoe_out_time: check_pppoe_out_time,
	spe_ip:check_spe_ip,
	ip_network:check_ip_network,
    year: check_year,
    mounth: check_month,
    day: check_day,
    hour: check_hour,
    minute: check_min,
    second: check_sec,
    calendar: check_calendar,
    url: check_url,
    ip_url: check_ip_url,
    ip_cidr:check_ip_cidr,
	url1:check_acs_url,
	domain:domain_name,
	arp_rate:check_arp_rate,
	ap_up_speed:check_ap_up_speed,
	ap_down_speed:check_ap_down_speed,
	fragment: check_fragment,
	RTSThreshold: check_RTSThreshold,
    eq5: check_eq5,
    eq4_20: check_eq4_20,
    eq6_20: check_eq6_20,
    eq8_63: check_eq8_63,
    eq8_30: check_eq8_30,
	eq8_31: check_eq8_31,
	eq8_32: check_eq8_32,
	eq8_63: check_eq8_63,
	eq8_64: check_eq8_64,
    between_the_two: check_between_the_two,
    noneed: null,
    ipv6_ip:isIPv6,
    prefix0_32:ip6prefix_32,
    prefix8_64:ip6prefix_64,
    prefix0_100:ip6prefix_100,
    prefix7_128:ip6prefix_128,
	prefix0_256:ip6prefix_256,
     prefix0_4094:ip0prefix_4094,
	   prefix25_4094:ip25prefix25_4094,
    isipv6_endNumber:isIPv6_endNumber,
    public_key:check_public_key,
	ip_domain:check_ip_domain,
   // domain:domain_name, //校验域名
	phone_num:check_phone_num //校检电话号码
}
//检查输入的数据在某范围内
function check_between_the_two(ipt_str, min, max) {
	 var ret = check_int(ipt_str);
	  var ss = L.before_range + "(" + min + "---" + max + ")"+ L.after_range;
    if (true != ret)
        return ret;
    if (parseFloat(ipt_str) < parseFloat(min) || parseFloat(ipt_str) > parseFloat(max)) {
        return ss;
    }

    return true;
}
//检查nin_ip+url
function check_nin_ip_url(str) {
    var flg = 0;
    if (str == "") {
        var ss = L.server_addr_not_null;
        return ss;
    }
    for (var h = 0; h < str.length; h++) {
        cmp = "0123456789.";
        var tst = str.substring(h, h + 1);
        if (cmp.indexOf(tst) < 0) {
            flg++;
        }
    }
    if (flg != 0) {//url
        var ss = check_url(str);
        if (ss != true)
            return ss;
    }
    else {//ip
        var ss = check_in_ip(str);
        if (ss != true)
            return ss;
    }
    return true;
}
function ip6prefix_32(str){
	var ret = check_int(str);
	var t=L.number0_32;
	 if (true != ret)
        return ret;
	if(str>=0 && str<=32){
		return true;
	}else{
		return t;
	}
}
function ip0prefix_4094(str){
	var ret = check_int(str);
	var t=L.number0_4094;
	 if (true != ret)
        return ret;
	if(str>=0 && str<=4094){
		return true;
	}else{
		return t;
	}
}
function ip25prefix25_4094(str){
	var ret = check_int(str);
	var t=L.number25_4094;
	 if (true != ret)
        return ret;
	if(str>=25 && str<=4094){
		return true;
	}else{
		return t;
	}
}

//把ip地址转一下,方便比较
function ipToint(ip){
	var num =0;
	ip=ip.split(".");
	num=Number(ip[0])*256*256*256+Number(ip[1]*256*256+Number(ip[2])*256+Number(ip[3]));
	num=num>>>0;
	return num;
}

function ip6prefix_100(str){
	var ret = check_int(str);
	var t=L.number0_100;
	 if (true != ret)
        return ret;
	if(str>=0 && str<=100){
		return true;
	}else{
		return t;
	}
}
//检测域名的合法性
function domain_name(data){
//	 var reg = /[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/;
//  if(reg.test(data)){
//  	return true;
//  }else{
//  	var t=L.domain_name_title;
//  	return t;
//  }
	var ret = /^((?:(?:(?:\w[\.\-\+]?)*)\w)+)((?:(?:(?:\w[\.\-\+]?){0,62})\w)+)\.(\w{2,6})$/; 
    if(!ret.test(data))
		return L.domain_name_title;
	return true;
}
//IPV6地址判断 
function isIPv6(str)
{ 
//	var reg=/^([\da-fA-F]{1,4}:){6}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^::([\da-fA-F]{1,4}:){0,4}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:):([\da-fA-F]{1,4}:){0,3}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){2}:([\da-fA-F]{1,4}:){0,2}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){3}:([\da-fA-F]{1,4}:){0,1}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){4}:((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$|^:((:[\da-fA-F]{1,4}){1,6}|:)$|^[\da-fA-F]{1,4}:((:[\da-fA-F]{1,4}){1,5}|:)$|^([\da-fA-F]{1,4}:){2}((:[\da-fA-F]{1,4}){1,4}|:)$|^([\da-fA-F]{1,4}:){3}((:[\da-fA-F]{1,4}){1,3}|:)$|^([\da-fA-F]{1,4}:){4}((:[\da-fA-F]{1,4}){1,2}|:)$|^([\da-fA-F]{1,4}:){5}:([\da-fA-F]{1,4})?$|^([\da-fA-F]{1,4}:){6}:$/
    var reg=/^([\da-fA-F]{1,4}:){6}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)|::([\da−fA−F]1,4:)0,4((25[0−5]|2[0−4]\d|[01]?\d\d?)\.)3(25[0−5]|2[0−4]\d|[01]?\d\d?)|^([\da-fA-F]{1,4}:):([\da-fA-F]{1,4}:){0,3}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)|([\da−fA−F]1,4:)2:([\da−fA−F]1,4:)0,2((25[0−5]|2[0−4]\d|[01]?\d\d?)\.)3(25[0−5]|2[0−4]\d|[01]?\d\d?)|^([\da-fA-F]{1,4}:){3}:([\da-fA-F]{1,4}:){0,1}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)|([\da−fA−F]1,4:)4:((25[0−5]|2[0−4]\d|[01]?\d\d?)\.)3(25[0−5]|2[0−4]\d|[01]?\d\d?)|^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}|:((:[\da−fA−F]1,4)1,6|:)|^[\da-fA-F]{1,4}:((:[\da-fA-F]{1,4}){1,5}|:)|([\da−fA−F]1,4:)2((:[\da−fA−F]1,4)1,4|:)|^([\da-fA-F]{1,4}:){3}((:[\da-fA-F]{1,4}){1,3}|:)|([\da−fA−F]1,4:)4((:[\da−fA−F]1,4)1,2|:)|^([\da-fA-F]{1,4}:){5}:([\da-fA-F]{1,4})?|([\da−fA−F]1,4:)6:$/
    if(reg.test(str)){
    	return true;
    }else{
    	var t=L.correct_input_ipv6Ip;
    	return t;
    }
}

function ip6prefix_64(str){
	if(str>=7 && str<=64){
		return true;
	}else{
		var t=L.number7_65;
		return t;
	}
}
function ip6prefix_32(str){
	var ret = check_int(str);
	var t=L.number0_32;
	 if (true != ret)
        return ret;
	if(str>=0 && str<=32){
		return true;
	}else{
		return t;
	}
}
function ip6prefix_100(str){
	var ret = check_int(str);
	var t=L.number0_100;
	 if (true != ret)
        return ret;
	if(str>=0 && str<=100){
		return true;
	}else{
		return t;
	}
}
function ip6prefix_128(str){
	if(str>=7 && str<=128){
		return true;
	}else{
		var t=L.number7_128;
		return t;
	}
}
function ip6prefix_256(str){
	if(str>=0 && str<=256){
		return true;
	}else{
		var t=L.number0_256;
		return t;
	}
}

//IPV6地址后面的数字
function isIPv6_endNumber(str){
	var reg=/^[1-9]$|^[1-9]\d$|^1[01]\d$|^12[0-8]$/
	if(reg.test(str)){
    	return true;
    }else{
    	var t=L.correct_input_ipv6Ip_endNumber;
    	return t;
    }
}
//检查整数
function check_int(str) {
    if (str == "" || str == null) {
        var ss = L.non_null_integer;
        return ss;
    }
    var cmp = '0123456789';
    var buf = str;
    for (var h = 0; h < buf.length; h++) {
        var tst = buf.substring(h, h + 1);
        if (cmp.indexOf(tst) < 0) {
            var ss = L.non_numeric_char;
            return ss;
        }
    }
    return true;
}

//检查小数
function check_decimal(str) {
    if (str == "" || str == null) {
        var ss = L.non_null_decimal;
        return ss;
    }
    var cmp = '0123456789.';
    var buf = str;
    for (var h = 0; h < buf.length; h++) {
        var tst = buf.substring(h, h + 1);
        if (cmp.indexOf(tst) < 0) {
            var ss = L.non_decimal_char;
            return ss;
        }
    }
    if (str.split(".")[0] == '' || str.split(".").length > 2 || str.split(".")[1] == '') {
        var ss = L.digital_format_incorrect;
        return ss;
    }
    return true;
}

function check_string(str) {//基类
    if (str == "" || str == null) {
        var ss = L.non_null_string;
        return ss;
    }
    var cmp = '\\\'"<>&|$ ';
    var buf = str;
    for (var h = 0; h < buf.length; h++) {
        var tst = buf.substring(h, h + 1);
        if (cmp.indexOf(tst) >= 0) {
            var ss = L.not_illegal_char + cmp;
            return ss;
        }
    }
    return true;
}

//不含中文
function check_char(str) {
    if (str == "" || str == null) {
        var ss = L.char_not_null;
        return ss;
    }
    var cmp = '\\\'"<>%&';
    var buf = str;
    for (var h = 0; h < buf.length; h++) {
        var tst = buf.substring(h, h + 1);
        if (cmp.indexOf(tst) >= 0) {
            var ss = L.char_not_illegal + cmp;
            return ss;
        }
        if (tst.charCodeAt(0) < 0 || tst.charCodeAt(0) > 255) {
            var ss = L.char_not_chinese;
            return ss;
        }
    }
    return true;
}
//不含中文非必填
function check_char_not(str) {
    
    var cmp = '\\\'"<>';
    var buf = str;
    for (var h = 0; h < buf.length; h++) {
        var tst = buf.substring(h, h + 1);
        if (cmp.indexOf(tst) >= 0) {
            var ss = L.char_not_illegal + cmp;
            return ss;
        }
        if (tst.charCodeAt(0) < 0 || tst.charCodeAt(0) > 255) {
            var ss = L.char_not_chinese;
            return ss;
        }
    }
    return true;
}
function check_string_blank(str) {
    if (str == "" || str == null) {
        var ss = L.non_null_string;
        return ss;
    }
    var cmp = '\\\'"<> ';
    var buf = str;
    for (var h = 0; h < buf.length; h++) {
        var tst = buf.substring(h, h + 1);
        if (cmp.indexOf(tst) >= 0) {
            var ss = L.not_illegal_char + cmp + L.and + L.blank;
            return ss;
        }
    }
    return true;
}

function check_pppoe_string(str) {
    if (str == "" || str == null) {
        var ss = L.non_null_string;
        return ss;
    }
    var cmp = '\'"<> ';
    var buf = str;
    for (var h = 0; h < buf.length; h++) {
        var tst = buf.substring(h, h + 1);
        if (cmp.indexOf(tst) >= 0) {
            var ss = L.not_illegal_char + cmp + L.and + L.blank;
            return ss;
        }
    }
    return true;
}

function check_int_letter(str) {
    if (str == "" || str == null) {
        var ss = L.non_null_string;
        return ss;
    }
    var cmp = '0123456789abcdefghijklmnopqrstuvwxyz' + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var buf = str;
    for (var h = 0; h < buf.length; h++) {
        var tst = buf.substring(h, h + 1);
        if (cmp.indexOf(tst) < 0) {
            var ss = L.non_alphanumeric_char;
            return ss;
        }
    }
    return true;
}

function check_password(str) {
    if (str == "" || str == null) {
        var ss = L.pwd_not_empty;
        return ss;
    }
    var cmp = '\\\'"<>';
    var buf = str;
    for (var h = 0; h < buf.length; h++) {
        var tst = buf.substring(h, h + 1);
        if (cmp.indexOf(tst) >= 0) {
            var ss = L.not_illegal_char + cmp;
            return ss;
        }
        // if (tst.charCodeAt(0) < 0 || tst.charCodeAt(0) > 255) {
        //     var ss = L.not_chinese;
        //     return ss;
        // }
    }
    return true;
}

function check_password_blank(str) {
    if (str == "" || str == null) {
        var ss = L.pwd_not_empty;
        return ss;
    }
    var cmp = '\\\'"<> ';
    var buf = str;
    for (var h = 0; h < buf.length; h++) {
        var tst = buf.substring(h, h + 1);
        if (cmp.indexOf(tst) >= 0) {
            var ss = L.not_illegal_char + cmp + L.and + L.blank;
            return ss;
        }
        if (tst.charCodeAt(0) < 0 || tst.charCodeAt(0) > 255) {
            var ss = L.not_chinese;
            return ss;
        }
    }
    return true;
}

function check_ip_url(str) {
    var flg = 0;
    if (str == "") {
        var ss = L.server_addr_not_null;
        return ss;
    }
    for (var h = 0; h < str.length; h++) {
        cmp = "0123456789.";
        var tst = str.substring(h, h + 1);
        if (cmp.indexOf(tst) < 0) {
            flg++;
        }
    }
    if (flg != 0) {//url
        var ss = check_url(str);
        if (ss != true)
            return ss;
    }
    else {//ip
        var ss = check_ip(str);
        if (ss != true)
            return ss;
    }
    return true;
}
function check_ip(str) {
    return check_ip_come(str, true);
}

function check_lan_ip(str) {
    return check_ip_come(str, false);
}
function check_spe_ip(str){
	 return check_ip_come(str, false,true);
}
function check_pptp_l2tp(str) {
   
    if (str == "" || str == null) {
        var ss = L.char_not_null;
        return ss;
    }
    var cmp = '\\\'"<> ';
    var buf = str;
    for (var h = 0; h < buf.length; h++) {
        var tst = buf.substring(h, h + 1);
        if (cmp.indexOf(tst) >= 0) {
            var ss = L.char_not_illegal + cmp + L.and + L.blank;
            return ss;
        }
        if (tst.charCodeAt(0) < 0 || tst.charCodeAt(0) > 255) {
            var ss = L.cannot_contain_chinese;
            return ss;
        }
    }
    return true;
}
//检查ip合法性
function check_ip_come(str, check_lan_ip_b,check_ip_c) {
    var flg = 0;
    if (str == "") {
        var ss = L.ip_not_null;
        return ss;
    }
    for (var h = 0; h < str.length; h++) {
        cmp = "0123456789.";
        var tst = str.substring(h, h + 1);
        if (cmp.indexOf(tst) < 0) {
            flg++;
        }
    }
    if (flg != 0) {
        var ss = L.ip_invalid_format;
        return ss;
    }
    var str2 = str.split(".");
    if (str2.length != 4) {
        var ss = L.ip_incorrect_len;
        return ss;
    }
    for (var h = 0; h < str2.length; h++) {
        if (str2[h] == "") {
            var ss =L.ip_val_not_null;
            return ss;
        }
		if (str2[h].length > 3) {
            var ss = L.ip_incorrect_len;
            return ss;
        }
        if (str2[h] > 255 || str2[h] < 0) {
            var ss =L.ip_range;
            return ss;
        }
    }
    if (str2[0] == 0) {
        var ss = L.firsr_section_not_zero;
        return ss;
    }
   /* if (str2[3] == "0") {
        var ss = L.four_section_not_zero
        return ss;
    }*/
    if (str2[0] == 1 && str2[1] == 0 && str2[2] == 0 && str2[3] == 0) {
        var ss = L.ip_incorrect;
        return ss;
    }
    if (str2[0] == 255 && str2[1] == 255 && str2[2] == 255 && str2[3] == 255) {
        var ss = L.ip_incorrect;
        return ss;
    }
    if (str2[0] == 127) {
        var ss = L.not_loopback_addr;
        return ss;
    }
    if (str2[0] >= 224 && str2[0] <= 239) {
        var ss = L.not_multicast_addr;
        return ss;
    }
    if (str2[0] >= 240) {
        var ss = L.ip_reserve_addr;
        return ss;
    }
    if (check_lan_ip_b) {
        if (str == ROUTE_INFO.lan_ip) {
            var ss = L.not_lan_ip_addr;
            return ss;
        }
    }
    if (str == ROUTE_INFO.lan_mask) {
        var ss = L.not_lan_mask_addr;
        return ss;
    }
	if(!check_ip_c){//指定第三个参数就不校验网络地址和广播地址了
		var ret = check_ip_mask(str);
		if (ret != true) {
            return ret;
        }
		else
			return true;
	}
    return true;
}

//检查getway合法性
function check_getway(str) {
    var flg = 0;
    if (str == "") {
        var ss = L.getway_not_null;
        return ss;
    }
    for (var h = 0; h < str.length; h++) {
        cmp = "0123456789.";
        var tst = str.substring(h, h + 1);
        if (cmp.indexOf(tst) < 0) {
            flg++;
        }
    }
    if (flg != 0) {
        var ss = L.getway_num;
        return ss;
    }
    var str2 = str.split(".");
    if (str2.length != 4) {
        var ss = L.getway_incorrect_len;
        return ss;
    }
    for (var h = 0; h < str2.length; h++) {
        if (str2[h] == "") {
            var ss = L.getway_not_null;
            return ss;
        }
		if (str2[h].length > 3) {
            var ss = L.ip_incorrect_len;
            return ss;
        }
        if (str2[h] > 255 || str2[h] < 0) {
            var ss = L.getway_range;
            return ss;
        }
    }
    if (str2[0] == 0) {
        var ss = L.getway_firsr_section_not_zero;
        return ss;
    }
    if (str2[3] == "0") {
        var ss = L.getway_four_section_not_zero
        return ss;
    }
    if (str2[0] == 1 && str2[1] == 0 && str2[2] == 0 && str2[3] == 0) {
        var ss = L.getway_incorrect;
        return ss;
    }
    if (str2[0] == 255 && str2[1] == 255 && str2[2] == 255 && str2[3] == 255) {
        var ss = L.getway_incorrect;
        return ss;
    }
    if (str2[0] == 127) {
        var ss = L.getway_not_loopback_addr;
        return ss;
    }
    if (str2[0] >= 224 && str2[0] <= 239) {
        var ss = L.getway_not_multicast_addr;
        return ss;
    }
    if (str2[0] >= 240) {
        var ss = L.getway_reserve_addr;
        return ss;
    }
    if (str == ROUTE_INFO.lan_ip) {
        var ss = L.not_lan_getway_addr;
        return ss;
    }
    if (str == ROUTE_INFO.lan_mask) {
        var ss = L.getway_not_lan_mask_addr;
        return ss;
    }
    var lanIpArray = ROUTE_INFO.lan_ip.split(".");
    var maskArray = ROUTE_INFO.lan_mask.split(".");
    var andIp255 = "", andIp0 = "";
    for (var i = 0; i < 4; i++) {
        var ipItem = (lanIpArray[i] * 1) & (maskArray[i] * 1);
        andIp255 += ipItem ? ipItem : 255;
        andIp0 += ipItem;
        if (i != 3) {
            andIp0 += ".";
            andIp255 += ".";
        }
    }
    if (str == andIp255) {

        var ss = L.getway_broadcast_addr;
        return ss;
    }
    if (str == andIp0) {
        var ss = L.getway_network_addr;
        return ss;
    }
    return true;
}
//检查dns合法性
function check_dns(str) {
    if (str == "") {
        var ss = L.dns_not_null;
        return ss;
    }
    var reg = /^(|((22[0-3])|(2[0-1]\d)|(1\d\d)|([1-9]\d)|[1-9])(\.((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d)){3})$/;
    flag = reg.test(str);
    if (!flag) {
        var ss = L.dns_format_incorrect;
        return ss;
    }
    var str2 = str.split(".");
    if (str2[0] == 127 || str2[3] == 0) {
        var ss = L.dns_format_incorrect;
        return ss;
    }
    return true;
}

//检查端口
function check_port(str) {
    if (str == "" || str == null) {
        var ss = L.port_not_null;
        return ss;
    }
    var cmp = '0123456789';
    var buf = str;
    for (var h = 0; h < buf.length; h++) {
        var tst = buf.substring(h, h + 1);
        if (cmp.indexOf(tst) < 0) {
            var ss = L.port_non_numeric_char;
            return ss;
        }
    }
    if (parseInt(str, 10) > 65535 || parseInt(str, 10) < 1) {
        var ss = L.port_range;
        return ss;
    }
    return true;
}

//检查mask是否合法
function check_mask(str) {
    var strsub = str.split(".");
    if (str == "" || str == "0.0.0.0" || strsub.length != 4 || str == "255.255.255.255") {
        var ss = L.mask_err;
        return ss;
    }
	if(strsub[0] == 0)
		return L.mask_first_not_zero;
    for (var j = 0; j < strsub.length; j++) {
		var ret = check_int(strsub[j]);
		if (true != ret)
			return ret;
        strsub[j] = parseInt(strsub[j], 10);
        if (strsub[j] != 0 && strsub[j] != 128 && strsub[j] != 192 && strsub[j] != 224 && strsub[j] != 240 && strsub[j] != 248 &&
            strsub[j] != 252 && strsub[j] != 254 && strsub[j] != 255) {
            var ss = L.mask_err;
            return ss;
        }
    }
    if (parseInt(strsub[0], 10) != 255 && parseInt(strsub[1], 10) != 0) {
        var ss = L.mask_format_err;
        return ss;
    }
    if (parseInt(strsub[1], 10) != 255 && parseInt(strsub[2], 10) != 0) {
        var ss = L.mask_format_err;
        return ss;
    }
    if (parseInt(strsub[2], 10) != 255 && parseInt(strsub[3], 10) != 0) {
        var ss = L.mask_format_err;
        return ss;
    }
    return true;
}

//检查mac是否合法
function check_mac(str) {
    var err_obj = new Object;
    err_obj.mac_addr_err = L.mac_err;
    if (str == "") {
        var ss = err_obj.mac_addr_err;
        return ss;
    }
    if (str == "00-00-00-00-00-00" || str == "00:00:00:00:00:00") {
        var ss = L.mac_not + "0";
        return ss;
    }
    var tmp_str = str.toUpperCase();
    if (tmp_str == "FF-FF-FF-FF-FF-FF" || tmp_str == "FF:FF:FF:FF:FF:FF") {
        var ss = L.mac_not + "F";
        return ss;
    }
    if (str.length != 17) {
        var ss = err_obj.mac_addr_err;
        return ss;
    }
    var pattern = "/^([0-9A-Fa-f]{2})(-[0-9A-Fa-f]{2}){5}|([0-9A-Fa-f]{2})(:[0-9A-Fa-f]{2}){5}/";
    eval("var pattern=" + pattern);
    var ck = pattern.test(str);
    if (ck == false) {
        var ss = err_obj.mac_addr_err;
        return ss;
    }
	var broadcast_addr_arr = ["1","3","5","7","9","B","D","F"];
	var letter = str.substring(1, 2).toUpperCase();
    for(var i in broadcast_addr_arr){
		if(letter == broadcast_addr_arr[i]){
			var ss = L.mac_broadcast_addr;
			return ss;	
		}
    }
    return true;
}

function check_mtu(str) {
    var ret = check_int(str);
    if (true != ret)
        return ret;
    if (parseInt(str, 10) > 1500 || parseInt(str, 10) < 576) {
        var ss = L.mtu_1500_576;
        return ss;
    }
    return true;
}

function check_pppoe_mtu(str) {
    var ret = check_int(str);
    if (true != ret)
        return ret;
    if (parseInt(str, 10) > 1492 || parseInt(str, 10) < 576) {
        var ss = L.mtu_1492_576;
        return ss;
    }
    return true;
}
function check_pppoe_mtu_ipv6(str) {
    var ret = check_int(str);
    if (true != ret)
        return ret;
    if (parseInt(str, 10) > 1480 || parseInt(str, 10) < 576) {
        var ss = L.mtu_1480_576;
        return ss;
    }
    return true;
}
function check_pptp_l2tp_mtu(str) {
    var ret = check_int(str);
    if (true != ret)
        return ret;
    if (parseInt(str, 10) > 1440 || parseInt(str, 10) < 576) {
        var ss = L.mtu_1440_576;
        return ss;
    }
    return true;
}
function check_russia_l2tp_mtu(str) {
    var ret = check_int(str);
    if (true != ret)
        return ret;
    if (parseInt(str, 10) > 1460 || parseInt(str, 10) < 576) {
        var ss = L.mtu_1460_576;
        return ss;
    }
    return true;
}
function check_pppoe_russia_time(str) {
    var ss = check_int(str);
    if (ss != true)
        return ss;
   if (parseInt(str, 10) > 1400 || parseInt(str, 10) < 576) {
        ss = L.mtu_1400_576;
        return ss;
    }
    return true;
}
function check_pppoe_out_time(str) {
    var ss = check_int(str);
    if (ss != true)
        return ss;
    if (str < 1 || str > 30) {
        ss = L.pppoe_out_time_range;
        return ss;
    }
    return true;
}

function check_fragment(str){
	var ss = check_int(str);
    if (ss != true)
        return ss;
    if (str < 256 || str > 2346) {
        ss = L.fragment_out_range;
        return ss;
    }
    return true;
}
function check_RTSThreshold(str){
	var ss = check_int(str);
    if (ss != true)
        return ss;
    if (str < 256 || str > 2347) {
        ss = L.RTSThreshold_out_range;
        return ss;
    }
    return true;
}

function check_year(str) {
    if (str == "" || str == null) {
        var ss = L.non_null_integer;
        return ss;
    }
    var cmp = '0123456789';
    var buf = str;
    for (var h = 0; h < buf.length; h++) {
        var tst = buf.substring(h, h + 1);
        if (cmp.indexOf(tst) < 0) {
            var ss = L.non_numeric_char;
            return ss;
        }
    }
    if (str<1970 || str > 2033) {
        var ss = L.year_ck;
        return ss;
    }
    return true;
}

function check_month(str) {
    if (str == "" || str == null) {
        var ss = L.non_null_integer;
        return ss;
    }
    var cmp = '0123456789';
    var buf = str;
    for (var h = 0; h < buf.length; h++) {
        var tst = buf.substring(h, h + 1);
        if (cmp.indexOf(tst) < 0) {
            var ss = L.non_numeric_char;
            return ss;
        }
    }
    if (parseInt(str, 10) <= 0) {
        var ss = L.month_range;
        return ss;
    }
    else if (parseInt(str, 10) > 12) {
        var ss = L.month_range;
        return ss;
    }

    return true;
}

function check_day(str) {
    var solarMonth = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
    if (str == "" || str == null) {
        var ss = L.non_null_integer;
        return ss;
    }
    var cmp = '0123456789';
    var buf = str;
    for (var h = 0; h < buf.length; h++) {
        var tst = buf.substring(h, h + 1);
        if (cmp.indexOf(tst) < 0) {
            var ss = L.non_numeric_char;
            return ss;
        }
    }
    var y = get_ctrl_year();
    var month = get_ctrl_month();
    var day = "";
    if (month == 2) {
        day = (((y % 4 == 0) && (y % 100 != 0) || (y % 400 == 0)) ? 29 : 28);
    }
    else {
        month = month - 1;
        day = solarMonth[month];
    }
    if (parseInt(str, 10) <= 0) {
    	if(day==undefined){
        	day=31;
        }
        var ss = L.day_range + day;
        
        return ss;
    }
    else if (parseInt(str, 10) > day) {
        var ss = L.day_range + day;
        return ss;
    }
    return true;
}

function check_acs_url(url){
	var urlPattern = new RegExp('^(https?:\\/\\/)?'+ // validate protocol
	'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // validate domain name
	'((\\d{1,3}\\.){3}\\d{1,3}))'+ // validate OR ip (v4) address
	'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // validate port and path
	'(\\?[;&a-z\\d%_.~+=-]*)?'+ // validate query string
	'(\\#[-a-z\\d_]*)?$','i'); // validate fragment locator
		
	if(!!urlPattern.test(url))
		return true;
	else
		return L.url_err;
}

function check_domain(str) { 
    var ret = /^((?:(?:(?:\w[\.\-\+]?)*)\w)+)((?:(?:(?:\w[\.\-\+]?){0,62})\w)+)\.(\w{2,6})$/.test(str); 
    if(!ret)
		return L.url_err;
	return true;
}

//单纯校验输入框是否为空
function check_not_null(str,obj){
	var msg = null;
	var lbl = $("label[for="+ obj.attr("id") +"]");
	if(lbl.length != 0)
		msg = lbl.text() + L.not_null;
	
	if (str == "" || str == null) {
        var ss = msg || L.not_null;
        return ss;
    }
	return true;
}


function check_ip_domain(str,obj) {
    var flg = 0;
   	var ss = check_not_null(str,obj);
	if (ss != true)
		return ss;
		
    for (var h = 0; h < str.length; h++) {
        cmp = "0123456789.";
        var tst = str.substring(h, h + 1);
        if (cmp.indexOf(tst) < 0) {
            flg++;
        }
    }
    if (flg != 0) {//url
        var ss = check_domain(str);
        if (ss != true)
            return ss;
    }
    else {//ip
        var ss = check_ip_basic(str);
        if (ss != true)
            return ss;
    }
    return true;
}

//检查ip合法性
function check_ip_basic(str) {
    var flg = 0;
    if (str == "") {
        var ss = L.ip_not_null;
        return ss;
    }
    for (var h = 0; h < str.length; h++) {
        cmp = "0123456789.";
        var tst = str.substring(h, h + 1);
        if (cmp.indexOf(tst) < 0) {
            flg++;
        }
    }
    if (flg != 0) {
        var ss = L.ip_invalid_format;
        return ss;
    }
    var str2 = str.split(".");
    if (str2.length != 4) {
        var ss = L.ip_incorrect_len;
        return ss;
    }
    for (var h = 0; h < str2.length; h++) {
        if (str2[h] == "") {
            var ss = L.ip_invalid_format;
            return ss;
        }
		if (str2[h].length > 3) {
            var ss = L.ip_invalid_format;
            return ss;
        }
        if (str2[h] > 255 || str2[h] < 0) {
            var ss = L.ip_invalid_format;
            return ss;
        }
    }
	
	
	if (str2[0] == 0) {
		var ss = L.firsr_section_not_zero;
		return ss;
	}
	if (str2[0] == 1 && str2[1] == 0 && str2[2] == 0 && str2[3] == 0) {
		var ss = L.ip_incorrect;
		return ss;
	}
	if (str2[0] == 255 && str2[1] == 255 && str2[2] == 255 && str2[3] == 255) {
		var ss = L.ip_incorrect;
		return ss;
	}
	
    return true;
}

function check_ip_network(str,obj){
	var ss = check_ip_basic(str);
    if (ss != true)
        return ss;
	var str2 = str.split(".");
	if (str2[0] == 127) {
		var ss = L.not_loopback_addr;
		return ss;
	}
	if (str2[0] >= 224 && str2[0] <= 239) {
		var ss = L.not_multicast_addr;
		return ss;
	}
	if (str2[0] >= 240) {
		var ss = L.ip_reserve_addr;
		return ss;
	}
	
	var mask = obj.attr("data-mask");
	
	var ss = check_ip_mask2(str,mask);
    if (ss != true)
        return ss;
	
	return true;
}

function GetIP(ip_str) {
    var ip = "";
    var obj = {};
    var ip_arr = ip_str.split(".");
    for (var i = 0; i < ip_arr.length; i++) {
        obj["ip" + i] = parseInt(ip_arr[i], 10);
        ip += IP2Bin(obj["ip" + i])
    }
    return ip;
}

function IP2Bin(ip) {
    var strIP = ip.toString(2);
    var len = strIP.length;
    if (len < 8) {
        for (var i = 0; i < 8 - len; i++) {
            strIP = "0" + strIP;
        }
    }
    return strIP;
}
function check_ip_cidr(str) {

    var cidrParts = str.split('/');
    var ip = cidrParts[0];

    var ip_check_result = check_ip_basic(ip);
    if (ip_check_result !== true) {
        return ip_check_result; // 如果 IP 地址部分无效，直接返回错误信息
    }

    // 如果没有斜杠或斜杠后没有前缀长度，说明格式不正确
    if (cidrParts.length !== 2) {
        return L.CIDRFormatInvalid;
    }

    var prefixLength = cidrParts[1];

    // 确保前缀长度是一个数字，并且在0到32之间
    if (!/^\d+$/.test(prefixLength)) {
        return L.PrefixLengthShouldBeNumber;
    }

    prefixLength = parseInt(prefixLength, 10);
    if (prefixLength < 0 || prefixLength > 32) {
        return L.PrefixLengthRangeInvalid;
    }

    // 如果 IP 地址部分有效，前缀长度也有效，返回 true
    return true;
}

function isBase64(str) {
    if (typeof str !== 'string' || str.length == 0) {
        return L.char_not_null;
    }
    
    // Base64 字符集：字母（大写和小写）、数字、`+`、`/`，并且可以以最多两个 `=` 作为填充
    var base64Regex = /^[A-Za-z0-9+/=]*$/;
    
    // 如果不符合 Base64 字符集，返回错误信息
    if (!base64Regex.test(str)) {
        return L.Base64CharacterSetInvalid;
    }
    
    // 检查长度是否是 4 的倍数，并且末尾可以包含一个或两个 `=`
    var length = str.length;
    if (length % 4 !== 0) {
        return L.Base64LengthInvalid;
    }
    
    // 处理填充 `=` 的情况，最多只能有两个 `=`
    var padding = str.indexOf('=') === -1 ? 0 : str.length - str.lastIndexOf('=') - 1;
    if (padding > 2) {
        return L.Base64PaddingInvalid;
    }
    
    return true;
}

function check_public_key(str){
    if (typeof str !== 'string' || str.length != 44 || isBase64(str) != true) {
        return L.PublicKeyFormatInvalid;
    }
    return true;
}

//时间戳转换
function format_fn(format, timestamp){  
    var a, jsdate=((timestamp) ? new Date(timestamp*1000) : new Date()); 
    var pad = function(n, c){ 
        if((n = n + "").length < c){ 
            return new Array(++c - n.length).join("0") + n; 
        } else { 
            return n; 
        } 
    }; 
    var txt_weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]; 
    var txt_ordin = {1:"st", 2:"nd", 3:"rd", 21:"st", 22:"nd", 23:"rd", 31:"st"}; 
    var txt_months = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];  
    var f = { 
        // Day 
        d: function(){return pad(f.j(), 2)}, 
        D: function(){return f.l().substr(0,3)}, 
        j: function(){return jsdate.getDate()}, 
        l: function(){return txt_weekdays[f.w()]}, 
        N: function(){return f.w() + 1}, 
        S: function(){return txt_ordin[f.j()] ? txt_ordin[f.j()] : 'th'}, 
        w: function(){return jsdate.getDay()}, 
        z: function(){return (jsdate - new Date(jsdate.getFullYear() + "/1/1")) / 864e5 >> 0}, 
        
        // Week 
        W: function(){ 
            var a = f.z(), b = 364 + f.L() - a; 
            var nd2, nd = (new Date(jsdate.getFullYear() + "/1/1").getDay() || 7) - 1; 
            if(b <= 2 && ((jsdate.getDay() || 7) - 1) <= 2 - b){ 
                return 1; 
            } else{ 
                if(a <= 2 && nd >= 4 && a >= (6 - nd)){ 
                    nd2 = new Date(jsdate.getFullYear() - 1 + "/12/31"); 
                    return date("W", Math.round(nd2.getTime()/1000)); 
                } else{ 
                    return (1 + (nd <= 3 ? ((a + nd) / 7) : (a - (7 - nd)) / 7) >> 0); 
                } 
            } 
        }, 
        
        // Month 
        F: function(){return txt_months[f.n()]}, 
        m: function(){return pad(f.n(), 2)}, 
        M: function(){return f.F().substr(0,3)}, 
        n: function(){return jsdate.getMonth() + 1}, 
        t: function(){ 
            var n; 
            if( (n = jsdate.getMonth() + 1) == 2 ){ 
                return 28 + f.L(); 
            } else{ 
                if( n & 1 && n < 8 || !(n & 1) && n > 7 ){ 
                    return 31; 
                } else{ 
                    return 30; 
                } 
            } 
        }, 
        
        // Year 
        L: function(){var y = f.Y();return (!(y & 3) && (y % 1e2 || !(y % 4e2))) ? 1 : 0}, 
        //o not supported yet 
        Y: function(){return jsdate.getFullYear()}, 
        y: function(){return (jsdate.getFullYear() + "").slice(2)}, 
        
        // Time 
        a: function(){return jsdate.getHours() > 11 ? "pm" : "am"}, 
        A: function(){return f.a().toUpperCase()}, 
        B: function(){ 
            // peter paul koch: 
            var off = (jsdate.getTimezoneOffset() + 60)*60; 
            var theSeconds = (jsdate.getHours() * 3600) + (jsdate.getMinutes() * 60) + jsdate.getSeconds() + off; 
            var beat = Math.floor(theSeconds/86.4); 
            if (beat > 1000) beat -= 1000; 
            if (beat < 0) beat += 1000; 
            if ((String(beat)).length == 1) beat = "00"+beat; 
            if ((String(beat)).length == 2) beat = "0"+beat; 
            return beat; 
        }, 
        g: function(){return jsdate.getHours() % 12 || 12}, 
        G: function(){return jsdate.getHours()}, 
        h: function(){return pad(f.g(), 2)}, 
        H: function(){return pad(jsdate.getHours(), 2)}, 
        i: function(){return pad(jsdate.getMinutes(), 2)}, 
        s: function(){return pad(jsdate.getSeconds(), 2)}, 
        //u not supported yet 
        
        // Timezone 
        //e not supported yet 
        //I not supported yet 
        O: function(){ 
            var t = pad(Math.abs(jsdate.getTimezoneOffset()/60*100), 4); 
            if (jsdate.getTimezoneOffset() > 0) t = "-" + t; else t = "+" + t; 
            return t; 
        }, 
        P: function(){var O = f.O();return (O.substr(0, 3) + ":" + O.substr(3, 2))}, 
        //T not supported yet 
        //Z not supported yet 
        
        // Full Date/Time 
        c: function(){return f.Y() + "-" + f.m() + "-" + f.d() + "T" + f.h() + ":" + f.i() + ":" + f.s() + f.P()}, 
        //r not supported yet 
        U: function(){return Math.round(jsdate.getTime()/1000)} 
    }; 
        
    return format.replace(/[\\]?([a-zA-Z])/g, function(t, s){ 
        if( t!=s ){ 
            // escaped 
            ret = s; 
        } else if( f[s] ){ 
            // a date function exists 
            ret = f[s](); 
        } else{ 
            // nothing special 
            ret = s; 
        } 
        return ret; 
    })
}
function get_ctrl_year() {
    var year;
    if (current_html == "system_time")
        year = $("#system_year").val();
    return year;
}

function get_ctrl_month() {
    var month;
    if (current_html == "system_time")
        month = $("#system_month").val();
    return month;
}

function check_hour(str) {
    if (str == "" || str == null) {
        var ss = L.non_null_integer;
        return ss;
    }
    var cmp = '0123456789';
    var buf = str;
    for (var h = 0; h < buf.length; h++) {
        var tst = buf.substring(h, h + 1);
        if (cmp.indexOf(tst) < 0) {
            var ss = L.non_numeric_char;
            return ss;
        }
    }
    if (parseInt(str, 10) < 0) {
        var ss = L.hour_range;
        return ss;
    }
    else if (parseInt(str, 10) > 23) {
        var ss = L.hour_range;
        return ss;
    }
    return true;
}

function check_min(str) {
    if (str == "" || str == null) {
        var ss = L.non_null_integer;
        return ss;
    }
    var cmp = '0123456789';
    var buf = str;
    for (var h = 0; h < buf.length; h++) {
        var tst = buf.substring(h, h + 1);
        if (cmp.indexOf(tst) < 0) {
            var ss = L.non_numeric_char;
            return ss;
        }
    }
    if (parseInt(str, 10) < 0) {
        var ss = L.minute_range;
        return ss;
    }
    else if (parseInt(str, 10) > 59) {
        var ss = L.minute_range;
        return ss;
    }
    return true;
}

function check_sec(str) {
    if (str == "" || str == null) {
        var ss = L.non_null_integer;
        return ss;
    }
    var cmp = '0123456789';
    var buf = str;
    for (var h = 0; h < buf.length; h++) {
        var tst = buf.substring(h, h + 1);
        if (cmp.indexOf(tst) < 0) {
            var ss = L.non_numeric_char;
            return ss;
        }
    }
    if (parseInt(str, 10) < 0) {
        var ss = L.second_range;
        return ss;
    }
    else if (parseInt(str, 10) > 59) {
        var ss = L.second_range;
        return ss;
    }
    return true;
}

//检验日期格式为YYYY-MM-DD
function check_calendar(str) {
    if (str == "" || str == null) {
        var ss = L.calendar_not_null;
        return ss;
    }
    var parts;
    var msg = L.calendar_format_err;
    if (str.indexOf("-") > -1) {
        parts = str.split('-');
    } else {
        return msg;
    }
    if (parts.length < 3) {
        return msg;
    }
    for (i = 0; i < 3; i++) {
        if (isNaN(parseInt(parts[i], 10))) {
            return msg;
        }
    }
    var y = parseInt(parts[0], 10);
    var m = parseInt(parts[1], 10);
    var d = parseInt(parts[2], 10);
    if (y < 1900 || y > 3000) {
        var ss = L.year_err;
        return ss;
    }
    if (m < 1 || m > 12) {
        var ss = L.month_err;
        return ss;
    }
    var ss_msg = L.day_err;
    if (d < 1 || d > 31) {
        return ss_msg;
    }
    switch (d) {
        case 29:
            if (m == 2) {
                if ((y % 4 == 0) && (y % 100 != 0)) {
                    return true;
                }
                else if (y % 400 == 0) {
                    return true;
                }
                else
                    return ss_msg;
            }
            break;
        case 30:
            if (m == 2)
                return ss_msg;
            break;
        case 31:
            if (m == 2 || m == 4 || m == 6 || m == 9 || m == 11)
                return ss_msg;
            break;
        default:
            break;
    }
    return true;
}

function check_url(str,flag) { //JK 20141210 待优化
    if (str == "" || str == null) {
        var ss = L.url_not_null;
        return ss;
    }
    var cmp = '\\\'"<>(),;+[]{} ';
    var buf = str;
	var arr = buf.split(".");
	if(arr.length == 1 && !!!flag)
		return L.url_err;
    for (var h = 0; h < buf.length; h++) {
        var tst = buf.substring(h, h + 1);
        if (tst == ".") {
            var temp = buf.substring(h + 1, h + 2);
            if (temp == "." || h == buf.length - 1) {
                var ss = L.url_err;
                return ss;
            }
        }
        if (cmp.indexOf(tst) >= 0) {
            var ss = L.not_illegal_char + cmp + L.and + L.blank;
            return ss;
        }
        if (tst.charCodeAt(0) < 0 || tst.charCodeAt(0) > 255) {
            var ss = L.not_chinese;
            return ss;
        }
    }
    return true;
}

function check_ip_fourth(str) {
    var ret = check_int(str);
    if (true != ret)
        return ret;
    if (str*1 < 0 || str*1 > 255) {
        var ss = L.ip_range;
        return ss;
    }
    return true;
}


function check_eq5(str) {
    var ss = L.eq_5;
    if (str.length != 5)
        return ss;
    return true;
}

function check_eq4_20(str) {
    var ss = L.eq4_20;
    if (str.length < 4 || str.length > 20)
        return ss;
    return true;
}

function check_eq6_20(str) {
    var ss = L.eq6_20;
    if (str.length < 6 || str.length > 20)
        return ss;
    return true;
}

function check_eq8_63(str) {
    var ss = L.eq8_63;
    if (str.length < 8 || str.length > 63)
        return ss;
    return true;
}
function check_eq8_64(str) {
    var ss = L.eq8_64;
    if (str.length < 8 || str.length > 64)
        return ss;
    return true;
}

function check_eq8_30(str) {
    var ss = L.eq8_30;
    if (str.length < 8 || str.length > 30)
        return ss;
    return true;
}
function check_eq8_31(str) {
    var ss = L.eq8_31;
    if (str.length < 8 || str.length > 31)
        return ss;
    return true;
}
function check_eq8_32(str) {
    var ss = L.eq8_32;
    if (str.length < 8 || str.length > 32)
        return ss;
    return true;
}

function GetIP(ip_str) {
    var ip = "";
    var obj = {};
    var ip_arr = ip_str.split(".");
    for (var i = 0; i < ip_arr.length; i++) {
        obj["ip" + i] = parseInt(ip_arr[i], 10);
        ip += IP2Bin(obj["ip" + i])
    }
    return ip;
}

function IP2Bin(ip) {
    var strIP = ip.toString(2);
    var len = strIP.length;
    if (len < 8) {
        for (var i = 0; i < 8 - len; i++) {
            strIP = "0" + strIP;
        }
    }
    return strIP;
}

function check_ip_mask(ip, mask) {
    var index = 0;
	var mask = mask || ROUTE_INFO.lan_mask;
    var mask_str = GetIP(mask);
    for (var i = 0; i < mask_str.length; i++) {
        if (mask_str.charAt(i) == "0") {
            index = i
            break;
        }
    }
    //
    var ip_str = "", ip_temp = "";
    ip_str = GetIP(ip);
    ip_temp = ip_str.substring(index, 32);
    //
    var cmp_str1 = "", cmp_str2 = "";
    for (var i = 0; i < ip_temp.length; i++) {
        cmp_str1 += "1";
        cmp_str2 += "0";
    }
    if (ip_temp == cmp_str1) {
        var ss = L.ip_broadcast_addr;
        return ss;
    }
    if (ip_temp == cmp_str2) {
        var ss = L.ip_network_addr;
        return ss;
    }
    return true;
}
function check_ip_mask2(ip, mask) {
    var index = 0;
	
    var mask_str = GetIP(mask);
    for (var i = 0; i < mask_str.length; i++) {
        if (mask_str.charAt(i) == "0") {
            index = i
            break;
        }
    }
    //
    var ip_str = "", ip_temp = "";
    ip_str = GetIP(ip);
    ip_temp = ip_str.substring(index, 32);
    //
    var cmp_str2 = "";
    for (var i = 0; i < ip_temp.length; i++) {
        cmp_str2 += "0";
    }

    if (ip_temp != cmp_str2) {
        var ss = L.ip_must_be_network_addr;
        return ss;
    }
    return true;
}
function check_getway_mask(ip, mask) {
    var index = 0;
    var mask_str = GetIP(mask);
    for (var i = 0; i < mask_str.length; i++) {
        if (mask_str.charAt(i) == "0") {
            index = i
            break;
        }
    }
    //
    var ip_str = "", ip_temp = "";
    ip_str = GetIP(ip);
    ip_temp = ip_str.substring(index, 32);
    //
    var cmp_str1 = "", cmp_str2 = "";
    for (var i = 0; i < ip_temp.length; i++) {
        cmp_str1 += "1";
        cmp_str2 += "0";
    }
    if (ip_temp == cmp_str1) {
        var ss = L.getway_broadcast_addr;
        return ss;
    }
    if (ip_temp == cmp_str2) {
        var ss = L.getway_network_addr;
        return ss;
    }
    return true;
}

//检查arp速率
function check_arp_rate(str){
	var ret = check_int(str);
	if(true != ret)return ret;
	if(str < 1 || str > 10)
	  return L.eq1_10;
	else
	return true;
}

//访客网络上下行
function check_ap_up_speed(str){
	var ss = check_int(str);
    if (ss != true) {
        return ss;
    }
    if (Number(str) > 12800) {
        ss = L.less12800;
        return ss;
    }
    return true;
}
function check_ap_down_speed(str){
	var ss = check_int(str);
    if (ss != true) {
        return ss;
    }
    if (Number(str) > 12800) {
        ss = L.less12800;
        return ss;
    }
    return true;
}
//检查在lan_ip段的ip
function check_in_ip(str) {
	if(str=="0.0.0.0"){
		return true;
	}
    var ipChkStr = check_ip(str);
    if (typeof ipChkStr == "string") {
        return ipChkStr;
    }
    var ipArray = str.split(".");
    if (ipArray.length != 4) {
        var ss = L.ip_incorrect_len;
        return ss;
    }
   
	return true;
}

function check_in_ip2(str) {
	if(str=="0.0.0.0"){
    	return true;
    }
	var ipChkStr = check_ip(str);
    if (typeof ipChkStr == "string") {
        return ipChkStr;
    }
   var ipArray = str.split(".");
    if (ipArray.length != 4) {
        var ss = L.ip_incorrect_len;
        return ss;
    }
    var lanIpArray = ROUTE_INFO.lan_ip.split(".");
    var maskArray = ROUTE_INFO.lan_mask.split(".");
   if(ipArray.length!=4){
   	return L.ip_invalid_format;
   }
  
   	 if(!getIsSameSegment(ipArray,maskArray,lanIpArray,maskArray))
		return L.in_ip;
    
 
	return true;
}

function check_phone_num(str){
	if (str.length === 0){
		return L.phone_not_null;
	}
	var phoneReg=/^1[3-9]\d{9}$/;
	if (!!!phoneReg.test(str)){
		return L.phone_format_incorrect;
	}
	return true;
}



var hideSelector = function(){
	$("body").mousedown(function (event) {
		var eo = $(event.target);
		if ($(".selector").is(":visible") &&  eo.parents(".selector").length == 0)
			$('.selector').find("ul").hide();
        hide_msgbox();
    });
}

//=======================page related================================

function dataDeal(data) {
    //debug
    if ((typeof data) == "string" && data.toString().indexOf("360LoginFlag") != -1) {
        location.href = "/login.html";
    }
    else {
        try {
            var tmp_data = eval("(" + data + ")");
            return tmp_data;
        }
        catch (e) {
            return false;
        }
    }
}


/*================================ by houbingyang start 菜单加载 ================================ */

var load_finish_flag = false;
(function () {
    //获取top菜单项
    var get_nav_return_a_fn = function () {
        var navHtml = $('<div class="nav"></div>');
        (function (menuObj, menuParentObj) {
            var ahtml;
            if (menuObj instanceof parent) {
                ahtml = $('<a href="javascript:void(0)"></a>');
                ahtml.off("click").on("click", function () {
                    menuObj.remove_child(menuObj.code);
                    window.history.go(-1);
                    //menuObj.initFn(menuObj.code, "init_" + menuObj.code)
                })
                var showText = menuObj.name + "&nbsp";
                if (menuObj.child instanceof parent) {
                    showText += ">";
                }
                ahtml.html(showText);
                navHtml.append(ahtml);
                arguments.callee(menuObj.child, menuObj);
            } else {
                var returnObj = menuParentObj.parent || menuParentObj;
                ahtml = $('<button class="return_a"></button>');
                ahtml.off("click").on("click", function () {
                    returnObj.remove_child(returnObj.code);
                    window.history.go(-1);
                    //returnObj.initFn(returnObj.code, "init_" + returnObj.code)
                })
                ahtml.html(L.s_return);
                navHtml.append(ahtml);
				ahtml.prev().off("click");	
            }
        })(PAGE_INFO.menu_parent);
        return navHtml;
    };

    //加载top菜单页

	
	var paint_info = function(menu){
		if(current_html == "nav_device_list")
			return;
		var str_1 = "",str_2 = "",str_3 = "",str_4 = "";
		for(var i in menu){
			if(i == "tab_title"){
				str_1 = "<span class=\"app_name\">"+ menu[i] +"</span>"
			}
			if(i == "author"){
				str_2 = "<span class=\"app_author\">" + L.issuer + "：" + menu[i] +"</span>"
			}
			if(i == "info"){
				str_3 = "<div id=\"app_detail_area\"><p>"+ L.app_intro + "：&nbsp;&nbsp;" + menu[i] +"</p></div>"
			}
			if(i == "tab_id"){
				str_4 = "<div id=\"app_img\"><img src=\"/images/"+ menu[i].substring(0,menu[i].length-4) +"_b.png\"></div>";
			}
		}
		var str = str_4 + "<div id=\"app_intro_list\"><div class=\"app_info\">" + str_1 + str_2 + "</div>" + str_3 + "</div>";
		$("#app_intro").html(str);
	};


//加载表单页  wifi设置上网设置等
    var load_sub_html = function (html_name, init_function, return_html_name) {
		//tmp add
		//分块加载
		$.ajax({
			type:"get",
			url: "./javascript/" + html_name + ".js",
            dataType: "script",
            beforeSend:function(xhr, settings){
				if(typeof localStorage != "undefined"){
					ROUTE_INFO.rid = localStorage.getItem('rid');
					ROUTE_INFO.phoneId = localStorage.getItem('phoneId');
					if(!!ROUTE_INFO.rid && !!ROUTE_INFO.phoneId){
						this.url = "/ubus?phoneId="+ROUTE_INFO.phoneId+"&rid="+ROUTE_INFO.rid;
						xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
					}
				}
			   },
			error:function(XMLHttpRequest, textStatus){
//				//if(XMLHttpRequest.status == 404){
					load_sub_html_callback();
//				//}
//				//else{
//					//show_message("exception");
//				//}
			},
			success:function(ret){
				load_sub_html_callback();
			}
		});
		
    };
	var load_app_html = function (appsign) {
        appBar.show(appsign);
        hide_msgbox();
        $("#app_detail_area").css("padding", "0");
        var url = "../app/" + appsign + "/webs/index.html";
        $("#app_detail_area").html("");
        if($("#config_page").length > 0)
            $("#config_page").remove();
        var frm = $("<iframe />");
		frm.attr({
			id:"config_page",
			src:url,
			frameborder:"0",
			width:"100%",
			height:"100%"
		});
        //frm.attr("scrolling","no");
        frm.attr("allowtransparency", true);
        frm.unbind("load").bind("load", function () {
            if (document.getElementById("config_page").contentWindow.document.body.innerHTML.toString().indexOf("NetcoreLoginFlag") != -1) {
                window.top.open("/", "_self");
                return;
            }
            if (document.getElementById('config_page').contentWindow.nos != null) {
                document.getElementById('config_page').contentWindow.nos.app.resizePage();
                window.setTimeout(function(){
                    fix_sougou_scroll_bug();
                },200);
            }

        });
        $("#app_set").append(frm);
    };
    var jump_sub_html = function (html_name, init_function, return_html_name, parent_html_name) {
        $("#" + parent_html_name || return_html_name).addClass("current").siblings().removeClass("current");
        load_sub_html(html_name, init_function, return_html_name);

    };
    var paint_tab = function (index) {
        $(".tab_container").html("");
        var tab_items = [];
        if (PAGE_INFO.tab_page_name != undefined) {
            tab_items = igd.menu[PAGE_INFO.tab_page_name].submenu;
        }
		var type_name = ["common","safety","basic"];
        var tab_items_len = tab_items instanceof Array ? tab_items.length : 0;
        var tab_html_str = "";
		
		var tab_title_str = "<div id='tab_wrapper'  class='tab_wrapper'>";
        for (var k = 0; k < tab_items_len; k++) {
            //设置tab头信息
			if(k == 0)
				tab_title_str += "<div class='tab_title lava_focus'><h3>" + tab_items[k]["title"] + "</h3></div>";
			else
				tab_title_str += "<div class='tab_title'><h3>" + tab_items[k]["title"] + "</h3></div>";
            tab_html_str += "<div class='tab_item_container section_hide'>";
			//tab_html_str += "<div class='tab_item_container'><div class='tab_title'><h3>" + tab_items[k]["title"] + "</h3></div>";
            var submenu_itmes = tab_items[k]["submenu"];
            var submenu_len = submenu_itmes.length;
            if (submenu_len > 0) {
                tab_html_str += "<ul>"
            }
            for (var i = 0; i < submenu_len; i++) {
                var isEnd = (i + 1) % 3 == 0 ? "thirdend " : "";
                tab_html_str += "<li class='" + isEnd + submenu_itmes[i].tab_id + "'><div id='" + submenu_itmes[i].tab_id + "' class='ext-item' data-type='"+ type_name[k] +"'>" +
                "<div class='menu_text'>" + submenu_itmes[i].tab_title + "</div>" +
                "<div class='float_info'><div class='detail'>" + " <p class='wisp-info js-txt-wisp-status'></p></div></div> </div> </li >";
            }
            if (submenu_len > 0) {
                tab_html_str += "</ul>"
            }
            tab_html_str += "</div>"
        }
		tab_title_str += "</div>";
		$(".tab_container").append($(tab_title_str));
        $(".tab_container").append($(tab_html_str));
        $(".tab_container").undelegate(".ext-item", "click").delegate(".ext-item", "click", function () {
//            var $obj = $(".tab_container .float_info").removeClass("tab_selected");
//            $(this).find(".float_info").addClass("tab_selected");
            if ($(this).attr("id") != undefined) {
                var id = $(this).attr("id").split("_tab")[0];
				var type = $(this).attr("data-type");
                var newUrlToken = "#extitem" + "/";
                //需要绘制TAB选项卡的在此添加
                newUrlToken += id + "/" + PAGE_INFO.tab_page_name;
				newUrlToken += "/" + type;
                window.location.hash = newUrlToken;
            }
        });
        if (index) {
            $(".tab_container").find("a").eq(index).click();
        }
		
		$("#tab_wrapper").undelegate(".tab_title", "click").delegate(".tab_title", "click", function () {
			var type = type_name[$(this).index()];
           	var newUrlToken = "#menu/nav_setting/";
			newUrlToken += type;
			window.location.hash = newUrlToken;
			
		});
    };
    var applyToken = function (token) {
        return token.substr(0,1) == '#' ? token.substr(1) : token;
    };
    var detectStateChange = function () {
		hide_dialog();
        var menuObj = {
            type: "",
            id: "",
            parentId: ""
        }, urlTokenList,oldUrlTokenList;
        PAGE_INFO.oldUrlToken = PAGE_INFO.newUrlToken;
		PAGE_INFO.newUrlToken = applyToken(window.location.hash) || "menu/index_page";
        if (PAGE_INFO.newUrlToken == PAGE_INFO.oldUrlToken) {
            return;
        }
		if(PAGE_INFO.oldUrlToken)
			oldUrlTokenList = PAGE_INFO.oldUrlToken.split("/");
		else
			oldUrlTokenList = "";
        urlTokenList = PAGE_INFO.newUrlToken.split("/");
        if (urlTokenList.length < 2) {
            return;
        }
        menuObj["type"] = urlTokenList[0];
        var id = menuObj["id"] = urlTokenList[1];
        var parentId = menuObj["parentId"] = urlTokenList[2];
        if($.isEmptyObject(getJsonObject(igd.menu, "tab_id", id + "_tab"))&& $.isEmptyObject(igd.menu[id])&&menuObj["type"]!="addonitem"&&menuObj["type"]!="menu"){
            PAGE_INFO.newUrlToken="menu/index_page";
            menuObj["type"] = "menu";
            id = menuObj["id"] = "index_page";
        }
		if (oldUrlTokenList.length > urlTokenList.length) {
           PAGE_INFO.menu_parent.remove_child(PAGE_INFO.menu_parent.code);
        }
        switch (menuObj["type"]) {
            case "menu":
                $("#sidebar_wrap li").removeClass('current').filter("#" + id).addClass('current');
                if (id == "nav_setting") {
                    PAGE_INFO.tab_page_name = id;
					ajaxAsync(false);
					load_html(id, "paint_tab");
					ajaxAsync(true);
					if(urlTokenList.length == 3){
						var index = 0;
						if(urlTokenList[2] == "common"){
							index = 0;
						}
						else if(urlTokenList[2] == "safety"){
							index = 1;
						}
						else if(urlTokenList[2] == "basic"){
							index = 2;
						}
						$("#tab_wrapper").find(".tab_title").eq(index).addClass('cur').siblings().removeClass('cur');
						$(".tab_item_container").addClass("section_hide");
						$(".tab_container").find(".tab_item_container").eq(index).removeClass("section_hide");						
					}
                }
                else {
                    load_html(id, "init_" + id);
                }
                break;
            case "extitem":
				$("#sidebar_wrap").find("#" + parentId).addClass('current').siblings().removeClass('current');
				load_sub_html(id, 'init_' + id, menuObj["parentId"]);
                break;
			case "addonitem":
                $("#sidebar_wrap").find("#nav_addon").addClass('current').siblings().removeClass('current');
				load_html("nav_addon",function(){
					$.when(get_plugins_status(),_init_install_plugin()).done(function(){
						show_app_detail(id);
    				});
				});
                break;
            case "indexitem":
				//alert(urlTokenList.length);
				if(urlTokenList.length != 4){
					var return_html_name = "index_page";
					var parent_html_name = "index_page";
					jump_sub_html(id, 'init_' + id, return_html_name, parent_html_name);
				}
				else{
					jump_sub_html(urlTokenList[3], "init_"+ urlTokenList[3], "nav_protection", "nav_setting");
				}
                break;
            default :
                break
        }
    }
    var init_menu = function () {
        $("#sidebar_wrap li").unbind("click").bind("click", function () {
            var self = $(this),
                id = self.attr('id');
            self.addClass('current').siblings().removeClass('current');
            PAGE_INFO.newUrlToken = "#menu" + "/";
            //需要绘制TAB选项卡的在此添加
            if(id == "nav_setting")
				PAGE_INFO.newUrlToken += id + "/common";
			else
				PAGE_INFO.newUrlToken += id;
            window.location.hash = PAGE_INFO.newUrlToken;

        });
        $(window).on("hashchange",detectStateChange);
    };


	window.load_app_html = load_app_html;
    window.get_nav_return_a_fn = get_nav_return_a_fn;
    window.paint_tab = paint_tab;
    window.init_menu = init_menu;
    window.detectStateChange = detectStateChange;
    window.jump_sub_html = jump_sub_html;
})();
/*================================ by houbingyang end 菜单加载 ================================ */






//改装原来的弹窗
function myhide_message(judge,data){
	
	$("#msg_type").removeClass();
	if(judge==1){
		$("#msg_type").addClass("success");
	}else{
		$("#msg_type").addClass("error");
	}
	$("#msg").html(data);
	 $("#message_layer").stop(true, true).delay(1000).fadeOut(500, function () {
        hide_lock_div();
    });
}


function print_message_panel(title, message) {
    var _this = $("#message_layer");
    if (title != "error" && title != "wait_one_min") {
        $("#msg_type").attr("class", message_panel[title].type);
        message = message || message_panel[title].message;
        $("#msg").html(message);
    }
    else {
        if (title == "wait_one_min") {
            $("#msg_type").attr("class", message_panel[title].type);
        } else {
            $("#msg_type").attr("class", title);
        }
        $("#msg").html(message);
    }
	set_message_layer_pos(_this);
    _this.stop(true, true).show();
}

function set_message_layer_pos(obj){
	var left = (parseInt(document.documentElement.scrollWidth) - obj.outerWidth()) / 2 + "px";
	var top = /*document.documentElement.scrollTop + document.body.scrollTop +*/ (document.documentElement.clientHeight - obj.outerHeight()) / 2 + "px";//fix chrome bug
	obj.css("left", left);
	obj.css("top", top);
}

function show_lock_div() {
    $("#lock_div").show();
	$("#lock_div").css({
		"width":"100%",
		"height":document.documentElement.clientHeight+document.documentElement.scrollTop+document.body.scrollTop+"px",
		"opacity":"0.15"
	});
}

function Dialog(obj){
	this.id = obj.id;
	this.title = obj.title;
	this.content = obj.content;
	this.buttons = obj.buttons;
	this.init();
}

Dialog.prototype.init = function(){
	var me = this;
	me.paint();
	$("#" + this.id + " .modal-title").html(this.title);
	$("#" + this.id + " .modal-body").html(this.content);

	var _init = function(btn_class,btn,txt){
		if(!$.isEmptyObject(btn)){
			$("#" + me.id + " ." + btn_class).html(!!btn.text ? btn.text : txt).off("click").on("click", function () {
				if(typeof btn.action == "function")
					btn.action();
			});	
		}
		else{
			$("#" + me.id + " ." + btn_class).html(txt).off("click").on("click", function () {
				me.hide();
			});
		}	
	}
	
	_init("btn-confirm",me.buttons[0],language[language_type]["BUTTON"]["btn-confirm"]);
	_init("btn-cancel",me.buttons[1],language[language_type]["BUTTON"]["btn-cancel"]);
	
};

Dialog.prototype.paint = function(){
	var str = ""; 
	if($("#" + this.id).length != 0)
		$("#" + this.id).remove();
	var str =   '<div class="modal fade" id="'+ this.id +'" tabindex="-1">' + 
				'	<div class="modal-dialog">' + 
				'		<div class="modal-content">' + 
				'			<div class="modal-header">' + 
				'				<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' + 
				'				<h4 class="modal-title"></h4>' + 
				'			</div>' + 
				'			<div class="modal-body">' + 
				'			</div>' + 
				'			<div class="modal-footer">' + 
				'				<button type="button" class="dialog-btn btn-cancel"></button>' + //data-dismiss="modal"
				'				<button type="button" class="dialog-btn btn-confirm"></button>';
				'			</div>' + 
				'		</div>' + 
				'	</div>' + 
				'</div>';
	$("body").append(str);
};

Dialog.prototype.show = function(){
	$("#" + this.id).modal();
};

Dialog.prototype.hide = function(){
	$("#" + this.id).modal("hide");
};


function hide_lock_div() {
    $("#lock_div").hide();
}

function show_pop_layer(id) {
    //$("#"+id).find(".txt").eq(0).focus();
    /*var container_width = $("#container").width();
     var container_height = $("#container").height();*/
    var layer = $("#" + id);
    var o_elem_width = layer.width();
    var o_elem_height = layer.height();
    /*var left = parseInt(container_width-o_elem_width)/2+"px";
     var top = document.documentElement.scrollTop+(container_height-o_elem_height)/2+"px";*/

    var left = (parseInt(document.documentElement.scrollWidth) - o_elem_width) / 2 + "px";
    var top = document.documentElement.scrollTop + document.body.scrollTop + (document.documentElement.clientHeight - o_elem_height) / 2 + "px";

    layer.css({"left": left, "top": top}).stop(true, true).fadeIn();
    set_w_lock_div();
    $("#w_lock_div").css({
        "background": "#000",
        "filter": "Alpha(opacity=60)",
        "-moz-opacity": "0.6",
        "-khtml-opacity": "0.6",
        "opacity": "0.6"
    });
}

function hide_pop_layer(id,callback) {
    var callFn = callback || $.noop;
    $("#" + id).stop(true, true).fadeOut("normal",function(){
        if(typeof  callFn == "function"){
            callFn.call(null);
        }
    });
    remove_w_lock_div();
}
//处理前缀前面
function prefix_before_fn(data){
	var w=data.lastIndexOf("/");//前缀
	var before=data.substring(0,w);
	return before;
}
//得到前缀后门代码
function prefix_after_fn(data){
	var w=data.lastIndexOf("/");//前缀
	var after=data.substring(w+1,data.length);
	return after;
}
function set_w_lock_div() {
    remove_w_lock_div();
    $(document.body).append('<div id="w_lock_div" style=" position:absolute; top:0; left:0; width:100%; z-index:2000; background:#fff; filter:Alpha(opacity=0);-moz-opacity:0;-khtml-opacity:0;opacity:0;"></div>');
    $("#w_lock_div").css({height: document.documentElement.clientHeight+document.documentElement.scrollTop+document.body.scrollTop+"px",width:$(document).width()});
}
//获取时间
 function getCurrentDate(format) {
 	/**
     *获取当前时间
     *format=1精确到天
     *format=2精确到分
     * 使用方法getCurrentDate(2)
    */
      var now = new Date();
      var year = now.getFullYear(); //得到年份
      var month = now.getMonth();//得到月份
      var date = now.getDate();//得到日期
      var day = now.getDay();//得到周几
      var hour = now.getHours();//得到小时
      var minu = now.getMinutes();//得到分钟
      var sec = now.getSeconds();//得到秒
      month = month + 1;
      if (month < 10) month = "0" + month;
      if (date < 10) date = "0" + date;
      if (hour < 10) hour = "0" + hour;
      if (minu < 10) minu = "0" + minu;
      if (sec < 10) sec = "0" + sec;
      var time = "";
      //精确到天
      if(format==1){
        time = year + "/" + month + "/" + date;
      }
      if(format==2){
        time = hour + ":" + minu + ":" + sec;
      }
      //精确到分
      else if(format==3){
        time = month + "/" + date+ "/"+ year  +" " + hour + ":" + minu + ":" + sec;
      }
      return time;
   }
function remove_w_lock_div() {
    if ($("#w_lock_div").length > 0) {
        $("#w_lock_div").remove();
    }
}

$(window).off("resize scroll").on("resize scroll",function () {
    var arr = ["w_lock_div","lock_div"];
	set_size(arr);
	set_message_layer_pos($("#message_layer"));
});

function set_size(id) {
	for(var i in id){
		var elem = $("#" + id[i]);
		var _state = elem.css("display");
		var _height = document.documentElement.clientHeight+document.documentElement.scrollTop+document.body.scrollTop+"px";
		if (_state == "block") {
			elem.css("width", $(document).width());
			elem.css("height", _height);
		}	
	}
}


function init_text_event() {
    $(".txt").addClass("txt_normal");
    $(".txt").unbind("focus").bind("focus", function () {
        if ($(this).attr("class").indexOf("txt_prevalue") != -1) {
            clear_value(this);
        }
        else {
            $(this).removeClass().addClass("input-text");
        }
    });
    $(".txt").unbind("blur").bind("blur", function () {
        if ($(this).val() != "") {
            var parent_form_id = $(this).parents("form").attr("id");
            if (!form_check(this, parent_form_id)) {
                return;
            }
        }
        else {
            fill_default_value(this);
        }
        if ($(this).attr("class").indexOf("txt_focus") != -1) {
            if ($(this).attr("class").indexOf("txt_prevalue") != -1)
                $(this).removeClass().addClass("input-text txt_prevalue");
            else
                $(this).removeClass().addClass("input-text");
        }
    });
    $(".txt").unbind("keyup").bind("keyup", function (e) {
        if (e.keyCode == 13)
            return;
        if ($(this).val() != "") {
            var parent_form_id = $(this).parents("form").attr("id");
            if (!form_check(this, parent_form_id))
                return;
        }
        else {
            $(this).focus();
            hide_msgbox();
        }
    });
}

function form_check(obj, form_id) {
    var ctr_id = $(obj).attr("id");
    var oldClass = $(obj).attr('class');
    for (var i in reg_map[form_id]) {
        if (ctr_id == reg_map[form_id][i].id.toString()) {
            var type_arr = reg_map[form_id][i].type.split(" ");
            for (var j in type_arr) {
                if (!get_msgbox(ctr_id, type_arr[j])) {
                    $(obj).removeClass().addClass("input-text input-error");
                    return false;
                } else {
                    $(obj).removeClass().addClass(oldClass);
                    hide_msgbox();
                }
            }
            break;
        }
    }
}


function clear_value(obj) {
    $(obj).removeClass().addClass("input-text");
    $(obj).val("");
}

function fill_default_value(obj) {
    if ($(obj).val() == "") {
        if ($(obj).attr("id") == "wirel_answer") {//两处含有密码验证问题
            $(obj).val(pre_data[current_html]["wirel_answer"][$("#question_sel").val()]);
        }
        else {
            if (pre_data[current_html] == undefined)//无需验证
                return;
            if (pre_data[current_html][$(obj).attr("id")] != "") {
                $(obj).val(pre_data[current_html][$(obj).attr("id")]);
                $(obj).removeClass().addClass("txt txt_prevalue txt_focus");
            }
        }
    }
}

//检验密码
//function ck_pwd(id, pwd) {
//  remove_ck_pwd(id);
//  /* 有placeholder的时候会把placeholder当作密码 */
//  if (pwd === document.getElementById(id).getAttribute('placeholder')) {
//      pwd = '';
//  }
// $("#" + id).parent().after("<div id=\"" + id + "_pwd_ck\" class=\"strength\"><div class=\"pwd_status\"><span id=\"" + id + "_strength_L\" class=\"strength_L\"></span><span id=\"" + id + "_strength_M\" class=\"strength_M\"></span><span id=\"" + id + "_strength_H\" class=\"strength_H\"></span></div></div>");
//  pwStrength(id, pwd);
//}
function ifIsMobile(){
    return /Android|iPhone|iPad|iPod|BlackBerry|webOS|Windows Phone|SymbianOS|IEMobile|Opera Mini/i.test(navigator.userAgent);
}
function remove_ck_pwd(id) {
    if ($("#" + id + "_pwd_ck").length > 0) {
        $("#" + id + "_pwd_ck").remove();
    }
}
function Password(id,type,has_strength){
	this.id = id;
	this.init(type,has_strength);
}

Password.prototype.init = function(type,has_strength){
	this.initToggle(type,true);
	if(has_strength == undefined || has_strength == true)
		this.initStrength();
}

//type -> close | open
Password.prototype.initToggle = function(type){
	var _this = this;
	var _type = type? type : "close";
	var $a = $("<a/>");
	$a.attr({
		"class":"password-view",
		"href":"javascript:void(0)",
		"id":this.id + "-view"
	});
	$a.off(E).on(E,function(e){
		e.stopPropagation()
		_this.toggle(this);
		_this.initStrength();
	});
	var $img = $("<img/>").attr({
		"src":(current_html == "guide" ? "../" : "") + "images/eye_" + _type + ".png"
	});
	
	$a.html("").append($img);
	$("#" + this.id).parent().append($a);
	$("#" + this.id).parent().addClass("is_pwd");

}

Password.prototype.toggle = function(obj){
	//把节点保留下来再删除
	this.node = $("#" + this.id);
	this.html = $("#" + this.id).prop("outerHTML");
	this.parent = $("#" + this.id).parent();
	this.curVal = $("#" + this.id).val();
	this.node.remove();
	if(this.node.attr("type") == "text"){
		$(obj).removeClass("open").addClass("close").find("img").attr("src",(current_html == "guide" ? "../" : "") + "images/eye_close.png");
		if(this.html.indexOf("type=")<0){
			this.html = this.html.replace(">"," type=text />");
		}
		this.html = this.html.replace(/type=("|)text("|)/,"type=\"password\"");
	}
	else if(this.node.attr("type") == "password"){
		$(obj).removeClass("close").addClass("open").find("img").attr("src",(current_html == "guide" ? "../" : "") + "images/eye_open.png");
		if(this.html.indexOf("type=")<0){
			this.html = this.html.replace(">"," type=password />");
		}
		this.html = this.html.replace(/type=("|)password("|)/,"type=\"text\"");
	}
	$(obj).parent().find(".invalid").remove();
	this.parent.append($(this.html).val(this.curVal));
}

Password.prototype.createStrength = function(){
	this.removeStrength();
	var $ul = $("<ul/>").addClass("strength_line off");
	var className = ["low","middle","high"];
	for(var i=0; i < 3; i++){
		var $li = $("<li/>").addClass(className[i]);
		$ul.append($li);
	}
	$("#" + this.id).parent().append($ul);
}

Password.prototype.removeStrength = function(){
	var elem = $("#" + this.id).parent().find(".strength_line");
	if(elem.length != 0)
		elem.remove();
}

Password.prototype.checkStrength = function(id,pwd){	
	this.createStrength();
	var O_color = "#CCCCCC";
    var L_color = "#E74946";
    var M_color = "#FD9152";
    var H_color = "#33BEA3";

	var Lcolor = null,Mcolor = null,Hcolor = null;
	
    var S_level = checkStrong(pwd);
    switch (S_level) {
        case 0:
            Lcolor = Mcolor = Hcolor = O_color;
        case 1:
            Lcolor = L_color;
            Mcolor = Hcolor = O_color;
            break;
        case 2:
            Lcolor = Mcolor = M_color;
            Hcolor = O_color;
            break;
        default:
            Lcolor = Mcolor = Hcolor = H_color;
    }
	

	var strength_bar = $("#" + id).parent().find(".strength_line");
	
    strength_bar.children(".low").css("background", Lcolor);
   	strength_bar.children(".middle").css("background", Mcolor);
   	strength_bar.children(".high").css("background", Hcolor);
   	strength_bar.removeClass("off");
}

Password.prototype.addEvent = function(){
	var me = this;
	var id = this.id;
	var elem = $("#" + id);
	elem.off("focus").on("focus",function() {			  
		me.checkStrength(id,elem.val());
		if(ifIsMobile())
			scrollIntoViewEvent(elem,"focus");
	}).off("blur").on("blur",function() {
		me.removeStrength();
		if(ifIsMobile())
			scrollIntoViewEvent(elem,"blur");
	});
	elem.off("keyup").on("keyup",function (e) {
		if(e.keyCode == 13)
			me.removeStrength();
		else
			me.checkStrength(id,elem.val());
    });
}

Password.prototype.initStrength = function(){
	this.createStrength();
	this.addEvent();
}
//判断输入密码的类型  
function CharMode(iN) {
    if (iN >= 48 && iN <= 57) //数字
        return 1;
    if (iN >= 65 && iN <= 90) //大写
        return 2;
    if (iN >= 97 && iN <= 122) //小写
        return 4;
    else {
        return 8;
    }
}
//根据两个月份同一天的差值获取,同样是传入需要获取的对应年份和月份
function getMonthDays(year,month){
	if(year==undefined || month==undefined || month>12 || year<1970){
		return 1;
	}
  var stratDate = new Date(year,month-1,1),
     endData = new Date(year,month,1);
  var days = (endData -stratDate)/(1000*60*60*24);
  return days;
}
//bitTotal函数  
//计算密码模式  
function bitTotal(num) {//传入参数1 2 4 8
    modes = 0;
    for (var i = 0; i < 4; i++) {
        if (num & 1) //全1为1
            modes++;
        num >>>= 1; // >>> 向右移1位
    }
    return modes;
}
//颠倒
function reverseNumber(number){
    let _num = String(number).split('');
    return String(_num.reverse().join(''));
}
//把十进制转换为二进制
function dec_two_bin(dec,l){
    var  a=(dec >>> 0).toString(2);
    if(l==undefined){
    	return a.padStart(7,0)
    }else{
    	return a.padStart(l,0)
    }
    
}

//把二进制转换为十进制
function toDecimal(s) {
      var res = 0;
      var arr = s.split("");
      var len = arr.length;
      for(var i = 0;i<len;i++) {
        res += +arr[i] * Math.pow(2, len-1-i)
      }
      return res;
    }
//把二进制的数字转换成日期,如星期一;星期二
function convert_to_date(data){
	var new_day="";
	
	if(data==1111111){
		new_day=L.all_day;
	}else{
		
			if(data[0]==1){
				new_day=new_day+L.day6+";";
			}
			if( data[1]==1){
				new_day=new_day+L.day0+";";
			}
			if(data[2]==1){
				new_day=new_day+L.day1+";";
			}
			if(data[3]==1){
				new_day=new_day+L.day2+";";
			}
			if(data[4]==1){
				new_day=new_day+L.day3+";";
			}
			if(data[5]==1){
				new_day=new_day+L.day4+";";
			}
			if(data[6]==1){
				new_day=new_day+L.day5+";";
			}
	}
	return new_day;
}
//时间格式显示优化
function time_optimization(data){
	if(data<10 && data>0){
		return "0"+data;
	}else{
		return data;
	}
} 
//必须强度为中的密码
function medium_password(pwd){
	var strength=checkStrong(pwd);
	if(strength<2){
		var ss = L.medium_password;
        return ss;
	}
	
	return true;
}

//根据位置替换字符/str所需修改字符串，index字符串需要修改的位置，char要修改成的值
function changeStr(str, index, char){
	 const strAry = str.split('');
	 strAry[index] = char;
	 return strAry.join('');
	}

//返回强度级别  
function checkStrong(sPW) {
    if (sPW.length < 8)
        return 0; //密码太短
    var Modes = 0;
    for (i = 0; i < sPW.length; i++) {
        //密码模式
        Modes |= CharMode(sPW.charCodeAt(i));
        //只有两个操作数上相对应的位都是0时，其运算结果相对应的位才是0，否则为1。
    }
    return bitTotal(Modes);
}

//显示颜色  
function pwStrength(id, pwd) {
    //根据不同的ID验证不同的特殊字符
    hide_msgbox();
    if ($("#" + id).attr("class").indexOf("txt_prevalue") != "-1" || $("#" + id).val() == "")
        return;
    var O_color = "#ACACAC";
    var L_color = "#FF5353";
    var M_color = "#FF9C00";
    var H_color = "#24B638";

    S_level = checkStrong(pwd);
    switch (S_level) {
        case 0:
            Lcolor = Mcolor = Hcolor = O_color;
            $("#" + id + "_strength_L").html(L.pwd_low);
        case 1:
            Lcolor = L_color;
            Mcolor = Hcolor = O_color;
            $("#" + id + "_strength_L").html(L.pwd_low);
            break;
        case 2:
            Lcolor = Mcolor = M_color;
            Hcolor = O_color;
            $("#" + id + "_strength_M").html(L.pwd_medium);
            break;
        default:
            Lcolor = Mcolor = Hcolor = H_color;
            $("#" + id + "_strength_H").html(L.pwd_strong);
    }

    $("#" + id + "_strength_L").css("background", Lcolor);
    $("#" + id + "_strength_M").css("background", Mcolor);
    $("#" + id + "_strength_H").css("background", Hcolor);
    return;
}

function ajaxAsync(flag) {
    $.ajaxSetup({
        async: flag
    });
}

function handle_ip(ip) {
    if ("0.0.0.0" == ip)ip = "";
    return ip;
}

function math_unit_converter(str) {
    var int_v = parseInt(str, 10);
    var map = {0: "B", 1: "K", 2: "M", 3: "G", 4: "T"};
    var h = 0;
    for (h = 0; int_v > 1024; h++) {
        int_v = int_v / 1024;
    }
    if (h > 4) {
        int_v = int_v * Math.pow(1024, (h - 4));
        h = 4;
    }

    var ret_str = int_v.toString().indexOf(".") > -1 ? int_v.toFixed(2) : int_v;
    return ret_str + map[h];
}

function convert_time(second) {
    var int_v = parseInt(second, 10);
	//var map = {0: L.second, 1: L.minute, 2: L.hour, 3: L.day};
	var obj = {};
	obj.second = "";
	obj.minute = "";
	obj.hour = "";
	obj.day = "";
	var h = 0;
	if (0 < int_v < 60) {
		h = 0
	}
	if (int_v >= 60 && int_v < 3600) {
		h = 1
	}
	if (int_v >= 3600 && int_v < 86400) {
		h = 2
	}
	if (int_v >= 86400) {
		h = 3
	}
	var re_str = "";
	if (h == 0) {
		obj.second = int_v;
		return obj;
	}
	if (h == 1) {
		var p1 = 0, p2 = 0;
		p1 = Math.floor(int_v / 60);
		p2 = Math.floor(int_v % 60);
		if (p2 != 0){
			obj.minute = p1;
			obj.second = p2;
		}
		else{
			obj.minute = p1;
		}
		return obj;
	}
	if (h == 2) {
		var p1 = 0, p2 = 0, p3 = 0;
		p1 = Math.floor(int_v / 3600);
		p2 = Math.floor((int_v % 3600) / 60);
		p3 = Math.floor(int_v % 60);
		if (p3 == 0 && p2 == 0){
			obj.hour = p1;
		}
		else if (p3 != 0 && p2 == 0){
			obj.hour = p1;
			obj.second = p3;
		}
		else if (p3 == 0 && p2 != 0){
			obj.hour = p1;
			obj.minute = p2;
		}
		else{
			obj.hour = p1;
			obj.minute = p2;
			obj.second = p3;
		}
		return obj;
	}
	if (h == 3) {
		var p1 = 0, p2 = 0, p3 = 0, p4 = 0;
		p1 = Math.floor(int_v / (60 * 60 * 24));
		p2 = Math.floor((int_v / 3600) % 24);
		p3 = Math.floor((int_v % 3600) / 60);
		p4 = Math.floor(int_v % 60);
		if (p2 == 0 && p3 == 0 & p4 == 0){
			obj.day = p1;
		}
		else if (p2 != 0 && p3 == 0 && p4 == 0){
			obj.day = p1;
			obj.hour = p2;
		}
		else if (p2 == 0 && p3 != 0 && p4 == 0){
			obj.day = p1;
			obj.minute = p3;
		}
		else if (p2 == 0 && p3 == 0 && p4 != 0){
			obj.day = p1;
			obj.second = p4;
		}
		else if (p2 != 0 && p3 != 0 && p4 == 0){
			obj.day = p1;
			obj.hour = p2;
			obj.minute = p3;
		}
		else if (p2 == 0 && p3 != 0 && p4 != 0){
			obj.day = p1;
			obj.minute = p3;
			obj.second = p4;
		}
		else if (p2 != 0 && p3 == 0 && p4 != 0){
			obj.day = p1;
			obj.hour = p2;
			obj.second = p4;
		}
		else{
			obj.day = p1;
			obj.hour = p2;
			obj.minute = p3;
			obj.second = p4;
		}
	}
	return obj;
}



function getFileName(path) {
    var pos1 = path.lastIndexOf('/');
    var pos2 = path.lastIndexOf('\\');
    var pos = Math.max(pos1, pos2)
    if (pos < 0)
        return path;
    else
        return path.substring(pos + 1);
}

function section_disable(section_id, flag) {
    $("#" + section_id + " input").attr("disabled", flag);
    $("#" + section_id + " textarea").attr("disabled", flag);
    $("#" + section_id + " select").attr("disabled", flag);
	if(flag){
		 $("#" + section_id + " input[type=text]:not(\".sel_txt\")").addClass("txt_disable");
		 $("#" + section_id + " input[type=password]").addClass("txt_disable");
	}
	else{
		 $("#" + section_id + " input[type=text]:not(\".sel_txt\")").removeClass("txt_disable");
		 $("#" + section_id + " input[type=password]").removeClass("txt_disable");
	}
}

function section_toggle(id, flag) {
	$("#" + id + " input").attr("disabled", flag);
	$("#" + id + " textarea").attr("disabled", flag);
	$("#" + id + " select").attr("disabled", flag);
	//$("#" + id + " radio").attr("disabled", flag);

}
var errCode = null;
function handleResponse(data,sucCallFn,errCallFn){
	//if(data.result!=undefined)
		//data.result[0] = 9;
	if(data.result!=undefined){
		if(data.result[0]==0) {
			if(!!!data.result[1] || (!!data.result[1] && !!!data.result[1]["ErrCode"])){
				if(typeof sucCallFn == "function"){
					sucCallFn();
				}
			}
			else{
				errCode = data.result[1]["ErrCode"];
				if(typeof errCallFn == "function"){
					errCallFn();
				}
				else{
					show_message("error",formatErrorCode(data.result[1]["ErrCode"]));
				}
			}
		}
		else{//ubus 错误码
			if(data.result[0]==6){
				if(current_html != "login")
					window.location.replace("login.html");
				else
					show_message("error",L.loginErr);
			}
			else{
				timer = {};
				errCode = data.result[0];
				if(typeof errCallFn == "function"){
					errCallFn();
				}
				else{
					show_message("error",formatErrorCode(data.result[0]));
				}
			}
		}
	}
	else{//web server 错误码
		timer = {};
		errCode = data.error.code; 
		if(data.error.code==-32001 || data.error.code==-32002){
			localStorage.removeItem('token_id');
			if(current_html != "login" || (!router.exam_flag && current_html != "guide"))
				window.location.replace("login.html");
			else{
				//只有快速配置和登录会走此逻辑
				if(typeof errCallFn == "function"){
					errCallFn();
				}
			}
		}
		else{
			if(typeof errCallFn == "function"){
				errCallFn();
			}
			else{
				show_message("error",formatErrorCode(data.error.code));
			}
		}
			
	}
	
}
function check_start_end_ip(ip1, ip2) {
    var ip_arr1 = ip1.split(".");
    var ip_arr2 = ip2.split(".");
    for (var i = 0; i < 4; i++) {
        if (parseInt(ip_arr1[i], 10) > parseInt(ip_arr2[i], 10)) {
            var ss = L.start_end_ip_err;
            return ss;
        }
        /*		else if(parseInt(ip_arr1[i],10) == parseInt(ip_arr2[i],10)){
         var ss="起始IP等于结束IP";
         return ss;
         }*/
        else if (parseInt(ip_arr1[i], 10) < parseInt(ip_arr2[i], 10))
            break;
    }
    return true;
}

//检查内网IP和外网IP关系
function check_lan_wan_ip(str, mask) {
    var ipChkStr = check_lan_ip(str);
    if (typeof ipChkStr == "string") {
        return ipChkStr;
    }
    //var mask = mask || ROUTE_INFO.lan_mask;
	var maskArray = mask.split(".");
    var ipArray = str.split(".");
    var wanIpArray = ROUTE_INFO.wan_ip.split(".");
	var wanMaskArray = ROUTE_INFO.wan_mask.split(".");
    if (getIsSameSegment(ipArray, maskArray, wanIpArray, wanMaskArray)) {
        return L.in_ip_out_ip_same_segment;
    }

    return true;
}

//检查外网IP和内网IP关系
function check_wan_lan_ip(ip, ipgw, mask) {
    var ipArray = ip.split(".");
    var lanIpArray = ROUTE_INFO.lan_ip.split(".");
	var mask = mask || ROUTE_INFO.lan_mask;
	var lanMaskArray = mask.split(".");
    var ipgwArray = ipgw.split(".");
    var maskArray = mask.split(".");
    var andIp = "";
    if (ip == ipgw) {
        return L.ip_getway_not_same;
    }
    if (!getIsSameSegment(ipArray,maskArray, ipgwArray, maskArray)) {
        return L.ip_default_getway_in_same_segment;
    }
    if (getIsSameSegment(lanIpArray,lanMaskArray, ipgwArray, maskArray)) {
        return L.out_ip_in_ip_same_segment;
    }
    return true;

}


//检查起始端口大小
function check_start_end_port(port1, port2) {
    var port_a = parseInt(port1, 10);
    var port_b = parseInt(port2, 10);
    if (port_a > port_b) {
        var ss = L.start_end_port;
        return ss;
    }
    return true;
}

function select_chose_set(sel_id, val, func) {
    var collection = document.getElementById(sel_id);
    if (collection) {
        if (collection.options) {
            for (var i = 0; i < collection.options.length; i++) {
                if (collection.options[i].value == val) {
                    collection.options[i].selected = true;
                }
            }
        } else {
            collection.value = val;
        }
    }
    if (func) {
        func(val);
    }
}

//ajax公共方法
function request(options){
	var dfd = $.Deferred();
	if(!!options.url){
		var dataType = options.dataType || "json";
		$.ajax({
			type: options.method || "post",
			url: options.url,
			data:options.data || {},
			dataType: dataType,
			timeout: options.timeout || 5 * 60 * 100,
			beforeSend:function(xhr, settings){
				if(typeof localStorage != "undefined"){
					ROUTE_INFO.rid = localStorage.getItem('rid');
					ROUTE_INFO.phoneId = localStorage.getItem('phoneId');
					if(!!ROUTE_INFO.rid && !!ROUTE_INFO.phoneId){
						this.url = "/ubus?phoneId="+ROUTE_INFO.phoneId+"&rid="+ROUTE_INFO.rid;
						xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
					}
				}
				if (!!options.isRemoteRequest){
					xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
				}
			},
			error: function (XMLHttpRequest,textStatus,errorThrown) {
				dfd.reject({
					"XMLHttpRequest":XMLHttpRequest,
					"textStatus":textStatus,
					"errorThrown":errorThrown
				});
			},
			success: function (data) {
				dfd.resolve(data);
			}/*,
			complete:function(XMLHttpRequest, textStatus){
				console.log(XMLHttpRequest);
				console.log(textStatus);
			}*/
		},dataType);
	}
	else{
		dfd.reject();
	}
		
	return dfd.promise();
}


function setDataFn(setData,u){
	var me = this;
	var dfd = $.Deferred();
		$.ajax({
					url:u || "/ubus",
					data:setData,
					
					type:"POST",
					dataType:"json",//返回json,text,html你自己定
					beforeSend:function(xhr, settings){
							if(typeof localStorage != "undefined"){
								ROUTE_INFO.rid = localStorage.getItem('rid');
								ROUTE_INFO.phoneId = localStorage.getItem('phoneId');
								if(!!ROUTE_INFO.rid && !!ROUTE_INFO.phoneId){
									this.url = "/ubus?phoneId="+ROUTE_INFO.phoneId+"&rid="+ROUTE_INFO.rid;
									xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
								}
							}
						   },
			
					success:function(data) {
						dfd.resolve(data);
					}
				});
			
		return dfd.promise();
}
//单选按钮
function radio_sele_set(radio_name, get_value) {
    var collection = document.getElementsByName(radio_name);
    for (i = 0; i < collection.length; i++) {
        collection[i].checked = (collection[i].value == get_value) ? true : false;
    }
}

function onbeforeunload_event(text) {

    window.onbeforeunload = function (e) {
        var str = text;
        e = e || window.event;
        if (e) {
            e.returnValue = str;
        }
        else
            return str;
    };

}
//获取菜单中的元素
function getJsonObject(obj, key, value) {
    var obj1 = new Object();

    function eachObject(o) {
        $.each(o, function (i, n) {
            if (n instanceof  Object && n[key] !== value) {
                eachObject(n, key, value);
            } else if (n[key] === value) {
                obj1 = n;
                return false;
            }
        });
    }

    eachObject(obj);
    return obj1;
}

//创建层级菜单对象
function parent(name, code, initFn) {
    this.code = code || "";
    this.name = name || "";
    this.initFn = initFn || $.noop

}

parent.prototype.add_child = function (name, code, initFn) {
    var lastParent = PAGE_INFO.menu_parent;
    var isExist = (lastParent.code == code);
    while (lastParent.child instanceof  parent) {
        lastParent = lastParent.child;
        if (lastParent.code == code) {
            isExist = true;
        }
    }
    if (!isExist) {
        lastParent.child = new parent(name, code, initFn);
        lastParent.child.parent = lastParent;
    }
}
parent.prototype.remove_child = function (code) {
    var lastParent = PAGE_INFO.menu_parent;
    while (lastParent.child instanceof  parent) {
        if (lastParent.code == code) {
            lastParent.child = null;
            break;
        }
        lastParent = lastParent.child;
    }
}
function json_ajax(config) {
    config.successFn = config.successFn || $.noop;
    config.finalFn = config.finalFn || $.noop;
    $.ajax({
        type: "post" || config.type,
        async: config.async || true,
        url: config.url,
        data: config.data,
        dataType: "json",
        beforeSend:function(xhr, settings){
				if(typeof localStorage != "undefined"){
					ROUTE_INFO.rid = localStorage.getItem('rid');
					ROUTE_INFO.phoneId = localStorage.getItem('phoneId');
					if(!!ROUTE_INFO.rid && !!ROUTE_INFO.phoneId){
						this.url = "/ubus?phoneId="+ROUTE_INFO.phoneId+"&rid="+ROUTE_INFO.rid;
//						xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
					}
				}
			   },
        error: function (XMLHttpRequest, textStatus) {
            var ret_json = {};
            ret_json.err_no = "requesterror";
            config.finalFn(ret_json);
        },
        success: function (ret) {
            var ret_json = ret;
            if (ret && typeof ret != "object") {
                ret_json = $.parseJson(ret);
            }
            if (ret_json && ret_json.err_no == 0) {
                config.successFn(!!config.isFullDataStyle?ret_json:ret_json.data);
            }
//            else if (ret_json && ret_json.err_no != 0 && ret_json.err_des) {
//                show_message("error", igd.make_err_msg(ret_json.err_des));
//            }
            else {
                //finalFn返回true时取消默认提示时间
                if (config.finalFn(ret_json))
                    return;
//                show_message("error", igd.err["11"]);
                return;
            }
            config.finalFn(ret_json);

        }
    });
}
function isExistOption(id,value) {  
    var isExist = false;  
    var count = $('#'+id).find('option').length;  

      for(var i=0;i<count;i++)     
      {     
         if($('#'+id).get(0).options[i].value == value)     
             {     
                   isExist = true;     
                        break;     
                  }     
        }     
        return isExist;  
} 
(function ($) {
    $.fn.extend({
        placeholder: function () {
            if ("placeholder" in document.createElement("input")) {
                return this //如果原生支持placeholder属性，则返回对象本身
            } else {
                return this.each(function () {
                    var _this = $(this);
                    _this.val(_this.attr("placeholder")).focus(function () {
                        if (_this.val() === _this.attr("placeholder")) {
                            _this.val("")
                        }
                    }).blur(function () {
                        if (_this.val().length === 0) {
                            _this.val(_this.attr("placeholder"))
                        }
                    })
                })
            }
        }
    })
})(jQuery);
//格式化速度    按照大小返回数值
function formatSpeed(B) {
    var KB = 1024,
        MB = 1024 * 1024, returnObj = {
            value: "0",
            unit: "KB/s",
            allValue: "0KB/s"
        };
    if (B > 0 && B < MB) {
        returnObj.allValue = (B / KB).toFixed(1) + "KB/s";
        returnObj.value = (B / KB).toFixed(1);
        returnObj.unit = "KB/s";
    } else if (B > MB) {
        returnObj.allValue = (B / MB).toFixed(1) + "MB/s";
        returnObj.value = (B / MB).toFixed(1);
        returnObj.unit = "MB/s";

	}
	if(returnObj.value == "0.0")
		returnObj.value = "0";
	if(returnObj.value.length == 6)
		returnObj.value = returnObj.value.substring(0,returnObj.value.length-2);
    return returnObj;
}

/* start by houbingyang */
Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(), //day
        "h+": this.getHours(), //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
        "S": this.getMilliseconds() //millisecond
    }
    if (/(y+)/.test(format))
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(format))
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    return format;
}

function getAesString(str, keyObj) {
	return str;
    var lengthKeyObj = keyObj || get_rand_key(0);
    var key = CryptoJS.enc.Hex.parse(lengthKeyObj.rand_key);
    var iv = CryptoJS.enc.Latin1.parse("jZDk4ZjAwYjIwNGU");
    var encrypted = CryptoJS.AES.encrypt(str, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    var cipher_text = encrypted.ciphertext.toString();
    //var retObj={
    //    "cipher_text":cipher_text,
    //    "key_index":lengthKeyObj.key_index
    //}
    return lengthKeyObj.key_index + cipher_text;
}

function getDAesString(str, keys) {
	return str;
    var ciphertext = str.substr(32, str.length - 32);
    var lengthKeyObj = {};
    if (keys) {
        lengthKeyObj.rand_key = keys;
    } else {
        lengthKeyObj = get_rand_key(0, str, true);
    }
    if (!lengthKeyObj.rand_key) {
        return str;
    }
    var key = CryptoJS.enc.Hex.parse(lengthKeyObj.rand_key);
    var iv = CryptoJS.enc.Latin1.parse("jZDk4ZjAwYjIwNGU");
    var str16T64 = CryptoJS.enc.Hex.parse(ciphertext).toString(CryptoJS.enc.Base64);
    var decrypted = CryptoJS.AES.decrypt(str16T64, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
}

function removeHTMLTag(str) {
    str = str.replace(/<\/?[^>]*>/g, ''); //去除HTML tag
    str = str.replace(/[ | ]*\n/g, '\n'); //去除行尾空白
    //str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
    str = str.replace(/&nbsp;/ig, '');//去掉&nbsp;
    return str;
}

function get_rand_key(error_count, key_index, is_get) {
    error_count = error_count || 0;
    if (error_count > 5) {
        return "";
    }
    if (key_index) {
        key_index = key_index.substr(0, 32);
    }
    if (is_get && key_index == "") {
        return "";
    }
    var calleeFn = arguments.callee;
    var retObj = {
        "rand_key": "",
        "key_index": key_index
    };
    $.ajax({
        url: "/router/get_rand_key.cgi",
        data: {
            "noneed": "noneed",
            "key_index": key_index
        },
        dataType: "json",
        async: false,
        beforeSend:function(xhr, settings){
				if(typeof localStorage != "undefined"){
					ROUTE_INFO.rid = localStorage.getItem('rid');
					ROUTE_INFO.phoneId = localStorage.getItem('phoneId');
					if(!!ROUTE_INFO.rid && !!ROUTE_INFO.phoneId){
						this.url = "/ubus?phoneId="+ROUTE_INFO.phoneId+"&rid="+ROUTE_INFO.rid;
//						xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
					}
				}
			   },
        error: function (XMLHttpRequest, textStatus) {
            retObj = calleeFn(error_count, key_index, is_get);

        },
        success: function (data) {
            if (is_get && data.err_no * 1) {
                retObj["rand_key"] = "";
            } else {
                if (data.rand_key) {
                    retObj["rand_key"] = data.rand_key.substring(32, 64);
                    retObj["key_index"] = data.rand_key.substring(0, 32);
                } else {
                    retObj = calleeFn(error_count, key_index, is_get);
                }
            }

        }
    });

    return retObj;
}

/* end by houbingyang */

/* start  by houbingyang      获取ip是否同一网段*/
function getIsSameSegment(ip1Array, ip1mask, ip2Array, ip2mask) {
    //找出掩码端的那一位，用短的那个掩码去与
	var mask1 = dhcp_pool_calculator.octet2dec(ip1mask)*1;
	var mask2 = dhcp_pool_calculator.octet2dec(ip2mask)*1;
	if(mask1 == 0 || mask2 == 0)
		return false;
	var mask = "";
	if(mask1 >= mask2)
		mask = ip2mask;
	else
		mask = ip1mask;
	for (var i = 0; i < 4; i++) {
        var ip1Part = (ip1Array[i] * 1) & (mask[i] * 1);
        var ip2Part = (ip2Array[i] * 1) & (mask[i] * 1);
        if (ip1Part != ip2Part) {
            return false;
        }
    }
    return true
}


/* end by houbingyang      获取ip是否同一网段*/

/* start  by houbingyang      js字符过滤html标签互转函数*/
(function () {
    var TOOLS = {};
    TOOLS.Crypto = {};
    TOOLS.Crypto.htmlencode = function (str) {
		/*str = str.replace(/&/g, '&amp;');
        str = str.replace(/</g, '&lt;');
        str = str.replace(/>/g, '&gt;');
        str = str.replace(/(?:t| |v|r)*n/g, '<br />');
        str = str.replace(/  /g, '&nbsp; ');
        str = str.replace(/t/g, '&nbsp; &nbsp; ');
        str = str.replace(/x22/g, '&quot;');
        str = str.replace(/x27/g, '&#39;');
		return str;*/
		return $('<div/>').text(str).html();//原样输出
    }
    TOOLS.Crypto.htmldecode = function (str) {
        /* str = str.replace(/&amp;/gi, '&');
        str = str.replace(/&nbsp;/gi, ' ');
        str = str.replace(/&quot;/gi, '"');
        str = str.replace(/&#39;/g, "'");
        str = str.replace(/&lt;/gi, '<');
        str = str.replace(/&gt;/gi, '>');
        str = str.replace(/<br[^>]*>(?:(rn)|r|n)?/gi, 'n');
        return str;*/
		return $('<div/>').html(str).text();
    }
    TOOLS.Crypto.textencode = function (str) {
        str = str.replace(/&amp;/gi, '&');
        str = str.replace(/</g, '&lt;');
        str = str.replace(/>/g, '&gt;');
        return str;
    }
    TOOLS.Crypto.textdecode = function (str) {
	   	str = str.replace(/&amp;/gi, '&');
        str = str.replace(/&lt;/gi, '<');
        str = str.replace(/&gt;/gi, '>');
        return str;
    }
    TOOLS.Url = {};
    TOOLS.Url.getQueryString = function (locationEmt) {
        var location_token = location;
        if (locationEmt && locationEmt.location) {
            location_token = locationEmt.location;
        }
        var url = location_token["search"]; //获取url中"?"符后的字串
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            var strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = decodeURIComponent(strs[i].split("=")[1]);
            }
        }
        return theRequest;
    }
    window.TOOLS = TOOLS;
})();
/* end by houbingyang      js字符过滤html标签互转函数*/
//获取转义后的设备列表
function GetDeviceNameStr(str, length) {
    var realLength = 0, len = str.length, charCode = -1;
    length = length || 20;
    for (var i = 0; i < len; i++) {
        charCode = str.charCodeAt(i);
        if (charCode >= 0 && charCode <= 128) realLength += 1;
        else realLength += 2;
        if (realLength > length) {
            return str.substring(0, i) + "....";
        }

    }
    return str;
}

var REBOOT;
function soft_restart(type,isMobile) {
	var ssid = "";
	if(isMobile){
		$.post("/router/wireless_base_show.cgi",{ap_id:0,network_mode:999,port_id:"WIFI1"},function(data){
			data = dataDeal("("+ data +")");
			ssid = data.AP_SSID;
		});
	}
	else{
		if(typeof clearPluginCookie == "function")
			clearPluginCookie();
	}
    if (type == "update")
        Time = ROUTE_INFO.updateTime;
    else if (type == 'default')
        Time = ROUTE_INFO.defaultTime;
    else if(type == "reboot")
        Time = ROUTE_INFO.rebootTime;
    var span = $("#time");
    var time = parseInt(Time, 10);
	span.html(time);
    if (REBOOT)
        window.clearInterval(REBOOT);
    REBOOT = window.setInterval(function () {
		time--;
		span.html(time);
		if (time == 0){
			window.onbeforeunload = null;
			if(isMobile){
				app_compatible.show_cut_net_tip();
				$(".wifiInfoChangeSection .title").html(MobileJsHtml.reboot.success);
				$(".wifiInfoChangeSection .tipConnectInfo").html(MobileJsHtml.reboot.relink);
				$(".wifiInfoChangeSection .wifi-name").html(ssid);
				window.history.back();
			}
			else
				RebootDelay();
			window.clearInterval(REBOOT);
		}        
    }, 1000)
}


function RebootDelay() {
    var path = "http://" + ROUTE_INFO.lan_ip;
    if (ROUTE_INFO.g_port != "80") {
        window.open(path + ":" + ROUTE_INFO.g_port, "_self");
    }
    else {
        window.open(path, "_self");
    }
}

function getType(typeN) {
	typeN = typeN >>> 0;
	if (typeN in {2: "iPhone", 3: "Android", 4: "Windows Phone"}) {
		return "mobile";
	}
	else if (typeN in {1: "Windows", 5: "Mac OS X", 6: "Linux"}) {
		return "pc";
	}
	else if (typeN in {7: "Pad"}) {
		return "pad";
	}
	else if (typeN in {10: "Camera"}) {
		return "camera";
	}
	else if (typeN in {11: "Router"}) {
		return "router";
	}
	else if (typeN in {12: "Repeater"}) {
		return "repeater";
	}
	else {
		return "none"

	}
}

//对象转化成url
function objectChangeToUrl(obj){
    var url=0;
    for(var member in obj){
        url+='&'+member+'='+obj[member];
    }
    return url=url.substr(2);
}
function paint_err_page(){
	var str = "";
	//str += '<div class="err-sec off"><div class="err_sec_wrapper"><div class="err_icon"></div><div class="err_discribe"><h2>'+ L.paramGetErr +'</h2><p><span>'+ L.errCode +'</span><span id="err_code"></span></p><p><span>'+ L.errInfo +'</span><span id="err_info"></span></p></div></div></div>';
	
	str += '<div class="err-sec off"><div class="err_sec_wrapper"><div class="err_icon"></div><div class="err_discribe"><h2>'+ L.netErr +'</h2></div><div class="exclamation_mark"><span class="body"></span><span class="dot"></span></div></div></div>';
	
	if($(".err-sec").length > 0)
		$(".err-sec").remove();
	$(".d-cnt").after(str);
}


function show_err_page(code){	
	$(".err-sec").removeClass("off");
	$(".d-cnt").addClass("off");
	$(".loading-sec").addClass("off");
	$(".no-conn-sec").addClass("off");
	$("#err_code").html((!!code || code * 1 == 0) ? code : errCode);
	$("#err_info").html(code ? formatServerCode(code) : formatErrorCode(errCode));
}

function hide_err_page(){
	$(".err-sec").addClass("off");
}


function paint_loading_page(){
	var str = "";
	str += '<div class="loading-sec off"><div class="loading-icon"><div class="loader"><div class="loader-inner line-spin-fade-loader"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div></div><p>'+ L.pageInit +'</p></div>';
	if($(".loading-sec").length > 0)
		$(".loading-sec").remove();
	$(".d-cnt").after(str);
}

var load_timer = null;
var load_wait_time = isApp().isRemote ? 2 : 0.5;
var load_start_time = null,load_end_time = null;

function show_loading_page(){
	var d = new Date();
	load_start_time = d.getTime();
	if(load_timer)
		window.clearTimeout(load_timer);
	load_timer = window.setTimeout(function(){
		if((load_end_time - load_start_time) > load_wait_time * 1000 || !!!load_end_time){
			$(".loading-sec").removeClass("off");
			$(".err-sec").addClass("off");
			$(".no-conn-sec").addClass("off");
			$(".d-cnt").addClass("off");
			$("#fullScreenMask").removeClass("off");
		}
		else{
			if(load_timer)
				window.clearTimeout(load_timer);
		}
	},load_wait_time * 1000);
	
}

function hide_loading_page(){
	var d = new Date();
	load_end_time = d.getTime();
	if(load_timer)
		window.clearTimeout(load_timer);
	$(".loading-sec").addClass("off");
	$("#fullScreenMask").addClass("off");
}

function paint_mask(){
	var str = "";
	str += '<div id="fullScreenMask" class="off"></div>';
	if($("#fullScreenMask").length > 0)
		$("#fullScreenMask").remove();
	$(".g-wrapper").after(str);
}
function hide_message() {
    igd.alert.hide();
}
function show_message(type, message) {
    igd.alert.print(type,message);
	igd.alert.show();
}
//
function show_message_gt(type, message){
	igd.alert.print(type,formatErrorCode(message));
	igd.alert.show();
}

function show_content(){
	$(".d-cnt").removeClass("off");
	$(".no-conn-sec").addClass("off");
	hide_loading_page();
	hide_err_page();
}
//绘制wan下拉框（适用于多wan口的情况）
function set_uiname_select(id,name,type) {
    var arr = [];
	if(typeof ROUTE_INFO == "undefined"){
		ROUTE_INFO = {};
		ROUTE_INFO.g_wan_number = igd.global_param.wan_number;
	}
    if (type == "ALL") {
        arr.push({text: "ALL", value: "ALL"});
        for (var i = 1; i <= ROUTE_INFO.g_wan_number; i++) {
            var wan_text = format_wan(i);
            var wan_val = "WAN" + i;
            arr.push({text: wan_text, value: wan_val});
        }
        arr.push({text: "LAN", value: "LAN"});
    }
    else if (type == "WAN") {
        for (var i = 1; i <= ROUTE_INFO.g_wan_number; i++) {
            var wan_text = format_wan(i);
            var wan_val = "WAN" + i;
            arr.push({text: wan_text, value: wan_val});
        }
    }
    else if (type == "LAN") {
        arr.push({text: "LAN", value: "LAN"});
    }
    else if (type == "WAN+LAN") {
        for (var i = 1; i <= ROUTE_INFO.g_wan_number; i++) {
            var wan_text = format_wan(i);
            var wan_val = "WAN" + i;
            arr.push({text: wan_text, value: wan_val});
        }
        arr.push({text: "LAN", value: "LAN"});
    }
    else if (type == "NODEV") {
        arr.push({text: appError.uiname_select, value: "nodev"});
        for (var i = 1; i <= ROUTE_INFO.g_wan_number; i++) {
            var wan_text = format_wan(i);
            var wan_val = "WAN" + i;
            arr.push({text: wan_text, value: wan_val});
        }
        arr.push({text: "LAN", value: "LAN"});
    }
    else if (type == "LAN+WAN") {
        arr.push({text: "LAN", value: "LAN"});
        for (var i = 1; i <= ROUTE_INFO.g_wan_number; i++) {
            var wan_text = format_wan(i);
            var wan_val = "WAN" + i;
            arr.push({text: wan_text, value: wan_val});
        }
    }
    paint_select(id, name ,arr);
}

//年月日拼接
function transformTime(timestamp) {
	timestamp=Math.round(timestamp*1000)
    if (timestamp) {
        var time = new Date(timestamp);
        var y = time.getFullYear(); //getFullYear方法以四位数字返回年份
        var M = time.getMonth() + 1; // getMonth方法从 Date 对象返回月份 (0 ~ 11)，返回结果需要手动加一
        var d = time.getDate(); // getDate方法从 Date 对象返回一个月中的某一天 (1 ~ 31)
        var h = time.getHours(); // getHours方法返回 Date 对象的小时 (0 ~ 23)
        var m = time.getMinutes(); // getMinutes方法返回 Date 对象的分钟 (0 ~ 59)
        var s = time.getSeconds(); // getSeconds方法返回 Date 对象的秒数 (0 ~ 59)
        return y + L.year + M + L.month + d + L.s_day;
      } else {
          return '';
      }
}
function format_wan(i) {
    var tmp = "";
    if (ROUTE_INFO.g_wan_number == 1)
        tmp = "WAN";
    else
        tmp = "WAN" + i;
    return tmp;
}

//获取Favicon
function getFaviconTag(){
	var links = document.getElementsByTagName('link');
		for(var i=0, len=links.length; i < len; i++) {
			if ((links[i].getAttribute('rel') || '').match(/\bicon\b/)) {
				var d = new Date();
				var val = links[i].getAttribute("href");
				links[i].setAttribute("href",val + "?t=" + d.getTime());
			}
		}
}
//截取文字长度,多余的已省略号显示
function cutString(str, len) {
	var strlen = 0;
	var s = "";
	for(var i = 0;i < str.length; i++) {
		s = s + str.charAt(i);
		if (str.charCodeAt(i) > 255 || str.charCodeAt(i) < 0) {
			strlen = strlen + 3;
			if(strlen >= len){
				return s.substring(0,s.length-1) + "...";
			}
		} else {
			strlen = strlen + 1;
			if(strlen >= len){
				return s.substring(0,s.length-2) + "...";
			}
		}
	}
	return s;
}
function convert_unit(str) {
	if(str == undefined)
		str = 0;
	var obj = {};
    var int_v = str * 1;
    var map = {0: "B", 1: "K", 2: "M", 3: "G", 4: "T"};
    var h = 0;
    for (h = 0; int_v >= 1024; h++) {
        int_v = int_v / 1024;
    }
    if (h > 4) {
        int_v = int_v * Math.pow(1024, (h - 4));
        h = 4;
    }
	obj.value = int_v.toString().indexOf(".") > -1 ? int_v.toFixed(2) : int_v;
	obj.unit = map[h];
    return obj;
}


//计算地址池
var dhcp_pool_calculator = {
	nAddr : new Array(0,0,0,0),
	nMask : new Array(0,0,0,0),
	ndhcpStart : new Array(0,0,0,0),
	ndhcpEnd : new Array(0,0,0,0),
	bit:function(d){//掩码位数
		var zeros = "00000000000000000000000000000000";
		var ones = "11111111111111111111111111111111";
		var b = ones.substring(0,d) + zeros.substring(0,32-d);
		var a = new Array(
		parseInt(b.substring(0,8),2)
		, parseInt(b.substring(8,16),2)
		, parseInt(b.substring(16,24),2)
		, parseInt(b.substring(26,32),2)
		);
		return a;
	},
	dec2octet:function(d){//数字还原成IP
		var zeros = "00000000000000000000000000000000";
		var b = d.toString(2);
		var b = zeros.substring(0,32-b.length) + b;
		var a = new Array(
			parseInt(b.substring(0,8),2)
			, (d & 16711680)/65536
			, (d & 65280)/256
			, (d & 255)
			);
		return a;
		
		/*var a = ((d>>>24) +'.' +
		(d>>16 & 255) +'.' +
		(d>>8 & 255) +'.' +
		(d & 255));
		return a;*/
		
	},
	octet2dec:function(a){//IP变成数字
		var d = 0;
		d = d + parseInt(a[0],10) * 16777216 ;
		d = d + parseInt(a[1],10) * 65536;
		d = d + parseInt(a[2],10) * 256;	
		d = d + parseInt(a[3],10);
		return d;
	},
	calculateIPCIDR:function(ip){
		this.nAddr = ip.split('.');
		for(var i in this.nAddr)
			this.nAddr[i] = parseInt(this.nAddr[i]);
		return this.getDhcpRangeStr();
	},
	getDhcpRangeStr: function(){

		var wc = this.wildcardMask(this.nMask);
		
		var aStart = this.startingIP(this.nAddr,this.nMask);
		var aEnd = this.endingIP(this.nAddr,wc);
	
		var ip1 = this.octet2dec(this.nAddr);
		var ip2 = this.octet2dec(aStart);
		var ip3 = this.octet2dec(aEnd);
		
		
		if(ip1 == ip2){
			aStart[3] = aStart[3]+1;
		}
		else if(ip1 == ip3){
			aEnd[3] = aEnd[3]-1;
		}

		/*如果是两个区间，则挑选区间最大的那个*/
		if (ip1>ip2 && ip1<ip3){
			if (this.nAddr[3]-1 <254 && this.nAddr[3]+1 < 254){
				if (ip1-ip2>ip3-ip1){
					aEnd[3] = this.nAddr[3]-1;
				}else {
					aStart[3] = this.nAddr[3]+1;
				}
			}
		}
		/*如果大于结束地址，则挑选结束地址前面的区域*/
		if (ip1>ip3){
			aEnd[3] = this.nAddr[3]-1;
		}
		
		this.ndhcpStart = aStart;
		this.ndhcpEnd = aEnd;
		
		return this.formatDhcpRangeStr();
		
	},
	formatDhcpRangeStr:function(){
		var obj = {};
		obj.dhcpStart = this.ndhcpStart[0] + "." + this.ndhcpStart[1] + "." + this.ndhcpStart[2] + "." + this.ndhcpStart[3];
		obj.dhcpEnd = this.ndhcpEnd[0] + "." + this.ndhcpEnd[1] + "." + this.ndhcpEnd[2] + "." + this.ndhcpEnd[3];
		return obj;
	},
	getNetwork:function(ip,mask){
		var ip_arr = ip.split(".");
		var mask_arr = mask.split(".");
		var ip_u32 = 0;
		var mask_u32 = 0;
	
		for(var j = 0; j < 4; j++){
			this.nAddr[j] = parseInt(ip_arr[j],10);
			this.nMask[j] = parseInt(mask_arr[j],10);
			
			ip_u32 = ip_u32 * 256 + ip_arr[j] * 1;
			mask_u32 = mask_u32 * 256 + mask_arr[j] * 1;
		}
		
		return ip_u32 & mask_u32;
	},
	formatDhcpPool:function(ip,mask,start,limit){
		var ip_arr = ip.split(".");
		var mask_arr = mask.split(".");
		// not use (!!start && !!limit), limit maybe 0, because StartIp maybe equal to EndIp, limit = (EndIp & (~SubNet)) - (StartIp & (~SubNet))
		if(!!start){

			var network = this.getNetwork(ip,mask);
			
			var start_ip = (network + start) >>> 0;
			var end_ip = (start_ip + limit-1) >>> 0;
			
			
			this.ndhcpStart = this.dec2octet(start_ip);
			this.ndhcpEnd = this.dec2octet(end_ip);
			
			
		}
		else{
			for(var j = 0; j < 4; j++){
				this.nAddr[j] = parseInt(ip_arr[j],10);
				this.nMask[j] = parseInt(mask_arr[j],10);
			}
			var wc = this.wildcardMask(this.nMask);
			this.ndhcpStart = this.startingIP(this.nAddr,this.nMask);
			this.ndhcpEnd = this.endingIP(this.nAddr,wc);
			
			var ip_1 = this.octet2dec(this.nAddr);
			var ip_2 = this.octet2dec(this.ndhcpStart);
			var ip_3 = this.octet2dec(this.ndhcpEnd);
			
			if(ip_1 == ip_2){
				this.ndhcpStart[3] = this.ndhcpStart[3]+1;
			}
			else if(ip_1 == ip_3){
				this.ndhcpEnd[3] = this.ndhcpEnd[3]-1;
			}
		}
	},
	getDhcpLimit:function(ip,mask,start_ip,end_ip){

		var start_ip_arr = start_ip.split(".");
		var end_ip_arr = end_ip.split(".");
		
		var start_ip = this.octet2dec(start_ip_arr) * 1;
		var end_ip = this.octet2dec(end_ip_arr) * 1;
		
		
		var network = this.getNetwork(ip,mask);
		
		var start = start_ip & ~network;
		var limit = (end_ip & ~network) - start;
		
		limit=limit+1;
		
		return {
			"start":start,
			"limit":limit
		};
	},
	calculateSubnet:function(mask){
		var a = mask.split('.');
		this.nMask[0] = parseInt(a[0]);
		this.nMask[1] = parseInt(a[1]);
		this.nMask[2] = parseInt(a[2]);
		this.nMask[3] = parseInt(a[3]);
		return this.getDhcpRangeStr();
	},
	startingIP:function(aNet,aMask){
		var a = this.subnetID(aNet,aMask);
		var d = this.octet2dec(a);
		d = d+1;
		return this.dec2octet(d);
	},
	endingIP:function(aNet,aWild){
		var a = new this.broadcast(aNet,aWild);
		var d = this.octet2dec(a);
		d = d-1;
		return this.dec2octet(d);
	},
	subnetID:function(aNet,aMask){
		var a = new Array(0,0,0,0);
		for(var i=0;i<4;i++){
			a[i] = aNet[i] & aMask[i];
		}
		return a;
	},
	broadcast:function(aNet,aWild){
		var a = new Array(0,0,0,0);
		for(var i=0;i<4;i++){
			a[i] = aNet[i] | aWild[i];
		}
		return a;
	},
	wildcardMask:function(aMask){
		var a = new Array(0,0,0,0);
		for(var i=0;i<4;i++){
			a[i] = 255 - aMask[i];
		}
		return a;
	}
};

//通过ip地址,掩码,地址起始主机号,地址池数量来计算地址池范围
function dhcp_pool_calculator_new(ip,mask,start,cnt){
  var ip_arr = ip.split(".");
  var mask_arr = mask.split(".");
  var ip_u32 = 0;
  var mask_u32 = 0;
  var network;
  var start_ip;
  var end_ip;
  var dhcp_range={dhcpStart:"",dhcpEnd:""};
  
	  for(var j = 0; j < 4; j++){
	   ip_u32 = ip_u32 * 256 + parseInt(ip_arr[j],10);
	   mask_u32 = mask_u32 * 256 + parseInt(mask_arr[j],10);
	  }
  
	  network = ip_u32 & mask_u32;
	 
	  start_ip = network + start;
	  end_ip = start_ip + cnt - 1;
// console.log("network",ip_u32.toString(2),mask_u32.toString(2),network,_int2iP(network),start_ip & ~network)
    
//console.log("地址池数量",_int2iP(end_ip & ~network),_int2iP(network+1),_int2iP(~mask_u32 + network),_int2iP(~mask_u32 + network)>_int2iP(network+1))
	  start_ip = start_ip >>> 0;
	  end_ip = end_ip >>> 0;
// console.log("这是啥",start_ip,end_ip)
 	 var tmp;
	 for(var j = 0; j < 4; j++){
	   tmp = start_ip & 255;
	   start_ip = start_ip >>> 8;
	   dhcp_range.dhcpStart = tmp.toString(10) + "." + dhcp_range.dhcpStart;
	   
	  }
//	 console.log("起始主机号",_int2iP(start_ip & ~network),_int2iP(end_ip & ~network))
	dhcp_range.dhcpStart=handle_format(dhcp_range.dhcpStart)
   
  
	  for(var j = 0; j < 4; j++){
	   tmp = end_ip & 255;
	   end_ip = end_ip >>> 8;
	   dhcp_range.dhcpEnd = tmp.toString(10) + "." + dhcp_range.dhcpEnd;
	  }
	 dhcp_range.dhcpEnd=handle_format(dhcp_range.dhcpEnd)
//	 	console.log(network,start_ip,_int2iP(~mask_u32),_int2iP(network+1),_int2iP(start_ip & ~network))
	
	function _int2iP(num){
	    var str;
	    var tt = new Array();
	    tt[0] = (num >>> 24) >>> 0;
	    tt[1] = ((num << 8) >>> 24) >>> 0;
	    tt[2] = (num << 16) >>> 24;
	    tt[3] = (num << 24) >>> 24;
	    str = String(tt[0]) + "." + String(tt[1]) + "." + String(tt[2]) + "." + String(tt[3]);
	    return str;
	}
  //美化数据
   function handle_format(data){
	 	var handle_data;
	 	data= data.split(".");
		handle_data=data[0]+"."+data[1]+"."+data[2]+"."+data[3];
		return handle_data;
	}
  
 	return dhcp_range;
 }
//通过ip地址，子网掩码，开始地址和结束地址计算地址起始主机号和数量
//192.168.0.1 192.168.0.5 192.168.0.50 255.255.255.0
function address_pool_calculation(ip, start, end, mask){
  var ip_arr = ip.split(".");
  var start_arr = start.split(".");
  var end_arr = end.split(".");
  var mask_arr = mask.split(".");
  var ip_u32 = 0;
  var start_u32 = 0;
  var end_u32 = 0;
  var mask_u32 = 0;
  var dhcp_range={dhcpStart:0,dhcpLimit:0};
  
	  for(var j = 0; j < 4; j++){
	   ip_u32 = ip_u32 * 256 + parseInt(ip_arr[j],10);
	   start_u32 = start_u32 * 256 + parseInt(start_arr[j],10);
	   end_u32 = end_u32 * 256 + parseInt(end_arr[j],10);
	   mask_u32 = mask_u32 * 256 + parseInt(mask_arr[j],10);
	  }
  
  if((start_u32 & mask_u32) != (ip_u32 & mask_u32)){
		//error 
		return false;
  }
  if((start_u32 & mask_u32) != (end_u32 & mask_u32)){
		//error 
			return false;
  }
  
  if(ip_u32>=start_u32 && ip_u32<=end_u32){
  	//error
  		return false;
  }
  
  dhcp_range.dhcpStart = start_u32 & (~mask_u32);
  dhcp_range.dhcpLimit = end_u32 - start_u32 + 1;
  
 	return dhcp_range;
 }


/*掩码计算器*/ 

var net_mask_calculator = {
	
	netmask2CIDR:function(netmask){// 255.255.255.0 转 24
		(netmask.split(".").map(Number).map(part = function(part) {
		  return (part >>> 0).toString(2);
		}).join('')).split('1').length -1;
	},
	CDIR2netmask:function(bitCount){//24 转 255.255.255.0
		if(bitCount=="0.0.0.0"){
			return bitCount;
		}
		var mask=[];
		for(var i=0;i<4;i++) {
			var n = Math.min(bitCount, 8);
			mask.push(256 - Math.pow(2,8-n));
			bitCount -=n;
		}
		return mask.join(".");
	}
};
function ipToNumber(ip) {  
	var numbers = ip.split(".");  
	return parseInt(numbers[0])*256*256*256 +   
	parseInt(numbers[1])*256*256 +   
	parseInt(numbers[2])*256 +   
	parseInt(numbers[3]);  
}  
 
function numberToIp(number) {  
	return (Math.floor(number/(256*256*256))) + "." +   
	(Math.floor(number%(256*256*256)/(256*256))) + "." +   
	(Math.floor(number%(256*256)/256)) + "." +   
	(Math.floor(number%256));  
}
//slimscroll
(function($) {

  jQuery.fn.extend({
    slimScroll: function(options) {

      var defaults = {

        // width in pixels of the visible scroll area
        width : 'auto',

        // height in pixels of the visible scroll area
        height : '250px',

        // width in pixels of the scrollbar and rail
        size : '7px',

        // scrollbar color, accepts any hex/color value
        color: '#000',

        // scrollbar position - left/right
        position : 'right',

        // distance in pixels between the side edge and the scrollbar
        distance : '1px',

        // default scroll position on load - top / bottom / $('selector')
        start : 'top',

        // sets scrollbar opacity
        opacity : .4,

        // enables always-on mode for the scrollbar
        alwaysVisible : false,

        // check if we should hide the scrollbar when user is hovering over
        disableFadeOut : false,

        // sets visibility of the rail
        railVisible : false,

        // sets rail color
        railColor : '#333',

        // sets rail opacity
        railOpacity : .2,

        // whether  we should use jQuery UI Draggable to enable bar dragging
        railDraggable : true,

        // defautlt CSS class of the slimscroll rail
        railClass : 'slimScrollRail',

        // defautlt CSS class of the slimscroll bar
        barClass : 'slimScrollBar',

        // defautlt CSS class of the slimscroll wrapper
        wrapperClass : 'slimScrollDiv',

        // check if mousewheel should scroll the window if we reach top/bottom
        allowPageScroll : false,

        // scroll amount applied to each mouse wheel step
        wheelStep : 20,

        // scroll amount applied when user is using gestures
        touchScrollStep : 200,

        // sets border radius
        borderRadius: '7px',

        // sets border radius of the rail
        railBorderRadius : 'none'
      };

      var o = $.extend(defaults, options);

      // do it for every element that matches selector
      this.each(function(){

      var isOverPanel, isOverBar, isDragg, queueHide, touchDif,
        barHeight, percentScroll, lastScroll,
        divS = '<div></div>',
        minBarHeight = 30,
        releaseScroll = false;

        // used in event handlers and for better minification
        var me = $(this);

        // ensure we are not binding it again
        if (me.parent().hasClass(o.wrapperClass))
        {
            // start from last bar position
            var offset = me.scrollTop();

            // find bar and rail
            bar = me.parent().find('.' + o.barClass);
            rail = me.parent().find('.' + o.railClass);

            getBarHeight();

            // check if we should scroll existing instance
            if ($.isPlainObject(options))
            {
              // Pass height: auto to an existing slimscroll object to force a resize after contents have changed
              if ( 'height' in options && options.height == 'auto' ) {
                me.parent().css('height', 'auto');
                me.css('height', 'auto');
                var height = me.parent().parent().height();
                me.parent().css('height', height);
                me.css('height', height);
              } else if ('height' in options) {
                var h = options.height;
                me.parent().css('height', h);
                me.css('height', h);
              }

              if ('scrollTo' in options)
              {
                // jump to a static point
                offset = parseInt(o.scrollTo);
              }
              else if ('scrollBy' in options)
              {
                // jump by value pixels
                offset += parseInt(o.scrollBy);
              }
              else if ('destroy' in options)
              {
                // remove slimscroll elements
                bar.remove();
                rail.remove();
                me.unwrap();
                return;
              }

              // scroll content by the given offset
              scrollContent(offset, false, true);
            }

            return;
        }

        // optionally set height to the parent's height
        o.height = (o.height == 'auto') ? me.parent().height() : o.height;

        // wrap content
        var wrapper = $(divS)
          .addClass(o.wrapperClass)
          .css({
            position: 'relative',
            overflow: 'hidden',
            width: o.width,
            height: o.height
          });

        // update style for the div
        me.css({
          overflow: 'hidden',
          width: o.width,
          height: o.height
        });

        // create scrollbar rail
        var rail = $(divS)
          .addClass(o.railClass)
          .css({
            width: o.size,
            height: '100%',
            position: 'absolute',
            top: 0,
            display: (o.alwaysVisible && o.railVisible) ? 'block' : 'none',
            'border-radius': o.railBorderRadius,
            background: o.railColor,
            opacity: o.railOpacity,
            zIndex: 90
          });

        // create scrollbar
        var bar = $(divS)
          .addClass(o.barClass)
          .css({
            background: o.color,
            width: o.size,
            position: 'absolute',
            top: 0,
            opacity: o.opacity,
            display: o.alwaysVisible ? 'block' : 'none',
            'border-radius' : o.borderRadius,
            BorderRadius: o.borderRadius,
            MozBorderRadius: o.borderRadius,
            WebkitBorderRadius: o.borderRadius,
            zIndex: 99
          });

        // set position
        var posCss = (o.position == 'right') ? { right: o.distance } : { left: o.distance };
        rail.css(posCss);
        bar.css(posCss);

        // wrap it
        me.wrap(wrapper);

        // append to parent div
        me.parent().append(bar);
        me.parent().append(rail);

        // make it draggable and no longer dependent on the jqueryUI
        if (o.railDraggable){
          bar.bind("mousedown", function(e) {
            var $doc = $(document);
            isDragg = true;
            t = parseFloat(bar.css('top'));
            pageY = e.pageY;

            $doc.bind("mousemove.slimscroll", function(e){
              currTop = t + e.pageY - pageY;
              bar.css('top', currTop);
              scrollContent(0, bar.position().top, false);// scroll content
            });

            $doc.bind("mouseup.slimscroll", function(e) {
              isDragg = false;hideBar();
              $doc.unbind('.slimscroll');
            });
            return false;
          }).bind("selectstart.slimscroll", function(e){
            e.stopPropagation();
            e.preventDefault();
            return false;
          });
        }

        // on rail over
        rail.hover(function(){
          showBar();
        }, function(){
          hideBar();
        });

        // on bar over
        bar.hover(function(){
          isOverBar = true;
        }, function(){
          isOverBar = false;
        });

        // show on parent mouseover
        me.hover(function(){
          isOverPanel = true;
          showBar();
          hideBar();
        }, function(){
          isOverPanel = false;
          hideBar();
        });

        // support for mobile
        me.bind('touchstart', function(e,b){
          if (e.originalEvent.touches.length)
          {
            // record where touch started
            touchDif = e.originalEvent.touches[0].pageY;
          }
        });

        me.bind('touchmove', function(e){
          // prevent scrolling the page if necessary
          if(!releaseScroll)
          {
  		      e.originalEvent.preventDefault();
		      }
          if (e.originalEvent.touches.length)
          {
            // see how far user swiped
            var diff = (touchDif - e.originalEvent.touches[0].pageY) / o.touchScrollStep;
            // scroll content
            scrollContent(diff, true);
            touchDif = e.originalEvent.touches[0].pageY;
          }
        });

        // set up initial height
        getBarHeight();

        // check start position
        if (o.start === 'bottom')
        {
          // scroll content to bottom
          bar.css({ top: me.outerHeight() - bar.outerHeight() });
          scrollContent(0, true);
        }
        else if (o.start !== 'top')
        {
          // assume jQuery selector
          scrollContent($(o.start).position().top, null, true);

          // make sure bar stays hidden
          if (!o.alwaysVisible) { bar.hide(); }
        }

        // attach scroll events
        attachWheel();

        function _onWheel(e)
        {
          // use mouse wheel only when mouse is over
          if (!isOverPanel) { return; }

          var e = e || window.event;

          var delta = 0;
          if (e.wheelDelta) { delta = -e.wheelDelta/120; }
          if (e.detail) { delta = e.detail / 3; }

          var target = e.target || e.srcTarget || e.srcElement;
          if ($(target).closest('.' + o.wrapperClass).is(me.parent())) {
            // scroll content
            scrollContent(delta, true);
          }

          // stop window scroll
          if (e.preventDefault && !releaseScroll) { e.preventDefault(); }
          if (!releaseScroll) { e.returnValue = false; }
        }

        function scrollContent(y, isWheel, isJump)
        {
          releaseScroll = false;
          var delta = y;
          var maxTop = me.outerHeight() - bar.outerHeight();

          if (isWheel)
          {
            // move bar with mouse wheel
            delta = parseInt(bar.css('top')) + y * parseInt(o.wheelStep) / 100 * bar.outerHeight();

            // move bar, make sure it doesn't go out
            delta = Math.min(Math.max(delta, 0), maxTop);

            // if scrolling down, make sure a fractional change to the
            // scroll position isn't rounded away when the scrollbar's CSS is set
            // this flooring of delta would happened automatically when
            // bar.css is set below, but we floor here for clarity
            delta = (y > 0) ? Math.ceil(delta) : Math.floor(delta);

            // scroll the scrollbar
            bar.css({ top: delta + 'px' });
          }

          // calculate actual scroll amount
          percentScroll = parseInt(bar.css('top')) / (me.outerHeight() - bar.outerHeight());
          delta = percentScroll * (me[0].scrollHeight - me.outerHeight());

          if (isJump)
          {
            delta = y;
            var offsetTop = delta / me[0].scrollHeight * me.outerHeight();
            offsetTop = Math.min(Math.max(offsetTop, 0), maxTop);
            bar.css({ top: offsetTop + 'px' });
          }

          // scroll content
          me.scrollTop(delta);

          // fire scrolling event
          me.trigger('slimscrolling', ~~delta);

          // ensure bar is visible
          showBar();

          // trigger hide when scroll is stopped
          hideBar();
        }

        function attachWheel()
        {
          if (window.addEventListener)
          {
            this.addEventListener('DOMMouseScroll', _onWheel, false );
            this.addEventListener('mousewheel', _onWheel, false );
            this.addEventListener('MozMousePixelScroll', _onWheel, false );
          }
          else
          {
            document.attachEvent("onmousewheel", _onWheel)
          }
        }

        function getBarHeight()
        {
          // calculate scrollbar height and make sure it is not too small
          barHeight = Math.max((me.outerHeight() / me[0].scrollHeight) * me.outerHeight(), minBarHeight);
          bar.css({ height: barHeight + 'px' });

          // hide scrollbar if content is not long enough
          var display = barHeight == me.outerHeight() ? 'none' : 'block';
          bar.css({ display: display });
        }

        function showBar()
        {
          // recalculate bar height
          getBarHeight();
          clearTimeout(queueHide);

          // when bar reached top or bottom
          if (percentScroll == ~~percentScroll)
          {
            //release wheel
            releaseScroll = o.allowPageScroll;

            // publish approporiate event
            if (lastScroll != percentScroll)
            {
                var msg = (~~percentScroll == 0) ? 'top' : 'bottom';
                me.trigger('slimscroll', msg);
            }
          }
          else
          {
            releaseScroll = false;
          }
          lastScroll = percentScroll;

          // show only when required
          if(barHeight >= me.outerHeight()) {
            //allow window scroll
            releaseScroll = true;
            return;
          }
          bar.stop(true,true).fadeIn('fast');
          if (o.railVisible) { rail.stop(true,true).fadeIn('fast'); }
        }

        function hideBar()
        {
          // only hide when options allow it
          if (!o.alwaysVisible)
          {
            queueHide = setTimeout(function(){
              if (!(o.disableFadeOut && isOverPanel) && !isOverBar && !isDragg)
              {
                bar.fadeOut('slow');
                rail.fadeOut('slow');
              }
            }, 1000);
          }
        }

      });

      // maintain chainability
      return this;
    }
  });

  jQuery.fn.extend({
    slimscroll: jQuery.fn.slimScroll
  });

})(jQuery);



//判断输入密码的类型  
function CharMode(iN) {
    if (iN >= 48 && iN <= 57) //数字
        return 1;
    if (iN >= 65 && iN <= 90) //大写
        return 2;
    if (iN >= 97 && iN <= 122) //小写
        return 2;
    else {
        return 8;
    }
}

//bitTotal函数  
//计算密码模式  
function bitTotal(num) {//传入参数1 2 4 8
    modes = 0;
    for (var i = 0; i < 4; i++) {
        if (num & 1) //全1为1
            modes++;
        num >>>= 1; // >>> 向右移1位
    }
    return modes;
}


//返回强度级别  
function checkStrong(sPW) {
    if (sPW.length < 8)
        return 0; //密码太短
    var Modes = 0;
    for (i = 0; i < sPW.length; i++) {
        //密码模式
        Modes |= CharMode(sPW.charCodeAt(i));
        //只有两个操作数上相对应的位都是0时，其运算结果相对应的位才是0，否则为1。
    }
    return bitTotal(Modes);
}


//顶部导航
var appBar = {
	show:function(html_name){
		if(html_name == "nav_device_list" && !$.cookie("downnow") && !$.cookie("downlater")){
			// $(".topbar").stop(true,true).animate({top:"40px"},400);
			// $(".down_app").stop(true,true).slideDown(400);
			// $("#article").stop(true,true).animate({paddingTop:"115px"},400);
			// $(".down_app_btn,.download_later").fadeIn();
		}
		else{
			// $(".topbar").stop(true,true).animate({top:"0px"},400);
			// $(".down_app").stop(true,true).slideUp(400);
			// $("#article").stop(true,true).animate({paddingTop:"75px"},400);
		}
		this.init();
	},
	app_bar_relate:function(){
		$(".topbar").stop(true,true).animate({top:"0px"},400);
		$("#article").stop(true,true).animate({paddingTop:"75px"},400);
	},
	download_later:function(){
		var me = this;
		$(".down_app_btn,.download_later").fadeOut();
		$.cookie( "downlater" ,"true",{ path: '/', expires: 7 });
		$(".down_app").slideUp(400,function(){
			me.app_bar_relate();
		});
	},
	download_now:function(){
		var me = this;
		$(".down_app_btn,.download_later").fadeOut();
		$("#nav_mobile_app").click();
		$.cookie( "downnow" ,"true",{ path: '/', expires: 7 });
		$(".down_app").slideUp(400,function(){
			me.app_bar_relate();
		});
	},
	init:function(){
		var _this = this;
		$(".down_app_btn").unbind("click").bind("click",function(){
			_this.download_now();
		});
		$(".download_later").unbind("click").bind("click",function(){
			_this.download_later();
		});
	}
};

//by lwj ===== time week
;(function(){
    var timeFormat = function(val){
        return (val*=1,val<10?"0"+val:val);
    };
    var timeSlot = {
        addEventList:function(){
            var timeSlotDom = $(".timeSlot");
            var maxNum = [23,59];
            var lastVal = "00";
            timeSlotDom.undelegate("input","keyup").delegate("input","keyup",function(){
                var viewValue = $(this).val(),errorStr;
                var _type = $(this).hasClass("hour")?0:1;
                (errorStr = viewValue.match(/[^0-9]+/gi)) && $(this).val(viewValue.replace(errorStr,""));
                viewValue = $(this).val()>>>0;
                viewValue>maxNum[_type] &&  $(this).val(maxNum[_type]);
            });
            timeSlotDom.undelegate("input","blur").delegate("input","blur",function(){
                $(this).val()==="" && $(this).val(lastVal);
                var viewValue = $(this).val()>>>0;
                viewValue<10 && $(this).val("0"+viewValue);
            });
            timeSlotDom.undelegate("input","focus").delegate("input","focus",function(){
                lastVal = $(this).val();
                $(this).val("");
            });
        },
        setData:function(data){
            if(!!data){
                $(".start.hour").val(timeFormat(data["start_hour"]));
                $(".start.min").val(timeFormat(data["start_minute"]));
                $(".end.hour").val(timeFormat(data["end_hour"]));
                $(".end.min").val(timeFormat(data["end_minute"]));
            }else{
                $(".start,.end").val("00");
            }
        },
        check:function(startH,startM,endH,endM){
            var start_h = startH>>0 || ($(".start.hour").val())>>0;
            var start_m = startM>>0 || ($(".start.min").val())>>0;
            var end_h = endH>>0 ||($(".end.hour").val())>>0;
            var end_m = endM>>0 ||($(".end.min").val())>>0;
            end_h ===0&&start_h !==0&&(end_h=24);
            if(start_h<=end_h){
                 start_m === 0 &&(start_h-=1,start_m=60);
                 end_m === 0 &&(end_h-=1,end_m=60);
                 if(end_h===start_h && end_m===start_m){
                    show_message("warning",L.startAndEnd);return false;
                 }
                if((end_h===start_h && end_m-start_m>=0&&end_m-start_m<5)||(end_h === (start_h+1)&&(60+end_m-start_m)<5)){
                    show_message("warning",L.leastFiveMinute);return false;
                 }
            }
            return true;
        },
        init:function(data){
            var me = this ;
            var timeHtml = "<input class='start hour' name='start_hour' maxlength='2' value='00' autocomplete='off'/>" +
                "<b  style=class='timeSlot_unit' id='hourStart'> 点</b>" +
                "<input class='start min'  name='start_minute' maxlength='2' value='00' autocomplete='off'/>" +
                "<b class='spacing' class='timeSlot_unit' id='minStart'> 分&nbsp; ~ &nbsp;</b>" +
                "<input class='end hour'  name='end_hour' maxlength='2' value='00' autocomplete='off'/>" +
                "<b style=class='timeSlot_unit' id='hourEnd'> 点</b>" +
                "<input class='end min'  name='end_minute'  maxlength='2' value='00' autocomplete='off'/>" +
                "<b style=class='timeSlot_unit' id='minEnd'> 分</b>";
            var timeSlotDom = $(".timeSlot");
            timeSlotDom.html(timeHtml);
            data && me.setData(data);
            me.addEventList();
        }
    };
    var weekSlot = {
        addEventList:function(){
            var weeks = $(".weekSlot span");
            $(".weekSlot").undelegate("span","click").delegate("span","click",function(){
                $(this).toggleClass("active");
                setWeekDay();
            });
            function setWeekDay(){
                var weekDay = [];
                $.each(weeks,function(i,n){
                    if($(n).hasClass("active")){
                        weekDay.push(i+1);
                    }
                });
                $(".weekSlotVal").val(weekDay.join(" "));
            }
        },
        check:function(){
            if(!$(".weekSlotVal").val()){
                show_message("warning", L.leastOneWeek);return false;
                return false;
            }
            return true;
        },
        setData:function(data){
            var weekObj = $(".weekSlot span");
            weekObj.removeClass("active");
            if(!!data){
                data = data.replace(/\+/gi," ");
                var checkedWeek = data.split(" ");
                var activeLen = checkedWeek.length;
                for(var i =0;i<activeLen;i++){
                    weekObj.eq(checkedWeek[i]-1).addClass("active");
                }
            }
            $(".weekSlotVal").val(data);
        },
        init:function(data){
            var me = this;
            var weekHtml = "<span class='noMargin'>"+L.day0+"</span><span>"+L.day1+"</span><span>"+L.day2+"</span><span>"+L.day3+"</span><span>"+L.day4+"</span><span>"+L.day5+"</span><span>"+L.day6+"</span>" +
                "<input type='hidden' name='timer_day' class='weekSlotVal' />";
            $(".weekSlot").html(weekHtml);
            me.addEventList();
            data && me.setData(data);
        }
    };
    function _init_weekStr(weeks){
		var weekLang = ["一","二","三","四","五","六","日"];
		var weekArr = weeks.replace(/(\+|\s)/gi,",").split(",").sort();
		var weekLen = weekArr.length;
		var weekStr="";
		if(weekLen===7){
			weekStr="每天";
		}else{
			for(var i = 0;i<weekLen;i++){
				if(weekArr[i]>=6){
					weekStr+="<span class='weekend'>星期"+weekLang[weekArr[i]-1]+"</span> ";
				}else{
					weekStr+="星期"+weekLang[weekArr[i]-1]+" ";
				}
			}
		}
		return weekStr;
	}
    function _table_timeFormat(data,editFn,delFn,statusFn){
        var listLen = data.length;
        var listArr_tab = [];

        for(var i = 0;i<listLen;i++){
            if(!data[i]) continue;
            var list = {};
            list.id= i+1;
            list.time = timeFormat(data[i]['start_hour'])+":"+timeFormat(data[i]['start_minute'])+"~"+timeFormat(data[i]['end_hour'])+":"+timeFormat(data[i]['end_minute']);
            list.week = _init_weekStr(data[i].timer_day);
            list.op = '<a onclick="'+editFn+'('+ i +')" title="'+ L.modify +'" class="fun_link edit" href="javascript:void(0);">'+ L.modify +'</a><a onclick="'+delFn+'('+ i +')" title="'+ L.s_delete +'" class="fun_link del" href="javascript:void(0);">'+ L.s_delete +'</a><a onclick="'+statusFn+'('+ i +')" title="'+ L.statusBtn[data[i].timer_enable] +'" class="fun_link edit" href="javascript:void(0);">'+ L.statusBtn[data[i].timer_enable] +'</a>';
            listArr_tab.push(list);
        }
        return listArr_tab;
    }

    function rule_check(targetRule,arrRule){
        var start_h = (targetRule && targetRule.start_hour >> 0) || ($(".start.hour").val()) >> 0;
        var start_m = (targetRule && targetRule.start_min >> 0) || ($(".start.min").val()) >> 0;
        var end_h = (targetRule && targetRule.end_hour >> 0) || ($(".end.hour").val()) >> 0;
        var end_m = (targetRule && targetRule.end_min >> 0) || ($(".end.min").val()) >> 0;
        var weekVal = (targetRule && targetRule.week >> 0) || $(".weekSlotVal").val();
        var ruleLen = arrRule.length;
        for(var i=0;i<ruleLen;i++){
            if(weekVal == arrRule[i].timer_day.replace(/\+/gi," ").split(" ").sort().join(" ")){
                if(start_h ==arrRule[i].start_hour &&start_m ==arrRule[i].start_minute&&end_h ==arrRule[i].end_hour &&end_m ==arrRule[i].end_minute){
                    show_message("warning",L.ruleSame);
                    return false;
                }
            }
        }
        return true;
    }
    window.timeSlot = timeSlot;
    window.weekSlot = weekSlot;
    window.rule_check = rule_check;
    window.timeSlotTableFormat = _table_timeFormat;
	window.init_weekStr = _init_weekStr;
    window.timeSlotFormat = timeFormat;
})();

function init_module(){
	
}
/*by lanwj tab页切换*/
;!(function (win) {
    var componentTab = function (tabCtrlSelector, contentSelector, callback, options) {
        options = $.extend(true, {
            event: "click",
            className: "active",
            dataId: "data-tab-id",
            dataHtml: "data-tab-html",
            callback: typeof callback === "function" ? callback : $.noop
        }, options);
        var tabCtrl = $(tabCtrlSelector);
        var tabContent = $(contentSelector);
        var setTabStatus = function (activeDom, e) {
            var activeId = $(activeDom).attr(options.dataId);
            tabCtrl.removeClass(options.className);
            $(activeDom).addClass(options.className);
            if (!activeId) {
                activeId = tabCtrl.index(activeDom);
                tabContent.hide().eq(activeId).show();
            } else {
                tabContent.hide().filter("[" + options.dataHtml + "=" + activeId + "]").show();
            }
            options.callback.apply(activeDom, [e || event]);
        };
        if (!tabCtrl || tabCtrl.length < 1) return false;
        var _Tab = function () {
            this.init();
            this._addEventLister();
        };
        _Tab.prototype = {
            init: function () {
                var activeDom = tabCtrl.filter("." + options.className);
                if (activeDom && activeDom.length > 0) return false;
                setTabStatus(tabCtrl.eq(0));
            },
            _addEventLister: function () {
                tabCtrl.unbind(options.event).bind(options.event, function (e) {
                    e.preventDefault();
                    setTabStatus(this, e);
                });
            },
            go: function (id) {
                var activeDom = null;
                if (typeof id === "number") {
                    activeDom = tabCtrl.eq(id);
                }
                if (typeof id === "string") {
                    activeDom = tabCtrl.filter("[" + options.dataId + "=" + id + "]");
                }
                activeDom && setTabStatus(activeDom);
            }
        };
        return new _Tab();
    };
    win.components_tab = componentTab;
})(window);
function compare(dest,src){
	var change = false;
	if($.isEmptyObject(src))
		return true;
	for(var i in dest){
		if(src[i] != undefined){
			if(dest[i] instanceof Array){
				if(JSON.stringify(dest[i]) != JSON.stringify(src[i])){
					change = true;
					break;
				}
			}
			else{
				if(dest[i] != src[i]){
					change = true;
					break;
				}	
			}
				
		}
	}
	return change;
}


function detectWifiStatus(){
	delay(function(){
		detectResponse();
	},5 * 1000);
}

function detectResponse(need_msg,msg){
	var dfd = $.Deferred();
	$.when(isResponse()).then(function(ret){
		//ret = false;
		if(ret){
			//LAN侧或者无线已断开
			hide_message();
			$(".d-cnt").addClass("off");
			$(".loading-sec").addClass("off");
			$(".err-sec").addClass("off");
			$(".no-conn-sec").removeClass("off");
		}
		else{
			if(need_msg){
				//如果LAN侧重启完成要打印消息
				show_message("success",msg);
			}
		}
		
		dfd.resolve(ret);
	});
	return dfd.promise();
}

function checkIsStrongPwd(val){
	if(checkStrong(val) < router.pwd_strength_level){
		return false;
	}
	return true;
}
function ifIsMobile(){
    return /Android|iPhone|iPad|iPod|BlackBerry|webOS|Windows Phone|SymbianOS|IEMobile|Opera Mini/i.test(navigator.userAgent);
}
function render_page(){
	configurationState()
	ac_ap_status()
	render_page_title_cgi();
	getImg();
	expire_login_out();
	igd.alert = new Msg();
	paint_err_page();
	paint_loading_page();
	paint_mask();
	
	scrollIntoView();
	
	
}
//获取是否进行快速配置配置的状态//判断是否完成快速配置向导initialized：0-未完成配置向导，1-已完成配置向导
function configurationState(){
  var a1='{"jsonrpc": "2.0", "id": 25, "method": "call", "params": [ "00000000000000000000000000000000", "routerd", "param_status", {"action":"get" } ] }'
	
	var dfd = $.Deferred();
	request({
		url:"/ubus",
		data:a1
	}).done(function(data){
		handleResponse(data,function(){
			ROUTE_INFO.initialized=data.result[1].initialized;
			ROUTE_INFO.guidepage=data.result[1].guidepage;
			if(data.result[1].initialized == 0 && data.result[1].guidepage==1){
				if(window.location.pathname!="/guide/guide.html"){
					window.location.href="/guide/guide.html";
				}
//				else{
//					hide_loading_page();
//					show_content();
//				}
			}
			else{
				if(window.location.pathname!="/guide/guide.html"){
					if(window.location.pathname != "/login.html"){
						
						var a2='{"jsonrpc": "2.0", "id": 2, "method": "call", "params": [ "'+localStorage.getItem('token_id')+'", "routerd", "lan_config_get", { } ] }'
						
							request({
									url:"/ubus",
									data:a2
								}).done(function(data){
								
							if(!check_data(data)){
								window.location.href="/login.html";
							}
//							else{
//								hide_loading_page();
//								show_content();
//							}
							
						}).fail(function(data){
							//show_request_err(data);
						})
					}
//					else{
//						hide_loading_page();
//						show_content();
//					}
				}
				else{
					window.location.href="/login.html";
				}
			}
		},function(){
			hide_loading_page();
			show_err_page();	
		});
		
	}).fail(function(data){
		hide_loading_page();
		show_err_page(data.XMLHttpRequest.status);
		dfd.reject();
	});
	return dfd.promise();
	

};
function formatErrorCode(code){
	return language[language_type]["ERROR"][code] ? language[language_type]["ERROR"][code] : language[language_type]["ERROR"][9];
}

function formatServerCode(code){
	return language[language_type]["SERVER_CODE"][code] ? language[language_type]["SERVER_CODE"][code] : language[language_type]["ERROR"][9];
}
function whenQueue(funcArr){
	var dfd = $.Deferred();
	var arr = [];
	var index = 0;
	for(var i in funcArr){
		(function(i){
			funcArr[i]().then(function(ret){
				index++;
				arr.push(ret);
				if(index == funcArr.length){
					dfd.resolve(arr);
				}
			});
		})(i);
	}
	return dfd.promise();
}

var delay = (function(){
  var timer = 0;
  return function(callback, ms){
    clearTimeout (timer);
    timer = setTimeout(callback, ms);
  };
})();

function format_version(v,skipV,skipSubversion,depth){
	if(!!!v)
		return;
	if(!!skipV){
		var lastV = v.lastIndexOf('V');
		if(lastV > -1){
			v = v.substring(lastV+1);
		}
	}
	if(!!skipSubversion){
		var depth = depth || 1;
		for(var i = 0; i < depth; i++){
			var lastIndex = v.lastIndexOf('.');
			if (lastIndex > -1) {
				v = v.substring(0, lastIndex);
			}	
		}
	}
	return v;
}

function handleIp(value,format){
	var ret = null;
	if(value == "" || value == "0.0.0.0" || value == undefined || value == "::"){
		ret = !!format ? format : "-";
	}
	else
		ret = value;
	return ret;
	
} 

//判断下用户当前浏览器的标题栏是域名还是ip
var judgeIsDomain = function(){
	var str = window.location.href.toString();
	if(str.indexOf(router.login_website) != -1){
		return true;
	}
	else{
		return false;
	}
};

var isResponse = function(){
	var dfd = $.Deferred();
	var d = new Date();
	request({
		url:"/ubus",
		timeout:5 * 1000
	}).done(function(data){
		dfd.resolve(false);
	}).fail(function(data){
		dfd.resolve(true);
	});
	return dfd.promise();
};

function format_ssid(enable_2G,ssid_2G,enable_5G,ssid_5G){
	var me = this;
	var str = "";
	if(enable_2G && enable_5G){
		if(ssid_2G != ssid_5G)
			str = ssid_2G + "<b>"+ L.or +"</b>" + ssid_5G;
		else
			str = ssid_2G;
	}
	else{
		if(enable_2G){
			str = ssid_2G;
		}
		else{
			str = ssid_5G;
		}
	}
	return str;
}

function paint_disconn_sec(data1,data2){
	var str = "";
	var str2 = "";
	
	if($.isEmptyObject(data1) && $.isEmptyObject(data2)){
		str2 = L.wifi_guide;
	}
	else{
		
		var ssid_a = htmlencode(data1.SSID1);
		var ssid_b = htmlencode(data2.SSID1);
		
		var status_a = data1.Enable1;
		var status_b = data2.Enable1;
		
		var arr = L.link_wifi.split("{{name}}");
		
		str2 = arr[0] +'<span id="current-wifi-name">'+ format_ssid(status_a,ssid_a,status_b,ssid_b) +'</span>'+ arr[1];
		
	}
	
	
	if($(".no-conn-sec").length != 0)
		$(".no-conn-sec").remove();
	str += '<div class="no-conn-sec off">';
	str += 	'<div class="no-conn-icon">';
	str += 		'<img width="150" src="images/wifi-disconnect.png">';
	str += 	'</div>';
	str += 	'<div class="no-conn-tip">';
	str += 		'<h3>'+ L.no_conn +'</h3>';
	str += 		'<p>'+ L.use_wifi +'</p>';	
	str += 		'<div class="wifi-info-sec">'+ str2 +'</div>';
	str += 	'</div>';
	str += 	'<div class="marginTop35 form-group text-center">';
	str += 		'<button type="button" class="btn btn-set-router">'+ L.set_router +'</button>';
	str += 	'</div>';
	str += '</div>';
	
	$("body").undelegate(".btn-set-router",E).delegate(".btn-set-router",E,function(){
		//检测IP或者域名是否有返回
		//运营商项目暂时都固定成域名
		var _that = this;
		$(_that).attr("disabled",true);
		$.when(detect_net(router.login_website)).then(function(ret){
			if(!!router.rid && !!router.phoneId){
				window.location.replace("index.html");
			}
			else{
				if(ret == 1){
					//如果当前网络是通的，则恢复默认跳转快速配置，重启/升级跳转登录页，
	//				if(current_html == "reset"){
	//					window.location.replace("http://" + (judgeIsDomain() ? router.login_website : router.default_lan_ip) + "/guide/welcome.html");
	//				}
	//				else if(current_html == "upgrade" || current_html == "restart"){
	//					window.location.replace("http://" + (judgeIsDomain() ? router.login_website : router.lan_ip+":23355") + "/login.html");
	//				}
					if(current_html == "upgrade" || current_html == "restart" ||current_html == "reset"){
						window.location.replace("http://" + (judgeIsDomain() ? router.login_website : router.lan_ip+":23355") + "/login.html");
					}
					else{
						window.location.reload();
					}
				}
				else{
					show_message("error",L.wifi_not_link);
					$(_that).attr("disabled",false);
				}
			}

		});
	});
	
	$(".f-cnt").append(str);
}

function compare(dest,src){
	var change = false;
	if($.isEmptyObject(src))
		return true;
	for(var i in dest){
		if(src[i] != undefined){
			if(dest[i] instanceof Array){
				if(JSON.stringify(dest[i]) != JSON.stringify(src[i])){
					change = true;
					break;
				}
			}
			else{
				if(dest[i] != src[i]){
					change = true;
					break;
				}	
			}
				
		}
	}
	return change;
}

function detectLanStatus(time){
	var dfd = $.Deferred();
	//先打印提示消息，锁屏
	delay(function(){
		show_message("wait",L.lan_reboot);
		
		delay(function(){
			$.when(detectResponse(true,L.lan_reboot_fin)).then(function(ret){
				dfd.resolve(ret);
			});
		},((time * 1 - 1) || 12) * 1000);
	},1000);
	
	return dfd.promise();
}


var scrollTimer = null;
var bfscrolltop;
function scrollIntoView() {
	var bfscrolltop;
	$("input").off("focus").on("focus",function(){
		scrollIntoViewEvent($(this),"focus");
	}).off("blur").on("blur",function(){
		scrollIntoViewEvent($(this),"blur");
	});
	
}

function scrollIntoViewEvent(elem,type){
	if(!isApp().app){
		return;
	}
	if(type == "focus"){
		if(scrollTimer)
			window.clearTimeout(scrollTimer);
		scrollTimer = window.setTimeout(function(){
			if (browser.versions.iPhone || browser.versions.iPad || browser.versions.iPod) {
				bfscrolltop = document.body.scrollTop;
				if (!/OS 11_[0-3]\D/.test(navigator.userAgent) || navigator.userAgent.indexOf('Safari/') !== -1) {// Safari & iOS 11.0-11.3
					document.body.scrollTop = document.body.scrollHeight;   
				}
			}
			else {
				elem.get(0).scrollIntoView(false);
			}
			
		},300);
	}
	else{
		window.clearTimeout(scrollTimer);
		if (browser.versions.iPhone || browser.versions.iPad || browser.versions.iPod) {
			if (!/OS 11_[0-3]\D/.test(navigator.userAgent) || navigator.userAgent.indexOf('Safari/') !== -1) {// Safari & iOS 11.0-11.3
				document.body.scrollTop = bfscrolltop;   
			}
		}
		else {
			elem.get(0).scrollIntoView();
		}
	}
}

function adjust_pages(){
	if(isApp().app){
		$("#header").remove();
		$("body").addClass("isApp");
		$(".f-locationH3-container,.f-content-container").addClass("isApp");
		$(".g-wrapper").addClass("isApp");
		init_app_footer();
		$(".app_bottom_menu a").off(E).on(E,function(){
			setPath("index");
		});
	}else{
		$(".app_bottom_menu").remove();
		$("body").removeClass("isApp");
		$(".f-locationH3-container,.f-content-container").removeClass("isApp");
		$(".g-wrapper").removeClass("isApp");
		$("#header").show();
	}
	
	var elem = $(".app_bottom_menu");
	if(elem.length != 0){
		if (browser.versions.android){
			var pre_innerHeight = window.innerHeight;
			$(window).off("resize").on("resize",function(){
				var cur_innerHeight = window.innerHeight;
				//alert("pre_innerHeight:" + pre_innerHeight + " cur_innerHeight:" + cur_innerHeight);
				if (pre_innerHeight - cur_innerHeight > 50) {
				  // 键盘弹出事件处理
				  elem.addClass("off");
				  
				} else {
				  // 键盘收起事件处理
				  elem.removeClass("off");
				}
			});
		}
		else if(browser.versions.ios) {
			$("input").off("focusin").on("focusin",function(){
				// 键盘弹出事件处理
				elem.addClass("off");
			});
			
			$("input").off("focusout").on("focusout",function(){
				// 键盘收起事件处理
				elem.removeClass("off");
			});
		}
	}
	
}



function show_content(){
	$(".d-cnt").removeClass("off");
	$(".loading-sec").addClass("off");
	$(".err-sec").addClass("off");
	$(".no-conn-sec").addClass("off");
}

function configurationState22(noNeedToken){
	var token = !!!noNeedToken ? localStorage.getItem('token_id') : _DATA.default_token;
	if(!token) token = _DATA.default_token;
	
	var param = {
		"jsonrpc":"2.0",
		"method":"call",
		"params": [token, "routerd", "param_status", {"action":"get"}]
	};
	
	var dfd = $.Deferred();
	request({
		url:"/ubus",
		data:JSON.stringify(param)
	}).done(function(data){
		if(check_data(data)){
			router.exam_flag = data.result[1].ExamFlag;
			router.default_username=data.result[1].user;
			
			if(data.result[1].initialized == 0)
			{
				if(router.exam_flag)
				{
					if(window.location.pathname == "/login.html"){
						if(localStorage.getItem('token_id')){
							window.location.href="/guide/welcome.html";
						}
						else{
							dfd.resolve(false);
						}
					}
					else if(window.location.pathname == "/guide/welcome.html"){
						if(localStorage.getItem('token_id')){
							dfd.resolve(false);
						}
						else{
							window.location.href="/login.html";
						}
					}
					else{
						if(localStorage.getItem('token_id')){
							window.location.href="/guide/welcome.html";
						}
						else{
							window.location.href="/login.html";
						}
					}
				}
				else{
					if(window.location.pathname != "/guide/welcome.html"){
						window.location.href="/guide/welcome.html";
					}
					else{
						dfd.resolve();
					}
				}
			}
			else{
				if(window.location.pathname == "/guide/welcome.html"){
					window.location.href="/index.html";
				}
				else
					dfd.resolve(true);
			}
		}else{
			hide_loading_page();
			show_err_page();
		}
		
	}).fail(function(data){
		hide_loading_page();
		show_err_page(data.XMLHttpRequest.status);
		dfd.reject();
	});
	return dfd.promise();
};

function init_qrcode(){
	var dfd = $.Deferred();
	$("#qrcode").html("");
	$.when(_DATA.callUbus([null,"routerd","app_info",{}])).then(function(data){
		if(check_data(data)){
			
			$("#qrcode").qrcode({
				text: data.result[1].rid,
				width: "500",
				height: "500"
			});
			
			dfd.resolve();
			
		}else{
			$("#qrcode").append("<img src='images/broken_image.png'/>");
			dfd.resolve();
		}
	});
	return dfd.promise();
}


function htmlencode(str) {
	return $('<div/>').text(str).html();
}
//开关显示
function checkbox_enable(id,data){
	if(data==1){
		$("#"+id).attr("value","1").attr("checked");
		$("#"+id).siblings(".button-label").addClass("f-switchTrue");
	}else{
		$("#"+id).attr("value","0").removeAttr("checked");
		$("#"+id).siblings(".button-label").removeClass("f-switchTrue");
	}
}
//把mac已#号拼接
function encrypt_mac(code,t){
	if(code.length==0){
		return "";
	}else if(code.length==1){
		return code[0];
	}else {
		var s="";
		for(var i=0;i<code.length;i++){
			if(i==0){
				s=code[i];
			}else{
				if(t==undefined){
					s=s+"#"+code[i];
				}else{
					s=s+t+code[i];
				}
				
			}
			
		}
		return s;
	}
}
//没获取用户名时,用AP-加mac地址后6位拼接当用户名
function name_mac(mac){
	var name="AP-";
//	check_mac()
	mac=mac.toUpperCase();
	var n=mac.split(":");
	return name+n[3]+n[4]+n[5];
}
function encrypt(code) {
    var c=String.fromCharCode(code.charCodeAt(0)+code.length);
    for(var i=1;i<code.length;i++){
        c+=String.fromCharCode(code.charCodeAt(i)+code.charCodeAt(i-1));
    }
    return(escape(c));
}


function decrypt(code) {
    code=unescape(code);
    var c=String.fromCharCode(code.charCodeAt(0)-code.length);
    for(var i=1;i<code.length;i++){
        c+=String.fromCharCode(code.charCodeAt(i)-c.charCodeAt(i-1));
    }
    return c;
}
/**
 * 判断是否是乱码字符，用于判断显示乱码设备，这里乱码字符只包括gbk转utf-8的字符,如：�й�，而无法检测gbk转utf-8,再转gbk的字符，如：锟斤拷锟
 */
function isGarbledCode(charStr) {
	/*var garblePattern = /[^ -~\u2E80-\u2FDF\u3040-\u318F\u31A0-\u31BF\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FFF\uA960-\uA97F\uAC00-\uD7FF\u3002\u00a5\uff1f\uff01\uff0c\u3001\uff1b\uff1a\u201c\u201d\u2018\u2019\uff08\uff09\u300a\u300b\u3008\u3009\u3010\u3011\u300e\u300f\u300c\u300d\ufe43\ufe44\u3014\u3015\u2026\u2014\uff5e\ufe4f\uffe5\u00a5]+/;
	return garblePattern.test(charStr);*/
	return charStr.indexOf("�")!==-1;
}

/**
 * 处理设备别名，如果为空，则返回 未命名设备;如有乱码字符，则返回 未知设备;除此之外返回原本的别名
 * @param aliasStr 需要处理的设备别名
 * @returns {*}  处理过后的设备别名
 */
function handleAliasStr(aliasStr) {
	return !!aliasStr ? (isGarbledCode(aliasStr) ? L.unknown_device : aliasStr) : L.unnamed_device;
}

/**
 * 登陆后，根据桥模式（ac模式）是否开启判断跳转地址，若开启且有新版ac控制器页面时，跳转至ac控制器页面，否则跳转到路由器首页
 * */
function renderAfterLoginJudgeByBridgeAc() {
	var obj = "routerd", method = "easy_bridge_mode_get", argc = {};
	$.when(_DATA.callUbus([null, obj, method, argc], "get")).then(function (data) {
		handleResponse(data, function () {
			if (!!data.result[1] && data.result[1]["enable"] === true && !!igd.module_list && !!igd.module_list["ac_index"]) {
				location.href = "./ac_index.html";
			} else {
				location.href = "./index.html";
			}
		}, function (err) {
			location.href = "./index.html";
		});
	});
}
