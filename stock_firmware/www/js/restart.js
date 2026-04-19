var tableData = [];
current_html = "restart";
var appJs = null;
var priority;
//wifi管理

var management={
	ac_ap_online_data:[],//ac 在线列表
	led_data:new Array(),
	dataTable:null,
	get_data:function(type,setData){
		var me = this;
		var dfd = $.Deferred();
		var method = null;
		if(type == "ac_ap_get"){
			method = "ac_ap_get";
			setData={};
		}else if(type == "ac_reboot_timer_get"){
			method = "ac_reboot_timer_get"
		}else if(type == "ac_reboot_timer_set"){
			method = "ac_reboot_timer_set"
		}else if(type == "ap_imcmd_reboot"){
			method = "ap_imcmd"
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
				}else if(type == "ac_reboot_timer_get"){
					dfd.resolve(data);
					
					// console.log(data.result[1])
				}else if(type == "ac_reboot_timer_set"){
					show_message("success");
					// console.log(setData);
					if(setData.mac!=undefined){
					var editmac=setData.mac.split("#");
					for(var i=0;i<$(".reboot_enable").length;i++){
						for(var j=0;j<editmac.length;j++){
							if($(".reboot_enable").eq(i).attr("data-mac")==editmac[j]){
								var obj={};
								if(setData.enable==1){
									// $(".reboot_enable").eq(i).html(L.enable);
									obj.reboot_enable='<span data-mac="'+ editmac[j] +'" class="reboot_enable">'+L.enable+'</span>';
								}else{
									// $(".reboot_enable").eq(i).html(L.closed);
									obj.reboot_enable='<span data-mac="'+ editmac[j] +'" class="reboot_enable">'+L.closed+'</span>';
								}
								// $(".restart_times").eq(i).html(setData.hour+":"+setData.min);
								var data_time=setData.day_flags;
								data_time=dec_two_bin(data_time);
								data_time=reverseNumber(data_time);
								data_time=convert_to_date(data_time)
								// $(".restart_day").eq(i).html(data_time);
								
									
									obj.times='<span class="restart_times">'+setData.hour+":"+setData.min+'</span><br><span class="restart_day">'+data_time+'</span>';
									me.dataTable.updateOriginData(obj, 'data-mac="'+ editmac[j] +'"');
											// console.log(obj)			
							}
						}
						
					}
					}else{
								me.get_ap_manage_data()
							}
					
					me.empty();
				}else if(type == "ap_imcmd_reboot"){
					show_message("success");
					me.empty();
					// me.get_ap_manage_data();
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
			table_page["page"]=page_id("restart_table");
			// console.log(me.ac_ap_online_data)
			var new_data = [];
			// data=debuggerdata;
			
				for(var i in data){
					var tempObj = {};
					 tempObj.connect = '<input type="checkbox" name="checkboxShall" mac="'+ data[i]["mac"] +'" idx="'+i+'" value="0" class="checkboxShall">';
					
					
//					tempObj.apname = data[i]["apname"] ? data[i]["apname"] : name_mac(data[i]["mac"]);
					var apname= data[i]["apname"] ? cutString(data[i]["apname"],15) : name_mac(data[i]["mac"]);
					tempObj.apname = '<span title="'+data[i]["apname"]+'">'+apname+'</span>';
					tempObj.model = data[i]["model"];
					tempObj.ip = data[i]["ip"];
					tempObj.mac = data[i]["mac"];
					if(data[i]["reboot_enable"]==0){
						tempObj.reboot_enable='<span data-mac="'+ data[i]["mac"] +'" class="reboot_enable quick_span">'+L.closed+'</span>';
					}else{
						tempObj.reboot_enable='<span data-mac="'+ data[i]["mac"] +'" class="reboot_enable quick_span">'+L.enable+'</span>';
					}
					var data_time=data[i]['reboot_day_flags'];
			        data_time=dec_two_bin(data_time);
			        data_time=reverseNumber(data_time);
			        data_time=convert_to_date(data_time)
			        console.log(data_time)
			       tempObj.times='<span class="restart_times">'+time_optimization(data[i]['reboot_hour'])+':'+time_optimization(data[i]['reboot_min'])+'</span><br><span class="restart_day">'+data_time+'</span>';
					
						
		
					new_data.push(tempObj);
				}
		
			me.dataTable = new Table("restart_table",appJs.ac_ap_online_table,new_data,{
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
							 // console.log(a)
							return compareMac(a.mac,b.mac);
						},
					},
					{
						sortEvent:function(a,b){
							var a1=a.reboot_enable.slice(a.reboot_enable.lastIndexOf('">')+2,a.reboot_enable.indexOf("</span>"));
							var b1=b.reboot_enable.slice(b.reboot_enable.lastIndexOf('">')+2,b.reboot_enable.indexOf("</span>"));
							return  parseInt(status_sorting(a1),10)-parseInt(status_sorting(b1),10);
							
						}
					},
					"noSort",
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
		$("#restart_details").modal("hide");
		$("#restart_list").removeClass("off");
		$(".checkboxShall").val(0).removeClass("checkedCurrent");
		// this.get_ap_manage_data();
		me.led_data=[];
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
				
				// var  checkboxShall_all=$(".TabBody input.checkboxShall").length;
				// if(checkboxShall_all==me.checkbox_length_fun().length){
				// 	$(".checkboxShall").eq(0).val(1).addClass("checkedCurrent");
				// }
				// if(me.checkbox_length_fun().length==0){
				// 	$(".checkboxShall").eq(0).val(0).removeClass("checkedCurrent");
				// }
			});
			//设置
			$("body").undelegate("#restart_list button.btn-scheduled-restart","click").delegate("#restart_list button.btn-scheduled-restart","click",function(){
				me.led_data=[];
				var select_checkbox=me.checkbox_length_fun();
				if(select_checkbox.length==0 && !$("#select_All").prop("checked")){
					show_message("error",L.check_one);
					return false;
				}
				
				$("#restart_details").modal();
				me.led_data=select_checkbox;
//				console.log(me.led_data,encrypt_mac(me.led_data));
				if(select_checkbox.length==1){
					var setData={"mac":encrypt_mac(me.led_data)}
				}else {
					var setData={}
				}
				$.when(management.get_data("ac_reboot_timer_get",setData)).then(function(data){
					checkbox_enable("restart_enable",data.result[1]["enable"]);
					$("#hour").val(data.result[1]["hour"]);
					$("#min").val(data.result[1]["min"]);
					var day_d=dec_two_bin(data.result[1].day_flags);
						day_d=reverseNumber(day_d);
					if(select_checkbox.length>1){
							day_d="1111111"
					}
					$(".weekSlotVal").val(day_d)
					for(var i=0;i<7;i++){
						if(day_d[i]==0){
							$(".weekSlot span").eq(i).removeClass("active").attr("value",0);
						}else if(day_d[i]==1){
							$(".weekSlot span").eq(i).addClass("active").attr("value",1);
						}
						
					}	
				});
			});
//			全选
			$("body").undelegate("#restart_list #select_All","click").delegate("#restart_list #select_All","click",function(){
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
			//定时重启设置
			 $("body").undelegate("#restart_details button.btn-edit","click").delegate("#restart_details button.btn-edit","click",function(){
			 	var setData={};
			 		setData["enable"]=$("#restart_enable").val() * 1;
			 		setData["hour"]=$("#hour").val() * 1;
			 		setData["min"]=$("#min").val() * 1;
			 		setData["day_flags"]=reverseNumber($(".weekSlotVal").val());
					setData["day_flags"]=toDecimal(setData["day_flags"]);
					me.led_data=[];
					var select_checkbox=me.checkbox_length_fun();
					if(!$("#select_All").prop("checked")){
						setData["mac"]=encrypt_mac(select_checkbox);
					}
					if(setData["day_flags"]==0  && setData["enable"]==1){
						show_message("error",L.check_one);
						return;
					}
					if(!check_input("restart_ac_frm")){
						return;
					}
					show_message("save");
					$.when(management.get_data("ac_reboot_timer_set",setData)).then(function(){
						$("#restart_details").modal("hide");
					});
			 });
//			 立即重启路由器弹窗
			 $("body").undelegate("#restart_list button.btn-nowRestart","click").delegate("#restart_list button.btn-nowRestart","click",function(){
				
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
						var setData={"cmd":"reboot","mac":encrypt_mac(me.led_data)}
					}else{
						var setData={"cmd":"reboot",}
					}
					show_message("save");
					$.when(management.get_data("ap_imcmd_reboot",setData)).then(function(){
						$("#resetModal").modal("hide");
					});
			});
			$("body").undelegate("#restart_table .quick_span","click").delegate("#restart_table .quick_span","click",function(){
				$(this).parents("tr").children("td").eq(0).children("input").addClass("checkedCurrent").val(1);
				$(".btn-scheduled-restart").click();
				
			});
			
		},
	init_reset_dialog:function(){
		$("#resetModal .modal-title").html(language[language_type]["DIALOG"]["ap_restart"].title);
		var $p = $("<p/>").attr("class","single-tip").html(language[language_type]["DIALOG"]["ap_restart"].content);
		$("#resetModal .modal-body").html($p);
		
	},
	init:function(){
		var me = this;
		
		this.get_ap_manage_data();
		this.add_event();
		me.init_reset_dialog();
	}
}

//第二页多选框点击
//function checkbox_click(indexV){
//	var mythis=$("#restart_table tbody tr").eq(indexV).children().last().children(".checkboxShall");
//	if(mythis.hasClass("checkedCurrent")){
//		mythis.val(0);
//		mythis.removeClass("checkedCurrent");
//	}else{
//		mythis.val(1);
//		mythis.addClass("checkedCurrent")
//	}	
//}
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
		$(".weekSlot").on("click","span",function(){//选着日期点击事件
			$(this).toggleClass("active");
			var thisIndex=$(this).index();
			var weekSlotVal=$(".weekSlotVal").val();//获取数组			
			if($(".weekSlot span").eq(thisIndex).hasClass("active")){//判断是否有被选中的class的名称
				$(this).attr("value",1);
				weekSlotVal=changeStr(weekSlotVal,thisIndex,1)
			}else{
				$(this).attr("value",0);
				weekSlotVal=changeStr(weekSlotVal,thisIndex,0)
			}
			$(".weekSlotVal").val(weekSlotVal);
//			console.log(weekSlotVal);

		})
		$(".select_all_page").html(L.select_all_page)
});
