#!/bin/bash

# Netis EAP930 Port Installation Script for OpenWrt (ImmortalWrt)
# Version 1.2 - Audit Fix Edition

set -euo pipefail

GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

if [ -z "$1" ]; then
    echo -e "${RED}Error: Please specify the path to OpenWrt source directory.${NC}"
    echo "Usage: $0 /home/user/openwrt-build"
    exit 1
fi

OPENWRT_DIR=$1
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ ! -d "$OPENWRT_DIR" ]; then
    echo -e "${RED}Error: Directory $OPENWRT_DIR does not exist.${NC}"
    exit 1
fi

echo -e "${GREEN}Synchronizing port files to $OPENWRT_DIR...${NC}"

# 1. Device Tree
mkdir -p "$OPENWRT_DIR/target/linux/mediatek/dts"
cp -vp "$SCRIPT_DIR/target/linux/mediatek/dts/mt7981b-netis-eap930.dts" "$OPENWRT_DIR/target/linux/mediatek/dts/"

# 2. Image Makefile
mkdir -p "$OPENWRT_DIR/target/linux/mediatek/image"
cp -vp "$SCRIPT_DIR/target/linux/mediatek/image/netis_eap930.mk" "$OPENWRT_DIR/target/linux/mediatek/image/"

# 3. Include netis_eap930.mk in filogic.mk
FILOGIC_MK="$OPENWRT_DIR/target/linux/mediatek/image/filogic.mk"
INCLUDE_CMD='include $(dir $(lastword $(MAKEFILE_LIST)))/netis_eap930.mk'
if [ -f "$FILOGIC_MK" ]; then
    if ! grep -q "netis_eap930.mk" "$FILOGIC_MK"; then
        echo "$INCLUDE_CMD" >> "$FILOGIC_MK"
        echo "Added profile include to filogic.mk"
    fi
else
    echo -e "${RED}Warning: filogic.mk not found at $FILOGIC_MK. Manual include required.${NC}"
fi

# 4. Base-files (board.d)
BOARD_D_DIR="$OPENWRT_DIR/target/linux/mediatek/filogic/base-files/etc/board.d"
mkdir -p "$BOARD_D_DIR"
cp -vp "$SCRIPT_DIR/base-files/etc/board.d/01_leds" "$BOARD_D_DIR/"
cp -vp "$SCRIPT_DIR/base-files/etc/board.d/02_network" "$BOARD_D_DIR/"
chmod 755 "$BOARD_D_DIR/01_leds" "$BOARD_D_DIR/02_network"

# 5. UCI Defaults
UCI_DEFAULTS_DIR="$OPENWRT_DIR/target/linux/mediatek/filogic/base-files/etc/uci-defaults"
mkdir -p "$UCI_DEFAULTS_DIR"
cp -vp "$SCRIPT_DIR/base-files/etc/uci-defaults/99-netis-eap930" "$UCI_DEFAULTS_DIR/"
cp -vp "$SCRIPT_DIR/base-files/etc/uci-defaults/99-dumb-ap" "$UCI_DEFAULTS_DIR/"
chmod 755 "$UCI_DEFAULTS_DIR/99-netis-eap930" "$UCI_DEFAULTS_DIR/99-dumb-ap"

echo -e "${GREEN}SYNCHRONIZATION COMPLETE!${NC}"
echo "Files have been successfully installed into the target tree."
