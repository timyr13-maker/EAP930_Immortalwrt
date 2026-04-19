current_html = "ap_manage";
var appJs = null;
//wifi管理


var management={
	ac_ap_online_data:[],//ac 在线列表
	ac_ap_offline_data:{},//ac 离线列表
	ac_ap_unnetworked_data:[],//未组网
	ac_wifi_list_data:{},
	ac_aclist_data:{},//网络中的其他AC
	ac_dhcp_mac:"",//修改dhcp时mac存储
	offline_AP:false,
	ap_online_data:{},//ap 在线列表
	timer:2000,
	ac_ap_online_setTimeout:null,
	ap_online_data_setTimeout:null,
	ac_ap_table:null,
	get_data:function(type,setData){
		var me = this;
		var dfd = $.Deferred();
		var method = null;
		if(type == "ac_ap_get"){
			method = "ac_ap_get";
			setData={};
		}else if(type == "ac_ap_offline_get"){
			method = "ac_ap_offline_get";
			setData={};
		}else if(type == "ap_online_get"){
			method = "ap_cmd";
			setData["cmd"]="ap_host_get";
			setData["need_reply"]=1;
		}else if(type == "led_blink"){
			method = "ap_imcmd";
		}
		else if(type == "access_control_level"){
			method = "FwLevel_get";
		}else if(type == "ac_apip_get"){
			method = "ap_cmd";
		}else{
			method=type;
		}
		var timer_get={"jsonrpc": "2.0", "id":24, "method": "call", "params": [ localStorage.getItem('token_id'), "acap", method, setData ] }
		timer_get=JSON.stringify(timer_get);
		request({
			url:"/ubus",
			data:timer_get
		}).done(function(data){
			if(check_data(data)){	
				 if(type == "ac_ap_get"){
					me.ac_ap_online_data=[];
					me.ac_ap_unnetworked_data=[];
					for(var i=0;i<data.result[1]["ap"].length;i++){
						if(data.result[1]["ap"][i]["trust"]==0){
							me.ac_ap_unnetworked_data.push(data.result[1]["ap"][i]);
						}else{
							me.ac_ap_online_data.push(data.result[1]["ap"][i]);
						}
					}
					hide_loading_page();
					show_content();
				}else if(type == "ac_ap_offline_get"){
					me.ac_ap_offline_data = data.result[1];
				}else if(type == "ap_online_get"){
					if(!!!data.result[1]["reason"]){
						me.ap_online_data= data.result[1];
					}
					
				}else if(type == "led_blink"){
					show_message("success");
				}else if(type == "ac_wifi_cfg_get"){
					me.ac_wifi_list_data = data.result[1];
				}else if(type == "ac_wifi_cfg_set"){
					
				}else if(type== "ac_wifi_time_get"){
					me.ac_wifi_time_data = data.result[1];
				}else if(type== "ac_wifi_time_set"){
					if(data["result"][0]==0){
						show_message("success");
					}else{
						show_message("error",data["result"][0]);
					}
					me.empty();
				}else if(type== "ac_wifi_cfg_del"){
					if(data["result"][0]==0){
						show_message("success");
						me.get_wifi_management_data();
					}
				}else if(type == "ac_wifi_adv_cfg_get"){
					if(setData["idx"]==0){//2.4g
						me.ac_wifi_adv_cfg_data_2g = data.result[1];
					}else{//5g
						me.ac_wifi_adv_cfg_data_5g = data.result[1];
					}
					
				}else if(type == "ac_wifi_adv_cfg_set"){
					if(setData["idx"]==1 && data["result"][0]==0){//2.4g
						show_message("success");
						management.ac_wifi_adv_cfg_get_data();
					}
				}else if(type == "ac_wifi_default"){
					show_message("success");
					$("#synchronous_wireless").modal("hide");
					management.get_wifi_management_data();
				}else if(type == "ac_apip_get"){
					dfd.resolve(data);
				}else if(type == "ac_aclist_get"){
					me.ac_aclist_data = data.result[1];
				}else if(type == "ac_apname_set"){
					show_message("success");
					for(var i=0;i<$(".titleName").length;i++){
						if($(".titleName").eq(i).attr("data-mac")==setData.mac){
							$(".titleName").eq(i).html(setData.apname)
						}
					}
				}
				else{
					show_message("success");
					// window.clearInterval(me.ac_ap_online_setTimeout);
					// me.ac_ap_online_setTimeout=window.setInterval(function(){
						me.get_ap_manage_data();
					// },me.timer);
				}
				
				dfd.resolve();
			}	
			else{
				if(type == "led_blink"){
					
				}
				show_message("error");
			}
		}).fail(function(data){
			//show_request_err(data);
			hide_loading_page();
			show_err_page();	
		})
		
		
		return dfd.promise();
	},
	get_ap_manage_data:function(){
		var me = this;
		
		$.when(me.get_data("ac_ap_get"),me.get_data("ac_ap_offline_get"),me.get_data("ac_aclist_get",{})).then(function(){
				me.init_ac_ap_online_list();
//				me.init_ac_ap_offline_list();
				
				
			});
	},
	get_ac_aclist_data:function(){
		var me = this;
		$.when(me.get_data("ac_aclist_get",{})).then(function(){
			if(me.ac_aclist_data.acs.length>0){
					$("#unnetworked_ac_div").removeClass("hidden");
					$("#unnetworked_ac").html(me.ac_aclist_data.acs.length);
					me.init_ac_aclist_list();
				}else{
					$("#unnetworked_ac_div").addClass("hidden");
				}
		});
	},
		init_wifi_filter_data:function(){
			var me = this;
			var title = appJs.sec_title;
//			$("#url_filter_mode").val(me.data.mode);
////			me.data.mode == "black" ? $("#url_filter_title h2").html(title[1]) : $("#url_filter_title h2").html(title[0]);
//			$("#url_filter_title h2").html(title[1])
//			me.data.enable ? $("#url_filter_enable").prop("checked",true) : $("#url_filter_enable").prop("checked",false);
		},
		//	ac	在线表格
		init_ac_ap_online_list:function(){
			var me = this;
			table_page["page"]=page_id("ac_ap_online_table");

			var data=me.ac_ap_online_data.concat(me.ac_ap_offline_data.ap);
				// var data=debuggerData;
			
			$("#online_quantity").html(me.ac_ap_online_data.length);//在线
			$("#offline_quantity").html(me.ac_ap_offline_data.ap.length);//离线
			if(me.ac_ap_unnetworked_data.length>0){
				$("#unnetworked_div").removeClass("hidden");
				$("#unnetworked_quantity").html(me.ac_ap_unnetworked_data.length);//未组网
			}else{
				$("#unnetworked_div").addClass("hidden");
			}

//			console.log(data)
			var new_data = [];

				for(var i in data){
					var tempObj = {};
					
					var timeObj = convert_time(data[i].seconds);
					var day_=timeObj.day ? timeObj.day + L.day : "",
						hour_=timeObj.hour ? timeObj.hour + L.hour : "",
						minute_=timeObj.minute ? timeObj.minute + L.minute : "";
						second_=timeObj.second ? timeObj.second + L.second : "";
					if(timeObj.day>0 || timeObj.hour>0){
						var onlineTimeStr =day_+ hour_+minute_;
					}else{
						var onlineTimeStr =hour_+minute_+second_;
					}
					if(data[i]["apname"]){
						var apname=cutString(data[i]["apname"],20);
					}else{
						var apname=name_mac(data[i]["mac"]);
					}
					
					
					if(data[i]["verison"]){
						
					if(data[i]["is_ac"]==1){
						tempObj.row1 = '<div class="name-section"><span class="titleName" data-mac="'+data[i]["mac"]+'" title="' + data[i]["apname"] + '">' + apname + '</span><div class="currently_AC">'+appJs["copywriting"][3]+'</div></div>';	
					}else{
						tempObj.row1 = '<div class="name-section"><span class="titleName" data-mac="'+data[i]["mac"]+'" title="' + data[i]["apname"] + '">' + apname + '</span></div>';	
					}

					tempObj.online=data[i]["verison"]? appJs["f-label"][3] : appJs["f-label"][4];
					
					tempObj.model =data[i]["model"];
					tempObj.verison =data[i]["verison"] ? data[i]["verison"] : "-";
					
					 tempObj.row2 = '<div class="ip-section" data-mac="'+data[i]["mac"]+'"><span class="txt">' + data[i]["ip"] + '</span></div><div class="mac-section"><span class="txt">' + data[i]["mac"] + "</span></div>";
					
					// tempObj.custom=data[i]["custom"]? L.copywriting : L.copywriting_no;
					
					onlineTimeStr =onlineTimeStr ? onlineTimeStr : "-";
					tempObj.time='<span time="'+data[i].seconds+'">'+onlineTimeStr+'</span>'
					
					var lg=(data[i]["wifi_5g"]*1)+(data[i]["wifi_24g"]*1)+(data[i]["wire"]*1);
						if(lg==null){
							lg="-";
						}
					tempObj.ber ='<span class="number_devices" data-ip="'+ data[i]["ip"]+'" data-name="' + apname + '" data-mac="'+ data[i]["mac"]+'">'+lg +'</span>';
					if(data[i]["blink"]==0){
						tempObj.op = '<button type="button" class="modify smaller" data-led_blink='+ data[i]["blink"] +' data-mac='+ data[i]["mac"] +'>'+ appJs["f-label"][0] +'</button>';
								
					}else{
						tempObj.op = '<button type="button" class="modify smaller" data-led_blink='+ data[i]["blink"] +' data-mac='+ data[i]["mac"] +'>'+ appJs["f-label"][7] +'</button>';
							
					}
					if(data[i]["custom"]==1){
						tempObj.op = tempObj.op +'<button type="button" class=" smaller smaller3" style="background: var(--blue-12);" data-name='+ apname+' data-model='+ data[i]["model"]+' data-ip='+ data[i]["ip"]+' data-mac='+ data[i]["mac"] +'>'+ appJs["f-label"][2] +'</button>';	
					}else{
						tempObj.op = tempObj.op +'<button type="button" class=" smaller smaller3" style="background: var(--prompt-text);" data-name='+ apname+' data-model='+ data[i]["model"]+' data-ip='+ data[i]["ip"]+' data-mac='+ data[i]["mac"] +'>'+ appJs["f-label"][2] +'</button>';	
					}
					
					}else{
						tempObj.row1 = '<div class="name-section"><span class="no_titleName" data-mac="'+data[i]["mac"]+'" title="' + apname + '">' + apname + '</span></div>';
						tempObj.online=data[i]["verison"]? appJs["f-label"][3] : appJs["f-label"][4];
						tempObj.model =data[i]["model"];
						tempObj.verison =data[i]["verison"] ? data[i]["verison"] : "-";
						 tempObj.row2 = '<div  data-mac="'+data[i]["mac"]+'"><span class="txt">' + data[i]["ip"] + '</span></div><div class="mac-section"><span class="txt">' + data[i]["mac"] + "</span></div>";
						// tempObj.custom=data[i]["custom"]? L.copywriting : L.copywriting_no;
						tempObj.time =onlineTimeStr ? onlineTimeStr : "-";
						tempObj.ber ="-";
						tempObj.op = '<a data-model="'+data[i]["model"]+'" data-ip="'+ data[i]["ip"] +'" data-mac="'+ data[i]["mac"] +'" title="'+ L.s_delete +'" class="smaller darkgray" href="javascript:void(0);">'+ L.s_delete +'</a>';
						
					}
					
					new_data.push(tempObj);
				}

			me.ac_ap_table = new top.Table("ac_ap_online_table",appJs.ac_ap_online_table,new_data,{
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
							
							var a1=a.ber.slice(a.ber.indexOf(">")+1,a.ber.indexOf("</span>"));
							var b1=b.ber.slice(b.ber.indexOf(">")+1,b.ber.indexOf("</span>"));
							// console.log(a)
						return  parseInt(a1,10)-parseInt(b1,10);
						}
					},
					"",
				  ],
          info:L.item_null
      });
			var searchStr=$('#ac_ap_search_input').val();
			if (!!searchStr){
				me.ac_ap_table.onSearch(searchStr,false);
			}else {
				me.ac_ap_table.initTable();
			}
			
			
		},
		//ac	离线表格
		init_ac_ap_offline_list:function(){
			var me = this;
			var data = me.ac_ap_offline_data.ap;
			
			if(data.length==0){
				$(".ac_ap_offline_table").addClass("off");
				return;
			}else{
				$(".ac_ap_offline_table").removeClass("off");
			}
			console.log(data)
			var new_data = [];

				for(var i in data){
					var tempObj = {};
					tempObj.model = data[i]["model"];
					
				
					tempObj.online=appJs["f-label"][4];
					 tempObj.row2 = '<div class="mac-section"><span>MAC:</span><span class="txt">' + data[i]["mac"] + "</span></div>";
					
					tempObj.ob = '-';
					
					
					new_data.push(tempObj);
				}
		
			var tab = new Table("ac_ap_offline_table",appJs.ac_ap_offline_table,new_data);
			tab.initTable();
	},
	
	//ap 列表
	init_ap_online_list:function(){
			var me = this;
			var data = me.ap_online_data.hosts;
			var page=page_id("ap_online_table");
			$(".ac_ap_div").addClass("off");
			$(".ap_online_table").removeClass("off");
			
			var new_data = [];
				
						var ap_24g=0,
						ap_5g=0,
						ap_limited=0;
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
						if(data[i]["rssi2"]<-100){
							tempObj.rssi=data[i]["rssi0"]+","+data[i]["rssi1"];
						}else{
							tempObj.rssi=data[i]["rssi0"]+","+data[i]["rssi1"]+","+data[i]["rssi2"]+","+data[i]["rssi3"];
						}
					}
					console.log(data[i]["speed_up"],data[i]["speed_down"]);
					
					 tempObj.row2 = '<div class="ip-section "><span>IP:</span><span class="txt">' + data[i]["ip"] + '</span></div><div class="mac-section"><span>MAC:</span><span class="txt">' + data[i]["mac"] + "</span></div>";
					tempObj.row3 = '<div class="ip-section "><span class="txt">'+ appJs.uplink_speed +'：' + data[i]["speed_up"] + 'KB/s</span></div><div class="mac-section"><span class="txt">'+ appJs.downlink_speed +'：' + data[i]["speed_down"] + "KB/s</span></div>"; 
					tempObj.name=$("#ap_mac_hidde").attr("data-name");
					tempObj.ip=$("#ap_mac_hidde").attr("data-ip");
					new_data.push(tempObj);
				}
			
			var tab = new Table("ap_online_table",appJs.ap_online_table,new_data,{
				size: 20,
				showTotalPageNum:true,
				showTotalDataNum:true,
				 index:page,
				showHomeAndEnd:true,
			});
			tab.initTable();
//			console.log(ap_24g,ap_5g,ap_limited)
			$("#ap_24g").html(ap_24g);
			$("#ap_5g").html(ap_5g);
			$("#ap_limited").html(ap_limited);
			
	},
	//没获取用户名时,用AP-加mac地址后6位拼接当用户名
	name_mac_no:function(mac){
	var name="";
//	check_mac()
	mac=mac.toUpperCase();
	var n=mac.split(":");
	return name+n[3]+n[4]+n[5];
},
	//未组网ap
	init_ap_unnetworked_list:function(){
			var me = this;
			var data = me.ac_ap_unnetworked_data;
			var new_data = [];

				for(var i in data){
					var tempObj = {};
					var timeObj = convert_time(data[i].seconds);
					var day_=timeObj.day ? timeObj.day + L.day : "",
						hour_=timeObj.hour ? timeObj.hour + L.hour : "",
						minute_=timeObj.minute ? timeObj.minute + L.minute : "";
						second_=timeObj.second ? timeObj.second + L.second : "";
					if(timeObj.day>0 || timeObj.hour>0){
						var onlineTimeStr =day_+ hour_+minute_;
					}else{
						var onlineTimeStr =hour_+minute_+second_;
					}
					tempObj.connect = '<input type="checkbox" name="checkboxShall" mac="'+ data[i]["mac"] +'" idx="'+i+'" value="0" class="checkboxShall">';
					
//					tempObj.apname = data[i]["apname"] ? data[i]["apname"] : name_mac(data[i]["mac"]);
					var apname= data[i]["apname"] ? cutString(data[i]["apname"],15) : name_mac(data[i]["mac"]);
					tempObj.apname = '<span title="'+data[i]["apname"]+'">'+apname+'</span>';
					tempObj.model = data[i]["model"];
					tempObj.ip = data[i]["ip"];
					tempObj.mac = data[i]["mac"];
					tempObj.time =onlineTimeStr ? onlineTimeStr : "-";
					
					new_data.push(tempObj);
				}
			
			var tab = new Table("unnetworked_table",appJs.ac_ap_unnetworked_table,new_data,{
				size: 20,
				showTotalPageNum:true,
				showTotalDataNum:true,
				showHomeAndEnd:true,
			});
			tab.initTable();
			
	},
//	其他ac
	init_ac_aclist_list:function(){
		var me = this;
		var data = me.ac_aclist_data.acs;
		console.log(data)
		var new_data = [];
			for(var i in data){
					var tempObj = {};
					var timeObj = convert_time(data[i].seconds);
					
//					tempObj.apname = data[i]["apname"] ? data[i]["apname"] : "-";
					tempObj.model = data[i]["model"];
					var verison= data[i]["verison"] ? data[i]["verison"] : "-";
					tempObj.verison = '<span title="'+data[i]["verison"]+'">'+verison+'</span>';
					
					tempObj.ip = '<a href="http://'+data[i]["ip"]+'" class="ip-section" target="_blank">'+data[i]["ip"]+'</a>';
					tempObj.mac = data[i]["mac"];
					
					tempObj.op = '<button type="button" data-ip="'+ data[i]["ip"] +'" data-mac="'+ data[i]["mac"] +'" class="modify smaller" >'+ appJs["f-label"][8] +'</button>';
					// tempObj.op = '<a href="http://'+data[i]["ip"]+'" target="_blank"><button type="button" class="smaller btn-jump">'+language[language_type]["BUTTON"]["btn-jump"]+'</button></a>';
					
					
					
					new_data.push(tempObj);
				}
			
			var tab = new Table("unnetworked_ac_table",appJs.ac_unnetworked_table,new_data,{
				size: 20,
				showTotalPageNum:true,
				showTotalDataNum:true,
				showHomeAndEnd:true,
			});
			tab.initTable();
	},
	empty:function(){
		var me = this;
		
		$("#wifi_name_select").val("");
		$("#wifi_encryption").val("NONE");
		$("#wireless_key_layer").addClass("off");
		$("#frequency_band").val("5G+2G");
		$("#wireless_interval,#wifi_enable").val("1");
		$("#wireless_interval,#wifi_enable").siblings(".enable_click").addClass("f-switchTrue")
		$("#time_interval").val("0");
		$("#time_interval_div").removeClass("off");
		$("#start_hour,#start_minute").val(0);
		$("#end_hour").val("23");
		$("#end_min").val("59");
		$(".weekSlot span").addClass("active").attr("value",1);
		$(".weekSlotVal").val("1111111");
		$("#vlan_id").val(0);
		$("#idx_id").val("");
		$("#wireless_interval").val(0);
				
		checkbox_enable("wireless_interval",0);
		this.get_wifi_management_data();
		
	},
	//计算选中的数量
	 checkbox_length_fun:function(){
		// 选中不能为空
		var checkbox_length = new Array();
		var items = $(".TabBody .checkboxShall");
		for (i = 0; i < items.length; i++) {
			if (items.eq(i).val()==1) {
				checkbox_length.push($(".TabBody .checkboxShall").eq(i).attr("mac"));
				}
			}
	//console.log("选择的个数为：" + checkbox_length.length,checkbox_length)
		return checkbox_length;
	
	},
	wifi_enable_show:function(){
		var eb=$("#wifi_enable_dhcp").val();
		if(eb==1){
			$("#wifi_enable_show").hide();
		}else{
			$("#wifi_enable_show").show();
		
		}
	},
	thisData_f:function(data,mac){
		var me = this;
		for(var i=0;i<data.length;i++){
			if(data[i]["mac"]==mac){
				var newData=data[i];
			}
		}
		return newData;
	},
	ac_wifi_adv_cfg_get_data:function(){//无线高级设置获取接口
		var me = this;
		$.when(management.get_data("ac_wifi_adv_cfg_get",{"idx":"0","mac":$("#ap_wifi_mac_hidde").attr("data-mac")}),management.get_data("ac_wifi_adv_cfg_get",{"idx":"1","mac":$("#ap_wifi_mac_hidde").attr("data-mac")})).then(function(){
			me.ac_advanced_wifi_list();
		});
	},
	ac_advanced_wifi_list:function(){
		var me = this;
		var data_2g = me.ac_wifi_adv_cfg_data_2g,
			data_5g = me.ac_wifi_adv_cfg_data_5g;
			$("#BeaconPeriod").val(data_2g.BeaconPeriod);
			$("#hT_GI").val(data_2g["HT_GI"]);
			$("#RTSThreshold").val(data_2g.RTSThreshold);
			$("#WirelessMode_24").val(data_2g.WirelessMode);
			$("#WirelessMode_5").val(data_5g.WirelessMode);
			$("#assoc_24g").val(data_2g.KickStaRssiLow);
			$("#assoc_5g").val(data_5g.KickStaRssiLow);
			$("#disassoc_24g").val(data_2g.AssocReqRssiThres);
			$("#disassoc_5g").val(data_5g.AssocReqRssiThres);
			$("#Wireless_area").val(data_2g.CountryRegion);
			$("#maxStaNum_24").val(data_2g.MaxStaNum);
			$("#maxStaNum_5").val(data_5g.MaxStaNum);
			
			console.log(data_2g,data_5g)
	},
	get_wifi_management_data:function(){
		var me = this;
		$.when(management.get_data("ac_wifi_cfg_get",{"mac":$("#ap_wifi_mac_hidde").attr("data-mac")})).then(function(){
			me.init_wifi_list();
		});
	},

		//	wif表格
		init_wifi_list:function(){
			var me = this;
			var data = me.ac_wifi_list_data;
			$(".ac_ap_div").addClass("off");
			$(".wireless_settings").removeClass("off");
//			console.log(me.ac_wifi_list_data)
			var new_data = [];
			var thisidx=[];
			for(var i=0;i<4;i++){
				if(data["idx"+i]["Enable"]==""){
					thisidx=i;
				}	
			}
			if(thisidx.length==0){
				$("#wireless_settings_add").attr("disabled","disabled");
			}else{
				$("#wireless_settings_add").removeAttr("disabled");
			}
				for(var i in data){
					if(data[i]["idx"]!="" && data[i]["Enable"]!=""){
						var tempObj = {};
						var apname= data[i]["SSID"] ? cutString(data[i]["SSID"],15) : "-";
						tempObj["SSID"] = '<span title="'+data[i]["SSID"]+'">'+apname+'</span>';
//						tempObj["SSID"] =' <span title="">"'+data[i]["SSID"]? data[i]["SSID"] : "-"+'"</span>';
						if(data[i]["AuthMode"]=="OPEN"){
							tempObj.AuthMode = appJs["copywriting"][0];
						}else{
							tempObj.AuthMode = data[i]["Passwd"];
						}
						if(data[i]["Enable"]==0){
							tempObj.Enable =appJs["f-wifi-label"][1];
						}else{
							tempObj.Enable =appJs["f-wifi-label"][0];
						}
						
						tempObj.VlanId = data[i]["VlanId"]? data[i]["VlanId"] : "-";
						
						if(!!data[i]["section"]){
							if(data[i]["section"]=="2G"){
								tempObj.section = "2.4G";
							}else if(data[i]["section"]=="2G+5G"){
								tempObj.section = "2.4G+5G";
							}else{
								tempObj.section =data[i]["section"]
							}
						}else{
							tempObj.section ="-"
						}
				        if(data[i]["idx"]==0){
							 tempObj.op='<a data-idx="'+data[i]["idx"]+'" title="'+ appJs["f-wifi-label"][2] +'" class="op edit" href="javascript:void(0);">'+ appJs["f-wifi-label"][2] +'</a>';
				        	
	      
						}else{
							 tempObj.op='<a data-idx="'+data[i]["idx"]+'" title="'+ appJs["f-wifi-label"][2] +'" class="op edit" href="javascript:void(0);">'+ appJs["f-wifi-label"][2] +'</a>'
				        	+'<a data-idx="'+data[i]["idx"]+'"  title="'+ appJs["f-wifi-label"][3] +'" class="op delete" href="javascript:void(0);">'+ appJs["f-wifi-label"][3] +'</a>';
	      
						}
						new_data.push(tempObj);
					}
				}
		
			var tab = new Table("wifi_management_table",appJs.table_title,new_data,{
				size: 20,
				showTotalPageNum:true,
				showTotalDataNum:true,
				showHomeAndEnd:true,
			});
			tab.initTable();
		},

	//表格修改
	edit_tb:function(idx){
		var me = this;
		var newData= me.thisData_f(me.ac_wifi_list_data,idx);
		if(newData.Enable==""){
			$("#wifi_enable").val(1);
			$("#wifi_enable").siblings(".enable_click").addClass("f-switchTrue");
			$("#frequency_band").val("2G+5G");
			return;
		}
		$("#wifi_management_modal").modal();
		if(newData.Enable==""){
			$("#wifi_enable").val(1);
			checkbox_enable("wifi_enable",1);
		}else{
			$("#wifi_enable").val(newData.Enable);
			checkbox_enable("wifi_enable",newData.Enable);
		}
		$("#wifi_name_select").val(newData.SSID);
		$("#hide_Network_Name").val(newData.HideSSID);
		$("#wireless_interval").val(newData.NoForwarding);
		checkbox_enable("wifi_enable",newData.Enable);
		checkbox_enable("wireless_interval",newData.NoForwarding);
		checkbox_enable("hide_Network_Name",newData.HideSSID);
		$("#wifi_encryption").get(0).selectedIndex = EncrypType_fu(newData.AuthMode); 

		if(newData.EncrypType=="NONE"){
			$("#wifi_key").val("");//密码
			$("#wireless_key_layer").addClass("off");
		}else{
			$("#wifi_key").val(newData.Passwd);//密码
			$("#wireless_key_layer").removeClass("off");
		}
		$("#frequency_band").val(newData.section?newData.section:"5G+2G");
		$("#vlan_id").val(newData.VlanId);
		
		
	},
	edit_tb_time:function(data){
		var me = this;
//		console.log(me.ac_wifi_time_data);
		$("#start_hour").val(me.ac_wifi_time_data.start_hour);
		$("#start_minute").val(me.ac_wifi_time_data.start_min);
		$("#end_hour").val(me.ac_wifi_time_data.end_hour);
		$("#end_min").val(me.ac_wifi_time_data.end_min);
		$("#time_interval_div").addClass("off");
		if(data==undefined){
			
			$("#time_interval_div").addClass("off");
			return;
		}
		$("#time_interval").val(me.ac_wifi_time_data.type);
		if(me.ac_wifi_time_data.type==3){
			$("#time_interval_div").removeClass("off");
			
		}
		
		
		
		var day_d=dec_two_bin(me.ac_wifi_time_data.day_flags);
		day_d=reverseNumber(day_d);
		$(".weekSlotVal").val(day_d);
		for(var i=0;i<7;i++){
			if(day_d[i]==0){
				$(".weekSlot span").eq(i).removeClass("active").attr("value",0);
			}else if(day_d[i]==1){
				$(".weekSlot span").eq(i).addClass("active").attr("value",1);
			}
		}
	},
	delete_tb:function(data){
		console.log(data)
		$("#delModal .modal-title").html(language[language_type]["DIALOG"]["delete-single"].title);
		var $p = $("<p/>").attr("class","single-tip").html(language[language_type]["DIALOG"]["delete-single"].content);
		
		$("#delModal .modal-body").html($p);
		$("#delModal .modal-footer .btn-confirm").off("click").on("click",function(){
			$("#delModal").modal("hide");
			management.get_data("ac_wifi_cfg_del",data)
		});
			$("#delModal").modal();
	},
	thisData_f:function(data,idx){
		var me = this;
		for(var i in data){
			if(data[i]["idx"]==idx){
				var newData=data[i];
			}
		}
		return newData;
	},
	initDelAllDialog:function(type){
		var me = this;
		me.delAll_D = new Dialog({
			id:"del-all-dialog",
			title:language[language_type]["DIALOG"]["delete-all"].title,
			content:"<p class=\"single-tip\">"+ language[language_type]["DIALOG"]["delete-all"].content +"</p>",
			buttons: [{
					action:function(){
							me.offline_AP=true;
							$.when(management.get_data("ac_ap_offline_del",{})).then(function(data){
								show_message("success");
								me.delAll_D.hide();
								me.get_ap_manage_data();
							});
					}
				},{}]
		});
	},
	add_event:function(){
		var me = this;
		
		$("body").undelegate(".TabBody input.checkboxShall","click").delegate(".TabBody input.checkboxShall","click",function(){
				var index = $(this).val();
				if($(this).hasClass("checkedCurrent")){
					$(this).val(0).removeClass("checkedCurrent");
				}else{
					$(this).val(1).addClass("checkedCurrent");
				}	
				
				var  checkboxShall_all=$(".TabBody input.checkboxShall").length;
				// if(checkboxShall_all==me.checkbox_length_fun().length){
				// 	$(".checkboxShall").eq(0).val(1).addClass("checkedCurrent");
				// }
				// if(me.checkbox_length_fun().length==0){
				// 	$(".checkboxShall").eq(0).val(0).removeClass("checkedCurrent");
				// }
			});
			//			全选
			$("body").undelegate("#unnetworked_modal #select_All","click").delegate("#unnetworked_modal #select_All","click",function(){
				var index = $(this).val();
				
				if($(this).hasClass("checkedCurrent")){
					$(this).removeClass("checkedCurrent");
					$(".TabBody .checkboxShall").val(0).removeClass("checkedCurrent");
				}else{
					$(this).addClass("checkedCurrent");
					$(".TabBody .checkboxShall").val(1).addClass("checkedCurrent");	
				}	
			});
			//加入网络
			$("body").undelegate("#join_network_button","click").delegate("#join_network_button","click",function(){
				

				me.led_data=[];
				var select_checkbox=me.checkbox_length_fun();
				var setData={}
				if(select_checkbox.length==0 && !$("#select_All").prop("checked")){
					show_message("error",L.check_one);
					return false;
				}
				me.led_data=select_checkbox;
				if(!$("#select_All").prop("checked")){
					setData["mac"]=encrypt_mac(me.led_data);
				}
				
				
				console.log(me.led_data,encrypt_mac(me.led_data));
				$.when(management.get_data("ac_ap_trust",setData)).then(function(){
						$("#unnetworked_modal").modal("hide");
				});
				
				
			});
			//未组网显示列表
			$("body").undelegate("#unnetworked_div","click").delegate("#unnetworked_div","click",function(){
				$("#unnetworked_modal").modal();
				me.init_ap_unnetworked_list();
			});
			//其他显示列表
			$("body").undelegate("#unnetworked_ac_div","click").delegate("#unnetworked_ac_div","click",function(){
				$("#unnetworked_ac_modal").modal();
				me.init_ac_aclist_list();
			});
			//合并组网
			$("body").undelegate("#unnetworked_ac_modal .modify","click").delegate("#unnetworked_ac_modal .modify","click",function(){
				var index = $(this).attr("data-ip");
				
				$("#ap_id_href").html(index);
				$("#unnetworked_ac_modal_confirm").modal();
				$("#unnetworked_ac_modal_mac").val($(this).attr("data-mac"));
			});	
			//合并组网二次确认
			$("body").undelegate("#unnetworked_ac_modal_confirm .btn-confirm","click").delegate("#unnetworked_ac_modal_confirm .btn-confirm","click",function(){
				$.when(management.get_data("ap_imcmd",{"cmd":"reset"})).then(function(){
							window.location.href= "http://"+$("#ap_id_href").html();
				});
			});	
			
			$("body").undelegate("#ac_ap_online_table .number_devices","click").delegate("#ac_ap_online_table .number_devices","click",function(){
				var index = $(this).attr("data-mac");
				show_message("save",appJs["f-label"][5]);
				// setTimeout(function(){
						show_message("success",appJs["f-label"][6]);
				// },500);
				me.init_ap_online_list();
				window.clearInterval(me.ap_online_data_setTimeout);
				me.ap_online_data_setTimeout=window.setInterval(function(){
						$.when(management.get_data("ap_online_get",{"mac":index})).then(function(){
							me.init_ap_online_list();
						});
				},me.timer);
				
				console.log($(this))
				
				$("#ap_mac_hidde").attr({"data-mac":index,"data-name":$(this).attr("data-name"),"data-ip":$(this).attr("data-ip")});
				window.clearInterval(me.ac_ap_online_setTimeout);
			});
			$("body").undelegate("#ac_ap_online_table button.modify","click").delegate("#ac_ap_online_table button.modify","click",function(){
				
				var setData={"mac": $(this).attr("data-mac")}
					if($(this).attr("data-led_blink")==0){
						setData["cmd"]="led_blink_on";
					}else{
						setData["cmd"]="led_blink_off";
					}
				show_message("save",appJs["positioning"]);
				management.get_data("led_blink",setData)
			});
			//删除离线APP
			$("body").undelegate("#delete_offline","click").delegate("#delete_offline","click",function(){
				
				me.delAll_D.show();
				
			});
			//修改ip地址
			$("body").undelegate("#ac_ap_online_table .ip-section","click").delegate("#ac_ap_online_table .ip-section","click",function(){
					// if(!!router.rid && !!router.phoneId){
					// 	return;
					// }
				$("#edit_dhcp_Modal").modal();
				me.ac_dhcp_mac=$(this).attr("data-mac");
				
				
				$.when(management.get_data("ac_apip_get",{"mac":me.ac_dhcp_mac,"cmd":"apip_get","need_reply":1})).then(function(data){
						console.log(me.ac_dhcp_mac,data);
						if(data["result"][1]["proto"]=="static"){
							$("#wifi_enable_dhcp").val(0);
							$("#wifi_enable_dhcp").siblings(".enable_click").removeClass("f-switchTrue");
						}else{
							$("#wifi_enable_dhcp").val(1);
							$("#wifi_enable_dhcp").siblings(".enable_click").addClass("f-switchTrue");
						}
						me.wifi_enable_show();
						$("#ac_ip").val(data["result"][1]["ipaddr"]);
						$("#ac_mask").val(data["result"][1]["netmask"]);
						$("#ac_gw").val(data["result"][1]["gateway"]);
						$("#ac_dns").val(data["result"][1]["dns"]);
				});
			});
			$("body").undelegate("#edit_dhcp_frm button.btn-confirm","click").delegate("#edit_dhcp_frm button.btn-confirm","click",function(){
				var obj={};
				if($("#wifi_enable_dhcp").val()==1){
						obj["proto"]="dhcp";
				}else{
					obj["proto"]="static";
					if(!check_input("apc_ac_dhcp_frm")){
						return;
					}
				}
					obj["ipaddr"]=$("#ac_ip").val();
					obj["netmask"]=$("#ac_mask").val();
					obj["gateway"]=$("#ac_gw").val();
					obj["dns"]=$("#ac_dns").val();
					obj["mac"]=me.ac_dhcp_mac;
				
				$.when(management.get_data("ac_apip_set",obj)).then(function(data){
						$("#edit_dhcp_Modal").modal("hide");	
					});
			});
			//个性化
			$("body").undelegate("#ac_ap_online_table button.smaller3","click").delegate("#ac_ap_online_table button.smaller3","click",function(){
					$("#ap_wifi_name").html($(this).attr("data-name"));
					$("#ap_wifi_model").html($(this).attr("data-model"));
					$("#ap_wifi_ip").html($(this).attr("data-ip"));
					var setData={"mac": $(this).attr("data-mac")}
						window.clearInterval(me.ac_ap_online_setTimeout);
						$.when(management.get_data("ac_wifi_cfg_get",setData)).then(function(){
							me.init_wifi_list();
						});
					$("#ap_wifi_mac_hidde").attr("data-mac",$(this).attr("data-mac"))
					$("#wifiAddModal").modal();
			});
			//取消
			$("body").undelegate("#wifi_management_settings #wireless_settings_cancel","click").delegate("#wifi_management_settings #wireless_settings_cancel","click",function(){
					$(".ac_ap_div").addClass("off");
					$(".ac_ap_online_table").removeClass("off");
					// me.ac_ap_online_setTimeout=window.setInterval(function(){
						me.get_ap_manage_data();
					// },me.timer);
			});
			//取消
			$("body").undelegate(".ap_online_table .btn-cancel","click").delegate(".ap_online_table .btn-cancel","click",function(){
					$(".ac_ap_div").addClass("off");
					$(".ac_ap_online_table").removeClass("off");
					window.clearInterval(me.ap_online_data_setTimeout);
					// me.ac_ap_online_setTimeout=window.setInterval(function(){
						me.get_ap_manage_data();
					// },me.timer);
			});
			//同步无线弹窗
			$("body").undelegate("#synchronous_wireless_btn","click").delegate("#synchronous_wireless_btn","click",function(){
				$("#synchronous_wireless").modal();
			});
			//同步无线确定
			$("body").undelegate("#synchronous_wireless .btn-confirm","click").delegate("#synchronous_wireless .btn-confirm","click",function(){
				var setData={"mac":$("#ap_wifi_mac_hidde").attr("data-mac")}
				$.when(management.get_data("ac_wifi_default",setData)).then(function(){
					
				});
			});
			//修改名称弹窗显示
			$("body").undelegate(".name-section .titleName","click").delegate(".name-section .titleName","click",function(){
				
				console.log($(this).html())
				$("#edit_name_Modal").modal();
				$("#equipment_name").val($(this).attr("title")).attr("data-mac",$(this).attr("data-mac"));	
			});
			
			$("body").undelegate("#edit_name_frm button.btn-confirm","click").delegate("#edit_name_frm button.btn-confirm","click",function(){
				console.log(me.ac_dhcp_mac);
				var obj = {};
				
				obj.apname = $("#equipment_name").val();
				obj.mac=$("#equipment_name").attr("data-mac");
					
					
					
				if(check_input("i_equipment_name_frm")){
					me.get_data("ac_apname_set",obj);
					$("#edit_name_Modal").modal("hide");
				}
			});
			
			
			//无线设置修改
		$("body").undelegate("#wifi_management_table .edit","click").delegate("#wifi_management_table .edit","click",function(){
				$("#idx_id").val($(this).attr("data-idx"));
				var setData={"idx": $(this).attr("data-idx"),"mac":$("#ap_wifi_mac_hidde").attr("data-mac")}
				$.when(management.get_data("ac_wifi_time_get",setData)).then(function(){
						management.edit_tb($("#idx_id").val());
						management.edit_tb_time(me.ac_wifi_time_data);
				});
//				$("#time_interval").val(1)
//				management.get_data("led_blink",setData)
		});
//		删除
		$("body").undelegate("#wifi_management_table .delete","click").delegate("#wifi_management_table .delete","click",function(){
				
				var setData={"idx": $(this).attr("data-idx"),"mac":$("#ap_wifi_mac_hidde").attr("data-mac")}
				me.delete_tb(setData);
				
		});

//		时段显示
		$("body").undelegate("#wifi_management_modal #time_interval","change").delegate("#wifi_management_modal #time_interval","change",function(){
//			console.log($(this).val())
			if($(this).val()==3){
				$("#time_interval_div").removeClass("off");
				$("#start_hour").val(0);
				$("#start_minute").val(0);
				$("#end_hour").val(23);
				$("#end_min").val(59);
				$(".weekSlotVal").val("1111111");
				var day_d="1111111";
				for(var i=0;i<7;i++){
					if(day_d[i]==0){
						$(".weekSlot span").eq(i).removeClass("active").attr("value",0);
					}else if(day_d[i]==1){
						$(".weekSlot span").eq(i).addClass("active").attr("value",1);
					}
				}
				
			}else{
				$("#time_interval_div").addClass("off");
			}
		});
		//密码显示
		$("body").undelegate("#wifi_management_modal #wifi_encryption","change").delegate("#wifi_management_modal #wifi_encryption","change",function(){
//			console.log($(this).val())
			if($(this).val()!="NONE"){
				$("#wireless_key_layer").removeClass("off");
			}else{
				$("#wireless_key_layer").addClass("off");
			}
		});
		$("body").undelegate("#wifi_management_modal button.btn-confirm","click").delegate("#wifi_management_modal button.btn-confirm","click",function(){
			var setData={};
			if(check_input("wireless_settings_ssid_frm")){
				setData["idx"]=$("#idx_id").val();
				setData["Enable"]=$("#wifi_enable").val();
				setData["SSID"]=$("#wifi_name_select").val();
				setData["EncrypType"]=$("#wifi_encryption").val();
				 setData["AuthMode"]=authMode_fu($("#wifi_encryption").prop('selectedIndex'));
				
				setData["section"]=$("#frequency_band").val();
				setData["NoForwarding"]=$("#wireless_interval").val();
				setData["HideSSID"]=$("#hide_Network_Name").val();
				setData["VlanId"]=$("#vlan_id").val();
				setData["Passwd"]=$("#wifi_key").val();
				var isCount=check_between_the_two(setData["VlanId"],0,4094);
					if(isCount!=true || setData["VlanId"]==1 || setData["VlanId"]==2){
						show_differ_tip("vlan_id",isCount);
						return false;
					}
	
				if(setData["EncrypType"]!="NONE"){
					if(!check_input("wireless_settings_password_frm")){
						return;
					}
				}
				
				//时间段
				var setTime={};
				setTime["idx"]=$("#idx_id").val();
				setTime["type"]=$("#time_interval").val() * 1;
				setTime["start_hour"]=$("#start_hour").val() * 1;
				setTime["start_min"]=$("#start_minute").val() * 1;
				setTime["end_hour"]=$("#end_hour").val() * 1;
				setTime["end_min"]=$("#end_min").val() * 1;
				setTime["day_flags"]=reverseNumber($(".weekSlotVal").val());
				setTime["day_flags"]=toDecimal(setTime.day_flags);
				if(setTime["type"]==3){
					
					if(setTime.start_hour== setTime.end_hour && setTime.start_min>=setTime.end_min || setTime.start_hour> setTime.end_hour ){
						show_differ_tip("start_hour",L.time_cannot);
						return;
					}
					if(setTime.start_hour  > setTime.end_hour){
						show_differ_tip($("#end_hour"),L.endLtStart);
						
						return false;
					}
					else if((setTime.start_hour == setTime.end_hour) && (setTime.start_min  > setTime.end_min)){
						show_differ_tip($("#end_hour"),L.endLtStart);
						
						return false;
					}
				}
				setData["mac"]=setTime["mac"]=$("#ap_wifi_mac_hidde").attr("data-mac");
				show_message("save");
				management.get_data("ac_wifi_cfg_set",setData);
				management.get_data("ac_wifi_time_set",setTime);
				$("#wifi_management_modal").modal("hide");
				
			}
		
			
		});
		//新增
		$("body").undelegate("#wireless_settings_add","click").delegate("#wireless_settings_add","click",function(){
			$("#wifi_management_modal").modal();
			me.empty();
			var thisidx=[];
			var data=me.ac_wifi_list_data;
			for(var i=0;i<4;i++){
				if(data["idx"+i]["Enable"]==""){
					thisidx=i;
					break;
				}	
			}
			console.log(thisidx)
			$("#idx_id").val(thisidx);
			var setData={"idx": String(thisidx),"mac":$("#ap_wifi_mac_hidde").attr("data-mac")}
			
			$.when(management.get_data("ac_wifi_time_get",setData)).then(function(){
						management.edit_tb(thisidx);
						management.edit_tb_time();
						// $("#time_interval").val(1);
						// $("#time_interval_div").addClass("off");
				});

		});	
		//高级设置保存
//		$("body").undelegate("#wifi_management_table .delete","click").delegate("#wifi_management_table .delete","click",function(){
		$("body").undelegate("#advanced_setting button.btn-save","click").delegate("#advanced_setting button.btn-save","click",function(){
			var setData_2g={},
				setData_5g={};
				setData_2g["BeaconPeriod"]=setData_5g["BeaconPeriod"]=$("#BeaconPeriod").val();
			var BeaconPeriod_prompt=check_between_the_two(setData_2g["BeaconPeriod"],25,1000);
					if(BeaconPeriod_prompt!=true){
						show_differ_tip("BeaconPeriod",BeaconPeriod_prompt);
						return;
					}
				setData_2g["idx"]="0";
				setData_5g["idx"]="1";
				setData_2g["mac"]=setData_5g["mac"]=$("#ap_wifi_mac_hidde").attr("data-mac")
				setData_2g["HT_GI"]=setData_5g["HT_GI"]=$("#hT_GI").val();
				setData_2g["RTSThreshold"]=setData_5g["RTSThreshold"]=$("#RTSThreshold").val();
				var RTSThreshold_prompt=check_between_the_two(setData_2g["RTSThreshold"],256,2347);
					if(RTSThreshold_prompt!=true){
						show_differ_tip("RTSThreshold",RTSThreshold_prompt);
						return;
					}
				setData_2g["WirelessMode"]=$("#WirelessMode_24").val();
				setData_5g["WirelessMode"]=$("#WirelessMode_5").val();
				setData_2g["MaxStaNum"]=$("#maxStaNum_24").val();
				setData_5g["MaxStaNum"]=$("#maxStaNum_5").val();
				setData_2g["KickStaRssiLow"]=$("#assoc_24g").val();
				setData_5g["KickStaRssiLow"]=$("#assoc_5g").val();
				setData_2g["AssocReqRssiThres"]=$("#disassoc_24g").val();
				setData_5g["AssocReqRssiThres"]=$("#disassoc_5g").val();
				setData_2g["CountryRegion"]=setData_5g["CountryRegion"]=$("#Wireless_area").val();
				
				if(check_input("apc_ac_advanced_setting_frm")){
					show_message("save");
					$.when(management.get_data("ac_wifi_adv_cfg_set",setData_2g),management.get_data("ac_wifi_adv_cfg_set",setData_5g)).then(function(){
						
					});
					
					
				}
				console.log(setData_2g,setData_5g)
		});	
			//		单个删除离线
			$("body").undelegate("#ac_ap_online_table .darkgray","click").delegate("#ac_ap_online_table .darkgray","click",function(){
				
				var setData={};
					setData["mac"]=$(this).attr("data-mac");
					setData["model"]=$(this).attr("data-model");
					
					$("#delModal .modal-title").html(language[language_type]["DIALOG"]["delete-single"].title);
					var $p = $("<p/>").attr("class","single-tip").html(language[language_type]["DIALOG"]["delete-single"].content);
					
					$("#delModal .modal-body").html($p);
					$("#delModal .modal-footer .btn-confirm").off("click").on("click",function(){
						$.when(management.get_data("ac_ap_offline_del",setData)).then(function(data){
							show_message("success");
							$("#delModal").modal("hide");
							me.get_ap_manage_data();
						});
					});
					$("#delModal").modal();
					
			});
			
			/*表格搜索*/
			$("body").undelegate("#ac_ap_search","click").delegate("#ac_ap_search","click",function(){
				if (!!me.ac_ap_table){
					var searchStr=$('#ac_ap_search_input').val();
					me.ac_ap_table.onSearch(searchStr);
				}
			});
			
			
		},
	init:function(){
		var me = this;
		me.get_ap_manage_data();
		// window.clearInterval(me.ac_ap_online_setTimeout);
		// me.ac_ap_online_setTimeout=window.setInterval(function(){
		// 	me.get_ap_manage_data();
		// },me.timer);
		me.get_ac_aclist_data();
		this.add_event();
		init_synchronous_wireless_dialog();
		me.initDelAllDialog();
	}
}

//处理同种加密方式时的显示
function EncrypType_fu(data){
	switch(data)
	{
	    case "OPEN":
	        return 0
	        break;
	    case "WPAPSKWPA2PSK":
	       return 1
	        break;
	   case "WPA2PSKWPA3PSK":
	        return 2
	        break;
	}
}
//加密方式和认证方式相关联,但认证方式页面不显示
function authMode_fu(data){
	switch(data)
	{
	    case 0:
	        return "OPEN"
	        break;
	    case 1:
	       return "WPAPSKWPA2PSK"
	        break;
	   case 2:
	        return "WPA2PSKWPA3PSK"
	        break;
	}

}
function init_synchronous_wireless_dialog(){
	$("#synchronous_wireless .modal-title").html(language[language_type]["DIALOG"]["synchronous_wireless"].title);
	var $p = $("<p/>").attr("class","single-tip").html(language[language_type]["DIALOG"]["synchronous_wireless"].content);
	$("#synchronous_wireless .modal-body").html($p);
	
}
// 状态转换数字排序
function status_sorting(d){
	if(d==appJs["f-label"][3]){
		return 0;
	}else if(d==appJs["f-label"][4]){
		return 1;
	}
} 

//mac排序
function mac_comparison(d){
	var t1=d.slice(d.lastIndexOf('txt">')+5,d.lastIndexOf("</span>"));
	// var t1=d.row2.split("span")
	console.log(t1);
	return t1;
}

// 时间排序
function compareTime(a1, b1) {
	if(a1=="" || b1==""){
		return -1;
	}
	return parseInt(a1,10)-parseInt(b1,10);
}


$(document).ready(function(){
		init_breadcrumbs();
	render_page();
	show_loading_page();
		lang.init(language[language_type]["PAGES"][current_html]);
		appJs = language[language_type]["PAGES"][current_html]["js"];

	$(".enable_click").on('click',function(){//1关闭  0打开
			$(this).toggleClass("f-switchTrue");	
				if($(this).hasClass("f-switchTrue")){
					$(this).siblings(".checkboxAll").attr("value","1");			
					$(this).siblings(".checkboxAll").removeAttr("checked");
					
				}else{
					$(this).siblings(".checkboxAll").attr("value","0");
					$(this).siblings(".checkboxAll").removeAttr("checked");
//					console.log("off关");
				}
				if($(this).siblings(".checkboxAll").attr("id")=="wifi_enable_dhcp"){
					management.wifi_enable_show();
				}
				
		})
	$(".weekSlot").on("click","span",function(){//选着日期点击事件
			$(this).toggleClass("active");
			var thisIndex=$(this).index();
			var weekSlotVal=$(".weekSlotVal").val();//获取数组			
			if($(".weekSlot span").eq(thisIndex).hasClass("active")){//判断是否有被选中的class的名称
				$(this).attr("span",1);
				weekSlotVal=changeStr(weekSlotVal,thisIndex,1)
			}else{
				$(this).attr("span",0);
				weekSlotVal=changeStr(weekSlotVal,thisIndex,0)
			}
			$(".weekSlotVal").val(weekSlotVal);
//			console.log(weekSlotVal);

		})
	$(".tab_area").on("click",".tab-item",function(){//tab标签切换
		var index = $(this).index();
		if(index==0){
			management.get_wifi_management_data();
	   }else{
	   		management.ac_wifi_adv_cfg_get_data();
	   }
		$(".tab_area .tab-item").removeClass("selection");
		$(this).addClass("selection");
		$(".wireless_settings .form-sec").addClass("off");
		$(".wireless_settings .form-sec").eq($(this).index()).removeClass("off");
		
	})
	$("#wireless_settings_add").html(appJs["copywriting"][1]);
	$("#synchronous_wireless_btn").html(appJs["copywriting"][2]);
	$(".ap_online_table .btn-cancel").html(L.s_return);
	
	management.init();
	$("#join_network_button").html(appJs["f-wifi-label"][4])
	new Password("wifi_key");
	$("#ac_ap_search_input").attr("placeholder",appJs.search_hint);
});
