//重启路由

current_html = "restart_router";

function init_reset_dialog(){
	$("#resetModal .modal-title").html(language[language_type]["DIALOG"]["restart"].title);
	var $p = $("<p/>").attr("class","single-tip").html(language[language_type]["DIALOG"]["restart"].content);
	$("#resetModal .modal-body").html($p);
	$("#resetModal .btn-confirm").off("click").on("click",function(){
		submit_bt();
	});
}
function reset_confirm(){
	$("#resetModal").modal();
}





function submit_bt(){
	$("#resetModal").modal("hide");
	show_message("save",L.restarting);//显示遮罩
var a1='{"jsonrpc": "2.0", "id": 1, "method": "call", "params": [ "'+localStorage.getItem('token_id')+'","system","reboot",{}]}';
	request({
			url:"/ubus",
			data:a1
		}).done(function(data){
			if(check_data(data)){
	         	if(data.result[0]==0){
	         		show_message("success");
	             	restartSuccess();
	         	}
	         	console.log(data);
	         }	
		}).fail(function(data){
			//show_request_err(data);
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
			window.location.replace("http://" + (judgeIsDomain() ? ROUTE_INFO.cclient_url : router.default_lan_ip) + "wan_setup_ip/login.html?page=1&rid="+ router.rid +"&phoneId=" + router.phoneId);
		}else{
			window.location.href= "http://" + ROUTE_INFO.default_lan_ip + "/login.html";
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

$(document).ready(function(){
	init_breadcrumbs();
	init_reset_dialog();
	lang.init(language[language_type]["PAGES"][current_html]);
	render_page();
	show_loading_page();
	get_lan_ip();
});