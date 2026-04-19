(function () {
	var timer = {};
	
	function render(obj){
		var dfd = $.Deferred();
		(function () {
			var meCallee = arguments.callee;
			if (obj.timerName)
				window.clearTimeout(obj.timerName);
	
			eval(obj.callback + "();");
			obj.timerName = window.setTimeout(meCallee, obj.time || 5000);
			dfd.resolve();
		})();
		return dfd.promise();
	}
	
	function get_ac_stat(){
		var dfd = $.Deferred();
		var param = '{"jsonrpc": "2.0", "id": 8, "method": "call", "params": [ "'+localStorage.getItem('token_id')+'", "acap", "ac_stat_get", {}]}';
  
        request({
			url:"/ubus",
			data:param
		}).done(function(data){
			
			 if(check_data(data)){
			 	hide_loading_page();
				show_content();
				dfd.resolve(data.result[1]);
				
			}
			else{
				hide_loading_page();
				show_err_page();	
				dfd.reject();
			}
		}).fail(function(data){
			hide_loading_page();
			show_err_page();	
			//show_request_err(data);
		})
        return dfd.promise();
	}
	function get_ac_ap_get(){
		var dfd = $.Deferred();
		var param = '{"jsonrpc": "2.0", "id": 8, "method": "call", "params": [ "'+localStorage.getItem('token_id')+'", "acap", "ac_ap_get", {}]}';
  
        request({
			url:"/ubus",
			data:param
		}).done(function(data){
			
			 if(check_data(data)){
				 ac_ap_data=data.result[1]["ap"];
				dfd.resolve(data.result[1]);
			}
			else{
				dfd.reject();
			}
		}).fail(function(data){
			//show_request_err(data);
		})
        return dfd.promise();
	}
	
	function setWanStatus(){
		$.when(get_ac_stat(),get_ac_ap_get()).then(function(data,acAp_data){
//			console.log(data)
			$("#host-val").html(data.ap_online);
			$("#offline-val").html(data.ap_offline);
			$("#equipment_wired_online,.equipment_wired_online").html(data.wire);
			$("#equipment_24_online,.equipment_24_online").html(data.wifi_24g);
			$("#equipment_5_online,.equipment_5_online").html(data.wifi_5g);
//			console.log(acAp_data)
			var ac_ap_unnetworked_data=[];
			for(var i=0;i<acAp_data["ap"].length;i++){
						if(acAp_data["ap"][i]["trust"]==0){
							ac_ap_unnetworked_data.push(acAp_data["ap"][i]);
						}
					}
		if(ac_ap_unnetworked_data.length>0){
			$("#module-list-sec .module-sec").eq(0).children("a").addClass("unnetworked_bg");
		}else{
			$("#module-list-sec .module-sec").eq(0).children("a").removeClass("unnetworked_bg");
		}
//			console.log(ac_ap_unnetworked_data)
		});
	}
	

	function renderWanStatus(time){
		var obj = {};
		obj.timerName = timer.wanStatusTimer;
		obj.time = time || 5000;
		obj.callback = "setWanStatus";
		render(obj);
	}
	
	function getWanInfo(){
		var dfd = $.Deferred();
		var param = '{"jsonrpc": "2.0", "id": 8, "method": "call", "params": ["'+localStorage.getItem('token_id')+'","routerd","info",{}]}';
		
		request({
			url:"/ubus",
			data:param
		}).done(function(data){
			if(check_data(data)){
				if(typeof data.result != "undefined")
					dfd.resolve(data.result[1]);
				else{
					dfd.resolve({"all_in_byte_speed":0,"uptime":1});
				}
			}
			else{
				dfd.reject();
			}
		}).fail(function(data){
			//show_request_err(data);
		})
		return dfd.promise();
	}
	//得到cpu使用率
	function get_system_load(){
		
		var param='{"jsonrpc": "2.0", "id": 2, "method": "call", "params": [ "'+localStorage.getItem('token_id')+'", "routerd", "system_load_get", { } ] }'

		request({
			url:"/ubus",
			data:param
		}).done(function(data){
			if(check_data(data)){
			
				$("#memory_usage_rate").html(data.result[1].mem+"%");
				$("#cpu_usage_rate").html(data.result[1].cpu+"%");
			}
		}).fail(function(data){
			//show_request_err(data);
		})
		
	}
	
	
	function setWanInfo(){
		$.when(getWanInfo()).then(function(data){
			var timeObj = convert_time(data.uptime);
			var day_=timeObj.day ? timeObj.day + L.day : "",
				hour_=timeObj.hour ? timeObj.hour + L.hour : "",
				minute_=timeObj.minute ? timeObj.minute + L.minute : "",
				second_=timeObj.second ? timeObj.second  : "";
				
			var onlineTimeStr =day_+ hour_+minute_+second_;
			get_system_load();
			$("#run_time").html(onlineTimeStr);
			$("#idx_time").html(getCurrentDate(3))
		});
	}
	
	function renderWanInfo(time){
		var obj = {};
		obj.timerName = timer.runningTimer;
		obj.time = time || 5000;
		obj.callback = "setWanInfo";
		render(obj);
	}

	
	window.renderWanStatus = renderWanStatus;
	window.renderWanInfo = renderWanInfo;
//	window.get_system_load = get_system_load;
})();

function ac_ac_para_by(){
	var getdata={"jsonrpc": "2.0", "id": 1, "method": "call", "params": [ localStorage.getItem('token_id'), "acap", "ac_ac_para_by",{"by":"auto_ac"} ] };
		getdata=JSON.stringify(getdata);
		request({
			url:"/ubus",
			data:getdata
		}).done(function(data){
			if(data["result"][0]==0){
				$("#ac_ac_para_by_show").modal("hide");
				index.init();
			}
		}).fail(function(data){
			hide_loading_page();
			show_err_page();	
			//show_request_err(data);
		})
}
function network_interface_lan(){
	var getdata='{"jsonrpc": "2.0", "id": 3, "method": "call", "params": [ "'+localStorage.getItem('token_id')+'", "network.interface.lan", "status", { } ] }'
		
		request({
			url:"/ubus",
			data:getdata
		}).done(function(data){
			 data=JSON.stringify(data);
     	  data = eval("(" + data + ")");
			if(data.result[1]["clonemac"]==undefined || data.result[1]["clonemac"]=="00:00:00:00:00:00"){
     			$("#idx_mac").html(data.result[1]["macaddr"]);
     		}else{
     			$("#idx_mac").html(data.result[1]["clonemac"]);
     		}
		}).fail(function(data){
			hide_loading_page();
			show_err_page();	
			//show_request_err(data);
		})
}

var index={
	ac_ap_table:null,
	init:function(){
		var me = this;
		$.when(update_getversion(),ac_ap_status()).then(function(data){
		$("#version_information").html(data.cur_version);
		$(".navigation a").eq(0).addClass("current");//给当前页面添加对应的导航
			
			if(ROUTE_INFO.ac_ap_status.bid=="1" && ROUTE_INFO.ac_ap_status.role=="ap" && current_html!="lock_screen"){
				location.href = "./lock_screen.html";
			}else if(ROUTE_INFO.ac_ap_status.bid=="0" && ROUTE_INFO.ac_ap_status.role=="ap" && current_html!="ap_index"){
				location.href = "./ap_index.html";
			}
			if(ROUTE_INFO.ac_ap_status.role=="ac" && current_html=="index"){
				$.when(ac_ac_para_by_get()).then(function(data2){
					if(data2["by"]=="old_ac"){
						$("#ac_ac_para_by_show").modal();
//						$("#ac_index_status").html(ROUTE_INFO.ac_ap_status.ac_ip);
					}
				});
			}
		});

	},
	//没获取用户名时,用AP-加mac地址后6位拼接当用户名
		name_mac_no:function(mac){
		var name="";
	//	check_mac()
		mac=mac.toUpperCase();
		var n=mac.split(":");
		return name+n[3]+n[4]+n[5];
	},
	//	ac	在线表格
			init_ac_ap_online_list:function(data){
				var me = this;
				table_page["page"]=page_id("ac_ap_online_table");
	
				var ap_24g=0,
				ap_5g=0,
				ap_limited=0;
					// var data=debuggerData;
				
		
	//			console.log(data)
				var new_data = [];
	
					for(var i in data){
						var tempObj = {};
						var timeObj = convert_time(data[i].seconds);
						var onlineTimeStr = timeObj.day ? timeObj.day + L.day : "" + timeObj.hour ? timeObj.hour + L.hour : "" + timeObj.minute ? timeObj.minute + L.minute : "" + timeObj.second ? timeObj.second + L.second : "";
						var alias=data[i]["vendor"] ? data[i]["vendor"] : me.name_mac_no(data[i]["mac"]);
						if(data[i]["conn_type"]==0){//有限
							tempObj.conn_type='<span class="wired_ico_pc"></span>';
						}else{//1为2.4G， 2为5G
							tempObj.conn_type='<span class="wired_ico_mobile"></span>';
						}
						tempObj.row1 = '<div class="name-section"><span  title="' + alias + '">' + handleAliasStr(alias) + '</span></div><div class="time-section">' + onlineTimeStr + "</div>";
						if(data[i]["conn_type"]==0){
							tempObj.access=L.wired_internet;
							ap_limited=ap_limited+1;
						}else if(data[i]["conn_type"]==1){
							tempObj.access="2.4G";
							ap_24g=ap_24g+1;
						}else if(data[i]["conn_type"]==2){
							tempObj.access="5G";
							ap_5g=ap_5g+1;
						}
						if(data[i]["rssi0"]=="" && data[i]["rssi1"]=="" && data[i]["rssi2"]=="" && data[i]["rssi3"]==""){
							tempObj.rssi="-";
						}else{
							if(data[i]["rssi2"]<-100 || data[i]["rssi2"]==0){
								tempObj.rssi=data[i]["rssi0"]+","+data[i]["rssi1"];
							}else{
								tempObj.rssi=data[i]["rssi0"]+","+data[i]["rssi1"]+","+data[i]["rssi2"]+","+data[i]["rssi3"];
							}
						}
						
						 tempObj.row2 = '<div class="ip-section "><span>IP:</span><span class="txt">' + data[i]["ip"] + '</span></div><div class="mac-section"><span>MAC:</span><span class="txt">' + data[i]["mac"] + "</span></div>";
						tempObj.row3 = '<div class="ip-section "><span class="txt">'+ language[language_type]["PAGES"]["ap_manage"]["js"].uplink_speed +'：' + data[i]["speed_up"] + 'KB/s</span></div><div class="mac-section"><span class="txt">'+ language[language_type]["PAGES"]["ap_manage"]["js"].downlink_speed +'：' + data[i]["speed_down"] + "KB/s</span></div>"; 
						
						if(data[i]["apname"]){
							var apname=cutString(data[i]["apname"],20);
						}else{
							var apname=data[i]["apmac"]? name_mac(data[i]["apmac"]) : "-";
						}
						tempObj.apname =apname;
						tempObj.ip=data[i]["apip"] ? data[i]["apip"] : "-";
						
						new_data.push(tempObj);
					}
	
				me.ac_ap_table = new top.Table("ac_list_table",appJs["table-title-ac"],new_data,{
				  size: 20,
				  showTotalPageNum:true,
				  showTotalDataNum:true,
				  showHomeAndEnd:true,
				  // showEditPage:true,
				  index:table_page["page"],
				  sortable:true,
				  sortOptions:[
						 {
							sortEvent:function(a,b){
								var a1=a.row1.slice(a.row1.lastIndexOf('">')+2,a.row1.indexOf("</span>"));
								var b1=b.row1.slice(b.row1.lastIndexOf('">')+2,b.row1.indexOf("</span>"));
								// console.log(a1,b1,compareName(a1,b1))
							return  compareName(a1,b1);
							}
						},
						{
							sortEvent:function(a,b){
								return  parseInt(status_sorting(a.online),10)-parseInt(status_sorting(b.online),10);
							}
						},
						{
							sortEvent:function(a,b){
								// console.log(b.time, parseInt(b.time,10))
							return  parseInt(b.model.replace(/[^\d.]/g,""),10)-parseInt(a.model.replace(/[^\d.]/g,""),10);
							}
						},
						{
							sortEvent:function(a,b){
								
								var a1=a.verison.split(".").join("");
								var b1=b.verison.split(".").join("");
								// console.log(a1,parseInt(a1,10)-parseInt(b1,10))
								if(a.verison=='-'|| b.verison=='-'){
									return -1;
								}
								// return  compareName(a1,b1);
								return  parseInt(a1,10)-parseInt(b1,10);
							}
						},
						{
							sortEvent:function(a,b){
								var mac1=mac_comparison(a.row2);
								var mac2=mac_comparison(b.row2);
								console.log(compareMac(mac1,mac2))
								return compareMac(mac1,mac2);
							
							}
						},
						{
							sortEvent:function(a,b){
								var a1=a.time.slice(a.time.indexOf('=')+2,a.time.indexOf('">'));
								var b1=b.time.slice(b.time.indexOf('=')+2,b.time.indexOf('">'));
								// console.log(a1,b1,compareTime(a1,b1))
								if(a1=="" || b1==""){
									return -1;
								}
								
								
							return  compareTime(a1,b1);
							}
						},
						{
							sortEvent:function(a,b){
								
								return  compareName(a,b);
							}
						},
						"",
					  ],
	          info:L.item_null
	      });
				var searchStr=$('#ac_list_search_input').val();
				if (!!searchStr){
					me.ac_ap_table.onSearch(searchStr,false);
				}else {
					me.ac_ap_table.initTable();
				}
				
				
			}
}
	

var appJs = null;
current_html = "index";
var ac_ap_data={};
$(document).ready(function(){
	if(!router.rid && !router.phoneId){
		if(localStorage.getItem('token_id')==null){
			window.location.href = "./login.html";
		}
	}
	init_breadcrumbs();
	render_page();
	show_loading_page();
	lang.init(language[language_type]["PAGES"][current_html]);
	appJs = language[language_type]["PAGES"][current_html]["js"];	
	
//	$(".navigation a").removeClass("current");//移除所有导航状态	
	
	renderWanInfo(2000);
	renderWanStatus(3000);
network_interface_lan();
	get_wan_ip();
	localStorage.removeItem("mesh");
	
	$("#hardware_version").html("v1.0")
	if(!!router.rid && !!router.phoneId){
		for(var i in igd.module_list.index.menu){
			// if(igd.module_list.index.menu[i].id == "apac_upgradation" ){
			// 	igd.module_list.index.menu[i].display = false;
			// }
			if(igd.module_list.index.menu[i].id == "parameter_backup"){
				igd.module_list.index.menu[i].display = false;
			}
		}
	}
	$(".enable_click").on('click',function(){//1关闭  0打开
			$(this).toggleClass("f-switchTrue");	
			if($(this).hasClass("f-switchTrue")){
				$(this).siblings(".checkboxAll").attr("value","1");			
				$(this).siblings(".checkboxAll").removeAttr("checked");
				$("#ac_index_sec a").css("pointer-events","auto");
				$("#ac_index_sec .menu-item-img").css("background-color","var(--module-green)")
			}else{
				$(this).siblings(".checkboxAll").attr("value","0");
				$(this).siblings(".checkboxAll").removeAttr("checked");
				$("#ac_index_sec a").css("pointer-events","none");
				$("#ac_index_sec .menu-item-img").css("background-color","var(--prompt-text)")
//					console.log("off关");
			}
			var setData={};
				setData["enable"]=$("#auto_ac_enable").val()*1;
				show_message("save");
			$.when(_DATA.callUbus([null,"acap","auto_ac_set",setData],"get")).then(function(data){
				
				handleResponse(data,function(){
						setTimeout(function(){
							show_message("success");
						},300)	
					},function(){
						hide_loading_page();
						show_err_page();	
					});
			});
	})
	
	$("body").undelegate("#ac_ac_para_by_show button.btn-confirm","click").delegate("#ac_ac_para_by_show button.btn-confirm","click",function(){
		ac_ac_para_by();
	});
	//未组网显示列表
	$("body").undelegate(".equipment_online","click").delegate(".equipment_online","click",function(){
		$("#ac_list_modal").modal();
		$.when(_DATA.callUbus([null,"acap","ap_cmd",{"cmd":"ap_host_get", "need_reply":1}],"get")).then(function(data){
			var host_data = [];
			data=data.result[1];
			for(var i in data){
				console.log(i);
				for (var j in ac_ap_data) {
					if(ac_ap_data[j]["mac"]==i){
						for(var k in data[i]["hosts"]){
							data[i]["hosts"][k]["apmac"]=ac_ap_data[j]["mac"];
							data[i]["hosts"][k]["apip"]=ac_ap_data[j]["ip"];
							data[i]["hosts"][k]["apname"]=ac_ap_data[j]["apname"];
							data[i]["hosts"][k]["model"]=ac_ap_data[j]["model"];
						}
						
					}
						
				}
				 // host_data = jQuery.extend({}, host_data, data[i]["hosts"]);	
						host_data=host_data.concat(data[i]["hosts"]);
			}
			console.log(host_data);
			
			index.init_ac_ap_online_list(host_data);
			$("#ac_list_modal .modal-title").html(appJs["ac_name"][1])
		});
		
	});
	/*表格搜索*/
				$("body").undelegate("#ac_list_search","click").delegate("#ac_list_search","click",function(){
					if (!!index.ac_ap_table){
						var searchStr=$('#ac_list_search_input').val();
						index.ac_ap_table.onSearch(searchStr);
					}
				});

	$("#ac_list_search_input").attr("placeholder",appJs.search_hint);
		paint_module_list(igd.module_list.index.menu,"module-list-sec");
	index.init();
})