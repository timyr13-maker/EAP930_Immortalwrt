//系统升级
var system_status_data;//路由器固件信息
var automatic;//自动检测版本检测定时器方法

current_html = "system_upgrade";
$(document).ready(function(){
	init_breadcrumbs();
	render_page();
	show_loading_page();
	lang.init(language[language_type]["PAGES"][current_html]);
	init_update_dialog();
	
	wan_config_set()//获取当前版本信息
	//tab标签切换
	$(".tab_area").on("click",".tab-item",function(){
		var index = $(this).index();
		if(index==0){
			wan_config_set();// 获取WAN口的DMZ设置
	   }else if(index==1){
	   		wan_config_set();
	  	 	auto_up_show();//自动升级参数
	   }
		$(".tab_area .tab-item").removeClass("selection");
		$(this).addClass("selection");
		$(".infoone").addClass("hidden");
		$(".infoone").eq($(this).index()).removeClass("hidden");
		
	})
	
	//开关
		$(".button-label").on('click',function(){
			$(this).toggleClass("f-switchTrue")
			if($(this).hasClass("f-switchTrue")){
				$(this).parent().siblings(".checkboxAll").attr("value","1");
				$(this).parent().siblings(".checkboxAll").attr("checked","checked");	
				
				if($(this).hasClass("agent")){
					agent_update_set_fn();
				}else{
					auto_up_set();
					auto_updat();
				}
				
			}else{
				$(this).parent().siblings('.checkboxAll').attr("value","0");
				$(this).parent().siblings(".checkboxAll").removeAttr("checked");		
				console.log("off");
				if($(this).hasClass("agent")){
					agent_update_set_fn();
				}else{
					auto_up_set();
					auto_updat();
				}
			}
		})
		
agent_update_get_fn();
	if(!!router.rid && !!router.phoneId){
		
		$(".tab_area .tab-item").eq(1).click();
		$(".tab_area").hide();
	}
	
});
//自动更新到最新固件是否开启
function auto_updat(){	
	if($("#auto_update_checkbox").val()==0){
		$("#urgent_update").removeClass("hidden");
	}else{
		$("#urgent_update").addClass("hidden");
	}
	
}

function put_fileFn(){
	    console.log($("#put_file"))
	    var url=document.getElementById("put_file").value;
    	url=url.split("\\");//这里要将 \ 转义一下
//  alert("文件名 "+url[url.length-1]);
    $("#update_file_name").val(url[url.length-1])
     console.log(url[url.length-1])
}

function get_file(){
	$("#put_file").click();
}

//1.获取路由版本信息
function wan_config_set(){
	var a1='{"jsonrpc": "2.0", "id": 20, "method": "call", "params": [ "'+localStorage.getItem('token_id')+'", "auto_update", "auto_update_getversion", {} ] }'
	request({
			url:"/ubus",
			data:a1
		}).done(function(data){
			if(check_data(data)){
			  	if(data.result!=undefined && data.result[0]==0){
			  		system_status_data=data.result[1];
			  		$(".cur_version").html(data.result[1].cur_version);//显示当前使用包
			  		auto_updat();
			  	}
			  }
		}).fail(function(data){
			//show_request_err(data);
		})
	
}

//手动提交
function submit_file(){
	var put_file_val=$("#put_file").val();
    var fileName = put_file_val.substring(put_file_val.lastIndexOf(".") + 1).toLowerCase();
    console.log(fileName);

	if(put_file_val==""){
		show_message("error",L.abnormal_file_format);

	}else{
		
		$("#updateModal").modal();
	}
}

function init_update_dialog(){
	$("#updateModal .modal-title").html(language[language_type]["DIALOG"]["update"].title);
	var $p = $("<p/>").attr("class","single-tip").html(language[language_type]["DIALOG"]["update"].content);
	$("#updateModal .modal-body").html($p);
	
	$("#updateModal .btn-confirm").off("click").on("click",function(){
		two_confirmation();
	});
}

//二次确定弹窗确认
function two_confirmation(){
	$("#updateModal").modal("hide");
	show_message("save",L.uploading_file);
//	var mac=$("#mac_checkbox").val();
//	if(mac==0){
		var t1="/cgi-bin/upgrade?sid="+localStorage.getItem('token_id');
//	}else{
//		var t1="/cgi-bin/upgrade?sid="+localStorage.getItem('token_id')+"&mac=ff:ff:ff:ff:ff:ff";
//	}
	
	console.log(t1);
	$("#update_form").attr("action", t1);

	
	
	$("#update_form").ajaxSubmit({  
		type: 'post',  
		url: t1,
		uploadProgress: function (event, position, total, percentComplete) {
			console.log(percentComplete);
		},
		beforeSend:function(xhr, settings){
				if(typeof localStorage != "undefined"){
					ROUTE_INFO.rid = localStorage.getItem('rid');
					ROUTE_INFO.phoneId = localStorage.getItem('phoneId');
					if(!!ROUTE_INFO.rid && !!ROUTE_INFO.phoneId){
						this.url = "/ubus?phoneId="+ROUTE_INFO.phoneId+"&rid="+ROUTE_INFO.rid;
						xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
					}
				}
			   },
		success: function(data){  
			$( "#update_form").resetForm(); 
			console.log(data);
			

			if(data.result[0]==0){
				show_message("success",L.file_upload_success);
				//clearInterval(automatic);//停止版本检测
				restartSuccess();
				
			}else if(data.result[0]==6){
				show_message_gt("error",language[language_type]["ERROR"]["6"])
				window.setTimeout(function(){
					window.location.href = "/login.html";
				},2000);
			}
			else if(data.result[0]==8){
				show_message("error",L.file_type_error);
			}
//			else{
//				show_message("error",L.file_upload_error);
//			}
			
		},  
		error: function(XmlHttpRequest, textStatus, errorThrown){
		 show_message("error",L.file_upload_error); 
		}  
	});  


}
//手动重启成功后倒计时启动
function restartSuccess(){
	$(".fullScreenMask").removeClass("hidden");//显示遮罩
	$(".infoone").addClass("hidden");
	$(".infoone").eq(2).removeClass("hidden");
	var time=$("#time").html();
	settime(time);
	
}
//手动重启成功后倒计时启动
function settime(obj) {
    if (obj == 0) { 
        location.href = "/login.html";
        return;
    } else{
    	obj--; 
    	$("#time").html(obj);
    }
	setTimeout(function() { 
	    settime(obj) }
	    ,1000) 
	}

//自动升级-获取自动升级开关的配置
function auto_up_show(){
	var a1='{"jsonrpc": "2.0", "id": 20, "method": "call", "params": [ "'+localStorage.getItem('token_id')+'", "auto_update", "auto_update_get", {} ] }'
	request({
			url:"/ubus",
			data:a1
		}).done(function(data){
			if(check_data(data)){
		  	if(data.result!=undefined && data.result[0]==0){
		  		if(data.result[1].allow=="1"){
             		$("#auto_update_checkbox").attr("value","0");
             		$("#auto_update_checkbox").removeAttr("checked");
					$("#auto_update_checkbox").siblings("div").children(".button-label").removeClass("f-switchTrue");     
					
					$("#urgent_update").removeClass("hidden");
					$("#urgent_update_checkbox").attr("value","1");
					$("#urgent_update_checkbox").attr("checked","checked");
					$("#urgent_update_checkbox").siblings("div").children(".button-label").addClass("f-switchTrue");		
					
             	}else if(data.result[1].allow=="0"){
             		$("#auto_update_checkbox").attr("value","0");
             		$("#auto_update_checkbox").removeAttr("checked");
					$("#auto_update_checkbox").siblings("div").children(".button-label").removeClass("f-switchTrue");     
					
					$("#urgent_update").removeClass("hidden");
					$("#urgent_update_checkbox").attr("value","0");
             		$("#urgent_update_checkbox").removeAttr("checked");
					$("#urgent_update_checkbox").siblings("div").children(".button-label").removeClass("f-switchTrue"); 
						
             	}else if(data.result[1].allow=="2"){
             		$("#auto_update_checkbox").attr("value","1");
					$("#auto_update_checkbox").attr("checked","checked");
					$("#auto_update_checkbox").siblings("div").children(".button-label").addClass("f-switchTrue");
					
					$("#urgent_update").addClass("hidden");
					$("#urgent_update_checkbox").attr("value","0");
             		$("#urgent_update_checkbox").removeAttr("checked");
					$("#urgent_update_checkbox").siblings("div").children(".button-label").removeClass("f-switchTrue"); 
					
             	}else if(data.result[1].allow=="3"){
             		$("#auto_update_checkbox").attr("value","1");
					$("#auto_update_checkbox").attr("checked","checked");
					$("#auto_update_checkbox").siblings("div").children(".button-label").addClass("f-switchTrue");
					
					$("#urgent_update").addClass("hidden");
					$("#urgent_update_checkbox").attr("value","1");
					$("#urgent_update_checkbox").attr("checked","checked");
					$("#urgent_update_checkbox").siblings("div").children(".button-label").addClass("f-switchTrue");
             	}
             	
		  	}
		  }
		}).fail(function(data){
			//show_request_err(data);
		})
	
	
}

//自动升级按钮被点击
function version_check(){
	
	var a1='{"jsonrpc": "2.0", "id": 20, "method": "call", "params": [ "'+localStorage.getItem('token_id')+'", "auto_update", "auto_update_now", {} ] }'

	
	request({
			url:"/ubus",
			data:a1
		}).done(function(data){
			if(check_data(data)){
			 	if(data.result!=undefined){
			 		if(data.result[0]==0){
			 			restartSuccess();
			 		}else{
			 			
			 		}
			 	}
			}
		}).fail(function(data){
			//show_request_err(data);
		})
}

//自动升级点击升级按钮
function start_update(){
	version_check();
}

//版本检测
function version_check_button(){
	show_message("save",L.version_checking);
	var a1='{"jsonrpc": "2.0", "id": 20, "method": "call", "params": [ "'+localStorage.getItem('token_id')+'", "auto_update", "auto_update_check", {} ] }'

	request({
			url:"/ubus",
			data:a1
		}).done(function(data){
			 if(check_data(data)){
			 	if(data.result!=undefined){
			 		show_message("success",L.version_checking_success);
			 		$("#update_status").removeClass("hidden");
			 		$("#span_new_version").html(data.result[1].update_version);
			 		if(data.result[1].update_version>data.result[1].cur_version){
			 			$("#span_new_version_div").removeClass("hidden");	
	             		$("#update_status").html(L.version_title2);
	             		$("#update_btn").removeClass("hidden");
			 		}else{
			 			$("#span_new_version_div").addClass("hidden");
	             		$("#update_status").html(L.version_title1);
	             		$("#update_btn").addClass("hidden");
			 			
			 		}
			 	}else{
			 		show_message("error",L.version_checking_error);
			 	}
			 }
		}).fail(function(data){
			//show_request_err(data);
		})
}

//自动升级开关被点击
function auto_up_set(){
	var al1ow;
	var auto_update=$("#auto_update_checkbox").attr("checked");
	var urgent_update=$("#urgent_update_checkbox").attr("checked");
	if(auto_update=="checked" && urgent_update==undefined){
		al1ow=2;
	}else if(auto_update==undefined && urgent_update=="checked"){
		al1ow=1;
	}else if(auto_update==undefined && urgent_update==undefined){
		al1ow=0;
	}else if(auto_update=="checked" && urgent_update=="checked"){
		al1ow=3;
	}
	var a1='{"jsonrpc": "2.0", "id": 20, "method": "call", "params": [ "'+localStorage.getItem('token_id')+'", "auto_update", "auto_update_set", {"allow":"'+al1ow+'"} ] }'

	request({
			url:"/ubus",
			data:a1
		}).done(function(data){
			 if(check_data(data)){
			 	if(data.result!=undefined){
			 		if(data.result[0]==0){
	//		 			auto_up_show();
			 		}
			 		
			 	}
			 }
		}).fail(function(data){
			//show_request_err(data);
		})
//	console.log(al1ow);
}

//获取配置Agent自动升级
function agent_update_get_fn(){
	var agent='{"jsonrpc": "2.0", "id": 26, "method": "call", "params": [ "'+localStorage.getItem('token_id')+'", "uci", "get", {"config": "auto_update","section": "control","option": "agent_enable"} ] }'
	request({
			url:"/ubus",
			data:agent
		}).done(function(data){
			if(check_data(data)){
			 	if(data.result!=undefined){
			 		console.log("agent_get",data)
			 		if(data.result[1]==undefined || data.result[1].value==1){
			 			$("#agent_update_checkbox").attr("value","1");
						$("#agent_update_checkbox").attr("checked","checked");
						$("#agent_update_checkbox").siblings("div").children(".button-label").addClass("f-switchTrue");
			 		}else{
			 			$("#agent_update_checkbox").attr("value","0");
						$("#agent_update_checkbox").removeAttr("checked");
						$("#agent_update_checkbox").siblings("div").children(".button-label").removeClass("f-switchTrue");
			 		}
			 	}
			hide_loading_page();
				show_content();
			}
		}).fail(function(data){
			hide_loading_page();
				show_err_page();	
		})
}
//配置设置Agent自动升级
function agent_update_set_fn(){
	var agent_enable=$("#agent_update_checkbox").val();
	if(agent_enable==undefined){
		agent_enable=="1";
	}
	var agent='{"jsonrpc": "2.0", "id": 26, "method": "call", "params": [ "'+localStorage.getItem('token_id')+'", "uci", "set", {"config": "auto_update","section": "control","values":{"agent_enable": "'+agent_enable+'"}} ] }'

	request({
			url:"/ubus",
			data:agent
		}).done(function(data){
			 if(check_data(data)){
			 	if(data.result!=undefined){
			 		var applyUci_data=applyUci();
					if(applyUci_data==0 || applyUci_data==5){
						console.log("agent_set",data)
			 			agent_update_get_fn();
					}
			 		
			 	}
			 }
		}).fail(function(data){
			//show_request_err(data);
		})
	
}

