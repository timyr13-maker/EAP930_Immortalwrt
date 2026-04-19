current_html = "application";
$(document).ready(function(){
	init_breadcrumbs();
	render_page();
	show_loading_page();
	$(".navigation a").removeClass("current");//�Ƴ����е���״̬	
	$(".navigation a").eq(2).addClass("current");//����ǰҳ����Ӷ�Ӧ�ĵ���
	paint_module_list(igd.module_list.application.menu,"application-sec");
	
	$.when(ac_ap_status()).then(function(){
		show_content();
	});
})