var speedLimit_submit={};//限速要上传的文件
var blacklist_data={};//上网黑名单数据
var online_refresh_time = 2;
var black_refresh_time = 5;
var hardwareSpeedup;//加速开关是否开启
var timer = null;
var appJs = null;
current_html = "networkingEquipment";
//联网设备
$(document).ready(function(){
	init_breadcrumbs();
	render_page();
	show_loading_page();
	init_reset_dialog();
	lang.init(language[language_type]["PAGES"][current_html]);
	appJs = language[language_type]["PAGES"][current_html]["js"];			   
	$(".tab_area").on("click",".tab-item",function(){//tab标签切换
		var index = $(this).index();
		if(index==0){
			mtkhnat_get();
			getdeviceslist();
	   }else{
			getblacklist();	
	   }
		$(".tab_area .tab-item").removeClass("selection");
		$(this).addClass("selection");
		$(".infoone").addClass("hidden");
		$(".infoone").eq($(this).index()).removeClass("hidden");
		
	})
	mtkhnat_get();
	
	$("body").undelegate(".limit-speed-button","click").delegate(".limit-speed-button","click",function(){
		paint_limit_speed($(this));
		speed_limit_show($(this));
		if(hardwareSpeedup==1){
			$("#resetModal").modal();
		}
		
		
	});
	
	$("body").undelegate(".pull-black-button","click").delegate(".pull-black-button","click",function(){
		pull_black($(this));
	});
	
	$("body").undelegate(".relieve-black-button","click").delegate(".relieve-black-button","click",function(){
		relieve_black_out($(this));
	});
	
	$("body").undelegate(".speed-control","keyup").delegate(".speed-control","keyup",function(){
		var ret = formatLimitSpeed($(this).val());
		$(this).val(ret);
	});
	
	
	$("body").undelegate(".cancel-button","click").delegate(".cancel-button","click",function(){
		speed_limit_cancel($(this));
	});
	
	$("body").undelegate(".submit-button","click").delegate(".submit-button","click",function(){
		speed_limit_set($(this));
	});
	
	$("body").undelegate(".name-section .titleName","click").delegate(".name-section .titleName","click",function(){
		edit_name_set($(this));
		
	});
	
	$(".tab-item").eq(0).click();

});
function init_reset_dialog(){
	$("#resetModal .modal-title").html(language[language_type]["DIALOG"]["open_qos"].title);
	var $p = $("<p/>").attr("class","single-tip").html(language[language_type]["DIALOG"]["open_qos"].content);
	$("#resetModal .modal-body").html($p);
	$("#resetModal .btn-cancel").off("click").on("click",function(){//取消
		$(".detail_view").remove();
		mtkhnat_get();
		getdeviceslist();
		$("#resetModal").modal("hide");
	});
	$("#resetModal .btn-confirm").off("click").on("click",function(){//确定
		$("#resetModal").modal("hide");
	});
}
function formatLimitSpeed(value){
	return value.replace(/^(0+)|[^\d]+/g,"");
}
//限速开关
function mtkhnat_get(){
	var get_nat='{"jsonrpc": "2.0", "id": 9, "method": "call", "params": [ "'+localStorage.getItem('token_id')+'", "uci", "get", {"config": "mtkhnat","section":"global","option":"enable"} ] }'
	 request({
			url:"/ubus",
			data:get_nat
		}).done(function(data){
			if(check_data(data)){   	
				if(data.result!=undefined && data.result[0]==0){	
	           		hardwareSpeedup=data.result[1].value;
	           		
				}else{
					hide_loading_page();
				show_err_page();	
				}
				hide_loading_page();
				show_content();
			}
		}).fail(function(data){
			hide_loading_page();
				show_err_page();	
		})
}
//限速开关
function mtkhnat_set(){
	var get_nat='{"jsonrpc": "2.0", "id": 9, "method": "call", "params": [ "'+localStorage.getItem('token_id')+'", "uci", "set", {"config": "mtkhnat","section":"global","values":{"enable":"0"}} ] }'
	  request({
			url:"/ubus",
			data:get_nat
		}).done(function(data){
			if(check_data(data)){   	
				var applyUci_data=applyUci();
				if(applyUci_data==0 || applyUci_data==5){
					if(check_data(data)){   
		            	if(data.result!=undefined && data.result[0]==0){
		            			mtkhnat_get();
								
						}else{
								show_message_gt("error",data.error.code);
						}
					
					}else{
						show_message_gt("error",applyUci_data);
					}
		            
			}
				}
		}).fail(function(data){
			//show_request_err(data);
		})
	 
}
//联网设备检测
function getdeviceslist(){
	if(timer)
		window.clearTimeout(timer);
	(function(){
		var callFn = arguments.callee;
		var a2='{"jsonrpc": "2.0", "id": 2, "method": "call", "params": [ "'+localStorage.getItem('token_id')+'", "devices_app", "get_host_info", { } ] }'
		

		request({
			url:"/ubus",
			data:a2
		}).done(function(data){
			data=JSON.stringify(data);
				data = eval("(" + data + ")");
				if(check_data(data)){
					var dataHost=data.result[1].hosts;	
					var onInternet_data=new Array();//在线设备数据
					for(var i=0;i<dataHost.length;i++){
						if(dataHost[i].online==true && dataHost[i].almac=="00:00:00:00:00:00"){
							onInternet_data.push(dataHost[i]);
						}
					}
					handle_getdeviceslist(onInternet_data);
					if(timer)
						window.clearTimeout(timer);
					timer =  window.setTimeout(callFn, online_refresh_time * 1000);
				}
				else{
					if(timer)
						window.clearTimeout(timer);
				}
		}).fail(function(data){
			//show_request_err(data);
		})
	
	})();
}

//处理获取的设备检测值
function handle_getdeviceslist(onInternet_data){
	table_page["page"]=page_id("online_list_tab");
//	console.log("99",current_pages_lenght>1,current_pages_lenght)
//	console.log(onInternet_data);
	$(".online-device-count").html(onInternet_data.length);//赋值上网设备
	var new_data = formatOnlineData(onInternet_data);
	var tab = new window.top.Table("online_list_tab",null,new_data,{colspan:4},table_page["page"]);
	tab.initTable();

}


function formatOnlineData(data){
    var reData = [];
	var limit_tag = '<span class="tag">'+ appJs.limited_speed +'</span>';
	
	for(var i in data){
		var  limit_str = "";
		console.log(hardwareSpeedup);
		if(hardwareSpeedup=="0"){
			if(data[i]["lt_up"] * 1 != 0 || data[i]["lt_down"] * 1 != 0){
				limit_str = limit_tag;
			}
		}
		var connect_type = ""
	
		var is_internet={};//0是未知 1是有线  2是无线2.4g  3是5g
		if(data[i]["is_wifi"]==1 && data[i]["is_5g"]==0){
			is_internet.wifi=2;
			connect_type = "wireless_2g";
		}else if(data[i]["is_wifi"]==1 && data[i]["is_5g"]==1){
			is_internet.wifi=3;
			connect_type = "wireless_5g";
		}else{
			is_internet.wifi=1;
			connect_type = "eth";
		}
		var alias=cutString(data[i]["alias"],20);
		var timeObj = convert_time(data[i]['second']);
		var onlineTimeStr = timeObj.day ? timeObj.day + L.day : "" + timeObj.hour ? timeObj.hour + L.hour : "" + timeObj.minute ? timeObj.minute + L.minute : "" + timeObj.second ? timeObj.second + L.second : "";
		
		var newMac=data[i]["mac"];
        var tempObj = {};
        tempObj.row1 = '<div class="name-section '+ connect_type +'"><span class="titleName" title="' + (data[i]["alias"] || L.unnamed_device) + '">' + (alias || L.unnamed_device) + '</span><input type="text" mac="'+newMac+'" style="display:none" class="edit-name"  value="'+data[i]["alias"]+'">'+ limit_str +'</div><div class="time-section"><span>'+ appJs.online_time +'</span>' + onlineTimeStr + "</span></div>";
//      tempObj.row4='<span class="internet_access ">'+is_internet.name+'</span>';
        tempObj.row2 = '<div class="ip-section"><span>IP:</span><span class="txt">' + data[i]["ip"] + '</span></div><div class="mac-section"><span>MAC:</span><span class="txt">' + data[i]["mac"] + "</span></div>";
		tempObj.row3 = '<div class="speed-section speed-up-section"><i class="icon"></i><span>'+ appJs.uplink_speed +'</span>' + formatSpeed(data[i]["up_speed"]).allValue + '</div><div class="speed-section speed-down-section"><i class="icon"></i><span>'+ appJs.downlink_speed +'</span>' + formatSpeed(data[i]["down_speed"]).allValue + "</div>"; 
		tempObj.op = '<div class="ctrl-section"><button type="button" class="limit-speed-button smaller" data-mac='+ data[i]["mac"] +' data-index='+ i +'>'+ appJs.limit_speed +'</button><button type="button" class="pull-black-button smaller darkgray" data-mac='+ data[i]["mac"] +'>'+ appJs.pull_black +'</button></div>';
        reData.push(tempObj);
    }
    return reData;
}



//显示限速文本框
function paint_limit_speed(elem){
	var root = null;
	var parent = $(elem).parents();
	var index = $(elem).attr("data-index");
	var mac = $(elem).attr("data-mac");
	var $tr = null;
	parent.each(function(k,v){
		if(v.nodeName == "TABLE"){
			root = $(v)
		}
		if(v.nodeName == "TR"){
			$tr = $(v);
		}
	});
	//不要改变当前的状态点击行的状态，只改变其他行的状态
	root.find(".detail_view").remove();
	root.find(".plus:not("+ index +")").removeClass("plus");
	root.find(".minus:not("+ index +")").removeClass("minus");
	
	var tpl = '<div class="limit-speed-panel clearfix">' +
				'<div class="speed-cnt-section">' + 
				'	<span><label>'+ appJs.uplink_speed +'：</label><input type="text" id="uplink" class="input-small speed-control" value="0" maxlength="5" /><i>KB/s</i></span>' +
				'	<span><label>'+ appJs.downlink_speed +'：</label><input type="text" id="downlink" class="input-small speed-control" value="0" maxlength="5" /><i>KB/s</i></span>' +
				'	<span class="limit-tip">'+ appJs.not_limit +'</span>' +
				'</div>' +
				'<div class="speed-ctrl-section">' +
				'	<button class="submit-button smaller" data-mac='+ mac +'>'+ appJs.btn_confirm +'</button>' +
				'	<a href="javascript:void(0);" class="cancel-button" data-mac='+ mac +'>'+ appJs.btn_cancel_limit +'</a>' +
				'</div>' +
			'</div>';
			
	
	var str = '';
	str += '<tr class="detail_view">';
	str += '<td colspan="4">'+ tpl +'</td>';
	str += '</tr>';
	
	if ($tr.hasClass("plus")) {//折叠状态
		$tr.removeClass("plus").addClass("minus");
		$tr.after(str);
	}
	else if($tr.hasClass("minus")){//展开状态
		$tr.removeClass("minus").addClass("plus");
		//root.find(".detail_view").remove();
	}
	else{//默认状态
		$tr.addClass("minus");
		$tr.after(str);
	}
}

function speed_limit_show(elem){
	var mac = elem.attr("data-mac");
	var a2='{"jsonrpc": "2.0", "id": 2, "method": "call", "params": [ "'+localStorage.getItem('token_id')+'", "devices_app", "get_host_info", { } ] }'
	

		request({
			url:"/ubus",
			data:a2
		}).done(function(data){
			data=JSON.stringify(data);
				data = eval("(" + data + ")");
				clearTimeout(timer);
				if(check_data(data)){
					var dataHost=data.result[1].hosts;	
					for(var i in dataHost){
						if(dataHost[i].mac == mac){
							$("#downlink").val(dataHost[i].lt_down);
							$("#uplink").val(dataHost[i].lt_up);
							break;
						}
					}
					
				} 	
		}).fail(function(data){
			//show_request_err(data);
		})
	
}
var edit_mac;
//修改名称
function edit_name_set(elem){
	speed_limit_show($(this));//停止循环
	edit_mac="";
	var input_t=$(elem).siblings("input");
	$("#addModal").modal();
	input_t.focus();
	input_t.select();
	edit_mac=$(input_t).attr("mac");
	
	$("#equipment_name").val($(input_t).val());
	$("#addModal .btn-confirm").off("click").on("click",function(){
		if(check_input("i_equipment_name_frm")){
			onfocusName(elem);
		}
			
		});
//	$("#addModal .btn-cancel").off("click").on("click",function(){
//			getdeviceslist();
//		});
//	getdeviceslist();//再次循环
}

function onfocusName(elem){
		var set_data={"mac":edit_mac,"alias":$("#equipment_name").val()};
		console.log(set_data)
		if(set_data.alias==""){
			return false;
		}
		show_message("save");
		var set_alias_data={"jsonrpc": "2.0", "id": 3, "method": "call", "params": [ localStorage.getItem('token_id'), "devices_app", "set_alias",set_data] };
		set_alias_data=JSON.stringify(set_alias_data);
	
		request({
			url:"/ubus",
			data:set_alias_data
		}).done(function(data){
			if(check_data(data)){
			 	$("#addModal").modal("hide");
			 	if(data.result[0]==0){
					show_message("success");
				}
				else{
					show_message_gt("error",data.result[0]);
				}
			 }
		}).fail(function(data){
			//show_request_err(data);
		})
		getdeviceslist();//再次循环
}
//输入限速值后,获取限速的值
function speed_limit_set(elem){
	show_message("save");
	speedLimit_submit.down = $("#downlink").val() * 1;//获取下载速度
	speedLimit_submit.up = $("#uplink").val() * 1;//获取上传速度
	speedLimit_submit.mac = $(elem).attr("data-mac");
	speedLimit_submit.enable = true;
	speedLimitSubmit();
}



//取消限行速度
function speed_limit_cancel(elem){
	show_message("save");
	speedLimit_submit.down = 0;//获取下载速度
	speedLimit_submit.up = 0;//获取上传速度
	speedLimit_submit.enable = false;
	speedLimit_submit.mac = $(elem).attr("data-mac");
	speedLimitSubmit();
}
	
//调用修改限速接口
function speedLimitSubmit(){
	var subdata={"jsonrpc": "2.0", "id": 3, "method": "call", "params": [ localStorage.getItem('token_id'), "devices_app", "set_speed_limit",speedLimit_submit] };
	subdata=JSON.stringify(subdata);
	

		request({
			url:"/ubus",
			data:subdata
		}).done(function(data){
			data=JSON.stringify(data);
			data = eval("(" + data + ")");
			if(check_data(data)){
				if(data.result){
					if(data.result[0]==0){
						show_message("success");
						$(".detail_view").remove();
						if(hardwareSpeedup==1){
							mtkhnat_set();
						}
						
						getdeviceslist();
						
					}
					else{
						show_message_gt("error",data.result[0]);
					}
				}
				else{
					show_message_gt("error",data.error.code);
				}
			}
		}).fail(function(data){
			//show_request_err(data);
		})
	
}
//拉黑
function pull_black(obj){
	show_message("wait",appJs.pulling_black);
	var mac = obj.attr("data-mac");
	var subdata={"jsonrpc": "2.0", "id": 4, "method": "call", "params": [ localStorage.getItem('token_id'), "devices_app", "set_black",{"mac":mac,"enable":true}] };
	subdata=JSON.stringify(subdata);
	

		request({
			url:"/ubus",
			data:subdata
		}).done(function(data){
			 if(check_data(data)){
				if(data.result){
					if(data.result[0]==0){
						show_message("success");
						mtkhnat_set();
						getdeviceslist();
					}else{
						show_message_gt("error",data.result[0]);
					}
				}
				else{
					show_message_gt("error",data.error.code);
				}
			}
		}).fail(function(data){
			//show_request_err(data);
		})
	
}
//调用拉黑黑名单接口
function getblacklist(){
   if(timer)
		window.clearTimeout(timer);
   (function(){
		var callFn = arguments.callee;
		var a2='{"jsonrpc": "2.0", "id": 6, "method": "call", "params": [ "'+localStorage.getItem('token_id')+'", "devices_app", "get_black_list", { } ] }'
		
		

		request({
			url:"/ubus",
			data:a2
		}).done(function(data){
			data=JSON.stringify(data);
			data = eval("(" + data + ")");
			if(check_data(data)){
				blacklist_data=data.result[1].hosts;
				handle_getblacklist();
				if(timer)
					window.clearTimeout(timer);
				timer =  window.setTimeout(callFn, black_refresh_time * 1000);
			}
			else{
				if(timer)
					window.clearTimeout(timer);
			}
		}).fail(function(data){
			//show_request_err(data);
		})
		
	})(); 
}
//处理黑名单数据
function handle_getblacklist(){
	$(".black-device-count").html(blacklist_data.length);//赋值上网设备
	var new_data = 	formatBlackData(blacklist_data);
	var tab = new Table("black_list_tab",[],new_data);
			
		tab.initTable();

	
}

function formatBlackData(data){
    var reData = [];
	for(var i in data){
        var tempObj = {};
        tempObj.row1 = '<div class="name-section">' + (cutString(data[i]["alias"],20) || L.unnamed_device) + '</div><div class="time-section"><span>'+ appJs.relieve_time +'</span>' + transformTime(data[i]['black_time']) + "</div>";
        tempObj.row2 = '<div class="mac-section"><span>mac：</span>' + data[i]["mac"] + "</div>";
		tempObj.op = '<div class="ctrl-section"><button type="button" data-mac='+ data[i]["mac"] +' class="relieve-black-button smaller">'+ appJs.relieve_black +'</button></div>';
        reData.push(tempObj);
    }
    return reData;
}

//解除拉黑
function relieve_black_out(obj){
	show_message("wait",appJs.relieving_black);
	var mac = obj.attr("data-mac");
	var subdata={"jsonrpc": "2.0", "id": 5, "method": "call", "params": [ localStorage.getItem('token_id'), "devices_app", "set_black",{"mac":mac,"enable":false}] };
	subdata=JSON.stringify(subdata);
	request({
			url:"/ubus",
			data:subdata
		}).done(function(data){
			if(check_data(data)){
				if(data.result){
					if(data.result[0]==0){
						show_message("success");
						getblacklist();
					}else{
						show_message_gt("error",data.result[0]);
					}
				}
				else{
					show_message_gt("error",data.error.code);
				}
			}
		}).fail(function(data){
			//show_request_err(data);
		})

}


function transformTime(timestamp) {
	timestamp=Math.round(timestamp*1000)
    if (timestamp) {
        var time = new Date(timestamp);
        var y = time.getFullYear(); //getFullYear方法以四位数字返回年份
        var M = time.getMonth() + 1; // getMonth方法从 Date 对象返回月份 (0 ~ 11)，返回结果需要手动加一
        var d = time.getDate(); // getDate方法从 Date 对象返回一个月中的某一天 (1 ~ 31)
        var h = time.getHours(); // getHours方法返回 Date 对象的小时 (0 ~ 23)
        var m = time.getMinutes(); // getMinutes方法返回 Date 对象的分钟 (0 ~ 59)
        var s = time.getSeconds(); // getSeconds方法返回 Date 对象的秒数 (0 ~ 59)
        return y + L.year + M + L.month + d + L.s_day;
      } else {
          return '';
      }
}
