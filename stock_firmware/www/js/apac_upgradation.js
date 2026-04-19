var tableData = [];
current_html = "apac_upgradation";
var appJs = null;
var priority;
//升级

var management={
	ac_ap_online_data:[],//ac 在线列表
	ac_upgrading_data:new Array(),//正在升级列表
	ac_upgrading_setInterval:new Array(),
	ac_upgrading_list:new Array(),

	led_data:new Array(),
	
	get_data:function(type,setData){
		var me = this;
		var dfd = $.Deferred();
		var method = null;
		if(type == "ac_ap_get"){
			method = "ac_ap_get";
			setData={};
		}else if(type == "ap_imcmd_reset"){
			method = "ap_imcmd";
		}else if(type == "ac_ap_upgrade_get"){
			method = "ac_ap_upgrade_get";
			setData={};
		}
		var timer_get={"jsonrpc": "2.0", "id":24, "method": "call", "params": [ localStorage.getItem('token_id'), "acap", method, setData ] }
		timer_get=JSON.stringify(timer_get);
		request({
			url:"/ubus",
			data:timer_get
		}).done(function(data){
			if(check_data(data)){	
				 if(type == "ac_ap_get"){
				 	hide_loading_page();
					show_content();
					me.ac_ap_online_data=[];
					for(var i=0;i<data.result[1]["ap"].length;i++){
						if(data.result[1]["ap"][i]["trust"]==1){
							me.ac_ap_online_data.push(data.result[1]["ap"][i]);
						}
					}
				}else if(type == "ac_led_set"){
					show_message("success");
					me.empty();
				}else if(type == "ap_imcmd_reset"){
					show_message("success");
					me.empty();
				}else if(type == "ac_ap_upgrade_get"){
					me.ac_upgrading_data=data.result[1]["ap"];
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
			show_message("error",data);
			hide_loading_page();
			show_err_page();	
		})
		
		
		return dfd.promise();
	},
	get_ap_manage_data:function(){
		var me = this;
		$.when(management.get_data("ac_ap_get")).then(function(){
			me.init_ac_ap_online_list();
			$("#select_All").val(0).removeClass("checkedCurrent");
		});
	},
	get_ac_upgrading_data:function(){
		var me = this;
		$("#upgradation_list").addClass("hidden");
		$("#upgrading_list").removeClass("hidden");
		me.ac_upgrading_data=[];
		$.when(management.get_data("ac_ap_upgrade_get")).then(function(){
			
			// if($("#select_All").prop("checked")){
			// 	me.ac_upgrading_data=me.ac_ap_online_data;
			// }else{
			// 	for(var i=0;i<me.ac_ap_online_data.length;i++){
			// 		for(var j=0;j<me.ac_upgrading_list.length;j++){
			// 			if(me.ac_ap_online_data[i]["mac"]==me.ac_upgrading_list[j]){
			// 				me.ac_upgrading_data.push(me.ac_ap_online_data[i])
			// 			}
			// 		}
			// 	}
			// }
			
			me.init_upgrading_list();
		});
	},
		//	ac	在线表格
		init_ac_ap_online_list:function(){
			var me = this;
			var data = me.ac_ap_online_data;
			table_page["page"]=page_id("upgradation_table");
			$("#online_quantity").html(data.length);
//			console.log(me.ac_ap_online_data)
			var new_data = [];

				for(var i in data){
					var tempObj = {};
					 tempObj.connect = '<input type="checkbox" name="checkboxShall" mac="'+ data[i]["mac"] +'" idx="'+i+'" value="0" class="checkboxShall">';
//					tempObj.apname = data[i]["apname"] ? data[i]["apname"] : name_mac(data[i]["mac"]);
					var apname= data[i]["apname"] ? cutString(data[i]["apname"],15) : name_mac(data[i]["mac"]);
					tempObj.apname = '<span title="'+data[i]["apname"]+'">'+apname+'</span>';
					tempObj.model = data[i]["model"];
					tempObj.ip = data[i]["ip"];
					tempObj.mac = data[i]["mac"];
					tempObj.verison = data[i]["verison"];
					new_data.push(tempObj);
				}
		
			var tab = new top.Table("upgradation_table",appJs["ac_ap_online_table"],new_data,{
				size: 20,
				showTotalPageNum:true,
				showTotalDataNum:true,
				showHomeAndEnd:true,
				// showEditPage:true,
				 index:table_page["page"],
				sortOptions:[
										
					"noSort",
					{
						sortEvent:function(a,b){
							var a1=a.apname.slice(a.apname.lastIndexOf('">')+2,a.apname.indexOf("</span>"));
							var b1=b.apname.slice(b.apname.lastIndexOf('">')+2,b.apname.indexOf("</span>"));
							
							return  compareName(a1,b1);
						}
					},
					{
						sortEvent:function(a,b){
							// console.log(b.time, parseInt(b.time,10))
						return  parseInt(b.model.replace(/[^\d.]/g,""),10)-parseInt(a.model.replace(/[^\d.]/g,""),10);
						}
					},
					"noSort",
					{
						sortEvent:function(a,b){
							
							return compareMac(a.mac,b.mac);
						},
					},
					{
						sortEvent:function(a,b){
							
							var a1=a.verison.split(".").join("");
							var b1=b.verison.split(".").join("");
						
							if(a.verison=='-'|| b.verison=='-'){
								return -1;
							}
							return  a1-b1;
						}
					},
					
					],
					info:L.item_null
			});
			tab.initTable();
		},
	
	//	正在升级的表格
		init_upgrading_list:function(){
			var me = this;
			var data = me.ac_upgrading_data;
//			console.log(me.ac_ap_online_data)
			var new_data = [];

				for(var i in data){
					var tempObj = {};
				
//					tempObj.apname = data[i]["apname"] ? data[i]["apname"] : name_mac(data[i]["mac"]);
					var apname= data[i]["apname"] ? cutString(data[i]["apname"],15) : name_mac(data[i]["mac"]);
					tempObj.apname = '<span title="'+data[i]["apname"]+'">'+apname+'</span>';
					tempObj.model = data[i]["model"];
					tempObj.ip = data[i]["ip"];
					tempObj.mac = data[i]["mac"];
					tempObj.verison = customer_format_version(data[i]["verison"]);
					
						if(data[i]["upgrading"]==0){
							tempObj.status = appJs["upgrade_status"][1];
						}else if(data[i]["upgrading"]==1){
							tempObj.status = appJs["upgrade_status"][0];
						}else if(data[i]["upgrading"]==3){
							tempObj.status =appJs["upgrade_status"][2];
						}else{
							tempObj.status = appJs["upgrade_status"][4];
						}
						
					
					new_data.push(tempObj);
				}
		
			var tab = new Table("upgrading_table",appJs.ac_upgrading_table,new_data,{
				size: 20,
				showTotalPageNum:true,
				showTotalDataNum:true,
				showHomeAndEnd:true,
				// showEditPage:true,
				 index:table_page["page"],
				
			});
			tab.initTable();
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
	empty:function(){
		var me = this;
		$("#upgradation_details").addClass("off");
		$("#upgradation_list").removeClass("off");
		$(".checkboxShall").val(0).removeClass("checkedCurrent");
		me.get_ap_manage_data();
		$(".upgrading_list_h3").html(appJs["upgrade_status"][3])
		me.led_data=[];
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
	add_event:function(){
		var me = this;
		
			$("body").undelegate(".TabBody input.checkboxShall","click").delegate(".TabBody input.checkboxShall","click",function(){
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
			//升级
			$("body").undelegate("#upgradation_list button.btn-upgradation","click").delegate("#upgradation_list button.btn-upgradation","click",function(){
				

				me.led_data=[];
				var select_checkbox=me.checkbox_length_fun();
				console.log(select_checkbox)
				if(select_checkbox.length==0 && !$("#select_All").prop("checked")){
					show_message("error",L.check_one);
					return false;
				}
				$("#upgradation_details").modal();
				me.ac_upgrading_list=select_checkbox;
				
			});
			//	升级
			$("body").undelegate("#upgradation_details button.btn-cancel","click").delegate("#upgradation_details button.btn-cancel","click",function(){
				
				management.empty();
			});
			//恢复出厂
			$("body").undelegate("#upgradation_list button.btn-reset","click").delegate("#upgradation_list button.btn-reset","click",function(){
				me.led_data=[];
				var select_checkbox=me.checkbox_length_fun();
				if(select_checkbox.length==0 && !$("#select_All").prop("checked")){
					show_message("error",L.check_one);
					return false;
				}	
				$("#resetModal").modal();

			});
			$("body").undelegate("#resetModal button.btn-confirm","click").delegate("#resetModal button.btn-confirm","click",function(){
				me.led_data=[];
					var select_checkbox=me.checkbox_length_fun();
					
					me.led_data=select_checkbox;
					if(!$("#select_All").prop("checked")){
						
						var setData={"cmd":"reset","mac":encrypt_mac(me.led_data)}
						
					}else{
						var setData={"cmd":"reset",}
					}
					$.when(management.get_data("ap_imcmd_reset",setData)).then(function(){
						$("#resetModal").modal("hide");
					});
				
			});
			//恢复出厂返回
			$("body").undelegate("#resetModal button.btn-cancel","click").delegate("#resetModal button.btn-cancel","click",function(){
				
				management.empty();
			});
//			全选
			$("body").undelegate("#select_All","click").delegate("#select_All","click",function(){
				var index = $(this).val();
				
				if($(this).hasClass("checkedCurrent")){
					$(this).removeClass("checkedCurrent");
					$(".TabBody .checkboxShall").val(0).removeClass("checkedCurrent");
				}else{
					$(this).addClass("checkedCurrent");
					$(".TabBody .checkboxShall").val(1).addClass("checkedCurrent");	
				}	
			});
			// 单页全选
			
			$("body").undelegate("#select_page","click").delegate("#select_page","click",function(){
				var index = $(this).val();
				
				if($(this).hasClass("checkedCurrent")){
					$(this).removeClass("checkedCurrent");
					$(".TabBody .checkboxShall").val(0).removeClass("checkedCurrent");
				}else{
					$(this).addClass("checkedCurrent");
					$(".TabBody .checkboxShall").val(1).addClass("checkedCurrent");	
				}	
			});
			$("body").undelegate("#upgrading_list button.btn-cancel","click").delegate("#upgrading_list button.btn-cancel","click",function(){
				clearInterval(me.ac_upgrading_setInterval);
				$("#upgrading_list").addClass("hidden");
				$("#upgradation_list").removeClass("hidden");
				$("#upgrading_list .btn-cancel").addClass("hidden");
				me.get_ap_manage_data();
			});
			
			$("body").undelegate("#upgradation_details button.btn-confirm","click").delegate("#upgradation_details button.btn-confirm","click",function(){
				
				
				var setmac="";
				if(!$("#select_All").prop("checked")){
					setmac="&mac="+escape(encrypt_mac(me.ac_upgrading_list))
				}
				
				var put_file_val=$("#put_file").val();
			    var fileName = put_file_val.substring(put_file_val.lastIndexOf(".") + 1).toLowerCase();
			    
			    
				
				if(put_file_val==""){
					show_message("error",L.abnormal_file_format);
					return;
				}
				var t1="/cgi-bin/ac_upgrade?sid="+localStorage.getItem('token_id')+setmac;
				console.log(t1);
				$("#update_form").attr("action", t1);
				//$("#update_form").attr("action", t1);
				
				$("#update_form").ajaxSubmit({  
					type: 'post',  
					url: t1,
					uploadProgress: function (event, position, total, percentComplete) {
						console.log(percentComplete);
					},
					success: function(data){  
						$("#update_form").resetForm(); 
						console.log(data);
						
						$("#upgradation_details").modal("hide");
						
						if(data.result[0]==0){
							show_message("success",L.file_upload_success);
							me.ac_upgrading_data=[];
							$.when(management.get_data("ac_ap_upgrade_get")).then(function(){
								
								// if($("#select_All").prop("checked")){
								// 	me.ac_upgrading_data=me.ac_ap_online_data;
								// }else{
								// 	for(var i=0;i<me.ac_ap_online_data.length;i++){
								// 		for(var j=0;j<me.ac_upgrading_list.length;j++){
								// 			if(me.ac_ap_online_data[i]["mac"]==me.ac_upgrading_list[j]){
								// 				me.ac_upgrading_data.push(me.ac_ap_online_data[i])
								// 			}
								// 		}
								// 	}
								// }
								
								me.init_upgrading_list();
								$("#upgradation_list").addClass("hidden");
								$("#upgrading_list").removeClass("hidden");
								me.settime(60);
								
								me.ac_upgrading_setInterval= setInterval(function() { 
									me.get_ac_upgrading_data();
								},5000) 
							});
							//clearInterval(automatic);//停止版本检测
							
							
						}else if(data.result[0]==6){
							show_message_gt("error",L.updateMsg)
							
						}
						else if(data.result[0]==8){
							show_message("error",L.file_type_error);
						}
//						else{
//							show_message("error",L.file_upload_error);
//						}
						
					},  
					error: function(XmlHttpRequest, textStatus, errorThrown){
					 show_message("error",L.file_upload_error); 
					 $("#upgradation_details").modal("hide");
					}  
				}); 
			});
		},
	settime:function(obj){
		var me = this;
		if (obj == 0) { 
			
	       	me.init_upgrading_list();
	       	$("#upgrading_list .btn-cancel").removeClass("hidden");
	       	// $(".upgrading_list_h3").html(appJs["upgrade_status"][1]);
	    } else{
	    	obj--; 
	    	setTimeout(function() { 
	    		
		  	  me.settime(obj);
		  	 
	    	},1000) 
	    }
		
		
	},
	init:function(){
		var me = this;
		init_reset_dialog();
		me.get_ap_manage_data();
		me.add_event();
		
	}
}
function put_fileFn(){
	    console.log($("#put_file"))
	    var url=document.getElementById("put_file").value;
    	url=url.split("\\");//这里要将 \ 转义一下
//  alert("文件名 "+url[url.length-1]);
    $("#update_file_name").val(url[url.length-1])
     console.log(url[url.length-1])
}
function init_reset_dialog(){
	$("#resetModal .modal-title").html(language[language_type]["DIALOG"]["acap_reset"].title);
	var $p = $("<p/>").attr("class","single-tip").html(language[language_type]["DIALOG"]["acap_reset"].content);
	$("#resetModal .modal-body").html($p);
	
}
function customer_format_version(v){
	return v;
}

// 状态转换数字排序
function status_sorting(d){
	if(d==L.closed){
		return 0;
	}else if(d==L.enable){
		return 1;
	}
} 


$(document).ready(function(){
		init_breadcrumbs();
	render_page();
	show_loading_page();
		lang.init(language[language_type]["PAGES"][current_html]);
		appJs = language[language_type]["PAGES"][current_html]["js"];

	management.init();
	$(".enable_click").on('click',function(){//1关闭  0打开
			$(this).toggleClass("f-switchTrue");	
			
				if($(this).hasClass("f-switchTrue")){
					$(this).siblings(".checkboxAll").attr("value","1").attr("checked");			
					
				}else{
					$(this).siblings(".checkboxAll").attr("value","0").removeAttr("checked");
					
				}
				
		})
	$('#upgrading_list button.btn-cancel').html(L.s_return)
	$(".upgrading_list_h3").html(appJs["upgrade_status"][3])
	if(!!router.rid && !!router.phoneId){
		$(".btn-upgradation").addClass("hidden");
	}
	// $(".select_all_page").html(L.select_all_page)
});
