#!/bin/bash

# Script để chạy Docker Compose cho development
echo "🐳 Starting P2A Core System with Docker Compose..."

# Stop existing containers
echo "⏹️  Stopping existing containers..."
docker-compose down

# Start containers
echo "▶️  Starting containers..."
docker-compose up -d

# Show logs
echo "📋 Showing logs (Ctrl+C to exit)..."
docker-compose logs -f

