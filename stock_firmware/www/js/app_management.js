current_html = "app_management";


 
 
function router_wechat_get(){
		var param = '{"jsonrpc": "2.0", "id": 1, "method": "call", "params": [ "'+localStorage.getItem('token_id')+'", "routerd", "hwid_get", {} ] }'
		request({
			url:"/ubus",
			data:param
		}).done(function(data){
			hide_loading_page();
					show_content();
			console.log(data.result[1]["hwid"])
			jQuery('#qrcode').qrcode({
			    render: "canvas", //也可以替换为table
			    width: $("#qrcode").width(),
			    height: $("#qrcode").height(),
			    text: "DEVICE"+data.result[1]["hwid"],
			});
			hide_loading_page();
					show_content();
		}).fail(function(data){
			//show_request_err(data);
		})
}

$(document).ready(function(){
	init_breadcrumbs();
	$(".navigation a").removeClass("current");
	lang.init(language[language_type]["PAGES"][current_html]);
	appJs = language[language_type]["PAGES"][current_html]["js"];
	render_page();
	show_loading_page();
	router_wechat_get();
})