define Device/netis_eap930
  DEVICE_VENDOR := Netis
  DEVICE_MODEL := EAP930
  DEVICE_DTS := mt7981-netis-eap930
  DEVICE_DTS_LOADADDR := 0x47000000

  SUPPORTED_DEVICES += mt7981-spim-nand-rfb-pcb7605-1G

  DEVICE_PACKAGES := kmod-mt7915e kmod-mt7981-firmware mt7981-wo-firmware \
                     kmod-leds-gpio kmod-gpio-button-hotplug

  BLOCKSIZE := 128k
  PAGESIZE := 2048
  KERNEL_IN_UBI := 1
  UBINIZE_OPTS := -E 5

  IMAGE_SIZE := 115200k

  IMAGES += sysupgrade.bin factory.bin
  IMAGE/sysupgrade.bin := sysupgrade-tar | append-metadata
  IMAGE/factory.bin := append-kernel | pad-to $$$$(BLOCKSIZE) | append-ubi

  DEVICE_COMPAT_VERSION := 1.0
endef

TARGET_DEVICES += netis_eap930

$(eval $(call Device,netis_eap930))
