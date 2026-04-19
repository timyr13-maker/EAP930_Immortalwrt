current_html = "restart_regularly";
//定时关闭无线
$(document).ready(function(){
	init_breadcrumbs();
	render_page();
	show_loading_page();
	lang.init(language[language_type]["PAGES"][current_html]);
	appJs = language[language_type]["PAGES"][current_html]["js"];
		

		$(".weekSlot").on("click","span",function(){//选着日期点击事件
			$(this).toggleClass("active");
			var thisIndex=$(this).index();
			var weekSlotVal=$(".weekSlotVal").val();//获取数组			
			if($(".weekSlot span").eq(thisIndex).hasClass("active")){//判断是否有被选中的class的名称
				$(this).attr("value",1);
				weekSlotVal=changeStr(weekSlotVal,thisIndex,1)
			}else{
				$(this).attr("value",0);
				weekSlotVal=changeStr(weekSlotVal,thisIndex,0)
			}
			$(".weekSlotVal").val(weekSlotVal);
//			console.log(weekSlotVal);

		})
//		开关点击
		$(".enable_click").click(function(){
			$(this).toggleClass("f-switchTrue")
			if($(this).hasClass("f-switchTrue")){
				$(this).siblings('.checkboxAll').attr("value","1");
				$(this).siblings('.checkboxAll').attr("checked","checked");
			}else{
				$(this).siblings('.checkboxAll').attr("value","0");
				$(this).siblings('.checkboxAll').removeAttr("checked");
			}
		})
		
		
//		时间框得到焦点事件
		$('.allChange').focus(function(){
//			console.log($(this).val());
			if($(this).val()=="00"){
				$(this).val(" ");
			}
		})
//		时间框失去焦点事件
		$('.allChange').blur(function(){
//			console.log($(this).val());
			if($(this).val()==" "){
				$(this).val("00");
			}
		})
		//限制时间的输入的大小
		$('.allChange').keyup(function(){
			var timeName=$(this).attr("name");
			var timeData=$(this).val();
			
			if(timeName=="start_hour"){
				if(timeData>=24){
					$(this).val(23);
				}
			}else if(timeName=="start_minute" || timeName=="start_sec"){
				if(timeData>=60){
					$(this).val(59);
				}
			}
		})
	
//调用表格
	
//	ap_timer("mul_get");
	ap_timer_get();
});


function ap_timer_set(){
	
	var ap_timer_data={};//定义要上传的东西
	ap_timer_data.enable=Number($("#restart_regularly_enable").val());
	ap_timer_data.hour=Number($("#hour").val());
	ap_timer_data.min=Number($("#min").val());
	ap_timer_data.sec=Number($("#sec").val());
	ap_timer_data.day_flags=reverseNumber($(".weekSlotVal").val());
	ap_timer_data.day_flags=toDecimal(ap_timer_data.day_flags);
	if(ap_timer_data.enable==1){
		if(ap_timer_data.day_flags==0){
			show_message("warning",L.check_one);
			return;
		}
		if(!check_input("restart_frm")){
			return;
		}
	}
	show_message("save");

		
//	console.log(ap_timer_data.day_flags,$(".weekSlotVal").val())
	var timer_set={"jsonrpc": "2.0", "id":24, "method": "call", "params": [ localStorage.getItem('token_id'), "routerd", "reboot_timer_set", ap_timer_data ] }
	timer_set=JSON.stringify(timer_set);
	request({
			url:"/ubus",
			data:timer_set
		}).done(function(data){
			if(check_data(data)){
				if(data.result){
	         		show_message("success");
	         		ap_timer_get();//重新调用列表
				}else{
					show_message_gt("error",data.error.code);
				}
				
			}
		}).fail(function(data){
			//show_request_err(data);
		})
}


function ap_timer_get(){
	var timer_get={"jsonrpc": "2.0", "id":24, "method": "call", "params": [ localStorage.getItem('token_id'), "routerd", "reboot_timer_get", {} ] }
		timer_get=JSON.stringify(timer_get);
	request({
			url:"/ubus",
			data:timer_get
		}).done(function(data){
			if(check_data(data)){		
				data=data.result[1];
//				console.log(data);
				if(data.hour!=0 ||data.hour!=""){
					$("#hour").val(data.hour);
				}
				if(data.min!=0 ||data.min!=""){
					$("#min").val(data.min);
				}
				if(data.sec!=0 ||data.sec!=""){
					$("#sec").val(data.sec);
				}
				
				var day_d=dec_two_bin(data.day_flags);
				day_d=reverseNumber(day_d);
				$(".weekSlotVal").val(day_d)
				day_d=day_d.split("");
//				console.log(day_d,day_d[0])
				for(var i=0;i<7;i++){
					if(day_d[i]==0){
						$(".weekSlot span").eq(i).removeClass("active").attr("value",0);
					}else if(day_d[i]==1){
						$(".weekSlot span").eq(i).addClass("active").attr("value",1);
					}
					
				}
				$("#restart_regularly_enable").val(data.enable);
				if(data.enable==0){
					$("#restart_regularly_enable").siblings(".enable_click").removeClass("f-switchTrue");
				}else{
					$("#restart_regularly_enable").siblings(".enable_click").addClass("f-switchTrue");
				}
			hide_loading_page();
				show_content();
			}
		}).fail(function(data){
			hide_loading_page();
				show_err_page();	
		})
	
}










