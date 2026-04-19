current_html = "lock_screen";
var system_status_data;//路由器固件信息
//	上网状态
	function getWanStatus(){
		var dfd = $.Deferred();
		var param = '{"jsonrpc": "2.0", "id": 8, "method": "call", "params": [ "'+localStorage.getItem('token_id')+'", "mwan3", "status", {"section":"interfaces"}]}';
      
        request({
			url:"/ubus",
			data:param
		}).done(function(data){
			if(check_data(data)){
				dfd.resolve(data.result[1]);
			}
			else{
				dfd.reject();
			}
			hide_loading_page();
				show_content()
		}).fail(function(data){
			hide_loading_page();
				show_err_page();	
		})
        return dfd.promise();
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
	//得到上网数量
	
	function get_host_info(){
		var dfd = $.Deferred();
		var numberUsers='{"jsonrpc": "2.0", "id": 2, "method": "call", "params": [ "'+localStorage.getItem('token_id')+'", "acap", "ap_host_get", { } ] }'
			
		request({
			url:"/ubus",
			data:numberUsers
		}).done(function(data){
			if(check_data(data)){
				var dataHost=data.result[1].hosts;	
				var onInternet_data=new Array();//在线设备数据
// 					for(var i=0;i<dataHost.length;i++){
// //						&& dataHost[i].is_wifi==1
// 							if(dataHost[i].online==true){
// 								onInternet_data.push(dataHost[i]);
// 							}
// 						}
						// ROUTE_INFO.count=onInternet_data.length;
						ROUTE_INFO.count=dataHost.length;
					$(".ix_online_quantity_number").html(ROUTE_INFO.count);
			}
			dfd.resolve(data);
		}).fail(function(data){
			//show_request_err(data);
		})
		return dfd.promise();	
	}
	
	//获取是ap状态
	function ap_getstatus2(){
		var dfd = $.Deferred();
		var a1='{"jsonrpc": "2.0", "id": 17, "method": "call", "params": [ "'+localStorage.getItem('token_id')+'", "acap","ac_ap_status",{} ] }'
		
		request({
			url:"/ubus",
			data:a1
		}).done(function(data){
				if(check_data(data)){
	//					console.log(data.result[1]);
						var mode= data.result[1];
						ROUTE_INFO.ac_ap_status=data.result[1];
						if(ROUTE_INFO.ac_ap_status.role=="ac"){
							location.href = "./index.html";
						}
						if(ROUTE_INFO.ac_ap_status.bid=="0" && ROUTE_INFO.ac_ap_status.role=="ap" && current_html!="ap_index"){
							location.href = "./ap_index.html";
						}
						$("#ls_ac").html(mode.ac_ip);
						$("#ls_ac").attr("href","http://"+mode.ac_ip)
						$("#ls_mac").html(mode.ac_mac);
					}
			dfd.resolve();
		}).fail(function(data){
			//show_request_err(data);
		})
		return dfd.promise();
	}
	
	function get_system_load(){
		
		var param='{"jsonrpc": "2.0", "id": 2, "method": "call", "params": [ "'+localStorage.getItem('token_id')+'", "routerd", "system_load_get", { } ] }'

		request({
			url:"/ubus",
			data:param
		}).done(function(data){
			if(check_data(data)){
			
				$("#ls_memory").html(data.result[1].mem+"%");
				$("#ls_cpu").html(data.result[1].cpu+"%");
			}
		}).fail(function(data){
			//show_request_err(data);
		})
		
	}
	
	//1.获取路由版本信息
	function wan_config_get(){
		var dfd = $.Deferred();
		var a1='{"jsonrpc": "2.0", "id": 20, "method": "call", "params": [ "'+localStorage.getItem('token_id')+'", "auto_update", "auto_update_getversion", {} ] }'
		
		request({
			url:"/ubus",
			data:a1
		}).done(function(data){
			if(check_data(data)){
			  	if(data.result!=undefined && data.result[0]==0){
			  		
			  		$("#version_information").html(data.result[1].cur_version);//显示当前使用包
			  		
			  	}
			  }else{
			  	dfd.reject();
			  }
		}).fail(function(data){
			//show_request_err(data);
		})
		return dfd.promise();
	}
	
	function wan_config_show(){
		var dfd = $.Deferred();
		var a1='{"jsonrpc": "2.0", "id": 2, "method": "call", "params": [ "'+localStorage.getItem('token_id')+'", "network.interface.lan", "status", { } ] }'
	
		request({
			url:"/ubus",
			data:a1
		}).done(function(data){
			  if(check_data(data)){
			  	data=data.result[1]
//		 	console.log(data['ipv6-prefix-assignment'][0]['local-address'].address)

					if(data["clonemac"]==undefined || data["clonemac"]=="00:00:00:00:00:00"){
         				$("#equipment_mac").html(data["macaddr"].toUpperCase());
	         		}else{
	         			$("#equipment_mac").html(data["clonemac"].toUpperCase());
	         		}
					
			
			  }else{
			  	dfd.reject();
			  }
		}).fail(function(data){
			//show_request_err(data);
		})
		return dfd.promise();
	}
	
	function get_local_time(){
		var dfd = $.Deferred();
		var a1='{"jsonrpc": "2.0", "id": 18, "method": "call", "params": [ "'+localStorage.getItem('token_id')+'", "routerd", "get_local_time", {} ] }'
		
		request({
			url:"/ubus",
			data:a1
		}).done(function(data){
			 if(check_data(data)){
			  	
			  		
			  	$("#ls_time").html(data.result[1].time);
			  		
			  	
			  }else{
			  	dfd.reject();
			  }
		}).fail(function(data){
			//show_request_err(data);
		})
		return dfd.promise();
	}
	function upgrade_show(){
		$("#upgrade_Modal").modal();
		if(!!router.rid && !!router.phoneId){
			$("#upgrade_Modal .tab_area .tab-item").eq(1).click();
			$("#upgrade_Modal .tab_area").addClass("hidden");
		}else{
			$("#upgrade_Modal .tab_area .tab-item").eq(0).click();
			
		}
	}
	function initialization_show(){
		$("#initialization_Modal").modal();
	}
	function put_fileFn(){
		    console.log($("#put_file"))
		    var url=document.getElementById("put_file").value;
	    	url=url.split("\\");//这里要将 \ 转义一下
	//  alert("文件名 "+url[url.length-1]);
	    $("#update_file_name").val(url[url.length-1])
	     console.log(url[url.length-1])
	}
	
	function get_file(){
		$("#put_file").click();
	}
	function two_confirmation(){
		var put_file_val=$("#put_file").val();
		var fileName = put_file_val.substring(put_file_val.lastIndexOf(".") + 1).toLowerCase();
		console.log(fileName);
		
		if(put_file_val==""){
			show_message("error",L.abnormal_file_format);
			return;
		}
		$("#upgrade_Modal").modal("hide");
		show_message("save",L.uploading_file);
	//	var mac=$("#mac_checkbox").val();
	//	if(mac==0){
			var t1="/cgi-bin/upgrade?sid="+localStorage.getItem('token_id');
	//	}else{
	//		var t1="/cgi-bin/upgrade?sid="+localStorage.getItem('token_id')+"&mac=ff:ff:ff:ff:ff:ff";
	//	}
		
		console.log(t1);
		$("#update_form").attr("action", t1);
	
		
		
		$("#update_form").ajaxSubmit({  
			type: 'post',  
			url: t1,
			uploadProgress: function (event, position, total, percentComplete) {
				console.log(percentComplete);
			},
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
			success: function(data){  
				$( "#update_form").resetForm(); 
				console.log(data);
				
	
				if(data.result[0]==0){
					show_message("success",L.file_upload_success);
					//clearInterval(automatic);//停止版本检测
					$("#reset_tip").html(language[language_type]["PAGES"][current_html]["html"]["reset_tip"][1])
					restartSuccess();
					
				}else if(data.result[0]==6){
					show_message_gt("error",language[language_type]["ERROR"]["6"])
					window.setTimeout(function(){
						window.location.href = "/login.html";
					},2000);
				}
				else if(data.result[0]==8){
					show_message("error",L.file_type_error);
				}
	//			else{
	//				show_message("error",L.file_upload_error);
	//			}
				
			},  
			error: function(XmlHttpRequest, textStatus, errorThrown){
			 show_message("error",L.file_upload_error); 
			}  
		});  
	
	
	}
	//手动重启成功后倒计时启动
	function restartSuccess(){
		$(".fullScreenMask").removeClass("hidden");//显示遮罩
		$("#info-panel").addClass("hidden");
		$(".infoone").removeClass("hidden");
		var time=$("#time").html();
		settime(time);
		
	}
	//手动重启成功后倒计时启动
	function settime(obj) {
	    if (obj == 0) { 
	        location.href = "/login.html";
	        return;
	    } else{
	    	obj--; 
	    	$("#time").html(obj);
	    }
		setTimeout(function() { 
		    settime(obj) }
		    ,1000) 
		}
		// 初始化
		function reset_confirm(){
			$("#initialization_Modal").modal("hide");
				show_message("save",L.reseting);//显示遮罩
			//	data_submit.keep_wan_config=$("#param_save").val();
			//	data_submit.keep_wifi_config=$("#network_param").val();
			//	data_submit.keep_host_config=$("#host_name_param").val();
			//	data_submit.keep_plugin=$("#plugin_param").val();
			var a1='{"jsonrpc": "2.0", "id": 1, "method": "call", "params": [ "'+localStorage.getItem('token_id')+'","routerd","factory",{}]}';
			
				request({
						url:"/ubus",
						data:a1
					}).done(function(data){
						data=JSON.stringify(data);
				        data = eval("(" + data + ")");
				         if(check_data(data)){
				         	if(data.result[0]==0){
								$("#reset_tip").html(language[language_type]["PAGES"][current_html]["html"]["reset_tip"][0])
				         		show_message("success");
				             	restartSuccess();
				             	hide_loading_page();
							show_content();
				         	}
				         	console.log(data);
				         }
					}).fail(function(data){
						hide_loading_page();
							show_err_page();	
					})
		}
function setWanInfo(){
		$.when(getWanInfo()).then(function(data){
											   
			var speedObj = formatSpeed(data.all_in_byte_speed);
//			$("#speed-val").html(speedObj.value);
//			$("#speed-unit").html(speedObj.unit);
			ls_time
			var timeObj = convert_time(data.uptime);
			
			if(timeObj.day){
				$("#run-time-val").html(timeObj.day);
				$("#run-time-unit").html(L.day);
			}
			else{
				if(timeObj.hour){
					$("#run-time-val").html(timeObj.hour);
					$("#run-time-unit").html(L.hour);
				}
				else{
					if(timeObj.minute){
						$("#run-time-val").html(timeObj.minute);
						$("#run-time-unit").html(L.minute);
					}
					else{
						if(timeObj.second){
							$("#run-time-val").html(timeObj.second);
							$("#run-time-unit").html(L.second);
						}
					}
				}
			}
		});
	}
	function renderWanInfo(){
		getWanStatus();
		get_host_info();

		setWanInfo();
		wan_config_get();//版本信息
		wan_config_show();//设备mac
		get_local_time();//当前时间
		ap_getstatus2();
		get_system_load();
//	  	$.when(devinfo_get_cgi()).then(function(data){ 
//	  		if(ROUTE_INFO.sw!="bridge"){
//	  			location.href = "./login.html";
//	  		}
//	  	});
	}


var hotspot={
	hotspot_get_data:{},
	get_data:function(type,setData){
		var me = this;
		var dfd = $.Deferred();
		var method = null;
		if(type == "hotspot_get"){
			method = "hotspot_get";
			setData={};
		}else if(type == "hotspot_set"){
			method = "hotspot_set";
			
		}else if(type == "hotspot_manual_get"){
			method = "hotspot_manual_get";
			setData={};
		}else{
			method=type;
		}
		var timer_get={"jsonrpc": "2.0", "id":24, "method": "call", "params": [ localStorage.getItem('token_id'), "hotspot", method, setData ] }
		timer_get=JSON.stringify(timer_get);
		request({
			url:"/ubus",
			data:timer_get
		}).done(function(data){
			handleResponse(data,function(){
						if(type == "hotspot_get"){
							
		
							if(data.result[1].isp=="manual"){
								hotspot.get_data("hotspot_manual_get")
							}else{
								me.hotspot_get_data = data.result[1];
							}
						}else if(type == "hotspot_set"){
							show_message("success");
							$("#captive_portal_Modal").modal("hide");
							me.hotspot_get_data_fn();
						}else if(type == "hotspot_manual_get"){
							me.hotspot_get_data = data.result[1];
							me.hotspot_get_data.isp="manual";
							me.init_hotspot_show();
						}
							dfd.resolve();
						},function(){
							hide_loading_page();
							show_err_page();	
						});
			
		}).fail(function(data){
			hide_loading_page();
			show_err_page();
		})
		
		
		return dfd.promise();
	},
	hotspot_get_data_fn:function(){
		var me = this;
		
		$.when(hotspot.get_data("hotspot_get")).then(function(){
				
				me.init_hotspot_show();
			});
	},
	init_hotspot_show:function(){
		var me = this;
		$("#captive_portal_enable").html(me.hotspot_get_data.disabled==1?L.closed:L.enable);
		// me.hotspot_get_data.disabled==1?$("#captive_portal_enable").siblings(".enable_click").removeClass("f-switchTrue"):$("#captive_portal_enable").siblings(".enable_click").addClass("f-switchTrue");
		
		
		$("#nasid").html(me.hotspot_get_data.nasid);
		$("#isp").html(me.hotspot_get_data.isp ? me.hotspot_get_data.isp.toUpperCase():"");
		
		
		
		if(me.hotspot_get_data.disabled==0){
			$("#captive_portal_show").removeClass("hidden");
			
			if(me.hotspot_get_data.isp=="hotspotsystem"){
				$("#wifisystem_show").addClass("hidden");
			}else{
				$("#wifisystem_show").removeClass("hidden");
				$("#password").html(me.hotspot_get_data.uamsecret)
			}
		}else{
			$("#captive_portal_show").addClass("hidden");
		}
		// $(".checkbox2 .checkboxShall").val(0).removeClass("checkedCurrent");
		// if(me.hotspot_get_data.dev_type==1){
		// 	$(".checkbox2 .checkboxShall").eq(0).val(1).addClass("checkedCurrent");
		// }else if(me.hotspot_get_data.dev_type==2){
		// 	$(".checkbox2 .checkboxShall").eq(1).val(1).addClass("checkedCurrent");
		// }else if(me.hotspot_get_data.dev_type==3){
		// 	$(".checkbox2 .checkboxShall").val(1).addClass("checkedCurrent");
		// }
		var day_d=reverseNumber(dec_two_bin(me.hotspot_get_data.dev_type,($(".checkboxShall").length-1)));
		
		for(var i=0;i<day_d.length;i++){
			if(day_d[i]==0){
				$("#checkboxShall_"+i).val(0);
				$("#checkboxShall_"+i).removeClass("checkedCurrent");
			}else if(day_d[i]==1){
				$("#checkboxShall_"+i).val(1);
				$("#checkboxShall_"+i).addClass("checkedCurrent");
			}
			
		}
		
		if(me.hotspot_get_data.isp=="manual"){
			$("#password,#nasid").parents(".form-group").addClass("hidden");
			$("#nas_manual").removeClass("hidden");
			$("#local_network").html(me.hotspot_get_data.local_network);
			$("#uam_server").html(me.hotspot_get_data.uamserver);
			$("#radius_server1").html(me.hotspot_get_data.radius);
			$("#radius_nas_id").html(me.hotspot_get_data.nasid);
			$("#preferred_dns").html(me.hotspot_get_data.dns1);
			
		}else if(me.hotspot_get_data.isp=="rostelecom"){
			
			$("#wifisystem_show").addClass("hidden");
		}else if(me.hotspot_get_data.isp=="wifisystem"){
			$("#password").parents(".form-group").removeClass("hidden");
		}
	},
	hotspot_set_data:function(setData){
		var me = this;
		show_message("save");
		$.when(hotspot.get_data("hotspot_set",setData)).then(function(){
				me.hotspot_get_data_fn();
			
		});
	},
	add_event:function(){
		var me = this;
			$("body").undelegate("#captive_portal_Modal button.btn-confirm","click").delegate("#captive_portal_Modal button.btn-confirm","click",function(){
				var setData={};
				setData["disabled"]=$("#captive_portal_enable").val()*1;
				if(setData["disabled"]==1){
					me.hotspot_set_data(setData);
					return;
				}
				setData["isp"]=$("#isp").val();
				setData["nasid"]=$("#nasid").val();
				if(!check_input("captive_portal_frm")){
						return;
					}
				if(setData["isp"]=="wifisystem"){
					setData["uamsecret"]=$("#password").val();
					if(!check_input("captive_portal_wifisystem_frm")){
						return;
					}
				}
				if($(".checkbox2 .checkboxShall").eq(0).val()==0 && $(".checkbox2 .checkboxShall").eq(1).val()==0){
					show_message("msg_info",L.check_one);
					return;
				}else if($(".checkbox2 .checkboxShall").eq(0).val()==0 && $(".checkbox2 .checkboxShall").eq(1).val()==1){
					setData["dev_type"]=2;
				}else if($(".checkbox2 .checkboxShall").eq(1).val()==1 && $(".checkbox2 .checkboxShall").eq(1).val()==1){
					setData["dev_type"]=3;
				}else if($(".checkbox2 .checkboxShall").eq(0).val()==1 && $(".checkbox2 .checkboxShall").eq(1).val()==0){
					setData["dev_type"]=1;
				}
				me.hotspot_set_data(setData);
				
			});
			$("body").undelegate(".form_captive_portal #isp","click").delegate(".form_captive_portal #isp","change",function(){
				if($(this).val()=="wifisystem"){
					$("#wifisystem_show").removeClass("hidden");
					
				}else{
					$("#wifisystem_show").addClass("hidden");
					
				}
			});
			$("body").undelegate("#captive_portal","click").delegate("#captive_portal","click",function(){
				me.hotspot_get_data_fn();
				$("#captive_portal_Modal").modal();
			});
			
	},
	init:function(){
		var me = this;
		me.hotspot_get_data_fn();
		
		this.add_event();
		
	}
	
}

//1.获取路由版本信息
function wan_config_set(){
	var a1='{"jsonrpc": "2.0", "id": 20, "method": "call", "params": [ "'+localStorage.getItem('token_id')+'", "auto_update", "auto_update_getversion", {} ] }'
	request({
			url:"/ubus",
			data:a1
		}).done(function(data){
			if(check_data(data)){
			  	if(data.result!=undefined && data.result[0]==0){
			  		system_status_data=data.result[1];
			  		$(".cur_version").html(data.result[1].cur_version);//显示当前使用包
			  		// auto_updat();
			  	}
			  }
		}).fail(function(data){
			//show_request_err(data);
		})
	
}
//自动升级-获取自动升级开关的配置
function auto_up_show(){
	var a1='{"jsonrpc": "2.0", "id": 20, "method": "call", "params": [ "'+localStorage.getItem('token_id')+'", "auto_update", "auto_update_get", {} ] }'
	request({
			url:"/ubus",
			data:a1
		}).done(function(data){
			if(check_data(data)){
		  	if(data.result!=undefined && data.result[0]==0){
		  		if(data.result[1].allow=="1"){
             		  
					checkbox_enable("auto_update_checkbox",0);
             	}else if(data.result[1].allow=="0"){
             		checkbox_enable("auto_update_checkbox",0);
             	}else if(data.result[1].allow=="2"){
             		checkbox_enable("auto_update_checkbox",1);
             	}else if(data.result[1].allow=="3"){
             		checkbox_enable("auto_update_checkbox",1);
             	}
             	
		  	}
		  }
		}).fail(function(data){
			//show_request_err(data);
		})
	
	
}

//版本检测
function version_check_button(){
	show_message("save",L.version_checking);
	var a1='{"jsonrpc": "2.0", "id": 20, "method": "call", "params": [ "'+localStorage.getItem('token_id')+'", "auto_update", "auto_update_check", {} ] }'

	request({
			url:"/ubus",
			data:a1
		}).done(function(data){
			 if(check_data(data)){
			 	if(data.result!=undefined){
			 		show_message("success",L.version_checking_success);
			 		$("#update_status").removeClass("hidden");
			 		$("#span_new_version").html(data.result[1].update_version);
			 		if(data.result[1].update_version>data.result[1].cur_version){
			 			$("#span_new_version_div").removeClass("hidden");	
	             		$("#update_status").html(L.version_title2);
	             		$("#update_btn").removeClass("hidden");
			 		}else{
			 			$("#span_new_version_div").addClass("hidden");
	             		$("#update_status").html(L.version_title1);
	             		$("#update_btn").addClass("hidden");
			 			
			 		}
			 	}else{
			 		show_message("error",L.version_checking_error);
			 	}
			 }
		}).fail(function(data){
			//show_request_err(data);
		})
}
//自动升级按钮被点击
function version_check(){
	
	var a1='{"jsonrpc": "2.0", "id": 20, "method": "call", "params": [ "'+localStorage.getItem('token_id')+'", "auto_update", "auto_update_now", {} ] }'

	
	request({
			url:"/ubus",
			data:a1
		}).done(function(data){
			if(check_data(data)){
			 	if(data.result!=undefined){
			 		if(data.result[0]==0){
			 			restartSuccess();
						$("#upgrade_Modal").modal("hide");
			 		}else{
			 			
			 		}
			 	}
			}
		}).fail(function(data){
			//show_request_err(data);
		})
}

//自动升级点击升级按钮
function start_update(){
	version_check();
}
//自动升级开关被点击
function auto_up_set(){
	var al1ow;
	var auto_update=$("#auto_update_checkbox").val();
	var urgent_update=$("#urgent_update_checkbox").attr("checked");
	if(auto_update==0){
		al1ow=2;
	}else{
		al1ow=0;
	}
	var a1='{"jsonrpc": "2.0", "id": 20, "method": "call", "params": [ "'+localStorage.getItem('token_id')+'", "auto_update", "auto_update_set", {"allow":"'+al1ow+'"} ] }'

	request({
			url:"/ubus",
			data:a1
		}).done(function(data){
			 if(check_data(data)){
			 	if(data.result!=undefined){
			 		if(data.result[0]==0){
	//		 			auto_up_show();
			 		}
			 		
			 	}
			 }
		}).fail(function(data){
			//show_request_err(data);
		})
//	console.log(al1ow);
}

$(document).ready(function(){
	init_breadcrumbs();
	render_page();
	show_loading_page();
	lang.init(language[language_type]["PAGES"][current_html]);
	appJs = language[language_type]["PAGES"][current_html]["js"];	
	paint_module_list(igd.module_list.index.menu,"module-list-sec");
	$(".navigation a").removeClass("current");//移除所有导航状态	
	$(".navigation a").eq(0).addClass("current");//给当前页面添加对应的导航
//开关0是启用，1是禁用
		$(".enable_click").on('click',function(){//1关闭  0打开
			$(this).toggleClass("f-switchTrue");	
				if($(this).hasClass("f-switchTrue")){
					$(this).siblings(".checkboxAll").attr("value","0");
					$(this).siblings(".checkboxAll").attr("checked");
					
					$("#captive_portal_show").removeClass("hidden");
					if($("#isp").val()=="hotspotsystem"){$("#wifisystem_show").addClass("hidden")}
				}else{
					$(this).siblings(".checkboxAll").attr("value","1");			
					$(this).siblings(".checkboxAll").removeAttr("checked");
					
					$("#captive_portal_show").addClass("hidden");
					
				}
				if($(this).hasClass("auto_update_checkbox")){
					auto_up_set();
					
				}
					
				
				
		})
		//tab标签切换
			$("#upgrade_Modal .tab_area").on("click",".tab-item",function(){
				var index = $(this).index();
				$("#upgrade_Modal .update_form").addClass("hidden");
				if(index==0){
					wan_config_set();// 获取WAN口的DMZ设置
					$("#upgrade_Modal .manual_upgrade").removeClass("hidden");
			   }else if(index==1){
			   		wan_config_set();
			  	 	auto_up_show();//自动升级参数
					$("#upgrade_Modal .auto_update").removeClass("hidden");
			   }
				$("#upgrade_Modal .tab_area .tab-item").removeClass("selection");
				$(this).addClass("selection");
				
				
				
			})
		//多选
			$(".checkbox2 input").click(function(){
		//		var timer_day=$("#timer_day").val().split('');//获取数组
					$(this).toggleClass("checkedCurrent");
					if($(this).hasClass("checkedCurrent")){
						$(this).val(1);
					}else{
						$(this).val(0);
					}
			})	
	hotspot.init();
	get_lan_ip();
	get_wan_ip();
	$(".icon-describe").html(router.module);
	renderWanInfo();
	clearInterval(interval3);
	var interval3=setInterval(function(){
	     renderWanInfo();
	},2000);
	$(".app_bottom_menu").addClass("hidden");
})