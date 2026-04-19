current_html = "wired_vlan";
var appJs = null;



var management={
	ac_ap_online_data:[],//ac 在线列表
	ac_wifi_data:{},
	led_data:new Array(),
	dataTable:null,
	get_data:function(type,setData){
		var me = this;
		var dfd = $.Deferred();
		var method = null;
		if(type == "ac_ap_get"){
			method = "ac_ap_get";
			setData={};
		}else{
			method = type;
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
				}else if(type == "ac_iptv_set"){
					if(data.result[0]==0){
						console.log(setData);
						if(setData.mac!=undefined){
						var editmac=setData.mac.split("#");
						for(var i=0;i<$(".quick_span").length;i++){
							for(var j=0;j<editmac.length;j++){
								if($(".quick_span").eq(i).attr("data-mac")==editmac[j]){
									var obj={};
									
									if(setData.enable==1){
										// $(".quick_span").eq(i).html(L.enable);
										// $(".iptv_vlan").eq(i).html(setData.vlan);
										// $(".iptv_untag").eq(i).html(setData.untag?setData.untag:"-");
										obj.iptv_enable='<span data-mac="'+ editmac[j] +'" class="quick_span">'+L.enable+'</span>';
										obj.iptv_vlan='<span data-mac="'+ editmac[j] +'" class="iptv_vlan">'+setData.vlan+'</span>';
										var untag=setData.untag?L.enable:L.closed;
										obj.iptv_untag='<span data-mac="'+ editmac[j] +'" class="iptv_untag">'+untag+'</span>';
									}else{
										// $(".quick_span").eq(i).html(L.closed);
										// $(".iptv_vlan").eq(i).html("-");
										// $(".iptv_untag").eq(i).html("-");
										obj.iptv_enable='<span data-mac="'+ editmac[j] +'" class="quick_span">'+L.closed+'</span>';
										obj.iptv_vlan='<span data-mac="'+ editmac[j] +'" class="iptv_vlan">-</span>';
										obj.iptv_untag='<span data-mac="'+ editmac[j] +'" class="iptv_untag">-</span>';
									}
									// console.log(obj)
									me.dataTable.updateOriginData(obj, 'data-mac="'+ editmac[j] +'"');
								}
							}
							
						}
						}else{
								me.get_ap_manage_data()
							}
						me.empty();
						show_message("success");	
					}else{
						show_message("error");	
					}
					
					me.empty();
				}
				
				dfd.resolve();
			}	
			else{
				if(type == "led_blink"){
					
				}
				hide_loading_page();
				show_err_page();	
				show_message("error");
			}
		}).fail(function(data){
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

		//	ac	在线表格
		init_ac_ap_online_list:function(){
			var me = this;
			var data = me.ac_ap_online_data;
			$("#online_quantity").html(data.length);
			table_page["page"]=page_id("wired_vlan_table");
			//console.log(me.ac_ap_online_data)
			var new_data = [];

				for(var i in data){
					var tempObj = {};
					 tempObj.connect = '<input type="checkbox" name="checkboxShall" mac="'+ data[i]["mac"] +'" idx="'+i+'" value="0" class="checkboxShall">';
					var apname= data[i]["apname"] ? cutString(data[i]["apname"],15) : name_mac(data[i]["mac"]);
					tempObj.apname = '<span title="'+data[i]["apname"]+'">'+apname+'</span>';
					tempObj.model = data[i]["model"];
					tempObj.ip = data[i]["ip"];
					tempObj.mac = data[i]["mac"];
					if(data[i]["iptv_enable"]==1){
						if(data[i]["iptv_select"]==1){
							tempObj.iptv_enable='<span data-mac="'+ data[i]["mac"] +'" class="quick_span">'+L.enable+'<i class="f-lightBlueColor">('+L.copywriting+'IPTV)</i></span>';
						}else{
							tempObj.iptv_enable='<span data-mac="'+ data[i]["mac"] +'" class="quick_span">'+L.enable+'</span>';
						}
						
						var vlan_iptv=data[i]["iptv_vlan"]?data[i]["iptv_vlan"]:"-";
						tempObj.iptv_vlan='<span data-mac="'+ data[i]["mac"] +'" class="iptv_vlan">'+vlan_iptv+'</span>';
						
						if(data[i]["iptv_untag"]==1){
							tempObj.iptv_untag='<span data-mac="'+ data[i]["mac"] +'" class="iptv_untag">'+L.enable+'</span>';
						}else{
							tempObj.iptv_untag='<span data-mac="'+ data[i]["mac"] +'" class="iptv_untag">'+L.closed+'</span>';
							
						}
					}else{
						tempObj.iptv_enable='<span data-mac="'+ data[i]["mac"] +'" class="quick_span">'+L.closed+'</span>';
						tempObj.iptv_vlan='<span data-mac="'+ data[i]["mac"] +'" class="iptv_vlan">-</span>';
					
						tempObj.iptv_untag='<span data-mac="'+ data[i]["mac"] +'" class="iptv_untag">-</span>';
					}
					
					new_data.push(tempObj);
				}
		
			me.dataTable = new Table("wired_vlan_table",appJs.ac_ap_online_table,new_data,{
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
								var a1=a.iptv_enable.slice(a.iptv_enable.lastIndexOf('">')+2,a.iptv_enable.indexOf("</span>"));
								var b1=b.iptv_enable.slice(b.iptv_enable.lastIndexOf('">')+2,b.iptv_enable.indexOf("</span>"));
								return  parseInt(status_sorting(a1),10)-parseInt(status_sorting(b1),10);
							}
						},
						"noSort",	
						{
							sortEvent:function(a,b){
								var a1=a.iptv_untag.slice(a.iptv_untag.lastIndexOf('">')+2,a.iptv_untag.indexOf("</span>"));
								var b1=b.iptv_untag.slice(b.iptv_untag.lastIndexOf('">')+2,b.iptv_untag.indexOf("</span>"));
								return  parseInt(status_sorting(a1),10)-parseInt(status_sorting(b1),10);
								
							}
						},
				],
				  info:L.item_null
			});
			me.dataTable.initTable();
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
		
		checkbox_enable("iptv_enable",1);
		$("#iptv_vlan").val(3);
		checkbox_enable("iptv_untag",1);
		$(".checkboxShall").val(0).removeClass("checkedCurrent");
		// this.get_ap_manage_data();
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
		
		$("body").undelegate("#bandwidth_5","change").delegate("#bandwidth_5","change",function(){
			var index = $(this).val();
			wireless_base_change();
			
		});
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
			$("body").undelegate("#wired_vlan_table .quick_span","click").delegate("#wired_vlan_table .quick_span","click",function(){
				$(this).parents("tr").children("td").eq(0).children("input").addClass("checkedCurrent").val(1);
				$("#wired_vlan_list .button-set").click();
				
			});
			//设置
			$("body").undelegate("#wired_vlan_list button.button-set","click").delegate("#wired_vlan_list button.button-set","click",function(){
				

				me.led_data=[];
				var select_checkbox=me.checkbox_length_fun();
				if(select_checkbox.length==0 && !$("#select_All").prop("checked")){
					show_message("error",L.check_one);
					return false;
				}
				
				
				me.led_data=select_checkbox;
				//console.log(me.led_data,encrypt_mac(me.led_data));
				
				
				$("#wired_vlan_details").modal();
				if(me.led_data.length>1){//undefined就是批量设置多个
					var newData= management.ac_wifi_data;
				}else{
					var newData= me.thisData_f(me.ac_ap_online_data,me.led_data);
				}
				
				
				$("#iptv_enable").siblings(".button-label").removeClass("disabled");
				$("#iptv_vlan").prop("disabled",false);
				$(".disabled_span").addClass("hidden");
				if(select_checkbox.length==1){
					checkbox_enable("iptv_enable",newData.iptv_enable);
					$("#iptv_vlan").val(newData.iptv_vlan)
					checkbox_enable("iptv_untag",newData.iptv_untag);
					autobind_show();
					if(newData.iptv_select==1){
						$("#iptv_vlan").prop("disabled",true);
						$("#iptv_enable").siblings(".button-label").addClass("disabled");
						$(".disabled_span").removeClass("hidden");
					}
					
				}else{
					
					checkbox_enable("iptv_enable",1);
					$("#iptv_vlan").val(3);
					checkbox_enable("iptv_untag",1);
					autobind_show()
				}
				
				

			});
//			全选
			$("body").undelegate("#wired_vlan_list #select_All","click").delegate("#wired_vlan_list #select_All","click",function(){
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
			 //	返回
			$("body").undelegate("#wired_vlan_details button.btn-cancel","click").delegate("#wired_vlan_details button.btn-cancel","click",function(){
				
				management.empty();
			});
			$("body").undelegate("#wired_vlan_details button.btn-confirm","click").delegate("#wired_vlan_details button.btn-confirm","click",function(){
					me.led_data=[];
					var select_checkbox=me.checkbox_length_fun();
					
					me.led_data=select_checkbox;
					var setData={}
					if(!$("#select_All").prop("checked")){
						setData["mac"]=encrypt_mac(me.led_data);
					}
					setData["enable"]=$("#iptv_enable").val()*1;
					setData["vlan"]=$("#iptv_vlan").val()*1;
					setData["untag"]=$("#iptv_untag").val()*1;
					if(setData["enable"]==1){
						if(setData["vlan"]<3 || setData["vlan"]>4094){
							show_differ_tip("iptv_vlan",L.input_range);
							return;	
						}
					}
					
					show_message("save");
					$.when(management.get_data("ac_iptv_set",setData)).then(function(){
						$("#wired_vlan_details").modal("hide");
						me.get_ap_manage_data();
					});
			});
		},
	
	init:function(){
		var me = this;
		
		this.get_ap_manage_data();
		this.add_event();
		
	}
}
function autobind_show(){
	var eb= $("#iptv_enable").val();
	if(eb==0){
		$("#iptv_enable_show").addClass("hidden");
	}else{
		$("#iptv_enable_show").removeClass("hidden");
	}
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
	if($(this).hasClass("disabled")){
		return;
	}
			$(this).toggleClass("f-switchTrue");	
			
				if($(this).hasClass("f-switchTrue")){
					$(this).siblings(".checkboxAll").attr("value","1").attr("checked");			
					
				}else{
					$(this).siblings(".checkboxAll").attr("value","0").removeAttr("checked");
					
				}
				autobind_show()
		})
		$(".select_all_page").html(L.select_all_page)
});
