
current_html = "ac_switch";
var appJs = null;


var management={
	
	
	
	get_data:function(type,setData,prefix){
		var me = this;
		var dfd = $.Deferred();
		var method = null;
		if(type == "ac_block_unknow_get"){
			method = "ac_block_unknow_get";
		}else if(type == "auto_ac_get"){
			method = "auto_ac_get";
		}else{
			method=type;
		}
		
		if(prefix==undefined){
			prefix="acap";
		}
		
		var timer_get={"jsonrpc": "2.0", "id":24, "method": "call", "params": [ localStorage.getItem('token_id'), prefix, method, setData ] }
		timer_get=JSON.stringify(timer_get);
		request({
			url:"/ubus",
			data:timer_get
		}).done(function(data){
			if(check_data(data)){	
				 if(type == "ac_block_unknow_get"){
				 	hide_loading_page();
					show_content();
					dfd.resolve(data.result[1]);
				}else if(type == "auto_ac_get"){
					dfd.resolve(data.result[1]);
				}else if(type == "auto_ac_set"){
					dfd.resolve(data.result[0]);
					me.get_ap_manage_data();
				}else if(type == "ac_block_unknow"){
					dfd.resolve(data.result[0]);
					me.ac_block_unknow_data_get();
				}
				dfd.resolve();
				
			}
			else{
				
				hide_loading_page();
				show_err_page();
			}
		}).fail(function(data){
			//show_request_err(data);
			hide_loading_page();
				show_err_page();
		})
		
		
		return dfd.promise();
	},
	get_ap_manage_data:function(){
		var me = this;
//		$.when(management.get_data("auto_ac_get",{},"routerd"),me.ac_block_unknow_data_get()).then(function(data2){
		$.when(me.ac_block_unknow_data_get()).then(function(data2){
//			checkbox_enable("ac_enable",data2.enable);
			console.log(data2)
//			if(data2.enable==0){
//				$("#autobind_div").addClass("hidden");
//			}else{
//				$("#autobind_div").removeClass("hidden");
//			}
			
			
		});
	},
	ac_block_unknow_data_get:function(){
	//		
						$.when(management.get_data("ac_block_unknow_get",{})).then(function(data){
							
							if(data.enable==0){
								checkbox_enable("autobind_enable",1);
							}else{
								checkbox_enable("autobind_enable",0);
							}
//							show_message("success");
						});
						
						console.log(2)			
	},
	empty:function(){
		var me = this;
		
		this.get_ap_manage_data();
		
	},
	
	add_event:function(){
		var me = this;
		
		$("body").undelegate(".ac_enable","click").delegate(".ac_enable","click",function(){
			if($(this).hasClass("f-switchTrue")){
				$("#close_ac").modal();
			}else{
				$("#enable_ac").modal();
			}
			
		});
		
		//关闭ac
		$("body").undelegate("#close_ac .btn-confirm","click").delegate("#close_ac .btn-confirm","click",function(){
			show_message("save");
			$.when(management.get_data("auto_ac_set",{"enable":0},"routerd")).then(function(data){
				$("#close_ac").modal("hide");
				show_message("success");
			});
		});
		//开启ac
		$("body").undelegate("#enable_ac .btn-confirm","click").delegate("#enable_ac .btn-confirm","click",function(){
			show_message("save");
			$.when(management.get_data("auto_ac_set",{"enable":1},"routerd")).then(function(data){
				$("#enable_ac").modal("hide");
				setTimeout(function(){
					me.ac_block_unknow_data_get();
				},5000)
			});
		});
		$("body").undelegate(".autobind_enable","click").delegate(".autobind_enable","click",function(){

			show_message("save");
			var set=$("#autobind_enable").val()*1;

				$.when(management.get_data("ac_block_unknow",{"enable":set})).then(function(data){
					show_message("success");
				});
				
				
//			}
			
		});
		$("body").undelegate("#close_networking .btn-confirm","click").delegate("#close_networking .btn-confirm","click",function(){
			show_message("save");
			$.when(management.get_data("ac_block_unknow",{"enable":1})).then(function(data){
				$("#close_networking").modal("hide");
				show_message("success");
			});
		});
		
		},
	
	init:function(){
		var me = this;
		
		this.get_ap_manage_data();
		this.add_event();
		
	}
}
function autobind_show(){
	var eb= $("#ac_enable").val();
	if(eb==0){
		$("#autobind_div").addClass("hidden");
	}else{
		$("#autobind_div").removeClass("hidden");
	}
}

$(document).ready(function(){
		init_breadcrumbs();
	render_page();
	show_loading_page();
		lang.init(language[language_type]["PAGES"][current_html]);
		appJs = language[language_type]["PAGES"][current_html]["js"];

	management.init();
//	$(".enable_click").on('click',function(){//1关闭  0打开
//				$(this).toggleClass("f-switchTrue");	
//			
//				if($(this).hasClass("f-switchTrue")){
//					$(this).siblings(".checkboxAll").attr("value","1").attr("checked");			
//					
//				}else{
//					$(this).siblings(".checkboxAll").attr("value","0").removeAttr("checked");
//					
//				}
//				if($(this).siblings(".checkboxAll").attr("id")=="ac_enable"){
//					autobind_show();
//				}
//				
//				
//		})
});
