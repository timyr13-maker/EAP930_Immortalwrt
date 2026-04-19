
var ROUTE_INFO = {}; //路由器信息
ROUTE_INFO.lan_ip = "";
ROUTE_INFO.lan_mask = "";
ROUTE_INFO.wan_ip = "";
ROUTE_INFO.wan_mask = "";
ROUTE_INFO.default_lan_ip = document.domain;
ROUTE_INFO.default_lan_mask = "255.255.255.0";
ROUTE_INFO.default_wan_ip = "0.0.0.0";
ROUTE_INFO.default_wan_mask = "0.0.0.0";
ROUTE_INFO.initialized="";
ROUTE_INFO.guidepage="";
ROUTE_INFO.version="";
ROUTE_INFO.sw="";
ROUTE_INFO.dhcp_ip="";
ROUTE_INFO.ac_ap_status={};
//ROUTE_INFO.g_port = 80;
var  table_page={}
function compareMac(mac1, mac2) {
    let macA = mac1.split(':').map(part => parseInt(part, 16));
    let macB = mac2.split(':').map(part => parseInt(part, 16));
    for (let i = 0; i < macA.length; i++) {
      if (macA[i] < macB[i]) {
        return -1;
      } else if (macA[i] > macB[i]) {
        return 1;
      }
    }
    return 0;
}
//名称排序
function compareName(x, y) {
	
	   let reg = /[a-zA-Z0-9]/
	    if(reg.test(x)|| reg.test(y)){
	       if(x>y){
	           return 1
	       }else if(x<y){
	           return -1
	       }else{
	           return 0
	       }
	    }else{
	       return x.localeCompare(y)
	    }
	
}
//显示弹窗提示
function guide_ts_show(data){
	$(".guide_ts").removeClass("hidden");
	$(".guide_ts_p").html(data);
}
//隐藏弹窗提示
function guide_ts_hide(data){
	$(".guide_ts").addClass("hidden");
	$(".guide_ts_p").html(data);
}
//端口映射排序
var port_mapping={};
port_mapping.init = {
	port_list_old:{},
	port_list_new:{},
	get_port_mapping:function(){
		var dfd = $.Deferred();
		var me = this;
			var a1={"jsonrpc": "2.0", "id":23, "method": "call", "params": [ localStorage.getItem('token_id'), "uci", "get", {"config": "firewall","type": "redirect"} ] }
			a1=JSON.stringify(a1);
			$.ajax({
					url:"/ubus",
					data:a1,
					async:false,
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
						data=JSON.stringify(data);
			   			data = eval("(" + data + ")");
			   			data=data.result[1].values;
						dfd.resolve(data);
					}
				});
			
		return dfd.promise();
	},
	port_mapping_sort:function(){//处理顺序
		var me = this;
	
		$.when(port_mapping.init.get_port_mapping()).then(function(data){
			me.port_list_old=data;
			var result=data;
			if(me.port_list_old){
				var port_1=[],port_2=[],port_3=[];
				for(var i in result){	
					if(result[i].type=="remote"){
						port_1.push(result[i]);
					}else if(result[i].type=="noDmz"){
						port_2.push(result[i]);
					}else if(result[i].type=="dmz"){
						port_3.push(result[i]);
					}
				}
				var newArr = port_1.concat(port_2,port_3);
				var new_name=[];
				for(var i=0;i<newArr.length;i++){
					new_name.push(newArr[i][".name"]);
				}
//				console.log(new_name)
				$.when(port_mapping.init.order(new_name)).then(function(t){
					
					console.log(t);
				});
			}
			
		});
	},
	order:function(d){
		var dfd = $.Deferred();
		var me = this;
			var a1={"jsonrpc": "2.0", "id":23, "method": "call", "params": [ localStorage.getItem('token_id'), "uci", "order", {"config": "firewall","sections": d} ] }
			a1=JSON.stringify(a1);
			$.ajax({
					url:"/ubus",
					data:a1,
					async:false,
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
}

//获取登录名
function login_name(){
	var dfd = $.Deferred();
	var getdata='{"jsonrpc": "2.0", "id": 1, "method": "call", "params": [ "00000000000000000000000000000000", "routerd", "login_name_get",{} ] }';
	
		request({
			url:"/ubus",
			data:getdata
		}).done(function(data){
			data=JSON.stringify(data);
	        data = eval("(" + data + ")");
			if(data.result[1].name!=""){
				ROUTE_INFO.username=data.result[1].name;
				hide_loading_page();
				show_content();
			}else{
				ROUTE_INFO.username="root";
			}
			
			dfd.resolve();
		}).fail(function(data){
			hide_loading_page();
			show_err_page();	
			//show_request_err(data);
		})
	return dfd.promise();
}

//获取ap状态
function ac_ap_status(){
	var dfd = $.Deferred();
	var getdata='{"jsonrpc": "2.0", "id": 1, "method": "call", "params": [ "00000000000000000000000000000000", "acap", "ac_ap_status",{} ] }';
	
		request({
			url:"/ubus",
			data:getdata
		}).done(function(data){
			data=JSON.stringify(data);
	        data = eval("(" + data + ")");
			
			ROUTE_INFO.ac_ap_status=data.result[1];
			hide_loading_page();
			show_content();
			init_header(getLangSession())
			init_breadcrumbs()
			adjust_pages();
//			render_page_title_cgi();
			dfd.resolve();
		}).fail(function(data){
			hide_loading_page();
			show_err_page();	
			//show_request_err(data);
		})
	return dfd.promise();
}

function ac_ac_para_by_get(){
	var dfd = $.Deferred();
	var getdata={"jsonrpc": "2.0", "id": 1, "method": "call", "params": [ localStorage.getItem('token_id'), "acap", "ac_ac_para_by_get",{} ] };
		getdata=JSON.stringify(getdata);
		request({
			url:"/ubus",
			data:getdata
		}).done(function(data){
			data=JSON.stringify(data);
	        data = eval("(" + data + ")");
			
			
			dfd.resolve(data.result[1]);
		}).fail(function(data){
			hide_loading_page();
			show_err_page();	
			//show_request_err(data);
		})
	return dfd.promise();
}

//UCI参数保存与生效/
function applyUci(){
	var s;
	var a1='{"jsonrpc": "2.0", "id": 10, "method": "call", "params": [ "'+localStorage.getItem('token_id')+'", "uci", "apply",  {"timeout": "60"} ] }'
	$.ajax({
		url:"/ubus",
		data:a1,
		async:false,
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
			if(data["luciErrcode"]){
				s=0;
			}else{
				s=data.result[0];
			}
			
		}
	});
	return s;
}


//获取wifi保存生效状态

//wifi参数保存与生效/
function get_apply_status(){
	var s;
	var a1='{"jsonrpc": "2.0", "id": 10, "method": "call", "params": [ "'+localStorage.getItem('token_id')+'", "wifi", "get_apply_status",  {} ] }'
	$.ajax({
		url:"/ubus",
		data:a1,
		async:false,
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
			if(check_data(data)){   
				if(data.result[1]==undefined){
					s=data.result[0];
				}else{
					s=data.result[1].status;
				}
			}
		}
	});
		
	return s;
}


//截取空格
function getCaption_Space(obj,state) {
    var index=obj.lastIndexOf(" ");
    if(state==0){
        obj=obj.substring(0,index);
    }else {
        obj=obj.substring(index+1,obj.length);
    }
    return obj;
}
//截取线
function getCaption_dashLine(obj,state) {
    var index=obj.lastIndexOf("-");
    if(state==0){
        obj=obj.substring(0,index);
    }else {
        obj=obj.substring(index+1,obj.length);
    }
    return obj;
}




function render_page_title_cgi(){
	if(typeof current_html == "undefined")
		return;
	var token = (current_html == "guide" || current_html == "login") ? "00000000000000000000000000000000" : localStorage.getItem('token_id');
	var param = '{"jsonrpc": "2.0", "method": "call", "params": [ "'+ token +'", "uci", "get", {"config": "customer","section": "info"}]}';
	
		request({
			url:"/ubus",
			data:param
		}).done(function(data){
			
//		$(".login_img").attr("src","/images/logo_login.png");

		if(data && data.result && data.result[1]){
			var model=data.result[1]["values"]["hostname"].split('-');
			document.title =  data.result[1]["values"]["brand"] + L.router;
			$("#login_href").html(data.result[1]["values"]["login"]);
			$("#login_href").attr("href","http://" +data.result[1]["values"]["login"])
			$("#login_title").html(data.result[1]["values"]["brand"]);
			// if(data.result[1]["values"]["brand"]=="netis"){
				$("#official_website").attr("href","https://" + language[language_type]["VENDOR"]["NETIS"]["official_website"]);
			// }else{
			// 	$("#official_website").attr("href","https://" + data.result[1]["values"]["website"]);
			// }
			if(current_html == "router_info"){
				$("#router_name").html(data.result[1]["values"]["model"] + L.router);
			}
			
			if(current_html == "lan_setup"){
				$("#login_site").html(data.result[1]["values"]["login"]);
			}
			
			if(current_html == "guide" || current_html == "login"){
				
				$(".slogan").html(L.welcome +" "+ data.result[1]["values"]["brand"]+" "+L.router);
			}
				ROUTE_INFO["cclient_url"]=data.result[1]["values"]["cclient_url"];
		}
		else{
//			document.title =  language[language_type]["VENDOR"]["NETIS"]["module_name"];
			
			$("#official_website").attr("href","http://" + language[language_type]["VENDOR"]["NETIS"]["official_website"]);
			
			if(current_html == "router_info"){
				$("#router_name").html(language[language_type]["VENDOR"]["NETIS"]["module_name"]);
			}
			
			if(current_html == "lan_setup"){
				$("#login_site").html(language[language_type]["VENDOR"]["NETIS"]["login_website"]);
			}
			
			if(current_html == "guide" || current_html == "login"){
				$(".slogan").html(L.welcome + language[language_type]["VENDOR"]["NETIS"]["module_name"]);
			}
		}
		}).fail(function(data){
			//show_request_err(data);
		})
		var title = language[language_type]["VENDOR"]["NETIS"]["TITLE"];
		document.title = title.replace("{{module}}",router.module);
}
function page_id(id){
		var idx=$("#"+id+" .TabFooter .paging .current").html();
		if(idx==undefined){
			idx=1;
		}
		return Number(idx);
	}
function get_lan_ip() {
	if(typeof ROUTE_INFO == "undefined"){
		ROUTE_INFO = {};
		ROUTE_INFO.lan_ip = "";
		ROUTE_INFO.lan_mask = "";
	}
	var a1='{"jsonrpc": "2.0", "id": 2, "method": "call", "params": [ "'+localStorage.getItem('token_id')+'", "routerd", "lan_config_get", { } ] }'
	var dfd = $.Deferred();
	
		request({
			url:"/ubus",
			data:a1
		}).done(function(data){
		data=JSON.stringify(data);
        data = eval("(" + data + ")");
        hide_loading_page();
				show_content();
		if(data && data.result){
			ROUTE_INFO.lan_ip = data.result[1].ipaddr;
			ROUTE_INFO.lan_mask = data.result[1].netmask;
			ROUTE_INFO["router_user"]=data.result[1].router_user;
			ROUTE_INFO["router_pwd"]=data.result[1].router_pwd;
		}
		else{
			ROUTE_INFO.lan_ip = ROUTE_INFO.default_lan_ip;
			ROUTE_INFO.lan_mask = ROUTE_INFO.default_lan_mask;
		}
		dfd.resolve();
	}).fail(function(data){
			hide_loading_page();
				show_err_page();
		})
	return dfd.promise();
}
function ac_apip_get(){

	var dfd = $.Deferred();
	var a2='{"jsonrpc": "2.0", "id": 3, "method": "call", "params": [ "'+localStorage.getItem('token_id')+'", "acap", "ac_apip_get", { } ] }'
	
		request({
			url:"/ubus",
			data:a2
		}).done(function(data){
       data=JSON.stringify(data);
       data = eval("(" + data + ")");
		if(data && data.result){
			
			ROUTE_INFO.wan_ip = data.result[1].ipaddr;
			ROUTE_INFO.wan_mask =  data.result[1].netmask;
			ROUTE_INFO["wan_gateway"]=  data.result[1].gateway;
		}
		dfd.resolve();
	}).fail(function(data){
			//show_request_err(data);
		})
	return dfd.promise();
}
function get_wan_ip(){
	if(typeof ROUTE_INFO == "undefined"){
		ROUTE_INFO = {};
		ROUTE_INFO.wan_ip = "";
		ROUTE_INFO.wan_mask = "";
	}
	
	var dfd = $.Deferred();
	var a2='{"jsonrpc": "2.0", "id": 3, "method": "call", "params": [ "'+localStorage.getItem('token_id')+'", "network.interface.wan1", "status", { } ] }'
	
		request({
			url:"/ubus",
			data:a2
		}).done(function(data){
       data=JSON.stringify(data);
       data = eval("(" + data + ")");
		if(data && data.result){
			
			if(data.result[1]["ipv4-address"] && data.result[1]["ipv4-address"][0]){
				ROUTE_INFO.wan_ip = data.result[1]["ipv4-address"][0].address;
//				ROUTE_INFO.wan_mask = dhcp_pool_calculator.bit(data.result[1]["ipv4-address"][0].mask);
			}else{
				ROUTE_INFO.wan_ip = ROUTE_INFO.default_wan_ip;
				ROUTE_INFO.wan_mask = ROUTE_INFO.default_wan_mask;
			}
		}
		else{
			ROUTE_INFO.wan_ip = ROUTE_INFO.default_wan_ip;
			ROUTE_INFO.wan_mask = ROUTE_INFO.default_wan_mask;
		}
		dfd.resolve();
	}).fail(function(data){
			//show_request_err(data);
		})
	return dfd.promise();
}
//1.获取路由版本信息
function update_getversion(){
	var dfd = $.Deferred();
	var a1='{"jsonrpc": "2.0", "id": 20, "method": "call", "params": [ "'+localStorage.getItem('token_id')+'", "auto_update", "auto_update_getversion", {} ] }'
	request({
			url:"/ubus",
			data:a1
		}).done(function(data){
			data=JSON.stringify(data);
	        data = eval("(" + data + ")");
			ROUTE_INFO.version=data.result[1].cur_version;
			dfd.resolve(data.result[1]);
		}).fail(function(data){
			//show_request_err(data);
		})
	return dfd.promise();
	

		
}
//完成快速配置状态
function param_status_set(){
	var dfd = $.Deferred();
	 var a1='{"jsonrpc": "2.0", "id": 25, "method": "call", "params": [ "00000000000000000000000000000000", "routerd", "param_status", {"action":"set" } ] }'
	var dfd = $.Deferred();
	
		request({
			url:"/ubus",
			data:a1
		}).done(function(data){
		data=JSON.stringify(data);
        data = eval("(" + data + ")");
		
		dfd.resolve(data.result[0]);
	}).fail(function(data){
			//show_request_err(data);
		})
	return dfd.promise();
}

//获取是否被需要锁屏
function ap_getstatus(){
	var dfd = $.Deferred();
	var a1='{"jsonrpc": "2.0", "id": 17, "method": "call", "params": [ "'+localStorage.getItem('token_id')+'", "ap","ap_getstatus",{} ] }'
		$.post("/ubus", a1, function (data, textStatus){
		        
				if(check_data(data)){
//					console.log(data.result[1]);
					var mode= data.result[1].status;//router为路由模式，否则就为桥接模式
					ROUTE_INFO.ap_getstatus=mode;
					dfd.resolve(mode);		
				}
		
	});
	return dfd.promise();
}



//原来获取上网列表
function get_host_info(){
		var dfd = $.Deferred();
		var numberUsers='{"jsonrpc": "2.0", "id": 2, "method": "call", "params": [ "'+localStorage.getItem('token_id')+'", "devices_app", "get_host_info", { } ] }'
		$.post("/ubus",numberUsers, function (data) {
			if(check_data(data)){
				var dataHost=data.result[1].hosts;	
				var onInternet_data=new Array();//在线设备数据
					for(var i=0;i<dataHost.length;i++){
							if(dataHost[i].online==true  && dataHost[i].is_wifi==1){
								onInternet_data.push(dataHost[i]);
							}
						}
						ROUTE_INFO.count=onInternet_data.length;

			}
			dfd.resolve(onInternet_data);
		});
		return dfd.promise();	
	}
//获取上网方式是路由模式还是桥接模式

function devinfo_get_cgi(){
	var dfd = $.Deferred();
	var a1='{"jsonrpc": "2.0", "id": 17, "method": "call", "params": [ "'+localStorage.getItem('token_id')+'", "routerd","work_mode",{} ] }'
		$.post("/ubus", a1, function (data, textStatus){
		        
				if(check_data(data)){
//					console.log(data.result[1].mode);
					var mode= data.result[1].mode;//router为路由模式，否则就为桥接模式
					ROUTE_INFO.sw=mode;
					if(ROUTE_INFO.sw=='bridge'){
						$(".zt").attr("disabled",true);
					}else{
						$(".zt").attr("disabled",false);
					}
					 
					 $("#equipment_lenght").parents(".menu-item-p").siblings("h3").html(L.wireless_terminal);
				dfd.resolve(ROUTE_INFO.sw);
				}
		
	});
	return dfd.promise();
}


$(document).ready(function(){
	
//		if(localStorage.getItem('token_id')==null){
//			localStorage.setItem('token_id', "00000000000000000000000000000000")
//		}
})
