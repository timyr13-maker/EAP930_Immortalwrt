//我的设备信息
current_html = "router_info";

var myEmpty={0:[],1:[]};
//获取路由器基本信息
function router_basic_info(){
	var a1='{"jsonrpc": "2.0", "id": 8, "method": "call", "params": [ "'+localStorage.getItem('token_id')+'", "uci", "get", {"config": "customer","section": "info"}]}'
	request({
		url:"/ubus",
		data:a1
	}).done(function(data){
		
	     if(check_data(data)){
	     	if(data.result[1].values.meminfo){
				$("#wireless_rate").html(data.result[1].values.wifispeed);
				$("#flash").html(data.result[1].values.meminfo);
			}else{
				
				$("#wireless_rate").html(router.wireless_rate);
				$("#flash").html(router.flash);
			}
	     	hide_loading_page();
				show_content();
	     }
	}).fail(function(data){
		hide_loading_page();
		show_err_page();	
	})
	
}


function internet_access(){
	$(".ipv6_text").addClass("hidden");
	//查询上网方式wisp ipv4 ipv6
	var a1='{"jsonrpc": "2.0", "id": 8, "method": "call", "params": [ "'+localStorage.getItem('token_id')+'", "mwan3", "status", {"section":"interfaces"}]}'
	
		request({
			url:"/ubus",
			data:a1
		}).done(function(data){
			if(check_data(data)){
	         	data=data.result[1].interfaces;
	         	if(data.wan_wisp!=undefined){
	         		if(data.wan_wisp.status=="online"){
	         		
	         		//wisp上网方式查询
	         		var wan_wisp='{"jsonrpc": "2.0", "id": 9, "method": "call", "params": [ "'+localStorage.getItem('token_id')+'", "network.interface.wan_wisp", "status", { } ] }'
	         		
	         		request({
						url:"/ubus",
						data:wan_wisp
					}).done(function(wan_wisp_data){
						if(check_data(wan_wisp_data)){ 
		        		 	wan_wisp_data=wan_wisp_data.result[1];
	//	        		 	console.log("上网方式wisp",wan_wisp_data)
		        		 	$(".ipv6_text").addClass("hidden");
		        		 	$("#online_info_ipv4").html("WISP");
		        		 	if(wan_wisp_data["dns-server"][1]==undefined){
			         			$("#ipv4_side_dns").addClass("hidden");
			         		}else{
			         			$("#ipv4_side_dns").removeClass("hidden");
			         			$("#routerInfo_dns_b").html(wan_wisp_data["dns-server"][1]);
			         		}
			         		if(wan_wisp_data["dns-server"][0]){
			         			$("#routerInfo_dns_a").html(wan_wisp_data["dns-server"][0]);
			         		}
			         		if(wan_wisp_data["ipv4-address"][0].address){
								$("#routerInfo_wanIp").html(wan_wisp_data["ipv4-address"][0].address);
							}
			         		if(wan_wisp_data["clonemac"]==undefined || wan_wisp_data["clonemac"]=="00:00:00:00:00:00"){
			         			$("#routerInfo_mac_a_ipv6").html(wan_wisp_data["macaddr"].toUpperCase());
			         		}else{
			         			$("#routerInfo_mac_a_ipv6").html(wan_wisp_data["clonemac"].toUpperCase());
			         		}
		        		 }
					}).fail(function(data){
						//show_request_err(data);
					})
					
	         	
		         	}else{
		         		wan_config_show();//ipv4
		         		console.log("上网方式ipv4")
		         	}
	         	}else{
	         		wan_config_show();//ipv4
		         	console.log("上网方式ipv4")
	         	}
	         	
	         	
	
	         }
		
		}).fail(function(data){
			//show_request_err(data);
		})
         
	
	
}

//获取LAN口和WAN口的状态信息
function interface_status_show(){
//	var a1='{"jsonrpc": "2.0", "id": 2, "method": "call", "params": [ "'+localStorage.getItem('token_id')+'", "routerd", "lan_config_get", { } ] }'
//	
//	request({
//		url:"/ubus",
//		data:a1
//	}).done(function(data){
//		
//       if(check_data(data)){
//       	interface_status_Handle(data.result[1].list[0]);
//       	
//       }
//	}).fail(function(data){
//		//show_request_err(data);
//	})
	
	var ipv6_lan='{"jsonrpc": "2.0", "id": 2, "method": "call", "params": [ "'+localStorage.getItem('token_id')+'", "network.interface.lan", "status", { } ] }'
	
	request({
			url:"/ubus",
			data:ipv6_lan
		}).done(function(data){
			if(check_data(data)){
			 	data=data.result[1]
	//		 	console.log(data['ipv6-prefix-assignment'][0]['local-address'].address)
				if(data['ipv6-prefix-assignment'][0]){
					$("#routerInfo_lanIp_ipv6").html(data['ipv6-prefix-assignment'][0]['local-address'].address);
				}
				if(data["clonemac"]==undefined || data["clonemac"]=="00:00:00:00:00:00"){
					$("#routerInfo_Mac_lan").html(data["macaddr"].toUpperCase());
				}else{
					$("#routerInfo_Mac_lan").html(data["clonemac"].toUpperCase());
				}
	        }
		}).fail(function(data){
			//show_request_err(data);
		})
	
}

 

//处理获取LAN口和WAN口的状态信息
function interface_status_Handle(data){
//	if(ROUTE_INFO.sw=='route'){
//		$("#routerInfo_lanIp").html(data.ipaddr);//路由器IP地址
//		if(data.dhcp_en==true){
//		 	$("#routerInfo_dhcp_state").html(L.enable)
//		 }else{
//		 	$("#routerInfo_dhcp_state").html(L.closed)
//		 }
//		 var dhcp_range_new=dhcp_pool_calculator_new(data.ipaddr,data.netmask,data.dhcp_start,data.dhcp_limit)
//		 $("#routerInfo_lanMac").html(dhcp_range_new.dhcpStart+"-"+dhcp_range_new.dhcpEnd);
//	}else{
		$("#routerInfo_lanIp").html(data.dhcp_ip);//路由器IP地址
		$("#routerInfo_dhcp_state").html('/');
		$("#routerInfo_lanMac").html('/');
//	}
	
	$("#routerInfo_mask").html(data.netmask);//子网掩码
	
	$("#routerInfo_lanMac").html(dhcp_range_new.dhcpStart+"-"+dhcp_range_new.dhcpEnd);
	 $("#routerInfo_dhcp_range").html(data.dhcp_limit);
	  $("#routerInfo_host_number").html(data.dhcp_start);
	 
	 if(data.dhcp_en==true){
	 	$("#routerInfo_dhcp_state").html(L.enable)
	 }else{
	 	$("#routerInfo_dhcp_state").html(L.closed)
	 }
}

//获取ipv4上网设置信息
function wan_config_show(){
	
	
	var a2='{"jsonrpc": "2.0", "id": 3, "method": "call", "params": [ "'+localStorage.getItem('token_id')+'", "network.interface.wan1", "status", { } ] }'
	
	request({
			url:"/ubus",
			data:a2
		}).done(function(data){
			
	
        var result=data.result[1];
         if(check_data(data)){
			if(result.proto=="l2tp" || result.proto=="pptp"){
				$("#routerInfo_mac").addClass("hidden")
			}else{
				$("#routerInfo_mac").removeClass("hidden")
			}
			console.log("ipv4",result)
			
         	myEmpty[0]=result["ipv4-address"];
         	if(result["ipv4-address"]==undefined){
         		$(".ipv4_text").addClass("hidden");
         	}else{
         		$(".ipv4_text").removeClass("hidden");
				$("#online_info_ipv4").html(result.proto);
				if(result["ipv4-address"][0].address){
					$("#routerInfo_wanIp").html(result["ipv4-address"][0].address);
				}
         		if(result["dns-server"][0]){
         			$("#routerInfo_dns_a").html(result["dns-server"][0]);
         		}
         		
         		if(result["dns-server"][1]==undefined){
         			$("#ipv4_side_dns").addClass("hidden");
         		}else{
         			$("#ipv4_side_dns").removeClass("hidden");
         			$("#routerInfo_dns_b").html(result["dns-server"][1]);
         		}
         		
         	}
//       	debugger
//       		$("#routerInfo_mac_a_ipv6").html(result["macaddr"]);
				if(result["clonemac"]==undefined || result["clonemac"]=="00:00:00:00:00:00"){
         			$("#routerInfo_mac_a_ipv6").html(result["macaddr"].toUpperCase());
         		}else{
         			$("#routerInfo_mac_a_ipv6").html(result["clonemac"].toUpperCase());
         		}	
         		
         		 
         wan_config_Handle(data.result[1]);

	var wan_ipv6_config_get='{"jsonrpc": "2.0", "id": 1, "method": "call", "params": [ "'+localStorage.getItem('token_id')+'", "routerd", "wan_ipv6_config_get", {"wanid":1 } ] }'
	
	
	request({
			url:"/ubus",
			data:wan_ipv6_config_get
		}).done(function(wan_ipv6_config_data){
			 if(check_data(wan_ipv6_config_data)){
			 	if(wan_ipv6_config_data.result[1].wanmode!="auto"){
			 		var ipv6_get='{"jsonrpc": "2.0", "id": 4, "method": "call", "params": [ "'+localStorage.getItem('token_id')+'", "network.interface.wan1_ipv6", "status", { } ] }';
					wan_ipv6_get(ipv6_get);
					
			 	}else{
			 		//       	根据ipv4的上网方式调取ipv6
		         	if(data.result[1].proto=="pppoe"){
						var ipv6_get='{"jsonrpc": "2.0", "id": 4, "method": "call", "params": [ "'+localStorage.getItem('token_id')+'", "network.interface.wan1_6", "status", { } ] }';
						wan_ipv6_get(ipv6_get,"pppoe");
					}else{
						var ipv6_get='{"jsonrpc": "2.0", "id": 4, "method": "call", "params": [ "'+localStorage.getItem('token_id')+'", "network.interface.wan1_ipv6", "status", { } ] }';
						wan_ipv6_get(ipv6_get);
					} 
			 	
			 }
			}
			}).fail(function(wan_ipv6_config_data){
				//show_request_err(data);
			})
	

         }
		}).fail(function(data){
			//show_request_err(data);
		})
	
	
	
	


	
}

//根据ipv4的数据获取ipv6上网设置信息
function wan_ipv6_get(ipv6_get,access){
	
		request({
			url:"/ubus",
			data:ipv6_get
		}).done(function(data){
			
			
		 
         if(check_data(data)){
         	console.log(data)
         	var result_ipv6
         	
         	if(data.error){
         		myEmpty[1]=[]
         	}else{
         		result_ipv6=data.result[1];
         		myEmpty[1]=result_ipv6["ipv6-address"];
         		if(result_ipv6.proto=="l2tp" || result_ipv6.proto=="pptp"){
				$(".ipv6_text").addClass("hidden");
				
			}
         	}
         	
         	
         		console.log("判断结果",data,myEmpty[0],myEmpty[1])
			if(myEmpty[0]==undefined && myEmpty[1]==false || ROUTE_INFO.sw!="route"){
				$("#ipv4_information").addClass("hidden");
			}else{
				$("#ipv4_information").removeClass("hidden");
			}
			
			
         	if(myEmpty[1]==false || myEmpty[1]==undefined){
         		$(".ipv6_text").addClass("hidden");
         		
         	}
         	else{
//       		console.log(myEmpty[0],myEmpty[1].length==0)
         		$(".ipv6_text").removeClass("hidden");
         		if(access!=undefined){
         			$("#online_info_ipv6").html("PPPOE");
         		}else{
         			$("#online_info_ipv6").html(result_ipv6.proto);
         		}
         		
         		
         		
         		if(result_ipv6["ipv6-address"]){
         			$("#routerInfo_wanIp_ipv6").html(result_ipv6["ipv6-address"][0].address);
         		}
         		if(result_ipv6["ipv6-prefix"]){
         			$("#routerInfo_prefix_ipv6").html(result_ipv6["ipv6-prefix"][0].address);
         		}
      			if(result_ipv6["dns-server"]){
      				$("#routerInfo_ipv6dns_a").html(result_ipv6["dns-server"][0]);
      			}
         		
         		if(result_ipv6["dns-server"]==undefined){
         			$("#ipv6_side_dns").addClass("hidden");
         			
         		}else{
         			$("#ipv6_side_dns").removeClass("hidden");
         			$("#routerInfo_ipv6dns_b").html(result_ipv6["dns-server"][1]);
         		}
         	}
         }
	}).fail(function(data){
			//show_request_err(data);
		})
}



//处理上网设置信息
function wan_config_Handle(data){
	if(data.proto=="dhcp"){
		$("#online_info").html(L.dynamic);
	}else if(data.proto=="pppoe"){
		$("#online_info").html(L.pppoe);
	}else if(data.proto=="static"){
		$("#online_info").html(L.static_IP);
	}

	
}
function ac_apip_get(){
	var get_nat='{"jsonrpc": "2.0", "id": 9, "method": "call", "params": [ "'+localStorage.getItem('token_id')+'", "acap", "ac_apip_get", {} ] }'
	request({
			url:"/ubus",
			data:get_nat
		}).done(function(data){
		
	
            if(check_data(data)){   	
				var newData=data.result[1];
				
				$("#routerInfo_lanIp").html(newData.ipaddr);
				
				$("#routerInfo_mask").html(newData.netmask);
				
			}
		
		}).fail(function(data){
			//show_request_err(data);
		})
}
$(document).ready(function(){
	init_breadcrumbs();
	render_page();
	show_loading_page();
	lang.init(language[language_type]["PAGES"][current_html]);
	router_basic_info();
	interface_status_show();
	ac_apip_get();
	$("#router_name").html(document.title);
	internet_access();
});