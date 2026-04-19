var wan_config_data;//定义获取上网配置参数的值
var wanConfigSetData={};//定义dhcp模式下提交数据
var macSet={};//设置点击mac地址参数
var ip6prefix_all={};//存放ipv6的ip6prefix参数
var lan_dhcp={};//存放lan的dhcp
current_html = "external_network";
//外网设置



$(document).ready(function(){
	init_breadcrumbs();
	render_page();
	show_loading_page();
	lang.init(language[language_type]["PAGES"][current_html]);
//	tab切换	
	$(".f-network-tab").on('click','a',function () {
           var index = $(".f-network-tab a").index(this);
           $(".f-network-tab a").removeClass("selection");
          	$(this).addClass("selection");
           $('.infoone').eq(index).removeClass("hidden").siblings(".infoone").addClass("hidden");
       });

	$(".tab_area").on("click",".tab-item",function(){//tab标签切换
		$(".tab_area .tab-item").removeClass("selection");
		$(this).addClass("selection");
		$(".ipv_infoone").addClass("hidden");
		$(".ipv_infoone").eq($(this).index()).removeClass("hidden");
		if($(this).index()==0){
			wan_config_show();	//获取上网配置的参数接口
		}else if($(this).index()==1){
//			ipv6_uci_get();//获取ipv6数据
		}
	})

	//ipv6开关0是启用，1是禁用
		$(".enable_click").on('click',function(){//1关闭  0打开
			$(this).toggleClass("f-switchTrue");	
			
				if($(this).hasClass("f-switchTrue")){
					$(this).siblings(".checkboxAll").attr("value","1");			
					$(this).siblings(".checkboxAll").removeAttr("checked");
					$(".ipv6_s").removeAttr("disabled");	
//					console.log("on开",);
					
				}else{
					$(this).siblings(".checkboxAll").attr("value","0");
					$(this).siblings(".checkboxAll").removeAttr("checked");
//					console.log("off关");
					$(".ipv6_s").attr("disabled","disabled");	
					
				}
					enable_valn()
		})
//	连接类型的点击事件
	$(".russia_static .radio2").on('click',function(){//1关闭  0打开
		var this_v=$(this).children("input").val();
		var this_name=$(this).children("input").attr("name");
		if(this_v=="dhcp"){
			$(this).parents(".russia_static").siblings(".russia_static_address").addClass("hidden");
				if(this_name=="russia_rdio"){
					$("#russia_dns01_Optional").removeClass("hidden");
				}else if(this_name=="russia_l2tp_rdio"){
					$("#russia_l2tp_dns01_Optional").removeClass("hidden");
				}else if(this_name=="russia_pptp_rdio"){
					$("#russia_pptp_dns01_Optional").removeClass("hidden");
				}
		}else{
			$(this).parents(".russia_static").siblings(".russia_static_address").removeClass("hidden");
				if(this_name=="russia_rdio"){
					$("#russia_dns01_Optional").addClass("hidden");
				}else if(this_name=="russia_l2tp_rdio"){
					$("#russia_l2tp_dns01_Optional").addClass("hidden");
				}else if(this_name=="russia_pptp_rdio"){
					$("#russia_pptp_dns01_Optional").addClass("hidden");
				}
				
		}
//		console.log(this_name)
//		console.log($(this).parents(".russia_static").siblings(".russia_static_address"))
	})
	
//	ipv4上网方式下拉框点击
	$("#internet_access_ipv4").change(function(){
		var this_=$(this).prop('selectedIndex');
		$("#ipv4_settings .infoone").eq(this_).removeClass("hidden").siblings(".infoone").addClass("hidden");
		
//		console.log(this_)
//		$("#ipv4_table a").eq($("#internet_access_ipv4").prop('selectedIndex')).click();
	})
	
//	ipv6上网方式下拉框点击	
	$("#internet_access_ipv6").change(function(){
		
		var selectVal=$(this).val();
		if(selectVal=='dhcp'){			
			$('#ipv6_pppoe_form').addClass("hidden");			
		}else if(selectVal=='static'){
			$('#ipv6_pppoe_form').removeClass("hidden");	
			
		}
	})
//	ipv6 pppoe 的dns手选和自动
	$("input[name='ipv6_pppoe_dns_radio']").click(function(){
//		console.log($(this).val())
		if($(this).val()=="manual"){
			$("#dns_pppoe_ipv6").removeClass("hidden");
		}else{
			$("#dns_pppoe_ipv6").addClass("hidden");
		}
	})

//	ipv6 dhcp 的dns手选和自动
	$("input[name='ipv6_dhcp_dns_radio']").click(function(){
//		console.log($(this).val(),$(this).index())

		if($(this).val()=="manual"){
		
			$("#dns_dhcp_ipv6").removeClass("hidden");
		}else{
		
			$("#dns_dhcp_ipv6").addClass("hidden");
		}
	})
//	AFTR输入地址框显示
	$("input[name='ipv6_dslite_radio']").click(function(){
		console.log(Boolean($(this).val()),Boolean($(this).val()))
	
		if($(this).val()=="true"){
			$("#ipv6_aftr_div").removeClass("hidden");
		}else{
			$("#ipv6_aftr_div").addClass("hidden");
		}
	})
	
	//	ipv6 IPv6前缀手选和自动
	$("input[name='ipv6_static_ipprefix_radio']").click(function(){
//		console.log($(this).val(),$(this).index())

		if($(this).val()=="1"){
			$("#ipv6_static_ipprefix_div").removeClass("hidden");
		}else{
		
			$("#ipv6_static_ipprefix_div").addClass("hidden");
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
			
			if($('.checkboxShall').eq(0).hasClass("checkedCurrent")==false){
				$("#internet_vid,#internet_prio").attr("disabled","disabled");
			}else{
				$("#internet_vid,#internet_prio").removeAttr("disabled");
			}
			
			if($('.checkboxShall').eq(1).hasClass("checkedCurrent")==false){
				$("#iptv_vid,#iptv_prio").attr("disabled","disabled");
			}else{
				$("#iptv_vid,#iptv_prio").removeAttr("disabled");
			}
			
			if($('.checkboxShall').eq(2).hasClass("checkedCurrent")==false){
				$("#voip_vid,#voip_prio").attr("disabled","disabled");
			}else{
				$("#voip_vid,#voip_prio").removeAttr("disabled");
			}
	});
	
	devinfo_get_cgi();
	wan_config_show();	
	if(!!router.rid && !!router.phoneId){
		$(".app_cl").addClass("hidden");
	}else{
		$(".app_cl").removeClass("hidden");
	}
	
});


function bridging_set(){
	show_message("save");
	devinfo_set_cgi("bridge");
}
//获取上网方式是路由模式还是桥接模式

function devinfo_get_cgi(){
	var a1='{"jsonrpc": "2.0", "id": 17, "method": "call", "params": [ "'+localStorage.getItem('token_id')+'", "routerd","work_mode",{} ] }'
		$.post("/ubus", a1, function (data, textStatus){
		        
				if(check_data(data)){
					console.log(data.result[1].mode);
					var mode= data.result[1].mode;//router为路由模式，否则就为桥接模式
					if(mode=="route"){
						$(".tab-item").eq(0).click();
						$(".current_title").html(L.t_routing);
						
					}else{
						$(".tab-item").eq(1).click();
						$(".current_title").html(L.t_bridge);
						
						
					}
				}
		});
}

//宽带上网高级设置
function broadband_showFn(){
	$(".broadband_show").toggleClass("hidden");
}
//动态上网高级设置
function external_showFn(){
	$(".external_show").toggleClass("hidden");
}
//静态ip上网
function advance_bodyFn(){
	$(".advance_body").toggleClass("hidden");
}
//russia PPPoe高级设置
function russia_pppoe_showFn(){
	$(".russia_pppoe_show").toggleClass("hidden");
}
//L2tp russia高级设置
function russia_L2TP_showFn(){
	$(".russia_L2TP_show").toggleClass("hidden");
}
//pptp russia高级设置
function russia_pptp_showFn(){
	$(".russia_pptp_show").toggleClass("hidden");
}
function wan_config_show(){
		var a1='{"jsonrpc": "2.0", "id": 17, "method": "call", "params": [ "'+localStorage.getItem('token_id')+'", "routerd", "wan_config_get", {"wanid":1} ] }'

		request({
			url:"/ubus",
			data:a1
		}).done(function(data){
			data=JSON.stringify(data);
		        data = eval("(" + data + ")");
//				console.log('上网参数',data);
				if(check_data(data)){
					if(data.result[0]==0){
						wan_config_data=data.result[1];
						wan_config_handle(data.result[1]);
						$("#internet_access_ipv4").val(data.result[1].proto);
						
						if(data.result[1].proto=="l2tp" || data.result[1].proto=="pptp"){
							$("#ipv6_submit_false").removeClass("hidden");
							$("#ipv6_submit_really").addClass("hidden")
							$.when(_DATA.callUbus([null,"network.interface.wan1_other","status",{}],"get")).then(function(wan1data){
								var macShow=wan1data.result[1].clonemac;
								macSet.macaddr=wan1data.result[1].macaddr;
								 if (macShow == "00-00-00-00-00-00" || macShow == "00:00:00:00:00:00"){
									macShow=wan1data.result[1].macaddr;
								 }				
							});
						}else{
							$.when(_DATA.callUbus([null,"network.interface.wan1","status",{}],"get")).then(function(wan1data){
								var macShow=wan1data.result[1].clonemac;
								macSet.macaddr=wan1data.result[1].macaddr;
								 if (macShow == "00-00-00-00-00-00" || macShow == "00:00:00:00:00:00"){
									macShow=wan1data.result[1].macaddr;
								 }				
							});
							$("#ipv6_submit_false").addClass("hidden");
							$("#ipv6_submit_really").removeClass("hidden")
						}
						hide_loading_page();
						show_content();
					}
				}
		}).fail(function(data){
			hide_loading_page();
			show_err_page();	
		})


//	得到mac克隆地址
		

	
	request({
			url:"/cgi-bin/clientinfo",
			data:{}
		}).done(function(data){
			macSet.clonemac=data.result[1].mac;
//	console.log("得到mac克隆地址",data);
		}).fail(function(data){
			//show_request_err(data);
		})
       
}
//处理上网配置参数
function wan_config_handle(data){//WAN口类型，0:未知， 1:DHCP动态ip上网  2:PPPOE宽带pppoe 3: DHCP+PPPOE 静态ip上网
//	先处理显示哪个模块上网
//		$("#wan_setup_mtu0").val(1480);
//		$("#wan_setup_mtu1,#wan_setup_mtu2").val(1500);
//		
//		$("#russia_mtu").val(1492);
//		$("#russia_l2tp_mtu").val(1460);
//		$("#russia_pptp_mtu").val(1400);
	if(data.mtu==1500 && data.proto=="dhcp" || data.mtu==1500 && data.proto=="static"){
			$("#wan_setup_mtu1,#wan_setup_mtu2,#russia_mtu,#russia_l2tp_mtu,#russia_pptp_mtu").val(data.mtu);
			$("#wan_setup_mtu0").val(1480);
		}else if(data.proto=="pppoe" && data.mtu==1480){
			$("#wan_setup_mtu0").val(data.mtu);
			$("#wan_setup_mtu1,#wan_setup_mtu2,#russia_mtu,#russia_l2tp_mtu,#russia_pptp_mtu").val(1500);
		}else{
			$("#wan_setup_mtu0,#wan_setup_mtu1,#wan_setup_mtu2,#russia_mtu,#russia_l2tp_mtu,#russia_pptp_mtu").val(data.mtu);
		}
		
		$("#wan_setup_dns01,#wan_setup_dns11,#wan_setup_dns21,#russia_dns01,#russia_l2tp_dns01,#russia_pptp_dns01").val(data.dns1);
		$("#wan_setup_dns02,#wan_setup_dns12,#wan_setup_dns22,#russia_dns02,#russia_l2tp_dns02,#russia_pptp_dns02").val(data.dns2);
	if(data.proto=="pppoe"){//宽带pppoe
		function_access(0);
		
	}else if(data.proto=="dhcp"){//动态ip上网
		function_access(1);		
		
	}else if(data.proto=="static"){//静态ip上网
		function_access(2);		
		
	}else if(data.proto=="pppoe_r"){//俄罗斯接入pppoe
		function_access(3);
		
	}else if(data.proto=="l2tp"){//俄罗斯接入L2tp
		function_access(4);		
		
	}else if(data.proto=="pptp"){//俄罗斯接入pptp
		function_access(5);
	}else{console.log("未知上网")}
	//宽带pppoe
	$("#wan_setup_user0").val(data.username);
	$("#wan_setup_pass0").val(data.password);
	$("#server_name0").val(data.service);
	$("#ac_name0").val(data.ac);
	
//	$("#server_name0").val(data.PPPOE.server_name);
//	$("#ac_name0").val(data.PPPOE.ac_name);
	
	
	for(var i=0;i<2;i++){//工作模式
		var radio_val=$("input[name='work_mode_radio0']").eq(i).val();
		if(data.mode==radio_val){
			$("input[name='work_mode_radio0']").eq(i).attr("checked","checked");
		}else{
			$("input[name='work_mode_radio0']").eq(i).removeAttr("checked");
		}
	}
	
	
	//动态上网数据
//	$("#wan_setup_mac1").val(data.macaddr);
	
	
	for(var i=0;i<2;i++){//工作模式
		var radio_val=$("input[name='work_mode_radio1']").eq(i).val();
		if(data.mode==radio_val){
			$("input[name='work_mode_radio1']").eq(i).attr("checked","checked");
		}else{
			$("input[name='work_mode_radio1']").eq(i).removeAttr("checked");
		}
	}
	
	//静态ip上网数据
	if(data.ipaddr!="0.0.0.0"){
		$("#wan_setup_ip2").val(data.ipaddr);
	}
	if(data.netmask!="0.0.0.0"){
		$("#wan_setup_mask2").val(data.netmask);
	}
	if(data.gateway!="0.0.0.0"){
		$("#wan_setup_gw2").val(data.gateway);
	}

//	$("#wan_setup_mac2").val(data.macaddr);
	$("#wan_setup_mac0").val(data.macaddr);
	$("#wan_setup_mac1").val(data.macaddr);
	$("#wan_setup_mac2").val(data.macaddr);
	
	for(var i=0;i<2;i++){//工作模式
		var radio_val=$("input[name='work_mode_radio2']").eq(i).val();
		if(data.mode==radio_val){
			$("input[name='work_mode_radio2']").eq(i).attr("checked","checked");
		}else{
			$("input[name='work_mode_radio2']").eq(i).removeAttr("checked");
		}
	}
	
//	俄罗斯接入pppoe数据处理
	$("#russia_user").val(data.username);
	$("#russia_pass").val(data.password);
	$("#wan_setup_mac3").val(data.macaddr)
	
	$("#russia_pppoe_server_name0").val(data.service);
	$("#russia_ppoe_ac_name0").val(data.ac);
	
	for(var i=0;i<2;i++){//连接类型
		var radio_work=$("input[name='russia_rdio']").eq(i).val();
		if(data.other_proto!=undefined){
			if(data.other_proto==radio_work){
				$("input[name='russia_rdio']").eq(i).attr("checked","checked");
			}else{
				$("input[name='russia_rdio']").eq(i).removeAttr("checked");
			}
		}
		
	}
	for(var i=0;i<2;i++){//工作模式
		var radio_val=$("input[name='russia_work_radio0']").eq(i).val();
		if(data.mode==radio_val){
			$("input[name='russia_work_radio0']").eq(i).attr("checked","checked");
		}else{
			$("input[name='russia_work_radio0']").eq(i).removeAttr("checked");
		}
	}
	
	
	//	俄罗斯接入l2tp数据处理
	$("#russia_l2tp_user").val(data.l2tp_username);
	$("#russia_l2tp_pass").val(data.l2tp_password);
	$("#wan_setup_mac4").val(data.macaddr);
	
	
	$("#l2tp_domain_id").val(data.server);
	
	
	for(var i=0;i<2;i++){//连接类型
		var radio_work=$("input[name='russia_l2tp_rdio']").eq(i).val();
	if(data.other_proto!=undefined){
		if(data.other_proto==radio_work){
			$("input[name='russia_l2tp_rdio']").eq(i).attr("checked","checked");
		}else{
			$("input[name='russia_l2tp_rdio']").eq(i).removeAttr("checked");
		}
	}
	}
	for(var i=0;i<2;i++){//工作模式
		var radio_val=$("input[name='russia_l2tp_work_radio0']").eq(i).val();
		if(data.mode==radio_val){
			$("input[name='russia_l2tp_work_radio0']").eq(i).attr("checked","checked");
		}else{
			$("input[name='russia_l2tp_work_radio0']").eq(i).removeAttr("checked");
		}
	}
	
	//	俄罗斯接入pptp数据处理
	$("#russia_pptp_user").val(data.pptp_username);
	$("#russia_pptp_pass").val(data.pptp_password);
	$("#wan_setup_mac5").val(data.macaddr)
	
	$("#pptp_domain_id").val(data.server);
	$("#mppe_encryption").val(data.mppe);
	
	for(var i=0;i<2;i++){//连接类型
		var radio_work=$("input[name='russia_pptp_rdio']").eq(i).val();
	if(data.other_proto!=undefined){
		if(data.other_proto==radio_work){
			$("input[name='russia_pptp_rdio']").eq(i).attr("checked","checked");
		}else{
			$("input[name='russia_pptp_rdio']").eq(i).removeAttr("checked");
		}
	}
	}
	for(var i=0;i<2;i++){//工作模式
		var radio_val=$("input[name='russia_pptp_work_radio0']").eq(i).val();
		if(data.mode==radio_val){
			$("input[name='russia_pptp_work_radio0']").eq(i).attr("checked","checked");
		}else{
			$("input[name='russia_pptp_work_radio0']").eq(i).removeAttr("checked");
		}
	}
	
//	公共赋值
	//连接类型 ip地址、子网掩码、默认网关是否显示
	if(data.other_proto=="dhcp"){
		$(".russia_static_address").addClass("hidden");
		$("#russia_dns01_Optional,#russia_l2tp_dns01_Optional,#russia_pptp_dns01_Optional").removeClass("hidden");
		
				
	}else if(data.other_proto=="static"){
		$(".russia_static_address").removeClass("hidden");
		$("#russia_dns01_Optional,#russia_l2tp_dns01_Optional,#russia_pptp_dns01_Optional").addClass("hidden");
	}
	if(data.other_ipaddr!=undefined){
		$("#russia_other_ipaddr,#other_ipaddr_l2tp,#other_ipaddr_pptp").val(data.other_ipaddr);
	}
	if(data.other_netmask!=undefined){
		$("#russia_other_netmask,#other_netmask_l2tp,#other_netmask_pptp").val(data.other_netmask);
	}
	if(data.other_gateway!=undefined){
		$("#russia_other_gateway,#other_gateway_l2tp,#other_gateway_pptp").val(data.other_gateway);
	}
//		$("#russia_mtu").val(data.mtu);
//		$("#russia_l2tp_mtu").val(data.mtu);
//		$("#russia_pptp_mtu").val(data.mtu);
	
	
}

//	先处理显示哪个模块上网
function function_access (data) {
	$(".infoone").addClass("hidden");
	$(".infoone").eq(data).removeClass("hidden");
//	$(".f-network-tab a").removeClass("selection");
//	$(".f-network-tab a").eq(data).addClass("selection");
}
//mac克隆地址和恢复缺省mac
function set_mac_clone(index,data){
	if(data==1){
		$("#wan_setup_mac"+index).val(macSet.clonemac);
	}else if(data==2){
		$("#wan_setup_mac"+index).val(macSet.macaddr);
		
	}
}
//上网提交数据第一步处理动态上网pppoe处理
function netWork_pppoe_submit(){
	wanConfigSetData={};
	if(check_input("wan_pppoe_form")){
	//pppoe上网
	console.log("pppoe上网一步");
		wanConfigSetData.proto="pppoe";	
		wanConfigSetData.username=$("#wan_setup_user0").val();
		wanConfigSetData.password=$("#wan_setup_pass0").val();
		wanConfigSetData.macaddr=$("#wan_setup_mac0").val();
		wanConfigSetData.mtu=Number($("#wan_setup_mtu0").val());
		wanConfigSetData.dns1=$("#wan_setup_dns01").val();
		if($("#wan_setup_dns02").val()!=""){
			
			wanConfigSetData.dns2=$("#wan_setup_dns02").val();
		}
		
		wanConfigSetData.mode=$("input[name='work_mode_radio0']:checked").val();
		wanConfigSetData.service=$("#server_name0").val();
		wanConfigSetData.ac=$("#ac_name0").val();
		wanConfigSetData.wanid=1;

		wan_config_set();
		}
}
//上网提交数据第一步处理动态上网dhcp处理
function netWork_dhcp_submit(){
	wanConfigSetData={};
	if(check_input("wan_dhcp_form")){
		console.log("动态ip上网");
		wanConfigSetData.proto="dhcp";	
		wanConfigSetData.macaddr=$("#wan_setup_mac1").val();
		wanConfigSetData.mtu=Number($("#wan_setup_mtu1").val());
		wanConfigSetData.dns1=$("#wan_setup_dns11").val();
		if($("#wan_setup_dns12").val()!=""){
			wanConfigSetData.dns2=$("#wan_setup_dns12").val();
		}
		

		wanConfigSetData.mode=$("input[name='work_mode_radio1']:checked").val();
		wanConfigSetData.wanid=1;
		
		wan_config_set();
	}	
}
//上网提交数据第一步处理静态上网static处理
function netWork_static_submit(){
	wanConfigSetData={};
	console.log("静态ip上网第一步");
	if(check_input("wan_static_form")){
		console.log("静态ip上网第二步");
		wanConfigSetData.proto="static";	
		wanConfigSetData.macaddr=$("#wan_setup_mac2").val();
		wanConfigSetData.mtu=Number($("#wan_setup_mtu2").val());
		wanConfigSetData.dns1=$("#wan_setup_dns21").val();
		if($("#wan_setup_dns22").val()!=""){
			wanConfigSetData.dns2=$("#wan_setup_dns22").val();
		}
		
		
		wanConfigSetData.mode=$("input[name='work_mode_radio2']:checked").val();
		wanConfigSetData.wanid=1;
		wanConfigSetData.ipaddr=$("#wan_setup_ip2").val();
		wanConfigSetData.netmask=$("#wan_setup_mask2").val();
		wanConfigSetData.gateway=$("#wan_setup_gw2").val();
		
		
		wan_config_set();
	}
}
//俄罗斯 pppoe上网
function russia_submit(){
	wanConfigSetData={};
	wanConfigSetData.other_proto=$("input[name='russia_rdio']:checked").val();
	
	//pppoe上网
	console.log("俄罗斯接入pppoe上网一步");
		wanConfigSetData.proto=$("#internet_access_ipv4").val();	
		wanConfigSetData.username=$("#russia_user").val();
		wanConfigSetData.password=$("#russia_pass").val();
		wanConfigSetData.macaddr=$("#wan_setup_mac3").val();
		wanConfigSetData.mtu=Number($("#russia_mtu").val());
		wanConfigSetData.dns1=$("#russia_dns01").val();
		if($("#russia_dns02").val()!=""){
		wanConfigSetData.dns2=$("#russia_dns02").val();
		}
		wanConfigSetData.mode=$("input[name='russia_work_radio0']:checked").val();
		wanConfigSetData.service=$("#russia_pppoe_server_name0").val();
		wanConfigSetData.ac=$("#russia_ppoe_ac_name0").val();
		wanConfigSetData.wanid=1;
	
		if(wanConfigSetData.other_proto=="dhcp"){
			if(check_input("wan_russia_pppoe_form")){
				wan_config_set();
			}
		}else if(wanConfigSetData.other_proto=="static"){
			if(check_input("wan_russia_pppoe_static_state_form")){
				wanConfigSetData.other_ipaddr=$("#russia_other_ipaddr").val();
				wanConfigSetData.other_netmask=$("#russia_other_netmask").val();
				wanConfigSetData.other_gateway=$("#russia_other_gateway").val();	
				wan_config_set();
			}
			
		}	
}
//俄罗斯 L2tp上网
function russia_l2tp_submit(){
	wanConfigSetData={};
	wanConfigSetData.other_proto=$("input[name='russia_l2tp_rdio']:checked").val();
	

	console.log("俄罗斯接入L2tp上网一步");
		wanConfigSetData.proto=$("#internet_access_ipv4").val();	
		wanConfigSetData.l2tp_username=$("#russia_l2tp_user").val();
		wanConfigSetData.l2tp_password=$("#russia_l2tp_pass").val();
		wanConfigSetData.macaddr=$("#wan_setup_mac4").val();
		wanConfigSetData.mtu=Number($("#russia_l2tp_mtu").val());
		wanConfigSetData.dns1=$("#russia_l2tp_dns01").val();
		if($("#russia_l2tp_dns02").val()!=""){
			wanConfigSetData.dns2=$("#russia_l2tp_dns02").val();
		}
		
		
		wanConfigSetData.mode=$("input[name='russia_l2tp_work_radio0']:checked").val();
		wanConfigSetData.server=$("#l2tp_domain_id").val();
		
		wanConfigSetData.wanid=1;
	
		if(wanConfigSetData.other_proto=="dhcp"){
			if(check_input("wan_russia_L2TP_form")){
				wan_config_set();
			}
		}else if(wanConfigSetData.other_proto=="static"){
			if(check_input("wan_russia_L2TP_static_state_form")){
				wanConfigSetData.other_ipaddr=$("#other_ipaddr_l2tp").val();
				wanConfigSetData.other_netmask=$("#other_netmask_l2tp").val();
				wanConfigSetData.other_gateway=$("#other_gateway_l2tp").val();	
				wan_config_set();
			}
			
		}	
}
//俄罗斯 pptp上网
function russia_pptp_submit(){
	wanConfigSetData={};
	wanConfigSetData.other_proto=$("input[name='russia_pptp_rdio']:checked").val();
	

		wanConfigSetData.proto=$("#internet_access_ipv4").val();	
		wanConfigSetData.pptp_username=$("#russia_pptp_user").val();
		wanConfigSetData.pptp_password=$("#russia_pptp_pass").val();
		wanConfigSetData.macaddr=$("#wan_setup_mac5").val();
		wanConfigSetData.mtu=Number($("#russia_pptp_mtu").val());
		wanConfigSetData.dns1=$("#russia_pptp_dns01").val();
		if($("#russia_pptp_dns02").val()!=""){
			wanConfigSetData.dns2=$("#russia_pptp_dns02").val();
		}
		
		wanConfigSetData.mppe=Number($("#mppe_encryption").val());
		wanConfigSetData.mode=$("input[name='russia_pptp_work_radio0']:checked").val();
		wanConfigSetData.server=$("#pptp_domain_id").val();
		
		wanConfigSetData.wanid=1;
	
		if(wanConfigSetData.other_proto=="dhcp"){
			if(check_input("wan_russia_pptp_form")){
				wan_config_set();
			}
		}else if(wanConfigSetData.other_proto=="static"){
			if(check_input("wan_russia_pptp_static_state_form")){
				wanConfigSetData.other_ipaddr=$("#other_ipaddr_pptp").val();
				wanConfigSetData.other_netmask=$("#other_netmask_pptp").val();
				wanConfigSetData.other_gateway=$("#other_gateway_pptp").val();
				wan_config_set();
			}
			
		}	
}
//调用接口上传接口
function wan_config_set(){
	show_message("save");
    var a1={"jsonrpc": "2.0", "id": 18, "method": "call", "params": [ localStorage.getItem('token_id'), "routerd", "wan_config_set", wanConfigSetData] }
    a1=JSON.stringify(a1);
	
		
		request({
			url:"/ubus",
			data:a1
		}).done(function(data){
			if(check_data(data)){	
			if(data.result){
				if(data.result[0]==0){
					show_message("success");
					 wan_config_show();//上传成功后调用重新获取数据
				}else{
					show_message_gt("error",data.result[0]);
				}
			}
			else{
				show_message_gt("error",data.error.code);
			}
			}
		}).fail(function(data){
			//show_request_err(data);
		})
       	
}

//ipv6数据
function ipv6_uci_get(){
	 var a1={"jsonrpc": "2.0", "id": 18, "method": "call", "params": [ localStorage.getItem('token_id'), "routerd", "wan_ipv6_config_get",{"wanid":1}] }
  	  a1=JSON.stringify(a1);
  
		request({
			url:"/ubus",
			data:a1
		}).done(function(data){
			if(check_data(data)){
				
					if(data.result[0]==0){
						ipv6_toProcess_show(data.result[1]);
					}
					
			}
		}).fail(function(data){
			//show_request_err(data);
		})
}

//ipv6 数据显示
function ipv6_toProcess_show(data){
	$("#ipv6_switch").val(data.enable);//开关
	if(data.dslite==true ){
		$("input[name='ipv6_dslite_radio']").eq(0).attr("checked","checked");
		$("input[name='ipv6_dslite_radio']").eq(1).removeAttr("checked");
		
		$("#ipv6_aftr_div").removeClass("hidden");
	}else{
		$("input[name='ipv6_dslite_radio']").eq(1).attr("checked","checked");
		$("input[name='ipv6_dslite_radio']").eq(0).removeAttr("checked");
		$("#ipv6_aftr_div").addClass("hidden");	
	}	
	$("#ipv6_aftr").val(data.aftr);
//	上网方式
	if(data.wanmode=="auto"){
		$("#internet_access_ipv6").val("dhcp");
		$("#ipv6_pppoe_form").addClass("hidden");
	}else if(data.wanmode=="manu"){
		$("#ipv6_pppoe_form").removeClass("hidden");
		$("#internet_access_ipv6").val("static");
		//手动配置处理
		
		
	}
	
//	dns方式数据处理
	if(data.dnsmode=="auto" ){
		$("input[name='ipv6_dhcp_dns_radio']").eq(0).attr("checked","checked");
		$("input[name='ipv6_dhcp_dns_radio']").eq(1).removeAttr("checked");
		$("#dns_dhcp_ipv6").addClass("hidden");	
	}else{
		$("input[name='ipv6_dhcp_dns_radio']").eq(1).attr("checked","checked");
		$("input[name='ipv6_dhcp_dns_radio']").eq(0).removeAttr("checked");
		$("#dns_dhcp_ipv6").removeClass("hidden");
	}	
	$("#ipv6_static_ip").val(prefix_before_fn(data.ip6addr));//ip
	$("#ipv6_static_ip_prefix").val(prefix_after_fn(data.ip6addr));
	$("#ipv6_wan_setup_gw").val(data.ip6gw);//网关
		
		
	
	
//	LAN IPv6前缀
	if(data.ip6prefix==''){
		$("#ipv6_static_ipprefix").val("");
		$("#ipv6_wanprefix").val('');
		$("#ipv6_static_ipprefix_div").addClass("hidden");
		$("input[name='ipv6_static_ipprefix_radio']").eq(0).attr("checked","checked");
		$("input[name='ipv6_static_ipprefix_radio']").eq(1).removeAttr("checked");
	}else{
		$("#ipv6_static_ipprefix").val(prefix_before_fn(data.ip6prefix));
		$("#ipv6_wanprefix").val(prefix_after_fn(data.ip6prefix));
		$("#ipv6_static_ipprefix_div").removeClass("hidden");
		$("input[name='ipv6_static_ipprefix_radio']").eq(1).attr("checked","checked");
		$("input[name='ipv6_static_ipprefix_radio']").eq(0).removeAttr("checked");
	}
	console.log('11',prefix_before_fn(data.ip6prefix),)
	
	$("#ipv6_dhcp_dns_name").val(data.dns1);
	if(data.dns2!=undefined){
		$("#ipv6_dhcp_dns_name2").val(data.dns2);
	}
	enable_ipv6();
}
//处理前缀前面
function prefix_before_fn(data){
	var w=data.lastIndexOf("/");//前缀
	var before=data.substring(0,w);
	return before;
}
//得到前缀后门代码
function prefix_after_fn(data){
	var w=data.lastIndexOf("/");//前缀
	var after=data.substring(w+1,data.length);
	return after;
}
//关闭提交
function ipv6_all_submit(){
	var submitDtat={"auto":"0"};
	ipv6_uci_set(submitDtat);
}

//ipv6 总体提交提交
function ipv6_submit(){
	var ipv4_online=$("#internet_access_ipv4").val();
	if(ipv4_online=="l2tp" || ipv4_online=="pptp"){
		show_message("error",L.unable_set_IPv6);
	}else{
		if($("#ipv6_switch").val()==0){
		var submitDtat={"enable": 0,"wanid": 1}
		ipv6_uci_set(submitDtat);
		}else{
			if($("#internet_access_ipv6").val()=="dhcp"){
				ipv6_dhcp_submit();
			}else{
				ipv6_static_submit();
			}
		}
	}
	
	
}

//ipv6 dhcp提交
function ipv6_dhcp_submit(){
	var submitDtat={"wanid":1,"enable":1,"wanmode":"auto"};
	var radioVal=$("input[name='ipv6_dhcp_dns_radio']:checked").val();
	submitDtat.dslite=$("input[name='ipv6_dslite_radio']:checked").val();
	
	var radioVal_ipprefix=$("input[name='ipv6_static_ipprefix_radio']:checked").val();
	
	
	if(submitDtat.dslite=="true"){
		if(check_input("external_network_aftr")){
			submitDtat.dslite=true;
			submitDtat.aftr=$("#ipv6_aftr").val();
		}else{
			return false;
		}
	}else{
		submitDtat.dslite=false;
	}

	if(radioVal_ipprefix==1){
		if(!check_input("external_ipv6_static_ipprefix")){
			return false;
		}else{
			submitDtat.ip6prefix=$("#ipv6_static_ipprefix").val()+'/'+$("#ipv6_wanprefix").val();//前缀
		}
	}else{
		submitDtat.ip6prefix="";//前缀
	}
	
	if(radioVal=="manual"){
		if(check_input("external_network_ipv6_dhcp")){
			submitDtat.dnsmode="manu";
			submitDtat.dns1=$("#ipv6_dhcp_dns_name").val();
			submitDtat.dns2=$("#ipv6_dhcp_dns_name2").val();
			ipv6_uci_set(submitDtat);
		}
	}else{
		submitDtat.dnsmode="auto";
		ipv6_uci_set(submitDtat);
	}
	
}


       
//ipv6 static静态提交
function ipv6_static_submit(){
	var submitDtat={"wanmode":"manu","wanid":1,"enable":1};
	var radioVal=$("input[name='ipv6_dhcp_dns_radio']:checked").val();
	
	var radioVal_ipprefix=$("input[name='ipv6_static_ipprefix_radio']:checked").val();
	
	if(check_input("external_network_ipv6_static")){
		if(radioVal_ipprefix==1){
			if(!check_input("external_ipv6_static_ipprefix")){
				return false;
			}else{
				submitDtat.ip6prefix=$("#ipv6_static_ipprefix").val()+'/'+$("#ipv6_wanprefix").val();//前缀
			}
		}else{
			submitDtat.ip6prefix="";//前缀
		}
		submitDtat.ip6addr=$("#ipv6_static_ip").val()+'/'+$("#ipv6_static_ip_prefix").val();//ip
		
		submitDtat.ip6gw=$("#ipv6_wan_setup_gw").val();//网关	
		if(radioVal=="manual"){
			if(check_input("external_network_ipv6_dhcp")){
				submitDtat.dnsmode="manu";
				submitDtat.dns1=$("#ipv6_dhcp_dns_name").val();
				submitDtat.dns2=$("#ipv6_dhcp_dns_name2").val();
				ipv6_uci_set(submitDtat);
			}
		}else{
		submitDtat.dnsmode="auto";
		ipv6_uci_set(submitDtat);
	}
//		console.log(submitDtat);
		ipv6_uci_set(submitDtat);
	}
}


//设置ipv6 wan口
function ipv6_uci_set(submitDtat){
	
	show_message("save");
	var a1={"jsonrpc": "2.0", "id": 18, "method": "call", "params": [ localStorage.getItem('token_id'), "routerd", "wan_ipv6_config_set",submitDtat] }
  	a1=JSON.stringify(a1);
	request({
			url:"/ubus",
			data:a1
		}).done(function(data){
			if(check_data(data)){
				if(data.result[0]==0){
					show_message("success");
					 ipv6_uci_get();//上传成功后调用重新获取数据
					
				}else{
					show_message_gt("error",data.result[0]);
				}
			}
			else{
				show_message_gt("error",data.error.code);
			}
		}).fail(function(data){
			//show_request_err(data);
		})
}


//判断IPV6开关是否被禁用
function enable_ipv6(){
	
	if($("#ipv6_switch").val()==0){
		$(".ipv6_s").attr("disabled","disabled");
		$("#ipv6_switch").siblings(".button-label").removeClass("f-switchTrue");
		
	}else{
		$(".ipv6_s").removeAttr("disabled");		
		$("#ipv6_switch").siblings(".button-label").addClass("f-switchTrue");
	}
	
}

//VALN设置开关
function enable_valn(){
	if($("#vlan_mode").val()==0){
		$("#vlan-sec").addClass("hidden");
		
	}else{
		$("#vlan-sec").removeClass("hidden");
	}
	
}