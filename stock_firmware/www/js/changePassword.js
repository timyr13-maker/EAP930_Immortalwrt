//修改管理密码
current_html = "changePassword";
var sub_data={};//定时提交数据
$(document).ready(function(){
	init_breadcrumbs();
	render_page();
	show_loading_page();
	lang.init(language[language_type]["PAGES"][current_html]);
	$.when(login_name()).then(function(){
//		console.log(ROUTE_INFO.username)
//			hide_loading_page();
//			show_content();
	});
	new Password("igd_webs_password1");
	new Password("igd_webs_password2");
	
});

function changePassword_submit(){

	sub_data.user=ROUTE_INFO.username;
	sub_data.pwd=$("#igd_webs_password1").val();
	sub_data.pwd2=$("#igd_webs_password2").val();	
	var subdata={"jsonrpc": "2.0", "id": 17, "method": "call", "params": [ localStorage.getItem('token_id'), "routerd", "passwd_set", {user:ROUTE_INFO.username,pwd:sub_data.pwd} ] }
	subdata=JSON.stringify(subdata);
	if(check_input("user_pwd_frm")){
		if(sub_data.pwd!=sub_data.pwd2){
			show_message("error",L.pwd_differ);
			return false;
		}
		
		request({
			url:"/ubus",
			data:subdata
		}).done(function(data){
			 if(data.result){
					if(check_data(data)){
						if(data.result!=undefined){
							show_message("success");
							location.href = "./login.html";
						}else{
							show_message_gt("error",data.result[0]);						
						}
					}
				}else{
					show_message_gt("error",data.error.code);	
					check_data(data);
				}
		}).fail(function(data){
			//show_request_err(data);
		})
		
	}
	
}
