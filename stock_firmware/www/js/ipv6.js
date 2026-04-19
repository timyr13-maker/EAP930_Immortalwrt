var wan_config_data;//定义获取上网配置参数的值
var wanConfigSetData={};//定义dhcp模式下提交数据
var macSet={};//设置点击mac地址参数
var ip6prefix_all={};//存放ipv6的ip6prefix参数
var lan_dhcp={};//存放lan的dhcp
current_html = "ipv6";
//外网设置



$(document).ready(function(){
	init_breadcrumbs();
	render_page();
	show_loading_page();
	lang.init(language[language_type]["PAGES"][current_html]);

	
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
	
	ipv6_uci_get();	
//	if(ROUTE_INFO.sw=='route'){
//			 $(".zt").attr("disabled",false);
//		}else{
			 $(".zt").attr("disabled",true);
			
//		}
});






//ipv6数据
function ipv6_uci_get(){
	 var a1={"jsonrpc": "2.0", "id": 18, "method": "call", "params": [ localStorage.getItem('token_id'), "routerd", "wan_ipv6_config_get",{"wanid":1}] }
  	  a1=JSON.stringify(a1);
		request({
			url:"/ubus",
			data:a1
		}).done(function(data){
			console.log('ipv6',data);
			if(check_data(data)){
				
				if(data.result[0]==0){
					ipv6_toProcess_show(data.result[1]);

				}	
				hide_loading_page();
				show_content()
		}
		}).fail(function(data){
			hide_loading_page();
				show_err_page();	
		})
		      	
}

//ipv6 数据显示
function ipv6_toProcess_show(data){
	$("#ipv6_switch").val(data.enable);//开关
	
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
		
		
	
	
	$("#ipv6_static_ipprefix").val(prefix_before_fn(data.ip6prefix));
	$("#ipv6_wanprefix").val(prefix_after_fn(data.ip6prefix));
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
	
	if(ip6prefix_all.ip6prefix!=undefined){
		submitDtat.ip6prefix="";
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
	if(check_input("external_network_ipv6_static")){
		
		submitDtat.ip6addr=$("#ipv6_static_ip").val()+'/'+$("#ipv6_static_ip_prefix").val();//ip
		submitDtat.ip6prefix=$("#ipv6_static_ipprefix").val()+'/'+$("#ipv6_wanprefix").val();//前缀
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
//		ipv6_uci_set(submitDtat);
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