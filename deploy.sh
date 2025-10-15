#!/bin/bash

# Deploy script
set -e

name=abi-inspector

echo "Building Docker image..."
sudo docker build -t $name:latest .

echo "Stopping existing $name container..."
docker stop $name || true

echo "Removing existing $name container..."
docker rm $name || true

echo "Starting new $name container..."
docker run -d \
  --name $name \
  -p 3000:3000 \
  --restart unless-stopped \
  $name:latest

echo "Deployment completed successfully!"
echo "Container is running on port 3000"