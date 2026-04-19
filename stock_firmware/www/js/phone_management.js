current_html = "phone_management";
$(document).ready(function(){
	init_breadcrumbs();
	$(".navigation a").removeClass("current");//�Ƴ����е���״̬	
	$(".navigation a").eq(1).addClass("current");//����ǰҳ����Ӷ�Ӧ�ĵ���
	lang.init(language[language_type]["PAGES"][current_html]);
	appJs = language[language_type]["PAGES"][current_html]["js"];
	render_page();
	show_loading_page();
  $.when(router_wechat_get()).then(function(){
	show_content();
});

})

 function init_img_src(data){
 	var  img_url="/api/wechat/showqrcode?hwid=&model=";
    var arr = img_url.split("hwid=");
    var url = arr[0] + "hwid=" + data.devid + arr[1] + data.model;
    url = "https://"+data.wechat_url+url;
    var $img = $("#qr-code-layer");
    $img.error(function(){
    	 $("#qrcode").css("border-width",0);
        $(".app_management_p2,#qr-code-layer").addClass("hidden");
        $(".app_management_p2").eq(1).removeClass("hidden");
        $("#no-internet-layer").removeClass("hidden");
    });
    $img.load(function(){
        $("#qrcode").css("border-width",1);
        $(".app_management_p2,#no-internet-layer").addClass("hidden");
        $(".app_management_p2").eq(0).removeClass("hidden");
         $("#qr-code-layer").removeClass("hidden");
       
    });
    console.log(url);
    $img.attr("src", url);
}
 
function router_wechat_get(){
		var param = '{"jsonrpc": "2.0", "id": 1, "method": "call", "params": [ "'+localStorage.getItem('token_id')+'", "routerd", "router_wechat_get", {} ] }'
		request({
			url:"/ubus",
			data:param
		}).done(function(data){
			console.log(data)
			init_img_src(data.result[1])
			
		}).fail(function(data){
			//show_request_err(data);
		})
}

