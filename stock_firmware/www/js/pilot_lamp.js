var tableData = [];
current_html = "pilot_lamp";
var appJs = null;
var priority;
//wifi管理

var management={
	ac_ap_online_data:[],//ac 在线列表
	dataTable:null,
	led_data:new Array(),
	get_data:function(type,setData){
		var me = this;
		var dfd = $.Deferred();
		var method = null;
		if(type == "ac_ap_get"){
			method = "ac_ap_get";
			setData={};
		}else if(type =="ac_led_set"){
			method = "ac_led_set"
		}else if(type == "ac_led_get"){
			method = "ac_led_get"
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
				data=data.result[1]["ap"];
				
					for(var i=0;i<data.length;i++){
						if(data[i]["trust"]==1){
							me.ac_ap_online_data.push(data[i]);
						}
					}
				}else if(type == "ac_led_set"){
					show_message("success");
					console.log(setData);
					if(setData.mac!=undefined){
						var editmac=setData.mac.split("#");
						for(var i=0;i<$(".quick_span").length;i++){
							for(var j=0;j<editmac.length;j++){
								if($(".quick_span").eq(i).attr("data-mac")==editmac[j]){
									var obj={};
									if(setData.led==1){
										// $(".quick_span").eq(i).html(L.enable);
										obj.online='<span data-mac="'+ editmac[j] +'" class="quick_span">'+L.enable+'</span>';
									}else{
										// $(".quick_span").eq(i).html(L.closed);
										obj.online='<span data-mac="'+ editmac[j] +'" class="quick_span">'+L.closed+'</span>';
									}
										console.log(obj);
									me.dataTable.updateOriginData(obj, 'data-mac="'+ editmac[j] +'"');
								}
							}
							
						}
					}else{
								me.get_ap_manage_data()
							}
					
					me.empty();
				}else if(type == "ac_led_get"){
					checkbox_enable("led_enable",data.result[1]["led"]);
					console.log(data.result[1]["led"])
				}
				
				dfd.resolve();
			}	
			else{
				if(type == "led_blink"){
					
				}
				show_message("error");
			}
		}).fail(function(data){
			hide_loading_page();
				show_err_page();	
			show_message("error",data);
		})
		
		
		return dfd.promise();
	},
	get_ap_manage_data:function(){
		var me = this;
		$.when(management.get_data("ac_ap_get")).then(function(){
			me.init_ac_ap_online_list();
		
		});
	},

		//	ac	在线表格
		init_ac_ap_online_list:function(){
			var me = this;
			table_page["page"]=page_id("pilot_lamp_table");
			var data = me.ac_ap_online_data;
			$("#online_quantity").html(data.length);
			console.log(me.ac_ap_online_data)
			var new_data = [];
			// data=debuggerdata;
				for(var i in data){
					var tempObj = {};
					 tempObj.connect = '<input type="checkbox" name="checkboxShall" mac="'+ data[i]["mac"] +'" idx="'+i+'" value="0" class="checkboxShall">';
					var apname= data[i]["apname"] ? cutString(data[i]["apname"],15) : name_mac(data[i]["mac"]);
					tempObj.apname = '<span title="'+data[i]["apname"]+'">'+apname+'</span>';
					tempObj.model = data[i]["model"];
					tempObj.ip =  data[i]["ip"] ;
					tempObj.mac =  data[i]["mac"] ;
					
					if(data[i]["led"]==1){
						tempObj.online='<span data-mac="'+ data[i]["mac"] +'" class="quick_span">'+L.enable+'</span>';
					}else{
						tempObj.online='<span  data-mac="'+ data[i]["mac"] +'" class="quick_span">'+L.closed+'</span>';
					}
					new_data.push(tempObj);
				}

			me.dataTable = new Table("pilot_lamp_table",appJs.ac_ap_online_table,new_data,{ 
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
									var a1=a.online.slice(a.online.lastIndexOf('">')+2,a.online.indexOf("</span>"));
									var b1=b.online.slice(b.online.lastIndexOf('">')+2,b.online.indexOf("</span>"));
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
		
		$("#pilot_lamp_details").modal("hide");
		
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
				
				var  checkboxShall_all=$(".TabBody input.checkboxShall").length;
				// if(checkboxShall_all==me.checkbox_length_fun().length){
				// 	$(".checkboxShall").eq(0).val(1).addClass("checkedCurrent");
				// }
				// if(me.checkbox_length_fun().length==0){
				// 	$(".checkboxShall").eq(0).val(0).removeClass("checkedCurrent");
				// }
			});
			
			//设置
			$("body").undelegate("#pilot_lamp_list button.button-set","click").delegate("#pilot_lamp_list button.button-set","click",function(){
				me.led_data=[];
				var select_checkbox=me.checkbox_length_fun();
				if(select_checkbox.length==0 && !$("#select_All").prop("checked")){
					show_message("error",L.check_one);
						return false;
					}
				$("#pilot_lamp_details").modal();
				
				me.led_data=select_checkbox;
				console.log(me.led_data,encrypt_mac(me.led_data));

				$.when(management.get_data("ac_led_get",{"mac":encrypt_mac(me.led_data)})).then(function(){
						
				});
			});
			
			$("body").undelegate("#pilot_lamp_list .quick_span","click").delegate("#pilot_lamp_list .quick_span","click",function(){
				$(this).parents("tr").children("td").eq(0).children("input").addClass("checkedCurrent").val(1);
				$("#pilot_lamp_list .button-set").click();
				
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
			 //	返回
			$("body").undelegate("#pilot_lamp_details button.btn-cancel","click").delegate("#pilot_lamp_details button.btn-cancel","click",function(){
				
				management.empty();
			});
			$("body").undelegate("#pilot_lamp_details button.btn-edit","click").delegate("#pilot_lamp_details button.btn-edit","click",function(){
				var setData={"led":$("#led_enable").val()*1}
				if(!$("#select_All").prop("checked")){
					setData["mac"]=encrypt_mac(me.led_data);
				}
				
				$.when(management.get_data("ac_led_set",setData)).then(function(){
						
				});
			});
		},
	
	init:function(){
		var me = this;
		
		this.get_ap_manage_data();
		this.add_event();
		
	}
}

//第二页多选框点击
//function checkbox_click(indexV){
//	var mythis=$("#pilot_lamp_table tbody tr").eq(indexV).children().last().children(".checkboxShall");
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
		$(".select_all_page").html(L.select_all_page)
});
