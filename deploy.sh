#!/bin/bash

# Production Deployment Script for Social SaaS
set -e

echo "🚀 Starting production deployment..."

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo "❌ Error: .env.production file not found!"
    echo "Please copy env.production.example to .env.production and fill in your values"
    exit 1
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker is not running!"
    exit 1
fi

# Build the application
echo "📦 Building application..."
docker-compose build --no-cache

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Start the application
echo "🚀 Starting application..."
docker-compose up -d

# Wait for application to be ready
echo "⏳ Waiting for application to be ready..."
sleep 30

# Health check
echo "🏥 Performing health check..."
if curl -f http://localhost/health > /dev/null 2>&1; then
    echo "✅ Application is healthy!"
else
    echo "❌ Health check failed!"
    echo "Checking logs..."
    docker-compose logs app
    exit 1
fi

echo "🎉 Deployment completed successfully!"
echo "🌐 Application is running at: http://localhost"
echo "📊 Health check: http://localhost/health" 