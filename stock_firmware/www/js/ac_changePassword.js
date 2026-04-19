//修改管理密码
current_html = "ac_changePassword";
var sub_data={};//定时提交数据
$(document).ready(function(){
	init_breadcrumbs();
	render_page();
	show_loading_page();
	lang.init(language[language_type]["PAGES"][current_html]);
	$.when(get_lan_ip()).then(function(){
//		console.log(ROUTE_INFO.username)
//			hide_loading_page();
//			show_content();
	});
		new Password("old_password");
	new Password("igd_webs_password1");
	new Password("igd_webs_password2");
});

function changePassword_submit(){

	sub_data.user=ROUTE_INFO.username;
	sub_data["old_pwd"]=$("#old_password").val();
	sub_data["new_pwd"]=$("#igd_webs_password1").val();
	sub_data.pwd=$("#igd_webs_password1").val();
	sub_data.pwd2=$("#igd_webs_password2").val();
	if(sub_data["old_pwd"]!=ROUTE_INFO.router_pwd && ROUTE_INFO.router_pwd!=undefined){
		show_differ_tip("old_password",L.password_error);
		return;
	}
	var subdata={"jsonrpc": "2.0", "id": 17, "method": "call", "params": [ localStorage.getItem('token_id'), "acap", "ac_set_passwd", sub_data ] }
	subdata=JSON.stringify(subdata);
	if(check_input("user_pwd_frm")){
		if(sub_data.pwd!=sub_data.pwd2){
			show_differ_tip("igd_webs_password2",L.pwd_differ);
			
			return false;
		}
		
		request({
			url:"/ubus",
			data:subdata
		}).done(function(data){
			 if(data.result){
					
						if(data.result[0]==0){
							show_message("success");
							setTimeout(function(){
								location.href = "./login.html";
							},1000)
							
						}else{
							show_message("error",L.password_error);						
						}
					
				}else{
					show_message("error",L.password_error);		
					// check_data(data);
				}
				
		}).fail(function(data){
			show_message("error",L.password_error);		
		})
		
	}
	
}
