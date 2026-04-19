current_html = "network";
$(document).ready(function(){
	init_breadcrumbs();
	$(".navigation a").removeClass("current");//移除所有导航状态	
	$(".navigation a").eq(1).addClass("current");//给当前页面添加对应的导航
	paint_module_list(igd.module_list.network.menu,"network_sec");
	render_page();
	show_loading_page();
	ac_ap_status();
})