#!/bin/bash
# Запуск сборки "Тупой точки доступа" (Dumb AP)
# Режим: DHCP-клиент, мост Wi-Fi, свой DHCP выключен.

bash "$(dirname "$0")/docker-run.sh" auto ap
