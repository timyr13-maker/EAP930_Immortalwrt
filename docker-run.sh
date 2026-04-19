#!/bin/bash

# Configuration
IMAGE_NAME="eap930-build"
CONTAINER_NAME="eap930-build-container"
PROJECT_DIR="$(pwd)"

# Build the image if it doesn't exist
if [[ "$(docker images -q $IMAGE_NAME 2> /dev/null)" == "" ]]; then
    echo "Building Docker image $IMAGE_NAME..."
    docker build -t "$IMAGE_NAME" .
fi

echo "Starting build container..."
echo "Your project files are mounted at /home/builder/project"
echo "To build: clone immortalwrt inside the container, then run project/openwrt_port/install_port.sh"

# Run the container
# -it: interactive and tty
# --rm: remove container after exit
# -v: mount current directory
# -w: set working directory inside container
docker run -it --rm \
    --name "$CONTAINER_NAME" \
    -v "$PROJECT_DIR:/home/builder/project" \
    -w /home/builder \
    "$IMAGE_NAME"
