
current_html = "captive_portal";
var isRepeater=false;//是否开启了repeater或桥接模式
var hotspot={
	hotspot_get_data:{},
	device_whitelist_data:{},//白名单列表数据
	hotspot_host_data:[],//在线设备列表数据
	device_whitelist_table:null,//白名单列表
	hotspot_host_table:null,//在线设备列表
	hotspot_manual_data:{},//
	device_whitelist_data_mac:[],
	wanData: {},
	portData:{},
	get_data:function(type,setData){
		var me = this;
		var dfd = $.Deferred();
		var method = null;
		var ty="hotspot";
		if(type == "hotspot_get"){
			method = "hotspot_get";
			setData={};
		}else if(type == "hotspot_set"){
			method = "hotspot_set";
			
		}else if(type == "hotspot_whitelist_enable_get"){//白名单开关
			method = "hotspot_whitelist_get";
			setData={};
		}else if(type == "hotspot_whitelist_enable_set"){//白名单开关
			method = "hotspot_whitelist_set";
		}else if(type == "hotspot_whitelist_list"){//白名单列表
			method = "hotspot_whitelist_list_get";
			
			setData={};
		}else if(type == "hotspot_whitelist_del"){//白名单删除
			method = "hotspot_whitelist_action";
		}else if(type == "hotspot_host_get"){//在线主机列表
			ty = "acap";
			method = "ap_cmd";
			 setData = {"cmd":"ap_host_get","need_reply":1};
		}else if(type == "hotspot_whitelist_add"){//白名单增加
			method = "hotspot_whitelist_action";
		
		}else if (type === "port_link") {
			ty = "routerd";
			method = "info";
			setData = {};
		}else if (type === "wan_config_get") {
            ty = "routerd";
            method = "wan_config_get";
            setData = {"wanid":1};
        }else if (type === "hotspot_manual_get") {//手动获取
            ty = "hotspot";
            method = "hotspot_manual_get";
            setData = {};
        }else if (type === "hotspot_manual_set") {//手动设置
            ty = "hotspot";
            method = "hotspot_manual_set";
            
        }else{
			method=type;
		}
		 
		var timer_get={"jsonrpc": "2.0", "id":24, "method": "call", "params": [ localStorage.getItem('token_id'), ty, method, setData ] }
		timer_get=JSON.stringify(timer_get);
		request({
			url:"/ubus",
			data:timer_get
		}).done(function(data){
			handleResponse(data,function(){
						if(type == "hotspot_get"){
							me.hotspot_get_data = data.result[1];
							
							
						}else if(type == "hotspot_set"){
							show_message("success");
							me.hotspot_get_data_fn();
						}else if(type == "hotspot_whitelist_enable_get"){//白名单开关
							$("#device_whitelist_enable").val(data.result[1]["enable"]);
							
							checkbox_enable("device_whitelist_enable",data.result[1]["enable"]);
							device_whitelist_enable();
						}else if(type == "hotspot_whitelist_enable_set"){//白名单开关
							show_message("success");
							me.get_data("hotspot_whitelist_enable_get",{})
						}else if(type == "hotspot_whitelist_list"){
							me.device_whitelist_data=data.result[1]["white"];
							me.device_whitelist_table_list();
							if(me.device_whitelist_data.length>=32){
								$("#add_device").css({
									"color":"#919394",
									"cursor":"no-drop"
								});
							}else{
								$("#add_device").css({
									"color":"#2E9BFF",
									"cursor":"pointer"
								});
							}
						}else if(type == "hotspot_whitelist_del"){//白名单删除
							show_message("success",L.del_suc);
							me.get_data("hotspot_whitelist_list",{})
						}else if(type == "hotspot_whitelist_add"){//白名单增加
							show_message("success");
							me.get_data("hotspot_whitelist_list",{});
							me.get_data("hotspot_host_get",{});
							$("#captive_portal_form").removeClass("hidden");
							
							$("#add_devices_show").addClass("hidden");
						}else if(type == "hotspot_host_get"){//在线主机列表
						
							me.hotspot_host_data=[];
								// for(var i in data.result[1]["hosts"]){
								// 	me.hotspot_host_data = jQuery.extend({}, me.hotspot_host_data, data.result[1][i]["hosts"]);
									
								// 	// me.hotspot_host_data=me.hotspot_host_data.concat(data.result[1][i]["hosts"]);
								// }
								
								data=data.result[1];
								for(var i in data){
									 // host_data = jQuery.extend({}, host_data, data[i]["hosts"]);	
									me.hotspot_host_data=me.hotspot_host_data.concat(data[i]["hosts"]);
								}
								me.hotspot_host_data=me.filterArrayByMac(me.hotspot_host_data, me.device_whitelist_data);
								console.log(me.hotspot_host_data);
							me.hotspot_host_table_list();
						}else if (type === "port_link") {
							me.portData = data["result"][1]["link_info"];
							me.render_port_link_data();
						}else if (type === "wan_config_get") {
							 me.wanData = data["result"][1];
						}else if (type === "hotspot_manual_get") {
							 me.hotspot_manual_data = data["result"][1];
						}else if (type === "hotspot_manual_set") {
							 show_message("success");
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
	 filterArrayByMac:function(arrayA, arrayB) {
	    return arrayA.filter(function(itemA) {
	        // 检查 arrayB 中是否有相同的 mac
	        return !arrayB.some(function(itemB) {
	            return itemA.mac === itemB.mac;
	        });
	    });
	},
	hotspot_get_data_fn:function(){
		var me = this;
		$.when(me.get_data("wan_config_get",{})).then(function(){
			$.when(hotspot.get_data("hotspot_get"),me.get_data("hotspot_whitelist_list",{}),me.get_data("hotspot_whitelist_enable_get",{}),me.get_data("port_link",{}),me.get_data("hotspot_manual_get")).then(function(){
					show_content();
					me.init_hotspot_show();
					me.hotspot_manual_show();
				});
		});
	},
	init_hotspot_show:function(){
		var me = this;
		$("#captive_portal_enable").val(me.hotspot_get_data.disabled);
		me.hotspot_get_data.disabled==1?$("#captive_portal_enable").siblings(".enable_click").removeClass("f-switchTrue"):$("#captive_portal_enable").siblings(".enable_click").addClass("f-switchTrue");
	
		if(sessionStorage.getItem('language')==15 || localStorage.getItem('language')=="UK" || localStorage.getItem('language')=="uk" || language_type=="UK"){
			$("#isp").html("<option value='hotspotsystem'>HOTSPOTSYSTEM</option><option value='manual'>Manual</option>")
		}else{
			$("#isp").html("<option value='wifisystem'>WIFISYSTEM</option><option value='hotspotsystem'>HOTSPOTSYSTEM</option><option value='rostelecom'>ROSTELECOM</option><option value='manual'>Manual</option>")
		
		}
		$("#nasid").val(me.hotspot_get_data.nasid);
		$("#isp").val(me.hotspot_get_data.isp);
		
		if(me.hotspot_get_data.disabled==0){
			$("#captive_portal_show,.device_whitelist_enable_div").removeClass("hidden");
			
			if(me.hotspot_get_data.isp=="wifisystem"){
				$("#wifisystem_show").removeClass("hidden");
				$("#password").val(me.hotspot_get_data.uamsecret)
				
			}else{
				$("#wifisystem_show").addClass("hidden");
			}
		}else{
			$("#captive_portal_show,#device_whitelist_div,.device_whitelist_enable_div").addClass("hidden");
		}
		var day_d=reverseNumber(dec_two_bin(me.hotspot_get_data.dev_type,($(".checkboxShall").length-1)));
		if(me.hotspot_get_data.isp=="manual"){
			$("#captive_portal_manul").removeClass("hidden");
			$("#nasid_div").addClass("hidden")
			
		}
		for(var i=0;i<day_d.length;i++){
			if(day_d[i]==0){
				$("#checkboxShall_"+i).val(0);
				$("#checkboxShall_"+i).removeClass("checkedCurrent");
			}else if(day_d[i]==1){
				$("#checkboxShall_"+i).val(1);
				$("#checkboxShall_"+i).addClass("checkedCurrent");
			}
			
		}
		$("#dev_type").val(day_d)
		
	},
	hotspot_manual_show:function(){
		var me = this;
		
		
		$("#local_network").val(me.hotspot_manual_data.local_network);
		$("#captive_portal_ur").val(me.hotspot_manual_data.portal_url);
		$("#uam_server").val(me.hotspot_manual_data.uamserver);
		$("#uam_secret").val(me.hotspot_manual_data.uamsecret);
		
		$("#radius_server1").val(me.hotspot_manual_data.radius);
		$("#radius_server2").val(me.hotspot_manual_data.radius2);
		$("#radius_secret").val(me.hotspot_manual_data.radsecret);
		
		$("#radius_nas_id").val(me.hotspot_manual_data.nasid);
		
		$("#radius_name").val(me.hotspot_manual_data.loc_name);
		$("#radius_location_id").val(me.hotspot_manual_data.loc_id);
		$("#preferred_dns").val(me.hotspot_manual_data.dns1);
		$("#alternate_dns").val(me.hotspot_manual_data.dns2);
		$("#leasetime").val(me.hotspot_manual_data.leasetime);
		$("#coa_port").val(me.hotspot_manual_data.coaport);
		
		me.render_auth_ip_list(me.hotspot_manual_data.uamallow,"uamAllowed");
		me.render_auth_ip_list(me.hotspot_manual_data.uamdomain,"uamDomain");
		console.log(me.hotspot_manual_data)
	},
	 render_auth_ip_list: function (data,id) {
		var me = this;
		var ip_list = data,
			ip_list_html = "";
		var optionsHtml='';
		 if(id === "uamAllowed"){//UAM Allowed添加非必选提示
			 optionsHtml='<span class="portal_optional one-line">'+language[language_type]["PAGES"][current_html]["html"]["portal_optional"]+'</span>';
		 }
		if (!!ip_list && ip_list.length > 0) {
			// ip_list = ip_list.split(",");
			for (var i = 0; i < ip_list.length; i++) {
				var ipItem = ip_list[i].split("-");
				var btnHtml = '<button class="btn remove-row">-</button>';
				if (i === 0) {
					btnHtml = '<button class="btn add-row">+</button>';
				} else if (id === "uamAllowed"){
					optionsHtml ='';//uamAllowed只有首个选项添加可选提示
				}
				ip_list_html += `<div class="clone-row clearfix">
									<div class="pull-left" style="position:relative;">
										<input type="text" maxlength="64" id="`+id+'_'+ i + `" value="` + ipItem[0] + `" class="form-control" autocomplete="off">
									</div>
									<div class="pull-left" style="margin-left:10px;">` + btnHtml + `  </div> ` + optionsHtml +       
									`</div>`
			}
		}
		if (ip_list_html.length === 0) {
			ip_list_html = `<div class="clone-row clearfix">
										<div class="pull-left" style="position:relative;">
											<input type="text" maxlength="64" id="`+id+'_0'+`" class="form-control" autocomplete="off">
										</div>
										<div class="pull-left" style="margin-left:10px;">
											<button class="btn add-row" type="button">+</button> 
										</div>` +optionsHtml +		     
								`</div>`
		}
		$('#'+id).html(ip_list_html);
		
		$('#'+id).off(E).on(E, function(e) {
			e.stopPropagation();
			var target = $(e.target);
		
			if(target.hasClass('add-row')){
				me.addRow(target,"#"+id);
			}
			else if(target.hasClass('remove-row')){
				me.removeRow(target,"#"+id);
			}
		});
	},
	device_whitelist_table_list:function(){
		var me = this;
		table_page["page"]=page_id("device_whitelist_table");
		var data=me.device_whitelist_data;
		me.device_whitelist_data_mac=[];
		var new_data = [];
		for(var i in data){
			var tempObj = {};
			var vendor=data[i]["vendor"]==undefined?"-":data[i]["vendor"];
				tempObj.connect = '<input type="checkbox" name="checkboxShall" mac="'+ data[i]["mac"] +'" vendor="'+ vendor +'" idx="'+i+'" value="0" class="checkboxShall">';
			
				// tempObj.interface=data[i]["apidx"]==0?L.wired_internet:L.wireless;
				tempObj.vendor='<div class="name-section"><span class="titleName" title="'+vendor+'">'+vendor+'</span><input type="text" mac="'+data[i]["mac"]+'" style="display:none" class="edit-name" value="'+vendor+'"></div>'
				tempObj.mac=data[i]["mac"];
				me.device_whitelist_data_mac[i]=data[i]["mac"];
			new_data.push(tempObj);
		}
		me.device_whitelist_table = new top.Table("device_whitelist_table",appJs.device_whitelist_table,new_data,{
		  size: 10,
		  showTotalPageNum:true,
		  showTotalDataNum:true,
		  showHomeAndEnd:true,
		  // showEditPage:true,
		  // index:table_page["page"],
		  // sortable:true,
			pageStartElem: `<div class="select-page-con">
								<input type="checkbox" name="checkboxShall" value="0"
									   class="checkboxShall select_page">
								<label class="select_all_page">` + L.select_all_page + `</label>
							</div>`,
			pageChangeCallback: function () {
				var checkList = $("#device_whitelist_table").parent(".table-sec").find("input[type='checkbox']");
				var selectAllStatus=$("#device_whitelist_table .select_all").hasClass("checkedCurrent");
				
				for (let i = 0; i < checkList.length; i++) {
					if($(checkList[i]).hasClass("select_page")){
						$(checkList[i]).val(0);
						$(checkList[i]).removeClass("checkedCurrent");
					}else {
						if(selectAllStatus){
							$(checkList[i]).val(1);
							$(checkList[i]).addClass("checkedCurrent");
						}else{
							$(checkList[i]).val(0);
							$(checkList[i]).removeClass("checkedCurrent");
						}
						
					}	
				}
			},
			info:L.item_null
		 }); 
		 var searchStr=$('#device_whitelist_search_input').val();
		 if (!!searchStr){
		 	me.device_whitelist_table.onSearch(searchStr,false);
		 }else {
		 	me.device_whitelist_table.initTable();
		 }
		console.log(me.device_whitelist_data)
		
	},
	//在线设备列表
	hotspot_host_table_list:function(){
		var me = this;
		table_page["page"]=page_id("hotspot_host_table");
		var data=me.hotspot_host_data;
		var new_data = [];
		for(var i in data){
			if(data[i]["conn_type"]!=0){
			var tempObj = {};
			var vendor=data[i]["vendor"]==undefined?"-":data[i]["vendor"];
				tempObj.connect = '<input type="checkbox" name="checkboxShall" mac="'+ data[i]["mac"] +'" vendor="'+ vendor +'" idx="'+i+'" value="0" class="checkboxShall">';
			
				tempObj.conn_type=data[i]["conn_type"]==0?L.wired_internet:L.wireless;
				tempObj.vendor=data[i]["vendor"]==undefined?"-":data[i]["vendor"];
				tempObj.mac=data[i]["mac"];
			new_data.push(tempObj);
			}
		}
		me.hotspot_host_table = new top.Table("hotspot_host_table",appJs.devices_online_table,new_data,{
		  size: 10,
		  showTotalPageNum:true,
		  showTotalDataNum:true,
		  showHomeAndEnd:true,
		  // showEditPage:true,
		  // index:table_page["page"],
		  // sortable:true,
			pageStartElem: `<div class="select-page-con">
								<input type="checkbox" name="checkboxShall" value="0"
									   class="checkboxShall select_page">
								<label class="select_all_page">` + L.select_all_page + `</label>
							</div>`,
			pageChangeCallback: function () {
				var checkList = $("#device_whitelist_table").parent(".table-sec").find("input[type='checkbox']");
				var selectAllStatus=$("#device_whitelist_table .select_all").hasClass("checkedCurrent");
				
				for (let i = 0; i < checkList.length; i++) {
					if($(checkList[i]).hasClass("select_page")){
						$(checkList[i]).val(0);
						$(checkList[i]).removeClass("checkedCurrent");
					}else {
						if(selectAllStatus){
							$(checkList[i]).val(1);
							$(checkList[i]).addClass("checkedCurrent");
						}else{
							$(checkList[i]).val(0);
							$(checkList[i]).removeClass("checkedCurrent");
						}	
					}	
				}
			},
			info:L.item_null
		 }); 
		 var searchStr=$('#hotspot_host_search_input').val();
		 if (!!searchStr){
		 	me.hotspot_host_table.onSearch(searchStr,false);
		 }else {
		 	me.hotspot_host_table.initTable();
		 }
		console.log(me.hotspot_host_data)
	},
	//计算选中的数量
	 checkbox_length_fun:function(id){
		// 选中不能为空
		var checkbox_length = new Array();
		var items = $("#"+id+" .TabBody .checkboxShall");
		for (i = 0; i < items.length; i++) {
			if (items.eq(i).val()==1) {
				checkbox_length.push($("#"+id+" .TabBody .checkboxShall").eq(i).attr("mac")+";"+$("#"+id+" .TabBody .checkboxShall").eq(i).attr("vendor"));
				}
			}
	//console.log("选择的个数为：" + checkbox_length.length,checkbox_length)
		return checkbox_length;
	
	},
	hotspot_set_data:function(setData){
		var me = this;
		show_message("save");
		$.when(hotspot.get_data("hotspot_set",setData)).then(function(){
				me.hotspot_get_data_fn();
			
		});
	},
	//删除一条弹窗
	initSingleDelDialog:function(data){
			var me = this;		
			me.singleDel_D = new Dialog({
				id:"del-single-dialog",
				title:language[language_type]["DIALOG"]["delete-single"].title,
				content:"<p class=\"single-tip\">"+ language[language_type]["DIALOG"]["delete-single"].content +"</p>",
				buttons: [{},{
					action:function(){
						
						if(!!data){
							
							me.singleDel_D.hide();
							
							var obj = {};
							obj["macs"]="";
							for(var i=0;i<data.length;i++){
								if(obj["macs"]==""){
									obj["macs"] = data[i];
								}else{
									obj["macs"] = data[i]+"#"+obj["macs"];
								}
							}	
							obj["action"] = 1;
							console.log(obj)
							me.get_data("hotspot_whitelist_del",obj);
						}
	
					}
				}]
			});
			me.singleDel_D.show();
		},
		// 删除所有
		initDelAllDialog:function(type){
				var me = this;
				me.delAll_D = new Dialog({
					id:"del-all-dialog",
					title:language[language_type]["DIALOG"]["delete-all"].title,
					content:"<p class=\"single-tip\">"+ language[language_type]["DIALOG"]["delete-all"].content +"</p>",
					buttons: [{},{
							action:function(){
								me.delAll_D.hide();
								me.get_data("hotspot_whitelist_del",{"action":2});
							}
						}]
				});
				me.delAll_D.show();
			},
	addRow:function(elem,id){
		var me = this;
		var row = $(elem).closest(".clone-row");
		var new_row = row.clone(true);
		var index = $(id+" .clone-row").length;
		
		new_row.find("input").each(function(k,v){
			$(this).val("");
			var id = $(this).attr("id").split("_")[0] + "_"+$(this).attr("id").split("_")[1] + "_"+ index;
			$(this).attr("id",id);
		});
		new_row.find(".add-row").removeClass("add-row").addClass("remove-row").html("-");
		new_row.find(".portal_optional").addClass("off");
		$(id).append(new_row);
		
		
		if($(id+" .clone-row").length == me.size){
			$(elem).attr("disabled",true);
		}
		
	},
	removeRow:function(elem,id){
		var me = this;
		$(elem).closest(id+" .clone-row").remove();
		
		if($(id+" .clone-row").length < me.size){
			$(id+" .add-row").attr("disabled",false);
		}
		
	},
	 render_port_link_data: function () {
	        var me = this;
			$('#lan_PortStr').html("");
	        var wanPortStr = "", lanPortStr = "";
			 if(router.module=="EAP830" || router.module=="EAP930" || router.module=="NR105GPE" || router.module=="NR109GPE"){
				  isOneWan = (me.wanData.service_type === "internet")
			 }else{
				 var isOneWan = me.wanData.filter(function (item) {
				     return item.service_type === "internet";
				 }).length === 1;
			 }
			
			if(router.module=="NX32U" || router.module=="N6"){
				var idx=4;
			}else{
				var idx=3;
			}

			 if(router.module=="EAP830" || router.module=="EAP930" || router.module=="NR105GPE" || router.module=="NR109GPE"){
				 lanPortStr += '<input type="checkbox" class="checkboxShall checkedCurrent"  id="checkboxShall_'+(4)+'"  idx="'+(4)+'" value="1"><label class="checkbox_lb f-label-title">LAN1</label>';
				 
			 }else{
				 for (var j = 1; j < me.portData.length; j++) {
				     var item = me.portData[j - 1],
				         isWan = me.wanData.filter(function (wanItem) {
				             return wanItem.wanid * 1 === j && wanItem.service_type === "internet";
				         }).length > 0;
				     if (isWan) {
				        
				     } else {
				         var lanStatusDesc = "LAN" + (j - 1);
				 			idx=idx+1;
				         if((j+1)==me.portData.length && (router.module=="NX32U"  || router.module=="N6")){
				 			lanPortStr += '<input type="checkbox" class="checkboxShall checkedCurrent hidden"  id="checkboxShall_'+(idx)+'"  idx="'+(idx)+'" value="1"><label class="checkbox_lb f-label-title hidden">'+lanStatusDesc+'</label>';
				 				                
				 		}else{
				 			lanPortStr += '<input type="checkbox" class="checkboxShall checkedCurrent"  id="checkboxShall_'+(idx)+'"  idx="'+(idx)+'" value="1"><label class="checkbox_lb f-label-title">'+lanStatusDesc+'</label>';
				 				                
				 		}
				             
				     }
				 	console.log(lanStatusDesc)
				 }
			 }
	       
			
	        
			$('#lan_PortStr').append(lanPortStr);
			$(".checkbox2 input").click(function(){
								
				var thisIndex=$(this).attr("idx");
				console.log($(this).index())
				var weekSlotVal=$("#dev_type").val();//获取数组		
					$(this).toggleClass("checkedCurrent");
						
				if($("#checkboxShall_"+thisIndex).hasClass("checkedCurrent")){//判断是否有被选中的class的名称
					$(this).attr("value",1);
					weekSlotVal=changeStr(weekSlotVal,thisIndex,1)
				}else{
					$(this).attr("value",0);
					weekSlotVal=changeStr(weekSlotVal,thisIndex,0)
				}
				$("#dev_type").val(weekSlotVal);
	//			console.log(weekSlotVal);
					
			})
			console.log(lanPortStr)
	    },
	add_event:function(){
		var me = this;
		
		
		// $('#uamDomain').off(E).on(E, function(e) {
		// 	e.stopPropagation();
		// 	var target = $(e.target);
		
		// 	if(target.hasClass('add-row')){
		// 		me.addRow(target,"#uamDomain");
		// 	}
		// 	else if(target.hasClass('remove-row')){
		// 		me.removeRow(target,"#uamDomain");
		// 	}
		// });
			$("body").undelegate(".form_captive_portal button.btn-save","click").delegate(".form_captive_portal button.btn-save","click",function(){
				var setData={};
				setData["disabled"]=$("#captive_portal_enable").val()*1;
				if(setData["disabled"]==1){
					me.hotspot_set_data(setData);
					return;
				}
				setData["isp"]=$("#isp").val();
				setData["nasid"]=$("#nasid").val();
				
				
				
				if(setData["isp"]=="wifisystem"){
					setData["uamsecret"]=$("#password").val();
					if(!check_input("captive_portal_wifisystem_frm")){
						return;
					}
				}
				setData["dev_type"]=toDecimal(reverseNumber($("#dev_type").val()));
				if(setData["dev_type"]==0){
					show_message("msg_info",L.check_one);
					return;
				}
				
				if(setData.isp=="manual"){
					if(!check_input("captive_portal_manul_frm")){
							return;
					}
					var setData_manual={};
					
						setData_manual["local_network"]=$("#local_network").val();
						setData_manual["portal_url"]=$("#captive_portal_ur").val();
						setData_manual["uamserver"]=$("#uam_server").val();
						setData_manual["uamsecret"]=$("#uam_secret").val();
						setData_manual["radius"]=$("#radius_server1").val();
						setData_manual["radius2"]=$("#radius_server2").val();
						setData_manual["radsecret"]=$("#radius_secret").val();
						setData_manual["nasid"]=$("#radius_nas_id").val();
						setData_manual["loc_name"]=$("#radius_name").val();
						
						
						setData_manual["dns1"]=$("#preferred_dns").val();
						setData_manual["dns2"]=$("#alternate_dns").val();
						setData_manual["leasetime"]=$("#leasetime").val()*1;
						if($("#coa_port").val()*1!=0){
							setData_manual["coaport"]=$("#coa_port").val()*1;
						}
						
						
							setData_manual["disabled"]=setData["disabled"];
						
						setData_manual["dev_type"]=setData["dev_type"];
						setData_manual["uamallow"]=[];
						setData_manual["uamdomain"]=[];
						for(var i=0;i<$("#uam_allowed_wrapper input").length;i++){
							if (!!$("#uam_allowed_wrapper input").eq(i).val()){
								setData_manual["uamallow"].push($("#uam_allowed_wrapper input").eq(i).val());
							}
							console.log($("#uamAllowed_"+i).val());
						}
						for(var i=0;i<$("#uam_domain_wrapper input").length;i++){
							setData_manual["uamdomain"].push($("#uam_domain_wrapper input").eq(i).val());
							console.log($("#uamDomain_"+i).val());
						}
						// setData_manual["loc_id"]=base64encode(utf16to8($("#radius_location_id").val()));
						setData_manual["loc_id"]=$("#radius_location_id").val();
						console.log(setData_manual)
						show_message("save");
					$.when(me.get_data("hotspot_manual_set",setData_manual)).then(function(){
						
					});	
					
				}else{
					if(!check_input("captive_portal_frm")){
							return;
					}
					me.hotspot_set_data(setData);
				}
				
				
			});
			$("body").undelegate(".form_captive_portal #isp","click").delegate(".form_captive_portal #isp","change",function(){
				if($(this).val()=="wifisystem"){
					$("#wifisystem_show,#nasid_div").removeClass("hidden");
					$("#captive_portal_manul").addClass("hidden");
					
				}else if($(this).val()=="manual"){
					$("#captive_portal_manul").removeClass("hidden");
					$("#nasid_div,#wifisystem_show").addClass("hidden");
					
				}else{
					$("#wifisystem_show,#captive_portal_manul").addClass("hidden");
					
					$("#nasid_div").removeClass("hidden");
				}
			});
			// 表格复选框
			/* $("body").undelegate(".TabBody input.checkboxShall","click").delegate(".TabBody input.checkboxShall","click",function(){
					var index = $(this).val();
					if($(this).hasClass("checkedCurrent")){
						$(this).val(0).removeClass("checkedCurrent");
					}else{
						$(this).val(1).addClass("checkedCurrent");
					}	
					
					var  checkboxShall_all=$(".TabBody input.checkboxShall").length;
					if(checkboxShall_all==me.checkbox_length_fun().length){
						$(".checkboxShall").eq(0).val(1).addClass("checkedCurrent");
					}
					if(me.checkbox_length_fun().length==0){
						$(".checkboxShall").eq(0).val(0).removeClass("checkedCurrent");
					}
				}); */
				
				// 删除选中
				$("body").undelegate(".form_captive_portal button.btn-del","click").delegate(".form_captive_portal button.btn-del","click",function(){
					var select_checkbox=me.checkbox_length_fun("device_whitelist_table");
					var setData={}
					if(select_checkbox.length==0 && !$("#select_All").prop("checked")){
						show_message("warning",L.check_one);
						return false;
					}
					console.log(select_checkbox);
					if($("#device_whitelist_table .select_all").prop("checked")){
						me.get_data("hotspot_whitelist_del",{"action":2});
					}else{
						me.initSingleDelDialog(select_checkbox);
					}
					
				});
				// 删除全部
				$("body").undelegate(".form_captive_portal button.btn-del-all","click").delegate(".form_captive_portal button.btn-del-all","click",function(){
					me.initDelAllDialog();
					
				});
				
			/*表格搜索*/
			$("body").undelegate("#device_whitelist_search","click").delegate("#device_whitelist_search","click",function(){
				if (!!me.device_whitelist_table){
					var searchStr=$('#device_whitelist_input').val();
					me.device_whitelist_table.onSearch(searchStr);
				}
			});
			// 添加设备
			$("body").undelegate("#add_device","click").delegate("#add_device","click",function(){
				if(me.device_whitelist_data.length>=32){
					return;
				}
				$("#captive_portal_form,#manually_adding_devices").addClass("hidden");
				$("#add_devices_show,#add_devices_online").removeClass("hidden");
				$("#add_devices_show .radio_all").eq(0).click();
				// me.get_data("hotspot_host_get",{});
				
			});
			// 返回
			$("body").undelegate("#add_devices_show button.btn-return","click").delegate("#add_devices_show button.btn-return","click",function(){
				
				$("#add_devices_show,#add_devices_online,#manually_adding_devices").addClass("hidden");
				$("#captive_portal_form").removeClass("hidden");
				
			});
			// 在线手动切换
			$("body").undelegate("#add_devices_show .radio_all","click").delegate("#add_devices_show .radio_all","click",function(){
				
				$("#add_devices_online,#manually_adding_devices").addClass("hidden");
				console.log($(this).val());
				$(".add_devices_div").eq($(this).val()).removeClass("hidden");
				
				if($(this).val()==0){
					me.get_data("hotspot_host_get",{});
				}else{
					$("#adding_devices_input").html("");
					$("#adding_devices_name0,#adding_devices_mac0").val("");
				}
			});
			// 在线选中设备添加
			$("body").undelegate("#add_devices_online button.btn-confirm","click").delegate("#add_devices_online button.btn-confirm","click",function(){
				var select_checkbox=me.checkbox_length_fun("hotspot_host_table");
				var setData={}
				if(select_checkbox.length==0 && !$("#devices_online_select_All").prop("checked")){
					show_message("warning",L.check_one);
					return false;
				};
				console.log(me.device_whitelist_data.length);
				
				var obj = {};
				obj["macs"]="";
				for(var i=0;i<select_checkbox.length;i++){
					if(obj["macs"]==""){
						obj["macs"] = select_checkbox[i];
					}else{
						obj["macs"] = select_checkbox[i]+"#"+obj["macs"];
					}
				}	
				obj["action"] = 0;
			
				show_message("save");
				me.get_data("hotspot_whitelist_add",obj);
			});
			
			// 手动添加多条
			$("body").undelegate("#manually_adding_devices .add-row","click").delegate("#manually_adding_devices .add-row","click",function(){
				var lg=$(".adding_devices_name").length;
					
						var obj='<div class="form-group clearfix marginTop20"><label class="col-xs-6 col-sm-4 col-md-4 col-lg-5 f-label">'+appJs["add_button"][1]+'</label>'
							+'<div class="col-xs-6 col-sm-8 col-md-8 col-lg-7 f-control">'
							+'<input type="text" id="adding_devices_name'+lg+'" name="name" autocomplete="off" class="form-control adding_devices_name" maxlength="127">'
							+'</div></div>'
							+'<div class="form-group clearfix">'
							+'<label class="col-xs-6 col-sm-4 col-md-4 col-lg-5 f-label">'+appJs["add_button"][2]+'</label>'
							+'	<div class="col-xs-6 col-sm-8 col-md-8 col-lg-7 f-control">'
							+'		<input type="text" id="adding_devices_mac'+lg+'" name="mac" autocomplete="off" class="form-control inline-block adding_devices_mac">'
							+'		<button type="button" class="btn remove-row">-</button>'
							+'	</div></div>'
					
				
				$("#adding_devices_input").append(obj);
			});
			//手动删除多条
			$("body").undelegate("#manually_adding_devices .remove-row","click").delegate("#manually_adding_devices .remove-row","click",function(){
				var lg=$("#adding_devices_input .form-group").length;
				console.log(lg)
				$("#adding_devices_input .form-group").eq(lg-1).remove();
				$("#adding_devices_input .form-group").eq(lg-2).remove();
			});
			//手动添加校验提交
			$("body").undelegate("#manually_adding_devices button.btn-add","click").delegate("#manually_adding_devices button.btn-add","click",function(){
				
					reg_map["adding_devices_form"]=[];
					for(var j=0;j<$(".adding_devices_name").length;j++){
						reg_map["adding_devices_form"].push({"id": "adding_devices_name"+j, "type": "string"})
						reg_map["adding_devices_form"].push({"id": "adding_devices_mac"+j, "type": "mac"})
					}
					if(($(".adding_devices_name").length+hotspot.device_whitelist_data.length)>32){
						show_message("error",L.exceed_max_store);
						return false;
						
					}
					if(check_input("adding_devices_form")){
						var obj = {};
						obj["macs"]="";
						for(var i=0;i<$(".adding_devices_name").length;i++){
							if(obj["macs"]==""){
								obj["macs"] = $(".adding_devices_mac").eq(i).val()+";"+$(".adding_devices_name").eq(i).val();
							}else{
								obj["macs"] = $(".adding_devices_mac").eq(i).val()+";"+$(".adding_devices_name").eq(i).val()+"#"+obj["macs"];
							}
						}	
						obj["action"] = 0;
						console.log(obj)
						if(hasDuplicateMACs(obj["macs"])){
							
							show_message("error",L.mac_address_already_exists);
							return false;
						}
						show_message("save");
						me.get_data("hotspot_whitelist_add",obj);
					}
					console.log(reg_map["adding_devices_form"])
			});
			// 单页全选
			
			$("body").undelegate("#device_whitelist_select_page","click").delegate("#device_whitelist_select_page","click",function(){
				var index = $(this).val();
				
				if($(this).hasClass("checkedCurrent")){
					$(this).removeClass("checkedCurrent");
					$(".TabBody .checkboxShall").val(0).removeClass("checkedCurrent");
				}else{
					$(this).addClass("checkedCurrent");
					$(".TabBody .checkboxShall").val(1).addClass("checkedCurrent");	
				}	
			});
			// 选择本页
			 $('.table-sec').off(E, "table input[type='checkbox']").on(E, "table input[type='checkbox']", function () {
			     
			            var tmpValue = 0, hasCheckClass = false;
			            if ($(this).hasClass("checkedCurrent")) {
			                $(this).val(0).removeClass("checkedCurrent");
			                tmpValue = 0;
			                hasCheckClass = false;
			            } else {
			                $(this).val(1).addClass("checkedCurrent");
			                tmpValue = 1;
			                hasCheckClass = true;
			            }
			            /*全选逻辑，不分页码*/
			            if ($(this).hasClass("select_all")) {
			                $(this).parents("table").find(".select_page").removeClass("checkedCurrent");
			                var pageCheckList = $(this).parents("table").find('.TabBody input[type="checkbox"]');
							for (let i = 0; i < pageCheckList.length; i++) {
								$(pageCheckList[i]).val(tmpValue);
								if (hasCheckClass) {
									$(pageCheckList[i]).addClass("checkedCurrent");
								} else {
									$(pageCheckList[i]).removeClass("checkedCurrent");
								}
							}
							
			            } else if ($(this).hasClass("select_page")) {
			                /*全选本页*/
			                $(this).parents("table").find('.select_all').val(0).removeClass("checkedCurrent");
			                var pageCheckList = $(this).parents("table").find('.TabBody input[type="checkbox"]');
			
			                for (let i = 0; i < pageCheckList.length; i++) {
			                    $(pageCheckList[i]).val(tmpValue);
			                    if (hasCheckClass) {
			                        $(pageCheckList[i]).addClass("checkedCurrent");
			                    } else {
			                        $(pageCheckList[i]).removeClass("checkedCurrent");
			                    }
			                }
			            }
			
			});
			
			$("body").undelegate(".name-section .titleName","click").delegate(".name-section .titleName","click",function(){
						edit_name_set($(this));
			
					});
	},
	init:function(){
		var me = this;
		me.hotspot_get_data_fn();
		if (!!!isRepeater){
			this.add_event();
		}
	}
	
}
// 检查字符串中是否有重复的 MAC 地址
function hasDuplicateMACs(str) {
    // 使用正则表达式提取所有 MAC 地址
    var macRegex = /([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})/g;
    var macs = str.match(macRegex);
	macs=macs.concat(hotspot.device_whitelist_data_mac);
    if (!macs) return false; // 没有找到 MAC 地址
    
    // 转换为小写/大写统一格式进行比较
    var normalizedMacs = macs.map(function(mac) {
        return mac.toLowerCase().replace(/-/g, ':');
    });
    
    // 检查是否有重复
    var uniqueMacs = [];
    for (var i = 0; i < normalizedMacs.length; i++) {
        if (uniqueMacs.indexOf(normalizedMacs[i]) !== -1) {
            return true; // 找到重复
        }
        uniqueMacs.push(normalizedMacs[i]);
    }
    
    return false;
}
//修改名称
function edit_name_set(elem){
	
	$("#addModal .modal-title").html(L.change_name);
	edit_mac="";
	var input_t=$(elem).siblings("input");
	$("#addModal").modal();
	
	edit_mac=$(input_t).attr("mac");
	
	$("#equipment_name").val($(input_t).val());
	$("#addModal .btn-confirm").off("click").on("click",function(){
		if(check_input("i_equipment_name_frm")){
			var obj = {};
			obj["macs"]=edit_mac+";"+$("#equipment_name").val();
			
			obj["action"] = 0;
					
			show_message("save");
			hotspot.get_data("hotspot_whitelist_add",obj);
			$("#addModal").modal("hide");
		}
			
	});

}

function captive_portal_enable(){
	var data=$("#captive_portal_enable").val();
		if(data==1){
			$("#captive_portal_show,#device_whitelist_div,.device_whitelist_enable_div").addClass("hidden");
		}else{
			$("#captive_portal_show").removeClass("hidden");
		}
		// device_whitelist_enable()
		if($("#isp").val()=="hotspotsystem" || $("#isp").val()=="manual"){
			$("#wifisystem_show").addClass("hidden")
		}
}
function device_whitelist_enable(){
	var data=$("#device_whitelist_enable").val();
		if(data==1){
			$("#device_whitelist_div").removeClass("hidden");
		}else{
			$("#device_whitelist_div").addClass("hidden");
		}
}
$(document).ready(function(){
	init_breadcrumbs();
	render_page();
	show_loading_page();
	lang.init(language[language_type]["PAGES"][current_html]);
	appJs = language[language_type]["PAGES"][current_html]["js"];
	//开关0是启用，1是禁用
		$("#captive_portal").on('click',function(){//1关闭  0打开
			if (isRepeater){
				return;
			}
			$(this).toggleClass("f-switchTrue");	
				if($(this).hasClass("f-switchTrue")){
					$(this).siblings(".checkboxAll").attr("value","0");
					$(this).siblings(".checkboxAll").attr("checked");

				}else{
					$(this).siblings(".checkboxAll").attr("value","1");			
					$(this).siblings(".checkboxAll").removeAttr("checked");		
				}
				captive_portal_enable()
				
		})
		$("#device_whitelist").on('click',function(){//1关闭  0打开
			$(this).toggleClass("f-switchTrue");	
			show_message("save");
			var eb=0;
				if($(this).hasClass("f-switchTrue")){
					$(this).siblings(".checkboxAll").attr("value","1");	
					$(this).siblings(".checkboxAll").attr("checked");
					$("#device_whitelist_div").removeClass("hidden");
					 eb=1;
				}else{
					$(this).siblings(".checkboxAll").attr("value","0");
					$(this).siblings(".checkboxAll").removeAttr("checked");	
					$("#device_whitelist_div").addClass("hidden");
					 eb=0;
				}
				$.when(hotspot.get_data("hotspot_whitelist_enable_set",{"enable":eb})).then(function(){
						
				});
		})
		
		//多选
		

	// checkIsRepeater(function (isRepeaterFlag) {
	// 	isRepeater = isRepeaterFlag;
		hotspot.init();
	// 	if (isRepeaterFlag) {
	// 		$('.button-label').addClass("disabled");
	// 		section_disable("captive_portal_form",true);
	// 		$('.btn-save').addClass('darkgray disabled');
	// 	}
		
	// })
	
	$("#device_whitelist_title span,#hotspot_host_title span").html(appJs["add_button"][0])
});