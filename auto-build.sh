#!/bin/bash
set -euo pipefail

# Configuration
BUILD_DIR="/home/builder/immortalwrt-build"
PROJECT_DIR="/home/builder/project"
IMMORTALWRT_REPO="https://github.com/immortalwrt/immortalwrt.git"
BRANCH="openwrt-24.10"

echo "=== STARTING AUTO BUILD PROCESS ==="

# 1. Clone ImmortalWrt if it doesn't exist
if [ ! -d "$BUILD_DIR" ]; then
    echo "Cloning ImmortalWrt ($BRANCH)..."
    git clone -b "$BRANCH" --depth 1 "$IMMORTALWRT_REPO" "$BUILD_DIR"
else
    echo "Using existing build directory at $BUILD_DIR"
fi

# 2. Install the port
echo "Installing EAP930 port files..."
bash "$PROJECT_DIR/openwrt_port/install_port.sh" "$BUILD_DIR"

cd "$BUILD_DIR"

# 3. Feeds
echo "Updating and installing feeds..."
./scripts/feeds update -a
./scripts/feeds install -a

# 4. Configuration
echo "Applying seed.config..."
cp "$PROJECT_DIR/openwrt_port/seed.config" .config
make defconfig

# 5. Build
echo "Starting compilation (this will take a while)..."
# We use V=s to see if anything goes wrong, but you can remove it for cleaner output
make -j$(nproc) V=s || {
    echo "Build failed. Check the logs above."
    exit 1
}

echo "=== BUILD COMPLETE! ==="
echo "Your firmware images are located in $BUILD_DIR/bin/targets/mediatek/filogic/"

# Safety measure to prevent container from exiting and being removed due to --rm flag
echo "CONTAINER IS STAYING ALIVE. Access it using: docker exec -it eap930-build-container bash"
sleep infinity
