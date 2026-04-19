
current_html = "indicator_light";

$(document).ready(function(){
	init_breadcrumbs();
	render_page();
	show_loading_page();
	lang.init(language[language_type]["PAGES"][current_html]);
	
	
	//开关0是启用，1是禁用
		$(".enable_click").on('click',function(){//1关闭  0打开
			$(this).toggleClass("f-switchTrue");	
				if($(this).hasClass("f-switchTrue")){
					$(this).siblings(".checkboxAll").attr("value","0");
					$(this).siblings(".checkboxAll").removeAttr("checked");
				}else{
					$(this).siblings(".checkboxAll").attr("value","1");			
					$(this).siblings(".checkboxAll").removeAttr("checked");
					console.log("on开");
					
					console.log("off关");
				}
		})
		indicator_light_get();
});

//获取wifi设置接口
function indicator_light_get(){
var a1='{"jsonrpc": "2.0", "id": 8, "method": "call", "params": [ "'+localStorage.getItem('token_id')+'", "uci", "get", {"config": "system","section": "@system[0]","option": "ledoff"} ] }'
	
	 
	 request({
			url:"/ubus",
			data:a1
		}).done(function(data){
			console.log(data.result[1].value);
			 	if(check_data(data)){
			 		$("#indicator_light_enable").val(data.result[1].value);
			 		if(data.result[1].value==0){
			 			$(".enable_click ").addClass("f-switchTrue");
			 		}else{
			 			$(".enable_click ").removeClass("f-switchTrue");
			 		}
			 		hide_loading_page();
				show_content();
			 	}	
		}).fail(function(data){
			hide_loading_page();
				show_err_page();	
		})

}

var setUpData={};
function submitForm(){
	setUpData={};
	setUpData.ledoff=$("#indicator_light_enable").val();
	
	set_cgi();
		
}
function set_cgi(){
	show_message("save");
	var setData={"jsonrpc": "2.0", "id":11, "method": "call", "params": [ localStorage.getItem('token_id'), "uci", "set", {"config": "system","section": "@system[0]","values":setUpData } ] }
	 setData=JSON.stringify(setData);
	 var postCgi=function(){
	
		request({
			url:"/ubus",
			data:setData
		}).done(function(data){
			if(check_data(data)){
				if(data.result!=undefined && data.result[0]==0){
					var applyUci_data=applyUci();
						if(applyUci_data==0 || applyUci_data==5){
								show_message("success");
								indicator_light_get();
						}else{
							show_message_gt("error",applyUci_data);
						}
					}else{		
						show_message_gt("error",data.error.code);
					}
			}
		}).fail(function(data){
			//show_request_err(data);
		})
      } 
	 var get_apply=get_apply_status();
		if(get_apply=="DONE"){
			postCgi();
		}else{
			
			get_apply_status_s();
		}  
}

function get_apply_status_s(){
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
						set_cgi();
						
					}else{
						setTimeout(get_apply_status_s(),5000);
					}
			}
		}).fail(function(data){
			 show_message("error",data);
		})
	
	
}