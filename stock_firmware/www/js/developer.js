
current_html = "developer";
var network_submit={};
var timeZone;//记录时区
var qos_get_data;
//开发者模式
$(document).ready(function(){
	init_breadcrumbs();
	init_reset_dialog();
	render_page();
	show_loading_page();
	lang.init(language[language_type]["PAGES"][current_html]);
	
	
	
	//开关0是启用，1是禁用
		$(".enable_click").on('click',function(){//1关闭  0打开
			$(this).toggleClass("f-switchTrue");	
				if($(this).hasClass("f-switchTrue")){
					$(this).siblings(".checkboxAll").attr("value","1");			
					$(this).siblings(".checkboxAll").removeAttr("checked");
					
//					console.log("on开");
					
				}else{
					$(this).siblings(".checkboxAll").attr("value","0");
					$(this).siblings(".checkboxAll").removeAttr("checked");
//					console.log("off关");	
				}
				if($(this).hasClass("prompt_box") && $("#hardwareSpeedup").val()==1){
					$("#resetModal").modal();
				}
		})
	
	wireless_base_show("2G");
	qos_get();
});

function init_reset_dialog(){
	$("#resetModal .modal-title").html(language[language_type]["DIALOG"]["speed_up_prompt"].title);
	var $p = $("<p/>").attr("class","single-tip").html(language[language_type]["DIALOG"]["speed_up_prompt"].content);
	$("#resetModal .modal-body").html($p);
	$("#resetModal .btn-cancel").off("click").on("click",function(){//取消
		$("#hardwareSpeedup").val(0);
		$("#resetModal").modal("hide");
		$("#hardwareSpeedup").siblings(".button-label").removeClass("f-switchTrue");
	});
	$("#resetModal .btn-confirm").off("click").on("click",function(){//确定
		$("#resetModal").modal("hide");
		
	});
}
//qos状态获取
function qos_get(){
var a1='{"jsonrpc": "2.0", "id": 8, "method": "call", "params": [ "'+localStorage.getItem('token_id')+'", "uci", "get", {"config": "qos", "section": "global"} ] }'
	
		request({
			url:"/ubus",
			data:a1
		}).done(function(data){
			if(check_data(data)){   	
				if(data.result!=undefined && data.result[0]==0){
					var data=data.result[1].values;
					qos_get_data=data.enable;
					hide_loading_page();
				show_content();
				}
			}
		}).fail(function(data){
			hide_loading_page();
				show_err_page();
		})

}
function qos_set(){
	var setData={"jsonrpc": "2.0", "id":11, "method": "call", "params": [ localStorage.getItem('token_id'), "uci", "set", {"config": "qos","section": "global","values":{"enable":"0"} } ] }
	 setData=JSON.stringify(setData);
	 request({
			url:"/ubus",
			data:setData
		}).done(function(data){
			if(check_data(data)){ 
		 		qos_get();
		 	}
		}).fail(function(data){
			//show_request_err(data);
		})
}
//得到高级配置数据
function wireless_base_show(wafiNuml){
	 var a1='{"jsonrpc": "2.0", "id": 9, "method": "call", "params": [ "'+localStorage.getItem('token_id')+'", "uci", "get", {"config": "wificfg","section":"'+wafiNuml+'"} ] }'
	 request({
			url:"/ubus",
			data:a1
		}).done(function(data){
			 if(check_data(data)){   	
				if(data.result!=undefined && data.result[0]==0){	
	           		wireless_base_show2g(data.result[1].values);
				}else{
					console.log("获取失败")
				}
			}
		}).fail(function(data){
			//show_request_err(data);
		})
	 
	 
	var a2='{"jsonrpc": "2.0", "id": 10, "method": "call", "params": [ "'+localStorage.getItem('token_id')+'", "uci", "get", {"config": "upnpd","section": "config","option":"enabled"} ] }'
 
  	request({
			url:"/ubus",
			data:a2
		}).done(function(data){
			if(check_data(data)){ 
	  			$("#enable_upnp_2g").val(data.result[1].value);
	  			detect_switch_status();
	  		}
		}).fail(function(data){
			//show_request_err(data);
		})
  	
  	
	var get_nat='{"jsonrpc": "2.0", "id": 9, "method": "call", "params": [ "'+localStorage.getItem('token_id')+'", "uci", "get", {"config": "mtkhnat","section":"global","option":"enable"} ] }'
	 request({
			url:"/ubus",
			data:get_nat
		}).done(function(data){
			if(check_data(data)){   	
				if(data.result!=undefined && data.result[0]==0){	
	           		$("#hardwareSpeedup").val(data.result[1].value);
	           		detect_switch_status();
				}else{
					console.log("获取失败")
				}
			}
		}).fail(function(data){
			//show_request_err(data);
		})
}
//高配2g情况下赋值
function wireless_base_show2g(data){
	$("#wireless_fragment_2g").val(data.FragThreshold);
	$("#wireless_RTSThreshold_2g").val(data.RTSThreshold);
	$("#wireless_preamble_2g_sel").val(data.HT_GI);
	$("#wireless_ampdu_2g").val(data.PktAggregate);
	$("#wireless_Network_area").val(data.CountryRegion);
	timeZone=data.CountryRegion;
	detect_switch_status();
}

//页面检测开关
function detect_switch_status(){
	for(i=0;i<$(".checkboxAll").length;i++){
		if($(".checkboxAll").eq(i).val()==0){
			$(".checkboxAll").eq(i).siblings(".button-label").removeClass("f-switchTrue");
			$(".checkboxAll").eq(i).removeAttr("checked");
		}else if($(".checkboxAll").eq(i).val()==1){
			$(".checkboxAll").eq(i).siblings(".button-label").addClass("f-switchTrue");
			$(".checkboxAll").eq(i).attr("checked","checked");
		}
	}
}


//代码提交
function submitForm2(){
	
	network_submit={};//储存wireless_ap_adv_op要提交的数据
	network_submit.FragThreshold=$("#wireless_fragment_2g").val();
	network_submit.RTSThreshold=$("#wireless_RTSThreshold_2g").val();
	network_submit.HT_GI=$("#wireless_preamble_2g_sel").val();
	network_submit.PktAggregate=$("#wireless_ampdu_2g").val();
	network_submit.CountryRegion=$("#wireless_Network_area").val();
	if(network_submit.CountryRegion!=timeZone){//判断时区是否有修改
		network_submit.Channel=0;
	}
	if(check_input("wireless_advance_frm_2g")) {
		wireless_base_set(network_submit);//调用提交接口
		
	}
}




function wireless_base_set(network_submit){
	show_message("save");
	var upnp;
	upnp=$("#enable_upnp_2g").val();
	var a0={"jsonrpc": "2.0", "id": 8, "method": "call", "params": [ localStorage.getItem('token_id'), "uci", "set", {"config": "wificfg","section":"2G","values":network_submit} ] }
	 a0=JSON.stringify(a0);
	 
	var a1={"jsonrpc": "2.0", "id": 9, "method": "call", "params": [ localStorage.getItem('token_id'), "uci", "set", {"config": "wificfg","section":"5G","values":network_submit} ] }
	 a1=JSON.stringify(a1);
	var a2='{"jsonrpc": "2.0", "id": 10, "method": "call", "params": [ "'+localStorage.getItem('token_id')+'", "uci", "set", {"config": "upnpd","section": "config","values":{"enabled":"'+upnp+'"}} ] }'
	
	
//	硬件加速
var set_nat_val=$("#hardwareSpeedup").val();
	var set_nat='{"jsonrpc": "2.0", "id": 9, "method": "call", "params": [ "'+localStorage.getItem('token_id')+'", "uci", "set", {"config": "mtkhnat","section":"global","values":{"enable":"'+set_nat_val+'"}} ] }'
	
			
	var postCgi=function(){	
		if(qos_get_data=="1" && set_nat_val=="1"){
			qos_set();
		}
		


	$.when(setDataFn(a0),setDataFn(a1),setDataFn(a2)).then(function(data0,data1,data2){ 
		if(data0.result[0]==0 ){
			if(data1.result[0]==0){
				if(data2.result[0]==0){
					$.when(setDataFn(set_nat)).then(function(set_data){
						var applyUci_data=applyUci();
							if(applyUci_data==0 || applyUci_data==5){
								if(check_data(set_data)){   
					            	if(set_data.result!=undefined && set_data.result[0]==0){
					            			show_message("success");
											wireless_base_show("2G");
											
									}else{
											show_message_gt("error",set_data.error.code);
									}
								
								}else{
									show_message_gt("error",applyUci_data);
								}
					            
								}
					})
				}else{
					show_message_gt("error",data2.error.code);
				}
			}else{
				show_message_gt("error",data1.error.code);
			}
		}else{
			show_message_gt("error",data0.error.code);
		}
	})

	

	}
	var get_apply=get_apply_status();
	if(get_apply=="DONE"){

			postCgi();
			
		}else{
			get_apply_status_s("2G");
		}
//	console.log(a2);
}

function get_apply_status_s(value){
	var s;
	var a1='{"jsonrpc": "2.0", "id": 10, "method": "call", "params": [ "'+localStorage.getItem('token_id')+'", "wifi", "get_apply_status",  {} ] }'
	
	request({
			url:"/ubus",
			data:a1
		}).done(function(data){
			if(check_data(data)){  
			if(data.result[1]==undefined){
				s=data.result[0];
			}else{
				s=data.result[1].status;
			}
			if(s=="DONE"){
				wireless_base_set()
				
			
			}else{
				setTimeout(get_apply_status_s(value),5000);
			}}
		}).fail(function(data){
			show_message("error",data);
		})
	
	
}