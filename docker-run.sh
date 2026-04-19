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

# Determine command to run inside container
# Default is bash (interactive), but if "auto" is passed, run auto-build.sh
CONTAINER_CMD="/bin/bash"
if [ "${1:-}" == "auto" ]; then
    echo "Running in AUTOMATED build mode."
    CONTAINER_CMD="bash /home/builder/project/auto-build.sh"
else
    echo "Running in INTERACTIVE mode."
    echo "Project files are mounted at /home/builder/project"
fi

# Run the container
# -it: interactive and tty
# --name: set container name
# -v: mount project and build directory for persistence
# -w: set working directory inside container
mkdir -p "$PROJECT_DIR/immortalwrt-build"

docker run -it \
    --name "$CONTAINER_NAME" \
    -v "$PROJECT_DIR:/home/builder/project" \
    -v "$PROJECT_DIR/immortalwrt-build:/home/builder/immortalwrt-build" \
    -w /home/builder \
    "$IMAGE_NAME" \
    $CONTAINER_CMD
