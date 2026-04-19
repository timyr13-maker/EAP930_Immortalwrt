//登录页

var getAesStringVal;//设置秘钥变量
current_html = "login";

function uci_wificfg(type){
	var dfd = $.Deferred();
	var data={};
	data["DeviceRole"]="1";
	data["dual_frequency_switch"]="0";

	var setData = {"jsonrpc": "2.0", "id": 20, "method": "call", "params": [ localStorage.getItem('token_id'), "uci", "set", {"config": "wificfg","section": type,"values":data}]};
	 setData=JSON.stringify(setData);
	
		request({
			url:"/ubus",
			data:setData
		}).done(function(data){
			if(check_data(data)){
				if(data.result!=undefined && data.result[0]==0){
					
					$.when(applyUci_log()).then(function(applyUci_data){
						if(applyUci_data==0 || applyUci_data==5){
							dfd.resolve(applyUci_data);
						}
					});  			
					}else{		
						show_message_gt("error",data.error.code);
					}
			}
		}).fail(function(data){
			//show_request_err(data);
		})
		return dfd.promise();
      
}
function wan_config_set(){
	var dfd = $.Deferred();
	var config_set='{"jsonrpc": "2.0", "id": 1, "method": "call", "params": [ "'+localStorage.getItem('token_id')+'", "routerd", "wan_config_set",  {"enable": 1,"wanid": 1,"mtu":1500,"dns1":"",} ] }'
	var dfd = $.Deferred();
		request({
			url:"/ubus",
			data:config_set
		}).done(function(data){
			data=JSON.stringify(data);
	        data = eval("(" + data + ")");
			
			dfd.resolve(data.result[0]);
		}).fail(function(data){
			//show_request_err(data);
		})
	return dfd.promise();
}

function ac_ap_privacy(){
	var dfd = $.Deferred();
	var config_set='{"jsonrpc": "2.0", "id": 1, "method": "call", "params": [ "'+localStorage.getItem('token_id')+'", "acap", "ac_ap_privacy",  {} ] }'
	var dfd = $.Deferred();
		request({
			url:"/ubus",
			data:config_set
		}).done(function(data){
			data=JSON.stringify(data);
	        data = eval("(" + data + ")");
			
			dfd.resolve(data.result[0]);
		}).fail(function(data){
			//show_request_err(data);
		})
	return dfd.promise();
}

function applyUci_log(){
	var dfd = $.Deferred();
	var getdata='{"jsonrpc": "2.0", "id": 10, "method": "call", "params": [ "'+localStorage.getItem('token_id')+'", "uci", "apply",  {"timeout": "60"} ] }'
	var dfd = $.Deferred();
	request({
			url:"/ubus",
			data:getdata
	}).done(function(data){
		data=JSON.stringify(data);
        data = eval("(" + data + ")");
		
		dfd.resolve(data.result[0]);
	}).fail(function(data){
		//show_request_err(data);
	})
	return dfd.promise();
}
function loginIn(){

	
	 show_message("save",L.logining);//显示遮罩
	var obj={};

		 obj.username=$("#login_name").val();
		 obj.password=$("#login_pwd").val();//获取输入密码
	//base64encode(utf16to8(password));//密码加密
	// if(obj.username==""||obj.password==""){
	// 	show_message("error",L.log_title);
	// 	return false;
	// }
	var chk_read_statement=$("#read_statement").eq(0).prop("checked");
		if(chk_read_statement==false){
			show_message("error",L.read_statement_title);
			return;
		}
	var subData={"jsonrpc": "2.0", "id": 1, "method": "call", "params": [ "00000000000000000000000000000000", "session", "login", obj ] };
	subData=JSON.stringify(subData);
//	 CryptoJS.SHA1("hello world").toString(CryptoJS.enc.Hex);
//	var key= CryptoJS.enc.SHA1.parse(getAesString);
//	上传密码

	 request({
			url:"/ubus",
			data:subData
		}).done(function(data){
			data=JSON.stringify(data);
			data = eval("(" + data + ")");
			  if(data.result!=undefined){
				if (data.result[0]==0&&data.result[1].ubus_rpc_session!="") {
								
								if(data.result[1].ErrCode == "-11002"){
										show_message("error",L.loginErr);
										$(".btn-confirm").attr("disabled",true).html(appJs.login + "(" + data.result[1].Timeout +"s)");
										countDown(data.result[1].Timeout);
										$("#login-tip-box").removeClass("off")
										$("#login-tip-box .tip-sec").html(language[language_type]["ERROR"]["-11002"]);
										return;
									}
									localStorage.setItem('token_id', data.result[1].ubus_rpc_session);//本地存储
								$.when(ac_ap_privacy()).then(function(data){ 
									if(ROUTE_INFO.ac_ap_status.role=="ac"){
										location.href = "./index.html";
									}else{
										if(ROUTE_INFO.ac_ap_status.bid=="1"){
											location.href = "./lock_screen.html";
										}else{
											location.href = "./ap_index.html";
										}
									}

							  		
							  	});
						}else{
					show_message("error",L.password_error);
				   }
			  }
			else{
				show_message("error",L.password_error);
			} 
		}).fail(function(data){
			//show_request_err(data);
		})
	 
}
function countDown(time){
		var me = this;

		timer = window.setInterval(function(){
			
			if(time == 0){
				window.clearInterval(timer);
				$(".btn-confirm").attr("disabled",false).html(appJs.login);
				$("#login-tip-box").addClass("off")
				return;
			}
			
			time--;
			$(".btn-confirm").attr("disabled",true).html(appJs.login + "(" + time +"s)");
		},1000);
		
	}
$(document).ready(function(){
	removeDir();
	lang.init(language[language_type]["PAGES"][current_html]);
	appJs = language[language_type]["PAGES"][current_html]["js"];
	render_page();
	show_loading_page();
	localStorage.removeItem("token_id");//只要进入登录页就删除以前的token_id
	$.when(login_name(),ac_ap_status()).then(function(){
		$("#login_name").val(ROUTE_INFO.username);
		if(ROUTE_INFO.ac_ap_status.initd){
			$("#read_statement").prop("checked",true);
		}else{
			$("#read_statement").prop("checked",false);
		}
	});
	$(".statement_color").off("click").on("click",function(){
			$("#read_statement_Modal").modal();
		});
		$("#read_statement_Modal .btn-agree").off("click").on("click",function(){
			$("#read_statement").attr("checked","checked");
			$("#read_statement_Modal").modal("hide");
		});

	$("#read_statement_Modal .btn-agree").off("click").on("click",function(){
			$("#read_statement").prop("checked",true)
			
			$("#read_statement_Modal").modal("hide");
		});
	new Password("login_pwd",null,false);
});
