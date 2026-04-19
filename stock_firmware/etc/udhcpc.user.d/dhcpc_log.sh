#!/bin/sh
case $1 in
	discover|request|renew_request|decline|release)
		ubus call dial_up_log add_log "{\"type\":\"dhcp\",\"sub_type\":\"$1\",\"dir\":\"out\"}"
		;;
	offer|nak)
		ubus call dial_up_log add_log "{\"type\":\"dhcp\",\"sub_type\":\"$1\",\"dir\":\"in\"}"
		;;
	bound|renew)
		ubus call dial_up_log add_log "{\"type\":\"dhcp\",\"sub_type\":\"$1\",\"dir\":\"in\",\"info\":{\"ipaddr\":\"$ip\",\"lease_time\":$lease}}"
		;;
	*)
		exit 0
		;;
esac
