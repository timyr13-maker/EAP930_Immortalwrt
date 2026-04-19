current_html = "rf_settings";
var appJs = null;
//射频设置
var regionSelection={};//地区集合
//美国 新加坡 阿联酋
regionSelection.usa=[36,40,44,48,52,56,60,64,100,104,108,112,116,120,124,128,149,153,157,161];
//欧洲
regionSelection.europe=[36,40,44,48,52,56,60,64,100,104,108,112,116,120,124,128,132,136,140,144,149,153,157,161,165];
//俄罗斯 中国 马来西亚
regionSelection.russia=[36,40,44,48,52,56,60,64,149,153,157,161];
//孟加拉
regionSelection.bangladesh=[149,153,157,161];
// 160时中兴道

regionSelection.intermediate_channel=[36,40,44,48,52,56,60,64,]

regionSelection.malaysia=[52,56,60,64,100,104,108,112,116,120,124,128,149,153,157,161,165];
var countryRegion={};//存储地区


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
		}else if(type == "ac_wifi_adv_cfg_get"){
			method = "ac_wifi_adv_cfg_get";
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
				}else if(type == "ac_wifi_adv_cfg_get"){
					
					me.ac_wifi_data = data.result[1];
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
		$.when(management.get_data("ac_ap_get"),management.get_data("ac_wifi_adv_cfg_get",{"idx":"0"})).then(function(){
			me.init_ac_ap_online_list();
			$("#select_All").val(0).removeClass("checkedCurrent");
		});
	},

		//	ac	在线表格
		init_ac_ap_online_list:function(){
			var me = this;
			table_page["page"]=page_id("rf_settings_table");
			var data = me.ac_ap_online_data;
			// var data=debuggerdata;
			$("#online_quantity").html(data.length);
			//console.log(me.ac_ap_online_data)
			var new_data = [];

				for(var i in data){
					var tempObj = {};
					 tempObj.connect = '<input type="checkbox" name="checkboxShall" mac="'+ data[i]["mac"] +'" idx="'+i+'" value="0" class="checkboxShall">';
//					tempObj.apname = data[i]["apname"] ? cutString(data[i]["apname"],15) : name_mac(data[i]["mac"]);
					var apname= data[i]["apname"] ? cutString(data[i]["apname"],15) : name_mac(data[i]["mac"]);
					tempObj.apname = '<span title="'+data[i]["apname"]+'">'+apname+'</span>';
					tempObj.model = data[i]["model"];
					tempObj.ip = data[i]["ip"];
					tempObj.mac = data[i]["mac"];
					tempObj.Channel ='<span class="quick_span channel" data-mac="'+ data[i]["mac"] +'">'+data[i]["Channel0"]+"/"+data[i]["Channel1"]+'</span>';
					var BandWidth_24,BandWidth_5;
					if(data[i]["BandWidth0"]=="auto" || data[i]["BandWidth0"]==undefined){
						BandWidth_24=L.auto;
					}else{
						if(data[i]["BandWidth0"]=="40M+"){
							BandWidth_24="40M";
						}else{
							BandWidth_24=data[i]["BandWidth0"];
						}
						
					}
					
					if(data[i]["BandWidth1"]=="auto" || data[i]["BandWidth1"]==undefined){
						BandWidth_5=L.auto;
					}else{
						if(data[i]["BandWidth1"]=="40M+"){
							BandWidth_5="40M";
						}else{
							BandWidth_5=data[i]["BandWidth1"];
						}
					}
					if(BandWidth_24==L.auto && BandWidth_5==L.auto ){
						tempObj.BandWidth='<span class="quick_span bandWidth" data-mac="'+ data[i]["mac"] +'" bandwidth="'+BandWidth_24+"/"+BandWidth_5+'">'+BandWidth_24+'</span>';
					}else{
						tempObj.BandWidth='<span class="quick_span bandWidth" data-mac="'+ data[i]["mac"] +'" bandwidth="'+BandWidth_24+"/"+BandWidth_5+'">'+BandWidth_24+"/"+BandWidth_5+'</span>';
					}
					
					tempObj.TxPower='<span class="quick_span TxPower"  data-mac="'+ data[i]["mac"] +'">'+data[i]["TxPower0"]+"/"+data[i]["TxPower1"]+'</span>';
					new_data.push(tempObj);
				}
		
			me.dataTable = new top.Table("rf_settings_table",appJs.ac_ap_online_table,new_data,{
				size: 20,
				showTotalPageNum:true,
				showTotalDataNum:true,
				showHomeAndEnd:true,
				// showEditPage:true,
				 index:table_page["page"],
				 // sortable:true,
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
								// console.log(b)
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
								var a1=a.Channel.slice(a.Channel.indexOf(">")+1,a.Channel.indexOf("</span>")).split("/");
								var b1=b.Channel.slice(b.Channel.indexOf(">")+1,b.Channel.indexOf("</span>")).split("/");
								
								if(a1[0]==b1[0]){
									return a1[1]-b1[1];
								}else{
									return a1[0]-b1[0];
								}
								
							}
						},
						
						{
							sortEvent:function(a,b){
								var a1=a.BandWidth.slice(a.BandWidth.indexOf('bandwidth="')+11,a.BandWidth.indexOf(">")-1).split("/").join(".");
								var b1=b.BandWidth.slice(b.BandWidth.indexOf('bandwidth="')+11,b.BandWidth.indexOf(">")-1).split("/").join(".");
								a1=a1.split("M").join("");
								b1=b1.split("M").join("");
								
								a1=a1.split(L.auto).join(0);
								b1=b1.split(L.auto).join(0);
								
								a1=a1.split(".");
								b1=b1.split(".");
								
								if(a1[0]==b1[0]){
									return a1[1]-b1[1];
								}else{
									return a1[0]-b1[0];
								}
								
								
							}
						},
						
						{
							sortEvent:function(a,b){
								var a1=a.TxPower.slice(a.TxPower.lastIndexOf('">')+2,a.TxPower.indexOf("</span>")).split("/");
								var b1=b.TxPower.slice(b.TxPower.lastIndexOf('">')+2,b.TxPower.indexOf("</span>")).split("/");
							// console.log(a)
								
								if(a1[0]==b1[0]){
									return a1[1]-b1[1];
								}else{
									return a1[0]-b1[0];
								}
							
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
		$("#rf_settings_details").addClass("off");
		$("#rf_settings_list").removeClass("off");
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
			wireless_base_change($(this).attr("cregion"),index);
			
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
			//设置
			$("body").undelegate("#rf_settings_list button.button-set","click").delegate("#rf_settings_list button.button-set","click",function(){
				

				me.led_data=[];
				var select_checkbox=me.checkbox_length_fun();
				if(select_checkbox.length==0 && !$("#select_All").prop("checked")){
					show_message("error",L.check_one);
					return false;
				}
				
				
				me.led_data=select_checkbox;
				//console.log(me.led_data,encrypt_mac(me.led_data));
				
				
				$("#rf_settings_details").modal();
				if(me.led_data.length>1){//undefined就是批量设置多个
					var newData= management.ac_wifi_data;
				}else{
					var newData= me.thisData_f(me.ac_ap_online_data,me.led_data);
				}
				
			

				if(select_checkbox.length==1){
					
					$("#channel_2_4").val(newData.Channel0)
					$("#channel_5").val(newData.Channel1)
					$("#bandwidth_2_4").val(newData.BandWidth0)
					$("#bandwidth_5").val(newData.BandWidth1).attr("CRegion",newData.CountryRegion);
					$("#power_2_4").val(newData.TxPower0)
					$("#power_5").val(newData.TxPower1)
					channel_return(newData.BandWidth1,newData.CountryRegion,"channel_5",newData.Channel1)
					
				}else{
					channel_return("auto",newData.CountryRegion,"channel_5")
					$("#channel_2_4").val("-1")
					$("#channel_5").val("-1")
					$("#bandwidth_2_4").val("-1")
					$("#bandwidth_5").val("-1").attr("CRegion",newData.CountryRegion)
					$("#power_2_4").val("-1")
					$("#power_5").val("-1")
				}
				
				

			});
			$("body").undelegate("#rf_settings_table .quick_span","click").delegate("#rf_settings_table .quick_span","click",function(){
				$(this).parents("tr").children("td").eq(0).children("input").addClass("checkedCurrent").val(1);
				$("#rf_settings_list .button-set").click();
				
			});
//			全选
			$("body").undelegate("#rf_settings_list #select_All","click").delegate("#rf_settings_list #select_All","click",function(){
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
			$("body").undelegate("#rf_settings_details button.btn-cancel","click").delegate("#rf_settings_details button.btn-cancel","click",function(){
				
				management.empty();
			});
			$("body").undelegate("#rf_settings_details button.btn-confirm","click").delegate("#rf_settings_details button.btn-confirm","click",function(){
				console.log(me.led_data);
				var paramArr = [];
				var param_2_4_g={},param_5_g={};
				param_2_4_g["idx"]="0";
				
				if($("#power_2_4").val()!="-1"){
					param_2_4_g["TxPower"]=$("#power_2_4").val();
				}
				if($("#bandwidth_2_4").val()!="-1"){
					param_2_4_g["BandWidth"]=$("#bandwidth_2_4").val();
				}
				if($("#channel_2_4").val()!="-1"){
					param_2_4_g["Channel"]=$("#channel_2_4").val();
				}
				
				param_5_g["idx"]="1";
				if($("#power_5").val()!="-1"){
					param_5_g["TxPower"]=$("#power_5").val();
				}
				if($("#bandwidth_5").val()!="-1"){
					param_5_g["BandWidth"]=$("#bandwidth_5").val();
				}
				if($("#channel_5").val()!="-1"){
					param_5_g["Channel"]=$("#channel_5").val();
				}
				
//				for(var i=0;i<me.led_data.length;i++){
					if(!$("#select_All").prop("checked")){
						param_2_4_g["mac"]=encrypt_mac(me.led_data);
						param_5_g["mac"]=encrypt_mac(me.led_data);
					}
					
					if(param_2_4_g["TxPower"]!=undefined || param_2_4_g["BandWidth"]!=undefined || param_2_4_g["Channel"]!=undefined){
						var s= JSON.stringify({"jsonrpc": "2.0", "id": 19, "method": "call", "params": [localStorage.getItem('token_id'), "acap","ac_wifi_adv2_cfg_set",param_2_4_g]})
						paramArr.push(s)
					}
					if(param_5_g["TxPower"]!=undefined || param_5_g["BandWidth"]!=undefined || param_5_g["Channel"]!=undefined){
						var s= JSON.stringify({"jsonrpc": "2.0", "id": 19, "method": "call", "params": [localStorage.getItem('token_id'), "acap","ac_wifi_adv2_cfg_set",param_5_g]})
						paramArr.push(s)
					}
					
//				}
				console.log(param_2_4_g,param_5_g,param_2_4_g["Channel"],paramArr,paramArr.length);
				if(paramArr.length!=0){
//					show_message("save");
					var flag = true;
					request({
						url:"/ubus",
						data:"[" + paramArr + "]"
					}).done(function(data){
						for(var i in data){
							if(data[i].result){
								if(data[i].result[0]!=0){
									show_message_gt("error",data[i].result[0]);
									
									flag = false;
									break;
								}
							}
							else{
								show_message_gt("error",data[i].error.code);
								
								flag = false;	
								break;
							}
						}
						if(flag){
							show_message("success",appJs.rf_settings_title[0]);
							console.log(param_2_4_g);
							if(param_2_4_g.mac!=undefined){
							var editmac=param_2_4_g.mac.split("#");
							for(var i=0;i<$(".bandWidth").length;i++){
								for(var j=0;j<editmac.length;j++){
									if($(".bandWidth").eq(i).attr("data-mac")==editmac[j]){
										var BandWidth_24,BandWidth_5;
										if(param_2_4_g.BandWidth=="auto" || param_2_4_g.BandWidth==undefined){
											BandWidth_24=L.auto;
										}else{
											if(param_2_4_g.BandWidth=="40M+"){
												BandWidth_24="40M";
											}else{
												BandWidth_24=param_2_4_g.BandWidth;
											}
										}
										
										if(param_5_g.BandWidth=="auto" || param_5_g.BandWidth==undefined){
											BandWidth_5=L.auto;
										}else{
											if(param_5_g.BandWidth=="40M+"){
												BandWidth_5="40M";
											}else{
												BandWidth_5=param_5_g.BandWidth;
											}
										}
										var oldData={};
											oldData.channel=$(".channel").eq(i).html().split("/");
											oldData.bandWidth=$(".bandWidth").eq(i).html().split("/");
											oldData.TxPower=$(".TxPower").eq(i).html().split("/");
										if(param_2_4_g.Channel==undefined){
											param_2_4_g.Channel=oldData.channel[0];
										}	
										if(param_5_g.Channel==undefined){
											param_5_g.Channel=oldData.channel[1];
										}
										if(BandWidth_24==undefined){
											BandWidth_24=oldData.bandWidth[0];
										}	
										if(BandWidth_5==undefined){
											BandWidth_5=oldData.bandWidth[1];
										}
										if(param_2_4_g.TxPower==undefined){
											param_2_4_g.TxPower=oldData.TxPower[0];
										}	
										if(param_5_g.TxPower==undefined){
											param_5_g.TxPower=oldData.TxPower[1];
										}
											
										// console.log("没修改前",oldData);
										// $(".channel").eq(i).html(param_2_4_g.Channel+"/"+param_5_g.Channel);
										// if(BandWidth_24==L.auto && BandWidth_5==L.auto ){
										// 	$(".bandWidth").eq(i).html(BandWidth_24);
										// }else{
										// 	$(".bandWidth").eq(i).html(BandWidth_24+"/"+BandWidth_5);	
										// }
										
										// $(".TxPower").eq(i).html(param_2_4_g.TxPower+"/"+param_5_g.TxPower);
										
									var obj={};
										obj["Channel"]='<span class="quick_span channel" data-mac="'+editmac[j]+'">'+param_2_4_g.Channel+"/"+param_5_g.Channel+'</span>'
										obj["BandWidth"]='<span class="quick_span bandWidth" data-mac="'+editmac[j]+'" bandwidth="'+BandWidth_24+"/"+BandWidth_5+'">'+BandWidth_24+"/"+BandWidth_5+'</span>'
										obj["TxPower"]='<span class="quick_span TxPower"  data-mac="'+editmac[j]+'">'+param_2_4_g.TxPower+"/"+param_5_g.TxPower+'</span>'
										
										me.dataTable.updateOriginData(obj, 'data-mac="'+ editmac[j] +'"');
									}
								}
								
							}
							}else{
								me.get_ap_manage_data()
							}
							me.empty();
							$("#rf_settings_details").modal("hide");
						}
					}).fail(function(data){
						//show_request_err(data);
					})
				}else{
					show_message("success");
					$("#rf_settings_details").modal("hide");
				}
			});
		},
	
	init:function(){
		var me = this;
		
		this.get_ap_manage_data();
		this.add_event();
		
	}
}
//根据频宽和地区返回信道
function channel_return(bandwidth,area,id,channel){
	
	var data;
	if(bandwidth=="160M"){//160M仅在36-64信道上生效
		if(area==3){
			data=regionSelection.europe;
		}else {
			data=regionSelection.intermediate_channel;
		}
	}else{
		if(area==2 || area==7 || area==8 ){
			data=regionSelection.usa;
		}else if(area==3){
			data=regionSelection.europe;
		}else if(area==1 || area==4 || area==6){
			data=regionSelection.russia;
		}else if(area==5){
			data=regionSelection.bangladesh;
		}
	}
	
	if(bandwidth=="20M" && area!=3  && area!=5){
		if(data.indexOf(165)==-1){
			data.push(165);
		}
		
	}else{
		if(data.indexOf(165)!=-1){
		
			data=$.grep(data,function(value){  return value !=165})
		}
	}
	$("#"+id).html(regionSelectionHandle(data));
	if(channel!=undefined){
		$("#"+id).val(channel)
	}
}
//根据区域来重新定义信道可选
function regionSelectionHandle(data){
	var newData="<option value='-1'>"+appJs["no_edit"][0]+"</option><option value='0'>"+L.auto+"</option>";
	for(var i=0;i<data.length;i++){
		var template="<option value='"+data[i]+"'>"+L.channel+" "+data[i]+"</option>";
		newData+=template;
	}
	return newData;
}

//	监听5g无线信道,当无线信道为165时,让频道宽带智能选自动和20m
function wireless_base_change(countryRegion,data){
	if(data==undefined){
		var wlb_5_channel_width_sel=$("#bandwidth_5").val();
	}else{
		var wlb_5_channel_width_sel=data;
	}
	
	 channel_return(wlb_5_channel_width_sel,countryRegion,"channel_5")

//		console.log(wireless_sel_5g);
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
