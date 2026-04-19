current_html = "access_control";
//访问控制
var select_data=[];//选中的数据存储
var action="";//页面规则
var delete_set={};//需要删掉的提交的数据
var onInternet_data=new Array();//在线设备数据
var offline_device=new Array();//离线设备保存
var all_equipment;//全部设备

var access_control = {
	delAll_D:null,
	singleDel_D:null,
	get_data:function(type){
		var me = this;
		var dfd = $.Deferred();
		var method = null;
		if(type == "base"){
			method = "FwBase_get";
		}
		else if(type == "mac_list"){
			method = "FwMacFilter_list";
		}
		else if(type == "url_list"){
			method = "url_rule_operation";
		}
		else if(type == "port_list"){
			method = "ip_rule_operation";
		}
		else if(type == "access_control_level"){
			method = "FwLevel_get";
		}
		var timer_get={"jsonrpc": "2.0", "id":24, "method": "call", "params": [ localStorage.getItem('token_id'), "devices_app", method, {"action":"dump"} ] }
		timer_get=JSON.stringify(timer_get);
		request({
			url:"/ubus",
			data:timer_get
		}).done(function(data){
			if(check_data(data)){	
				 if(type == "url_list"){
					me.url_filter.data.rules = data.result[1].rules;
				}
				else if(type == "port_list"){
					me.port_filter.data.rules = data.result[1].rules;
				}
				else if(type == "access_control_level"){
					me.access_control_level.data.Level = data.result[1].Level;
				}
				hide_loading_page();
				show_content();
				dfd.resolve();
			}	
			else{
				hide_loading_page();
				show_err_page();	
			}
		}).fail(function(data){
			hide_loading_page();
				show_err_page();	
		})
		
		
		return dfd.promise();
	},
	setDay:function(){
		var str = "";
		$(".day").each(function(k,v){
//			if($(v).hasClass("select")){
				str += $(this).attr("data-day");
//			}
		});
		return str;
	},
	check_time:function(ix){
			for(var i=0;i<ix;i++){
				if(!check_input("acc_set_frm"+i)){
					return;
				}
				//开始时间不能等于结束时间
				var s_hour = $("#start_hour"+i).val() * 1;
				var s_min = $("#start_minute"+i).val() * 1;
				
				var e_hour = $("#end_hour"+i).val() * 1;
				var e_min = $("#end_minute"+i).val() * 1;
				
				if(s_hour  == e_hour && s_min == e_min){
					var ss = appJs.time_equal;
					show_differ_tip($("#end_hour")+i,ss);
					
					return false;
				}
				else{
					var ss = appJs.endLtStart;
					if(s_hour  > e_hour){
						show_differ_tip($("#end_hour")+i,ss);
						
						return false;
					}
					else if((s_hour  == e_hour) && (s_min  > e_min)){
						show_differ_tip($("#end_hour")+i,ss);
						
						return false;
					}
				}
			}
			return true;
	},
	checkDay:function(newId){
			var flag = false;
			$(newId+" .day").each(function(k,v){
				if($(this).hasClass("select")){
					flag = true;
					return;
				}
			});
			return flag;
		},
	fillDay:function(day,newId){
			var me = this;
			$(newId+" .day").removeClass("select");
			if(day != ""){
				var dayArr = day.split("");
				for(var i in dayArr){
					
					if(dayArr[i]==1){
						$(newId+" .day").eq(i).addClass("select").attr("data-day",1); 
					}else{
						$(newId+" .day").eq(i).removeClass("select").attr("data-day",0); 
					}
				}
			}
		},
	initTimeStr:function(type,newId){
		$(newId).html("");
		var str = "";
		if(type == "1"){
			str += '	<div class="form-group clearfix">';
			str += '		<div class="col-xs-6 col-xs-offset-3 col-sm-offset-0 col-sm-4 col-md-4 col-lg-3 f-label-w">';
			str += '			<label class="f-label">'+  appJs.data_name +'</label>';
			str += '		</div>';
			str += '		<div class="col-xs-6 col-xs-offset-3 col-sm-offset-0 col-sm-8 col-md-8 col-lg-9 f-control">';
			str += '			<span class="day" data-day="0">'+  appJs.day_name[6] +'</span>';
			str += '			<span class="day" data-day="0">'+  appJs.day_name[0] +'</span>';
			str += '			<span class="day" data-day="0">'+  appJs.day_name[1] +'</span>';
			str += '			<span class="day" data-day="0">'+  appJs.day_name[2] +'</span>';
			str += '			<span class="day" data-day="0">'+  appJs.day_name[3] +'</span>';
			str += '			<span class="day" data-day="0">'+  appJs.day_name[4] +'</span>';
			str += '			<span class="day" data-day="0">'+  appJs.day_name[5] +'</span>';
			str += '		</div>';
			str += '	</div>';
			str += '<div class="form-group clearfix">';
			str += '	<div class="col-xs-6 col-xs-offset-3 col-sm-offset-0 col-sm-4 col-md-4 col-lg-3 f-label-w"><label class="f-label" for="start_hour0">'+  appJs.start_time +'</label></div>';
			str += '	<div class="col-xs-6 col-xs-offset-3 col-sm-offset-0 col-sm-8 col-md-8 col-lg-9 f-control">';
			str += '			<div class="pull-left" style="position:relative;">';
			str += '				<input type="text" size="5" maxlength="4" name="start_hour" id="start_hour0" class="form-control form-control-small" autocomplete="off">';
			str += '				<label for="hour" class="f-lbl-text">'+ appJs.min +'</label>';
			str += '			</div>';
			str += '			<div class="pull-left" style="position:relative;">';
			str += '				<input type="text" size="5" maxlength="2" name="start_minute" id="start_minute0" class="form-control form-control-small" autocomplete="off">';
			str += '				<label for="minute" class="f-lbl-text">'+ appJs.sec +'</label>';
			str += '			</div>';
			str += '	</div>';
			str += '</div>';
			str += '<div class="form-group clearfix">';
			str += '	<div class="col-xs-6 col-xs-offset-3 col-sm-offset-0 col-sm-4 col-md-4 col-lg-3 f-label-w"><label class="f-label" for="end_hour0">'+ appJs.end_time +'</label></div>';
			str += '	<div class="col-xs-6 col-xs-offset-3 col-sm-offset-0 col-sm-8 col-md-8 col-lg-9 f-control">';
			str += '			<div class="pull-left" style="position:relative;">';
			str += '				<input type="text" size="5" maxlength="4" name="start_hour" id="end_hour0" class="form-control form-control-small" autocomplete="off">';
			str += '				<label for="hour" class="f-lbl-text">'+ appJs.min +'</label>';
			str += '			</div>';
			str += '			<div class="pull-left" style="position:relative;">';
			str += '				<input type="text" size="5" maxlength="2" name="start_minute" id="end_minute0" class="form-control form-control-small" autocomplete="off">';
			str += '				<label for="minute" class="f-lbl-text">'+ appJs.sec +'</label>';
			str += '<img src="images/add_ico.png" class="img_add">';
			str += '			</div>';
			str += '	</div>';
			str += '</div>';
			str += '<div id="start_time_two" class="off">';
			str += '<div class="form-group clearfix">';
			str += '	<div class="col-xs-6 col-xs-offset-3 col-sm-offset-0 col-sm-4 col-md-4 col-lg-3 f-label-w"><label class="f-label" for="start_hour1">'+  appJs.start_time +'</label></div>';
			str += '	<div class="col-xs-6 col-xs-offset-3 col-sm-offset-0 col-sm-8 col-md-8 col-lg-9 f-control">';
			str += '			<div class="pull-left" style="position:relative;">';
			str += '				<input type="text" size="5" maxlength="4" name="start_hour" id="start_hour1" class="form-control form-control-small" autocomplete="off">';
			str += '				<label for="hour" class="f-lbl-text">'+ appJs.min +'</label>';
			str += '			</div>';
			str += '			<div class="pull-left" style="position:relative;">';
			str += '				<input type="text" size="5" maxlength="2" name="start_minute" id="start_minute1" class="form-control form-control-small" autocomplete="off">';
			str += '				<label for="minute" class="f-lbl-text">'+ appJs.sec +'</label>';
			str += '			</div>';
			str += '	</div>';
			str += '</div>';
			str += '<div class="form-group clearfix">';
			str += '	<div class="col-xs-6 col-xs-offset-3 col-sm-offset-0 col-sm-4 col-md-4 col-lg-3 f-label-w"><label class="f-label" for="end_hour1">'+ appJs.end_time +'</label></div>';
			str += '	<div class="col-xs-6 col-xs-offset-3 col-sm-offset-0 col-sm-8 col-md-8 col-lg-9 f-control">';
			str += '			<div class="pull-left" style="position:relative;">';
			str += '				<input type="text" size="5" maxlength="4" name="start_hour" id="end_hour1" class="form-control form-control-small" autocomplete="off">';
			str += '				<label for="hour" class="f-lbl-text">'+ appJs.min +'</label>';
			str += '			</div>';
			str += '			<div class="pull-left" style="position:relative;">';
			str += '				<input type="text" size="5" maxlength="2" name="start_minute" id="end_minute1" class="form-control form-control-small" autocomplete="off">';
			str += '				<label for="minute" class="f-lbl-text">'+ appJs.sec +'</label>';
			str += '			</div>';
			str += '	</div>';
			str += '</div>';
			str += '</div>';
		}
		
		$(newId).html(str);
		$(".day").off("click").on("click",function(){
				$(this).hasClass("select") ? $(this).removeClass("select").attr("data-day","0") : $(this).addClass("select").attr("data-day","1");
		});
		
		$(".img_add").off("click").on("click",function(){
				if($("#start_time_two").hasClass("off")){
					$("#start_time_two").removeClass("off");
				}else{
					$("#start_time_two").addClass("off");
				}
		});
	},
	copywriting_week_show:function(data){
	var new_day="";
		if(data==1111111){
			new_day=appJs.copywriting[7];
		}else{
				if(data[0]==1){
					new_day=new_day+appJs.copywriting[0]+";";
				}
				if( data[1]==1){
					new_day=new_day+appJs.copywriting[1]+";";
				}
				if(data[2]==1){
					new_day=new_day+appJs.copywriting[2]+";";
				}
				if(data[3]==1){
					new_day=new_day+appJs.copywriting[3]+";<br/>";
				}
				if(data[4]==1){
					new_day=new_day+appJs.copywriting[4]+";";
				}
				if(data[5]==1){
					new_day=new_day+appJs.copywriting[5]+";";
				}
				if(data[6]==1){
					new_day=new_day+appJs.copywriting[6]+";";
				}
		}
		console.log(new_day)
		return new_day;
	},
	
	changeSchedulesType:function(type,newId){
		var me = this;
		me.initTimeStr(type,newId);
		if(type == "1"){
			$(newId).removeClass("off");
		}else{
			$(newId).addClass("off");
		}
	},
	set_data:function(type,data){
		var me = this;
		var method = "";
		
		if(type == "mac_base" || type == "url_base"){
			method = "FwBase_set";
		}
		else if(type == "mac_set"){
			method = "FwMacFilter_set";
		}
		else if(type == "url_set"){
			method = "url_rule_operation";
		}
		else if(type == "port_set"){
			method = "ip_rule_operation";
		}
		else if(type == "access_control_level"){
			method = "FwLevel_set";
		}
		show_message("save");
		var setData={"jsonrpc": "2.0", "id":20, "method": "call", "params": [ localStorage.getItem('token_id'),"devices_app", method, data ] }
			setData=JSON.stringify(setData);
		
		$.when(setDataFn(setData)).then(function(ret){
			if(check_data(ret)){
						if(ret.result[0]==0){
						
//						if(type == "url_base"){
//							show_message("success");
//							me.url_filter.get_url_filter_data();
//						}
//						else 
						if(type == "access_control_level"){
							show_message("success");
							me.access_control_level.init(false);
						}
						else if(type == "mac_set" || type == "url_set" || type == "port_set"){
							if(data.action == "mod"){
								show_message("success",L.modify_suc);
							}
							else if(data.action == "del" || data.action == "delAll"){
								show_message("success",L.del_suc);
							}
							else if(data.action == "add"){
								show_message("success",L.add_suc);
							}
							else{
								show_message("success");
							}
							
							 if(type == "url_set")
								me.url_filter.get_url_filter_list();
							else if(type == "port_set")
								me.port_filter.get_port_filter_list();
						}
					}else{
//						if(type == "url_base"){
//								show_message("error");
//								me.url_filter.get_url_filter_data();
//								
//							}
//							else 
							if(type == "access_control_level"){
								show_message("error");
								me.access_control_level.init(false);
							}
							else if(type == "mac_set" || type == "url_set" || type == "port_set"){
								if(data.action == "mod"){
									show_message("error",L.modify_err);
								}
								else if(data.action == "del" || data.action == "delAll"){
									show_message("error",L.del_err);
								}
								else if(data.action == "add"){
									show_message("error",L.add_err);
								}
								else{
									show_message("error");
								}
							}
					}
				}
			
		});
	},
	initDelAllDialog:function(type){
		var me = this;
		me.delAll_D = new Dialog({
			id:"del-all-dialog",
			title:language[language_type]["DIALOG"]["delete-all"].title,
			content:"<p class=\"single-tip\">"+ language[language_type]["DIALOG"]["delete-all"].content +"</p>",
			buttons: [{
					action:function(){
						me.deleteAllData(type);
					}
				},{}]
		});
	},
	initSingleDelDialog:function(that,type){
		var me = this;		
		me.singleDel_D = new Dialog({
			id:"del-single-dialog",
			title:language[language_type]["DIALOG"]["delete-single"].title,
			content:"<p class=\"single-tip\">"+ language[language_type]["DIALOG"]["delete-single"].content +"</p>",
			buttons: [{
				action:function(){
					var index = that.attr("data-index");
					var data = me.searchData(index,type);
					
					if(!!data){
						
						me.singleDel_D.hide();
						
						var obj = {};
						obj["name"] = data["name"];
						obj["ip_id"] = data["ip_id"];
						obj["action"] = "del";
						obj["index"]=0;
						obj["url"] = data["url"];
						obj["url_id"] = data["url_id"];
						me.set_data(type + "_set",obj);
					}

				}
			},{}]
		});
		me.singleDel_D.show();
	},
	searchData:function(index,type){
		var me = this;
		var list = eval("me." + type + "_filter.data.rules");
		for(var i in list){
			if(index == list[i]["id"]){
				return list[i];
			}
		}
		return false;
	},
	deleteAllData:function(type){
		var me = this;
		me.delAll_D.hide();
		var param = {};
		param.action = "clean";
		me.set_data(type + "_set",param);
	},
	access_control_level:{
		data:{},
		add_event:function(){
			var me = this;
			$("#access_control_level_frm .btn-confirm").off("click").on("click",function(){
				me.set();
			});
		},
		get:function(){
			var me = this;
			$("#access_control_level").val(me.data.Level);
		},
		set:function(){
			var obj = {};
			var me = this;
			
			obj.Level = $("#access_control_level").val() * 1;
			
			if(compare(obj,me.data)){
				access_control.set_data("access_control_level",obj);
			}
			else{
				show_message("success");
			}
			
		},
		init:function(flag){
			var me = this;
			$.when(access_control.get_data("access_control_level")).then(function(){
				me.get();
				if(flag != false){
					hide_loading_page();
					show_content();
				}
			});
		}
	},

	port_filter:{
		data:{},
		get_port_filter_list:function(){
			var me = this;
			$.when(access_control.get_data("port_list")).then(function(){
				me.init_port_filter_list();
			});
		},
		init_port_filter_list:function(){//端口过滤表格
			var me = this;
			var data = me.data.rules;
			var new_data = [];
			
			if(data.length == 0){
				$("#port-del-all").attr("disabled",true);
			}
			else{
				$("#port-del-all").attr("disabled",false);
				for(var i in data){
					var tempObj = {};
					tempObj.name = htmlencode(data[i]["name"]);
					tempObj.proto = data[i]["proto"] == "TCPUDP" ? "TCP+UDP" : data[i]["proto"];
//					tempObj.FilterMode = data[i]["FilterMode"] == "drop" ? appJs.drop : appJs.accept;
					tempObj.src_ip = htmlencode(data[i]["src_ip"]);
					tempObj.src_port = data[i]["src_port"] * 1 == -1 ? "-" : data[i]["src_port"];
					tempObj.dst_ip = htmlencode(data[i]["dst_ip"]);
					tempObj.dst_port = data[i]["dst_port"] * 1 == -1 ? "-" : data[i]["dst_port"] ;
					if(data[i]["mode"]==0){
						tempObj.mode=appJs.copywriting[8];
						tempObj.time = "-";
					}else if(data[i]["mode"]==2){
						tempObj.mode=appJs.copywriting[9];
						tempObj.time = "-";
					}else if(data[i]["mode"]==1 ){
						
						if(data[i]["times"][0]["start_hour2"]==0 && data[i]["times"][0]["start_min2"]==0 && data[i]["times"][0]["end_hour2"]==0 && data[i]["times"][0]["end_min2"]==0){
							var t2_enable=0;
						}else{
							var t2_enable=1;
						}
						if(t2_enable==0){
							tempObj.mode=access_control.copywriting_week_show(reverseNumber(dec_two_bin(data[i]["times"][0]["day_flags"])));
							tempObj.time = data[i]["times"][0]["start_hour"]+":"+data[i]["times"][0]["start_min"]+"~"+data[i]["times"][0]["end_hour"]+":"+data[i]["times"][0]["end_min"];
						}else if( t2_enable==1){
							tempObj.mode=access_control.copywriting_week_show(reverseNumber(dec_two_bin(data[i]["times"][0]["day_flags"])));
							tempObj.time = data[i]["times"][0]["start_hour"]+":"+data[i]["times"][0]["start_min"]+"~"+data[i]["times"][0]["end_hour"]+":"+data[i]["times"][0]["end_min"]+"</br>"+data[i]["times"][0]["start_hour2"]+":"+data[i]["times"][0]["start_min2"]+"~"+data[i]["times"][0]["end_hour2"]+":"+data[i]["times"][0]["end_min2"];
						}else{
							tempObj.mode="";
							tempObj.time = "-";
						}
					}
					
					
					tempObj.op = '<button type="button" class="modify smaller" data-index='+ data[i]["id"] +'>'+ L.modify +'</button><button type="button" class="delete smaller darkgray" data-index='+ data[i]["id"] +'>'+ L.s_delete +'</button>';
		
					new_data.push(tempObj);
				}
			}
//			if(new_data.length==0){
//				var tab = new window.top.Table("port_filter_table",null,new_data,{colspan:3});
//			}else{
				var tab = new Table("port_filter_table",appJs.port_tab_title,new_data);
//			}
			
			tab.initTable();
		},
		fillForm:function(data){
			$(".dayTime_mac").html(" ");
			$(".dayTime_url").html(" ");
			
			var me = this;
			data ? $("#proto").val(data["proto"]) : $("#proto").val("TCP");
			data ? $("#mode").val(data["FilterMode"]) : $("#mode").val("drop");
			$("#name").val(data ? data["name"]:"");
			$("#src_ip").val(data ? data["src_ip"]:"");
			$("#dest_ip").val(data ? data["dst_ip"]:"");
			$("#ip_id").val(data ? data["ip_id"] : "");
			me.initProtocol(data);
			$("#port_schedulesType").val(data ? data["mode"] : "0");
			if(data){
				
				if(data["mode"]==1){
					access_control.changeSchedulesType(data["mode"],".dayTime_port");
					access_control.fillDay(data ? reverseNumber(dec_two_bin(data["times"][0]["day_flags"])) : "",".dayTime_port");
					$("#start_hour0").val(data ? data["times"][0]["start_hour"] : "");
					$("#start_minute0").val(data ? data["times"][0]["start_min"] : "");
					$("#end_hour0").val(data ? data["times"][0]["end_hour"] : "");
					$("#end_minute0").val(data ? data["times"][0]["end_min"] : "");
					
					$(".dayTime_port").removeClass("off");
					if(data["times"][0]["start_hour2"]==0 && data["times"][0]["start_min2"]==0 && data["times"][0]["end_hour2"]==0 && data["times"][0]["end_hour2"]==0){
						$("#start_time_two").addClass("off");
					}else{
						$("#start_time_two").removeClass("off");
						$("#start_hour1").val(data ? data["times"][0]["start_hour2"] : "");
						$("#start_minute1").val(data ? data["times"][0]["start_min2"] : "");
						$("#end_hour1").val(data ? data["times"][0]["end_hour2"] : "");
						$("#end_minute1").val(data ? data["times"][0]["end_min2"] : "");
					}
					$("#port_index").val(data ? data["times"][0]["index"] : "");
				}else{
					$(".dayTime_port").html(" ");
				}
			}
			$("#port_action").val(data ? "mod" : "add");
			
			$("#portAddModal .btn-confirm").html(data ? L.modify : appJs.add);
		},
		add_event:function(){
			var me = this;
			$("#port_filter_title .add_btn").off("click").on("click",function(){
				me.fillForm();
				$("#portAddModal").modal();
				$(".dayTime_port").addClass("off").html(" ");
			});
			$("body").undelegate("#port_filter_table button.modify","click").delegate("#port_filter_table button.modify","click",function(){
				$("#portAddModal").modal();
				var index = $(this).attr("data-index");
				var data = access_control.searchData(index,"port");
				me.fillForm(data);
			});
			
			$("body").undelegate("#port_filter_table button.delete","click").delegate("#port_filter_table button.delete","click",function(){
				access_control.initSingleDelDialog($(this),"port");
			});
			//端口过滤保存
			$("#portAddModal .btn-confirm").off("click").on("click",function(){
				var obj = {};
				obj.enable = 1;
				obj.action = $("#port_action").val();
				if(obj.action == "mod"){
					obj.index = $("#port_index").val() * 1;
				}
				obj.name = $("#name").val();
				obj.proto = $("#proto").val();
				obj.FilterMode = $("#mode").val();
				obj.src_ip = $("#src_ip").val();
				obj.dst_ip = $("#dest_ip").val();
				obj.ip_id=$("#ip_id").val() * 1;
				if( obj.proto == "ICMP" || obj.proto == "ANY"){
					obj.src_port = obj.dst_port  = -1;
					
				}
				else{
					obj.src_port = $("#src_port").val();
					obj.dst_port = $("#dest_port").val();
				}
				var type = $("#port_schedulesType").val();
				if(type == "1"){
					if(!check_input("port_filter_frm")){
						return;
					}
					if(!access_control.checkDay(".dayTime_port")){
						show_message("error",appJs.day_not_null);
						return;
					}
					var time_length;
					
					if($("#start_time_two").hasClass("off")){
						time_length=1;
					}else{
						time_length=2;
						obj.start_hour2 = $("#start_hour1").val() * 1;
						obj.start_min2 = $("#start_minute1").val() * 1;
						obj.end_hour2 = $("#end_hour1").val() * 1;
						obj.end_min2 = $("#end_minute1").val() * 1;
						obj.t2_WeekDayFlags = toDecimal(reverseNumber(access_control.setDay()));
						obj.t2_enable=1;
					}
					if(!access_control.check_time(time_length)){
						return;
					}
					obj.start_hour = $("#start_hour0").val() * 1;
					obj.start_min = $("#start_minute0").val() * 1;
					obj.end_hour = $("#end_hour0").val() * 1;
					obj.end_min = $("#end_minute0").val() * 1;
					obj.day_flags = toDecimal(reverseNumber(access_control.setDay()));
					obj.t1_enable=1;
					
				}else{
					obj.t1_enable=0;
					obj.t2_enable=0;
				}
				
				
				obj.mode=Number(type);
				
				if(check_input("port_filter_frm")){
					access_control.set_data("port_set",obj);
					$("#portAddModal").modal("hide");
				}
				
			});
			$("#proto").off("change").on("change",function(){
				var obj = {};
				var data = access_control.searchData($("#port_index").val(),"port");
				obj["proto"] = $(this).val();
				obj["src_port"] = data["src_port"];
				obj["dst_port"] = data["dst_port"];
				
				me.initProtocol(obj);

			});
			$("#port_schedulesType").off("change").on("change",function(){
				var obj = {};
				access_control.changeSchedulesType($(this).val(),".dayTime_port");
			});
			$("#port-del-all").off("click").on("click",function(){
				if(me.data.rules.length != 0)
					access_control.delAll_D.show();
			});	
		},
		initProtocol:function(data){
			if(data){
//				if(data["proto"] == "TCPUDP" || data["proto"] == "ICMP" || data["proto"] == "ANY"){
				if(data["proto"] == "ICMP" || data["proto"] == "ANY"){
					$("#src_port,#dest_port").attr("disabled",true);
					$("#src_port").val("");
					$("#dest_port").val("");
					reg_map["port_filter_frm"][2] = {};
					reg_map["port_filter_frm"][4] = {};
				}
				else{
					$("#src_port,#dest_port").attr("disabled",false);
					$("#src_port").val(data ? (data["src_port"] == -1 ? "" : data["src_port"]) : "");
					$("#dest_port").val(data ? (data["dst_port"] == -1 ? "" : data["dst_port"]) : "");
					reg_map["port_filter_frm"][2].id = "src_port";
        			reg_map["port_filter_frm"][2].type = "port";
					reg_map["port_filter_frm"][4].id = "dest_port";
        			reg_map["port_filter_frm"][4].type = "port";
				}
			}
			else{
				$("#src_port,#dest_port").attr("disabled",false);
				$("#src_port").val("");
				$("#dest_port").val("");
				reg_map["port_filter_frm"][2].id = "src_port";
				reg_map["port_filter_frm"][2].type = "port";
				reg_map["port_filter_frm"][4].id = "dest_port";
				reg_map["port_filter_frm"][4].type = "port";
			}
		},
		init:function(){
			var me = this;
			$.when(access_control.get_data("port_list")).then(function(){
				hide_loading_page();
				show_content();
				access_control.initDelAllDialog("port");
				me.init_port_filter_list();
			});
		}
	},
	url_filter:{
		data:{},
		get_url_filter_data:function(){
			var me = this;
			$.when(access_control.get_data("base")).then(function(){
				me.init_url_filter_data();
			});
		},
		init_url_filter_data:function(){
			var me = this;
			
			var title = appJs.sec_title;
			$("#url_filter_mode").val(me.data.mode);
//			me.data.mode == "black" ? $("#url_filter_title h2").html(title[1]) : $("#url_filter_title h2").html(title[0]);
			$("#url_filter_title h2").html(title[1])
			me.data.enable ? $("#url_filter_enable").prop("checked",true) : $("#url_filter_enable").prop("checked",false);
		},
		get_url_filter_list:function(){
			var me = this;
			$.when(access_control.get_data("url_list")).then(function(){
				me.init_url_filter_list();
			});
		},
		//		url表格
		init_url_filter_list:function(){
			var me = this;
			var data = me.data.rules;
			var new_data = [];
			
			if(data.length == 0){
				$("#url-del-all").attr("disabled",true);
			}
			else{
				$("#url-del-all").attr("disabled",false);
				for(var i in data){
					var tempObj = {};
					tempObj.url = htmlencode(data[i]["url"]);
					
					
					
					if(data[i]["mode"]==0){
						tempObj.mode=appJs.copywriting[8];
						tempObj.time = "-";
					}else if(data[i]["mode"]==2){
						tempObj.mode=appJs.copywriting[9];
						tempObj.time = "-";
					}else if(data[i]["mode"]==1 ){
						
						if(data[i]["times"][0]["start_hour2"]==0 && data[i]["times"][0]["start_min2"]==0 && data[i]["times"][0]["end_hour2"]==0 && data[i]["times"][0]["end_min2"]==0){
							var t2_enable=0;
						}else{
							var t2_enable=1;
						}
						if(t2_enable==0){
							tempObj.mode=access_control.copywriting_week_show(reverseNumber(dec_two_bin(data[i]["times"][0]["day_flags"])));
							tempObj.time = data[i]["times"][0]["start_hour"]+":"+data[i]["times"][0]["start_min"]+"~"+data[i]["times"][0]["end_hour"]+":"+data[i]["times"][0]["end_min"];
						}else if( t2_enable==1){
							tempObj.mode=access_control.copywriting_week_show(reverseNumber(dec_two_bin(data[i]["times"][0]["day_flags"])));
							tempObj.time = data[i]["times"][0]["start_hour"]+":"+data[i]["times"][0]["start_min"]+"~"+data[i]["times"][0]["end_hour"]+":"+data[i]["times"][0]["end_min"]+"</br>"+data[i]["times"][0]["start_hour2"]+":"+data[i]["times"][0]["start_min2"]+"~"+data[i]["times"][0]["end_hour2"]+":"+data[i]["times"][0]["end_min2"];
						}else{
							tempObj.mode="";
							tempObj.time = "-";
						}
					}
					
					
					
					
					tempObj.op = '<button type="button" class="modify smaller" data-index='+ data[i]["id"] +'>'+ L.modify +'</button><button type="button" class="delete smaller darkgray" data-index='+ data[i]["id"] +'>'+ L.s_delete +'</button>';
		
					new_data.push(tempObj);
				}
			}
//			if(new_data.length==0){
//				var tab = new window.top.Table("url_filter_table",null,new_data,{colspan:3});
//			}else{
				var tab = new Table("url_filter_table",appJs.url_tab_title,new_data);
//			}
			
			tab.initTable();
		},
//		url修改
		fillForm:function(data){
			$(".dayTime_mac").html(" ");
			
			$(".dayTime_port").html(" ");
			$("#url").val(data ? data["url"] : "");
			$("#url_action").val(data ? "mod" : "add");
			$("#url_id").val(data ? data["url_id"] : "");
			$("#url_schedulesType").val(data ? data["mode"] : "0");
			if(data){
				access_control.changeSchedulesType(data["mode"],".dayTime_url");
				if(data["mode"]==1){
					
					access_control.fillDay(data ? reverseNumber(dec_two_bin(data["times"][0]["day_flags"])) : "",".dayTime_url");
					
					$("#start_hour0").val(data ? data["times"][0]["start_hour"] : "");
					$("#start_minute0").val(data ? data["times"][0]["start_min"] : "");
					$("#end_hour0").val(data ? data["times"][0]["end_hour"] : "");
					$("#end_minute0").val(data ? data["times"][0]["end_min"] : "");
					$(".dayTime_url").removeClass("off");
					
					
					if(data["times"][0]["start_hour2"]==0 && data["times"][0]["start_min2"]==0 && data["times"][0]["end_hour2"]==0 && data["times"][0]["end_hour2"]==0){
						$("#start_time_two").addClass("off");
					}else{
						$("#start_time_two").removeClass("off");
						$("#start_hour1").val(data ? data["times"][0]["start_hour2"] : "");
						$("#start_minute1").val(data ? data["times"][0]["start_min2"] : "");
						$("#end_hour1").val(data ? data["times"][0]["end_hour2"] : "");
						$("#end_minute1").val(data ? data["times"][0]["end_min2"] : "");
					}
					$("#url_index").val(data ? data["times"][0]["index"] : "");
				}else{
					$(".dayTime_url").html(" ");
				}
			}
			$("#urlAddModal .btn-confirm").html(data ? L.modify : appJs.add);
		},
		add_event:function(){
			var me = this;
			$("#url_filter_enable").off("click").on("click",function(){
				var obj = {};
				obj.UrlFilterEnable = $(this).prop("checked");
				access_control.set_data("url_base",obj);
			});
			$("#url_schedulesType").off("change").on("change",function(){
				var obj = {};
				access_control.changeSchedulesType($(this).val(),".dayTime_url");
			});
			$("#url_filter_mode").off("change").on("change",function(){
				var obj = {};
				obj.UrlFilterMode = $(this).val();
				access_control.set_data("url_base",obj);
			});
			$("#url_filter_title .add_btn").off("click").on("click",function(){
				me.fillForm();
				$("#urlAddModal").modal();
				$(".dayTime_url").addClass("off").html(" ");
			});
//			url保存
			$("#urlAddModal .btn-confirm").off("click").on("click",function(){
				var obj = {};
				obj.action = $("#url_action").val();
				if(obj.action == "mod"){
					obj.index = $("#url_index").val() * 1;
				}
				obj.url = $("#url").val();
				obj.url_id=$("#url_id").val()  * 1;
				var type = $("#url_schedulesType").val();
				if(type == "1"){
					if(!check_input("url_filter_frm")){
						return;
					}
					if(!access_control.checkDay(".dayTime_url")){
						show_message("error",appJs.day_not_null);
						return;
					}
					
						
					var time_length;
					
					if($("#start_time_two").hasClass("off")){
						time_length=1;
					}else{
						time_length=2;
						obj.start_hour2 = $("#start_hour1").val() * 1;
						obj.start_min2 = $("#start_minute1").val() * 1;
						obj.end_hour2 = $("#end_hour1").val() * 1;
						obj.end_min2 = $("#end_minute1").val() * 1;
						
						
						obj.t2_WeekDayFlags = toDecimal(reverseNumber(access_control.setDay()));
						obj.t2_enable=1;
					}
					if(!access_control.check_time(time_length)){
						return;
					}
					obj.start_hour = $("#start_hour0").val() * 1;
					obj.start_min = $("#start_minute0").val() * 1;
					obj.end_hour = $("#end_hour0").val() * 1;
					obj.end_min = $("#end_minute0").val() * 1;
					obj.day_flags = toDecimal(reverseNumber(access_control.setDay()));
					obj.t1_enable=1;
					
				}else{
					obj.t1_enable=0;
					obj.t2_enable=0;
				}
				obj.enable=1;
				obj.mode=Number(type);
				if(check_input("url_filter_frm")){
					access_control.set_data("url_set",obj);
					$("#urlAddModal").modal("hide");
				}
			});
			$("body").undelegate("#url_filter_table button.modify","click").delegate("#url_filter_table button.modify","click",function(){
				$("#urlAddModal").modal();
				var index = $(this).attr("data-index");
				var data = access_control.searchData(index,"url");
				me.fillForm(data);
			});
			
			$("body").undelegate("#url_filter_table button.delete","click").delegate("#url_filter_table button.delete","click",function(){
				access_control.initSingleDelDialog($(this),"url");
			});
			$("#url-del-all").off("click").on("click",function(){
				if(me.data.rules.length != 0)
					access_control.delAll_D.show();
			});
		},
		init:function(){
			var me = this;
//			access_control.get_data("base"),
			$.when(access_control.get_data("url_list")).then(function(){
				hide_loading_page();
				show_content();
				access_control.initDelAllDialog("url");
				me.init_url_filter_data();
				me.init_url_filter_list();
			});
		}
	},

	init:function(){
//		this.addEvent();
//		this.mac_filter.add_event();
		this.url_filter.add_event();
		this.port_filter.add_event();
		this.access_control_level.add_event();
		$(".tab-item:eq(0) a").click();	
	}
};

function init_reset_dialog(){
	$("#dataModal .modal-title").html(language[language_type]["DIALOG"]["delete-single"].title);
	var $p = $("<p/>").attr("class","single-tip").html(language[language_type]["DIALOG"]["delete-single"].content);
	$("#dataModal .modal-body").html($p);
	$("#dataModal .btn-confirm").off("click").on("click",function(){
		delete_set_cgi();
	});
}
//第三页保存按钮
function ap_timer_set(newIndex){
	var timer_set=[];
	var tl_enable_set=[];
	
	for(var i=0;i<select_data.length;i++){
		var ap_timer_data={};//定义要上传的东西
		var tl_enable_data={};
//		if(newIndex==0){
//			tl_enable_data.enable=select_data.enable;
//		}else{
//			tl_enable_data.enable=true;
//		}
		
		
		ap_timer_data.start_hour=Number($("#start_hour").val());
		ap_timer_data.start_min=Number($("#start_min").val());
		ap_timer_data.end_hour=Number($("#end_hour").val());
		ap_timer_data.end_min=Number($("#end_min").val());
		
		if(!$("#mac_time_two").hasClass("hidden")){
			ap_timer_data.start_hour2=Number($("#start_hour2").val());
			ap_timer_data.start_min2=Number($("#start_min2").val());
			ap_timer_data.end_hour2=Number($("#end_hour2").val());
			ap_timer_data.end_min2=Number($("#end_min2").val());
		}
		
		
		ap_timer_data.day_flags=reverseNumber($(".weekSlotVal").val());
		ap_timer_data.day_flags=toDecimal(ap_timer_data.day_flags);
		ap_timer_data.mode=$("#mac_schedulesType").val()*1;	
		
		
	
		ap_timer_data.mac=select_data[i].mac;
		tl_enable_data.mac=select_data[i].mac;
		ap_timer_data.action=action;
		if(action!="add" && select_data[0].times!=""){
			ap_timer_data.index=select_data[0].times[0].index;
		}
		
		
	tl_enable_data.enable=true;
	tl_enable_data.white=false;//true为白名单  false为黑名单
	if(ap_timer_data.mode==1){
		
		
		if(!check_input("led_ctrl_frm")){
			return false;
		}		
		if(ap_timer_data.start_hour== ap_timer_data.end_hour && ap_timer_data.start_min==ap_timer_data.end_min){
			show_message("warning",L.time_cannot);
			return;
		}
		
		if(!$("#mac_time_two").hasClass("hidden")){
			if(!check_input("led_ctrl_frm2")){
				return false;
			}	
			if(ap_timer_data.start_hour2== ap_timer_data.end_hour2 && ap_timer_data.start_min2==ap_timer_data.end_min2){
				show_message("warning",L.time_cannot);
				return;
			}
		}
	}
	timer_set[i]={"jsonrpc": "2.0", "id":20, "method": "call", "params": [ localStorage.getItem('token_id'), "devices_app", "tl_operation", ap_timer_data ] };
		tl_enable_set[i]={"jsonrpc": "2.0", "id":20, "method": "call", "params": [ localStorage.getItem('token_id'), "devices_app", "tl_enable", tl_enable_data ] };
	}		
	show_message("save");
	timer_set=JSON.stringify(timer_set);
	tl_enable_set=JSON.stringify(tl_enable_set);
	console.log(timer_set,tl_enable_set);
	
		request({
			url:"/ubus",
			data:tl_enable_set
		}).done(function(data){
			

			if(check_data(data[0])){
				if(data[0].result[0]==0){
					
					request({
							url:"/ubus",
							data:timer_set
						}).done(function(data){
					
							if(check_data(data[0])){
								if(data[0].result[0]==0){
					         		show_message("success");
					         		jump_form(0);
					         		tl_operation_dump();//重新调用列表
								}else{
									show_message_gt("error",data[0]);
								}		
							}
					}).fail(function(data){
							//show_request_err(data);
						})
				}else{
					show_message_gt("error",data[0].error.code);
				}
				
			}
	}).fail(function(data){
			//show_request_err(data);
		})
	
}

//第一页
function tl_operation_dump(){
	var timer_get={"jsonrpc": "2.0", "id":24, "method": "call", "params": [ localStorage.getItem('token_id'), "devices_app", "tl_operation", {"action":"dump"} ] }
		timer_get=JSON.stringify(timer_get);
		
		request({
			url:"/ubus",
			data:timer_get
		}).done(function(data){
			handleResponse(data,function(){
					data=data.result[1].rules;
					console.log(data,data==false);
					init_filter_arp_tab_one(data)
					hide_loading_page();
					show_content();
				},function(){
					hide_loading_page();
					show_err_page();
				});
		}).fail(function(data){
				hide_loading_page();
				show_err_page();	
		})
}

//filter_arp 页面数据的操作
var dataTable_new=new Array();
function init_filter_arp_tab_one(data){
    dataTable_new=data;
    console.log("dataTable_new",dataTable_new);
    var new_data=dataChangeTo(dataTable_new);
//  if(new_data.length==0){
//		var tab = new window.top.Table("access_contorl_table",null,new_data,{colspan:3});
//	}else{
		var tab = new window.top.Table("access_contorl_table",appJs["table-title"],new_data);
//	}
	
	tab.initTable();
}
function dataChangeTo(data){
//	console.log(data.length);
    var reData=new Array();
   
	for(var i=0;i<data.length;i++){
        var tempObj=new Object();
        
        tempObj.id=parseInt(i)+1;//序列号
          if(data[i]['alias']==""){
         		tempObj.alias='<span title="'+L.unnamed_device+'">'+L.unnamed_device+'</span>';
         }else{
         	tempObj.alias='<span title="'+data[i]['alias']+'">'+cutString(data[i]['alias'],20)+'</span>';
         }
        
        tempObj.ip='<span>'+data[i]['ip']+'</span><span>'+data[i]['mac']+'</span>';
       if(data[i]['times'][0]){
       	
       
       var data_time=data[i]['times'][0]['day_flags'];
        data_time=dec_two_bin(data_time);
        data_time=reverseNumber(data_time);
        data_time=convert_to_date(data_time)
        console.log(data_time)
       tempObj.times='<span>'+data[i]['times'][0]['start_hour']+':'+data[i]['times'][0]['start_min']+'~'+data[i]['times'][0]['end_hour']+':'+data[i]['times'][0]['end_min']+'</span><span>'+data_time+'</span>';
		}else{
			 tempObj.times="null";
		}
		if(data[i]['enable']==true){
			tempObj.connect = '<a onclick="switch_tb('+ tempObj.id +')" title="'+ appJs.txt[0] +'" class="f-lightBlueColor" value="'+data[i]['enable']+'" href="javascript:void(0);">'+ appJs.txt[0] +'</a>';
		}else{
			tempObj.connect = '<a onclick="switch_tb('+ tempObj.id +')" title="'+ appJs.txt[1] +'" class="f-lightBlueColor" value="'+data[i]['enable']+'" href="javascript:void(0);">'+ appJs.txt[1] +'</a>';
		}
        tempObj.edit='<a onclick="edit_tb('+ tempObj.id +')" title="'+ appJs.txt[2] +'" class="f-lightBlueColor" href="javascript:void(0);">'+ appJs.txt[2] +'</a>';
        tempObj.delete='<a onclick="delete_tb('+ tempObj.id +')" title="'+ appJs.txt[3] +'" class="f-lightBlueColor" href="javascript:void(0);">'+ appJs.txt[3] +'</a>';
//     tempObj.authmode=data[i]['authmode'];  

        reData.push(tempObj);
   }
    return reData;
}



//第二页
function get_host_info(){
	$("#get_host_info_table").html(" ");
	onInternet_data=[];
	offline_device=[];
	all_equipment=[];
	var timer_get={"jsonrpc": "2.0", "id":26, "method": "call", "params": [ localStorage.getItem('token_id'), "devices_app", "get_host_info", {} ] }
		timer_get=JSON.stringify(timer_get);
		request({
			url:"/ubus",
			data:timer_get
		}).done(function(data){
			if(check_data(data)){		
					data=data.result[1].hosts;
//					console.log(data);
					
					
					for(var i=0;i<data.length;i++){
						if(data[i].time_limit==false && data[i].time_rule==false){
							if(data[i].online==true && data[i].almac=="00:00:00:00:00:00"){
								onInternet_data.push(data[i]);
							}else{
								offline_device.push(data[i]);
							}
						}
						
					}
					all_equipment=onInternet_data.concat(offline_device);
					init_filter_arp_tab(onInternet_data);
					
				}
		}).fail(function(data){
			//show_request_err(data);
		})
}
//点击显示所有设备
function show_all_equipment(){
	
	init_filter_arp_tab(all_equipment);
}

//filter_arp 页面数据的操作
var dataTable_host=new Array();
function init_filter_arp_tab(data){
	
    dataTable_host=[];
    select_filter_arp(data,dataTable_host);
//  console.log("dataTable_host",dataTable_host);
    var new_data=dataChangeTo_host(dataTable_host);
	var tab = new window.top.Table("get_host_info_table",appJs["table-title_2"],new_data);
	tab.initTable();
	 
}
function select_filter_arp(fromObj,toObj){
    var n=0;
    for(var i in fromObj){
        if(fromObj[i]['type']=='dynamic') {
            n++;continue;
        }
        if(typeof fromObj[i] == "object")
        {
            toObj[i-n]={};
            select_filter_arp(fromObj[i],toObj[i-n]);
            continue;
        }
        else  {
            toObj[i] = fromObj[i];
        }
    }
}
function dataChangeTo_host(data){
//	console.log(data.length);
    var reData=new Array();
   
	for(var i=0;i<data.length;i++){
        var tempObj=new Object();
         tempObj.id=parseInt(i)+1;//序列号
         if(data[i]['alias']==""){
         		tempObj.alias='<span title="'+L.unnamed_device+'">'+L.unnamed_device+'</span>';
         }else{
         	tempObj.alias='<span title="'+data[i]['alias']+'">'+cutString(data[i]['alias'],20)+'</span>';
         }
       	
		tempObj.ip=data[i]['ip'];
		tempObj.mac=data[i]['mac'];
        tempObj.connect = '<input type="checkbox" name="checkboxShall" idx="'+i+'" onclick="checkbox_click(this)" value="0" class="checkboxShall">';
        reData.push(tempObj);
  }
    return reData;
}
function jump_form(index,rule){
	if(index==0){
		three_page_start();
		tl_operation_dump();
	}else if(index==1){
		three_page_start();
		get_host_info();
	}else if(index==2){
		select_data=[];//重置清空要传的数据
		var select_checkbox=checkbox_length_fun();
		if(select_checkbox.length==0){
			show_message("warning",L.check_one);
			return false;
		}
		for(var i=0;i<select_checkbox.length;i++){
			var a=select_checkbox[i];
			select_data.push(dataTable_host[a]);
		}
		three_table();
	}
	$("#add_btn1").removeClass("hidden");
	$("#add_btn").addClass("hidden");
	$(".infoone").addClass("hidden");
	$(".infoone").eq(index).removeClass("hidden");
	if(rule!=undefined){
		action=rule;
	}
}
//第二页多选框点击
function checkbox_click(indexV){
	if($(indexV).hasClass("checkedCurrent")){
		$(indexV).val(0);
		$(indexV).removeClass("checkedCurrent");
	}else{
		$(indexV).val(1);
		$(indexV).addClass("checkedCurrent")
	}	
}
//计算选中的数量
function checkbox_length_fun(){
	// 选中不能为空
	var checkbox_length = new Array();
	var items = $(".checkboxShall");
	for (i = 0; i < items.length; i++) {
		if (items[i].checked) {
			checkbox_length.push($(".checkboxShall").eq(i).attr("idx"));
			}
		}
//console.log("选择的个数为：" + checkbox_length.length,checkbox_length)
	return checkbox_length;

}

//第三页的设备名称显示
function three_table(){
	
	var alias_data=[];
	for(var i=0;i<select_data.length;i++){
		if(select_data[i].alias==""){
			alias_data.push(L.unnamed_device)
		}else{
			alias_data.push(select_data[i].alias)
		}
		
	}
	console.log(select_data,alias_data);
	
	if(alias_data.length==1){
		$("#alias_show").html(alias_data);
	}else if(alias_data.length==2){
		$("#alias_show").html(alias_data[0]+";"+alias_data[1]+";");
	}else if(alias_data.length>2){
		$("#alias_show").html(alias_data[0]+";"+alias_data[1]+";..."+alias_data.length);
	}
	
	
}
//修改跳转到第三页
function edit_tb(index){
	$("#add_btn").removeClass("hidden");
	$("#add_btn1").addClass("hidden");
	select_data=[];
	$(".infoone").addClass("hidden");
	$(".infoone").eq(2).removeClass("hidden");
	action="mod";
	var data=dataTable_new[index-1];
	$("#alias_show").html(data.alias);
	
	$(".mac_dayTime_port").addClass("hidden");
	$("#mac_schedulesType").val(data.mode);
	if(data.mode==1){
		$(".mac_dayTime_port").removeClass("hidden");
		$("#start_hour").val(data.times[0].start_hour);
		$("#start_min").val(data.times[0].start_min);
		$("#end_hour").val(data.times[0].end_hour);
		$("#end_min").val(data.times[0].end_min);
		var day_d=dec_two_bin(data.times[0].day_flags);
		day_d=reverseNumber(day_d);
		$(".weekSlotVal").val(day_d)
		day_d=day_d.split("");
	//				console.log(day_d,day_d[0])
		for(var i=0;i<7;i++){
			if(day_d[i]==0){
				$(".weekSlot span").eq(i).removeClass("active").attr("value",0);
			}else if(day_d[i]==1){
				$(".weekSlot span").eq(i).addClass("active").attr("value",1);
			}
			
		}
		

		if(data.times[0].start_hour2==0 && data.times[0].start_min2==0 && data.times[0].end_hour2==0 && data.times[0].end_min2==0){
			$("#mac_time_two").addClass("hidden");
		}else{
			$("#mac_time_two").removeClass("hidden");
			$("#start_hour2").val(data.times[0].start_hour2);
			$("#start_min2").val(data.times[0].start_min2);
			$("#end_hour2").val(data.times[0].end_hour2);
			$("#end_min2").val(data.times[0].end_min2);
		}
	}
	select_data.push(dataTable_new[index-1]);
	
//	select_data=dataTable_new[index-1];
	console.log(dataTable_new[index-1],select_data);
}

//开启关闭
function switch_tb(index){
	var data={"enable":dataTable_new[index-1].enable,"mac":dataTable_new[index-1].mac,"white":false};
	if(data.enable==true){
		data.enable=false;
	}else{
		data.enable=true;
	}
	console.log(data);
	show_message("save");
	tl_enable_set={"jsonrpc": "2.0", "id":20, "method": "call", "params": [ localStorage.getItem('token_id'), "devices_app", "tl_enable", data ] };
	tl_enable_set=JSON.stringify(tl_enable_set);
		request({
			url:"/ubus",
			data:tl_enable_set
		}).done(function(data){
			if(check_data(data)){		
					console.log(data);
					if(data.result[0]==0){
		         		show_message("success");
		         		tl_operation_dump();//重新调用列表
					}else{
						show_message_gt("error",data.result[0]);
					}
					
					
				}
		}).fail(function(data){
			//show_request_err(data);
		})
}
//删除按钮
function delete_tb(index){
	$("#dataModal").modal();
	delete_set=dataTable_new[index-1];
}
//二次确认时点击删除确定
function delete_set_cgi(){
	$("#dataModal").modal("hide");
	//删除时间所需数据
	var set_data={};
	set_data.action="clean";
	set_data.mac=delete_set.mac;
	tl_operation_set={"jsonrpc": "2.0", "id":23, "method": "call", "params": [ localStorage.getItem('token_id'), "devices_app", "tl_operation", set_data ] };
	tl_operation_set=JSON.stringify(tl_operation_set);
	
//	设置主机开关数据
	var enable_set={};
	enable_set.mac=delete_set.mac;
	enable_set.enable=false;
	enable_set.white=false;//true为白名单  false为黑名单
	tl_enable_set={"jsonrpc": "2.0", "id":20, "method": "call", "params": [ localStorage.getItem('token_id'), "devices_app", "tl_enable", enable_set ] };
	tl_enable_set=JSON.stringify(tl_enable_set);
	console.log(tl_operation_set,set_data);
	show_message("save");
		request({
			url:"/ubus",
			data:tl_enable_set
		}).done(function(data){
			if(check_data(data)){		
					console.log(data);
					if(data.result[0]==0){
						request({
							url:"/ubus",
							data:tl_operation_set
						}).done(function(data){
							if(check_data(data)){		
									console.log(data);
									if(data.result[0]==0){
						         		show_message("success");
						         		tl_operation_dump();//重新调用列表
									}else{
										show_message_gt("error",data.result[0]);
									}
									
									
								}
						}).fail(function(data){
							//show_request_err(data);
						})
		         
					}else{
						show_message_gt("error",data.result[0]);
					}
					
					
				}
		}).fail(function(data){
			//show_request_err(data);
		})	
}
//初始第三页的所有状态
function three_page_start(){
	$("#alias_show").html("");
	$("#start_hour").val("");
	$("#start_min").val("");
	$("#end_hour").val("");
	$("#end_min").val("");
	$("#mac_time_two").addClass("hidden");
	$(".weekSlotVal").val(1111111);
	$("#mac_schedulesType").val(0);
	$(".mac_dayTime_port").addClass("hidden");
	$(".weekSlot span").addClass("active").attr("span","1");
}

$(document).ready(function(){
	init_breadcrumbs();
	lang.init(language[language_type]["PAGES"][current_html]);
	appJs = language[language_type]["PAGES"][current_html]["js"];
	render_page();
	show_loading_page();
	tl_operation_dump()
	$(".limit-speed-button").html(appJs.txt[5]);
		init_reset_dialog();

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

		
		
//		时间框得到焦点事件
		$('.allChange').focus(function(){
//			console.log($(this).val());
			if($(this).val()=="00"){
				$(this).val(" ");
			}
		})
//		时间框失去焦点事件
		$('.allChange').blur(function(){
//			console.log($(this).val());
			if($(this).val()==" "){
				$(this).val("00");
			}
		})
		//限制时间的输入的大小
		$('.allChange').keyup(function(){
			var timeName=$(this).attr("name");
			var timeData=$(this).val();
			
			if(timeName=="start_hour" || timeName=="start_sec"){
				if(timeData>=24){
					$(this).val(23);
				}
			}else if(timeName=="start_minute" || timeName=="start_sec"){
				if(timeData>=60){
					$(this).val(59);
				}
			}
		})
		
		
	$("#mac_schedulesType").off("change").on("change",function(){
		var d=$(this).val();
		if(d==1){
			$(".mac_dayTime_port").removeClass("hidden");
		}else{
			$(".mac_dayTime_port").addClass("hidden");
		}
			
	});	
	$(".mac_dayTime_port").on("click",".img_add",function(){//tab标签切换
		if($("#mac_time_two").hasClass("hidden")){
			$("#mac_time_two").removeClass("hidden");
		}else{
			$("#mac_time_two").addClass("hidden");
		}
	});
	
	
	$(".tab_area").on("click",".tab-item",function(){//tab标签切换
		var index = $(this).index();
		if(index==0){
			three_page_start();
			jump_form(0);
			tl_operation_dump();
	   }else if(index==1){
	   		access_control.port_filter.init();
	   }else if(index==2){
			access_control.url_filter.init();	
	   }else{
			access_control.access_control_level.init();
		}
		access_control.init();
		$(".tab_area .tab-item").removeClass("selection");
		$(this).addClass("selection");
		$(".tab-pane").removeClass("active");
		$(".tab-pane").eq($(this).index()).addClass("active");
		
	})
	access_control.init();
	$(".tab-item").eq(0).click();
	$(".add_btn span").html(appJs.add);
	
});
