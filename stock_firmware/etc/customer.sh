#!/bin/sh

ssid_prefix="netis"
LAN_MAC=$(impd readmac_lan || ifconfig eth0 | grep HWaddr | tail -c 20)
ssid_suffix=$(echo $LAN_MAC | awk -F ':' '{print $4 $5 $6}' | head -c 6)

#define default values
BH_SSID_SUFFIX=`head -c 64 /dev/urandom | md5sum | head -c 6`
CUSTOMER_2G_SSID0=$(impd 24g_ssid || echo "${ssid_prefix}-BH-$BH_SSID_SUFFIX")
CUSTOMER_2G_SSID1="${ssid_prefix}-${ssid_suffix}"
CUSTOMER_2G_SSID2="${ssid_prefix}-VIP"
CUSTOMER_5G_SSID0=$(impd 5g_ssid || echo "${ssid_prefix}-BH-$BH_SSID_SUFFIX-5G")
CUSTOMER_5G_SSID1="${ssid_prefix}-${ssid_suffix}-5G"
CUSTOMER_5G_SSID2="${ssid_prefix}-VIP-5G"

#default admin/pwd
#user:useradmin
#changeuser admin 

#timezone
CUSTOMER_TIMEZONE=`impd timezone`
[ -z "$CUSTOMER_TIMEZONE" ] && {
	CUSTOMER_TIMEZONE=-8
}

#apply default values
uci batch <<- EOF
set wificfg.2G.BandWidth="auto"
set wificfg.2G.SSID0="$CUSTOMER_2G_SSID0"
set wificfg.2G.SSID1="$CUSTOMER_2G_SSID1"
set wificfg.2G.SSID2="$CUSTOMER_2G_SSID2"
set wificfg.2G.dual_frequency_switch=0
set wificfg.5G.dual_frequency_switch=0
set wificfg.5G.BandWidth="auto"
set wificfg.5G.SSID0="$CUSTOMER_5G_SSID0"
set wificfg.5G.SSID1="$CUSTOMER_5G_SSID1"
set wificfg.5G.SSID2="$CUSTOMER_5G_SSID2"
set wificfg.5G.SSID4="${ssid_prefix}-WiFi5-5G"
set wificfg.5G.AutoChannelSkipList='52;56;60;64;100;104;108;112;116;120;124;128;132;136;140;144;149;153;157;161;165'
commit wificfg
set network.lan.ipaddr='192.168.1.254'
commit network
add_list firewall.@zone[1].masq_src=192.168.1.0/24
commit firewall
#set ap default enable
set access_control_ap.control.enable='1'
commit access_control_ap
#add web server cgi path
set uhttpd.main.alias='/cgi-bin-igd=/cgi-bin'
set uhttpd.main.disable_chunked=1
set uhttpd.main.http_keepalive=0
commit uhttpd
set auto_update.control.allow=2
commit auto_update
EOF
#close mesh
[ -f /etc/map/mapd_user.cfg ] && datconf -f /etc/map/mapd_user.cfg set MapMode 0
uci set system.@system[0].initialized=1
uci set system.@system[0].no_dnsmasq=1
uci set system.@system[0].timezone="$CUSTOMER_TIMEZONE"
uci commit system
uci set network.dev_lan.bindports=3
uci set network.dev_lan.ports=
uci add_list network.dev_lan.ports=eth1
uci add_list network.dev_lan.ports=eth0
uci set network.lan.mode=bridge
uci set network.wan1.device=@lan
uci set network.wan1.auto=1
uci commit network
ubus call network reload

