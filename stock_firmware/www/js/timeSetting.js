var submitData={};//时区提交代码
current_html = "timeSetting";
//时间设置
$(document).ready(function(){
	init_breadcrumbs();
	render_page();
	show_loading_page();
	lang.init(language[language_type]["PAGES"][current_html]);
	getTimeZone();
	get_local_time();
	//限制时间的输入的大小
		$('.form-control-small').keyup(function(){
			var timeName=$(this).attr("name");
			var timeData=$(this).val();
			
			if(timeName=="hour"){
				if(timeData>=24){
					$(this).val(23);
				}
			}else if(timeName=="minute" || timeName=="second"){
				if(timeData>=60){
					$(this).val(59);
				}
			}else if(timeName=="year"){
				var day_maximum=getMonthDays($("#system_year").val(),$("#system_month").val());
				$("#system_day").val(day_maximum);
			}else if(timeName=="month"){
				if(timeData>=12){
					$(this).val(12);
				}
				var day_maximum=getMonthDays($("#system_year").val(),$("#system_month").val());
				$("#system_day").val(day_maximum);
			}else if(timeName=="day"){
				var day_maximum=getMonthDays($("#system_year").val(),$("#system_month").val());
				if(timeData>=day_maximum){
					$(this).val(day_maximum);
				}
				
			}
		})
	
});

//文本框失去焦点时改变成td
function changeInput(data){
	 $(data).css("background-color","#f5f5f5");
}


function editableTable_click(){
	$("#editableTable tr td").on("click","input",function(event){ 

	  $(this).css("background-color","#ffffff");

	 }); 
}
//切换系统时间获取方式
function change_get_time_mode(value){
	//0是手动设置，1是ntp
//	console.log(value);
	if(value==0){
		$(".ntp_div").addClass('hidden');
		$(".manual_set_div").removeClass('hidden');
		$(".radio_all").eq(1).attr("checked","checked")
	}else if(value==1){
		$(".ntp_div").removeClass('hidden');
		$(".manual_set_div").addClass('hidden');
		$(".radio_all").eq(0).attr("checked","checked");
		
	}else{
//		console.log("value值有问题".value);
	}
}	


//获取当前系统时间
var localTimer;
function get_local_time(){
	(function(){
		var callFn = arguments.callee;
		
		var a1='{"jsonrpc": "2.0", "id": 18, "method": "call", "params": [ "'+localStorage.getItem('token_id')+'", "routerd", "get_local_time", {} ] }'
	
		request({
			url:"/ubus",
			data:a1
		}).done(function(data){
			data=JSON.stringify(data);
			data = eval("(" + data + ")");
			if(check_data(data)){
				$("#current_time").html(data.result[1].time);
				if(localTimer)
					window.clearTimeout(localTimer);
				localTimer =  window.setTimeout(callFn, 1000);
				hide_loading_page();
				show_content();
			}
			else{
				hide_loading_page();
				show_err_page();	
				$("#current_time").html("-");
				if(localTimer)
					window.clearTimeout(localTimer);
			}
		}).fail(function(data){
			hide_loading_page();
				show_err_page();	
		})
		
	})();
	
}

//获取时区和ntp服务器地址
function getTimeZone(){
	var a1='{"jsonrpc": "2.0", "id": 18, "method": "call", "params": [ "'+localStorage.getItem('token_id')+'", "uci", "get", {"config": "system"} ] }'

		request({
			url:"/ubus",
			data:a1
		}).done(function(data){
			data=JSON.stringify(data);
	        data = eval("(" + data + ")");
			if(check_data(data)){
				for(var i in data.result[1].values){
					if(i=="ntp"){
						handleTable(data.result[1].values[i]["server"]);
						change_get_time_mode(data.result[1].values[i]["enabled"]);//显示系统时间获取方式
					}else if(i=="DST"){
						
						
					}else{
						if(data.result[1].values[i]["timezone"]!=undefined){
							$("#time_zone_sel").val(data.result[1].values[i]["timezone"]);//时区
						}	
					}
				}
			}
		}).fail(function(data){
			//show_request_err(data);
		})
	var a2='{"jsonrpc": "2.0", "id": 18, "method": "call", "params": [ "'+localStorage.getItem('token_id')+'", "routerd", "get_local_time", {} ] }'
		request({
			url:"/ubus",
			data:a2
		}).done(function(data){
			data=JSON.stringify(data);
	        data = eval("(" + data + ")");
			if(check_data(data)){
//				console.log(data.result[1].time);
				var ck_system_time_obj = {};
				ck_system_time_obj.year = "";
			    ck_system_time_obj.month = "";
			    ck_system_time_obj.day = "";
			    ck_system_time_obj.hour = "";
			    ck_system_time_obj.minute = "";
			    ck_system_time_obj.second = "";
			    
			     var date_time = data.result[1].time.split(' ');
		        var _date = date_time[0].split('-');
		        var _time = date_time[1].split(':');
				if (data.result[1].time.length != 0) {
		            ck_system_time_obj.year = _date[0];
		            ck_system_time_obj.month = _date[1];
		            ck_system_time_obj.day = _date[2];
		            ck_system_time_obj.hour = _time[0];
		            ck_system_time_obj.minute = _time[1];
		            ck_system_time_obj.second = _time[2];
		            fiil_system_time(ck_system_time_obj);
		        }
			}
		}).fail(function(data){
			//show_request_err(data);
		})
		
		
}

function fiil_system_time(obj) {
    $("#system_year").val(obj.year);
    $("#system_month").val(obj.month);
    $("#system_day").val(obj.day);
    $("#system_hour").val(obj.hour);
    $("#system_minute").val(obj.minute);
    $("#system_second").val(obj.second);
}

function handleTable(data){
//	console.log(data,data.length);
if(data){
	for(var i=0;i<4;i++){
			var tempObj='<tr ><td><input class="f-border editInput" onblur="changeInput(this)" value='+data[i]+'></td></tr>';
		$("#editableTable").append(tempObj);
	}
}else{
	for(var i=0;i<4;i++){
			var tempObj='<tr ><td><input class="f-border editInput" onblur="changeInput(this)" ></td></tr>';
		$("#editableTable").append(tempObj);
	}
}
	
	editableTable_click();
	
}

//NTP(网上获取)提交
function submitNTP(){
	
	var eb=$(':radio[name="get_time_mode0"]:checked').val();
	var server=[]
	if(eb==1){//选择了NTP(网上获取)
		for(var i=0;i<4;i++){
			var a=$(".editInput").eq(i).val();
			if(a){
				server.push(a);
			}
		}
		if(server.length>0&&server.length!=4){
//			alert("服务器列表可以为空，或者必须传4个");
			return;
		}
		submitData.timezone=$("#time_zone_sel").val();
		submitData.zonename=$("#time_zone_sel").find("option:selected").text().replace(/\(.*?\)/g,'');
	//	设置时区
	show_message("save");
		var set1={"jsonrpc": "2.0", "id": 18, "method": "call", "params": [ localStorage.getItem('token_id'), "uci", "set", {"config": "system","type": "system","values":submitData} ] }
		set1=JSON.stringify(set1);
		var set3={"jsonrpc": "2.0", "id": 19, "method": "call", "params": [ localStorage.getItem('token_id'), "uci", "set", {"config": "system","type": "timeserver","values":{"server":server,"enabled":eb}} ] }
		set3=JSON.stringify(set3);
		
		$.when(setDataFn(set1),setDataFn(set3)).then(function(data1,data){
			data1=JSON.stringify(data1);
			  data1 = eval("(" + data1 + ")");
			data=JSON.stringify(data);
			 data = eval("(" + data + ")");
			if(check_data(data1)){
				if(check_data(data)){
				if(data.result){
					if(data.result[0]==0){
						var applyUci_data=applyUci();
						if(applyUci_data==0 || applyUci_data==5){
							show_message("success");
						
						}else{
							show_message_gt("error",applyUci_data);
						}
						
					}else{
						show_message_gt("error",data.result[0]);
					}
				}else{
						show_message_gt("error",data.error.code);
					}
			}else{
				show_message_gt("error",data.result[0]);
			}
			
			}else{
				show_message_gt("error",data1.result[0]);
			}
			
	            
		});
		
		
		
	}else if(eb==0){//选择了手动配置

		/*时间范围修改为2000-2033*/
		var $yearElem = $("#system_year");
		var check_year_result = check_year($yearElem.val());
		if (check_year_result !== true) {
			if (check_year_result === L.year_ck || ($yearElem.val() * 1 < 2000)) {
				show_differ_tip($yearElem, L.year_ck.replace("1970", "2000"));
			} else {
				show_differ_tip($yearElem, check_year_result);
			}
			return;
		} else if ($yearElem.val() * 1 < 2000) {
			show_differ_tip($yearElem, L.year_ck.replace("1970", "2000"));
			return;
		}
		
		if (check_input("system_time_frm")) {
				var mytime=$("#system_year").val()+"-"+$("#system_month").val()+"-"+$("#system_day").val()+" "+$("#system_hour").val()+":"+$("#system_minute").val()+":"+$("#system_second").val();
//		console.log(mytime)
		var set2={"jsonrpc": "2.0", "id": 18, "method": "call", "params": [ localStorage.getItem('token_id'), "routerd", "set_local_time", {"time":mytime}] }
		show_message("save");
		set2=JSON.stringify(set2);
		
		var set3={"jsonrpc": "2.0", "id": 19, "method": "call", "params": [ localStorage.getItem('token_id'), "uci", "set", {"config": "system","type": "timeserver","values":{"enabled":eb}} ] }
			set3=JSON.stringify(set3);
				
				
		$.when(setDataFn(set2)).then(function(data1){
				data1=JSON.stringify(data1);
	            data1 = eval("(" + data1 + ")");
				if(check_data(data1)){
					if(data1.result){
						if(data1.result[0]!=0){
							show_message_gt("error",data1.result[0]);
							return;
						}else{
							$.when(setDataFn(set3)).then(function(data){
								data=JSON.stringify(data);
						        data = eval("(" + data + ")");
								if(check_data(data)){
									if(data.result){
										if(data.result[0]==0){
											var applyUci_data=applyUci();
											if(applyUci_data==0 || applyUci_data==5){
												show_message("success");
												
											}else{
												show_message_gt("error",applyUci_data);
											}
										}else{
											show_message_gt("error",data.result[0]);
										}
									}
									else{
										show_message_gt("error",data.error.code);
									}
								}
								});
							}
						}
						
				}else{
					show_message_gt("error",data1.error.code);
				}
			});		

		}
	
		
	}

	
}
