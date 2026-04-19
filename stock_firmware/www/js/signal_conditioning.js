//信号调节
var signalValue;//定义信号值
current_html = "signal_conditioning";
$(document).ready(function(){
	init_breadcrumbs();
	render_page();
	show_loading_page();
	lang.init(language[language_type]["PAGES"][current_html]);

	
	
	$(".sign-area").on("click","a",function(){//调节信号强度按钮
		$(".sign-area a").removeClass("selected");//移除所有a标签上的selected样式
		$(this).addClass("selected");//为点击的a标签添加selected样式
		signalValue=$(this).attr("data-power");
		
		if($("#text_low").hasClass("selected")){
			$(".scrollbar_add").animate({width:"3%"},500);
		}else if($("#text_middle").hasClass("selected")){
			$(".scrollbar_add").animate({width:"52%"},500);
		}else if($("#text_high").hasClass("selected")){
			$(".scrollbar_add").animate({width:"100%"},500);
		}
		console.log(signalValue);
		updateradiopower(signalValue);
	})
	
	

	//调用信号调节
getradiopower();

});
//获取单时段控制多时段控制
function getradiopower(){
	 var a1='{"jsonrpc": "2.0", "id": 8, "method": "call", "params": [ "'+localStorage.getItem('token_id')+'", "uci", "get", {"config": "wificfg","section":"2G"} ] }'
	 request({
			url:"/ubus",
			data:a1
		}).done(function(data){
			//	 	console.log(data);
            if(check_data(data)){   	
				if(data.result!=undefined && data.result[0]==0){	
	           		$(".sign-area a").removeClass("selected");//移除所有a标签上的selected样式
					for(var i=0;i<$(".sign-area a").length;i++){
						if($(".sign-area a").eq(i).attr("data-power")==data.result[1].values.TxPower){
							$(".sign-area a").eq(i).addClass("selected");
							var data_widht=$(".sign-area a").eq(i).attr("data-widht");
							$(".scrollbar_add").animate({width:data_widht},500);
						}
					}
					hide_loading_page();
				show_content();
				}else{
					hide_loading_page();
				show_err_page();	
				}
				
			}
		}).fail(function(data){
			hide_loading_page();
				show_err_page();	
		})
	 
}

//信号调节提交数据
function updateradiopower(postData){
//	console.log(postData)
	show_message("save");
	
	var a1='{"jsonrpc": "2.0", "id": 9, "method": "call", "params": [ "'+localStorage.getItem('token_id')+'", "uci", "set", {"config": "wificfg","section":"2G","values":{"TxPower":"'+postData+'"}} ] }'
	var a2='{"jsonrpc": "2.0", "id": 10, "method": "call", "params": [ "'+localStorage.getItem('token_id')+'", "uci", "set", {"config": "wificfg","section":"5G","values":{"TxPower":"'+postData+'"}} ] }'
var postCgi=function(){	
	
		$.when(setDataFn(a1),setDataFn(a2)).then(function(data1,data){
				if(check_data(data)){  
		 				if(data.result!=undefined && data.result[0]==0){
		 					var applyUci_data=applyUci();
		 					if(applyUci_data==0 || applyUci_data==5){
		 						
		 						show_message("success");
		 						getradiopower();
								
		            		}else{
								show_message_gt("error",applyUci_data);
							}
		 					
		 					
		 				}else{
		 					show_message_gt("error",data.error.code)
		 				}
	 			}
		});
	}

	var get_apply=get_apply_status();
		if(get_apply=="DONE"){
				postCgi();
		}else{
			get_apply_status_s(postData);
		}
}



function get_apply_status_s(postData){
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
					updateradiopower(postData)
					
				}else{
					setTimeout(get_apply_status_s(postData),5000);
				}
			}
		}).fail(function(data){
			 show_message("error",data);
		})
}