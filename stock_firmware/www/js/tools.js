current_html = "tools";


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
	
	render_page();
	show_loading_page();
	lang.init(language[language_type]["PAGES"][current_html]);
	$.when(configurationState()).then(function(){
//		$.when(init_qrcode()).then(function(){
			
//		});
	});
	hide_loading_page();
			show_content();
			tools.init();
});