var lan_show_data={};//储存
var lan_set_data={};//储存lan_set_data要提交的数据
var hostsData = null;
var jump_timer = null;

current_html = "ap_lan_setup";


//
function get_brlan_config(){
	var get_nat='{"jsonrpc": "2.0", "id": 9, "method": "call", "params": [ "'+localStorage.getItem('token_id')+'", "acap", "ac_apip_get", {} ] }'
	request({
			url:"/ubus",
			data:get_nat
		}).done(function(data){
		
	
            if(check_data(data)){   	
				var newData=data.result[1];
				lan_show_data=newData;
				$("#get_dynamic_enable").val(newData.proto);
				if(newData["proto"]=="static"){
					checkbox_enable("get_dynamic_enable",0);
					
				}else{
					checkbox_enable("get_dynamic_enable",1);
				}
				get_dynamic_enable();

				$("#wan_setup_ip").val(newData.ipaddr);
				$("#wan_setup_ip_text").html(newData.ipaddr);
				
				$("#wan_setup_mask").val(newData.netmask);
				$("#wan_setup_mask_text").html(newData.netmask);
				
				$("#wan_setup_gw").val(newData.gateway);
				$("#wan_setup_gw_text").html(newData.gateway);
				
				$("#wan_setup_dns").val(newData.dns);
				$("#wan_setup_dns_text").html(newData.dns);
			}
		
		}).fail(function(data){
			//show_request_err(data);
		})
}
var reg_map = {
	"lan_setup_address_frm":[
		{id: "wan_setup_ip", type: "ip"},
        {id: "wan_setup_mask", type: "mask"},
        {id: "wan_setup_gw", type: "getway"},
         {id: "wan_setup_dns", type: "dns"},
	]
}
function set_brlan_config(d){
	var set_val={};
	if(d==0){
		
	
		if(!check_input("lan_setup_address_frm")){
				return false;
		}
	        	
		var ip = $('#wan_setup_ip').val();
	    var mask = $("#wan_setup_mask").val();
	    var gw = $("#wan_setup_gw").val();
	     var dns = $("#wan_setup_dns").val();
	    
//	    var res1 = check_ip_mask(ip,mask);
//	    if(res1 != true){
//	    	new Validator("wan_setup_ip",res1);
//	    	return false;
//	    }
//	    
//	    var res2 = check_getway_mask(gw,mask);
//	    if(res2 != true){
//	    	new Validator("wan_setup_gw",res2)
//	    	return false;
//	    }
		set_val.ipaddr=ip;
		set_val.netmask=mask;
		set_val.gateway=gw;
		set_val.dns=dns;
	}
	show_message("save");
	

	if($("#get_dynamic_enable").val()==1){
			set_val["proto"]="dhcp";
		}else{
			set_val["proto"]="static";
		}
	set_val["mac"]=lan_show_data["lanmac"];
	var set_lan_setup={"jsonrpc": "2.0", "id": 2, "method": "call", "params": [ localStorage.getItem('token_id'), "acap", "ac_apip_set", set_val] }
	set_lan_setup=JSON.stringify(set_lan_setup)
	request({
			url:"/ubus",
			data:set_lan_setup
		}).done(function(data){
			if(check_data(data)){
				if(data.result[0]==0){
						show_message("success");
						get_brlan_config();
						restartSuccess()
				}else{
						show_message_gt("error",data.result[0]);
					}
			}
		}).fail(function(data){
			//show_request_err(data);
		})
	
}
//桥和路由两种情况下的显示
function routing_show(){
//	if(ROUTE_INFO.sw=="bridge"){
		$(".routing_show").addClass("hidden");
		$(".bridge_show").removeClass("hidden");
		get_brlan_config();
//	}else{
//		$(".routing_show").removeClass("hidden");
//		$(".bridge_show").addClass("hidden");
//	}
}

//监听自动分配地址开关
function monitor_secure_access(){
	if($("#dhcp_enable_hidden").val()==0){
		$("#dhcp_pool_start,#dhcp_pool_end").attr("disabled","disabled");
	}else{
		$("#dhcp_pool_start,#dhcp_pool_end").removeAttr("disabled");
	}
	
}
//监听自动分配地址开关
function get_dynamic_enable(){
	if($("#get_dynamic_enable").val()==1){
			$("#wan_text").removeClass("hidden");
			$("#wan_input").addClass("hidden");
		
	}else{
		$("#wan_text").addClass("hidden");
		$("#wan_input").removeClass("hidden");
		
	}
	
}
var ck_dhcp_pool_obj = {};
//获取路由地址的配置
function lan_show(){
	 ck_dhcp_pool_obj.start = "";
    ck_dhcp_pool_obj.end = "";
	ck_dhcp_pool_obj.dhcp_enable = "";
//	ck_dhcp_pool_obj.is_router_as_dns = "";
	var a2='{"jsonrpc": "2.0", "id": 2, "method": "call", "params": [ "'+localStorage.getItem('token_id')+'", "routerd", "lan_config_get", { } ] }'

        $.ajax({//在设置上网方式的时候调用，修改WAN口配置的工作模式
             url: "/ubus", //这里写接口地址，
             type: "POST",
             data: a2, //调用时的参数
             dataType: "json",//返回json,text,html你自己定
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
             success: function(data){//成功
       			data=JSON.stringify(data);
               	data = eval("(" + data + ")");
               	console.log('消息解析：', data);
               	if(check_data(data)){
					hostsData=data.result[1];
					ROUTE_INFO.lan_ip = hostsData.ipaddr;
					ROUTE_INFO.lan_mask = hostsData.netmask;
					ROUTE_INFO.upper_end_ip=hostsData.dhcp_ip;
					$("#upper_end").html(hostsData.dhcp_ip);
		         	$("#lan_ip_address").val(hostsData.ipaddr);
		         	$("#lan_sub_mask").val(hostsData.netmask);
		         	if(hostsData.dhcp_en==true){
		         		$("#dhcp_enable_hidden").val(1);
		         	}else if(hostsData.dhcp_en==false){
		         		$("#dhcp_enable_hidden").val(0);
		         	}
		         	dhcp_pool_calculator.formatDhcpPool(ROUTE_INFO.lan_ip,ROUTE_INFO.lan_mask);
					var dhcp_range_new=dhcp_pool_calculator_new(hostsData.ipaddr,hostsData.netmask,hostsData.dhcp_start,hostsData.dhcp_limit);
//					$("#routerInfo_lanMac").html(dhcp_range_new.dhcpStart+"-"+dhcp_range_new.dhcpEnd);
					 ck_dhcp_pool_obj.start = dhcp_range_new.dhcpStart;
			        ck_dhcp_pool_obj.end = dhcp_range_new.dhcpEnd;
					ck_dhcp_pool_obj.dhcp_enable = data.dhcp_en;
					console.log(dhcp_range_new)
		         	$("#dhcp_pool_start").val(dhcp_range_new.dhcpStart);
		         	$("#dhcp_pool_end").val(dhcp_range_new.dhcpEnd);
		         	dhcp_state_change(hostsData.dhcp_en);
		         	detect_switch_status();
		         	routing_show();
		         	hide_loading_page();
				show_content();
//		         	if(ROUTE_INFO.default_lan_ip!=ROUTE_INFO.lan_ip && ROUTE_INFO.default_lan_ip!="127.0.0.1"){
//		         		restartSuccess();
//		         	}
//					ck_dhcp_pool_obj.is_router_as_dns = data.is_router_as_dns;
               	}
               	
             },
             error:function(errorData){
             	console.log(errorData);
             	hide_loading_page();
				show_err_page();	
             },
             
       	}); 
   (function () {
        $("#lan_ip_address").unbind("keyup paste").bind("keyup paste",function(){
			var _val = $(this).val();
			var obj = dhcp_pool_calculator.calculateIPCIDR($(this).val());
			if(!!obj){
				$("#dhcp_pool_start").val(obj["dhcpStart"]);
				$("#dhcp_pool_end").val(obj["dhcpEnd"]);
			}
		});
        $("#lan_sub_mask").unbind("keyup paste").bind("keyup paste",function(){
			var _val = $(this).val();
			var obj = dhcp_pool_calculator.calculateSubnet(_val);
			if(!!obj){
				$("#dhcp_pool_start").val(obj["dhcpStart"]);
				$("#dhcp_pool_end").val(obj["dhcpEnd"]);
			}
		});
    })();
	
}
//手动重启成功后倒计时启动
function restartSuccess(){
	$(".fullScreenMask").removeClass("hidden");//显示遮罩
	$(".infoone").addClass("hidden");
	$(".infoone").eq(2).removeClass("hidden");
	var time=$("#time").html();
	settime(time);
	
}
//手动重启成功后倒计时启动
function settime(obj) {
     if (obj == 0) { 
       //      window.location.href = "http://" + hostsData.ipaddr + ":" + "/login.html";
		if(!!router.rid && !!router.phoneId){
			window.location.replace("http://" + $("#wan_setup_ip").val() + "/login.html?page=1&rid="+ router.rid +"&phoneId=" + router.phoneId);
//			window.location.replace("http://" + (judgeIsDomain() ? ROUTE_INFO.default_lan_ip : ROUTE_INFO.lan_ip) + "/login.html");
		}else{
			 window.location.href ="http://" + $("#wan_setup_ip").val()+ "/login.html";
		}
        return;
    } else{
    	obj--; 
    	$("#time").html(obj);
    }
	setTimeout(function() { 
	    settime(obj) }
	    ,1000) 
	}
function caculateIPNum(ip1,ip2,ip3){
	//用于缩小dhcp范围
	for(var i in ip1){
		ip1[i] =  parseInt(ip1[i]);
	}
	for(var i in ip2){
		ip2[i] =  parseInt(ip2[i]);
	}
	for(var i in ip3){
		ip3[i] =  parseInt(ip3[i]);
	}
	var arr = [];
	//排序
	arr.push(dhcp_pool_calculator.octet2dec(ip1));
	arr.push(dhcp_pool_calculator.octet2dec(ip2));
	arr.push(dhcp_pool_calculator.octet2dec(ip3));
	arr.sort();
	var a,b;
	if((arr[1] - arr[0]) > (arr[2] - arr[1])){
		a = dhcp_pool_calculator.dec2octet(arr[0]);
		b = dhcp_pool_calculator.dec2octet(arr[1]);
	}
	else if((arr[2] - arr[1]) > (arr[1] - arr[0])){
		a = dhcp_pool_calculator.dec2octet(arr[1]);
		b = dhcp_pool_calculator.dec2octet(arr[2]);
	}
	$("#dhcp_pool_start").val(a[0]+"."+a[1]+"."+a[2]+"."+a[3]);
	$("#dhcp_pool_end").val(b[0]+"."+b[1]+"."+b[2]+"."+b[3]);
}
//页面检测开关
function detect_switch_status(){
	for(i=0;i<$(".checkboxAll").length;i++){
		if($(".checkboxAll").eq(i).val()==0){
			$(".checkboxAll").eq(i).siblings(".button-label").removeClass("f-switchTrue");
			$(".checkboxAll").eq(i).removeAttr("checked");
		}else if($(".checkboxAll").eq(i).val()==1){
			$(".checkboxAll").eq(i).siblings(".button-label").addClass("f-switchTrue");
			$(".checkboxAll").eq(i).attr("checked","checked");
		}
	}
	monitor_secure_access();
}

function dhcp_state_change(str) {
    reg_map["lan_setup_frm"][2] = {};
    reg_map["lan_setup_frm"][3] = {};
    if (str == false) {
        section_disable("dhcp_layer", false);
        reg_map["lan_setup_frm"][2].id = "dhcp_pool_start";
        reg_map["lan_setup_frm"][2].type = "lan_ip";
        reg_map["lan_setup_frm"][3].id = "dhcp_pool_end";
        reg_map["lan_setup_frm"][3].type = "lan_ip";
    }
    else {
        $("#dhcp_pool_start").val(ck_dhcp_pool_obj.start);
        $("#dhcp_pool_end").val(ck_dhcp_pool_obj.end);
        hide_msgbox();
//      $("#dhcp_pool_start,#dhcp_pool_end").removeClass().addClass("input-text input-biger");
        section_disable("dhcp_layer", true);
    }
}
function lan_compare(){
	if($("#lan_ip_address").val() == $("#old_lan_ip").val() && $("#lan_sub_mask").val() == $("#old_lan_mask").val() && $("#dhcp_pool_start").val() == ck_dhcp_pool_obj.start && $("#dhcp_pool_end").val() == ck_dhcp_pool_obj.end && ck_dhcp_pool_obj.dhcp_enable == $("#dhcp_enable_hidden").val())
		return true;
	else
		return false;
}

//代码提交
function lan_set(){
	
	
	if (check_input("lan_setup_frm")) {
		var lan_ip = $("#lan_ip_address").val();
		
		var ip1 = $("#dhcp_pool_start").val();
        var ip2 = $("#dhcp_pool_end").val();
		if(check_input("lan_setup_frm_2")==false){
			return false;
		}
		
//		show_differ_tip(L.dhcp_pool_err,"dhcp_pool_start");//设置提示
//		dhcp_pool_calculator_new(lan_ip,lanSubMask);
		
		var start_arr = ip1.split(".");
		var end_arr = ip2.split(".");
		for(var j = 0; j < 4; j++){
			start_arr[j] = parseInt(start_arr[j],10);
			end_arr[j] = parseInt(end_arr[j],10);
		}
		var start_ip = dhcp_pool_calculator.octet2dec(start_arr);
		var end_ip = dhcp_pool_calculator.octet2dec(end_arr);
		
		var ip_1 = dhcp_pool_calculator.octet2dec(dhcp_pool_calculator.nAddr);
		var ip_2 = dhcp_pool_calculator.octet2dec(dhcp_pool_calculator.ndhcpStart);
		var ip_3 = dhcp_pool_calculator.octet2dec(dhcp_pool_calculator.ndhcpEnd);
		if($("#dhcp_enable_hidden").val() == "1"){
			
			if(start_ip < ip_2 || start_ip > ip_3){
				show_differ_tip(L.dhcp_pool_err, "dhcp_pool_start");
				return false;
			}
			if(end_ip < ip_2 || end_ip > ip_3){
				show_differ_tip(L.dhcp_pool_err, "dhcp_pool_end");
				return false;
			}
			
			
			if(ip_1 == ip_2){
				show_differ_tip(L.dhcp_pool_err, "dhcp_pool_start");
				return false;
			}
			else if(ip_1 == ip_3){
				show_differ_tip(L.dhcp_pool_err, "dhcp_pool_end");
				return false;
			}
		}
		
        var lanSubMask = $("#lan_sub_mask").val();
		//IP和掩码组合校验，确定IP是不是网络地址或者广播地址
        var return_val0 = check_ip_mask(lan_ip, lanSubMask);
        if (return_val0 != true) {
            show_differ_tip(return_val0, "lan_ip_address");
            return false;
        }
		//IP和掩码组合校验，确定和上端是不是在同一个网段
		var result = check_lan_wan_ip(lan_ip,lanSubMask);
		if (result != true) {
            show_differ_tip(result, "lan_ip_address");
            return false;
        }
        var return_val = check_start_end_ip(ip1, ip2);
        if (return_val != true) {
            show_differ_tip(return_val, "dhcp_pool_start");
            return false;
        }
		
		lan_set_cgi();//调用提交接口
	}
	
}
//ipv6信息 获取
function lan_ipv6_get(){
	var get_lan_ipv6='{"jsonrpc": "2.0", "id": 2, "method": "call", "params": [ "'+localStorage.getItem('token_id')+'", "routerd", "lan_ipv6_config_get", {}] }'

	request({
			url:"/ubus",
			data:get_lan_ipv6
		}).done(function(data){
			var newData=data.result[1];
			 if(check_data(data)){
			 	if(newData.enable==0){//关闭状态
			 		$("#ip_address_ipv6").attr("disabled","disabled");
			 		
			 	}else{//开启状态
			 		$("#ip_address_ipv6").removeAttr("disabled");
			 		if(newData.mode==undefined){
			 			$("#ip_address_ipv6").val("stateless");
			 		}else{
			 			$("#ip_address_ipv6").val(newData.mode);
			 		}
			 	}
			 }
		}).fail(function(data){
			//show_request_err(data);
		})
}
//ipv6信息 设置
function lan_ipv6_set(){
	show_message("save");
	var set_val={};
	
	set_val.mode=$("#ip_address_ipv6").val();
	var set_lan_ipv6={"jsonrpc": "2.0", "id": 2, "method": "call", "params": [ localStorage.getItem('token_id'), "routerd", "lan_ipv6_config_set", set_val] }
	set_lan_ipv6=JSON.stringify(set_lan_ipv6)
	
	request({
			url:"/ubus",
			data:set_lan_ipv6
		}).done(function(data){
			if(check_data(data)){
				if(data.result[0]==0){
						show_message("success");
						lan_ipv6_get();
				}else{
						show_message_gt("error",data.result[0]);
					}
			}
		}).fail(function(data){
			//show_request_err(data);
		})
}


function lan_set_cgi(){
	var setResult = true;
	show_message("save");//显示遮罩    	
	lan_set_data.ipaddr=$("#lan_ip_address").val();
	lan_set_data.netmask=$("#lan_sub_mask").val();
	if($("#dhcp_enable_hidden").val()==1){
		lan_set_data.dhcp_en=true;
	}else if($("#dhcp_enable_hidden").val()==0){
		lan_set_data.dhcp_en=false;
	}
	var dhcp_pool_start=$("#dhcp_pool_start").val().split(".")[3];
	var dhcp_pool_end=$("#dhcp_pool_end").val().split(".")[3];
	lan_set_data.dhcp_start=Number(dhcp_pool_start);//地址起始主机号
	lan_set_data.dhcp_limit=dhcp_pool_end-dhcp_pool_start+1;	//地址池数量
	//由于暂时没有时间封装库函数，暂时写死比较
//	if(hostsData.ipaddr == lan_set_data.ipaddr && hostsData.netmask == lan_set_data.netmask && hostsData.dhcp_start == lan_set_data.dhcp_start && hostsData.dhcp_limit == lan_set_data.dhcp_limit && hostsData.dhcp_en == lan_set_data.dhcp_en ){
//		show_message("success");
//		return;
//	}
//	console.log(lan_set_data,dhcp_pool_start,dhcp_pool_end,dhcp_pool_end-dhcp_pool_start)
//	return false;
	var subdata={"jsonrpc": "2.0", "id": 10, "method": "call", "params": [ localStorage.getItem('token_id'), "routerd", "lan_config_set", lan_set_data ] }
	subdata=JSON.stringify(subdata);
	
   	request({
			url:"/ubus",
			data:subdata
		}).done(function(data){
			 if(check_data(data)){
				if(data.result){
					if(data.result[0]==0){
						show_message("success");
						lan_show();
					}else{
						setResult = false;
						show_message_gt("error",data.result[0]);
					}
				}
				else{
					setResult = false;
					show_message_gt("error",data.error.code);
				}
				
			}
		}).fail(function(data){
			//show_request_err(data);
		})
//	if(jump_timer)
//		window.clearTimeout(jump_timer);
//	jump_timer = window.setTimeout(function(){
//		if(setResult && hostsData.ipaddr != location.host){
//			window.location.href = "http://" + hostsData.ipaddr + ":" + "/login.html";
//		}
//	},10*1000);
if(jump_timer)
		window.clearTimeout(jump_timer);
	jump_timer = window.setTimeout(function(){
//		if(setResult && hostsData.ipaddr != location.host){
//			window.location.href = "http://" + hostsData.ipaddr + ":" + "/login.html";
//		}
		if(setResult && location.host != hostsData.ipaddr){
			if(!router.rid && !router.phoneId){
				restartSuccess();
			}
			
		}
	},1000);
   	
}

$(document).ready(function(){
	init_breadcrumbs();
	render_page();
	show_loading_page();
	lang.init(language[language_type]["PAGES"][current_html]);
	//开关
		$(".button-label").on('click',function(){
			$(this).toggleClass("f-switchTrue")
			if($(this).hasClass("f-switchTrue")){
				$(this).siblings(".checkboxAll").attr("value","1");
				$(this).siblings(".checkboxAll").attr("checked","checked");
				monitor_secure_access();
				get_dynamic_enable();
				console.log("on");
				
			}else{
				$(this).siblings(".checkboxAll").attr("value","0");
				$(this).siblings(".checkboxAll").removeAttr("checked");
				monitor_secure_access();
				get_dynamic_enable();
				console.log("off");
				
			}
		})
	
	$(".tab_area").on("click",".tab-item",function(){//tab标签切换
//		console.log($(this).index());
		
		$(".tab_area .tab-item").removeClass("selection");
		$(this).addClass("selection");
		$(".infoone").addClass("hidden");
		$(".infoone").eq($(this).index()).removeClass("hidden");
		if($(this).index()==0){
			lan_show();
		}else{
			lan_ipv6_get();
		}
	})
	
	$.when(get_wan_ip()).then(function(){
//		lan_show();
//		lan_ipv6_get();
		routing_show()
	});
	

	
});