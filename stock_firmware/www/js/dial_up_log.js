//拨号日志
current_html = "dial_up_log";
var current_time=Date.parse( new Date() ).toString();//当前时间
current_time = current_time.substr(0,10);

var newUptime;////当前时间减运营时间
var log = {
	clearLog:function(){
		var me = this;
		var param = '{"jsonrpc": "2.0", "id": 9, "method": "call", "params": [ "'+localStorage.getItem('token_id')+'", "dial_up_log", "clean_log", {}]}';
	
		request({
			url:"/ubus",
			data:param
		}).done(function(data){
			if(check_data(data)){   		
		
			        if(data.result){
						if(data.result[0]==0){
							show_message("success",L.del_suc);
							me.getLog();
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
	},
	
		
		
	
	format_time:function(data){
		var timeObj = convert_time(data);
		var str = "";
		if(timeObj.day){
			str = timeObj.day + L.day;
		}
		else{
			if(timeObj.hour){
				str = timeObj.hour + L.hour;
			}
			else{
				if(timeObj.minute){
					str = timeObj.minute + L.minute;
				}
				else{
					if(timeObj.second){
						str = timeObj.second + L.second;
					}
				}
			}
		}
		return str;
	},
	//获取当前时间
	running_time:function(){
		var dfd = $.Deferred();
			var routerd_info = '{"jsonrpc": "2.0", "id": 8, "method": "call", "params": ["'+localStorage.getItem('token_id')+'","routerd","info",{}]}';
		
			request({
				url:"/ubus",
				data:routerd_info
			}).done(function(data){
				if(check_data(data)){ 
					
					hide_loading_page();
					show_content();
					dfd.resolve(data.result[1]);
				}
			}).fail(function(data){
				hide_loading_page();
				show_err_page();	
				dfd.reject();
			})
			  return dfd.promise();
		},
	getLog:function(){
		
		var me = this;
		var param = '{"jsonrpc": "2.0", "id": 9, "method": "call", "params": [ "'+localStorage.getItem('token_id')+'", "dial_up_log", "get_log", {"start": 0,"cnt": 50000}]}';
	
		request({
			url:"/ubus",
			data:param
		}).done(function(data){
			if(check_data(data)){   	
				var logs = data.result[1].logs;
				var arr = [];
				var index = 1;
				for(var i in logs){
					var obj = {};
					obj.index = index;
				
					if(logs[i].type == "dhcp"){
						obj.event = language[language_type]["JOURNAL"]["LOG_CONNECT_STANDARD_DHCP_action"][logs[i]["sub_type"]];
						if(logs[i]["sub_type"] == "bound"){
							obj.event = obj.event.replace("{{ip}}",logs[i]["info"]["ipaddr"]);
							obj.event = obj.event.replace("{{time}}",me.format_time(logs[i]["info"]["lease_time"]));
						}
					}
					else if(logs[i].type == "pppoe"){
						obj.event = language[language_type]["JOURNAL"]["LOG_CONNECT_STANDARD_PPPOE_action"][logs[i]["sub_type"]];
						
						if(logs[i]["sub_type"] == "get_ip"){
							obj.event = obj.event.replace("{{ip}}",logs[i]["info"]["ipaddr"]);
						}
						
						if(logs[i]["sub_type"] == "auth_result"){
							if(logs[i]["info"]["auth_result"] == "ok"){
								obj.event = language[language_type]["JOURNAL"]["LOG_CONNECT_STANDARD_PPPOE_action"]["auth_ok"];
							}
							else{
								obj.event = language[language_type]["JOURNAL"]["LOG_CONNECT_STANDARD_PPPOE_action"]["auth_fail"];
							}
						}
						
						if(logs[i]["sub_type"] == "auth_type"){
							obj.event = obj.event.replace("{{auth_type}}",logs[i]["info"]["auth_type"].toUpperCase());
						}
						
					}
					else{
						obj.event = language[language_type]["JOURNAL"]["LOG_CONN_DISC_action"][logs[i]["sub_type"]];
						
						if(logs[i]["sub_type"] == "up"){
							obj.event = obj.event.replace("{{speed}}",logs[i]["info"]["speed"] + "Mbps");
							obj.event = obj.event.replace("{{duplex}}",logs[i]["info"]["duplex"] == "full" ? L.full_duplex : L.L.half_duplex);
						}
						
					}
					var newtime=newUptime+data.result[1].logs[i].time;
						
//						console.log(newUptime,data.result[1].logs[i].time)
						obj.time=format_fn('Y-m-d H:i:s',newtime)
					index++;
					arr.push(obj);
				}
				
				me.paintLog(arr);
			}
		}).fail(function(data){
			//show_request_err(data);
		})
		
	},

	paintLog:function(data){
//		    if(data.length==0){
				
//				 var tab = new Table("logTab", null, data);
//			}else{
				 var tab = new Table("logTab", [L.index, L.s_event,L.s_time], data);
//			}
		
		 tab.initTable();
	},
	addEvent:function(){
		var me = this;
		$("#log_delete_btn").off("click").on("click",function(){
			me.clearLog();
		});
		
		$(".refresh_btn").off("click").on("click",function(){
			
			me.getLog();
		});
		
	},
	init:function(){
		var me = this;
		this.addEvent();
		$.when(this.running_time()).then(function(data){
				newUptime=current_time-data.uptime;
				me.getLog();
		});
		
	}
};


$(document).ready(function(){
	init_breadcrumbs();
	render_page();
	show_loading_page();
	lang.init(language[language_type]["PAGES"][current_html]);
	$(".refresh_btn span").html(language[language_type]["BUTTON"]["btn-refresh"]);
	log.init();
	
});


