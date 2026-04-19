if (!igd) var igd = new Object();

igd.module_list = {
	index:{
		title:language[language_type]["MENU"]["top-menu"]["index"],
		menu:[
			{
				id:"ap_manage",
				display:true
			},
			{
				id:"wifi_management",
				display:true
			},

			{
				id:"rf_settings",
				display:true
			},
			{
				id:"pilot_lamp",
				display:true
			},
			
			{
				id:"wired_vlan",
				display:true
			},
			{
				id:"restart",
				display:true
			},
			{
				id:"apac_upgradation",
				display:true
			},
			{
				id:"ac_switch",
				display:true
			},
			{
				id:"ac_changePassword",
				display:true
			},
			{
				id:"captive_portal",
				display:true
			},
			
		],
	},
	ap_index:{
		title:language[language_type]["MENU"]["top-menu"]["index"],
		menu:[
			{
				id:"networkingEquipment",
				display:false
			},{
				id:"router_info",
				display:true
			},
			{
				id:"wiFiSetUp",
				display:true
			},

			{
				id:"ap_lan_setup",
				display:true
			},
			{
				id:"signal_conditioning",
				display:true
			},
			{
				id:"external_network",
				display:false
			},
			
			
			
		],
	},
    network: {
        title: language[language_type]["MENU"]["top-menu"]["network"],
        menu: [//信号调节 组网漫游 IPTV 无线中继 WPS 端口配置 静态路由 高级模式（开发者模式）
			
			{
				id:"ipv6",
				display:true
			},
			{
				id:"access_control",
				display:true
			},
	{
				id:"captive_portal",
				display:true
			},
			{
				id:"developer",
				display:true
			},
			

		]
    },
	application:{
		title: language[language_type]["MENU"]["top-menu"]["application"],
		menu:[//唤醒 远程访问
			{
				id:"portMapping",
				display:true
			},
			{
				id:"oray_ddns",
				display:true
			},
			{
				id:"remoteAccess",
				display:true
			},
			{
				id:"qos",
				display:true
			},
			{
				id:"diagnosis",
				display:true
			},
			{
				id:"port_mirror",
				display:true
			},
			{
				id:"tr069",
				display:true
			}
		]
	},
    system: {
		title: language[language_type]["MENU"]["top-menu"]["system"],
		menu: [//拨号日志 使用统计
			{
				id:"router_info",
				display:true
			},
			{
				id:"restart_regularly",
				display:false
			},
			{
				id:"indicator_light",
				display:true
			},
			{
				id:"factory_settings",
				display:true
			},
			{
				id:"changePassword",
				display:true
			},
			{
				id:"restart_router",
				display:true
			},
			{
				id:"timeSetting",
				display:true
			},
			{
				id:"system_upgrade",
				display:true
			},
			{
				id:"parameter_backup",
				display:false
			},
			{
				id:"dial_up_log",
				display:false
			},
			
			
			
		]	
	}
};
var isp = {
	"DLINK":{
		"default_lan_ip":"192.168.1.254",
		"login_website":"router.dlink"
	}
}


var router = {
	module:"EAP930",
	vendor:"DLINK",
	restart_time:90,
	reset_time:90,
	update_time:130,
	lan_num:4,
	wan_num:1,
	single_freq:false,
	pwd_strength_level:2,
	support_bandsteering:true,
	default_lan_ip:document.domain,
	default_lan_mask:"255.255.255.0",
	default_port:"80",
//	login_website:isp["DLINK"]["login_website"],
	official_website:"www.netis-systems.com",
	wireless_rate:"3000Mbps",
	flash:"256MB",
	default_username:"useradmin",
	//consumer_hotline:"",
	ctei:"",
	sn:"",
	mac:null,
	rid:null,
	phoneId:null,
	version:null
};



$.extend(router,language[language_type]["VENDOR"][router.vendor]);

;(function(){
	for(var i in igd.module_list){
		for(var j in igd.module_list[i]["menu"]){
			igd.module_list[i]["menu"][j].name = language[language_type]["MENU"]["sub-menu"][igd.module_list[i]["menu"][j]["id"]].name;
			igd.module_list[i]["menu"][j].summary = language[language_type]["MENU"]["sub-menu"][igd.module_list[i]["menu"][j]["id"]].summary;
		}
	}
})();
