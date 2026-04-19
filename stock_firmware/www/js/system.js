current_html = "system";
var tools = {
	switchLanguage:function(){
		var arr = lang.langArr;
		var val = getLangSession();
		for(var i in arr){
			var $li = $("<li/>");
			$li.html(arr[i].txt).attr("data-value",arr[i]["value"]).off(E).on(E,function(){
				var value = $(this).attr("data-value");
				if(val != value)
					languageSwith(value);
			});
			
			if(arr[i]["value"] == val){
				$li.attr("class","active");
				$("#curLanguage").html(arr[i].txt);
			}
			$(".action-button-list").append($li);	
		}
	},
	addEvent:function(){
		$(".btn-exit").off(E).on(E,function(){
			signOut(true);
		});
		
		$("#bindScan").off(E).on(E,function(){
			location.href = "./app_management.html";
		});
		
	},
	init:function(){
		this.addEvent();
		this.switchLanguage();
	}
};

$(document).ready(function(){
	init_breadcrumbs();
	$(".navigation a").removeClass("current");//移除所有导航状态
	
	render_page();
	show_loading_page();
//	lang.init(language[language_type]["PAGES"][current_html]);
	
	$.when(configurationState()).then(function(){
	if(!!router.rid && !!router.phoneId){
		for(var i in igd.module_list.system.menu){
			if(igd.module_list.system.menu[i].id == "parameter_backup" ){
				igd.module_list.system.menu[i].display = false;
			}
		}
//		$("#accordionParent").Show();
	}else{
//		$("#accordionParent").hide();
	}
			hide_loading_page();
			show_content();
			tools.init();
	})
	paint_module_list(igd.module_list.system.menu,"system-sec");
//	ac_ap_status();
	setTimeout(function(){
		$(".navigation a").eq(3).addClass("current");//给当前页面添加对应的导航
	},100)
})