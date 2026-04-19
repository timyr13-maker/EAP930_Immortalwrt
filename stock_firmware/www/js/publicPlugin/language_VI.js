var language = {};
language.VI = {
	//厂商信息
	VENDOR:{
		"NETIS":{
			"module_name":"netis",
			"wireless_rate":"6000Mbps",
			"flash":"256MB",
			"official_website":"www.netis-systems.com",
			"login_website":"www.netis-systems.com",
			"consumer_hotline":"",
			"TITLE": "netis"
		}
	},
	//按钮
	BUTTON:{
		"btn-start":"Vào Setup Wizard",
		"btn-next":"Tiếp theo",
		"btn-back":"Bước trước",
		"btn-return":"Quay lại",
		"btn-end":"Hoàn thành",
		"btn-save":"Hiệu lực lưu",
		"btn-confirm":"Xác định",
		"btn-cancel": "Hủy bỏ",
		"btn-edit":"Sửa đổi",
		"btn-add":"Tăng",
		"btn-restart":"Khởi động lại router",	
		"btn-del-all":"Xóa tất cả",
		"btn-reset":"Trở về trạng thái ban đầu",
		"btn-del":"Xoá",
		"btn-refresh":"Làm mới",
		"btn-stop-refresh":"Dừng refresh",
		"button-version-checking":"Phát hiện phiên bản",
		"button-automatic-upgrade":"Nâng cấp tự động",
		"button-retry":"Thử lại",
    	"button-download":"Tải xuống ngay",
		"button-qr-code":"Tải Mã QR",
		"button-not-download":"Tạm thời không tải xuống",
		"button-bind-all":"Liên kết tất cả",
		"button-unbind-all":"Cởi trói tất cả",
		"button-backup":"Hỗ trợ",
		"button-restore":"Phục hồi",
		"btn-reponse":"Ứng dụng phản hồi",
		"button-stop":"Dừng lại.",
    "button-set":"Thiết lập",
		"btn-wps":"WPS",
		"btn-exit":"Thoát",
		"btn-agree":"Đồng ý",
		"btn-generate":"Tạo ra",
    	"btn-nowRestart":"Khởi động lại ngay",
		"btn-scheduled-restart":"Khởi động lại đúng giờ",
		"btn-upgradation":"Nâng cấp AP",
		"btn-export":"Xuất",
		"btn-close":"Đóng cửa",
		"btn-draft":"Dự thảo",
		"btn-send":"Gửi",
		"btn-generate":"Tạo ra",
		"btn-export":"Xuất",
    "btn-draft": "Bản nháp",
"btn-send": "Gửi",
"btn-generate": "Tạo",
"btn-jump": "Chuyển",
"btn-search": "Tìm kiếm",
"btn-batch-del": "Xóa hàng loạt",
"btn-login": "Đăng nhập",
"btn-view-network": "Xem mạng",
"btn-log-out": "Đăng xuất",
"btn-preview": "Xem trước",
"btn-configuration-page": "Trang cấu hình"
		
	},
	//菜单
	MENU:{
		"top-menu":{
			"index":"Trang chủ",
			"network":"Mạng lưới",
			"application":"Ứng dụng",
			"system":"Công cụ",
      	"ac_controller":"AC Controller",
      		"phone_management":"Bee-Center",
      		"app_management":"Bee-Center",
			"tools":"Công cụ",
			"download":"Quét liên kết",
			"login-out":"Thoát khỏi quản lý",
			"official-website":"Đến trang web chính thức"
			
		},
		"sub-menu":{
      wifi_management:{
				name:"Thiết lập kinh doanh không dây",
				summary:"Thiết lập kinh doanh không dây"
			},
			ap_manage:{
				name:"Quản lý AP",
				summary:"Quản lý AP"
			},
			ac_switch:{
				name:"Công tắc ràng buộc tự động",
				summary:"Công tắc ràng buộc tự động"
			},
			pilot_lamp:{
				name:"Đèn báo",
				summary:"Đèn báo"
			},
			wired_vlan:{
				name:"Thiết lập VLAN có dây",
				summary:"Thiết lập VLAN có dây"
			},
			rf_settings:{
				name:"Cài đặt RF",
				summary:"Cài đặt RF"
			},
			restart:{
				name:"Khởi động lại",
				summary:"Khởi động lại"
			},
			apac_upgradation:{
				name:"Nâng cấp/khôi phục nhà máy",
				summary:"Nâng cấp"
			},
			ac_changePassword:{
				name:"Cài đặt mật khẩu đăng nhập",
				summary:"Cài đặt mật khẩu đăng nhập"
			},
			networkingEquipment:{
				name:"Thiết bị kết nối",
				summary:"Thiết bị Trực tuyến"
			},
      	phone_management:{
				name:"Quản lý router bằng điện thoại",
				summary:"Quản lý router bằng điện thoại"
			},
			app_management:{
				name:"Quản lý router bằng điện thoại",
				summary:"Quản lý router bằng điện thoại"
			},
			wiFiSetUp:{
				name:"Mạng không dây",
				summary:"Thiết lập WiFi của bạn"
			},
			lan_setup:{
				name:"Thiết lập mạng nội bộ",
				summary:"Thay đổi địa chỉ router"
			},
      ap_lan_setup:{
				name:"Thiết lập mạng nội bộ",
				summary:"Thay đổi địa chỉ router"
			},
			dhcp_reservation:{
				name:"Địa chỉ DHCP",
				summary:"Địa chỉ DHCP"
			},
			external_network:{
				name:"Cài đặt Internet",
				summary:"Thiết lập cách kết nối và tài khoản băng thông rộng"
			},
			wisp:{
				name:"Chuyển tiếp không dây",
				summary:"Chuyển tiếp tín hiệu không dây mở rộng"
			},
			ipv6:{
				name:"IPv6",
				summary:"Mở ipv6 đôi chuyển tiếp"
			},
			wan_setup:{
				name:"Cài đặt Internet",
				summary:"Thiết lập cách kết nối và tài khoản băng thông rộng"
			},
			multipleSsid:{
				name:"Mạng khách",
				summary:"Thiết lập Wi-Fi dành riêng cho khách"
			},
			qos:{
				name:"QoS",
				summary:"QoS"
			},
			manage_wifi_QR_code:{
				name:"Quét mã wifi",
				summary:"Quét mã wifi"
			},
			tr069:{
				name:"TR069",
				summary:"Giao thức quản lý CPE WAN"
			},
			usb:{
				name:"Chức năng USB",
				summary:"Chức năng USB"
			},
			diagnosis:{
				name:"Chức năng chẩn đoán",
				summary:"Chức năng chẩn đoán"
			},
			port_mirror:{
				name:"Gương cổng",
				summary:"Gương cổng"
			},
			wps:{
				name:"WPS",
				summary:"Cài đặt bảo vệ WiFi"
			},
			developer:{
				name:"Cài đặt nâng cao",
				summary:"Thông số chuyên nghiệp Thiết lập kín đáo"
			},
			access_control:{
				name:"Kiểm soát truy cập",
				summary:"Cài đặt kiểm soát truy cập"
			},
			pptp_client:{
				name:"Trình khách PPTP",
				summary:"Trình khách PPTP"
			},
			l2tp_client:{
				name:"Trình khách L2TP",
				summary:"Trình khách L2TP"
			},
			policy_routing:{
				name:"Định tuyến chính sách",
				summary:"Định tuyến chính sách"
			},
			static_routing:{
				name:"Định tuyến tĩnh",
				summary:"Định tuyến tĩnh"
			},
			iptv:{
				name:"IPTV",
				summary:"IPTV"	
			},
			signal_conditioning:{
				name:"Điều chỉnh tín hiệu",
				summary:"Thiết lập cường độ tín hiệu WiFi"
			},
			portMapping:{
				name:"Bản đồ cổng",
				summary:"Thiết lập truy cập mạng ngoài vào tài nguyên mạng trong"
			},
			oray_ddns:{
				name:"Tên miền động",
				summary:"Truy cập router thông qua tên miền"
			},
			remoteAccess:{
				name:"Truy cập từ xa",
				summary:"Thiết lập dịch vụ mạng cho router"
			},
			wireless_universal_relay:{
				name:"WISP",
				summary:"Mở rộng vùng phủ sóng"
			},
			wlan_mode:{
				name:"Chế độ không dây",
				summary:"Hỗ trợ chuyển tiếp không dây repeater/wisp và các chế độ Internet khác"	
			},
			restart_regularly:{
				name:"Lịch hẹn giờ",
				summary:"Thời gian bảo trì"
			},
			changePassword:{
				name:"Quản lý mật khẩu",
				summary:"Thay đổi mật khẩu quản trị"
			},
			router_info:{
				name:"Thông tin Router",
				summary:"Trạng thái hiện tại của router"
			},
			indicator_light:{
				name:"Đèn báo",
				summary:"Công tắc chỉ báo"
			},
			factory_settings:{
				name:"Khởi tạo",
				summary:"Trở về trạng thái ban đầu"
			},
			system_upgrade:{
				name:"Nâng cấp firmware",
				summary:"Cập nhật firmware để cải thiện trải nghiệm"
			},
			parameter_backup:{
				name:"Tham số sao lưu",
				summary:"Tham số Tham số sao lưu/khôi phục"
			},
			timeSetting:{
				name:"Cài đặt thời gian",
				summary:"Thiết lập thời gian router"
			},
			restart_router:{
				name:"Khởi động lại router",
				summary:"Khởi động lại router"
			},
			mesh_pair:{
				name:"Mesh",
				summary:"Quản lý mạng"
			},
			speed_test:{
				name:"Tốc độ mạng",
				summary:"Tốc độ mạng"
			},
      captive_portal:{
				name:"Captive Portal",
				summary:"Captive Portal"
			},
			dial_up_log:{
				name:"Nhật ký quay số",
				summary:"Phân tích lỗi kết nối băng thông rộng"
			},
			network_firewall:{
				name:"Tường lửa mạng",
				summary:"Tường lửa mạng"
			},
			openvpn_client:{
				name:"OpenVPN Client",
				summary:"Thiết lập hồ sơ cho khách hàng sử dụng chức năng VPN"
			},
			openvpn_server:{
				name:"OpenVPN Server",
				summary:"Thiết lập VPN và tài khoản để truy cập từ xa nhanh chóng vào mạng của bạn"
			},
			wireguard_client:{
				name:"Wireguard Client",
				summary:"WireGuard Client thiết lập đường hầm mã hóa cho kết nối VPN an toàn và tốc độ cao"
			},
			wireguard_server:{
				name:"Wireguard Server",
				summary:"WireGuard Server quản lý đường hầm mã hóa, cung cấp kết nối VPN an toàn và tốc độ cao"
			},
			network_4g:{
				name:"Chế độ Internet 4G",
				summary:"Mạng di động"	
			},
			network_mode_4g:{
				name:"Chế độ mạng",
				summary:"Chế độ mạng"	
			},
			sms:{
				name:"Tin nhắn",
				summary:"Tin nhắn"	
			},
      	parent_management:{
				name:"Quản lý phụ huynh",
				mobile_name:"Quản lý trẻ em",
				summary:"AI bảo vệ sức khỏe trẻ em trong thời gian thực"
			},
			vpn:{
				name:"Thiết lập VPN",
				summary:"Thiết lập VPN"	
			},
		}
		
	},
	//语言
	LANG:[
		{value:"CN",txt:"简体中文"},
		{value:"EN",txt:"English"},
		{value:"FR",txt:"Français"},
		{value:"CS",txt:"Čeština"},
		{value:"DE",txt:"Deutsch"},
		{value:"ES",txt:"Español"},
		{value:"IT",txt:"Italiano"},
		{value:"KO",txt:"한국어"},
		{value:"NL",txt:"Nederlands"},
		{value:"PL",txt:"Polski"},
		{value:"PT",txt:"Português"},
		{value:"RU",txt:"Русский язык"},
		{value:"TR",txt:"Türkçe"},
		{value:"UK",txt:"Українська мова"},
//		{value:"AR",txt:"اللغة العربية"},
	],
	//对话框
	DIALOG:{
		"wifi-encrypt":{
			title:"Gợi ý ấm áp",
			content:"Bạn không đặt mật khẩu không dây, an ninh mạng sẽ bị đe dọa"
			
		},
		"delete-all":{
			title:"Xác nhận xóa",
			content:"Bạn có chắc chắn xóa tất cả dữ liệu không?"
		},
		"delete-single":{
			title:"Xác nhận xóa",
			content:"Bạn có chắc chắn xóa phần dữ liệu này không?"
		},
		"update":{
			title:"Xác nhận nâng cấp",
			content:"Việc nâng cấp firmware sẽ mất vài phút và sau khi nâng cấp hoàn tất, router sẽ tự động khởi động lại. Bạn có chắc chắn về việc nâng cấp?"
		},
		"reset":{
			title:"Xác nhận phục hồi",
			content:"Tất cả các thông số cấu hình sẽ bị xóa và khởi động lại bộ định tuyến, bạn có chắc chắn để tiếp tục?"
		},
		"reset_up":{
			title:"Xác nhận phục hồi",
			content:"Router sẽ khởi động lại để khôi phục cài đặt. Cần phục hồi ngay bây giờ?"
		},
		"restart":{
			title:"Xác nhận khởi động lại",
			content:"Bạn có chắc chắn muốn khởi động lại router ngay lập tức?？"
		},
		"open_qos":{
			title:"Mẹo",
			content:"Chức năng tăng tốc phần cứng sẽ tắt, vui lòng kiểm tra xem bạn có tiếp tục không?"
		},
		"speed_up_prompt":{
			title:"Mẹo",
			content:"Chức năng giới hạn tốc độ thiết bị sẽ không hoạt động, vui lòng kiểm tra xem bạn có tiếp tục không?"
		},
		"tips_vlan":{
			title:"Mẹo",
			content:"Bạn đã bật chức năng VLAN và khi bật chức năng Bridge, chức năng VLAN sẽ tự động tắt! Anh có muốn tiếp tục không?"
		},
		"tips_bridging":{
			title:"Mẹo",
			content:"Bạn đã bật chức năng Bridge và khi VLAN được bật, chức năng Bridge sẽ tự động tắt! Anh có muốn tiếp tục không?"
		},
		"tips_wiFiSetUp":{
			title:"Mẹo",
			content:"Tên Wi-Fi sẽ được hợp nhất thành:<span id='dual_frequency_name'></span> ，Nếu không dây bị ngắt, hãy kết nối lại。"
		},
		"bind_all":{
			title:"Mẹo",
			content:"Xác định ràng buộc tất cả dữ liệu？"
		},
		"unbind_all":{
			title:"Mẹo",
			content:"Giải mã tất cả dữ liệu？"
		},
		"network_mode":{
			title:"Mẹo",
			content:"Hành động này sẽ ngắt kết nối mạng và ảnh hưởng đến dịch vụ dữ liệu của bạn, bạn có muốn tiếp tục không?"
		},
     "ap_restart":{
			title:"Xác nhận khởi động lại",
			content:"Đánh dấu sau khi cấu hình AP sẽ khởi động lại ngay lập tức"
		},
		"acap_reset":{
			title:"Xác nhận phục hồi",
			content:"Đánh dấu AP sẽ khôi phục cài đặt gốc"
		},
		"synchronous_wireless":{
			title:"Đồng bộ không dây",
			content:"Các thông số không dây của mạng AC sẽ được đồng bộ hóa và các thông số cá nhân hóa sẽ được làm trống"
		},
		"delete-all-ap":{
			title:"Xác nhận xóa",
			content:"Bạn có chắc chắn loại bỏ AP ngoại tuyến?"
		},
	},
	//错误码
	ERROR:{
		"0":"Thành công",
		"1":"Lệnh không hợp lệ",
		"2":"Tham số không hợp lệ",
		"3":"Không tìm thấy cách",
		"4":"Không tìm thấy",
		"5":"Không có dữ liệu",
		"6":"Từ chối truy cập",
		"7":"Hết giờ",
		"8":"Không hỗ trợ",
		"9":"Lỗi không rõ",
		"10":"Lỗi kết nối",
		"-11002":"Số lần đăng nhập sai của bạn đã đạt đến ba lần và hệ thống sẽ bị trì hoãn để kiểm tra.",
		"-32700":"Từ chối truy cập",
		"-3260":"Yêu cầu không hợp lệ",
		"-32601":"Không tìm thấy cách",
		"-32602":"Tham số không hợp lệ ",
		"-32603":"Lỗi nội bộ",
		"-32000":"Không tìm thấy đối tượng",
		"-32001":"Không tìm thấy phiên chạy",
		"-32002":"Từ chối truy cập",
		"-32003":"Thời gian chờ yêu cầu Ubus"
	},
	//日志
	JOURNAL:{
		LOG_CONNECT_STANDARD_DHCP_action: {
			"discover":"Cổng WAN gửi yêu cầu quay số tới máy chủ DHCP DISCOVERY",
			"request":"Cổng WAN gửi DHCP Request tới DHCP Server",
			"renew_request":"Cổng WAN gửi yêu cầu gia hạn DHCP Request đến máy chủ DHCP",
			"release":"Cổng WAN gửi ngắt kết nối DHCP RELEASE đến máy chủ DHCP",
			"ack":"Cổng WAN nhận được xác nhận cấu hình được gửi bởi máy chủ DHCP DHCP ACK",
			"nak":"Cổng WAN nhận được xác nhận cấu hình được gửi bởi máy chủ DHCP DHCP NAK",
			"offer":"Cổng WAN nhận được yêu cầu quay số từ máy chủ DHCP để đáp ứng DHCP OFFER",
			"bound":"Quay số thành công, lấy được địa chỉ IP{{ip}},Thời gian thuê{{time}}",
			"decline":"Cổng WAN gửi xác nhận xung đột địa chỉ đến máy chủ DHCP DECLINE",
			"renew":"Thuê lại địa chỉ IP thành công"
		},
		LOG_CONNECT_STANDARD_PPPOE_action: {
			"padi":"Cổng WAN gửi yêu cầu quay số PADI đến máy chủ",
			"padr":"Cổng WAN gửi PADR đến máy chủ",
			"pado":"Cổng WAN nhận Pado từ máy chủ",
			"pads":"Cổng WAN nhận PADS từ máy chủ",
			"padt":"Cổng WAN gửi yêu cầu ngắt kết nối tới máy chủ PADT",
			"":"Cổng WAN nhận được máy chủ gửi yêu cầu ngắt kết nối PPPoE PADT",
			"get_ip":"Quay số thành công, lấy được địa chỉ IP{{ip}}",
			
			"auth_fail":"Xác thực quay số không thành công, hãy kiểm tra mật khẩu tên người dùng hoặc hỏi nhà điều hành",//info.auth_result
			"auth_ok":"Tên người dùng Mật khẩu chính xác, xác thực quay số thành công",//info.auth_result
			
			"":"Gửi tên người dùng và mật khẩu xác thực",
			"":"Người dùng yêu cầu ngắt kết nối hoặc ngắt kết nối thời gian chờ",
			"":"Cổng WAN gửi yêu cầu ngắt kết nối tới máy chủ Terminate Request",
			"":"Cổng WAN gửi xác nhận ngắt kết nối đến máy chủ Terminate ACK",
			"":"Cổng WAN nhận được yêu cầu ngắt kết nối từ máy chủ",
			"":"Cổng WAN nhận được máy chủ gửi xác nhận ngắt kết nối Terminate ACK",
			
			
			"auth_type":"Phương thức xác thực được đàm phán giữa cổng WAN và máy chủ là{{auth_type}}",//
			
			"":"Phương thức xác thực được đàm phán giữa cổng WAN và máy chủ là PAP",//info.auth_type
			"":"Phương thức xác thực được đàm phán giữa cổng WAN và máy chủ là CHAP",//info.auth_type
			"":"Phương thức xác thực được đàm phán giữa cổng WAN và máy chủ là MS-CHAP",//info.auth_type
			"":"Phương thức xác thực được đàm phán giữa cổng WAN và máy chủ là MS-CHAP2",//info.auth_type
			"":"Phương thức xác thực được đàm phán giữa cổng WAN và máy chủ là EAP",//info.auth_type
			
			"echo_request":"Cổng WAN gửi phát hiện liên kết đến máy chủ ECHO REQUEST",
			"echo_reply":"Cổng WAN Nhận phát hiện liên kết được gửi bởi máy chủ ECHO REPLY",
			"":"Cổng WAN nhận được phát hiện liên kết được gửi bởi máy chủ ECHO REQUEST",
			"":"Phát hiện liên kết được gửi bởi cổng WAN đến máy chủ ECHO REPLY"
		},
		LOG_CONN_DISC_action: {
			"up":"Kết nối thành công, tốc độ hiện tại{{speed}},{{duplex}}",
			"down":"Cổng WAN bị ngắt kết nối"
		}
	},
	//页面中呈现的部分
    PAGES: {
		guide:{
			html:{
				"detect-tip":["Phát hiện cách bạn lướt web","Đang thiết lập cách truy cập Internet"],
				"detect-time":["Thời gian phát hiện còn lại<span class=\"count-down\"></span>giây","Chắc là cần.<span class=\"count-down\"></span>giây，Xin vui lòng để sau……"],
				"f-label":["Cách truy cập Internet","","Tài khoản băng thông rộng","Mật khẩu băng thông rộng",
						"Địa chỉ IP","Mặt nạ mạng con","Cổng mặc định","DNS ưa thích","DNS dự phòng",
						"Múi giờ",
						"Tên người dùng","Mật khẩu","Loại kết nối","Địa chỉ IP","Mặt nạ mạng con","Cổng mặc định","DNS ưa thích","DNS dự phòng",
						"Tên người dùng","Mật khẩu","Địa chỉ IP/Tên miền","Loại kết nối","Địa chỉ IP","Mặt nạ mạng con","Cổng mặc định","DNS ưa thích","DNS dự phòng",
						"Tên người dùng","Mật khẩu","Mã hóa MPPE","Địa chỉ IP/Tên miền","Loại kết nối","Địa chỉ IP","Mặt nạ mạng con","Cổng mặc định","DNS ưa thích","DNS dự phòng",
						"Mạng không dây Name","Mật khẩu không dây","Quản lý mật khẩu"],
				"routing-mode":["Truy cập tự động (DHCP)","Địa chỉ tĩnh","Truy cập tự động (DHCP)","Địa chỉ tĩnh","Truy cập tự động (DHCP)","Địa chỉ tĩnh"],
			"chk-txt":["Kích hoạt IPv6","Đặt mật khẩu WiFi làm mật khẩu quản lý bộ định tuyến cùng một lúc","Tự động tải phiên bản mới và cập nhật firmware khẩn cấp trong thời gian rảnh","Đồng ý bật nâng cấp khẩn cấp (cần báo cáo địa chỉ MAC, thông tin phiên bản firmware)","Không đồng ý mở nâng cấp khẩn cấp"],
				"upgrade_text":["Mở nâng cấp khẩn cấp"],
				"title":["Bắt đầu thiết lập tên và mật khẩu Wi-Fi của bạn","Cài đặt wifi thành công, bắt đầu lên mạng"],
				"describe":["Vì sự an toàn của bạn, bạn nên chọn mật khẩu có số và chữ cái trộn lẫn","Vui lòng kết nối lại mạng không dây của bạn"],
				"sub-choose":["Bỏ qua cài đặt Internet","Quay lại cài đặt Internet"],
				"tips":"Tùy chọn",
				"modal-title":"Đọc tuyên bố",
				
			},
			js:{
				welcome:"Chào mừng đến với",
				step:["Truy cập băng thông rộng","Thiết lập WiFi","Hoàn thành"],
				wifi_placeholder:["WiFi và mật khẩu quản trị (hơn 8 chữ số)","8-63 bit, để trống không được mã hóa","Mật khẩu WiFi 8-63 bit","8-63 bit quản lý mật khẩu"],
				wisp_placeholder:["Vui lòng nhập mật khẩu chuyển tiếp","Không cần mật khẩu"],
				wan_describe:["Vui lòng nhập tài khoản băng thông rộng và mật khẩu do nhà mạng cung cấp.","DHCP chủ yếu được sử dụng khi kết nối mạng cấp 2"],
				detect_result:["Cách truy cập Internet không được phát hiện, vui lòng cài đặt thủ công","Bạn đã đặt chế độ truy cập Internet thành Tự động lấy (DHCP)","Bạn đã thiết lập Internet của bạn để quay số băng thông rộng (PPPoE)","Bạn đã thiết lập chế độ truy cập Internet tĩnh (static)",
				"Bạn đã thiết lập Internet để cấu hình IP theo cách thủ công","Tự động phát hiện phương thức truy cập Internet của bạn là quay số băng thông rộng (PPPoE)","Tự động phát hiện cách truy cập Internet của bạn là Tự động Nhận (DHCP)"]
				
			},
			button:{
				"btn-cancel":"Không mã hóa",
				"btn-confirm":"Mã hóa"
				
			},
			placeholder:{
				"input-pppoe-username":"Vui lòng nhập tài khoản băng thông rộng",
				"input-pppoe-password":"Vui lòng nhập mật khẩu băng thông rộng",
				"input-static-ip":"Vui lòng nhập địa chỉ IP",
				"input-static-mask":"Vui lòng nhập Subnet Mask",
				"input-static-gateway":"Vui lòng nhập địa chỉ cổng mặc định",
				"input-static-dns1":"Vui lòng nhập DNS ưa thích",
				"input-static-dns2":"Vui lòng nhập DNS dự phòng",
				"input-wifi-ssid":"Vui lòng nhập tên không dây"
				
			},
			select:{
				wan_type_sel:[
					{value:"dhcp",txt:"Tự động lấy địa chỉ"},
					{value:"pppoe",txt:"Băng thông rộng PPPoE"},
					{value:"static",txt:"Đặt địa chỉ theo cách thủ công"}
				],
				wan_type_sel_russia:[
					{value:"dhcp",txt:"Tự động lấy địa chỉ"},
					{value:"pppoe",txt:"Băng thông rộng PPPoE"},
					{value:"static",txt:"Đặt địa chỉ theo cách thủ công"},
					{value:"pppoe_r",txt:"Dual Access PPPoE"},
					{value:"l2tp",txt:"L2TP/Dual Access L2TP"},
					{value:"pptp",txt:"PPTP/Dual Access PPTP"},
				],
				mppe_encryption:[
					{value:"0", 	txt:"Đóng cửa"},
					{value:"1", 	txt:"Mở"},
				],
				time_zone_sel:[
					{value:"", 	txt:"--Vui lòng chọn--"},
					{value:"-14", 	txt:"(GMT+14:00)Quần đảo Lane"},
					{value:"-13", 	txt:"(GMT+13:00)Quần đảo Phoenix"},
					{value:"-12:45", 	txt:"(GMT+12:45)Quần đảo Chatamu"},
					{value:"-12", 	txt:"(GMT+12:00)Việt"},
					{value:"-11", 	txt:"(GMT+11:00)Mật ong"},
					{value:"-10:30", 	txt:"(GMT+10:30)Quần đảo Lord Howe"},
					{value:"-10", 	txt:"(GMT+10:00)Canberra"},
					{value:"-9:30", 	txt:"(GMT+09:30)Trung Úc"},
					{value:"-9", 	txt:"(GMT+09:00)Việt Nam"},
					{value:"-8", 	txt:"(GMT+08:00)Bắc Kinh"},
					{value:"-7", 	txt:"(GMT+07:00)Viet Nam"},
					{value:"-6:30", 	txt:"(GMT+06:30)Miến Điện"},
					{value:"-6", 	txt:"(GMT+06:00)Viet Nam"},
					{value:"-5:45", 	txt:"(GMT+05:45)Nepal"},
					{value:"-5:30", 	txt:"(GMT+05:30)Ấn độ"},
					{value:"-5", 	txt:"(GMT+05:00)Islamabad"},
					{value:"-4:30", 	txt:"(GMT+04:30)Afghanistan"},
					{value:"-4", 	txt:"(GMT+04:00)Abu Dhabi"},
					{value:"-3:30", 	txt:"(GMT+03:30)Iran"},
					{value:"-3", 	txt:"(GMT+03:00)Việt Nam"},
					{value:"-2", 	txt:"(GMT+02:00)Viet Nam"},
					{value:"-1", 	txt:"(GMT+01:00)Việt Nam"},
					{value:"0", 	txt:"(GMT0)Luân Đôn"},
					{value:"1", 	txt:"(GMT-01:00)Punta Delgada"},
					{value:"2", 	txt:"(GMT-02:00)Việt Nam"},
					{value:"3", 	txt:"(GMT-03:00)Viet Nam"},
					{value:"3:30", 	txt:"(GMT-03:30)Đảo Newfoundland"},
					{value:"4", 	txt:"(GMT-04:00)Caracas"},
					{value:"5", 	txt:"(GMT-05:00)Thành phố New York"},
					{value:"6", 	txt:"(GMT-06:00)Thành phố Mexico"},
					{value:"7", 	txt:"(GMT-07:00)Thành phố Salt Lake"},
					{value:"8", 	txt:"(GMT-08:00)Việt Nam"},
					{value:"9", 	txt:"(GMT-09:00)Juno"},
					{value:"9:30", 	txt:"(GMT-09:30)Quần đảo Maxas"},
					{value:"10", txt:"(GMT-10:00)Honolulu"},
					{value:"11", txt:"(GMT-11:00)Đảo Midway"},
					{value:"12", txt:"(GMT-12:00)Majuro"}
				]
			}
		},
		login:{
			html:{
				"title_h1":"Chào mừng đến với <span id='login_title'></span> Bộ định tuyến",
				"discribe":"Bạn cũng có thể sử dụng<span id=\"login_href\"></span>Quản lý truy cập Router",
			"form-tip":["Mật khẩu đăng nhập mặc định được in trên giấy nhãn của thiết bị。","Nếu bạn quên mật khẩu, giữ phím RESET trong 6 giây, thiết bị sẽ xóa tham số cấu hình và cần cấu hình lại bộ định tuyến."],
				"f-lbl":["Quản lý tài khoản","Quản lý mật khẩu"],
        	"modal-title":"Đọc tuyên bố",
				"chk-txt":["Tôi đã đọc và đồng ý <span  class=\"statement_color\">《Thỏa thuận cấp phép phần mềm người dùng cuối》 </span>",]
			},
			js:{
				"login":"Đăng nhập"
			}
		},
		index:{
			html:{
				"f-title":["Trực tuyến AP","Thiết bị ngoại tuyến","Số kết nối người dùng","Bộ điều khiển AC"],
				"sp_describe":["Thời gian hiện tại：","Thời gian chạy thiết bị：","Sử dụng CPU：","Sử dụng bộ nhớ：","Thông tin phần cứng：","MAC：","Thông tin phiên bản："],
				"single-tip":"Đã được điều khiển bởi AC cũ, có nên chuyển sang AC hiện tại hay không?",
				"modal-title":"Mẹo",
				"equipment_online":["2.4G:<span id='equipment_24_online'></span>Đài",
									"5G:<span id='equipment_5_online'></span>Đài",
									"Dây:<span id='equipment_wired_online'></span>Đài"],
			"title_show":"2.4G:<span class='equipment_24_online'></span>Đài,5G:<span class='equipment_5_online'></span>Đài,Dây:<span class='equipment_wired_online'></span>Đài",
									
			},
			js:{
				"ac_name":["Thời gian online","Danh sách máy chủ trực tuyến"],
				"table-title-ac":["Loại","Thời gian online","Cách truy cập","RSSI","IP/MAC","Lên/xuống","Tên AP","IP của AP"],
				"f-label":["trực tuyến","ngoại tuyến",],
				"search_hint":"MAC",
			}
		},
    ap_index:{
			html:{
				"icon-describe":["Internet","Cổng","Quản lý Mesh"],
				"txt-box":["Tốc độ Internet hiện tại","Thời gian làm việc"],
				"lbl-reboot":"Khởi động lại",
				"internet_IP":'Mạng ngoài IP:',
				"lbl-mesh":"Thêm nút mới"
			},
			js:{
				"linkok":"Network bình thường",
				"linkoff":"Mạng bị ngắt kết nối"
			}
			
		},
    	wifi_management:{
			html:{
				"f-label":["Trạng thái WIFI","SSID","Cách mã hóa","Mật khẩu WIFI","Lựa chọn băng tần","Cách ly không dây","Name","Chọn thời gian","VLAN ID",
							"Khoảng cách khung Beacon","Khoảng cách khung","Ngưỡng RTS","Chế độ không dây 2.4G","2. Số lượng kết nối khách hàng 4G","2.4G loại bỏ cường độ tín hiệu thấp hơn","2.4G cường độ tín hiệu bị cấm thấp hơn","Chế độ không dây 5G","Số lượng kết nối khách hàng 5G","5G loại bỏ cường độ tín hiệu thấp hơn","Cường độ tín hiệu cấm 5G thấp hơn","Phát sóng nhóm","Khu vực không dây"],
				"tab-item":["Thiết lập không dây","Cài đặt nâng cao không dây"],
				"tip-sec":"Đây là tham số toàn cầu hình tất cả các AP nhóm mạng",
				"active":["Ngày", "một", "hai", "ba", "bốn", "năm", "sáu."],
				"modal-title":["Thiết lập không dây"],
				"text_title":["Tối đa người dùng (0~32): 0 Không giới hạn","Trình khách không dây cho dBm","dBm truy cập khách hàng không dây",
				"Tối đa người dùng (0~32): 0 Không giới hạn","Trình khách không dây cho dBm","dBm truy cập khách hàng không dây",],
				"p_prompt":"*(0~100), 0 có nghĩa là tắt chức năng này.",
				
				"prompt_text":"(Điền 3-4094, 0 có nghĩa là đóng)",
				"chk-txt":["Bỏ","Phát sóng nhóm","Phát sóng theo nhóm."],
				"f-label-title":"Bật"
			},
			js:{
				"table_title":["Tên WIFI (SSID)","Mật khẩu","Thông tin trạng thái","VLAN ID","Ban nhạc","Hoạt động"],
				"copywriting":["Không mã hóa"],
				"f-label":["Bật","Không bật","Sửa đổi","Xoá"]
			},
			select:{	
				frequency_band:[
					{value:"2G",txt:"2.4G"},
					{value:"5G",txt:"5G"},
					{value:"2G+5G",txt:"2.4G+5G"}
				],
				wifi_encryption:[
					{value:"NONE", 	txt:"Không mã hóa"},
					{value:"AES", 	txt:"WPA/WPA2-PSK  AES"},
					{value:"AES", 	txt:"WPA2/WPA3-PSK  AES"}
				],
				time_interval:[
					{value:"0",txt:"Tất cả thời gian"},
					{value:"1",txt:"Ngày làm việc"},
					{value:"2",txt:"Cuối tuần"},
					{value:"3",txt:"Tùy chỉnh"},
				],
				WirelessMode_24:[
					{value:"b", 	txt:"b"},
					{value:"bg", 	txt:"b/g"},
					{value:"bgn", 	txt:"b/g/n"},
					{value:"bgnax", txt:"b/g/n/ax"},
				],
				WirelessMode_5:[
					{value:"a", 	txt:"a"},
					{value:"an", 	txt:"a/n"},
					{value:"aanac", 	txt:"a/n/ac"},
					{value:"aanacax", 	txt:"a/n/ac/ax"}
				],
				hT_GI:[
					{value:"0", 	txt:"Long GI"},
					{value:"1", 	txt:"Short GI"},
				],
				Wireless_area:[
					{value:"1", 	txt:"Trung Quốc"},
					{value:"2", 	txt:"Hoa Kỳ"},
					{value:"3", 	txt:"Châu Âu"},
					{value:"4", 	txt:"Nga"},
					{value:"5", 	txt:"Việt Nam"},
					{value:"6", 	txt:"Việt Nam"},
				]
				
			},
		},
    	ap_manage:{
			html:{
				"f-label":["Trạng thái WIFI","Tên WIFI (SSID)","Cách mã hóa","Mật khẩu WIFI","Lựa chọn băng tần","Cách ly không dây","Name","Chọn thời gian","VLAN ID",
							"Khoảng cách khung Beacon","Khoảng cách khung","Ngưỡng RTS","Chế độ không dây 2.4G","2.4G Số lượng kết nối khách hàng","2.4GLoại bỏ tín hiệu cường độ thấp hơn","2.4G Cường độ tín hiệu bị cấm thấp hơn","Chế độ không dây 5G","Số lượng kết nối khách hàng 5G","5G loại bỏ cường độ tín hiệu thấp hơn","Cường độ tín hiệu cấm 5G thấp hơn","Phát sóng nhóm","Khu vực không dây",
							"Tên thiết bị",
							"Công tắc DHCP","Địa chỉ IP","Mặt nạ mạng con","Địa chỉ Gateway","DNS"],
				"tab-item":["Thiết lập không dây","Cài đặt nâng cao không dây"],
				"tip-sec":"Ở đây để cá nhân hóa các tham số, chỉ cấu hình AP hiện tại",
				"active":["Ngày", "một", "hai", "ba", "bốn", "năm", "sáu."],
				"modal-title":["Thiết bị không kết nối mạng","Không rõ AC","Hợp nhất mạng lưới","Thiết lập không dây","","Thay đổi tên","DHCP"],
				"text_title":["Tối đa người dùng (0~32): 0 Không giới hạn","Trình khách không dây cho dBm","dBm truy cập khách hàng không dây",
				"Tối đa người dùng (0~32): 0 Không giới hạn","Trình khách không dây cho dBm","dBm truy cập khách hàng không dây",],
				"p_prompt":"*(0~100), 0 có nghĩa là tắt chức năng này.",
				"wifi_superior_information":"Tên thiết bị：<span id='ap_wifi_name'>0</span>，Mô hình：<span id='ap_wifi_model'>0</span>，Địa chỉ IP：<span id='ap_wifi_ip'>0</span>",
				"single-tip":"Tất cả các AP do AC điều khiển hiện tại sẽ được hợp nhất vào<span id='ap_id_href'></span>Mạng lưới kiểm soát.",
				"prompt_text":"(Điền 3-4094, 0 có nghĩa là đóng)",
				"chk-txt":["Bỏ","Phát sóng nhóm","Phát sóng theo nhóm."],
				"f-label-title":"Bật",
				"title_show":["Trực tuyến：<span id='online_quantity'>0</span>Đài, ngoại tuyến.：<span id='offline_quantity'>0</span>Đài  <span id='unnetworked_div' class='hidden'> Không có lưới: <i id='unnetworked_quantity' class='f-color3'>0</i></span> <span id='unnetworked_ac_div' class='hidden'> Không rõ AC: <i id='unnetworked_ac' class='f-color3'>0</i></span>",
								"2.4G:<span id='ap_24g'>0</span> Đài，5G:<span id='ap_5g'>0</span> Đài, có dây.:<span id='ap_limited'>0</span> Đài"],
				"delete_offline":"Loại bỏ AP ngoại tuyến",
				"optional_t":"（3-4094，Tùy chọn）",
				"merge_networking":"Hợp nhất mạng lưới"
			},
			js:{
				"ac_ap_offline_table":["Thiết bị ngoại tuyến","Trạng thái","MAC","Hoạt động"],
				"ac_ap_online_table":["Tên thiết bị<br>(Click để thay đổi tên)","Trạng thái","Mô hình","Số phiên bản","IP/MAC","Thời gian chạy","Số Terminal","Hoạt động"],
				"ap_online_table":["Loại","Thời gian online","Cách truy cập","RSSI","IP/MAC","Lên/xuống","Tên AP","IP của AP"],
				"ac_ap_unnetworked_table":["<input type='checkbox' name='checkboxShall' id='select_All' value='0' class='checkboxShall'>","Mô hình","Số phiên bản","IP","MAC","Thời gian chạy"],
				
				"f-label":["Định vị","","Thông số cá nhân","Trực tuyến","Ngoại tuyến","Truy vấn...","Truy vấn thành công","Đóng vị trí","Hợp nhất mạng lưới"],
				"ac_unnetworked_table":["Mô hình","Số phiên bản","IP","MAC","Hoạt động"],
				
				"positioning":"Đang định vị...",
				"uplink_speed":"Lên trên",
				"downlink_speed":"Xuống",
				"table_title":["Tên Wifi (SSID)","Mật khẩu","Thông tin trạng thái","VLAN ID","Ban nhạc","Hoạt động"],
				"copywriting":["Không mã hóa","Thêm không dây","Đồng bộ không dây","(Hiện tại AC)"],
				"f-wifi-label":["Bật","Không bật","Sửa đổi","Xoá","Tham gia mạng lưới"],
        "search_hint":"Tên thiết bị/Trạng thái/Mô hình/MAC",
			},
			select:{	
				frequency_band:[
					{value:"2G",txt:"2.4G"},
					{value:"5G",txt:"5G"},
					{value:"2G+5G",txt:"5G+2.4G"}
				],
				wifi_encryption:[
					{value:"NONE", 	txt:"Không mã hóa"},
					{value:"AES", 	txt:"WPA/WPA2-PSK  AES"},
					{value:"AES", 	txt:"WPA2/WPA3-PSK  AES"}
				],
				time_interval:[
					{value:"0",txt:"Tất cả thời gian"},
					{value:"1",txt:"Ngày làm việc"},
					{value:"2",txt:"Cuối tuần"},
					{value:"3",txt:"Tùy chỉnh"},
				],
				WirelessMode_24:[
					{value:"b", 	txt:"b"},
					{value:"bg", 	txt:"b/g"},
					{value:"bgn", 	txt:"b/g/n"},
					{value:"bgnax", txt:"b/g/n/ax"},
				],
				WirelessMode_5:[
					{value:"a", 	txt:"a"},
					{value:"an", 	txt:"a/n"},
					{value:"aanac", 	txt:"a/n/ac"},
					{value:"aanacax", 	txt:"a/n/ac/ax"}
				],
				hT_GI:[
					{value:"0", 	txt:"Long GI"},
					{value:"1", 	txt:"Short GI"},
				],
				Wireless_area:[
					{value:"1", 	txt:"Trung Quốc"},
					{value:"2", 	txt:"Hoa Kỳ"},
					{value:"3", 	txt:"Châu Âu"},
					{value:"4", 	txt:"Nga"},
					{value:"5", 	txt:"Việt Nam"},
					{value:"6", 	txt:"Việt Nam"},
				]
			},
		},
    ac_switch:{
			html:{
				"f-label":["Công tắc chức năng AC","Công tắc ràng buộc tự động"],
				"modal-title":"Mẹo",
				"single-tip":["Chức năng AC của thiết bị hiện tại sẽ tắt","Chức năng AC của thiết bị hiện tại sẽ được bật","Tắt chức năng tự cấu hình và AP mới được thêm vào sẽ được ràng buộc bằng tay"],
				"text_title":["(Chức năng điều khiển AC của thiết bị hiện tại)","(Tự động ràng buộc và thả các thông số cho các thiết bị AP mới, đề nghị đóng khi cấu hình mạng hoàn tất)"]
			},
		},
    wired_vlan:{
			html:{
				"f-label":["Mở","VLAN ID","Không Untag"],
				"text_title":["(Số nguyên từ 3-4094)"]
			},
			js:{
				"ac_ap_online_table":["<input type='checkbox' name='checkboxShall' id='select_All' value='0' class='checkboxShall'>","Tên thiết bị","Mô hình","IP","MAC","Trạng thái VLAN","VLAN ID","UNTAG"],
				"rf_settings_title":["Tất cả cấu hình thành công! Xin vui lòng chờ một thời gian để làm mới trang để xem"]
			},
			
		},
		pilot_lamp:{
			html:{
				"select_All":["Chọn tất cả"],
				"f-label":["Công tắc LED"]
			},
			js:{
				
				"ac_ap_online_table":["<input type='checkbox' name='checkboxShall' id='select_All' value='0' class='checkboxShall'>","Tên thiết bị","Mô hình","IP","MAC","Trạng thái đèn chỉ thị"],
				
			},
			select:{	
			
			},
		},
		rf_settings:{
			html:{
				"select_All":["Chọn tất cả"],
				"modal-title":"Sửa đổi RF",
				"tip-sec":"Việc sửa đổi cấu hình sẽ khởi động lại cấu hình không dây, có thể khiến thiết bị đầu cuối được kết nối hiện tại bị rớt.",
				"f-label":["Băng thông 2.4G","Băng thông  5G","Kênh 2.4G","Kênh  5G","Công suất 2.4G","Công suất  5G"]
			},
			js:{
				"no_edit":["Không sửa đổi"],
				"ac_ap_online_table":["<input type='checkbox' name='checkboxShall' id='select_All' value='0' class='checkboxShall'>","Tên thiết bị","Mô hình","IP","MAC","Kênh","Băng thông","Công suất (%)"],
				"rf_settings_title":["Tất cả cấu hình thành công! Xin vui lòng chờ một thời gian để làm mới trang để xem"]
			},
			select:{	
				bandwidth_2_4:[
					{value:"-1",txt:"Không sửa đổi"},
					{value:"auto",txt:"Tự động"},
					{value:"20M",txt:"20M"},
					{value:"40M+",txt:"40M"},
				],
				bandwidth_5:[
					{value:"-1",txt:"Không sửa đổi"},
					{value:"auto",txt:"Tự động"},
					{value:"20M",txt:"20M"},
					{value:"40M+",txt:"40M"},
					{value:"80M",txt:"80M"},
					{value:"160M",txt:"160Mhz"},
				],
				channel_2_4:[
					{value:"-1",txt:"Không sửa đổi"},
					{value:"0", 	txt:"Tự động"},
					{value:"1", 	txt:"Kênh 1"},
					{value:"2", 	txt:"Kênh 2"},
					{value:"3", 	txt:"Kênh 3"},
					{value:"4", 	txt:"Kênh 4"},
					{value:"5", 	txt:"Kênh 5"},
					{value:"6", 	txt:"Kênh 6"},
					{value:"7", 	txt:"Kênh 7"},
					{value:"8", 	txt:"Kênh 8"},
					{value:"9", 	txt:"Kênh 9"},
					{value:"10", 	txt:"Kênh 10"},
					{value:"11", 	txt:"Kênh 11"},
					{value:"12", 	txt:"Kênh 12"},
					{value:"13", 	txt:"Kênh 13"}
				],
				channel_5:[
					{value:"-1",txt:"Không sửa đổi"},
					{value:"0", 	txt:"Tự động"},
					{value:"36", 	txt:"Kênh 36"},
					{value:"40", 	txt:"Kênh 40"},
					{value:"44", 	txt:"Kênh 44"},
					{value:"48", 	txt:"Kênh 48"},
					{value:"52", 	txt:"Kênh 52"},
					{value:"56", 	txt:"Kênh 56"},
					{value:"60", 	txt:"Kênh 60"},
					{value:"64", 	txt:"Kênh 64"},
					{value:"149", 	txt:"Kênh 149"},
					{value:"153", 	txt:"Kênh 153"},
					{value:"157", 	txt:"Kênh 157"},
					{value:"161", 	txt:"Kênh 161"},
					{value:"165", 	txt:"Kênh 165"}
				],
				power_2_4:[
					{value:"-1",txt:"Không sửa đổi"},
					{value:"15",txt:"15"},
					{value:"35",txt:"35"},
					{value:"50",txt:"50"},
					{value:"75",txt:"75"},
					{value:"100",txt:"100"},
				],
				power_5:[
					{value:"-1",txt:"Không sửa đổi"},
					{value:"15",txt:"15"},
					{value:"35",txt:"35"},
					{value:"50",txt:"50"},
					{value:"75",txt:"75"},
					{value:"100",txt:"100"},
				],
			},
		},
		apac_upgradation:{
			html:{
				"select_All":["Chọn tất cả"],
				"modal-title":"Tải lên tập tin nâng cấp",
				"view":"Duyệt",
				
			},
			js:{
				"ac_ap_online_table":["<input type='checkbox' name='checkboxShall' id='select_All' value='0' class='checkboxShall'>","Tên thiết bị","Mô hình","IP","MAC","Số phiên bản"],
				"ac_upgrading_table":["Tên thiết bị","Mô hình","IP","MAC","Phiên bản trước khi nâng cấp","Trạng thái nâng cấp"],
				"upgrade_status":["Đang nâng cấp","Hoàn thành nâng cấp","Chờ nâng cấp","Đánh dấu để nâng cấp","Lỗi kiểm tra tập tin"],
				"upgradation_title":["Tất cả cấu hình thành công! Xin vui lòng chờ một thời gian để làm mới trang để xem"]
			},
		},
		ac_changePassword:{
			html:{
				"f-label":["Mật khẩu hiện tại","Mật khẩu mới","Xác nhận mật khẩu"],
				"tip-sec":"Đây là tham số toàn cầu, cập nhật mật khẩu đăng nhập mạng AP!"
			}
		},
		restart:{
			html:{
				"select_All":["Chọn tất cả"],
				"f-label":["Mở","Thời gian","Ngày"],
				"modal-title":"Khởi động lại đúng giờ",
				"active":["Ngày", "một", "hai", "ba", "bốn", "năm", "sáu."]
			},
			js:{
				
				"ac_ap_online_table":["<input type='checkbox' name='checkboxShall' id='select_All' value='0' class='checkboxShall'>","Tên thiết bị","Mô hình","IP","MAC","Trạng thái khởi động lại theo thời gian","Thời gian khởi động lại"],
				
			},
		},
		app_management:{
			html:{
				"tl":"APP điện thoại di động<br>Giúp bạn quản lý router",
				"txt0":["Có thể quản lý cục bộ hoặc từ xa",
						"Quét mã mở quản lý",
						]
			}
			
		},
		lock_screen:{
			html:{
					"bander_txt":["NAP930","Số người online","Thời gian hiện tại：","Thời gian chạy thiết bị：","Sử dụng CPU：","Sử dụng bộ nhớ：","Thông tin phiên bản：","Thiết bị MAC："],
					"text_bt":["Chế độ AP","FIT AP","Trạng thái điều khiển AC","Thiết lập kết nối điều khiển AC","Địa chỉ AC:","MAC:","Nâng cấp","Phiên bản nâng cấp","Khởi tạo","Khởi tạo AP","Captive Portal Status"],
					"f-label":["Chọn tập tin nâng cấp","Tự động cập nhật firmware mới nhất","Thông tin phiên bản","Captive Portal Status:","ISP:","NAS ID:","UAM SECERT:","Lựa chọn không dây:"],
					"version-status":["Phiên bản hiện tại","Phiên bản mới nhất"],
				
				"tipsText":["Luôn cập nhật firmware để trải nghiệm các tính năng mới, khắc phục sự cố và cải thiện sự ổn định ngay lập tức, chúng tôi khuyên bạn nên bật tính năng này. Khi tính năng này được kích hoạt, router sẽ thường xuyên hỏi máy chủ về firmware mới và cập nhật firmware vào buổi sáng sớm."],
				"tab-item":["Nâng cấp thủ công","Nâng cấp trực tuyến"],
					
          "modal-title":["Nâng cấp","Khởi tạo"],
					"single-tip":"Tất cả các thông số cấu hình sẽ bị xóa và khởi động lại router, bạn có chắc chắn để tiếp tục？",
					"reset_tip":["Bộ định tuyến đang khởi động lại, xin vui lòng không tắt nguồn, xin vui lòng chờ đợi... "," Bộ định tuyến đang được nâng cấp, xin vui lòng không tắt nguồn, xin vui lòng chờ đợi..."],
					"view":["Duyệt"],
					"p_txt":["* Bạn có thể sử dụng AC để quản lý<br>* Bạn có thể ngắt kết nối với AC bằng tay và sau đó quản lý lại thiết bị này",""],
         
					"f-label-title":["SSID chính","SSID khách"]
			},
			select:{
				isp:[
					{value:"wifisystem", 	txt:"WIFISYSTEM"},
					{value:"hotspotsystem", 	txt:"HOTSPOTSYSTEM"},
				]
			}
		},
		phone_management:{
			html:{
				"tl":"Quản lý mạng thông minh của Lỗi Khoa<br>giúp bạn quản lý bộ định tuyến",
				"txt0":["Quản lý từ xa, nơi khác cũng có thể quản lý bộ định tuyến.",
    					"Quản lý trực quan, thiết bị truy cập Internet trong nháy mắt","Hỗ trợ kỹ thuật với dịch vụ khách hàng trực tuyến một-một","",
						"Quét mã mở quản lý","Không có mạng."
						]
			}
			
		},
		phone_control_router:{
					html:{
						"desc1":"Giúp bạn quản lý router",
						"desc2":"Có thể quản lý cục bộ hoặc từ xa",
						"icon":"Đã tải app, click vào đây để liên kết ngay",
						"opt_desc":"Hướng dẫn vận hành",
						"title":"Quét liên kết",
						"describe":"Mở Bee-Center và quét bộ định tuyến ràng buộc mã QR bên dưới",
							"step_title_desc":["Tải ứng dụng Bee-Center","Ứng dụng Bee-Center"],
				"qr-desc":["Tải xuống APP","Tải xuống APP","Quét mã liên kết APP"],
						"android":"Android",
						"iOS":"iOS"
					}
				},
		networkingEquipment:{
			html:{
				"modal-title":["Mẹo","Thay đổi tên thiết bị"],
				"f-label":["Tên thiết bị"],
				"tab-item":["Danh sách máy chủ Internet","Danh sách đen thiết bị"],
				"online-title":["Máy tính và điện thoại nhà tôi(<span class=\"online-device-count\"></span>Thiết bị trực tuyến)","Danh sách đen trực tuyến(<span class=\"black-device-count\"></span>Đài)"]
			},
			js:{
				limit_speed:"Giới hạn tốc độ",
				limited_speed:"Tốc độ giới hạn",
				online_time:"Thời gian online: ",
				uplink_speed:"Tốc độ Internet: ",
				downlink_speed:"Tốc độ mạng xuống: ",
				pull_black:"Kéo đen",
				relieve_black:"Gỡ bỏ Black",
				not_limit:"(Giá trị 0 không giới hạn tốc độ)",
				btn_confirm:"Xác định",
				btn_cancel_limit:"Hủy giới hạn tốc độ",
				pulling_black:"Đang kéo đen......",
				relieving_black:"Đang giải trừ kéo hắc......",
				relieve_time:"Kéo thời gian đen: "
			}
		},
		wiFiSetUp:{
			html:{
				"tab-item":["Cài đặt WiFi 2.4GHz","Cài đặt WiFi 5GHz"],
				"f-label":["Tần số kép trong một","Trạng thái WiFi 2.4GHz","Tên WiFi (SSID)","Cách mã hóa","Mật khẩu wifi","Chế độ mạng","Băng thông kênh","Kênh không dây","TWT",
						"Trạng thái WiFi 5GHz","Tên WiFi (SSID)","Cách mã hóa","Mật khẩu wifi","Chế độ mạng","Băng thông kênh","Kênh không dây","TWT","Mạng dự phòng Wi-Fi5",
						"Trạng thái WiFi","Tên WiFi (SSID)","Cách mã hóa","Mật khẩu wifi","2.4G","Chế độ mạng","Băng thông kênh","Kênh không dây","TWT","5G","Chế độ mạng","Băng thông kênh","Kênh không dây","TWT","Mạng dự phòng Wi-Fi5",],
				"chk-txt":["Name","Name","Giữ lại mạng 5G hiện tại",],
				"prompt_text":["Cài đặt nâng cao>>","Cài đặt nâng cao>>","Cài đặt nâng cao>>"],
				"tipsText":"（Máy tính và điện thoại di động không thể tìm thấy mạng không dây ẩn, cần thêm mạng không dây theo cách thủ công）",
				"text_title":["Sau khi tắt TWT, mạng không dây có thể tương thích với các thiết bị không hỗ trợ 802.11AX.",
							"Sau khi tắt TWT, mạng không dây có thể tương thích với các thiết bị không hỗ trợ 802.11AX.",
							"Khi một số thiết bị đầu cuối không dây không thể tìm thấy tín hiệu WiFi 6, chức năng này có thể được bật và kết nối với tín hiệu WiFi này.：<span class=\"spare_ssid\"></span>",
							"Sau khi tắt TWT, mạng không dây có thể tương thích với các thiết bị không hỗ trợ 802.11AX.",
							"Khi một số thiết bị đầu cuối không dây không thể tìm thấy tín hiệu WiFi 6, chức năng này có thể được bật và kết nối với tín hiệu WiFi này.：<span class=\"spare_ssid\"></span>",],
				"tip-sec":"Chức năng Wi-Fi tắt theo thời gian Đã bật ",
				
			},
			select:{
				wls_2_4_ap_mode_sel:[
					{value:"NONE", 	txt:"Không mã hóa"},
					{value:"AES", 	txt:"WPA/WPA2-PSK  AES"},
					{value:"AES", 	txt:"WPA2/WPA3-PSK  AES"}
				],
				wlb_2_4_channel_width_sel:[
					{value:"20M", 	txt:"20M"},
					{value:"40M+", 	txt:"40M"}
				],
				wireless_base_2_4_channel_sel:[
					{value:"0", 	txt:"Tự động"},
					{value:"1", 	txt:"Kênh 1"},
					{value:"2", 	txt:"Kênh 2"},
					{value:"3", 	txt:"Kênh 3"},
					{value:"4", 	txt:"Kênh 4"},
					{value:"5", 	txt:"Kênh 5"},
					{value:"6", 	txt:"Kênh 6"},
					{value:"7", 	txt:"Kênh 7"},
					{value:"8", 	txt:"Kênh 8"},
					{value:"9", 	txt:"Kênh 9"},
					{value:"10", 	txt:"Kênh 10"},
					{value:"11", 	txt:"Kênh 11"},
					{value:"12", 	txt:"Kênh 12"},
					{value:"13", 	txt:"Kênh 13"}
				],
				wireless_base_2g_sel:[
					{value:"b", 	txt:"802.11b"},
//					{value:"g", 	txt:"802.11g"},
//					{value:"n", 	txt:"802.11n"},
					{value:"bg", 	txt:"802.11b/g"},
//					{value:"gn", 	txt:"802.11g/n"},
					{value:"bgn", 	txt:"802.11b/g/n"},
					{value:"bgnax", 	txt:"802.11b/g/n/ax"},
				],
				wireless_base_5g_sel:[
					{value:"a", 	txt:"802.11a"},
//					{value:"n", 	txt:"802.11n"},
					{value:"an", 	txt:"802.11a/n"},
//					{value:"anac", 	txt:"802.11n/ac"},
					{value:"aanac", 	txt:"802.11a/n/ac"},
					{value:"aanacax", 	txt:"802.11a/n/ac/ax"}
					
				],
				wls_5_ap_mode_sel:[
					{value:"NONE", 	txt:"Không mã hóa"},
					{value:"AES", 	txt:"WPA/WPA2-PSK  AES"},
					{value:"AES", 	txt:"WPA2/WPA3-PSK  AES"}
//					{value:"psk+aes", 	txt:"WPA-PSK AES"},
//					{value:"psk2+aes", 	txt:"WPA2-PSK AES"},
//					{value:"mixed-psk+aes", 	txt:"WPA/WPA2-PSK AES"}
				],
				wlb_5_channel_width_sel:[
					{value:"20M", 	txt:"20M"},
					{value:"40M+", 	txt:"40M"},
					{value:"80M", 	txt:"80M"},
//					{value:"160M", txt:"160M"},
//					{value:"80M+80M", txt:"80M+80M"},
				],
				wireless_base_5_channel_sel:[
					{value:"0", 	txt:"Tự động"},
					{value:"36", 	txt:"Kênh 36"},
					{value:"40", 	txt:"Kênh 40"},
					{value:"44", 	txt:"Kênh 44"},
					{value:"48", 	txt:"Kênh 48"},
					{value:"52", 	txt:"Kênh 52"},
					{value:"56", 	txt:"Kênh 56"},
					{value:"60", 	txt:"Kênh 60"},
					{value:"64", 	txt:"Kênh 64"},
					{value:"149", 	txt:"Kênh 149"},
					{value:"153", 	txt:"Kênh 153"},
					{value:"157", 	txt:"Kênh 157"},
					{value:"161", 	txt:"Kênh 161"},
					{value:"165", 	txt:"Kênh 165"}
				],
				twt_select_24:[
					{value:"0", 	txt:"Đóng cửa"},
					{value:"1", 	txt:"Mở"},
				],
				twt_select_5:[
					{value:"0", 	txt:"Đóng cửa"},
					{value:"1", 	txt:"Mở"},
				],
				backup_network_select_5:[
					{value:"0", 	txt:"Đóng cửa"},
					{value:"1", 	txt:"Mở"},
				],
				dual_frequency_encryption_select:[
					{value:"NONE", 	txt:"Không mã hóa"},
					{value:"AES", 	txt:"WPA/WPA2-PSK  AES"},
					{value:"AES", 	txt:"WPA2/WPA3-PSK  AES"}
				],
				twt_select_dual_frequency:[
					{value:"0", 	txt:"Đóng cửa"},
					{value:"1", 	txt:"Mở"},
				],
				select_dual_frequency:[
					{value:"0", 	txt:"Đóng cửa"},
					{value:"1", 	txt:"Mở"},
				],
				wlb_2_4_channel_width_sel_all:[
					{value:"20M", 	txt:"20M"},
					{value:"40M+", 	txt:"40M"}
				],
				wireless_base_2_4_channel_sel_all:[
					{value:"0", 	txt:"Tự động"},
					{value:"1", 	txt:"Kênh 1"},
					{value:"2", 	txt:"Kênh 2"},
					{value:"3", 	txt:"Kênh 3"},
					{value:"4", 	txt:"Kênh 4"},
					{value:"5", 	txt:"Kênh 5"},
					{value:"6", 	txt:"Kênh 6"},
					{value:"7", 	txt:"Kênh 7"},
					{value:"8", 	txt:"Kênh 8"},
					{value:"9", 	txt:"Kênh 9"},
					{value:"10", 	txt:"Kênh 10"},
					{value:"11", 	txt:"Kênh 11"},
					{value:"12", 	txt:"Kênh 12"},
					{value:"13", 	txt:"Kênh 13"}
				],
				wireless_base_2g_sel_all:[
					{value:"b", 	txt:"802.11b"},
//					{value:"g", 	txt:"802.11g"},
//					{value:"n", 	txt:"802.11n"},
					{value:"bg", 	txt:"802.11b/g"},
//					{value:"gn", 	txt:"802.11g/n"},
					{value:"bgn", 	txt:"802.11b/g/n"},
					{value:"bgnax", 	txt:"802.11b/g/n/ax"},
				],
				wireless_base_5g_sel_all:[
					{value:"a", 	txt:"802.11a"},
//					{value:"n", 	txt:"802.11n"},
					{value:"an", 	txt:"802.11a/n"},
//					{value:"anac", 	txt:"802.11n/ac"},
					{value:"aanac", 	txt:"802.11a/n/ac"},
					{value:"aanacax", 	txt:"802.11a/n/ac/ax"}
					
				],
				wlb_5_channel_width_sel_all:[
					{value:"20M", 	txt:"20M"},
					{value:"40M+", 	txt:"40M"},
					{value:"80M", 	txt:"80M"},
//					{value:"160M", txt:"160M"},
//					{value:"80M+80M", txt:"80M+80M"},
				],
				wireless_base_5_channel_sel_all:[
					{value:"0", 	txt:"Tự động"},
					{value:"36", 	txt:"Kênh 36"},
					{value:"40", 	txt:"Kênh 40"},
					{value:"44", 	txt:"Kênh 44"},
					{value:"48", 	txt:"Kênh 48"},
					{value:"52", 	txt:"Kênh 52"},
					{value:"56", 	txt:"Kênh 56"},
					{value:"60", 	txt:"Kênh 60"},
					{value:"64", 	txt:"Kênh 64"},
					{value:"149", 	txt:"Kênh 149"},
					{value:"153", 	txt:"Kênh 153"},
					{value:"157", 	txt:"Kênh 157"},
					{value:"161", 	txt:"Kênh 161"},
					{value:"165", 	txt:"Kênh 165"}
				],
        	twt_select_24_all:[
					{value:"0", 	txt:"Đóng cửa"},
					{value:"1", 	txt:"Mở"},
				],
				twt_select_5_all:[
					{value:"0", 	txt:"Đóng cửa"},
					{value:"1", 	txt:"Mở"},
				],
			}
		},
		multipleSsid:{
			html:{
				"tab-item":["Cài đặt mạng khách 2.4GHz","Cài đặt mạng khách 5GHz"],
				"f-label":["Trạng thái mạng khách","Tên mạng khách truy cập 2.4GHz (SSID)","Tên mạng khách truy cập 5GHz (SSID)","Cách mã hóa","Mật khẩu mạng khách","Băng thông kênh","Kênh không dây","Trạng thái mạng khách truy cập 5GHz","Tên mạng khách (SSID)","Cách mã hóa","Mật khẩu mạng khách","Băng thông kênh","Kênh không dây"],
				"tipsText":"（Máy tính và điện thoại di động không thể tìm thấy mạng không dây ẩn, cần thêm mạng không dây theo cách thủ công）",
				"chk-txt":"Name"
			},
			select:{
				wls_2_4_ap_mode_sel:[
					{value:"NONE", 	txt:"Không mã hóa"},
					{value:"AES", 	txt:"WPA/WPA2-PSK  AES"},
					{value:"AES", 	txt:"WPA2/WPA3-PSK  AES"}
					
//					{value:"psk+aes", 	txt:"WPA-PSK AES"},
//					{value:"psk2+aes", 	txt:"WPA2-PSK AES"},
//					{value:"mixed-psk+aes", txt:"WPA/WPA2-PSK AES"}
				],
				wlb_2_4_channel_width_sel:[
					{value:"HT20", 	txt:"20M"},
					{value:"HT40", 	txt:"40M"}
				],
				wireless_base_2_4_channel_sel:[
					{value:"0", 	txt:"Tự động"},
					{value:"1", 	txt:"Kênh 1"},
					{value:"2", 	txt:"Kênh 2"},
					{value:"3", 	txt:"Kênh 3"},
					{value:"4", 	txt:"Kênh 4"},
					{value:"5", 	txt:"Kênh 5"},
					{value:"6", 	txt:"Kênh 6"},
					{value:"7", 	txt:"Kênh 7"},
					{value:"8", 	txt:"Kênh 8"},
					{value:"9", 	txt:"Kênh 9"},
					{value:"10", 	txt:"Kênh 10"},
					{value:"11", 	txt:"Kênh 11"},
					{value:"12", 	txt:"Kênh 12"},
					{value:"13", 	txt:"Kênh 13"}
				],
				wls_5_ap_mode_sel:[
					{value:"NONE", 	txt:"Không mã hóa"},
					{value:"AES", 	txt:"AES"},
					{value:"AES", 	txt:"WPA2/WPA3-PSK  AES"}
//					{value:"psk+aes", 	txt:"WPA-PSK AES"},
//					{value:"psk2+aes", 	txt:"WPA2-PSK AES"},
//					{value:"mixed-psk+aes", 	txt:"WPA/WPA2-PSK AES"}
				],
				
				wireless_base_5_channel_sel:[
					{value:"0", 	txt:"Tự động"},
					{value:"36", 	txt:"Kênh 36"},
					{value:"40", 	txt:"Kênh 40"},
					{value:"44", 	txt:"Kênh 44"},
					{value:"48", 	txt:"Kênh 48"},
					{value:"52", 	txt:"Kênh 52"},
					{value:"56", 	txt:"Kênh 56"},
					{value:"60", 	txt:"Kênh 60"},
					{value:"64", 	txt:"Kênh 64"},
					{value:"149", 	txt:"Kênh 149"},
					{value:"153", 	txt:"Kênh 153"},
					{value:"157", 	txt:"Kênh 157"},
					{value:"161", 	txt:"Kênh 161"},
					{value:"165", 	txt:"Kênh 165"}
				]				
			}
		},
		qos:{
			html:{
				"f-label":["Chuyển đổi QoS","Lên trên","Xuống"],
         	"tip-sec":["Sau khi bật thiết lập QoS, giảm hiệu quả các vấn đề về băng thông chiếm dụng thiết bị cá nhân, đảm bảo sử dụng hợp lý nhất băng thông mạng của từng thiết bị, hãy chắc chắn điền thông tin băng thông thực"]
			},
		},
		manage_wifi_QR_code:{
			html:{
				"f-label":[""],
			
				"qr_h2":["Mạng không dây bị ghi đè","Mạng không dây bị ghi đè"],
				"qr_p3":["Dịch vụ này được cung cấp bởi router Lỗi","Dịch vụ này được cung cấp bởi router Lỗi"],
				"qrcode_right_h2":["Vui lòng chọn SSID cho Wi-Fi","Thiết lập ngôn ngữ chào mừng","Tải xuống mã QR ngay，Posted in Cửa hàng","Tải xuống mã QR ngay<br>Posted in Cửa hàng"],
				"qr_form_tx":["*Số lượng từ được đề xuất trong vòng 16 từ<br>Ví dụ：<br>·Mở WeChat và lướt qua，WiFi miễn phí<br>·Bến tàu cũ chào đón bạn"]
			},
		},
		manage_wifi_QR_code:{
			html:{
				"f-label":[""],
			
				"qr_h2":["Mạng không dây bị ghi đè","Mạng không dây bị ghi đè"],
				"qr_p3":["Dịch vụ này được cung cấp bởi router Lỗi","Dịch vụ này được cung cấp bởi router Lỗi"],
				"qrcode_right_h2":["Vui lòng chọn SSID cho Wi-Fi","Thiết lập ngôn ngữ chào mừng","Tải xuống mã QR ngay bây giờ để in và gửi đến cửa hàng","Tải xuống mã QR ngay<br>Posted in Cửa hàng"],
				"qr_form_tx":["*Số lượng từ được đề xuất trong vòng 16 từ<br>Ví dụ:<br>·Mở wechat quét qua, ngay cả WiFi miễn phí.<br>·Bến tàu cũ chào đón bạn"]
			},
		},
		tr069:{
			html:{
				"f-label":["CWMP","Kiểu dữ liệu","Địa chỉ ACS","Tên người dùng","Mật khẩu","Địa chỉ OUN","Tên người dùng","Mật khẩu","Cổng","Thông báo khoảng","Khoảng thời gian","TR111","Địa chỉ","Cổng","Tên người dùng","Mật khẩu"],
				"advance_toggle":"Cài đặt nâng cao>>",
				"prompt_text":["giây","(Tùy chọn)","(Tùy chọn)"]
			},
			select:{
				data_mode:[
					{value:"0",txt:"TR098"},
					{value:"1",txt:"TR181"}
				]
			}
		},
		usb:{
			html:{
				"tab-item":["Chia sẻ tập tin USB","USBdongle trực tuyến"],
				"f-label":["Trạng thái USB",
						"SMB chia sẻ","Tên người dùng","Mật khẩu","Quyền hạn","Chia sẻ đường dẫn",
						"DLNA chia sẻ","Chia sẻ đường dẫn",
						"Chia sẻ FTP","Tên người dùng","Mật khẩu","Chia sẻ đường dẫn",
							"USB trực tuyến","",
							"Tên người dùng","Mật khẩu","Quyền hạn","Chia sẻ đường dẫn",],
				"tipsText":["Sau khi chia sẻ được bật, các tệp quản lý thiết bị lưu trữ có thể được truy cập thông qua giao thức SMB",
							"Chia sẻ đa phương tiện DLNA: Sau khi mở giao thức chia sẻ đa phương tiện, bạn có thể phát hình ảnh, âm nhạc, video và các tài nguyên liên quan khác của thiết bị lưu trữ bất cứ lúc nào",
							"Chia sẻ FTP：Sau khi bật giao thức chia sẻ FTP, bạn có thể quản lý hình ảnh, âm nhạc, video và các tài nguyên liên quan khác của thiết bị lưu trữ.",
							"USBdongle trực tuyến：Có thể cắm thẻ USB trên mạng, chia sẻ router để kết nối Internet"],
				"checkbox_lb":"Ưu tiên truy cập Internet có dây",
				"modal-title":["Sửa đổi","Chọn đường dẫn"],
			},
			select:{
				smb_power:[
					{value:"no",txt:"Đọc và viết"},
					{value:"yes",txt:"Chỉ đọc"},

				]
			},
			js:{
				"button_add":["Phát hiện","Gỡ cài đặt"],
				"detection_result":["Vui lòng cắm thiết bị lưu trữ USB","Thiết bị lưu trữ USB đang chạy","Đang kiểm tra......","Đang dỡ......","Gỡ cài đặt thành công","Gỡ cài đặt thất bại"],
				"root_path":"Thư mục gốc",
				"please_select":"Vui lòng chọn",
				"path_not_find":"Chưa truy vấn tới danh sách thư mục con",
				"no_subdirectory_find":"Không có thư mục con trong thư mục này",
			}
		},
		diagnosis:{
			html:{
				title:"Chẩn đoán",
				"f-label":["Công cụ chẩn đoán","Địa chỉ IP/Tên miền","Số Ping","Kích thước gói Ping","Đường theo dõi Tối đa TTL"]
			},
			select:{
				diagnostic_options:[
					{value:"ping", 	txt:"Ping"},
					{value:"tracert", 	txt:"Tracert"}	
				]
			},
			js:{
				"button-diagnosis":"Bắt đầu",
			}
		},
		port_mirror:{
			html:{
				"f-label":["Cổng nguồn","Cổng đích"]
			},
			select:{
				source_options:[],
				dst_options:[]
			},
			js:{
				"table-title":["Cổng nguồn","Cổng đích","Hoạt động"],
				"label":["Tất cả"]
			}
			
		},
		lan_setup:{
			html:{
				"tab-item":["IPv4","IPv6"],
				"f-label":["Địa chỉ mạng nội bộ","Mặt nạ mạng con","Tự động gán địa chỉ (dịch vụ DHCP)","Địa chỉ Pool Bắt đầu","Address pool Đã kết thúc left ","Phương pháp gán địa chỉ IP"],
				"reset_tip":"Bộ định tuyến đang khởi động lại, xin vui lòng không tắt nguồn, vui lòng chờ...",
//				地址池起始地址,地址池结束地址
//				"f-explain":["(您在内网也可以通过<span id=\"login_site\" class=\"tipsText\"></span>访问路由器)"]
			},
			select:{
				ip_address_ipv6:[
					{value:"stateless", txt:"Không trạng thái"},
					{value:"stateful", 	txt:"Trạng thái"},
					
				]
			}
		},
    	ap_lan_setup:{
			html:{
				"tab-item":["IPv4","IPv6"],
				"f-label":["Địa chỉ mạng nội bộ","Mặt nạ mạng con","Tự động gán địa chỉ（Dịch vụ DHCP）","Địa chỉ Pool Bắt đầu","Địa chỉ Pool Bắt đầu ",
							"Thu thập động","Nhận địa chỉ IP hiện tại","Mặt nạ mạng con","Cổng hiện tại","DNS","Địa chỉ IP","Mặt nạ mạng con","Cổng hiện tại","DNS","Phương pháp gán địa chỉ IP",],
//				地址池起始地址,地址池结束地址
//				"f-explain":["(您在内网也可以通过<span id=\"login_site\" class=\"tipsText\"></span>访问路由器)"]
				"reset_tip":"Bộ định tuyến đang khởi động lại, xin vui lòng chờ……"
			},
			select:{
				ip_address_ipv6:[
					{value:"stateless", txt:"Không trạng thái"},
					{value:"stateful", 	txt:"Trạng thái"},
					
				]
			}
		},
		dhcp_reservation:{
			html:{
				"f-label":["Tên máy","Địa chỉ MAC","Địa chỉ IP"],
			},
			js:{
				"table-title":['Số sê-ri','Tên máy', 'Địa chỉ MAC', 'Địa chỉ IP', 'Hoạt động'],
				"txt":["Sửa đổi","Xoá","Xóa thành công","Sửa đổi thành công"],
			},
		},
		wan_setup:{
			html:{
					"f-label":["Công tắc","IP Version","Cách truy cập Internet","Kết nối Name","Liên kết cổng","Kích hoạt DHCP Server","Công tắc NAT","Danh sách dịch vụ","Kiểu VLAN","VLAN ID","802.1p",
						"MTU","Tài khoản PPPoE","Mật khẩu PPPoE","Authentication Type","Idle Timeout",
						"Địa chỉ IP","Mặt nạ mạng con","Cổng mặc định","DNS1","DNS2","IPv6CP Extension Mode","IPv6 cách truy cập Internet","Địa chỉ IP","Cổng mặc định","Cách DNS","DNS1","DNS2","LAN IPv6 tiền tố","IPv6",
						"Tự động gán địa chỉ (dịch vụ DHCP)","Địa chỉ mạng nội bộ","Mặt nạ mạng con","Địa chỉ Pool Bắt đầu","Address pool Đã kết thúc left","Liên kết cổng"],
				"checkbox_lb":["LAN1","LAN2","LAN3","LAN4","2.4G_Main","5G_Main",'2.4G_Guest',"5G_Guest","LAN1","LAN2","LAN3","LAN4","2.4G_Main",'2.4G_Guest',"5G_Main","5G_Guest"],
			},
			js:{
				"label":["Chế độ cầu","Tạo kết nối WAN"],
				
			},
			select:{
				proto:[
					{value:"IPv4", 	txt:"IPv4"},
					
					{value:"IPv4/v6", txt:"IPv4/v6"}
				],
				
				IPv6mode_select:[
					{value:"pppoe", 	txt:"Băng thông rộng (PPPoE)"},
					{value:"dhcp", 	txt:"Truy cập tự động (DHCP)"},
					{value:"static", 	txt:"Địa chỉ tĩnh"},	
					{value:"bridge", 	txt:"Chế độ cầu"},
				],
				service_type:[
					{value:"-1", 	txt:"Create WAN Connection"},
				
				],
				servList:[
					{value:"internet", 	txt:"INTERNET"},
					{value:"tr069", 	txt:"TR069"},
				//	{value:"iptv", 	txt:"IPTV"},
					//{value:"voip", 	txt:"VOIP"},
				],
				Priority:[
					{value:"0", 	txt:"0"},
					{value:"1", 	txt:"1"},
					{value:"2", 	txt:"2"},
					{value:"3", 	txt:"3"},
					{value:"4", 	txt:"4"},
					{value:"5", 	txt:"5"},
					{value:"6", 	txt:"6"},
					{value:"7", 	txt:"7"},
				],
				WBDMode:[
					{value:"-1", 	txt:"UnTag"},
				
					{value:"2", 	txt:"Tag"},
				],
				PrefixSrc:[
					{value:"0", 	txt:"Tự động"},
					{value:"1", 	txt:"Hướng dẫn sử dụng"},
					
				],
				DNSv6Src:[
					{value:"auto", 	txt:"Tự động"},
					{value:"manu", 	txt:"Hướng dẫn sử dụng"},
				],
		
				internet_access_ipv6:[
					{value:"auto", 	txt:"Tự động"},
					{value:"manu", 	txt:"Hướng dẫn sử dụng"},
					
				],
				connTrigger:[
					{value:"AlwaysOn", 	txt:"Always On"},
					{value:"OnDemand", 	txt:"On Demand"},
				],
				AuthType:[
					{value:"PAP,CHAP,MS-CHAP", 	txt:"Auto"},
					{value:"PAP", 	txt:"PAP"},
					{value:"CHAP", 	txt:"CHAP"}
				],
				
			}
		},
		external_network:{
			html:{
				"tab-item":["Chế độ định tuyến","Chế độ cầu nối"],
			"ipv4_infoone_lable":["Băng thông rộng PPPoE","Tự động lấy địa chỉ","Đặt địa chỉ theo cách thủ công"],
			
			"f-label":["Cách truy cập Internet",
					"Tài khoản PPPoE","Mật khẩu PPPoE","Địa chỉ MAC","MTU","DNS ưa thích","DNS dự phòng","Chế độ làm việc","Cấu hình cổng WAN","Tên máy phục vụ","Tên AC",
					"Địa chỉ MAC","MTU","DNS ưa thích","DNS dự phòng","Chế độ làm việc","Cấu hình cổng WAN",
					"Địa chỉ IP","Mặt nạ mạng con","Cổng mặc định","Địa chỉ MAC","DNS ưa thích","DNS dự phòng","MTU",'Chế độ làm việc',"Cấu hình cổng WAN",
					"Tên người dùng","Mật khẩu","Địa chỉ MAC","MTU","Loại kết nối","Địa chỉ IP","Mặt nạ mạng con","Cổng mặc định","DNS ưa thích","DNS dự phòng","Chế độ làm việc","Tên máy phục vụ","Tên AC",
					"Tên người dùng","Mật khẩu","Địa chỉ MAC","MTU","Địa chỉ IP/Tên miền","Loại kết nối","Địa chỉ IP","Mặt nạ mạng con","Cổng mặc định","DNS ưa thích","DNS dự phòng","Chế độ làm việc",
					"Tên người dùng","Mật khẩu","Địa chỉ MAC","MTU","Mã hóa MPPE","Địa chỉ IP/Tên miền","Loại kết nối","Địa chỉ IP","Mặt nạ mạng con","Cổng mặc định","DNS ưa thích","DNS dự phòng","Chế độ làm việc",
						"","Công tắc IPv6","Cách truy cập Internet",	
					"Địa chỉ IP","Cổng mặc định","LAN IPv6 tiền tố","","Cách DNS","DNS ưa thích","Thay thế DNS",
					"DSLITE","AFTR"],
			
			"prompt_text":["Cài đặt nâng cao>>","(Tùy chọn)","(Tùy chọn)","(Chỉ dành cho người dùng khu vực đặc biệt)","(Chỉ dành cho người dùng khu vực đặc biệt)",
						"Cài đặt nâng cao>>","(Tùy chọn)","(Tùy chọn)",
						"(Tùy chọn)","Cài đặt nâng cao>>",
						"(Tùy chọn)","(Tùy chọn)","Cài đặt nâng cao>>","(Chỉ dành cho người dùng khu vực đặc biệt)","(Chỉ dành cho người dùng khu vực đặc biệt)",
						"(Tùy chọn)","(Tùy chọn)","Cài đặt nâng cao>>",
						"(Tùy chọn)","(Tùy chọn)","Cài đặt nâng cao>>",],
			"prompt_text_ipv6":["(Tùy chọn)","(Tùy chọn)","(Tùy chọn)","(Tùy chọn)","(Tùy chọn)"],
			
			"routing-mode":["Chia sẻ chế độ Internet IP","Chế độ định tuyếnIP",
						"Chia sẻ chế độ Internet IP","Chế độ định tuyếnIP",
						"Chia sẻ chế độ Internet IP","Chế độ định tuyếnIP",
						"Truy cập tự động (DHCP)","Địa chỉ tĩnh","Chia sẻ chế độ Internet IP","Chế độ định tuyếnIP",
						"Truy cập tự động (DHCP)","Địa chỉ tĩnh","Chia sẻ chế độ Internet IP","Chế độ định tuyếnIP",
						"Truy cập tự động (DHCP)","Địa chỉ tĩnh","Chia sẻ chế độ Internet IP","Chế độ định tuyếnIP"],
			
			"a-mac":["Địa chỉ MAC Clone","MAC của router","Địa chỉ MAC Clone","MAC của router","Địa chỉ MAC Clone","MAC của router","Địa chỉ MAC Clone","MAC của router","Địa chỉ MAC Clone","MAC của router","Địa chỉ MAC Clone","MAC của router",],
			
			"routing-mode-ipv6":["Tự động","Kết nối thủ công","Tự động","Kết nối thủ công","Bật","tắt","Tự động","Kết nối thủ công"]
			},
			select:{
				wan1_select0:[
					{value:"auto", 	txt:"Chế độ tự động"},
					{value:"10f", 	txt:"10MDuplex đầy đủ"},
					{value:"10h", 	txt:"10M Nửa song công"},
					{value:"100f", 	txt:"100MDuplex đầy đủ"},
					{value:"100h", 	txt:"100M Nửa song công"},
					{value:"1000f", txt:"1000M Nửa song công"}	
				],
				wan1_select1:[
					{value:"auto", 	txt:"Chế độ tự động"},
					{value:"10f", 	txt:"10MDuplex đầy đủ"},
					{value:"10h", 	txt:"10M Nửa song công"},
					{value:"100f", 	txt:"100MDuplex đầy đủ"},
					{value:"100h", 	txt:"100M Nửa song công"},
					{value:"1000f", txt:"1000M Nửa song công"}	
				],
				wan1_select2:[
					{value:"auto", 	txt:"Chế độ tự động"},
					{value:"10f", 	txt:"10MDuplex đầy đủ"},
					{value:"10h", 	txt:"10M Nửa song công"},
					{value:"100f", 	txt:"100MDuplex đầy đủ"},
					{value:"100h", 	txt:"100M Nửa song công"},
					{value:"1000f", txt:"1000M Nửa song công"}	
				],
				internet_access_ipv4:[
					{value:"pppoe", 	txt:"Băng thông rộng (PPPoE)"},
					{value:"dhcp", 	txt:"Truy cập tự động (DHCP)"},
					{value:"static", 	txt:"Địa chỉ tĩnh"},	
				],
				internet_access_ipv4_russia:[
					{value:"pppoe", 	txt:"Băng thông rộng (PPPoE)"},
					{value:"dhcp", 	txt:"Truy cập tự động (DHCP)"},
					{value:"static", 	txt:"Địa chỉ tĩnh"},	
					{value:"pppoe_r", 	txt:"Dual AccessPPPoE"},	
					{value:"l2tp", 	txt:"L2TP/Dual AccessL2TP"},	
					{value:"pptp", 	txt:"PPTP/Dual AccessPPTP"},	
				],
				internet_access_ipv6:[
					{value:"dhcp", 	txt:"Cấu hình tự động"},
					{value:"static", 	txt:"Cấu hình thủ công"},
				],
				ipv6_dns_select:[
					{value:"automatic", 	txt:"Cấu hình tự động"},
					{value:"manual", 	txt:"Cấu hình thủ công"},
				],
				mppe_encryption:[
					{value:"0", 	txt:"Đóng cửa"},
					{value:"1", 	txt:"Mở"},
				],
			},
			js:{
				"bridge":"Chế độ cầu nối"
			}
		},
		ipv6:{
			html:{
				"f-label":["Công tắc IPv6","Cách truy cập Internet",	
				"Địa chỉ IP","Tiền tố IPv6","Cổng mặc định","Cách DNS","DNS ưa thích","Thay thế DNS",],
				
				"prompt_text_ipv6":["(Tùy chọn)","(Tùy chọn)","(Tùy chọn)","(Tùy chọn)","(Tùy chọn)"],
				"routing-mode-ipv6":["Tự động","Kết nối thủ công","Tự động","Kết nối thủ công"]
			},
			select:{
				ipv6_dns_select:[
					{value:"automatic", 	txt:"Cấu hình tự động"},
					{value:"manual", 	txt:"Cấu hình thủ công"},
				],
				internet_access_ipv6:[
					{value:"dhcp", 	txt:"Cấu hình tự động"},
					{value:"static", 	txt:"Cấu hình thủ công"},
				],
			}
		},
		system_upgrade:{
			html:{
				"tab-item":["Nâng cấp thủ công","Nâng cấp trực tuyến"],
				"tip-sec":"Phải mất vài phút để nâng cấp firmware, xin vui lòng không tắt nguồn!",
				"f-label":["Phiên bản hiện tại","Chọn tập tin nâng cấp","Tự động cập nhật firmware mới nhất","Tự động cập nhật firmware khẩn cấp","agent tự động nâng cấp","Thông tin phiên bản"],
				"view":"Duyệt",
				"reset_tip":"Bộ định tuyến đang khởi động lại, xin vui lòng không tắt nguồn, vui lòng chờ...",
				"version-status":["Phiên bản hiện tại","Phiên bản mới nhất"],
				
				"tipsText":["Luôn cập nhật firmware để trải nghiệm các tính năng mới, khắc phục sự cố và cải thiện sự ổn định ngay lập tức, chúng tôi khuyên bạn nên bật tính năng này. Khi tính năng này được kích hoạt, router sẽ thường xuyên hỏi máy chủ về firmware mới và cập nhật firmware vào buổi sáng sớm.",
				"Firmware khẩn cấp được sử dụng để giải quyết các vấn đề bảo mật lớn và sự ổn định của bộ định tuyến và bạn nên bật tính năng này. Khi tính năng này được kích hoạt, router sẽ thường xuyên hỏi máy chủ về firmware mới và cập nhật firmware khẩn cấp vào buổi sáng sớm."]
			},
		},
		parameter_backup:{
			html:{
				"tab-item":["Tham số sao lưu","Thông số phục hồi"],
				"tip-sec":"Phải mất vài phút để khôi phục firmware, xin vui lòng không tắt nguồn!",
				"backup_title":["Lưu cài đặt router hiện tại vào file.","Khôi phục các thiết lập của router từ các tập tin sao lưu."],
				"f-label":["","","Chọn khôi phục tập tin"],
				"view":"Duyệt",
				"reset_tip":"Router đang phục hồi, xin vui lòng không tắt nguồn, xin vui lòng chờ...",
			},
		},
		tools:{
			html:{
				"in":["Quét liên kết","Chuyển đổi ngôn ngữ"]
			}
		},
		system:{
			html:{
				"in":["Chuyển đổi ngôn ngữ"]
			}
		},
		router_info:{
			html:{
//				"card-header":["路由器信息","IPv4上网方式 (<span id=\"online_info\"></span>)","IPv6上网方式 (<span id=\"online_info_ipv6\"></span>)","家庭网络信息"],
				"card-header":["Thông tin Router","Thông tin Internet","Thông tin mạng nội bộ"],
				"txt":["Bộ định tuyến Name:","Tốc độ truyền không dây:","Bộ nhớ:",
					"Cách IPv4 truy cập Internet:","Địa chỉ IP IPv4:","Địa chỉ DNS ưa thích IPV4:","Địa chỉ DNS thay thế IPV4:",
				"Địa chỉ IPv4 của router:","Mặt nạ mạng con:","Địa chỉ IPv6 của router:","Trạng thái máy chủ DHCP:","Phạm vi pool địa chỉ DHCP:","Địa chỉ MAC LAN:"],
				
				"txt_ipv6":["Cách IPv6 lên mạng:","Địa chỉ mạng ngoài IPv6:","Tiền tố IPv6:","Địa chỉ MAC WAN:","Địa chỉ DNS ưa thích IPv6:","Địa chỉ DNS thay thế IPv6:",]
			},
			js:{
				"mode": ["Băng thông", "Chế độ WiFi4", "Chế độ WiFi5", "Chế độ WiFi6",],
				"wisp":"Chế độ không dây (WISP)",
				"repeater":"Chuyển tiếp không dây（Repeater）",
				"bridge":"Chế độ cầu nối",
				"wan_status":["WAN","Trạng thái miệng"],
				"lan_status":["LAN","Trạng thái miệng"],
				"card_header":["Thông tin Internet WAN"],
				"ipv4_txt":["Cách IPv4 truy cập Internet:","Địa chỉ IP IPv4:","Địa chỉ cổng IPv4:","Địa chỉ MAC WAN:","Địa chỉ DNS ưa thích IPV4:","Địa chỉ DNS thay thế IPV4:"],
			}
		},
		indicator_light:{
			html:{
				"f-label":["Công tắc LED"]
			},
		},
		portMapping:{
			html:{
				"tab-item":["Máy chủ ảo","Thiết lập DMZ"],
				"modal-title":"Bản đồ cổng mới",
				"title":["Danh sách máy chủ ảo"],
				"f-label":["Dịch vụ ảo Name","Địa chỉ IP của máy chủ mạng nội bộ","Giao thức","Cổng ngoài","Cổng nội bộ","Tình trạng DMZ","Địa chỉ IP máy chủ DMZ"]
			},
			select:{
				proto:[
					{value:"tcp", 	txt:"TCP"},
					{value:"udp", 	txt:"UDP"},
					{value:"tcp udp", 	txt:"TCP+UDP"},
					{value:"icmp", 	txt:"ICMP"},
					{value:"template", 	txt:"Chọn mẫu"}
				],
				external_port_template:[		
					{value:"tcp", 	txt:"HTTP"},
					{value:"tcp", 	txt:"HTTPS"},
					{value:"tcp", 	txt:"FTP"},
					{value:"tcp", 	txt:"POP3"},
					{value:"tcp", 	txt:"SMTP"},
					{value:"udp", 	txt:"DNS"},
					{value:"tcp", 	txt:"TELNET"},
					{value:"udp", 	txt:"IPSEC"},
					{value:"tcp", 	txt:"PPTP"},
					{value:"tcp", 	txt:"Máy tính để bàn từ xa Windows"},
					{value:"tcp", 	txt:"Điện thoại IP H.323"},
					{value:"tcp", 	txt:"SSH"},
					
				 ]
			},
			js:{
				"table-title":["Dịch vụ ảo Name","Địa chỉ IP của máy chủ mạng nội bộ","Giao thức","Cổng ngoài","Cổng nội bộ","Hoạt động"],
				"add":"Mới"
			}
		},
		oray_ddns:{
			html:{
				"f-label":["Trạng thái Dynamic Domain Name Service (DDNS)","Dịch vụ tên miền động","Tên người dùng","Mật khẩu","Tên miền","Thông tin trạng thái"],
				"button_a":["Đăng ký"],
				"tips":["(Yêu cầu router là IP public để truy cập vào mạng ngoài)"]
			},
			select:{
				orayName:[
					{value:"dyndns.org",txt:"www.dyndns.com"},
					{value:"no-ip.com",txt:"www.noip.com"},
					{value:"oray.com",txt:"www.oray.com"}
				]
			}
		},
		remoteAccess:{
			html:{
				"f-label":["HTTPS","Telnet","HTTP","FTP","SSH","Ping"],
				"f-port":"Cổng",
				"f-label-title":["Mạng cục bộ","Internet","Mạng cục bộ","Internet","Mạng cục bộ","Internet","Mạng cục bộ","Internet","Mạng cục bộ","Internet","Mạng cục bộ","Internet"],
			},
		},
		wireless_universal_relay:{
			html:{
				"f-label":["WISP","Tên mạng không dây (SSID)","Mật khẩu","Trạng thái kết nối","Tên mạng không dây (SSID)","Mật khẩu kết nối"],
				"wireless_txt":["Mạng không dây gần đó","Danh sách ẩn","Tìm kiếm WIFI"],
			},
			js:{
				"table-title":["Số sê-ri","Mạng không dây Name","Địa chỉ MAC","Kênh","Chế độ mã hóa","Tín hiệu","Hoạt động"],
				"txt":["Kết nối","Đang quét mạng không dây gần đó......","Nhận mạng không dây thành công"],
			}
		},
		wlan_mode:{
			html:{
				"title":"Chọn chế độ",
				"f-label":["Chế độ không dây hiện tại","Vui lòng sử dụng <a id='login_href' href='http://leike.cc'>leike.cc</a> Quản lý truy cập Router","Tên mạng không dây (SSID)","Trạng thái kết nối","Truy cập SSID","Mật khẩu kết nối"],
				"tip-sec":"Chức năng Mesh được bật, không thể bật chế độ không dây cùng một lúc",
				"wireless_txt":["Danh sách ẩn","Tìm kiếm Wi-Fi"],
			},
			js:{
				"txt":["Kết nối","Đang quét mạng không dây gần đó......","Nhận mạng không dây thành công"],
				hiddenSSID:"Mạng ẩn",
				link:"Kết nối",
				linked:"Đã kết nối",
				searching:"Tìm kiếm tín hiệu",
				tabTitle:["Không dây Name","Mã hóa","Cường độ tín hiệu","Hoạt động"],
				linkStatus:{
					"LinkOK":"Kết nối thành công",
					"Linking":"Trong kết nối......",
					"LinkFail":"Lỗi kết nối",
					"NotLink":"Chưa kết nối"
				},
				linkCompleteTips:"<li>Repeater Wireless Relay Mode sẽ làm cho thiết bị của bạn bị ngắt kết nối với bộ định tuyến, vui lòng kết nối lại không dây.</li>",
				parentManagementTips:"Chế độ chuyển tiếp không dây có thể khiến chức năng quản lý của phụ huynh không hoạt động",
				wifiName:"Không dây Name",
				wifiPwd:"Mật khẩu không dây",
				ssidSynchronizationFailed:"Đồng bộ hóa ssid không thành công, vui lòng thử lại sau",
				wifiPwdChecking:"Phát hiện mật khẩu",
				wifiPwdCheckSuccess:"Mật khẩu khớp thành công",
				wifiPwdCheckError:"Mật khẩu sai, vui lòng nhập lại",
				routerDesc:"Trong chế độ này, router có thể cung cấp truy cập Internet cho nhiều thiết bị có dây và không dây. Mô hình này là phổ biến nhất.",
				apDesc:"Trong chế độ này, router thay đổi mạng có dây hiện có thành mạng không dây.",
				repeaterDesc:"Trong chế độ này, router tăng cường vùng phủ sóng không dây hiện có trong nhà của bạn.",
				wispDesc:"Chia sẻ kết nối Internet tại bất kỳ vị trí Wi-Fi công cộng nào hiện có. Ví dụ: khách sạn, hội chợ thương mại.",
			},
			select:{
				wlan_mode:[
					{value:"2", 	txt:"Chế độ Router"},
					{value:"3", 	txt:"Chế độ cầu nối"},
					{value:"1", 	txt:"Chuyển tiếp không dây（Repeater）"},
					{value:"0", 	txt:"WISP"}
				]
			},
			button:{
				"btn-refresh":"Quét Wi-Fi",
				"btn-link":"Kết nối"
			}
		},
		restart_regularly:{
			html:{
				"f-label":["Khởi động lại đúng giờ","Thời gian đóng cửa","Ngày đóng cửa"],
				"active":["Ngày", "một", "hai", "ba", "bốn", "năm", "sáu."],
			},
		},
		wps:{
			html:{
				"f-label":["WPS","Mã PIN"],
				"input_pin_button":"Tạo mã PIN mới"
			}
		},
		developer:{
			html:{
				
				"f-label":["Giá trị van chia","Giá trị van RTS","Đầu khung","Khu vực mạng không dây","Chế độ tập hợp khung","UPnP","Tăng tốc phần cứng"],
				"tipsText":["Cẩn thận thay đổi! Hãy chắc chắn rằng lựa chọn của bạn đáp ứng các yêu cầu pháp lý địa phương!"]
			},
			select:{
				
				wireless_preamble_2g_sel:[
					{value:"0", 	txt:"Khung dài"},
					{value:"1", 	txt:"Khung ngắn"}
				],
				wireless_Network_area:[
					{value:"1", 	txt:"Trung Quốc"},
					{value:"2", 	txt:"Hoa Kỳ"},
					{value:"3", 	txt:"Châu Âu"},
					{value:"4", 	txt:"Nga"},
					{value:"5", 	txt:"Việt Nam"},
					{value:"6", 	txt:"Việt Nam"},
				]
			}
		},
		pptp_client:{
			html:{
				"tab-item":["Thiết lập máy khách PPTP","Trạng thái khách hàng PPTP"],
				"f-label":["Trạng thái khởi động","Địa chỉ máy chủ","Cổng máy chủ","Tên người dùng","Mật khẩu","Lưu lượng truy cập cục bộ có đi VPN hay không","Mở mã hóa"],
				"title":["Danh sách thiết lập máy khách PPTP","Danh sách trạng thái khách hàng PPTP"],
				"prompt_text":["(Có thể nhập tên miền và địa chỉ IP)"]
			},
			js:{
				"table_title":["Số sê-ri","Trạng thái","Địa chỉ máy chủ","Cổng","Tên người dùng","Mật khẩu","Hoạt động"],
				"txt":["Sửa đổi","Xoá","Xóa thành công","Sửa đổi thành công","Phân đoạn mạng IP","Máy đơn"],
				"table_title_state":["Số sê-ri","Tên người dùng","Trạng thái kết nối","Địa chỉ IP cục bộ","Địa chỉ IP","Hoạt động"],
			},
			
		},
		l2tp_client:{
			html:{
				"tab-item":["Cài đặt máy khách L2TP","Trạng thái khách hàng L2TP"],
				"f-label":["Trạng thái khởi động","Địa chỉ máy chủ","Tên người dùng","Mật khẩu","Lưu lượng truy cập cục bộ có đi VPN hay không"],
				"title":["Danh sách thiết lập khách hàng L2TP","Danh sách trạng thái máy khách L2TP"],
				"prompt_text":["(Có thể nhập tên miền và địa chỉ IP)"]
			},
			js:{
				"table_title":["Số sê-ri","Trạng thái","Địa chỉ máy chủ","Tên người dùng","Mật khẩu","Hoạt động"],
				"txt":["Sửa đổi","Xoá","Xóa thành công","Sửa đổi thành công","Phân đoạn mạng IP","Máy đơn"],
				"table_title_state":["Số sê-ri","Tên người dùng","Trạng thái kết nối","Địa chỉ IP cục bộ","Địa chỉ IP","Hoạt động"],
			},
			
		},
		access_control:{
			html:{
				"f-label":["Tên thiết bị","Cách lập lịch","Ngày","Thời gian","Thời gian",
				"Giao thức","Tên","Chế độ","Nguồn IP","Cổng nguồn","Mục đích IP","Cổng đích","Cách lập lịch",
					"Địa chỉ URL","Cách lập lịch","Lọc URL","Chế độ lọc"],
					
				"tab-item":["Lọc MAC","Lọc cổng","Lọc URL"],
				"active":["Ngày", "một", "hai", "ba", "bốn", "năm", "sáu."],
				
				"title":["Kiểm soát truy cập"],
				"tip-sec":["Nếu bạn chọn chế độ danh sách trắng, trước tiên hãy thêm địa chỉ MAC gốc, nếu không bạn sẽ không thể truy cập mạng bình thường."],
				"tab-item-a":["Lọc MAC","Lọc cổng","Lọc URL"],
				"modal-title":"Thêm quy tắc",
				"title":["Danh sách","Danh sách","Danh sách"],
				"f-lbl-text":["Khi","Phân chia","Khi","Phân chia"],
				"day":["Một", "hai", "ba", "bốn", "năm", "sáu", "ngày"],
				
					
			},
			js:{
				"table-title":["Số sê-ri","Tên thiết bị","Thông tin mạng","Loại chương trình","Thời gian","Hoạt động"],
				"table-title_2":["Số sê-ri","Tên thiết bị","IP","MAC","Chọn"],
				"txt":["Mở","Đóng cửa","Chỉnh sửa","Xoá","Hàng ngày","Hiển thị thiết bị ngoại tuyến"],
				sec_title:["Danh sách trắng","Danh sách"],
				mac_tab_title:["Địa chỉ MAC","Loại chương trình","Thời gian","Hoạt động"],
				port_tab_title:["Tên","Giao thức","Nguồn IP","Cổng nguồn","Mục đích IP","Cổng đích","Loại chương trình","Thời gian","Hoạt động"],
				url_tab_title:["Địa chỉ URL","Loại chương trình","Thời gian","Hoạt động"],
				accept:"Cho phép",
				drop:"Từ chối",
				add:"Mới",
				copywriting:["Chủ Nhật","Thứ hai","Thứ ba","Thứ Tư","Thứ năm","Thứ sáu","Thứ bảy",'Hàng ngày','Luôn luôn','Đóng cửa'],	
				day_name:["Một", "hai", "ba", "bốn", "năm", "sáu", "ngày",],
				time:"Thời gian",
				data_name:"Ngày",
				start_time:"Thời gian bắt đầu",
				end_time:"Thời gian kết thúc",
				min:"Khi",
				sec:"Phân chia",
				"day_not_null":"Vui lòng chọn ít nhất một ngày",
				"time_equal":"Thời gian bắt đầu không thể bằng thời gian kết thúc",
				"endLtStart":"Thời gian kết thúc không được nhỏ hơn thời gian",
			},
			select:{
				mac_schedulesType:[
					{value:"0", txt:"Luôn luôn"},
					{value:"1", txt:"Khoảng thời gian"},
					{value:"2", txt:"Đóng cửa"}
				],
				proto:[
					{value:"TCP", 	txt:"TCP"},
					{value:"UDP", 	txt:"UDP"},
					{value:"TCPUDP", 	txt:"TCP+UDP"},
					{value:"ICMP", 	txt:"ICMP"},
					{value:"ANY", 	txt:"ANY"}
				],
				mode:[
					{value:"drop", 	txt:"Từ chối"},
					{value:"accept", 	txt:"Cho phép"}
				],
				mac_schedulesType:[
					{value:"0", txt:"Luôn luôn"},
					{value:"1", txt:"Khoảng thời gian"},
					{value:"2", txt:"Đóng cửa"}
				],
				port_schedulesType:[
					{value:"0", txt:"Luôn luôn"},
					{value:"1", txt:"Khoảng thời gian"},
					{value:"2", txt:"Đóng cửa"}
				],
				url_schedulesType:[
					{value:"0", txt:"Luôn luôn"},
					{value:"1", txt:"Khoảng thời gian"},
					{value:"2", txt:"Đóng cửa"}
				],
			}
		},
		policy_routing:{
			html:{
				"f-label":["Tên quy tắc","Ưu tiên","Máy chủ nguồn","Địa chỉ IP","Mặt nạ mạng con","Máy chủ đích","Địa chỉ IP","Mặt nạ mạng con","Tên miền","Xuất khẩu"],
				"tishi":["Số càng nhỏ thì ưu tiên càng cao."],
			},
			js:{
				"title_txt":["Vui lòng nhập ưu tiên","Vui lòng nhập số từ 0-32767","Vui lòng nhập ưu tiên chính xác","Vui lòng chọn lối ra","Ưu tiên hiện có"],
				"table_title":["Số sê-ri","Tên quy tắc","Ưu tiên","Máy chủ nguồn","Máy chủ đích","Xuất khẩu","Hoạt động"],
				"txt":["Sửa đổi","Xoá","Xóa thành công","Sửa đổi thành công"],
			},
			select:{	
				wan_host_flag:[
					{value:"all", txt:"Tất cả Hosting"},
					{value:"sub_host", txt:"Máy chủ Subnet"},
					{value:"dns", txt:"Tên miền DNS"},
				],
				lan_host_flag:[
					{value:"all", txt:"Tất cả Hosting"},
					{value:"sub_host", txt:"Máy chủ Subnet"},
				],
				
			},
		},
		static_routing:{
			html:{
				"f-label":["Loại","Địa chỉ đích","Mặt nạ","Cổng"],
			},
			js:{
				"table_title":["Số sê-ri","Loại","Địa chỉ đích","Mặt nạ","Cổng","Hoạt động"],
				"txt":["Sửa đổi","Xoá","Xóa thành công","Sửa đổi thành công","Phân đoạn mạng IP","Máy đơn"],
			},
			select:{	
				static_flag:[
					{value:"NET", txt:"Phân đoạn mạng IP"},
					{value:"HOST", txt:"Máy đơn"},
				],
			},
		},
		iptv:{
			html:{
			
				"f-label":["Trạng thái IPTV","IGMP snooping","IGMP proxy",
				"Cổng IPTV","VLAN ID của Internet","Ưu tiên VLAN","IPTV的VLAN ID","Ưu tiên IPTV","VLAN ID của điện thoại IP","Ưu tiên điện thoại IP","Thiết lập cổng","LAN1","LAN2","LAN3","LAN4"],
				"prompt_text":["(Điền 0-4094, 0 có nghĩa là đóng)","(Điền 0-4094, 0 có nghĩa là đóng)","(Điền 0-4094, 0 có nghĩa là đóng)"],
				'tipsText':["Cầu cổng IPTV được chỉ định vào cổng WAN"]
			},
			select:{	
				iptv_table:[
					{value:"off", txt:"Đóng cửa"},
					{value:"bridge", txt:"Cầu nối"},
					{value:"vlan", txt:"VLAN"}
				],
				port_iptv:[
					
					{value:"1", 	txt:"LAN1"},
					{value:"1,2", 	txt:"LAN1 Và LAN2"}
					
				],
				vlan_priority:[
					{value:"0", 	txt:"0"},
					{value:"1", 	txt:"1"},
					{value:"2", 	txt:"2"},
					{value:"3", 	txt:"3"},
					{value:"4", 	txt:"4"},
					{value:"5", 	txt:"5"},
					{value:"6", 	txt:"6"},
					{value:"7", 	txt:"7"},
				],
				iptv_priority:[
					{value:"0", 	txt:"0"},
					{value:"1", 	txt:"1"},
					{value:"2", 	txt:"2"},
					{value:"3", 	txt:"3"},
					{value:"4", 	txt:"4"},
					{value:"5", 	txt:"5"},
					{value:"6", 	txt:"6"},
					{value:"7", 	txt:"7"},
				],
				ip_phone_priority:[
					{value:"0", 	txt:"0"},
					{value:"1", 	txt:"1"},
					{value:"2", 	txt:"2"},
					{value:"3", 	txt:"3"},
					{value:"4", 	txt:"4"},
					{value:"5", 	txt:"5"},
					{value:"6", 	txt:"6"},
					{value:"7", 	txt:"7"},
				],
				
				select_lan1:[
					{value:"vlan_lan", 	txt:"Internet"},
					{value:"vlan_iptv", 	txt:"IPTV"},
					{value:"vlan_voip", 	txt:"Điện thoại IP"},
				],
				select_lan2:[
					{value:"vlan_lan", 	txt:"Internet"},
					{value:"vlan_iptv", 	txt:"IPTV"},
					{value:"vlan_voip", 	txt:"Điện thoại IP"},
				],
				select_lan3:[
					{value:"vlan_lan", 	txt:"Internet"},
					{value:"vlan_iptv", 	txt:"IPTV"},
					{value:"vlan_voip", 	txt:"Điện thoại IP"},
				],
				select_lan4:[
					{value:"vlan_lan", 	txt:"Internet"},
					{value:"vlan_iptv", 	txt:"IPTV"},
					{value:"vlan_voip", 	txt:"Điện thoại IP"},
				],
			}
		},
		signal_conditioning:{
			html:{
				"current_bt":["Chế độ tiết kiệm năng lượng","Chế độ chung","Mô hình xuyên tường"]
			}
		},
		timeSetting:{
			html:{
				"f-label":["Thời gian hệ thống hiện tại","Cách lấy thời gian hệ thống","Múi giờ","Danh sách máy chủ","Ngày","Thời gian"],
				"f-lbl-text":["Ngày", "tháng", "ngày","Khi","Phân chia","Giây"],
				"radio-txt":["NTP (có sẵn trực tuyến)","Cấu hình thủ công"],
				"domain_name_txt":["Tên miền"]
			},
			select:{			
				time_zone_sel:[
					{value:"-14", 	txt:"(GMT+14:00)Quần đảo Lane"},
					{value:"-13", 	txt:"(GMT+13:00)Quần đảo Phoenix"},
					{value:"-12:45", 	txt:"(GMT+12:45)Quần đảo Chatamu"},
					{value:"-12", 	txt:"(GMT+12:00)Việt"},
					{value:"-11", 	txt:"(GMT+11:00)Mật ong"},
					{value:"-10:30", 	txt:"(GMT+10:30)Quần đảo Lord Howe"},
					{value:"-10", 	txt:"(GMT+10:00)Canberra"},
					{value:"-9:30", 	txt:"(GMT+09:30)Trung Úc"},
					{value:"-9", 	txt:"(GMT+09:00)Việt Nam"},
					{value:"-8", 	txt:"(GMT+08:00)Bắc Kinh"},
					{value:"-7", 	txt:"(GMT+07:00)Viet Nam"},
					{value:"-6:30", 	txt:"(GMT+06:30)Miến Điện"},
					{value:"-6", 	txt:"(GMT+06:00)Viet Nam"},
					{value:"-5:45", 	txt:"(GMT+05:45)Nepal"},
					{value:"-5:30", 	txt:"(GMT+05:30)Ấn độ"},
					{value:"-5", 	txt:"(GMT+05:00)Islamabad"},
					{value:"-4:30", 	txt:"(GMT+04:30)Afghanistan"},
					{value:"-4", 	txt:"(GMT+04:00)Abu Dhabi"},
					{value:"-3:30", 	txt:"(GMT+03:30)Iran"},
					{value:"-3", 	txt:"(GMT+03:00)Việt Nam"},
					{value:"-2", 	txt:"(GMT+02:00)Viet Nam"},
					{value:"-1", 	txt:"(GMT+01:00)Việt Nam"},
					{value:"0", 	txt:"(GMT0)Luân Đôn"},
					{value:"1", 	txt:"(GMT-01:00)Punta Delgada"},
					{value:"2", 	txt:"(GMT-02:00)Việt Nam"},
					{value:"3", 	txt:"(GMT-03:00)Viet Nam"},
					{value:"3:30", 	txt:"(GMT-03:30)Đảo Newfoundland"},
					{value:"4", 	txt:"(GMT-04:00)Caracas"},
					{value:"5", 	txt:"(GMT-05:00)Thành phố New York"},
					{value:"6", 	txt:"(GMT-06:00)Thành phố Mexico"},
					{value:"7", 	txt:"(GMT-07:00)Thành phố Salt Lake"},
					{value:"8", 	txt:"(GMT-08:00)Việt Nam"},
					{value:"9", 	txt:"(GMT-09:00)Juno"},
					{value:"9:30", 	txt:"(GMT-09:30)Quần đảo Maxas"},
					{value:"10", txt:"(GMT-10:00)Honolulu"},
					{value:"11", txt:"(GMT-11:00)Đảo Midway"},
					{value:"12", txt:"(GMT-12:00)Majuro"}
				]
			}
		},
		dial_up_log:{
			html:{
				title:"Nhật ký quay số"
			}
		},
		captive_portal:{
			html:{
				"f-label":["Captive Portal Enable","ISP","NAS ID","UAM SECERT","Lựa chọn giao diện",
				"Local Network","Captive Portal URL","UAM Server","UAM Secret","RADIUS server 1","RADIUS server 2","RADIUS Secret","RADIUS NAS ID","RADIUS location name","RADUS location lD",
				"Preferred DNS","Alternate DNS","Leasetime","CoA Port","UAM Allowed","UAM Domain",
	"Danh sách trắng thiết bị","","Tên thiết bị","MAC","Tên thiết bị"],
				"routing-mode":["Chọn thiết bị trực tuyến","Thêm thiết bị bằng tay"],
				"prompt_text":"Khi bật, các thiết bị được thêm vào danh sách trắng sẽ không cần chứng nhận Captive Portal (hỗ trợ tối đa 32 thiết bị).",
				"title":"Danh sách",
				"tipsText":"Mẹo: Danh sách trắng mới cần khởi động lại WiFi hoặc kết nối lại",
				"f-label-title":["SSID chính","SSID khách"],
				"portal_optional":"（Tùy chọn）",
				"portal_time":"(Giờ)"
			},
			select:{	
				isp:[
					{value:"wifisystem", 	txt:"WIFISYSTEM"},
					{value:"hotspotsystem", 	txt:"HOTSPOTSYSTEM"},
				]
			},
			js:{
				"add_button":["Thêm thiết bị","Tên thiết bị","MAC"],
				"device_whitelist_table":["<input type='checkbox' name='checkboxShall'  value='0' class='checkboxShall select_all'>Chọn tất cả","Tên thiết bị","MAC"],
			"devices_online_table":["<input type='checkbox' name='checkboxShall'  value='0' class='checkboxShall select_all'>Chọn tất cả","Giao diện","Tên thiết bị","MAC"],
						
			},
		},
		changePassword:{
			html:{
				"f-label":["Mật khẩu mới","Xác nhận mật khẩu"],
				"tip-sec":"Quản lý mật khẩu được sử dụng để đăng nhập vào router, hãy giữ mật khẩu của bạn an toàn!"
			}
		},
		factory_settings:{
			html:{
				"tip-sec":"Tất cả các thông số cấu hình mà router đã lưu sẽ bị xóa, khôi phục lại router về trạng thái ban đầu. Bạn sẽ cần phải thiết lập lại để truy cập mạng",
				"reset_tip":"Bộ định tuyến đang khởi động lại, xin vui lòng không tắt nguồn, vui lòng chờ..."
			}
		},
		restart_router:{
			html:{
				"tip-sec":"Hệ thống router sẽ khởi động lại ngay lập tức",
				"reset_tip":"Bộ định tuyến đang khởi động lại, xin vui lòng không tắt nguồn, vui lòng chờ..."
			}
		},
		network_firewall:{
			html:{
				"tab-item":["Liên kết IP/MAC","Giám sát ARP"],
				"monitor_ip_title":["Liên kết IP/MAC","ARP tấn công phòng thủ","Danh sách ràng buộc IP/MAC","Giám sát ARP"],
			
				"prompt_text":["(Tùy chọn)","Gói/giây","(1~10)"],
				"arp_information":["Tất cả thông tin ARP","Thông tin ARP mạng nội bộ","Thông tin APR ngoài mạng"],
				"checkbox_lb":["(Đề nghị chỉ bật khi có giả mạo ARP trong mạng nội bộ)"],
				"f-label":["Địa chỉ IP","Địa chỉ MAC","Ghi chú","Giao diện","ARP tấn công phòng thủ","Phát sóng ARP miễn phí","Ngăn chặn IP/MAC bị đánh cắp"],
				
			},
			js:{
				"table-title-ip":["Số sê-ri","Địa chỉ IP","Địa chỉ MAC","Nguồn Rule","Giao diện","Ghi chú","Hoạt động"],
				"arp_table_thead":["Số sê-ri","Tên máy","Địa chỉ IP","Địa chỉ MAC","Loại","Giao diện","Trạng thái","Hoạt động"],
				"txt":["Chỉnh sửa","Xoá","Thêm bằng tay","Xóa thành công","Sửa đổi thành công","Tĩnh","Động","Không ràng buộc","Bị ràng buộc","Ràng buộc","cởi trói","Không rõ"],
			},
			select:{
				firewall_interface:[
					{value:"LAN", txt:"LAN"},
				],
			}
		},
		mesh_pair:{
			html:{
				"tab-item":["Tô pô Mesh","Cặp đôi Mesh"],
				"title_h4":["Tìm kiếm Mesh Network",
							"Không có mạng Mesh",
							"Vui lòng chọn cách thêm nút Mesh mới","Lưu ý: Các thiết bị nút cần phải được thực hiện trong trạng thái khởi tạo","Đặt nút ở vị trí thích hợp",
							"Cố gắng đặt ở nơi trống trải nhất có thể.","Cố gắng tránh các thiết bị điện lớn và giảm nhiễu",
							"Bật thiết bị nút mới và chờ đèn báo hệ thống bật",
							"Nhấn nút WPS của thiết bị nút và chờ ghép nối mạng","Nhấn nút WPS cho các thiết bị cổng và nút cùng một lúc, chờ ghép nối mạng",
							"Đang tìm nút mới, vui lòng chờ <span id=\"countDown\">120</span>","Thêm nút mới thành công","Không tìm thấy nút mới, có thể là do",
							"1. Thiết bị nút mới không được cấp nguồn<br/>2. Không nhấn nút WPS cho nút mới<br/>3. Vui lòng đặt thiết bị nút gần cổng thử lại",
							"1. Thiết bị nút mới không được cấp nguồn<br/>2. Vui lòng đặt thiết bị nút gần cổng thử lại",
							"Dùng dây mạng. <span class=\"tipsText\">Cổng LAN cho thiết bị cổng</span> Và <span class=\"tipsText\">Cổng WAN của thiết bị Node</span> Kết nối",
							"Tìm kiếm Mesh Network",
							"Không có mạng Mesh",],
				"modal-title":["Thay đổi tên thiết bị","Danh sách thiết bị"],
				"prompt_text":"Xem phương pháp Mesh",
					"f-label":"Tên thiết bị"
			},
			select:{	
				wps_mesh_select:[
					{value:"0", txt:"Thêm nút Mesh mới thông qua nút WPS"},
					{value:"1", txt:"Thêm nút Mesh mới thông qua kết nối có dây"},
					
				],
				wps_second_choice:[
					{value:"0", txt:"Chỉ nhấn nút WPS của nút"},
					{value:"1", txt:"Nhấn nút WPS cho cả Gateway và Node"},
				],
				deviceRole:[
					{value:"0", txt:"Tự động"},
					{value:"1", txt:"Đường chính(Controller)"},
					{value:"2", txt:"Đường con(Agent)"},
				],
				mesh_prio:[
					{value:"5G/2.4G", txt:"5G/2.4G"},
					{value:"5G", txt:"Chỉ 5G"},
					{value:"2.4G", txt:"Chỉ 2.4G"},
				],
			},
			js:{
				node:["Cổng","Nút"],
				view_more:"Thêm thiết bị",
				link_mode:["Có dây", "Không dây"],
				current_role:["Nhận dạng......","Đường dẫn chính (Controller)","Con đường (Agent)"],
				tab_title:["Tên thiết bị","MAC","Cách kết nối", "cường độ tín hiệu","Hoạt động"],
				name_not_null:"Tên thiết bị không được để trống"
			}
		},
		speed_test:{
		   html:{
			   	speed_unit:"Mbps",
				speed_testing:"Trong đo tốc độ......",
				name:["Ping","Rung động"],
				speed_txt:["Tải về","Tải lên"],
			   	btn:["Tốc độ ngay lập tức","Tốc độ"],
				"modal-title":"Chọn Server",
				privacy_link:"Chính sách bảo mật"
			},
		   js:{
			"table-title":["Địa chỉ máy chủ","Thời gian đo tốc độ","Tốc độ tải xuống/Tốc độ tải lên","Ping/Rung động"],
			"getting_list":"Danh sách máy chủ……",
			"get_list_error":"Nhận thất bại, vui lòng thử lại",
			"testErr":"Tốc độ thất bại",
			"privacy":"GoDaddy có thể thu thập một số dữ liệu nhận dạng nhất định, chẳng hạn như địa chỉ IP của bạn, trong quá trình thử nghiệm và có thể chia sẻ dữ liệu này với các bên thứ ba được chọn. Để biết thêm thông tin về nội dung được thu thập và cách chúng được chia sẻ, hãy xem của chúng tôi<a href='//www.speedtest.net/privacy'>Chính sách bảo mật</a>。"
		   }
		},
		wisp:{
			html:{
				"f-label":["Chuyển tiếp không dây","Truy cập SSID","Trạng thái kết nối","Tên mạng không dây (SSID)","Mật khẩu mạng không dây"],
				"tip-sec":"Chức năng Mesh được bật và không thể bật chuyển tiếp không dây cùng một lúc",
				"title":["Wireless Network Relay thành công","Lỗi chuyển tiếp mạng không dây"],
				"modal-title":"Thiết lập chuyển tiếp không dây",
				"describe":["Nếu bạn đang sử dụng mạng không dây để truy cập bộ định tuyến","Vui lòng kết nối bằng tay<span id=\"link-info\"></span>Mạng không dây."],
				"suggestion":"Hãy thử những cách sau:：",
				"err_des":["Kiểm tra xem mật khẩu cấp trên có được nhập chính xác không","Vui lòng kiểm tra khoảng cách không dây quá dài và tín hiệu quá kém","Vui lòng kiểm tra xem thiết bị mẹ có hoạt động tốt không"]
			},
			js:{
				linkStatus:{
					"LinkOK":"Kết nối thành công",
					"Linking":"Kết nối……",
					"LinkFail":"Lỗi kết nối",
					"NotLink":"Chưa kết nối"
				},
				create:"Tạo AP không dây thành công",
				extend:"Mở rộng mạng không dây thành công",
				ap_ssid_2G:"SSID(2.4GHz)",
				ap_ssid_5G:"SSID(5GHz)",
				repeater_ssid_2G:"Bộ mở rộng không dây Name(2.4GHz)",
				repeater_ssid_5G:"Bộ mở rộng không dây Name(5GHz)",
				hiddenSSID:"Mạng ẩn",
				link:"Kết nối",
				linked:"Đã kết nối",
				tabTitle:["Không dây Name","Mã hóa","Cường độ tín hiệu","Hoạt động"],
				searching:"Tìm kiếm tín hiệu",
				extending:"Đang mở rộng tín hiệu, vui lòng chờ",
				extendSuc:"Mở rộng tín hiệu thành công",
				extendErr:"Mật khẩu mạng không dây cấp trên sai, vui lòng nhập lại",
				wifiInfo:"Thông tin mạng không dây cao hơn",
				ssidInfo:"Sẽ mở rộng cho bạn<span id=\"ssid-name-wrapper\">'<b id=\"ssid-name\"></b>'</span>Mạng không dây.",
				extendWifiInfo:"Thông tin mạng không dây mở rộng",
				wifiPwd:"Mật khẩu mạng không dây",
				wifiName:"Mạng không dây Name",
				wifi2GName:"2.4GHz Mạng lưới Name",
				wifi5GName:"5GHz Mạng lưới Name",
				isSame:"Mật khẩu giống như mạng không dây cấp cao hơn",
				isHand:"Thiết lập thủ công",
				wpa3NotSupport:"WPA3 không hỗ trợ",
				wepNotSupport:"WEP không hỗ trợ"
			},
			button:{
				"btn-refresh":"Quét Wi-Fi",
				"btn-link":"Kết nối"
			}
		},
		openvpn_server:{
			html:{
				"title":["OpenVPN","Chứng nhận","Hồ sơ"],
				"tab-item-a":["Thiết lập máy chủ OpenVPN","Kết nối OpenVPN"],
				"f-label":["OpenVPN","Loại dịch vụ","Cổng dịch vụ","Mạng con VPN","Mặt nạ mạng con","Truy cập khách hàng"]
			},
			js:{
				"enableFail":"Máy khách đã được bật, cho phép máy chủ không thành công",
				"export-status":["Đang xuất tập tin","Xuất thất bại"],
				"rsa—status":["Giấy chứng nhận đang được tạo, vui lòng để sau...","Tạo chứng nhận thành công","Lỗi tạo chứng nhận"],
				"table-title": ["IP từ xa", "Phân bổ IP"]
			},
			select:{
				openvpn_server_type:[
					{value:"udp", txt:"UDP"},
					{value:"tcp", txt:"TCP"}				
				],
				openvpn_server_internet:[
					{value:"1", txt:"Internet và mạng gia đình"},
					{value:"0", txt:"Chỉ mạng gia đình"}
				]
			}
		},
		openvpn_client:{
			html:{
				"title":"Danh sách máy chủ",
				"modal-title":"Thêm hồ sơ",
				"f-label":["Mô tả","Tên người dùng","Mật khẩu","Máy chủ IP/Tên miền","Hồ sơ"],
				"view":"Duyệt"
			},
			js:{
				"itemExist":"Khách hàng này đã tồn tại",
				"enableFail":"Máy chủ được bật, cho phép khách hàng thất bại",
				"table-title":["Mô tả","Trạng thái","Bật hay không","Hoạt động"],
				"upload-status":["Lỗi hồ sơ","Tải lên không thành công","Hồ sơ không thể để trống"],
				"connect-status":["Chưa kết nối","Đã kết nối","Kết nối……"],
				"add":"Mới"
			}
		},
		wireguard_server: {
			html: {
				"title": ["Wireguard","Cấu hình máy phục vụ","Cấu hình xuất", "Danh sách khách hàng"],
				"f-label": ["Wireguard", "Địa chỉ giao diện", "Cổng", "Khóa công khai", "Truy cập mạng", "Mô tả", "Khóa công khai", "Địa chỉ giao diện"],
				"generate_key": "Tạo khóa",
				"modal-title": "Danh sách khách hàng mới",
				"optional_text": "(Tùy chọn)",
				"copy_key":"Sao chép"
			},
			js: {
				"enableFail": "Máy khách đã được bật, cho phép máy chủ không thành công",
				"keyAlreadyExist":"public key đã tồn tại",
				"clientReachMax":"Số lượng khách hàng đã đạt đến giới hạn",
				"add": "Mới",
				"table-title": ["Mô tả/Public Key", "Địa chỉ giao diện", "Статистика скорости", "Hoạt động"]
			},
			select: {
				access: [
					{ value: "2", txt: "Интернет" },
					{ value: "0", txt: "Семейные сети" },
					{ value: "1", txt: "Интернет и семейные сети" }
				]
			}
		},
		wireguard_client: {
			html: {
				"title": ["Wireguard","Импорт конфигурации","Настройка клиента", "Параметры сервера"],
				"f-label": ["Wireguard", "Файл конфигурации","Адрес интерфейса", "Открытый ключ", "Разрешить доступ к адресам", "Порт", "Сетевой адрес", "Открытый ключ"],
				"generate_key": "Tạo khóa",
				"view":"Просмотр",
				"copy_key":"Копирование"
			},
			js: {
				"enableFail": "Открыт сервер, что делает возможным сбой клиента"
			},
			select: {
				allowed_ips: [
					{ value: "0", txt: "Все" },
					{ value: "1", txt: "Пользовательские настройки" }
				]
			}

		},
		network_4g:{
			html:{
				"tab-item-a":["Настройки сети 4G","Состояние сети 4G"],
				"f-label":["Сеть 4G","Код PIN","Остаточное число PIN - кода","APN","3G UMTS","4G LTE","",
							"Оператор","Сила сигнала","Состояние SIM - карты","IMEI","IMSI","Trạng thái kết nối","Тип сети","Địa chỉ IP","Предпочтительный DNS","DNS dự phòng","Địa chỉ MAC",
							"MCC","MNC","RSRQ","RSRP","RSRP","EARFCN","EARFCN","PCI","PSC","RAC","SINR","ECIO","CELLID","SMSC","BANDA",
							],
				"band_name":["Band 1","Band 8","Band 1","Band 3","Band 7","Band 8","Band 20","Band 38","Band 40","Band 41",],
				"3g_band8_ti":["Выберите хотя бы один 3G диапазон."],
				"4g_band8_ti":["Выберите хотя бы один 4G диапазон."],
			}
		},
		network_mode_4g:{
			html:{
				"f-label":["Сетевой режим","Мобильная сеть"],
			},
			select:{
				mode3g4gonly:[
					{value:"0", 	txt:"Автоматический"},
					{value:"2", 	txt:"3G"},
					{value:"3", 	txt:"4G"}
				],
				usb3gOperManual:[
					{value:"0", 	txt:"Автоматический"},
					{value:"1", 	txt:"Ручной"}
				]
			},
			js:{
				"table_title":["ID","Операторы","MCC/MNC","Скорость","Trạng thái","Hoạt động"],
				"label-title":["Операция позже, обрабатывается в SMS...","Cho phép","Поиск....","Поиск удался"],
				"btn":["Запуск проверки","Отменить роуминг","Подключение"]
			}
		},
		sms:{
			html:{
				"tab-item-a":["Почтовый ящик","Отправительный ящик","Коробка для черновиков"],
				"modal-title":"СМС",
				"title":["Почтовый ящик<span id='Message_index'></span>","Отправительный ящик","Коробка для черновиков"],
				"f-label":["Адресат", "содержимое", "SMS статус", "отправитель", "получатель", "содержимое","Ngày","Адресат", "Отправитель","Ngày","Nội dung"]
			},
		
			js:{
				"table-title":["ID","Trạng thái tin nhắn","Người gửi","Nội dung","Ngày","Hoạt động"],
				"outbox-table-title":["ID","Người nhận","Nội dung","Ngày","Hoạt động"],
				"add":"Mới",
				"sms_status":["Chưa đọc","Đã đọc","Người nhận","Nội dung","Đang gửi...","Gửi thành công","Gửi thất bại","Gửi","Chi tiết"],
				"hint_language":["Nội dung không được vượt quá 153 ký tự","Thu thập tin nhắn SMS"]
				
			}
		},
		vpn:{
			html:{
				"f-label":["Chuyển PPTP","L2TP Chuyển","IPSEC chuyển","Chuyển SIP"],
			},
		
			
		},
    },
	//js文件中打印出来的文字 错误提示 菜单
	JS:{
		"CIDRFormatInvalid": "Định dạng CIDR không chính xác",
		"PrefixLengthShouldBeNumber": "Độ dài tiền tố phải là số",
		"PrefixLengthRangeInvalid": "Độ dài tiền tố phải từ 0 đến 32",
		"Base64CharacterSetInvalid": "Mã hóa Base64 chỉ cho phép chữ cái (chữ hoa chữ thường), số,`+`、`/` Và `=`",
		"Base64LengthInvalid": "Độ dài của chuỗi Base64 phải là bội số của 4。",
		"Base64PaddingInvalid": "Ký hiệu điền'='cho chuỗi Base64 không được vượt quá hai.",
		"PublicKeyFormatInvalid": "Định dạng khóa công khai không chính xác",
		"copy_suc":"Sao chép thành công",
		"copy_err":"Sao chép thất bại, vui lòng sao chép bằng tay!",
    	on_line:"Trực tuyến",
		offline:"Ngoại tuyến",
		//
    add:"Mới thêm",
		jump_page:"Nhảy đến số trang đã xác định",
		select_all_page:"Chọn tất cả trang này",
		copywriting:"Đã cấu hình",
		copywriting_no:"Chưa cấu hình",
    wireless_terminal_list:"Danh sách thiết bị đầu cuối không dây",
		wireless_terminal:"Thiết bị đầu cuối không dây",
		networking_equipment:"Thiết bị kết nối",
		host_list:"Danh sách máy chủ Internet",
		t_bridge:"Chế độ cầu",
		t_routing:"Chế độ định tuyến",
		input_range:"Vui lòng nhập phạm vi chính xác",
		day_not_null:"Vui lòng chọn ít nhất một ngày",
		time_equal:"Thời gian bắt đầu không thể bằng thời gian kết thúc",
		endLtStart:"Thời gian kết thúc không được nhỏ hơn thời gian bắt đầu",
		interface_bound:"Giao diện bị ràng buộc",
		pageInit:"Đang tải……",
		paramGetErr:"Lỗi lấy tham số",
		netErr:"Kết nối mạng không thành công",
		errCode:"Mã lỗi:",
		errInfo:"Nội dung sai:",
		data_already_exists:"Dữ liệu đã tồn tại",
		add_err:"Lỗi thêm",
		add_suc: "Thêm thành công",
		del_err:"Lỗi xóa",
		del_suc:"Xóa thành công",
		modify_err:"Sửa đổi thất bại",
		modify_suc: "Sửa đổi thành công",
		log_null:"Tên người dùng hoặc mật khẩu trống, vui lòng thử lại",
		log_title:"Tên người dùng hoặc mật khẩu sai, vui lòng thử lại",
		loginErr:"Số lần đăng nhập sai của bạn đã đạt đến ba lần và hệ thống sẽ bị trì hoãn để kiểm tra.",
		deleting:"Đang xoá...",
		unbinding:"Đang xoá...",
		unbinding_succeeded:"Cởi trói thành công",
		binding_succeeded:"Binding thành công",
		binding_error:"Liên kết thất bại",
		setting_succeeded:"Thiết lập thành công",
		binding:"Đang ràng buộc...",
    	timeout:"Hết giờ kết nối",
		pwd_not_strong_enough_2:"Quản lý mật khẩu yếu<br/>Mật khẩu được đề nghị có chiều dài ít nhất 8 chữ số, bao gồm số và chữ cái",
		pwd_not_strong_enough_3:"Quản lý mật khẩu yếu<br/>Mật khẩu được đề nghị có chiều dài ít nhất 8 chữ số, bao gồm số, chữ cái và ký tự đặc biệt",
    
		data_already_exists:"Dữ liệu này đã tồn tại",
		welcome_visit:"Vui lòng nhập lời chào mừng của bạn",
		block_the_current:"Không thể hack thiết bị hiện tại",
		no_internet:"Không kết nối mạng ngoài",
		all_wan:"Tất cả các giao diện mạng ngoài",
		reselect_wan_all:"Vui lòng chọn lại giao diện",
		parameters_normal:"Tham số bình thường", 
		unknown_status:"Trạng thái không rõ",
		without:"Không",
		disconnect:"Ngắt kết nối",
		connect:"Kết nối",
		operator:"Đài",
		line:"Dòng",
		wired_internet:"Dây",
		select_all_page:"Chọn trang này",
				wireless:"không dây",
		unknown_internet:"Không rõ", 
		password_error:"Mật khẩu sai",
		building:"Đang tạo...",
		medium_password:"Tối thiểu 8 ký tự Chữ hoa chữ thường, số và ký tự đặc biệt",
		time_cannot:"Thời gian kết thúc không bằng thời gian bắt đầu",
		generated_successfully:"Tạo thành công", 
		unable_set_IPv6:"Truy cập IPv4 L2TP hoặc PPTP, IPv6 không thể thiết lập",
		upgrade_options:"Chọn có bật nâng cấp khẩn cấp hay không",
		read_statement_title:"Vui lòng đồng ý với Thỏa thuận cấp phép phần mềm người dùng cuối",
		router:"Bộ định tuyến",
		welcome:"Chào mừng đến với",
		reseting:"Đang khởi tạo...",
		restarting:"Đang khởi động lại...",
		logining:"Đăng nhập...",
    loginFail:"Đăng nhập thất bại, vui lòng thử lại",
		channel_choosing:"Kênh tìm kiếm tốt nhất……",
		uploading_file:"Trong tập tin tải lên...",
		file_type_error:"Lỗi định dạng tập tin",
		file_upload_error:"Tải lên tập tin không thành công",
		file_upload_success:"Tải lên tập tin thành công",
		version_title1:"Bộ định tuyến của bạn là phiên bản mới nhất và không cần nâng cấp",
		version_title2:"Router của bạn có phiên bản mới để nâng cấp",
		version_checking:"Phát hiện phiên bản...",
		version_checking_success:"Phát hiện phiên bản thành công",
		version_checking_error:"Phát hiện phiên bản thất bại",
		vlan_id_out_range:"VLAN ID từ 2 đến 4094",
		prio_0_7:"Giá trị ưu tiên không được lớn hơn 7 hoặc nhỏ hơn 0",
		
		abnormal_file_format:"Định dạng tập tin bất thường, vui lòng tải lên tập tin chính xác!",
		file_size_exceed_tips:"Tập tin tối đa không được vượt quá 5M!",
		dynamic:"IP động",
		pppoe:"PPPoE",
		static_IP:"IP tĩnh",
		lbl_2_4_wifi:"2.4GHz Wi-Fi:",
		lbl_5_wifi:"5GHz Wi-Fi:",
		lbl_wifi:"Wi-Fi:",
		port_count_err:"Số lượng cổng nội bộ phải phù hợp với số lượng cổng bên ngoài",
		in_ip:"Địa chỉ IP phải là địa chỉ phân đoạn mạng LAN!",
		start_end_port:"Cổng khởi đầu không được lớn hơn cổng kết thúc",
		s_return:"Quay lại",
		edit:"Chỉnh sửa",
		modify:"Sửa đổi",
		s_delete:"Xoá",
		delete_list:"Xác nhận xóa mục nhập？",
		index:"Số sê-ri",
		mac_addr:"Địa chỉ MAC",
		ip_addr:"Địa chỉ IP",
		op:"Hoạt động",
		s_time:"Thời gian",
		s_event:"Mô tả sự kiện",	
		version:"Phiên bản",
		issuer:"Phát hành",
		app_intro:"Giới thiệu Plugin",
		app_info:"Thông tin bổ sung",
		maintainer:"Đài",
		comfirm_default:"Bạn có thực sự muốn khôi phục các tham số hệ thống về mặc định gốc không?",
		recover_param:"Trang này đang phục hồi các thông số!",
		comfirm_update:"Bạn có chắc chắn muốn nâng cấp hệ thống tập tin?？",
		uploading:"Trang đang được nâng cấp！",
		left:"Phần còn lại",
		cur_speed:"Tốc độ Internet hiện tại",
		comfirm_reboot:"Khởi động lại hệ thống ngay lập tức？",
		rebooting:"Trang đang khởi động lại！",
		wds:"Vô tuyến Universal Relay",
		ap_wds:"Điểm truy cập/Access Point",
		client:"Card mạng không dây",
		repeater:"Chuyển tiếp không dây",
		wait:"Chờ chút.",
		success:"Thành công",
		failure:"Thất bại",
		waiting:"Đang chờ",
		less_than:"Nhỏ hơn",
		year_ck:"Năm đầu vào phải là 1970-2033",
		year:"Năm",
		month:"Tháng",
		s_day:"Ngày",
		day:"Ngày",
		hour:"Giờ",
		minute:"phút",
		s_hour:"Khi",
		s_min:"Phân chia",
		second:"giây",
		time_segment:"Mở",
		connected:"Đã kết nối",
		not_connect:"Chưa kết nối",
		wan_ip:"Mạng ngoài IP",
		lan_ip:"IP mạng nội bộ",
		unknown_device:"Thiết bị lạ",
		unnamed_device:"Thiết bị không tên",
		enable:"Mở",
		closed:"Đóng cửa",
		safe:"Bảo mật",
		unprotect:"Bảo vệ không mở",
		protecting:"Bảo vệ",
		low:"Thấp",
		medium:"Giữa",
		high:"Cao",
		is_open:"Đã bật",
		is_close:"Đóng cửa",
		yours:"của bạn",
	  within:"Bên trong",
		
		work_mode:["Chế độ định tuyếnIP","Chế độ cầu nối"],
		lan_reboot:"Đang khởi động lại LAN, vui lòng để sau",
		lan_reboot_fin:"Khởi động lại hoàn tất",
		no_conn:"Mạng không dây hiện tại bị ngắt kết nối",
		use_wifi:"Nếu bạn đang sử dụng mạng không dây để truy cập bộ định tuyến",
		set_router:"Cấu hình bộ định tuyến",
		link_wifi:"Vui lòng kết nối bằng tay{{name}}Mạng không dây.",
		wifi_guide:"Tên và mật khẩu không dây Vui lòng tham khảo thẻ mặt sau của bộ định tuyến",
		
		re_enter:"Vui lòng nhập lại！",
		full_duplex:"Duplex đầy đủ",
		half_duplex:" Nửa song công",
		log_null2:"Hiện tại không có mục nhập nhật ký",
		item_null:"Danh sách mục trống",
		confirm_del_log:"Xác định làm trống thông tin nhật ký？",
		relink:"Ngắt kết nối lưới nặng",
		auto: "Tự động",
		channel:"Kênh",
		ip:"IP",
		mac:"MAC",
		//验证函数中的错误提示
		range:"Phạm vi",
		need_data:"Vui lòng nhập dữ liệu",
		exceed_max:"Vượt quá chiều dài tối đa, đã được cắt ngắn tự động",
		exceed_max_store:"Vượt quá chiều dài tối đa",
		comfirm_pwd:"Vui lòng nhập mật khẩu xác nhận",
		pwd_differ:"Hai lần mật khẩu không phù hợp",
		non_null_integer:"Vui lòng nhập lại một số nguyên không rỗng",
		non_numeric_char:"Không thể chứa các ký tự không phải là số",
		non_null_decimal:"Vui lòng nhập lại một số thập phân không rỗng",
		non_decimal_char:"Không thể chứa các ký tự khác ngoài số và dấu thập phân",
		digital_format_incorrect:"Không thể chứa các ký tự khác ngoài số và dấu thập phân",
		non_null_string:"Vui lòng nhập lại chuỗi không rỗng",
		not_illegal_char:"Không thể chứa ký tự bất hợp pháp",
		illegal_char:"Ký tự không hợp lệ",
		and:"Và",
		blank:"Khoảng trắng",
		char_not_null:"Vui lòng nhập lại chuỗi không rỗng!",
		non_alphanumeric_char:"Không thể chứa các ký tự khác ngoài chữ và số",
		char_not_illegal:"Không thể chứa ký tự bất hợp pháp",
		cannot_contain_chinese:"Không thể chứa Trung Quốc",
		char_not_chinese:"Không thể chứa các ký tự không phải tiếng Anh",
		domain_name_title:"Vui lòng nhập tên miền chính xác!",
		correct_input_ipv6Ip:"Vui lòng nhập đúng địa chỉ ipv6",
		correct_input_ipv6Ip_endNumber:"Số không hợp lệ. Vui lòng nhập thêm một cái nữa.（1-128）",
		state_connecting:"Kết nối...",
		state_connect_success:"Kết nối WI-FI thành công cũng có thể truy cập internet",
		state_connect_success_1:"Kết nối thành công",
		state_connect_success_2:"WI-FI đã kết nối thành công nhưng chưa thể truy cập Internet",
		state_connect_err:"Lỗi cấu hình",
		state_connect_err_2:"Ứng dụng WISP thất bại",
		state_connect_failed:"Lỗi kết nối",
		pwd_not_empty:"Mật khẩu không được để trống",
    	not_enc:"Không mã hóa",
		enc:"Mã hóa",
		linked:"Đã kết nối",
		not_linked:"Chưa kết nối",
		
		restore_set:"Giữ thiết lập",
		change_pwd:"Thay đổi mật khẩu",
		admin_pwd_not_empty:"Mật khẩu quản trị không được để trống",
		not_chinese:"Không thể chứa các ký tự không phải tiếng Anh",
		server_addr_not_null:"Địa chỉ máy chủ không được để trống",
		not_null:"Không thể để trống",
		
		before_range:"Không có",
		after_range:"Trong phạm vi, vui lòng nhập lại",
		ip_invalid_format:"Định dạng địa chỉ IP sai",
		
        ip_not_null:"Địa chỉ IP không được để trống",
        ip_val_not_null:"Giá trị IP không thể rỗng",
        ip_range:"Giá trị IP chỉ có thể từ 0-255",
        ip_num:"Địa chỉ IP chỉ chấp nhận số",
        ip_broadcast_addr:"Địa chỉ IP không thể là địa chỉ broadcast",
        ip_network_addr:"Địa chỉ IP không thể là địa chỉ mạng",
		ip_must_be_network_addr:"Địa chỉ IP phải là địa chỉ mạng",
        start_end_ip_err:"IP bắt đầu lớn hơn IP kết thúc",
		ip_incorrect_len:"Độ dài IP không chính xác", 
        ip_reserve_addr:"Địa chỉ IP là địa chỉ dành riêng",
		not_loopback_addr:"IP không thể là địa chỉ loop",
		not_multicast_addr:"IP không thể là địa chỉ multicast",
        not_lan_ip_addr:"Địa chỉ IP không thể giống với địa chỉ router",
        not_lan_mask_addr:"Địa chỉ IP không thể là địa chỉ mặt nạ",
		firsr_section_not_zero:"IP đầu tiên không thể bằng 0",
        four_section_not_zero:"IP bit thứ tư không thể bằng 0",
		ip_getway_not_same:"Địa chỉ IP không thể giống với cổng mặc định",
		ip_default_getway_in_same_segment:"Địa chỉ IP phải nằm trong cùng một phân đoạn với cổng mặc định",
		out_ip_in_ip_same_segment:"IP mạng ngoài không thể ở cùng một đoạn với IP mạng trong",
		in_ip_out_ip_same_segment:"IP mạng nội bộ không thể ở cùng một đoạn với IP mạng bên ngoài",
		ip_address_already_exists:"Địa chỉ IP này đã tồn tại",
		mac_address_already_exists:"Mac đã tồn tại",

        getway_not_null:"Cổng mặc định không thể để trống",
        getway_val_not_null:"Cổng mặc định không thể để trống",
        getway_range:"Cổng mặc định chỉ có thể từ 0-255",
        getway_num:"Cổng mặc định chỉ chấp nhận số",
        getway_broadcast_addr:"Cổng mặc định không thể là địa chỉ broadcast",
        getway_network_addr:"Cổng mặc định không thể là địa chỉ phân đoạn",
        getway_incorrect_len:"Độ dài cổng mặc định không chính xác",
        getway_reserve_addr:"Cổng mặc định là địa chỉ dành riêng",
        getway_not_loopback_addr:"Cổng mặc định không thể là địa chỉ vòng lặp",
        getway_not_multicast_addr:"Cổng mặc định không thể là địa chỉ multicast",
        not_lan_getway_addr:"Cổng mặc định không thể giống với địa chỉ router",
        getway_not_lan_mask_addr:"Cổng mặc định không thể là địa chỉ mặt nạ",
        getway_firsr_section_not_zero:"Cổng mặc định bit đầu tiên không thể là 0",
        getway_four_section_not_zero:"Cổng mặc định bit thứ tư không thể là 0",
		dhcp_pool_err:"Thiết lập pool địa chỉ sai",
		dhcp_pool_contain_gateway:"Phạm vi pool địa chỉ chứa địa chỉ IP giao diện, vui lòng sửa đổi phạm vi pool địa chỉ",

		dns_not_null:"DNS không thể để trống",
		dns_format_incorrect:"Định dạng DNS không chính xác",
		port_not_null:"Port không được để trống",
		port_non_numeric_char:"Cổng không thể chứa các ký tự không phải là số",
		port_range:"Cổng không được lớn hơn 65535 hoặc nhỏ hơn 1",
		mask_err:"Lỗi nhập khẩu mặt nạ mạng con",
		mask_format_err:"Subnet mask không phù hợp với đặc điểm kỹ thuật",
		mask_first_not_zero:"Subnet mask bit đầu tiên không thể là 0",
		mac_err:"Địa chỉ MAC sai",
		mac_not:"Địa chỉ MAC không được đầy đủ",
        mac_broadcast_addr:"Địa chỉ MAC không thể là địa chỉ multicast",
		mtu_1500_576:"Giá trị MTU không được lớn hơn 1500 hoặc nhỏ hơn 576",
		mtu_1492_576:"Giá trị MTU không được lớn hơn 1492 hoặc nhỏ hơn 576",
		mtu_1440_576:"Giá trị MTU không được lớn hơn 1440 hoặc nhỏ hơn 576",
		mtu_1480_576:"Giá trị MTU không được lớn hơn 1480 hoặc nhỏ hơn 576",
		mtu_1460_576:"Giá trị MTU không được lớn hơn 1460 hoặc nhỏ hơn 576",
		mtu_1400_576:"Giá trị MTU không được lớn hơn 1400 hoặc nhỏ hơn 576",
		pppoe_out_time_range:"Thời gian chờ nên từ 1 đến 30",
		fragment_out_range:"Ngưỡng sharding dao động từ 256 đến 2346",
		RTSThreshold_out_range:"Ngưỡng RTS dao động từ 256 đến 2347",
		year_range:"Khoảng thời gian từ 2008 đến 2037",
		month_range:"Phạm vi tháng 1-12",
		day_range:"Phạm vi ngày là 1 -",
		hour_range:"Phạm vi giờ 0-23",
		minute_range:"Phạm vi phút 0-59",
		second_range:"Phạm vi giây 0-59",
		domain_name_incorrect:"Vui lòng nhập tên miền chính xác",
		
		//消息框错误
		saveMsg:"Đang lưu tham số, vui lòng đợi...",
		sucMsg:"Thiết lập thành công",
		errMsg:"Thiết lập thất bại",
		waitMsg:"Chờ chút.",
		updateMsg:"Lỗi nâng cấp tập tin",
		exceptionMsg:"Lỗi ngoại lệ",
		msgInfo:"Thông báo",
		calendar_not_null:"Ngày không được để trống",
		calendar_format_err:"Định dạng ngày không chính xác",
		year_err:"Năm nhập không đúng",
		month_err:"Nhập tháng không chính xác",
		day_err:"Nhập ngày không chính xác",
		url_not_null:"Vui lòng nhập lại địa chỉ web không trống",
		url_err:"Địa chỉ web không đúng",
		eq_5:"Vui lòng nhập 5 ký tự",
		eq4_20:"Vui lòng nhập (4-20) ký tự",
		eq6_20:"Vui lòng nhập (6-20) ký tự",
		eq8_63:"Vui lòng nhập (8-63) ký tự",
		eq8_30:"Vui lòng nhập (8-30) ký tự",
		eq8_31:"Vui lòng nhập (8-31) ký tự",
		eq8_32:"Vui lòng nhập (8-32) ký tự",
		eq8_63:"Vui lòng nhập (8-63) ký tự",
		eq8_64:"Vui lòng nhập (8-64) ký tự",
			number0_32:"Vui lòng nhập số giữa (0-32)",
		number7_65:"Vui lòng nhập số giữa (7-64)",
		number7_128:"Vui lòng nhập số giữa (7-128)",
		number0_100:"Vui lòng nhập số giữa (0-100)",
		pwd_low:"Yếu",
		pwd_medium:"Giữa",
		pwd_strong:"Mạnh mẽ",
		excellent:"Ưu",
		good:"Lương",
		bad:"Xấu",
		very_bad:"Cực tệ",
		
		sim_card_not_inserted:"Không chèn thẻ SIM",
		sim_card_inserted:"Kích hoạt thẻ SIM",
		inserted:"Chèn",
		not_inserted:"Chưa chèn",
		LTE_STATE_NO:"SIM chưa sẵn sàng",
		LTE_STATE_OK:"Sẵn sàng",
		LTE_STATE_PIN:"Vui lòng nhập mã PIN (số lần còn lại hiện tại:% d) Số lần",
		LTE_STATE_PUK:"Vui lòng nhập mã PUK",
		lte_pin_err:"Mã PIN bị khóa",
		lte_pin_tip:"Vui lòng nhập đúng mã PIN thẻ SIM",
		connected:"Đã kết nối",
		not_conected:"Chưa kết nối",
		
		
		whole_day:"Đóng cửa",
		check_one:'Vui lòng chọn ít nhất một',
		all_day:'Hàng ngày', 
		dayList:["Thứ hai","Thứ ba","Thứ Tư","Thứ năm","Thứ sáu","Thứ bảy","Chủ Nhật"],
		week:"Tuần",
		day0:"Thứ hai",
		day1:"Thứ ba",
		day2:"Thứ Tư",
		day3:"Thứ năm",
		day4:"Thứ sáu",
		day5:"Thứ bảy",
		day6:"Chủ Nhật",
		repeater_mutex_tips:"Chế độ Repeater Wireless Relay Mode đã được kích hoạt, chức năng hiện tại tạm thời không khả dụng",
		wisp_mutex_tips:"Chế độ WISP đã được kích hoạt và chức năng hiện tại tạm thời không khả dụng",
		bridge_mutex_tips:"Chế độ Bridge Mode được kích hoạt, chức năng hiện tại tạm thời không khả dụng"
	}

};



//other
//auto_fade参数:提示框是否自动消失
var message_panel =message_panel|| new Object();
message_panel = {
	save:{
		type:"wait",
		auto_fade:false,
		message:"Đang lưu các tham số, hãy đợi……"
	},
	success:{
		type:"success",
		auto_fade:true,
		message:"Thiết lập thành công"
	},
	wait:{
		type:"wait",
		auto_fade:false,
		message:"Chờ chút."
	},
	
	exception:{
		type:"error",
		auto_fade:true,
		message:"Lỗi ngoại lệ"
	},
	error:{
		type:"error",
		auto_fade:true,
		message:"Thiết lập thất bại"
	},
	
    msg_info:{
        type:"msg-info",
        auto_fade:true,
        message:"Thông báo"
    }
};

var L = language["VI"]["JS"];