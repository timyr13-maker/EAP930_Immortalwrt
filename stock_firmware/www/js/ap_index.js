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
		}).fail(function(data){
			//show_request_err(data);
		})
        return dfd.promise();
	}
	function getLanIp(){
		var dfd = $.Deferred();
		var param = '{"jsonrpc": "2.0", "id": 16, "method": "call", "params": [ "'+localStorage.getItem('token_id')+'", "mwan3", "status", {}]}';
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
		})
        return dfd.promise();
	}
	
	function network_interface_wan1(){
		var dfd = $.Deferred();
		var param = '{"jsonrpc": "2.0", "id": 16, "method": "call", "params": [ "'+localStorage.getItem('token_id')+'", "network.interface.wan1", "status", {}]}';
     
        
		request({
			url:"/ubus",
			data:param
		}).done(function(data){
			 if(check_data(data)){
           		 var result=data.result[1];
           		 if(result["ipv4-address"]){
           		 	$("#wan_ip_show").html(result["ipv4-address"][0].address);
           		 }
           		
           		
				dfd.resolve(data.result[1]);
			}
			else{
				dfd.reject();
			}
		}).fail(function(data){
			//show_request_err(data);
		})
       
	}
	function setWanStatus(){
		

			$("#speed-wrapper-top").hide();
			$.when(getLanIp()).then(function(data){
				$("#wan-status-line").removeClass("offline online");
//				console.log(data)
				
				var data =data.interfaces;	
				for(var i in data){
					if(data[i]["status"]=="online"){
						status = data[i]["status"];
						break;
					}
				}
				status_show(status)
//				$("#ip_address_index").html(ROUTE_INFO.wan_ip);
			});

		
		
	}
	function status_show(status){
		if(status=="online"){
				$("#wan-status-line").removeClass("online offline").addClass("online");
				$("#wan-status-icon img").attr("src","./images/online_icon.png");
				$("#speed-wrapper").removeClass("hidden");
			}
			else if(status=="offline"){
				$("#wan-status-line").removeClass("online offline").addClass("offline");
				$("#wan-status-icon img").attr("src","./images/offline_icon.png");
				$("#speed-wrapper").addClass("hidden");
			}
			else{
				$("#wan-status-line").removeClass("online offline").addClass("offline");
				$("#wan-status-icon img").attr("src","./images/offline_icon.png");
				$("#speed-wrapper").addClass("hidden");
			}
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
	//得到上网数量
	function get_host_info(){
		var numberUsers='{"jsonrpc": "2.0", "id": 2, "method": "call", "params": [ "'+localStorage.getItem('token_id')+'", "devices_app", "get_host_info", { } ] }'
	
		
		request({
			url:"/ubus",
			data:numberUsers
		}).done(function(data){
			if(check_data(data)){
				var dataHost=data.result[1].hosts;	
				var onInternet_data=new Array();//在线设备数据
					for(var i=0;i<dataHost.length;i++){
							if(dataHost[i].online==true  && dataHost[i].is_wifi==1){
								onInternet_data.push(dataHost[i]);
							}
						}
//					console.log(onInternet_data.length)
					$("#equipment_lenght").html(onInternet_data.length);
			}
		}).fail(function(data){
			//show_request_err(data);
		})	
	}
	
	function setWanInfo(){
		$.when(getWanInfo()).then(function(data){
											   
			var speedObj = formatSpeed(data.all_in_byte_speed);
			$("#speed-val").html(speedObj.value);
			$("#speed-unit").html(speedObj.unit);
			
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
	
	function renderWanInfo(time){
		var obj = {};
		obj.timerName = timer.runningTimer;
		obj.time = time || 5000;
		obj.callback = "setWanInfo";
		render(obj);
	}
	function get_host_info2(time){
		var obj = {};
		obj.timerName = timer.host_info;
		obj.time = time || 5000;
		obj.callback = "get_host_info";
		render(obj);
	}

	window.renderWanStatus = renderWanStatus;
	window.renderWanInfo = renderWanInfo;
	window.get_host_info2 = get_host_info2;
	
})();

var appJs = null;
current_html = "ap_index";

$(document).ready(function(){
	init_breadcrumbs();
	render_page();
	show_loading_page();
		lang.init(language[language_type]["PAGES"][current_html]);
		appJs = language[language_type]["PAGES"][current_html]["js"];
	
	$(".navigation a").removeClass("current");//移除所有导航状态	
	$(".navigation a").eq(0).addClass("current");//给当前页面添加对应的导航
	renderWanInfo(2000);
	renderWanStatus(2000);
	
	$(".btn-i-restart").off("click").on("click",function(){
		window.location.href = "./restart_router.html";
//		window.location.href = "./mesh_pair.html";
	});
	
	
	$(".btn-i-mesh").off("click").on("click",function(){
		window.location.href = "./mesh_pair.html";
		localStorage.setItem('mesh', "pair");
	});
	
	$("#mesh-link").off("click").on("click",function(){
		window.location.href = "./mesh_pair.html";
		localStorage.setItem('mesh', "topo");
	});
	
//	$("#wired-link").off("click").on("click",function(){
//		window.location.href = "./external_network.html";
//		localStorage.setItem('mesh', "topo");
//	});
	$("#gateway-link").off("click").on("click",function(){
		window.location.href = "./ap_lan_setup.html";
		localStorage.setItem('mesh', "topo");
	});
	get_lan_ip();
//	get_wan_ip();
	
	localStorage.removeItem("mesh");
	
	
  		$.when(ac_ap_status(),ac_apip_get()).then(function(data){ 
  			get_host_info2(2000);
		  			$("#ip_address_index").html(ROUTE_INFO.wan_ip);

						$(".navigation a").eq(0).addClass("current");//给当前页面添加对应的导航
		  				if(ROUTE_INFO.ac_ap_status.role=="ap" && ROUTE_INFO.ac_ap_status.bid==1 ){
		  					location.href = "./lock_screen.html";
				  		}
		  				if(ROUTE_INFO.ac_ap_status.role=="ac"){
							location.href = "./index.html";
						}

		  	});
  	paint_module_list(igd.module_list.ap_index.menu,"module-list-sec");
})