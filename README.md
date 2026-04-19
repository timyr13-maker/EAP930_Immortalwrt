# Netis EAP930 OpenWrt Project

This repository contains the original stock firmware files and a modernized OpenWrt (ImmortalWrt) port for the Netis EAP930 access point.

## Repository Structure

-   `stock_firmware/`: Files extracted from the original Netis firmware (Mediatek SDK based on OpenWrt 21.02). Useful for reverse-engineering and comparing configurations.
-   `openwrt_port/`: Consolidated port files for ImmortalWrt 24.10.
    -   `target/linux/mediatek/`: DTS and Image Makefile.
    -   `base-files/etc/`: Board-specific scripts (LEDs, network, system).
    -   `seed.config`: Minimal configuration seed for `make defconfig`.
    -   `install_port.sh`: Script to synchronize these files with a clean ImmortalWrt tree.

## How to Build

1.  Clone ImmortalWrt 24.10:
    ```bash
    git clone -b openwrt-24.10 --depth 1 https://github.com/immortalwrt/immortalwrt.git openwrt-build
    ```
2.  Install the port:
    ```bash
    bash openwrt_port/install_port.sh $(pwd)/openwrt-build
    ```
3.  Configure and build:
    ```bash
    cd openwrt-build
    # Seed the configuration
    cp ../openwrt_port/seed.config .config
    make defconfig
    # Build
    make -j$(nproc) V=s
    ```

## Status

-   **Model**: Netis EAP930 (MT7981B)
-   **Firmware**: ImmortalWrt 24.10
-   **Wi-Fi**: Supported via `kmod-mt7915e`
-   **LAN/WAN**: Configured via 02_network

## Testing Status
- [ ] Boots to OpenWrt shell
- [ ] Wi-Fi 2.4 GHz functional
- [ ] Wi-Fi 5 GHz functional
- [ ] LAN (PoE) functional
- [ ] Reset button functional
- [ ] LED indicators functional
- [ ] sysupgrade tested
