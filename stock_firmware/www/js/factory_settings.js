var data_submit={};
current_html = "factory_settings";
//恢复出厂设置
$(document).ready(function(){
	init_breadcrumbs();
	render_page();
	show_loading_page();
	lang.init(language[language_type]["PAGES"][current_html]);
	init_reset_dialog();
	//多选
	$(".checkboxShall").click(function(){
		if($(this).val()==1){//1是被选中加上checkedCurrent样子
			$(this).removeClass("checkedCurrent");
			$(this).val(0);
		}else{
			$(this).addClass("checkedCurrent");
			$(this).val(1);
		}
		if($("#network_param").val()==0 && $("#host_name_param").val()==0){//监听网络配置信息和自定义主机信息是否都关闭
			$("#param_save").attr("value","1").removeAttr("checked");
			$(".button-label").removeClass("f-switchTrue");
			$(".checkboxShall").attr({disabled:"disabled"});
	}
	})

	radio_click();
});

function  radio_click(){
	//开关
		$(".publicDiv").on('click','.checkboxAll_1',function(){
			$(this).toggleClass("f-switchTrue");
			if($(this).hasClass("f-switchTrue")){
				$(this).siblings(".checkboxAll").attr("value","1");
				$(this).siblings(".checkboxAll").attr("checked","checked");
				radio_toggle();
				console.log("on");
			}else{
				$(this).siblings(".checkboxAll").attr("value","0");
				$(this).siblings(".checkboxAll").removeAttr("checked");
				radio_toggle();
				console.log("off");	
			}
		})
	
}
//监听是否保存配置信息
function radio_toggle(){
	radioValue=$("#param_save").val();
	if(radioValue==1){
		$(".checkboxShall").attr({checked:"checked",value:"1"});
		$(".checkboxShall").addClass("checkedCurrent");
		$("#network_param").removeAttr("disabled");
		$("#host_name_param").removeAttr("disabled");
	}else{
		$(".checkboxShall").attr({disabled:"disabled",value:"0"});
		$("#network_param").removeAttr("checked");
		$("#host_name_param").removeAttr("checked");
		$(".checkboxShall").removeClass("checkedCurrent");
	}
	
}


function reset_confirm(){
	$("#resetModal").modal();
}


function init_reset_dialog(){
	$("#resetModal .modal-title").html(language[language_type]["DIALOG"]["reset"].title);
	var $p = $("<p/>").attr("class","single-tip").html(language[language_type]["DIALOG"]["reset"].content);
	$("#resetModal .modal-body").html($p);
	$("#resetModal .btn-confirm").off("click").on("click",function(){
		submit_bt();
	});
}

function submit_bt(){
	$("#resetModal").modal("hide");
	show_message("save",L.reseting);//显示遮罩
//	data_submit.keep_wan_config=$("#param_save").val();
//	data_submit.keep_wifi_config=$("#network_param").val();
//	data_submit.keep_host_config=$("#host_name_param").val();
//	data_submit.keep_plugin=$("#plugin_param").val();
var a1='{"jsonrpc": "2.0", "id": 1, "method": "call", "params": [ "'+localStorage.getItem('token_id')+'","routerd","factory",{}]}';

	request({
			url:"/ubus",
			data:a1
		}).done(function(data){
			data=JSON.stringify(data);
	        data = eval("(" + data + ")");
	         if(check_data(data)){
	         	if(data.result[0]==0){
	         		show_message("success");
	             	restartSuccess();
	             	hide_loading_page();
				show_content();
	         	}
	         	console.log(data);
	         }
		}).fail(function(data){
			hide_loading_page();
				show_err_page();	
		})

}

//手动重启成功后倒计时启动
function restartSuccess(){
	$(".fullScreenMask").removeClass("hidden");//显示遮罩
	$(".infoone").addClass("hidden");
	$(".infoone").eq(1).removeClass("hidden");
	var time=$("#time").html();
	settime(time);
	
}
//手动重启成功后倒计时启动
function settime(obj) {
    if (obj == 0) { 
    	if(!!router.rid && !!router.phoneId){
			window.location.replace("http://" + (judgeIsDomain() ? ROUTE_INFO.cclient_url : router.default_lan_ip) + "/login.html?page=1&rid="+ router.rid +"&phoneId=" + router.phoneId);
		}else{
//			location.href = "http://" + ROUTE_INFO.default_lan_ip + "/guide/guide.html";
			window.location.href = "http://" + router.default_lan_ip + "/login.html";
		}
        return;
    } else{
    	obj--; 
    	$("#time").html(obj);
    }
	setTimeout(function() { 
	    settime(obj) }
	    ,1000) 
	}