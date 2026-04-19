var tableData = [];
current_html = "wifi_management";
var appJs = null;
var priority;
//wifi管理

var management={
	ac_wifi_list_data:{},//ac 在线列表
	ac_wifi_time_data:{},//时段数据
	ac_wifi_adv_cfg_data_2g:{},//wifi高级配置数据
	ac_wifi_adv_cfg_data_5g:{},
	get_data:function(type,setData){
		var me = this;
		var dfd = $.Deferred();
		var method = null;
		if(type == "ac_wifi_cfg_get"){
			method = "ac_wifi_cfg_get"; 
			setData={};	
		}else if(type == "ac_wifi_cfg_set"){
			method = "ac_wifi_cfg_set"; 
		}else if(type== "ac_wifi_time_get"){
			method = "ac_wifi_time_get"; 
		}else if(type== "ac_wifi_time_set"){
			method = "ac_wifi_time_set"; 
		}
		else if(type == "access_control_level"){
			method = "FwLevel_get";
		}else if(type == "ac_wifi_cfg_del"){
			method = "ac_wifi_cfg_del";
		}else if(type == "ac_wifi_adv_cfg_get"){
			method = "ac_wifi_adv_cfg_get";
		}else if(type == "ac_wifi_adv_cfg_set"){
			method = "ac_wifi_adv_cfg_set";
		}
		var timer_get={"jsonrpc": "2.0", "id":24, "method": "call", "params": [ localStorage.getItem('token_id'), "acap", method, setData ] }
		timer_get=JSON.stringify(timer_get);
		request({
			url:"/ubus",
			data:timer_get
		}).done(function(data){
			if(check_data(data)){	
				if(type == "ac_wifi_cfg_get"){
					me.ac_wifi_list_data = data.result[1];
					hide_loading_page();
					show_content();
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
						show_message("success",L.del_suc);
						me.get_wifi_management_data();
					}else{
						show_message("error",L.del_err);
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
				}
				
				dfd.resolve();
			}	
			else{
				if(type == "ac_wifi_cfg_set"){
					show_message("error",data["result"][0]);
				}else if(type == "ac_wifi_cfg_del"){
					show_message("error",data["result"][0]);
				}
				
			}
		}).fail(function(data){
			hide_loading_page();
				show_err_page();	
		})
		
		
		return dfd.promise();
	},
	empty:function(){
		var me = this;
		
		$("#wifi_name_select").val("");
		$("#wifi_encryption").val("NONE");
		$("#wireless_key_layer").addClass("off");
		$("#frequency_band").val("2G");
		$("#time_interval").val("0");
		$("#time_interval_div").removeClass("off");
		$("#start_hour,#start_minute").val(0);
		$("#end_hour").val("23");
		$("#end_min").val("59");
		$(".weekSlot span").addClass("active").attr("value",1);
		$(".weekSlotVal").val("1111111");
		$("#vlan_id").val(0);
		$("#idx_id").val("");
		this.get_wifi_management_data();
		
	},
	ac_wifi_adv_cfg_get_data:function(){//无线高级设置获取接口
		var me = this;
		$.when(management.get_data("ac_wifi_adv_cfg_get",{"idx":"0"}),management.get_data("ac_wifi_adv_cfg_get",{"idx":"1"})).then(function(){
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
		$.when(management.get_data("ac_wifi_cfg_get")).then(function(){
			me.init_wifi_list();
		});
	},

		//	ac	在线表格
		init_wifi_list:function(){
			var me = this;
			var data = me.ac_wifi_list_data;
//			console.log(me.ac_wifi_list_data)
			var new_data = [];
			var thisidx=[];
			for(var i=0;i<4;i++){
				if(data["idx"+i]["Enable"]==""){
					thisidx.push(data["idx"+i]);
				}
			}
			if(thisidx.length==0){
				$("#wireless_settings_add").attr("disabled","disabled");
			}else{
				$("#wireless_settings_add").removeAttr("disabled");
			}
			
				for(var i in data){
					if(data[i]["Enable"]!=""){
						var tempObj = {};
						var apname = data[i]["SSID"] ? cutString(data[i]["SSID"],15) : "-";
						
						tempObj.apname = '<span title="'+data[i]["SSID"]+'">'+apname+'</span>';
						
						if(data[i]["AuthMode"]=="OPEN"){
							tempObj.AuthMode = appJs["copywriting"][0];
						}else{
							tempObj.AuthMode = data[i]["Passwd"];
						}
						if(data[i]["Enable"]==0){
							tempObj.Enable =appJs["f-label"][1];
						}else{
							tempObj.Enable =appJs["f-label"][0];
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
							 tempObj.op='<a data-idx="'+data[i]["idx"]+'" title="'+ appJs["f-label"][2] +'" class="op edit" href="javascript:void(0);">'+ appJs["f-label"][2] +'</a>';
				        	
	      
						}else{
							 tempObj.op='<a data-idx="'+data[i]["idx"]+'" title="'+ appJs["f-label"][2] +'" class="op edit" href="javascript:void(0);">'+ appJs["f-label"][2] +'</a>'
				        	+'<a data-idx="'+data[i]["idx"]+'"  title="'+ appJs["f-label"][3] +'" class="op delete" href="javascript:void(0);">'+ appJs["f-label"][3] +'</a>';
	      
						}
				       
						new_data.push(tempObj);
					}
				}
		
			var tab = new Table("wifi_management_table",appJs.table_title,new_data);
			tab.initTable();
		},

	//表格修改
	edit_tb:function(idx){
		var me = this;
		var newData= me.thisData_f(me.ac_wifi_list_data,idx);
//		console.log(me.ac_wifi_list_data,idx,newData)
		
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
		$("#frequency_band").val(newData.section?newData.section:"2G+5G");
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
			show_message("save");
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
	add_event:function(){
		var me = this;
		//无线设置修改
		$("body").undelegate("#wifi_management_table .edit","click").delegate("#wifi_management_table .edit","click",function(){
				$("#idx_id").val($(this).attr("data-idx"));
				var setData={"idx": $(this).attr("data-idx")}
				$.when(management.get_data("ac_wifi_time_get",setData)).then(function(){
						management.edit_tb($("#idx_id").val());
						management.edit_tb_time(me.ac_wifi_time_data);
				});
//				$("#time_interval").val(1)
//				management.get_data("led_blink",setData)
		});
//		删除
		$("body").undelegate("#wifi_management_table .delete","click").delegate("#wifi_management_table .delete","click",function(){
				
				var setData={"idx": $(this).attr("data-idx")}
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
			var setData={"idx": String(thisidx)}
			
			$.when(management.get_data("ac_wifi_time_get",setData)).then(function(){
						management.edit_tb(thisidx);
						management.edit_tb_time();
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
		
		},
	init:function(){
		var me = this;
		me.get_wifi_management_data();
		me.add_event();
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
				
		})
	//多选
	$(".checkbox2 input").click(function(){
			$(this).toggleClass("checkedCurrent");
			if($(this).hasClass("checkedCurrent")){
				$(this).attr("value","1");			
				
			}else{
					$(this).attr("value","0");			
			}
	});
	management.init();
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
		$(".form-sec").addClass("off");
		$(".form-sec").eq($(this).index()).removeClass("off");
		
	})
	
});
