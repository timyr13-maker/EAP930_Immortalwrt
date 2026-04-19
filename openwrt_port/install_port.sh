#!/bin/bash

# Netis EAP930 Port Installation Script for OpenWrt (ImmortalWrt)
# Version 1.2 - Audit Fix Edition

set -euo pipefail

GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

DRY_RUN=0
MODE="ap"
OPENWRT_DIR=""

for arg in "$@"; do
    case "$arg" in
        --dry-run)
            DRY_RUN=1
            ;;
        --mode=*)
            MODE="${arg#*=}"
            if [[ "$MODE" != "ap" && "$MODE" != "router" ]]; then
                echo -e "${RED}Error: Invalid mode: $MODE. Use 'ap' or 'router'.${NC}"
                exit 1
            fi
            ;;
        -*)
            echo -e "${RED}Error: Unknown option: $arg${NC}"
            echo "Usage: $0 [--dry-run] [--mode=ap|router] /home/user/openwrt-build"
            exit 1
            ;;
        *)
            if [ -z "$OPENWRT_DIR" ]; then
                OPENWRT_DIR="$arg"
            else
                echo -e "${RED}Error: Multiple OpenWrt directories provided.${NC}"
                echo "Usage: $0 [--dry-run] /home/user/openwrt-build"
                exit 1
            fi
            ;;
    esac
done

if [ -z "$OPENWRT_DIR" ]; then
    echo -e "${RED}Error: Please specify the path to OpenWrt source directory.${NC}"
    echo "Usage: $0 [--dry-run] [--mode=ap|router] /home/user/openwrt-build"
    exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ ! -d "$OPENWRT_DIR" ]; then
    echo -e "${RED}Error: Directory $OPENWRT_DIR does not exist.${NC}"
    exit 1
fi

echo -e "${GREEN}Synchronizing port files to $OPENWRT_DIR...${NC}"
if [ "$DRY_RUN" -eq 1 ]; then
    echo -e "${GREEN}Dry-run mode: no files will be modified.${NC}"
fi

sync_file() {
    local src="$1"
    local dst="$2"
    local mode="${3:-644}"

    if [ -f "$dst" ] && cmp -s "$src" "$dst"; then
        echo "Unchanged: $dst"
    else
        if [ "$DRY_RUN" -eq 1 ]; then
            echo "Would update: $dst"
        else
            install -D -m "$mode" "$src" "$dst"
            echo "Updated:      $dst"
        fi
    fi
}

# 1. Device Tree
sync_file \
    "$SCRIPT_DIR/target/linux/mediatek/dts/mt7981b-netis-eap930.dts" \
    "$OPENWRT_DIR/target/linux/mediatek/dts/mt7981b-netis-eap930.dts"

# 2. Image Makefile
sync_file \
    "$SCRIPT_DIR/target/linux/mediatek/image/netis_eap930.mk" \
    "$OPENWRT_DIR/target/linux/mediatek/image/netis_eap930.mk"

# 3. Include netis_eap930.mk in filogic.mk
FILOGIC_MK="$OPENWRT_DIR/target/linux/mediatek/image/filogic.mk"
INCLUDE_CMD='include $(dir $(lastword $(MAKEFILE_LIST)))/netis_eap930.mk'
if [ -f "$FILOGIC_MK" ]; then
    if ! grep -q "netis_eap930.mk" "$FILOGIC_MK"; then
        if [ "$DRY_RUN" -eq 1 ]; then
            echo "Would append include to: $FILOGIC_MK"
        else
            echo "$INCLUDE_CMD" >> "$FILOGIC_MK"
            echo "Added profile include to filogic.mk"
        fi
    fi
else
    echo -e "${RED}Warning: filogic.mk not found at $FILOGIC_MK. Manual include required.${NC}"
fi

# 4. Base-files (board.d)
BOARD_D_DIR="$OPENWRT_DIR/target/linux/mediatek/filogic/base-files/etc/board.d"
sync_file "$SCRIPT_DIR/base-files/etc/board.d/01_leds" "$BOARD_D_DIR/01_leds" 755
sync_file "$SCRIPT_DIR/base-files/etc/board.d/02_network" "$BOARD_D_DIR/02_network" 755

# 5. UCI Defaults
UCI_DEFAULTS_DIR="$OPENWRT_DIR/target/linux/mediatek/filogic/base-files/etc/uci-defaults"
sync_file "$SCRIPT_DIR/base-files/etc/uci-defaults/99-netis-eap930" "$UCI_DEFAULTS_DIR/99-netis-eap930" 755

if [ "$MODE" = "ap" ]; then
    sync_file "$SCRIPT_DIR/base-files/etc/uci-defaults/99-dumb-ap" "$UCI_DEFAULTS_DIR/99-dumb-ap" 755
else
    # In router mode, ensure 99-dumb-ap is NOT present
    if [ -f "$UCI_DEFAULTS_DIR/99-dumb-ap" ]; then
        if [ "$DRY_RUN" -eq 1 ]; then
            echo "Would remove: $UCI_DEFAULTS_DIR/99-dumb-ap"
        else
            rm -f "$UCI_DEFAULTS_DIR/99-dumb-ap"
            echo "Removed:      $UCI_DEFAULTS_DIR/99-dumb-ap (switching to router mode)"
        fi
    fi
fi

echo -e "${GREEN}SYNCHRONIZATION COMPLETE!${NC}"
echo "Files have been successfully installed into the target tree."
