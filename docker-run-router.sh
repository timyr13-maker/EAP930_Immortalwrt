#!/bin/bash
# Запуск сборки "Нормального роутера" (Normal Router)
# Режим: Статический IP 192.168.1.1, свой DHCP-сервер включен.

bash "$(dirname "$0")/docker-run.sh" auto router
