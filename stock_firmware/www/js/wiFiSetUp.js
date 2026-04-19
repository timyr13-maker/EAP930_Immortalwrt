var wifiSetUpData={};//2.4g提交数据
//数据保存
var wifiSetUpData_5={},wifiGet5GData={};//5g提交数据
var regionSelection={};//地区集合
//1中国 4俄罗斯 6马来西亚
regionSelection.russia=[36,40,44,48,52,56,60,64,149,153,157,161,165]
//2美国 3欧洲
regionSelection.usa=[36,40,44,48,52,56,60,64,100,104,108,112,116,120,124,128,132,136,140,149,153,157,161,165]

//5孟加拉
regionSelection.bangladesh=[149,153,157,161];
// 160时中兴道

regionSelection.intermediate_channel=[36,40,44,48,52,56,60,64,]

var countryRegion={};//存储地区
current_html = "wiFiSetUp";

$(document).ready(function(){
	init_breadcrumbs();
	render_page();
	show_loading_page();
	init_reset_dialog();
	lang.init(language[language_type]["PAGES"][current_html]);

	
	//开关0是启用，1是禁用
		$(".enable_click").on('click',function(){//1关闭  0打开
			$(this).toggleClass("f-switchTrue");	
				if($(this).hasClass("f-switchTrue")){
					$(this).siblings(".checkboxAll").attr("value","1");			
					$(this).siblings(".checkboxAll").removeAttr("checked");
					
				}else{
					$(this).siblings(".checkboxAll").attr("value","0");
					$(this).siblings(".checkboxAll").removeAttr("checked");
//					console.log("off关");
				}
				
				if($(this).siblings(".checkboxAll").attr("id")=="wireless_2_4_enable"){
						clikcSwitch_24();
				}
				if($(this).siblings(".checkboxAll").attr("id")=="wireless_5_enable"){
					clikcSwitch_5();
				}
				if($(this).siblings(".checkboxAll").attr("id")=="dual_frequency_enable"){
					clikc_dual_frequency();
				}
				if($(this).siblings(".checkboxAll").attr("id")=="wireless_dual_frequency"){
					clikcSwitch_24_all();
				}
		})
	$(".radio_all").click(function(){
		if($(this).val()==1){
			$(this).val(0);
			$(this).removeAttr("checked");
		}else{
			$(this).val(1);
			$(this).attr("checked","checked");		
		}
	})
	
	$(".checkbox2 input").click(function(){
//		var timer_day=$("#timer_day").val().split('');//获取数组
			$(this).toggleClass("checkedCurrent");
			if($(this).hasClass("checkedCurrent")){
				$(this).val(1);
			}else{
				$(this).val(0);
			}	
	});
	$.when(ac_ap_status(),wireless_base_show("2G"),wireless_base_show("5G")).then(function(){
		show_content();
		if(ROUTE_INFO.ac_ap_status.role=="ap"){
			$("#dual_frequency_div").addClass("hidden");
		}
	});
	
	new Password("wireless_2_4_key_val");
	new Password("wireless_5_key_val");
	new Password("wireless_dual_frequency_key_val");
	
	
	
});


//根据网络模式控制twt显示 和频道宽带
function change_network_mode_2g(data){
	console.log(data)
	if(data=="bgnax"){
		$("#twt_select_24").removeAttr("disabled")
	}else{
		$("#twt_select_24").val(0);
		$("#twt_select_24").attr("disabled","disabled")
	}
	
	if(data=="b" || data=="g" || data=="bg"){
		$("#wlb_2_4_channel_width_sel").html("<option value='20M'>20M</option>");
	}else if(data=="n" || data=="gn" || data=="bgn" || data=="bgnax"){
		$("#wlb_2_4_channel_width_sel").html("<option value='auto'>"+L.auto+"</option><option value='20M'>20M</option><option value='40M+'>40M</option>");	
	}
	
	if(data=="b" || data=="a" || data=="bg"){
		$(".wireless_base_2g").addClass("hidden");
	}else{
		$(".wireless_base_2g").removeClass("hidden");
	}
	
}

//根据网络模式控制twt显示 和频道宽带
function change_network_mode_5g(data){
	console.log(data)
	if(data=="aanacax"){
		$("#twt_select_5").removeAttr("disabled")
	}else{
		$("#twt_select_5").val(0);
		$("#twt_select_5").attr("disabled","disabled")
	}
	channel_return("auto",countryRegion,"wireless_base_5_channel_sel")
	if(data=="a"){
		channel_return("20M",countryRegion,"wireless_base_5_channel_sel")
		$("#wlb_5_channel_width_sel").html("<option value='20M'>20M</option>");
	}else if(data=="n" || data=="an"){
		$("#wlb_5_channel_width_sel").html("<option value='auto'>"+L.auto+"</option><option value='20M'>20M</option><option value='40M+'>40M</option>");	
	}else if(data=="aanac" ){
		$("#wlb_5_channel_width_sel").html("<option value='auto'>"+L.auto+"</option><option value='20M'>20M</option><option value='40M+'>40M</option><option value='80M'>80M</option>");	
	}else if(data=="anac"  || data=="aanacax"){
		if(countryRegion==5){
			$("#wlb_5_channel_width_sel").html("<option value='auto'>"+L.auto+"</option><option value='20M'>20M</option><option value='40M+'>40M</option><option value='80M'>80M</option>");	
		}else{
			$("#wlb_5_channel_width_sel").html("<option value='auto'>"+L.auto+"</option><option value='20M'>20M</option><option value='40M+'>40M</option><option value='80M'>80M</option><option value='160M'>160M</option>");	
		}
		
	}
	// wireless_base_5_change();
	if(data=="b" || data=="a" || data=="bg"){
		$(".wireless_base_5g").addClass("hidden");
	}else{
		$(".wireless_base_5g").removeClass("hidden");
	}
	
}

//双频合一根据网络模式控制2.4g的twt显示 和频道宽带
function change_network_mode_all(data){
	if(data=="bgnax"){
		$("#twt_select_dual_frequency").removeAttr("disabled")
	}else{
		$("#twt_select_dual_frequency").val(0);
		$("#twt_select_dual_frequency").attr("disabled","disabled")
	}
	
	if(data=="b" || data=="g" || data=="bg"){
		$("#wlb_2_4_channel_width_sel_all").html("<option value='20M'>20M</option>");
	}else if(data=="n" || data=="gn"){
		$("#wlb_2_4_channel_width_sel_all").html("<option value='20/40M'>20M/40M</option><option value='20M'>20M</option><option value='40M+'>40M</option>");	
	}else if(data=="bgn" || data=="bgnax"){
		$("#wlb_2_4_channel_width_sel_all").html("<option value='auto'>"+L.auto+"</option><option value='20M'>20M</option><option value='40M+'>40M</option>");	
	}
	
	if(data=="b" || data=="a" || data=="bg"){
		$(".wireless_base_all").addClass("hidden");
	}else{
		$(".wireless_base_all").removeClass("hidden");
	}
}
//根据网络模式控制5g twt显示 和频道宽带
function change_network_mode_5g_all(data){
	if(data=="aanacax"){
		$("#twt_select_5_all").removeAttr("disabled")
	}else{
		$("#twt_select_5_all").val(0);
		$("#twt_select_5_all").attr("disabled","disabled")
	}

	channel_return("auto",countryRegion,"wireless_base_5_channel_sel_all")
	if(data=="a"){
		$("#wlb_5_channel_width_sel_all").html("<option value='20M'>20M</option>");
		channel_return("20M",countryRegion,"wireless_base_5_channel_sel_all")
	}else if(data=="n" || data=="an"){
		$("#wlb_5_channel_width_sel_all").html("<option value='auto'>"+L.auto+"</option><option value='20M'>20M</option><option value='40M+'>40M</option>");	
	}else if(data=="aanac" ){
		$("#wlb_5_channel_width_sel_all").html("<option value='auto'>"+L.auto+"</option><option value='20M'>20M</option><option value='40M+'>40M</option><option value='80M'>80M</option>");	
	}else if(data=="anac" || data=="aanacax"){
		if(countryRegion==5){
			$("#wlb_5_channel_width_sel_all").html("<option value='auto'>"+L.auto+"</option><option value='20M'>20M</option><option value='40M+'>40M</option><option value='80M'>80M</option>");	
		}else{
			$("#wlb_5_channel_width_sel_all").html("<option value='auto'>"+L.auto+"</option><option value='20M'>20M</option><option value='40M+'>40M</option><option value='80M'>80M</option><option value='160M'>160M</option>");	
		}
	}
	if(data=="b" || data=="a" || data=="bg"){
		$(".wireless_base_5g_all").addClass("hidden");
	}else{
		$(".wireless_base_5g_all").removeClass("hidden");
	
	}
	
	
	// wireless_base_5_change_all();
}

//根据区域来重新定义信道可选
function regionSelectionHandle(data){
	var newData="<option value='0'>"+L.auto+"</option>";
	for(var i=0;i<data.length;i++){
		var template="<option value='"+data[i]+"'>"+L.channel+" "+data[i]+"</option>";
		newData+=template;
	}
	return newData;
}

//	监听5g无线信道,当无线信道为165时,让频道宽带智能选自动和20m
function wireless_base_5_change(){
	var wlb_5_channel_width_sel=$("#wlb_5_channel_width_sel").val();

	channel_return(wlb_5_channel_width_sel,countryRegion,"wireless_base_5_channel_sel")
}


//	监听双频合一5g 5g无线信道,当无线信道为165时,让频道宽带智能选自动和20m
function wireless_base_5_change_all(){
	var wlb_5_channel_width_sel=$("#wlb_5_channel_width_sel_all").val();
	
	channel_return(wlb_5_channel_width_sel,countryRegion,"wireless_base_5_channel_sel_all")

}
function isExistOption(id,value) {  
    var isExist = false;  
    var count = $('#'+id).find('option').length;  

      for(var i=0;i<count;i++)     
      {     
         if($('#'+id).get(0).options[i].value == value)     
             {     
                   isExist = true;     
                        break;     
                  }     
        }     
        return isExist;  
} 
//判断2.4g是否被禁用
function clikcSwitch_24(){
//	console.log($("#wireless_2_4_enable").val());	
	//#wireless_2_4_enable值为1是oN  0是off
	if($("#wireless_2_4_enable").val()==0){	
		$(".allChange_2_4").attr("disabled","disabled");
		$("#wireless_2_4_enable").siblings(".button-label").removeClass("f-switchTrue");
		
	}else{
		$(".allChange_2_4").removeAttr("disabled");
		$("#wireless_2_4_enable").siblings(".button-label").addClass("f-switchTrue");
	}
}
//判断双频合一是否被是否被禁用
function clikcSwitch_24_all(){
//	console.log($("#wireless_2_4_enable").val());	
	//#wireless_2_4_enable值为1是oN  0是off
	if($("#wireless_dual_frequency").val()==0){
		$("#ck_ssid_dual_frequency").val(0);
		$("#ck_ssid_dual_frequency").removeAttr("checked");
		$("#ck_ssid_dual_frequency").removeClass("checkedCurrent");
		$("#select_dual_frequency").val(0);
		$("#wireless_dual_frequency").siblings(".button-label").removeClass("f-switchTrue");
		$(".allChange_2_5").attr("disabled","disabled");
	}else{
		$(".allChange_2_5").removeAttr("disabled");
		$("#wireless_dual_frequency").siblings(".button-label").addClass("f-switchTrue");
	}
}
//判断5g是否被禁用
function clikcSwitch_5(){
//	console.log($("#wireless_2_4_enable").val());	
	//#wireless_2_4_enable值为0是oN  1是off
	if($("#wireless_5_enable").val()==0){
		$("#backup_network_select_5").val(0);
		$(".allChange_5").attr("disabled","disabled");
		$("#wireless_5_enable").siblings(".button-label").removeClass("f-switchTrue");
	}else{

		$(".allChange_5").removeAttr("disabled");
		$("#wireless_5_enable").siblings(".button-label").addClass("f-switchTrue");
	}
	
}
//判断双频合一是否被打开
function clikcSwitch_dual_frequency(){
	if($("#dual_frequency_enable").val()==0){
		$(".form_24GWifiSetUp").removeClass("hidden");
		$(".form_dual_frequency").addClass("hidden");
		$("#dual_frequency_enable").siblings(".button-label").removeClass("f-switchTrue");
	}else{
		$(".form_24GWifiSetUp").addClass("hidden");
		$(".form_dual_frequency").removeClass("hidden");
		$("#dual_frequency_enable").siblings(".button-label").addClass("f-switchTrue");
	}
	
}
//点击双频合一
function clikc_dual_frequency(){
	if($("#dual_frequency_enable").val()==1){
		$("#wifi_prompt_box").modal();
	}else{
		$(".form_24GWifiSetUp").removeClass("hidden");
		$(".form_dual_frequency").addClass("hidden");
	}
	
	
}

//弹窗
function init_reset_dialog(){
	$("#wifi_prompt_box .modal-title").html(language[language_type]["DIALOG"]["tips_wiFiSetUp"].title);
	var $p = $("<p/>").attr("class","single-tip").html(language[language_type]["DIALOG"]["tips_wiFiSetUp"].content);
	$("#wifi_prompt_box .modal-body").html($p);
	$("#wifi_prompt_box .btn-confirm").off("click").on("click",function(){//确定
		if($("#dual_frequency_enable").val()==1){
			$(".form_24GWifiSetUp").addClass("hidden");
			$(".form_dual_frequency").removeClass("hidden");
		}else{
			$(".form_dual_frequency").addClass("hidden");
			$(".form_24GWifiSetUp").removeClass("hidden");
		}
		$("#wifi_prompt_box").modal("hide");
	});
	$("#wifi_prompt_box .btn-cancel").off("click").on("click",function(){//取消
			$(".form_dual_frequency").addClass("hidden");
			$(".form_24GWifiSetUp").removeClass("hidden");
			$("#dual_frequency_enable").siblings(".enable_click").removeClass("f-switchTrue");
			$("#dual_frequency_enable").attr("value","0");
			$("#dual_frequency_enable").removeAttr("checked");
		
	});
}
//获取wifi设置接口
var wifi_data_2g={},wifi_data_5g={};
function wireless_base_show(wafiNuml){
	 var a1='{"jsonrpc": "2.0", "id": 9, "method": "call", "params": [ "'+localStorage.getItem('token_id')+'", "uci", "get", {"config": "wificfg","section":"'+wafiNuml+'"} ] }'
		request({
			url:"/ubus",
			data:a1
		}).done(function(data){
			console.log(data);
				data=JSON.stringify(data);
	            data = eval("(" + data + ")");
	            if(check_data(data)){
	            	
					if(data.result!=undefined && data.result[0]==0){
					
		           		if(wafiNuml=="2G"){
							wifi_data_2g=data.result[1].values;
			               		broadband24(data.result[1].values);
			               		broadband24_all(data.result[1].values);
			               		formShow24g(data.result[1].values);
		               	}else if(wafiNuml=="5G"){
							wifi_data_5g=data.result[1].values;
		               		broadband5(data.result[1].values);
		               		broadband5_all(data.result[1].values);
		               		formShow5g(data.result[1].values);
		               		wifiGet5GData=data.result[1].values;
		               	}
		               	hide_loading_page();
					show_content();
					}else{
						hide_loading_page();
						show_err_page();
					}
				}
		}).fail(function(data){
			hide_loading_page();
				show_err_page();	
		})
	 


 

}
//处理2.4g页面显示数据
function formShow24g(data){
	console.log("处理2.4g页面显示数据",data);
	$("#dual_frequency_enable").val(data.dual_frequency_switch);//双频合一赋值
	$("#wireless_base_2g_sel_all,#wireless_base_2g_sel").val(data.WirelessMode1);
	
	 $("#dual_frequency_encryption_select").get(0).selectedIndex = EncrypType_fu(data.AuthMode1); 
	$("#dual_frequency_name").html(data.SSID1);
	$("#wire_dual_frequency_ssid,#wire_2_4_ssid").val(data.SSID1);
	$("#twt_select_24,#twt_select_dual_frequency").val(data.TWTSupport);
	
	if(data.HideSSID1==undefined || data.HideSSID1==0){//是否隐藏ssid   1是禁用
		$("#ck_2_4_ssid_broadcast").removeAttr("checked");
		$("#ck_2_4_ssid_broadcast").val(0);//是/否隐藏网络名称
	}else{
		$("#ck_2_4_ssid_broadcast").attr("checked","checked");
		$("#ck_2_4_ssid_broadcast").val(1);//是/否隐藏网络名称
	}
	 $("#wls_2_4_ap_mode_sel").get(0).selectedIndex = EncrypType_fu(data.AuthMode1); 
	
	show_Password24(data.EncrypType1);//根据加密方式判断密码框是否显示
	dual_frequency_encryption(data.EncrypType1);
	if(data.Passwd1==undefined){
		$("#wireless_2_4_key_val").val("");//密码
		$("#wireless_dual_frequency_key_val").val("");
	}else{
		$("#wireless_2_4_key_val").val(data.Passwd1);//密码
		$("#wireless_dual_frequency_key_val").val(data.Passwd1);
	}
	
	
	if(data.Enable1==undefined || data.Enable1==0){
		$("#wireless_2_4_enable").val(0);//
		$("#wireless_dual_frequency").val(0);//
	}else{
		$("#wireless_2_4_enable").val(data.Enable1);
		$("#wireless_dual_frequency").val(data.Enable1);
	}
	
	clikcSwitch_24();//判断状态是否被禁用
	clikcSwitch_24_all();
	change_network_mode_2g(data.WirelessMode1);
	change_network_mode_all(data.WirelessMode1);
	broadband24(data);
	broadband24_all(data);
}
//处理2.4g频道宽带 无线信道
function broadband24(data){
//	console.log("处理2.4g页面显示数据",data);
	if(data.WirelessMode1=="b" || data.WirelessMode1=="g" || data.WirelessMode1=="bg"){
			$("#wlb_2_4_channel_width_sel").html("<option value='20M'>20M</option>");
		}else if(data.WirelessMode1=="n" || data.WirelessMode1=="gn" || data.WirelessMode1=="bgn" || data.WirelessMode1=="bgnax"){
			$("#wlb_2_4_channel_width_sel").html("<option value='auto'>"+L.auto+"</option><option value='20M'>20M</option><option value='40M+'>40M</option>");	
		}
	
	if(data.BandWidth==undefined || data.BandWidth=="20M"){//处理频道宽带显示
		$("#wlb_2_4_channel_width_sel").val("20M");
	}else if(data.BandWidth=="40M-" || data.BandWidth=="40M" || data.BandWidth=="40M+"){
		$("#wlb_2_4_channel_width_sel").val("40M+");
	}else{
		$("#wlb_2_4_channel_width_sel").val(data.BandWidth);
	}

	if(data.CountryRegion==2){//wifi区域是美国
		$("#wireless_base_2_4_channel_sel option[value='12']").remove();
		$("#wireless_base_2_4_channel_sel option[value='13']").remove();
	}else{
		if($("#wireless_base_2_4_channel_sel option[value='12']").val()==undefined){
			$("#wireless_base_2_4_channel_sel").append("<option value='12'>"+L.channel+" 12</option>");
		}
		if($("#wireless_base_2_4_channel_sel option[value='13']").val()==undefined){
			$("#wireless_base_2_4_channel_sel").append("<option value='13'>"+L.channel+" 13</option>");
		}
	}
		//处理无线信道
	$("#wireless_base_2_4_channel_sel").val(data.Channel);
	clikcSwitch_dual_frequency();//判断双频合一是否被打开
}
//双频合一的2.4g
function broadband24_all(data){
//	console.log("处理2.4g页面显示数据",data);
	if(data.WirelessMode1=="b" || data.WirelessMode1=="g" || data.WirelessMode1=="bg"){
			$("#wlb_2_4_channel_width_sel_all").html("<option value='20M'>20M</option>");
	}else if(data.WirelessMode1=="n" || data.WirelessMode1=="gn" || data.WirelessMode1=="bgn" || data.WirelessMode1=="bgnax"){
			$("#wlb_2_4_channel_width_sel_all").html("<option value='auto'>"+L.auto+"</option><option value='20M'>20M</option><option value='40M+'>40M</option>");	
	}
	
	if(data.BandWidth==undefined || data.BandWidth=="20M"){//处理频道宽带显示
		$("#wlb_2_4_channel_width_sel_all").val("20M");
	}else if(data.BandWidth=="40M-" || data.BandWidth=="40M" || data.BandWidth=="40M+"){
		$("#wlb_2_4_channel_width_sel_all").val("40M+");
	}else{
		$("#wlb_2_4_channel_width_sel_all").val(data.BandWidth);
	}
//		双频合一
if(data.CountryRegion==2){//wifi区域是美国
		$("#wireless_base_2_4_channel_sel_all option[value='12']").remove();
		$("#wireless_base_2_4_channel_sel_all option[value='13']").remove();
	}else{
		if($("#wireless_base_2_4_channel_sel_all option[value='12']").val()==undefined){
			$("#wireless_base_2_4_channel_sel_all").append("<option value='12'>"+L.channel+" 12</option>");
		}
		if($("#wireless_base_2_4_channel_sel_all option[value='13']").val()==undefined){
			$("#wireless_base_2_4_channel_sel_all").append("<option value='13'>"+L.channel+" 13</option>");
		}
	}
		//处理无线信道
	
	$("#wireless_base_2_4_channel_sel_all").val(data.Channel);
	clikcSwitch_dual_frequency();//判断双频合一是否被打开
}

//根据频宽和地区返回信道
function channel_return(bandwidth,area,id,channel){
	
	var data;
	// if(bandwidth=="160M"){//160M仅在36-64信道上生效
	// 	if(area==3){
	// 		data=regionSelection.europe;
	// 	}else {
	// 		data=regionSelection.intermediate_channel;
	// 	}
	// }else{
		 if(area==2 || area==3){
			data=regionSelection.usa;
		}else if(area==1 || area==4 || area==6){
			data=regionSelection.russia;
		}else if(area==5){
			data=regionSelection.bangladesh;
		}
	// }
	
	if(bandwidth=="20M" && area!=5){
		if(data.indexOf(165)==-1){
			data.push(165);
		}
		
	}else{
		if(data.indexOf(165)!=-1){
		
			data=$.grep(data,function(value){  return value !=165})
		}
	}
	$("#"+id).html(regionSelectionHandle(data));
	if(channel!=undefined){
		$("#"+id).val(channel)
	}
}
//处理5g频道宽带 无线信道
function broadband5(data){
	//	console.log("处理5g页面显示数据",data);
	countryRegion=data.CountryRegion;
	if(data.BandWidth==undefined || data.BandWidth=="80M"){//处理频道宽带显示
		$("#wlb_5_channel_width_sel").val("80M");
		channel_return("80M",countryRegion,"wireless_base_5_channel_sel",data.Channel)
	}else{
		$("#wlb_5_channel_width_sel").val(data.BandWidth);
		channel_return(data.BandWidth,countryRegion,"wireless_base_5_channel_sel",data.Channel)
	}

}
//处理双频合一的5g频道宽带 无线信道
function broadband5_all(data){
	//	console.log("处理5g页面显示数据",data);
	countryRegion=data.CountryRegion;
	if(data.BandWidth==undefined || data.BandWidth=="80M"){//处理频道宽带显示
		$("#wlb_5_channel_width_sel_all").val("80M");
		channel_return("80M",countryRegion,"wireless_base_5_channel_sel_all",data.Channel)
	}else{
		$("#wlb_5_channel_width_sel_all").val(data.BandWidth);
		channel_return(data.BandWidth,countryRegion,"wireless_base_5_channel_sel_all",data.Channel)
	}
	

}
function show_Password24(data){//是否隐藏
	if(data=="AES"){
		$("#wireless_2_4_key_layer").removeClass("hidden");
	}else{
		$("#wireless_2_4_key_layer").addClass("hidden");	
	}
}


//处理5g页面显示数据
function formShow5g(data){
//	console.log("处理5g页面显示数据",data);
	var n=1;
//	if(data.Enable3==0){
//		n=1;
//	}else{
//		n=3;
//	}
	$("#wire_5_ssid").val(data["SSID"+n]);//5gwifi名称
	$("#wire_ssid_5g_4").val(data.SSID4);//备用网络的ssid名称	
	$(".spare_ssid").html(data.SSID4)
	$("#backup_network_select_5,#select_dual_frequency").val(data.Enable4);//备用网络的开关
	$("#ck_ssid_dual_frequency").val(data.Enable3);
	if(data.Enable3==0){
		$("#ck_ssid_dual_frequency").removeClass("checkedCurrent");
	}else{
		$("#ck_ssid_dual_frequency").addClass("checkedCurrent");
	}
	$("#twt_select_5").val(data["TWTSupport"]);
	$("#twt_select_5_all").val(data["TWTSupport"]);
	
	
	
	
	$("#wireless_base_5g_sel").val(data["WirelessMode"+n]);
	$("#wireless_base_5g_sel_all").val(data["WirelessMode"+n]);
	
	if(data["WirelessMode"+n]=="a"){
		$("#wlb_5_channel_width_sel").html("<option value='20M'>20M</option>");
	}else if(data["WirelessMode"+n]=="n" || data["WirelessMode"+n]=="an"){
		$("#wlb_5_channel_width_sel").html("<option value='20M'>20M</option><option value='40M+'>40M</option>");	
	}else if(data["WirelessMode"+n]=="anac" || data["WirelessMode"+n]=="aanac" || data["WirelessMode"+n]=="aanacax"){
		$("#wlb_5_channel_width_sel").html("<option value='20M'>20M</option><option value='40M+'>40M</option><option value='80M'>80M</option><option value='20/40/80M'>20/40/80M</option>");	
	}
	
	if(data["HideSSID"+n]==undefined || data["HideSSID"+n]==0){//是否隐藏ssid   1是禁用
		$("#ck_5_ssid_broadcast").removeAttr("checked");
		$("#ck_5_ssid_broadcast").val(0);//是/否隐藏网络名称
	}else{
		$("#ck_5_ssid_broadcast").attr("checked","checked");
		$("#ck_5_ssid_broadcast").val(1);//是/否隐藏网络名称
	}
	
	 $("#wls_5_ap_mode_sel").get(0).selectedIndex = EncrypType_fu(data["AuthMode"+n]); 
	show_Password5(data["EncrypType"+n]);//根据加密方式判断密码框是否显示
	
	if(data["Passwd"+n]==undefined){
		$("#wireless_5_key_val").val("");//密码
	}else{
		$("#wireless_5_key_val").val(data["Passwd"+n]);//密码
	}
	
	if(data["Enable"+n]==undefined || data["Enable"+n]==0){
		$("#wireless_5_enable").val(0);//
	}else{
		$("#wireless_5_enable").val(data["Enable"+n]);//
	}
	
	
	clikcSwitch_5();//判断状态是否被禁用
	change_network_mode_5g(data["WirelessMode"+n]);
	change_network_mode_5g_all(data["WirelessMode"+n]);
	broadband5(data);//处理5g信道显示
	broadband5_all(data);//处理5g信道显示
	// wireless_base_5_change();
	// wireless_base_5_change_all();
}

function show_Password5(data){//是否隐藏
	if(data=="AES"){
		$("#wireless_5_key_layer").removeClass("hidden");
	}else{
		$("#wireless_5_key_layer").addClass("hidden");
		
	}
}
function dual_frequency_encryption(data){
	if(data=="AES"){
		$("#dual_frequency_encryption_div").removeClass("hidden");
	}else{
		$("#dual_frequency_encryption_div").addClass("hidden");
		
	}
}

function submitForm5(){
	//无线基本信息设置
	wifiSetUpData={};
	wifiSetUpData_5={};
	wifiSetUpData_5.SSID1=$("#wire_5_ssid").val();//wifi名称
	wifiSetUpData_5.EncrypType1=$("#wls_5_ap_mode_sel").val();//加密方式
	wifiSetUpData_5.AuthMode1=authMode_fu($("#wls_5_ap_mode_sel").prop('selectedIndex'))//认证
	
	wifiSetUpData_5.HideSSID1=$("#ck_5_ssid_broadcast").val();//是否隐藏ssid   0是禁用
	wifiSetUpData_5.Enable1=$("#wireless_5_enable").val();//WiFi状态  1是禁用
	
//	设置频段基本信息
	wifiSetUpData_5.Channel=$("#wireless_base_5_channel_sel").val();//无线信道
	wifiSetUpData_5.BandWidth=$("#wlb_5_channel_width_sel").val();//频道宽带
	wifiSetUpData_5.WirelessMode1=$("#wireless_base_5g_sel").val();//工作模式
	wifiSetUpData_5.TWTSupport=$("#twt_select_5").val();
//	保留5g
	wifiSetUpData_5.SSID3=$("#wire_5_ssid").val();//wifi名称
	wifiSetUpData_5.EncrypType3=$("#wls_5_ap_mode_sel").val();//加密方式
	wifiSetUpData_5.AuthMode3=authMode_fu($("#wls_5_ap_mode_sel").prop('selectedIndex'))//认证
	wifiSetUpData_5.WirelessMode3=$("#wireless_base_5g_sel").val();//工作模式
	wifiSetUpData_5.HideSSID3=$("#ck_5_ssid_broadcast").val();//是否隐藏ssid   
	wifiSetUpData_5.Enable3="0";
	

//兼容模式5g
	wifiSetUpData_5.EncrypType4=$("#wls_5_ap_mode_sel").val();//加密方式
	wifiSetUpData_5.AuthMode4=authMode_fu($("#wls_5_ap_mode_sel").prop('selectedIndex'))//认证
	wifiSetUpData_5.HideSSID4=$("#ck_5_ssid_broadcast").val();//是否隐藏ssid   
	wifiSetUpData_5.WirelessMode4="aanac";//工作模式
	wifiSetUpData_5.SSID4=$("#wire_ssid_5g_4").val();//兼容模式ssid名称
	wifiSetUpData_5.Enable4=$("#backup_network_select_5").val();//WiFi状态  
	
//	设置频段基本信息
	wifiSetUpData_5.Channel=$("#wireless_base_5_channel_sel").val();//无线信道
	wifiSetUpData_5.BandWidth=$("#wlb_5_channel_width_sel").val();//频道宽带
	wifiSetUpData_5.dual_frequency_switch=$("#dual_frequency_enable").val();//双频合一开关
//	2.4g保存
	//无线基本信息设置 vap
	wifiSetUpData.dual_frequency_switch=$("#dual_frequency_enable").val();//双频合一开关
	wifiSetUpData.SSID1=$("#wire_2_4_ssid").val();//wifi名称
	wifiSetUpData.EncrypType1=$("#wls_2_4_ap_mode_sel").val();//加密方式
	wifiSetUpData.AuthMode1=authMode_fu($("#wls_2_4_ap_mode_sel").prop('selectedIndex'))//认证
	
	wifiSetUpData.HideSSID1=$("#ck_2_4_ssid_broadcast").val();//是否隐藏ssid   
	wifiSetUpData.Enable1=$("#wireless_2_4_enable").val();//WiFi状态  1是禁用
//	wifiSetUpData.WscConfStatus1=$("#lbl_wps_2_4_status").val();//wps
//	设置频段基本信息
	wifiSetUpData.Channel=$("#wireless_base_2_4_channel_sel").val();//无线信道
	wifiSetUpData.WirelessMode1=$("#wireless_base_2g_sel").val();//工作模式
	wifiSetUpData.BandWidth=$("#wlb_2_4_channel_width_sel").val();//频道宽带
	wifiSetUpData.TWTSupport=$("#twt_select_24").val();
	
	
	if(wifiSetUpData.dual_frequency_switch==0 && wifiSetUpData.SSID1==wifiSetUpData_5.SSID1){
		wifiSetUpData_5.SSID1=wifiSetUpData.SSID1+"-5G";
		wifiSetUpData_5.SSID1-wifiSetUpData_5.SSID3;
	}
	if(wifiSetUpData.SSID1==""){
		show_differ_tip("wire_2_4_ssid","SSID"+L.not_null);
		return;
	}
	if(wifiSetUpData_5.SSID1==""){
		show_differ_tip("wire_5_ssid","SSID"+L.not_null);
		return;
	}
	if($("#wls_2_4_ap_mode_sel").val()=="NONE"){
		if(check_input("wireless_base_2_4_frm")){
			if($("#wls_5_ap_mode_sel").val()=="NONE"){
					if(check_input("wireless_base_5_frm")){
						wifiSetUpsubmit();
					

					}
				}else{
					if(check_input("weifSetUp5")){
						wifiSetUpData_5.Passwd1=$("#wireless_5_key_val").val();//密码
						wifiSetUpData_5.Passwd3=$("#wireless_5_key_val").val();//密码
						wifiSetUpData_5.Passwd4=$("#wireless_5_key_val").val();//密码
						wifiSetUpsubmit();

					}
				}
		}
	}else{
		if(check_input("weifSetUp24")){
			wifiSetUpData.Passwd1=$("#wireless_2_4_key_val").val();//密码

			if($("#wls_5_ap_mode_sel").val()=="NONE"){
					if(check_input("wireless_base_5_frm")){
						wifiSetUpsubmit();
					}
				}else{
					if(check_input("weifSetUp5")){
						wifiSetUpData_5.Passwd1=$("#wireless_5_key_val").val();//密码
						wifiSetUpData_5.Passwd3=$("#wireless_5_key_val").val();//密码
						wifiSetUpData_5.Passwd4=$("#wireless_5_key_val").val();//密码
						wifiSetUpsubmit();
						

					}
				}
		}
	}
	
	

}

//加密方式和认证方式相关联,但认证方式页面不显示
function authMode_fu(data){
	switch(data)
	{
	    case 0:
	        return "OPEN"
	        break;
	    case 1:
	       return "WPAPSKWPA2PSK"
	        break;
	   case 2:
	        return "WPA2PSKWPA3PSK"
	        break;
	}

}
//处理同种加密方式时的显示
function EncrypType_fu(data){
	switch(data)
	{
	    case "OPEN":
	        return 0
	        break;
	    case "WPAPSKWPA2PSK":
	       return 1
	        break;
	   case "WPA2PSKWPA3PSK":
	        return 2
	        break;
	}
}

//提交代码调用接口
function wifiSetUpsubmit(){
	show_message("save");
	var set2g={"jsonrpc": "2.0", "id":11, "method": "call", "params": [ localStorage.getItem('token_id'), "uci", "set", {"config": "wificfg","section": "2G","values":wifiSetUpData } ] }
	var set5g={"jsonrpc": "2.0", "id":12, "method": "call", "params": [ localStorage.getItem('token_id'), "uci", "set", {"config": "wificfg","section": "5G","values":wifiSetUpData_5 } ] }
	set2g=JSON.stringify(set2g);
	set5g=JSON.stringify(set5g);
	var postCgi=function(){	
		$.when(setDataFn(set2g)).then(function(data){
			if(check_data(data)){
				if(data.result!=undefined && data.result[0]==0){
					$.when(setDataFn(set5g)).then(function(data){
					
						 	if(check_data(data)){
								if(data.result!=undefined && data.result[0]==0){	
			//						console.log(applyUci())
									var applyUci_data=applyUci();
									if(applyUci_data==0 || applyUci_data==5){
											show_message("success");
											wireless_base_show("2G");
											wireless_base_show("5G");
									}else{
										show_message_gt("error",applyUci_data);
									}
									
								}else{		
									show_message_gt("error",data.error.code);
								}
							}
					});
					}else{		
						show_message_gt("error",data["result"][0]);
					}
			}
		});
      } 
     var get_apply=get_apply_status();
		if(get_apply=="DONE"){
			postCgi();
		}else{
			
			get_apply_status_s();
		}  
}

function get_apply_status_s(){
	var s;
	var a1='{"jsonrpc": "2.0", "id": 10, "method": "call", "params": [ "'+localStorage.getItem('token_id')+'", "wifi", "get_apply_status",  {} ] }'
	request({
			url:"/ubus",
			
			data:a1
		}).done(function(data){
			 if(check_data(data)){
				if(data.result[1]==undefined){
					s=data.result[0];
				}else{
					s=data.result[1].status;
				}
					if(s=="DONE"){
						wifiSetUpsubmit();
						
					}else{
						setTimeout(get_apply_status_s(),5000);
					}
				}
		}).fail(function(data){
			show_message("error",data);
		})
	

}
//2.4G高级设置
function advanced_setting_24(){
	$(".24_advanced_setting").toggleClass("hidden");
}
//5G高级设置
function advanced_setting_5(){
	$(".5_advanced_setting").toggleClass("hidden");
}
//双频合一高级设置
function dual_frequency_senior(){
	$("#dual_frequency_senior_div").toggleClass("hidden");
}

//双频合一保存
function submitForm_dual_frequency(){
	wifiSetUpData={};
	wifiSetUpData_5={};
//	2g数据
	wifiSetUpData.dual_frequency_switch=$("#dual_frequency_enable").val();//双频合一赋值
	wifiSetUpData.Enable1=$("#wireless_dual_frequency").val();//wifi状态
	wifiSetUpData.EncrypType1=$("#dual_frequency_encryption_select").val();//加密方式
	wifiSetUpData.AuthMode1=authMode_fu($("#dual_frequency_encryption_select").prop('selectedIndex'))//认证
	wifiSetUpData.SSID1=$("#wire_dual_frequency_ssid").val();//ssid
	wifiSetUpData.Channel=$("#wireless_base_2_4_channel_sel_all").val();//无线信道
	wifiSetUpData.WirelessMode1=$("#wireless_base_2g_sel_all").val();//工作模式
	wifiSetUpData.BandWidth=$("#wlb_2_4_channel_width_sel_all").val();//频道宽带
	wifiSetUpData.TWTSupport=$("#twt_select_dual_frequency").val();//twt
	//5g数据
	wifiSetUpData_5.dual_frequency_switch=$("#dual_frequency_enable").val();//双频合一赋值
	wifiSetUpData_5.Enable1=$("#wireless_dual_frequency").val();//wifi状态
	wifiSetUpData_5.EncrypType1=$("#dual_frequency_encryption_select").val();//加密方式
	wifiSetUpData_5.AuthMode1=authMode_fu($("#dual_frequency_encryption_select").prop('selectedIndex'))//认证
	wifiSetUpData_5.SSID1=$("#wire_dual_frequency_ssid").val();//ssid
	if(wifiGet5GData.SSID3==undefined){
		wifiSetUpData_5.SSID3=$("#wire_5_ssid").val();
	}
	wifiSetUpData_5.Channel=$("#wireless_base_5_channel_sel_all").val();//无线信道
	wifiSetUpData_5.BandWidth=$("#wlb_5_channel_width_sel_all").val();//频道宽带
	wifiSetUpData_5.WirelessMode1=$("#wireless_base_5g_sel_all").val();//工作模式
	wifiSetUpData_5.TWTSupport=$("#twt_select_5_all").val();
	
	wifiSetUpData_5.Enable3=$("#ck_ssid_dual_frequency").val();//保留当前5G网络
	wifiSetUpData_5.Enable4=$("#select_dual_frequency").val();//兼容5g-4
	wifiSetUpData_5.WirelessMode4="aanac";//工作模式
	if(wifiSetUpData.SSID1==""){
		show_differ_tip("wire_dual_frequency_ssid","SSID"+L.not_null);
		return;
	}
	if(check_input("dual_frequency_ssid_frm")){
		if($("#dual_frequency_encryption_select").val()=="NONE"){
				wifiSetUpsubmit();
		}else{
			if(check_input("dual_frequency_password_frm")){
				wifiSetUpData.Passwd1=$("#wireless_dual_frequency_key_val").val();
				wifiSetUpData_5.Passwd1=$("#wireless_dual_frequency_key_val").val();
				wifiSetUpData_5.Passwd3=$("#wireless_dual_frequency_key_val").val();
				wifiSetUpsubmit();
			}
		}
	}
}
